import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VaultEntry from '@/models/VaultEntry';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const entry = await request.json();
  const updatedEntry = await VaultEntry.findByIdAndUpdate(id, entry, { new: true });
  return NextResponse.json({ success: true, data: updatedEntry });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  await VaultEntry.findByIdAndDelete(id);
  return NextResponse.json({ success: true, data: {} });
}
