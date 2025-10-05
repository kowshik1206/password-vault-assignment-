import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { payload } = await jwtVerify(token, secret);
    const { userId } = payload as { userId: string };
    const user = await User.findById(userId).select('-password'); // Exclude password from result

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }
}
