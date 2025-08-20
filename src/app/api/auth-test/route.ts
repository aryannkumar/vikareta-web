import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get API base URL from environment
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://api.vikareta.com';
    const apiUrl = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
    
    // Try to call the backend auth/me endpoint to test connectivity
    const backendResponse = await fetch(`${apiUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const backendData = backendResponse.ok ? await backendResponse.json() : null;
    
    return NextResponse.json({
      status: 'success',
      frontend: {
        environment: process.env.NODE_ENV,
        apiBase: apiBase,
        apiUrl: apiUrl,
        timestamp: new Date().toISOString(),
      },
      backend: {
        status: backendResponse.status,
        ok: backendResponse.ok,
        data: backendData,
        error: !backendResponse.ok ? `HTTP ${backendResponse.status}` : null,
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      apiBase: process.env.NEXT_PUBLIC_API_BASE,
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to test wishlist functionality
    const body = await request.json();
    const { action, itemId, type } = body;
    
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://api.vikareta.com';
    const apiUrl = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
    
    let response;
    
    if (action === 'add-wishlist' && itemId && type) {
      response = await fetch(`${apiUrl}/wishlist`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, type }),
      });
    } else if (action === 'check-wishlist' && itemId && type) {
      response = await fetch(`${apiUrl}/wishlist/check/${type}/${itemId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } else {
      return NextResponse.json({
        status: 'error',
        error: 'Invalid action or missing parameters',
      }, { status: 400 });
    }
    
    const responseData = response.ok ? await response.json() : null;
    
    return NextResponse.json({
      status: 'success',
      request: { action, itemId, type },
      backend: {
        status: response.status,
        ok: response.ok,
        data: responseData,
        error: !response.ok ? `HTTP ${response.status}` : null,
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}