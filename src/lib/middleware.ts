import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export async function withAuth(request: NextRequest, handler: (request: NextRequest, session: any) => Promise<NextResponse>) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return await handler(request, session);
  } catch (error) {
    console.error('withAuth error:', error);
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function withRoleAuth(request: NextRequest, allowedRoles: string[], handler: (request: NextRequest, session: any) => Promise<NextResponse>) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    return await handler(request, session);
  } catch (error) {
    console.error('withRoleAuth error:', error);
    const message = error instanceof Error ? error.message : 'Authorization failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
