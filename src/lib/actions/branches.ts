'use server';

import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import { revalidatePath } from 'next/cache';
import { serialize } from '@/lib/serialize';

export async function getBranches() {
  await connectDB();
  const branches = await Branch.find({ isActive: true }).sort({ name: 1 });
  return serialize(branches);
}

export async function getBranchById(id: string) {
  await connectDB();
  const branch = await Branch.findById(id);
  return serialize(branch);
}

export async function createBranch(data: any) {
  await connectDB();
  const branch = await Branch.create(data);
  revalidatePath('/dashboard/branches');
  return serialize(branch);
}

export async function updateBranch(id: string, data: any) {
  await connectDB();
  const branch = await Branch.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/dashboard/branches');
  return serialize(branch);
}

export async function deleteBranch(id: string) {
  await connectDB();
  await Branch.findByIdAndUpdate(id, { isActive: false });
  revalidatePath('/dashboard/branches');
  return { success: true };
}
