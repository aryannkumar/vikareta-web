import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');

    const cookieHeader = req.headers.get('cookie') || '';
    const csrfHeader = req.headers.get('x-xsrf-token');

    const resp = await fetch(`${apiBase}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...(csrfHeader ? { 'X-XSRF-TOKEN': csrfHeader } : {}),
      },
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
    return NextResponse.json({ message: err?.message || 'Logout failed' }, { status: 500 });
  }
}
