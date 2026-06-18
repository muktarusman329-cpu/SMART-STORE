import { NextRequest, NextResponse } from 'next/server';
import { createSale } from '@/lib/actions/pos';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const sale = await createSale({
      ...data,
      cashierId: session.user.id,
      branchId: session.user.branchId,
    });

    return NextResponse.json({ success: true, data: sale });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
