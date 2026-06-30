import { NextRequest, NextResponse } from 'next/server';
import { Session } from 'next-auth';
import { auth } from '@/lib/auth';
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit';
import { handleApiError } from '@/lib/error-handler';

interface ApiHandlerOptions {
  rateLimit?: { limit: number; windowMs?: number };
  requireAuth?: boolean;
}

type ApiHandlerFn = (
  request: NextRequest,
  context: { session: Session | null }
) => Promise<NextResponse>;

export function rateLimitedResponse(resetTime: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
    },
    { status: 429 }
  );
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}

export function apiSuccess(data: unknown, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: unknown): NextResponse {
  const errorResponse = handleApiError(error);
  return NextResponse.json(
    { success: false, error: errorResponse.error },
    { status: errorResponse.statusCode }
  );
}

export function withApiHandler(handler: ApiHandlerFn, options: ApiHandlerOptions = {}) {
  const { rateLimit: rateLimitOpts, requireAuth = true } = options;

  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      if (rateLimitOpts) {
        const identifier = getClientIdentifier(request);
        const result = rateLimit(identifier, rateLimitOpts.limit, rateLimitOpts.windowMs ?? 60_000);
        if (!result.success) {
          return rateLimitedResponse(result.resetTime);
        }
      }

      let session: Session | null = null;
      if (requireAuth) {
        session = await auth();
        if (!session?.user?.id) {
          return unauthorizedResponse();
        }
      }

      return await handler(request, { session });
    } catch (error) {
      return apiError(error);
    }
  };
}
