import { NextRequest } from 'next/server';
import { createProduct, getProducts } from '@/lib/actions/inventory';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      lowStock: searchParams.get('lowStock') === 'true',
      expiring: searchParams.get('expiring') === 'true',
    };

    const products = await getProducts(filters);
    return apiSuccess(products);
  },
  { rateLimit: { limit: 30 } }
);

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const data = await request.json();
    const product = await createProduct(data);
    return apiSuccess(product);
  },
  { rateLimit: { limit: 10 } }
);
