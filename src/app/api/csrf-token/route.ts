import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
    const cookieHeader = req.headers.get('cookie') || '';

    const resp = await fetch(`${apiBase}/csrf-token`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      credentials: 'include' as any,
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
    return NextResponse.json({ success: false, error: { message: err?.message || 'Failed to get CSRF token' } }, { status: 500 });
  }
}
