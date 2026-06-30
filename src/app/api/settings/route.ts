import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Branch from '@/models/Branch';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (_request: NextRequest, { session }) => {
    const branchId = session!.user!.branchId;
    if (!branchId) {
      return NextResponse.json({ success: false, error: 'No branch associated with user' }, { status: 400 });
    }

    await connectDB();
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return NextResponse.json({ success: false, error: 'Branch not found' }, { status: 404 });
    }

    return apiSuccess(branch.settings);
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, { session }) => {
    const branchId = session!.user!.branchId;
    if (!branchId) {
      return NextResponse.json({ success: false, error: 'No branch associated with user' }, { status: 400 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json({ success: false, error: 'Missing settings payload' }, { status: 400 });
    }

    await connectDB();

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return NextResponse.json({ success: false, error: 'Branch not found' }, { status: 404 });
    }

    branch.settings = {
      ...branch.settings,
      ...settings,
    };

    await branch.save();

    return apiSuccess(branch.settings);
  }
);
