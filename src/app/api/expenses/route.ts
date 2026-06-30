import { NextRequest } from 'next/server';
import { createExpense, getExpenses } from '@/lib/actions/expenses';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      category: searchParams.get('category') || undefined,
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
    };

    const expenses = await getExpenses(filters);
    return apiSuccess(expenses);
  },
  { rateLimit: { limit: 30 } }
);

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const data = await request.json();
    const expense = await createExpense(data);
    return apiSuccess(expense);
  },
  { rateLimit: { limit: 10 } }
);
