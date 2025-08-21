/**
 * Secure Cross-Domain Authentication - HttpOnly Cookie Based
 * No localStorage usage for maximum security
 */

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  userType?: string;
  verificationTier?: string;
  isVerified?: boolean;
  phone?: string;
  gstin?: string;
  createdAt: string;
}

const MAIN_HOST = process?.env?.NEXT_PUBLIC_MAIN_HOST || 'vikareta.com';
const DASHBOARD_HOST = process?.env?.NEXT_PUBLIC_DASHBOARD_HOST || 'dashboard.vikareta.com';
const ADMIN_HOST = process?.env?.NEXT_PUBLIC_ADMIN_HOST || 'admin.vikareta.com';
const API_HOST = process?.env?.NEXT_PUBLIC_API_HOST || 'api.vikareta.com';

/**
 * Get current domain type
 */
export function getCurrentDomain(): 'main' | 'dashboard' | 'admin' {
  if (typeof window === 'undefined') return 'main';
  
  const hostname = window.location.hostname;
  if (hostname.includes('dashboard')) return 'dashboard';
  if (hostname.includes('admin')) return 'admin';
  return 'main';
}

/**
 * Navigate to login page with return URL stored in URL parameter
 */
export function navigateToLogin(): void {
  if (typeof window === 'undefined') return;
  
  const currentUrl = encodeURIComponent(window.location.href);
  
  // Use URL parameter instead of localStorage for return URL
  const loginUrl = `/login?returnUrl=${currentUrl}`;
  window.location.href = loginUrl;
}

/**
 * Handle post-login redirect using URL parameter
 */
export function handlePostLoginRedirect(searchParams?: URLSearchParams): void {
  if (typeof window === 'undefined') return;
  
  // Get return URL from URL parameter instead of localStorage
  const returnUrl = searchParams?.get('returnUrl');
  
  if (returnUrl) {
    try {
      const decodedUrl = decodeURIComponent(returnUrl);
      // Validate the return URL is from same origin for security
      const url = new URL(decodedUrl);
      const allowedHosts = [MAIN_HOST, DASHBOARD_HOST, ADMIN_HOST];
      
      if (allowedHosts.includes(url.hostname)) {
        window.location.href = decodedUrl;
        return;
      }
    } catch {
      // Invalid URL, fall through to default redirect
    }
  }
  
  // Default redirects based on domain
  const currentDomain = getCurrentDomain();
  if (currentDomain === 'admin') {
    window.location.href = '/dashboard';
  } else if (currentDomain === 'dashboard') {
    window.location.href = '/dashboard';
  } else {
    window.location.href = '/';
  }
}

/**
 * Secure SSO sync using signed JWT tokens and HttpOnly cookies
 * No localStorage involved
 */
export async function syncSSOToSubdomains(targets?: string[]): Promise<void> {
  if (typeof window === 'undefined') return;

  const originSSOEndpoint = '/api/auth/sso-token';

  // Determine targets
  if (!targets || targets.length === 0) {
    const configured = process.env.NEXT_PUBLIC_SSO_TARGETS;
    const adminStandalone = process.env.NEXT_PUBLIC_ADMIN_STANDALONE === 'true';
    
    if (configured) {
      targets = configured.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      targets = [DASHBOARD_HOST, API_HOST];
    }

    if (adminStandalone) {
      targets = targets.filter(t => t !== ADMIN_HOST);
    }
  }

  const syncPromises: Promise<void>[] = [];

  for (const host of targets) {
    const p = (async () => {
      try {
        // Request signed SSO token from backend
  const resp = await fetch(originSSOEndpoint, {
          method: 'POST',
          credentials: 'include', // Send HttpOnly cookies for authentication
          headers: { 
            'Content-Type': 'application/json',
            // Add CSRF token if available
            ...(getCSRFToken() && { 'X-XSRF-TOKEN': getCSRFToken()! })
          },
          body: JSON.stringify({ target: host }),
        });

        if (!resp.ok) return;
        
        const data = await resp.json();
        const token = data?.token;
        if (!token) return;

        // Use invisible iframe to set HttpOnly cookie on target domain
        await new Promise<void>((resolve) => {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = `https://${host}/sso/receive?token=${encodeURIComponent(token)}`;

          const cleanup = () => {
            try { 
              window.removeEventListener('message', onMessage); 
            } catch {}
            try { 
              if (iframe.parentNode) iframe.parentNode.removeChild(iframe); 
            } catch {}
            resolve();
          };

          const onMessage = (e: MessageEvent) => {
            // Verify message origin for security
            if (e.origin === `https://${host}` && e.data?.sso === 'ok') {
              cleanup();
            }
          };

          window.addEventListener('message', onMessage);
          document.body.appendChild(iframe);

          // Safety timeout
          setTimeout(() => cleanup(), 5000);
        });
      } catch {
        // Silent fail for SSO sync
      }
    })();

    syncPromises.push(p);
  }

  await Promise.all(syncPromises);
}

/**
 * Get CSRF token from cookie
 */
function getCSRFToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith('XSRF-TOKEN=')
  );
  
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split('=')[1]);
  }
  
  return null;
}

/**
 * Check if user has access to admin panel
 */
export function hasAdminAccess(user: User): boolean {
  return user.userType === 'admin' || user.userType === 'super_admin';
}

/**
 * Check if user has access to dashboard
 */
export function hasDashboardAccess(user: User): boolean {
  return user.userType === 'seller' || user.userType === 'both' || hasAdminAccess(user);
}

/**
 * Get appropriate redirect URL after login based on user type
 */
export function getPostLoginRedirectUrl(user: User): string {
  if (hasAdminAccess(user)) {
    return `https://${ADMIN_HOST}/dashboard`;
  } else if (hasDashboardAccess(user)) {
    return `https://${DASHBOARD_HOST}/dashboard`;
  } else {
    return `https://${MAIN_HOST}/`;
  }
}

/**
 * Secure logout across all domains
 */
export async function logoutFromAllDomains(): Promise<void> {
  if (typeof window === 'undefined') return;

  const backend = process.env.NEXT_PUBLIC_API_BASE || 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');

  try {
    // Call backend logout endpoint which clears HttpOnly cookies
    await fetch(`${backend}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(getCSRFToken() && { 'X-XSRF-TOKEN': getCSRFToken()! })
      },
    });
  } catch {
    // Silent fail
  }

  // Redirect to login
  window.location.href = '/login';
}