import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
    console.log('Main Site Login API: Forwarding to', `${apiBase}/api/auth/login`);

    let body: any = {};
    try { body = await req.json(); } catch { body = {}; }

    const cookieHeader = req.headers.get('cookie') || '';

    const resp = await fetch(`${apiBase}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(body || {}),
    });

    const text = await resp.text();
    console.log('Main Site Login API: Backend response', {
      status: resp.status,
      ok: resp.ok,
      contentLength: text.length
    });

    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

    const res = NextResponse.json(data, { status: resp.status });

    const cookies: string[] = [];
    const single = resp.headers.get('set-cookie');
    if (single) cookies.push(single);
    for (const [key, value] of (resp.headers as any)) {
      if (key.toLowerCase() === 'set-cookie') cookies.push(value);
    }
    cookies.forEach((c) => res.headers.append('Set-Cookie', c));

    return res;
  } catch (err: any) {
    console.error('Main Site Login API: Error occurred', err);
    return NextResponse.json({ 
      success: false,
      message: err?.message || 'Login failed',
      error: { message: err?.message || 'Login request failed' }
    }, { status: 500 });
  }
}
