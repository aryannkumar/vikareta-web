import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  // Publicly accessible routes (no authentication required)
  const publiclyAccessibleRoutes = ['/', '/products', '/categories', '/search', '/cart', '/checkout'];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Check if the current route is publicly accessible
  const isPubliclyAccessibleRoute = publiclyAccessibleRoutes.some(route => pathname.startsWith(route));

  // Use unified Vikareta SSO access token cookie or Authorization header
  const token = request.cookies.get('accessToken')?.value ||
                (request.headers.get('authorization')?.replace('Bearer ', '') || null);

  // If accessing a protected route without a token, redirect to login
  if (!isPublicRoute && !isPubliclyAccessibleRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login with a valid token, redirect to home
  if (pathname === '/login' && token) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Allow public access to publicly accessible routes without token
  if (isPubliclyAccessibleRoute && !token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};