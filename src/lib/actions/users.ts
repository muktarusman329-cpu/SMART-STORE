'use server';

import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function getUsers(filters?: { search?: string; role?: string }) {
  await requireAdmin();
  await connectDB();

  const query: Record<string, unknown> = {};

  if (filters?.search) {
    const safeSearch = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  if (filters?.role && filters.role !== 'all') {
    query.role = filters.role;
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(users));
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'cashier';
  phone?: string;
}) {
  await requireAdmin();
  await connectDB();

  if (!data.name || !data.email || !data.password || !data.role) {
    throw new Error('All required fields must be provided');
  }

  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const validRoles = ['manager', 'cashier'];
  if (!validRoles.includes(data.role)) {
    throw new Error('Invalid role. Only manager and cashier roles can be created.');
  }

  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: data.role,
    phone: data.phone || '',
    isActive: true,
  });

  revalidatePath('/dashboard/users');

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function updateUser(
  userId: string,
  data: { name?: string; role?: 'manager' | 'cashier'; phone?: string; isActive?: boolean }
) {
  const session = await requireAdmin();
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Prevent admin from changing their own role
  if (user._id.toString() === session.user.id && data.role) {
    throw new Error('Cannot change your own role');
  }

  // Prevent changing other admin roles
  if (user.role === 'admin' && user._id.toString() !== session.user.id) {
    throw new Error('Cannot modify another admin');
  }

  const updateData: Record<string, unknown> = {};
  if (data.name) updateData.name = data.name;
  if (data.role) updateData.role = data.role;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  await User.findByIdAndUpdate(userId, updateData);
  revalidatePath('/dashboard/users');
}

export async function deleteUser(userId: string) {
  const session = await requireAdmin();
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === session.user.id) {
    throw new Error('Cannot delete your own account');
  }

  // Prevent deleting other admins
  if (user.role === 'admin') {
    throw new Error('Cannot delete an admin account');
  }

  await User.findByIdAndDelete(userId);
  revalidatePath('/dashboard/users');
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const session = await requireAdmin();
  await connectDB();

  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Prevent resetting other admin passwords
  if (user.role === 'admin' && user._id.toString() !== session.user.id) {
    throw new Error('Cannot reset another admin password');
  }

  user.password = newPassword;
  await user.save(); // triggers bcrypt hashing via pre-save hook
  revalidatePath('/dashboard/users');
}
