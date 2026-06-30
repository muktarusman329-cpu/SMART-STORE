import { NextRequest } from 'next/server';
import { createEmployee, getEmployees } from '@/lib/actions/employees';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      search: searchParams.get('search') || undefined,
      department: searchParams.get('department') || undefined,
    };

    const employees = await getEmployees(filters);
    return apiSuccess(employees);
  },
  { rateLimit: { limit: 30 } }
);

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const data = await request.json();
    const result = await createEmployee(data);
    return apiSuccess(result);
  },
  { rateLimit: { limit: 10 } }
);
