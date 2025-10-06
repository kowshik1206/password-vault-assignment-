import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // If trying to access auth pages while logged in, redirect to home
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL('/', request.url));
    } catch (err) {
      // Invalid token, let them proceed to login/signup
    }
  }

  // If trying to access protected pages while not logged in, redirect to login
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token for protected pages
  if (token && pathname === '/') {
    try {
      await jwtVerify(token, secret);
    } catch (err) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token'); // Delete invalid token
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup'],
};
