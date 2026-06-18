import { NextRequest, NextResponse } from 'next/server';
import { createSupplier, getSuppliers } from '@/lib/actions/suppliers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      search: searchParams.get('search') || undefined,
    };

    const suppliers = await getSuppliers(filters);
    return NextResponse.json({ success: true, data: suppliers });
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
    const supplier = await createSupplier(data);
    return NextResponse.json({ success: true, data: supplier });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
