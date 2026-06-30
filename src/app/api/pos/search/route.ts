import { NextRequest } from 'next/server';
import { searchProducts } from '@/lib/actions/pos';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const products = await searchProducts(query);
    return apiSuccess(products);
  },
  { rateLimit: { limit: 60 }, requireAuth: false }
);
