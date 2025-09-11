import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
    console.log('Main Site Register API: Forwarding to', `${apiBase}/api/v1/auth/register`);

    let body: any = {};
    try { body = await req.json(); } catch { body = {}; }

    const cookieHeader = req.headers.get('cookie') || '';
    const csrfHeader = req.headers.get('x-xsrf-token') || req.headers.get('X-XSRF-TOKEN') || req.headers.get('x-csrf-token') || undefined;

    // If no CSRF token provided, try to acquire one first
    let finalCsrfToken = csrfHeader;
    if (!finalCsrfToken) {
      console.log('No CSRF token provided for register, attempting to acquire one...');
      try {
        const csrfResp = await fetch(`${apiBase}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(cookieHeader ? { cookie: cookieHeader } : {}),
          },
        });

        if (csrfResp.ok) {
          console.log('CSRF token acquired successfully for register');
          // Extract CSRF token from response cookies
          const csrfCookie = csrfResp.headers.get('set-cookie');
          if (csrfCookie) {
            const tokenMatch = csrfCookie.match(/XSRF-TOKEN=([^;]+)/);
            if (tokenMatch) {
              finalCsrfToken = decodeURIComponent(tokenMatch[1]);
              console.log('Extracted CSRF token from cookie for register');
            }
          }
        } else {
          console.log('Failed to acquire CSRF token for register, proceeding without it');
        }
      } catch (csrfError) {
        console.log('CSRF acquisition failed for register:', csrfError);
      }
    }

    // Build cookie header for backend, ensuring XSRF-TOKEN is present alongside any incoming cookies
    const backendCookie = finalCsrfToken
      ? `${cookieHeader || ''}${cookieHeader ? '; ' : ''}XSRF-TOKEN=${finalCsrfToken}`
      : cookieHeader;

    const resp = await fetch(`${apiBase}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(backendCookie ? { cookie: backendCookie } : {}),
        ...(finalCsrfToken ? { 'X-XSRF-TOKEN': finalCsrfToken } : {}),
      },
      body: JSON.stringify(body || {}),
    });

    const text = await resp.text();
    console.log('Main Site Register API: Backend response', {
      status: resp.status,
      ok: resp.ok,
      contentLength: text.length
    });

    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

    const res = NextResponse.json(data, { status: resp.status });

    const rawSetCookie = resp.headers.get('set-cookie');
    if (rawSetCookie) {
      // Split on comma only when a new cookie starts: comma followed by key=
      const parts = rawSetCookie.split(/,(?=\s*[A-Za-z0-9_-]+=)/g);
      parts.forEach((c) => res.headers.append('Set-Cookie', c.trim()));
    }
    // Fallback iteration for runtimes that expose multiple headers
    try {
      for (const [key, value] of (resp.headers as any)) {
        if (String(key).toLowerCase() === 'set-cookie') {
          res.headers.append('Set-Cookie', value);
        }
      }
    } catch {}

    return res;
  } catch (err: any) {
    console.error('Main Site Register API: Error occurred', err);
    return NextResponse.json({
      success: false,
      message: err?.message || 'Registration failed',
      error: { message: err?.message || 'Registration request failed' }
    }, { status: 500 });
  }
}