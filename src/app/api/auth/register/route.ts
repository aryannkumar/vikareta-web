import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
    console.log('Main Site Register API: Forwarding to', `${apiBase}/api/v1/auth/register`);

    let body: any = {};
    try { body = await req.json(); } catch { body = {}; }

    const cookieHeader = req.headers.get('cookie') || '';

    const resp = await fetch(`${apiBase}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
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