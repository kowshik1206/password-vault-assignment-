import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const token = getCookie('auth_token', { req: request as any });

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret);

    return NextResponse.json({ success: true, data: decoded }, { status: 200 });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    console.error('Me Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}