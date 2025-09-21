import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
  const cookieHeader = req.headers.get('cookie') || '';

  const resp = await fetch(`${apiBase}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
  });

  const dataText = await resp.text();
  const data = dataText ? (() => { try { return JSON.parse(dataText); } catch { return { message: dataText }; } })() : {};

  if (!resp.ok) {
    return NextResponse.json(data, { status: resp.status });
  }

  // Transform backend response to match expected format for SSO client
  const transformedData = {
    user: data.data?.user,
    accessToken: '', // Will be set via cookies
    refreshToken: '', // Will be set via cookies
    sessionId: data.data?.user?.id,
    subscription: data.data?.subscription
  };

  const res = NextResponse.json(transformedData, { status: resp.status });

  // Forward Set-Cookie headers from backend if present (handle combined header values)
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
}
