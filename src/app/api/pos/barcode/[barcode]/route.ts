import { NextRequest, NextResponse } from 'next/server';
import { getProductByBarcode } from '@/lib/actions/pos';
import { apiSuccess, apiError } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await context.params;
  try {
    const product = await getProductByBarcode(barcode);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return apiSuccess(product);
  } catch (error) {
    return apiError(error);
  }
}
