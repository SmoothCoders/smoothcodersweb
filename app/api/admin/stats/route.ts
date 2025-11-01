import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import Contact from '@/lib/models/Contact';
import Inquiry from '@/lib/models/Inquiry';
import Order from '@/lib/models/Order';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get counts from database
    const [serviceCount, contactCount, inquiryCount, orderCount] = await Promise.all([
      Service.countDocuments(),
      Contact.countDocuments(),
      Inquiry.countDocuments(),
      Order.countDocuments()
    ]);

    // Get detailed stats
    const [services, contacts, inquiries, orders] = await Promise.all([
      Service.find().limit(5),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5)
    ]);

    // Calculate stats
    const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });
    const activeInquiries = await Inquiry.countDocuments({ status: 'active' });
    
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    return NextResponse.json({
      success: true,
      counts: {
        services: serviceCount,
        contacts: contactCount,
        inquiries: inquiryCount,
        orders: orderCount,
        pendingInquiries,
        activeInquiries
      },
      data: {
        services,
        contacts,
        inquiries,
        orders
      },
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
