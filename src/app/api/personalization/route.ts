/**
 * Vikareta Platform - Personalization API Route
 * Next.js API route for personalization endpoints
 * Proxies requests to backend personalization service
 */

import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : 'https://api.vikareta.com');

// Helper function to proxy requests to backend
async function proxyToBackend(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  request?: NextRequest
) {
  try {
    const url = `${API_BASE}/api/v1/personalization${endpoint}`;

    // Get cookies from the request
    const cookieHeader = request?.headers.get('cookie') || '';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    // Copy cookies from backend response to client
    const res = NextResponse.json(data, { status: response.status });

    const cookies: string[] = [];
    const single = response.headers.get('set-cookie');
    if (single) cookies.push(single);
    for (const [key, value] of (response.headers as any)) {
      if (key.toLowerCase() === 'set-cookie') cookies.push(value);
    }
    cookies.forEach((c) => res.headers.append('Set-Cookie', c));

    return res;
  } catch (error) {
    console.error('Personalization API proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/personalization/guest - Get guest personalization data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  switch (endpoint) {
    case 'trending-categories':
      const period = searchParams.get('period') || 'weekly';
      const limit = searchParams.get('limit') || '10';
      return proxyToBackend(`/trending-categories?period=${period}&limit=${limit}`, 'GET', undefined, request);

    case 'recommendations':
      return proxyToBackend('/guest/recommendations', 'GET', undefined, request);

    default:
      return proxyToBackend('/guest', 'GET', undefined, request);
  }
}

// POST /api/personalization/guest - Create/update guest personalization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'recently-viewed':
        return proxyToBackend('/guest/recently-viewed', 'POST', data, request);

      case 'search-history':
        return proxyToBackend('/guest/search-history', 'POST', data, request);

      case 'category-view':
        return proxyToBackend('/guest/category-view', 'POST', data, request);

      case 'cart':
        return proxyToBackend('/guest/cart', 'POST', data, request);

      case 'wishlist-toggle':
        return proxyToBackend('/guest/wishlist/toggle', 'POST', data, request);

      case 'session-activity':
        return proxyToBackend('/guest/session-activity', 'POST', data, request);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Personalization POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PUT /api/personalization/guest - Update guest personalization
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'preferences':
        return proxyToBackend('/guest/preferences', 'PUT', data, request);

      case 'cart-quantity':
        return proxyToBackend('/guest/cart/quantity', 'PUT', data, request);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Personalization PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/personalization/guest - Delete guest personalization
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'cart':
      try {
        const body = await request.json();
        return proxyToBackend('/guest/cart', 'DELETE', body, request);
      } catch (error) {
        console.error('Personalization DELETE cart error:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid request body' },
          { status: 400 }
        );
      }

    case 'clear':
      return proxyToBackend('/guest', 'DELETE', undefined, request);

    default:
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
  }
}