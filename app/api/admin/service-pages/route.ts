import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ServicePage from '@/lib/models/ServicePage';

// GET /api/admin/service-pages - Get all generated pages
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');
    const serviceId = searchParams.get('serviceId');
    
    // Build filter
    const filter: any = {};
    if (cityId) filter.cityId = cityId;
    if (serviceId) filter.serviceId = serviceId;
    
    const pages = await ServicePage.find(filter)
      .populate('serviceId', 'title slug')
      .populate('cityId', 'name slug state')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: pages,
      count: pages.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
