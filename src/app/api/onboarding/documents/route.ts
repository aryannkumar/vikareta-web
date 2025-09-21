import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
  const cookieHeader = req.headers.get('cookie') || '';

  try {
    const resp = await fetch(`${apiBase}/api/v1/onboarding/documents`, {
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
    console.error('Onboarding documents GET API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get documents' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
  const cookieHeader = req.headers.get('cookie') || '';

  try {
    const body = await req.json();

    const resp = await fetch(`${apiBase}/api/v1/onboarding/documents`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(body),
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
    console.error('Onboarding documents POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}