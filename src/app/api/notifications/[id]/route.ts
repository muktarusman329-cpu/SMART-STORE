import { NextRequest, NextResponse } from 'next/server';
import { deleteNotification, markAsRead } from '@/lib/actions/notifications';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const notification = await markAsRead(id);
    return apiSuccess(notification);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await deleteNotification(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
