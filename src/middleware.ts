import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect dashboard routes to dashboard subdomain
  if (pathname.startsWith('/dashboard')) {
    const dashboardUrl = new URL(request.url);
    dashboardUrl.hostname = `dashboard.${dashboardUrl.hostname}`;
    
    // In development, you might want to use a different port
    if (process.env.NODE_ENV === 'development') {
      dashboardUrl.port = '3001'; // Assuming dashboard runs on port 3001
    }
    
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};