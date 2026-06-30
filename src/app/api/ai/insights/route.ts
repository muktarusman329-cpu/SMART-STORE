import { NextRequest, NextResponse } from 'next/server';
import { getBusinessInsights } from '@/lib/actions/ai';
import { withApiHandler } from '@/lib/api-utils';

export const POST = withApiHandler(
  async (request: NextRequest, { session }) => {
    const { query } = await request.json();
    const result = await getBusinessInsights(query, session!.user!.id!);
    return NextResponse.json(result);
  }
);
