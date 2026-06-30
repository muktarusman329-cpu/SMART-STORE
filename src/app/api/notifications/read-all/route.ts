import { NextRequest, NextResponse } from 'next/server';
import { markAllAsRead } from '@/lib/actions/notifications';
import { apiError } from '@/lib/api-utils';

export async function PUT(_request: NextRequest) {
  try {
    await markAllAsRead();
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
