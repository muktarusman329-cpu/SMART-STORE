import { NextRequest, NextResponse } from 'next/server';
import { createProduct, getProducts } from '@/lib/actions/inventory';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      lowStock: searchParams.get('lowStock') === 'true',
      expiring: searchParams.get('expiring') === 'true',
    };

    const products = await getProducts(filters);
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const product = await createProduct(data);
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
