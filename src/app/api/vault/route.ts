import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VaultEntry from '@/models/VaultEntry';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const entries = await VaultEntry.find({ user: userId });
  return NextResponse.json({ success: true, data: entries });
}

export async function POST(request: Request) {
  await dbConnect();
  const entry = await request.json();
  const newEntry = await VaultEntry.create(entry);
  return NextResponse.json({ success: true, data: newEntry });
}
