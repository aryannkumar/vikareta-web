import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');

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
    return NextResponse.json({ message: err?.message || 'Login failed' }, { status: 500 });
  }
}
