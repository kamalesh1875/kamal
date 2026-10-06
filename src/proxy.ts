import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseSessionToken, isTabAllowed, getDefaultRouteForRole } from '@/lib/auth';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, public files, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/icon.svg' ||
    /\.(png|jpg|jpeg|svg|gif|webp|ico|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('goatfarm_session')?.value;
  const user = token ? parseSessionToken(token) : null;

  // 1. Unauthenticated User Handling
  if (!user) {
    // Allow access to login page
    if (pathname === '/login') {
      return NextResponse.next();
    }
    // Allow access to unauthorized notice
    if (pathname === '/unauthorized') {
      return NextResponse.next();
    }
    // Redirect all other requests to login with return path
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/' && pathname !== '/dashboard') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated User Handling
  // If authenticated user visits login page, redirect to their role-appropriate destination
  if (pathname === '/login') {
    const dest = getDefaultRouteForRole(user.role);
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // If visiting root '/', redirect to role default route
  if (pathname === '/') {
    const dest = getDefaultRouteForRole(user.role);
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Allow unauthorized page itself
  if (pathname === '/unauthorized') {
    return NextResponse.next();
  }

  // 3. Role-Based Route Permission Guard (RBAC)
  // Extract route module name: e.g. /finance -> finance, /goats -> goats
  const segments = pathname.split('/').filter(Boolean);
  const primaryModule = segments[0] || 'dashboard';

  // Check if role has access to this module
  if (!isTabAllowed(user.role, primaryModule)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static, _next/image
     * - static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon.svg).*)',
  ],
};
