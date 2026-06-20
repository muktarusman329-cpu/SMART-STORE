import { NextRequest, NextResponse } from 'next/server';
import { getProductByBarcode } from '@/lib/actions/pos';

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

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
