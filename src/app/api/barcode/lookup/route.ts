import { NextRequest, NextResponse } from 'next/server';
import { lookupBarcodeByOpenFoodFacts } from '@/lib/services/barcode-service';
import { auth } from '@/lib/auth';
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit';
import { handleApiError } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 20 requests per minute per user/IP
    const identifier = getClientIdentifier(request);
    const rateLimitResult = rateLimit(identifier, 20, 60 * 1000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const barcode = searchParams.get('barcode');

    if (!barcode) {
      return NextResponse.json(
        { success: false, error: 'Barcode parameter is required' },
        { status: 400 }
      );
    }

    const result = await lookupBarcodeByOpenFoodFacts(barcode);

    if (result.found && result.data) {
      return NextResponse.json({ 
        success: true, 
        found: true, 
        data: result.data 
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        found: false, 
        error: result.error || 'Product not found' 
      });
    }
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}
