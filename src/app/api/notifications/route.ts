import { NextRequest } from 'next/server';
import { createNotification, getNotifications } from '@/lib/actions/notifications';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      userId: searchParams.get('userId') || undefined,
      isRead: searchParams.get('isRead') === 'true' ? true : searchParams.get('isRead') === 'false' ? false : undefined,
      category: searchParams.get('category') || undefined,
    };

    const notifications = await getNotifications(filters);
    return apiSuccess(notifications);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const notification = await createNotification(data);
    return apiSuccess(notification);
  } catch (error) {
    return apiError(error);
  }
}
