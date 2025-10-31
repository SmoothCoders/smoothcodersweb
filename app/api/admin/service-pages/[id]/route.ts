import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ServicePage from '@/lib/models/ServicePage';

// GET /api/admin/service-pages/[id] - Get single service page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const servicePage = await ServicePage.findById(id)
      .populate('serviceId', 'title slug price category')
      .populate('cityId', 'name slug state')
      .lean();
    
    if (!servicePage) {
      return NextResponse.json(
        { success: false, error: 'Service page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: servicePage
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/service-pages/[id] - Update service page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    
    const updateData = {
      ...body,
      isGenerated: false // Manual edit = no longer auto-generated
    };
    
    const servicePage = await ServicePage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!servicePage) {
      return NextResponse.json(
        { success: false, error: 'Service page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: servicePage,
      message: 'Service page updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/service-pages/[id] - Delete service page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const servicePage = await ServicePage.findByIdAndDelete(id);
    
    if (!servicePage) {
      return NextResponse.json(
        { success: false, error: 'Service page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Service page deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
