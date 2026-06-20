import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppMessages, getWhatsAppMessageStats } from '@/lib/whatsapp';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'sent' | 'failed' | 'pending' | null;
    const customerId = searchParams.get('customerId');
    const limit = searchParams.get('limit');

    const filters: any = {};
    if (status) filters.status = status;
    if (customerId) filters.customerId = customerId;
    if (limit) filters.limit = parseInt(limit);

    const messages = await getWhatsAppMessages(filters);
    const stats = await getWhatsAppMessageStats();

    return NextResponse.json({
      success: true,
      data: messages,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
