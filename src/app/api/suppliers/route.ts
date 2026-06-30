import { NextRequest } from 'next/server';
import { createSupplier, getSuppliers } from '@/lib/actions/suppliers';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      search: searchParams.get('search') || undefined,
    };

    const suppliers = await getSuppliers(filters);
    return apiSuccess(suppliers);
  },
  { rateLimit: { limit: 30 }, requireAuth: false }
);

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const data = await request.json();
    const supplier = await createSupplier(data);
    return apiSuccess(supplier);
  },
  { rateLimit: { limit: 10 }, requireAuth: false }
);
