import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Notification } from '@/models';

export async function GET() {
  try {
    await connectDB();
    const count = await Notification.countDocuments({ isRead: false });
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
