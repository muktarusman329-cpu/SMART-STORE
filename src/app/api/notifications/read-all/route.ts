import { NextRequest, NextResponse } from 'next/server';
import { markAllAsRead } from '@/lib/actions/notifications';

export async function PUT(request: NextRequest) {
  try {
    await markAllAsRead();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
