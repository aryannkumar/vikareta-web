import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return NextResponse.redirect('/login');

    const SSO_SECRET = process.env.SSO_SECRET || process.env.JWT_SECRET || 'sso-secret';

    let payload: any;
    try {
      payload = jwt.verify(token, SSO_SECRET) as any;
    } catch {
      return NextResponse.redirect('/login');
    }

    // Validate audience claim (optional)
    const expectedHost = process.env.NEXT_PUBLIC_MAIN_HOST || 'vikareta.com';
    if (payload.aud && !payload.aud.includes(expectedHost)) {
      return NextResponse.redirect('/login');
    }

    // Validate token with backend before trusting it
    const backend = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
    try {
      const validateRes = await fetch(`${backend}/auth/validate-sso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const validateJson = await validateRes.json();
      if (!validateJson?.success) {
        return NextResponse.redirect('/login');
      }
    } catch (err) {
      console.error('SSO validation call failed', err);
      return NextResponse.redirect('/login');
    }

    // Set HttpOnly cookie on this domain
    const cookieValue = token;
    const domainPart = process.env.NODE_ENV === 'production' ? '; Domain=.vikareta.com' : '';
    const securePart = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const cookie = `access_token=${cookieValue}; Path=/; HttpOnly; SameSite=None; Max-Age=${60 * 60}${domainPart}${securePart}`;

    // Return HTML that notifies parent window of SSO completion
    const html = `<!doctype html>
<html><body>
<script>
  // Notify parent window that SSO completed successfully
  window.parent.postMessage({ sso: 'ok', host: location.hostname }, '*');
  document.write('SSO authentication complete');
</script>
</body></html>`;

    return new Response(html, { 
      status: 200, 
      headers: { 
        'Content-Type': 'text/html', 
        'Set-Cookie': cookie 
      } 
    });
  } catch {
    return NextResponse.redirect('/login');
  }
}