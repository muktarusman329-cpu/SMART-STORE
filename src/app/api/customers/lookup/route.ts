import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/models';
import { apiError } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'Phone number or email is required' },
        { status: 400 }
      );
    }

    let customer;
    
    if (phone) {
      customer = await Customer.findOne({ phone, isActive: true });
    } else if (email) {
      customer = await Customer.findOne({ email, isActive: true });
    }

    if (customer) {
      return NextResponse.json({
        success: true,
        data: {
          _id: customer._id,
          customerId: customer.customerId,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          loyaltyPoints: customer.loyaltyPoints,
          totalSpent: customer.totalSpent,
          purchaseCount: customer.purchaseCount,
          lastPurchaseDate: customer.lastPurchaseDate,
          favoriteProducts: customer.favoriteProducts,
          favoriteCategories: customer.favoriteCategories,
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Customer not found',
    }, { status: 404 });

  } catch (error) {
    return apiError(error);
  }
}
