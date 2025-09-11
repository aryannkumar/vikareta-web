import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');

    const body = await req.json();
  const cookieHeader = req.headers.get('cookie') || '';
  const csrfHeader = req.headers.get('x-xsrf-token') || req.headers.get('X-XSRF-TOKEN') || req.headers.get('x-csrf-token') || undefined;

    // If no CSRF token provided, try to acquire one first
    let finalCsrfToken = csrfHeader;
    if (!finalCsrfToken) {
      console.log('No CSRF token provided for send-otp, attempting to acquire one...');
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
          console.log('CSRF token acquired successfully for send-otp');
          // Extract CSRF token from response cookies
          const csrfCookie = csrfResp.headers.get('set-cookie');
          if (csrfCookie) {
            const tokenMatch = csrfCookie.match(/XSRF-TOKEN=([^;]+)/);
            if (tokenMatch) {
              finalCsrfToken = decodeURIComponent(tokenMatch[1]);
              console.log('Extracted CSRF token from cookie for send-otp');
            }
          }
        } else {
          console.log('Failed to acquire CSRF token for send-otp, proceeding without it');
        }
      } catch (csrfError) {
        console.log('CSRF acquisition failed for send-otp:', csrfError);
      }
    }

    const resp = await fetch(`${apiBase}/api/v1/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
    ...(finalCsrfToken ? { 'X-XSRF-TOKEN': finalCsrfToken } : {}),
      },
      body: JSON.stringify(body || {}),
    });

    const text = await resp.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

    const res = NextResponse.json(data, { status: resp.status });

    const rawSetCookie = resp.headers.get('set-cookie');
    if (rawSetCookie) {
      const parts = rawSetCookie.split(/,(?=\s*[A-Za-z0-9_-]+=)/g);
      parts.forEach((c) => res.headers.append('Set-Cookie', c.trim()));
    }
    try {
      for (const [key, value] of (resp.headers as any)) {
        if (String(key).toLowerCase() === 'set-cookie') {
          res.headers.append('Set-Cookie', value);
        }
      }
    } catch {}

    return res;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to send OTP' } }, { status: 500 });
  }
}
