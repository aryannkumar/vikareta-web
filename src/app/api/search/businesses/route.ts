import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const limit = searchParams.get('limit') || '10';

  const cookieHeader = req.headers.get('cookie') || '';

  try {
    const resp = await fetch(`${apiBase}/api/v1/businesses/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
    });

    const dataText = await resp.text();
    const data = dataText ? (() => { try { return JSON.parse(dataText); } catch { return { message: dataText }; } })() : {};
    const res = NextResponse.json(data, { status: resp.status });

    // Forward Set-Cookie headers from backend if present
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
  } catch (error) {
    console.error('Businesses search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search businesses' },
      { status: 500 }
    );
  }
}