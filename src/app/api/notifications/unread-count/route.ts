import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Notification } from '@/models';
import { apiError } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectDB();
    const count = await Notification.countDocuments({ isRead: false });
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return apiError(error);
  }
}
