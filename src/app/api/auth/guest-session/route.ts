import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');

    // Forward cookies and CSRF header to backend
    const cookieHeader = req.headers.get('cookie') || '';
    const csrfHeader = req.headers.get('x-xsrf-token');

    const resp = await fetch(`${apiBase}/api/v1/auth/guest-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...(csrfHeader ? { 'X-XSRF-TOKEN': csrfHeader } : {}),
      },
      // credentials is ignored in node fetch, cookies are sent via header above
      body: JSON.stringify({}),
    });

    const text = await resp.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (!resp.ok) {
      return NextResponse.json(data || { message: 'Failed to create guest session' }, { status: resp.status });
    }

    // Transform backend response to match expected VikaretaAuthData format
    const transformedData = {
      user: data.data?.user,
      tokens: {
        accessToken: data.data?.accessToken || '',
        refreshToken: 'guest_session_token', // Dummy token for validation - guest sessions don't refresh
        tokenType: 'Bearer' as const,
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour from now
      },
      sessionId: data.data?.user?.id,
      domain: 'main' as const
    };

    return NextResponse.json(transformedData);
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Internal error' }, { status: 500 });
  }
}