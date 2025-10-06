import { NextResponse } from 'next/server';
import { deleteCookie } from 'cookies-next';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logout successful' }, { status: 200 });
    
    deleteCookie('auth_token', {
      req: request as any,
      res: response,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}