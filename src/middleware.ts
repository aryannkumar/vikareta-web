import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE:
// Previously this middleware automatically redirected requests to `/dashboard` on
// the main site to the `dashboard.` subdomain. That behavior forced users to be
// moved to the dashboard subdomain immediately when visiting dashboard paths.
//
// Per the requested behaviour, we should NOT auto-redirect users. Instead we
// rely on explicit navigation and a secure SSO sync to enable cross-domain
// sign-in. Keep a minimal middleware that passes through requests.

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Keep no matcher here or restrict to explicit needs. Removing the
  // `/dashboard` matcher prevents accidental interception of dashboard routes.
};