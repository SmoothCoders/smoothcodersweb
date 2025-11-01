import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

// GET - Fetch all orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      serviceId,
      serviceName,
      tier,
      price,
      currency,
      name,
      email,
      phone,
      notes
    } = body;

    // Validate required fields
    if (!serviceId || !serviceName || !tier || !price || !currency || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate tier
    if (!['basic', 'standard', 'premium'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // Validate currency
    if (!['INR', 'USD'].includes(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency' },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      serviceId,
      serviceName,
      tier,
      price,
      currency,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      message: 'Order created successfully'
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
