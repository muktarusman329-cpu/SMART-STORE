import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import { withApiHandler, apiSuccess } from '@/lib/api-utils';

export const POST = withApiHandler(
  async (request: NextRequest, { session }) => {
    if (session!.user!.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only admins can create users' },
        { status: 403 }
      );
    }

    const { name, email, password, role, phone } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'manager', 'cashier'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      isActive: true,
    });

    return apiSuccess({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }, 200);
  },
  { rateLimit: { limit: 5 } }
);
