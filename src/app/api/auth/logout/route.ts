import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // To log out, we overwrite the token cookie with an empty value and an expiry date in the past.
  const serializedCookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Expire immediately
    path: '/',
  });

  const response = NextResponse.json({ success: true, message: "Logout successful" });
  response.headers.set('Set-Cookie', serializedCookie);

  return response;
}
