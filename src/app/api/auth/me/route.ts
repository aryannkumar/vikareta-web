import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
  const cookieHeader = req.headers.get('cookie') || '';

  const resp = await fetch(`${apiBase}/api/auth/me`, {
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
  const cookies: string[] = [];
  // Node fetch may combine or present multiple Set-Cookie headers—collect them robustly
  const single = resp.headers.get('set-cookie');
  if (single) cookies.push(single);
  // Some runtimes expose headers via for..of iteration
  for (const [key, value] of (resp.headers as any)) {
    if (key.toLowerCase() === 'set-cookie') {
      cookies.push(value);
    }
  }
  cookies.forEach((c) => res.headers.append('Set-Cookie', c));

  return res;
}
