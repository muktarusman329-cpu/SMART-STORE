import { NextRequest } from 'next/server';
import { createSale } from '@/lib/actions/pos';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const POST = withApiHandler(
  async (request: NextRequest, { session }) => {
    const data = await request.json();
    const sale = await createSale({
      ...data,
      cashierId: session!.user!.id!,
      branchId: session!.user!.branchId,
    });

    return apiSuccess(sale);
  },
  { rateLimit: { limit: 20 } }
);
