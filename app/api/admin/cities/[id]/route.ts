import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import City from '@/lib/models/City';
import ServicePage from '@/lib/models/ServicePage';

// GET /api/admin/cities/[id] - Get single city
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const city = await City.findById(id).lean();
    
    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: city
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/cities/[id] - Update city
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    
    const city = await City.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: city,
      message: 'City updated successfully'
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A city with this name already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/cities/[id] - Delete city
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const city = await City.findByIdAndDelete(id);
    
    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }
    
    // Delete all associated ServicePages
    await ServicePage.deleteMany({ cityId: id });
    
    return NextResponse.json({
      success: true,
      message: 'City deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
