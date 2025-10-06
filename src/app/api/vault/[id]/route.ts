import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VaultEntry from '@/models/VaultEntry';

// GET a single entry (optional, but good for edit forms)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const entry = await VaultEntry.findById(params.id);
    if (!entry) {
      return NextResponse.json({ success: false, message: 'Entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// UPDATE an entry
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    const updatedEntry = await VaultEntry.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEntry) {
      return NextResponse.json({ success: false, message: 'Entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedEntry });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// DELETE an entry
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const deletedEntry = await VaultEntry.findByIdAndDelete(params.id);
    if (!deletedEntry) {
      return NextResponse.json({ success: false, message: 'Entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}