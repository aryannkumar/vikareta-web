import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');
  const cookieHeader = req.headers.get('cookie') || '';
  const { section } = await params;

  try {
    const body = await req.json();

    const resp = await fetch(`${apiBase}/api/v1/onboarding/business/${section}`, {
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
    console.error(`Onboarding business ${section} API error:`, error);
    return NextResponse.json(
      { success: false, error: `Failed to update business ${section}` },
      { status: 500 }
    );
  }
}