import { NextRequest } from 'next/server';
import { predictSales } from '@/lib/actions/ai';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const { productId, days } = await request.json();
    const prediction = await predictSales(productId, days);
    return apiSuccess(prediction);
  } catch (error) {
    return apiError(error);
  }
}
