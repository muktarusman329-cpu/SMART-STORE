import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { generateThankYouMessage } from '@/lib/whatsapp-utils';
import { apiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, amount } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'customerName and customerPhone are required' },
        { status: 400 }
      );
    }

    const testAmount = amount || 100;
    const message = generateThankYouMessage(customerName, testAmount);

    const result = await sendWhatsAppMessage({
      customerName,
      customerPhone,
      message,
      amount: testAmount,
    });

    return NextResponse.json({
      success: true,
      result,
      testMessage: 'If you see this, the API endpoint is working. Check console for detailed logs.',
    });
  } catch (error) {
    return apiError(error);
  }
}
