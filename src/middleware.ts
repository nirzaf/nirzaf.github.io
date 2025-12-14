/**
 * Middleware to protect admin routes
 * Redirects unauthenticated users to login page
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes (except /admin/login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        // Check for auth session cookie
        const sessionCookie = request.cookies.get('better-auth.session_token') ||
            request.cookies.get('__Secure-better-auth.session_token');

        if (!sessionCookie) {
            // Redirect to login
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
