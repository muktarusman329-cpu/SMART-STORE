import { NextRequest } from 'next/server';
import { createCustomer, getCustomers } from '@/lib/actions/customers';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      search: searchParams.get('search') || undefined,
    };

    const customers = await getCustomers(filters);
    return apiSuccess(customers);
  },
  { rateLimit: { limit: 30 } }
);

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const data = await request.json();
    const customer = await createCustomer(data);
    return apiSuccess(customer);
  },
  { rateLimit: { limit: 10 } }
);
