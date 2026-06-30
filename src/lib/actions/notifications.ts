'use server';

import connectDB from '@/lib/mongodb';
import { Notification } from '@/models';
import { revalidatePath } from 'next/cache';
import { serialize } from '@/lib/serialize';

export async function getNotifications(filters?: {
  userId?: string;
  isRead?: boolean;
  category?: string;
}) {
  await connectDB();

  const query: any = {};

  if (filters?.userId) {
    query.userId = filters.userId;
  }

  if (filters?.isRead !== undefined) {
    query.isRead = filters.isRead;
  }

  if (filters?.category) {
    query.category = filters.category;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  return serialize(notifications);
}

export async function getNotificationById(id: string) {
  await connectDB();

  const notification = await Notification.findById(id);

  return serialize(notification);
}

export async function createNotification(data: any) {
  await connectDB();

  const notification = await Notification.create(data);

  revalidatePath('/dashboard/notifications');
  return serialize(notification);
}

export async function markAsRead(id: string) {
  await connectDB();

  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  revalidatePath('/dashboard/notifications');
  return serialize(notification);
}

export async function markAllAsRead(userId?: string) {
  await connectDB();

  const query = userId ? { userId } : {};
  await Notification.updateMany(query, { isRead: true });

  revalidatePath('/dashboard/notifications');
  return { success: true };
}

export async function deleteNotification(id: string) {
  await connectDB();

  await Notification.findByIdAndDelete(id);

  revalidatePath('/dashboard/notifications');
  return { success: true };
}

export async function getUnreadCount(userId?: string) {
  await connectDB();

  const query: any = { isRead: false };
  if (userId) {
    query.userId = userId;
  }

  const count = await Notification.countDocuments(query);
  return count;
}
