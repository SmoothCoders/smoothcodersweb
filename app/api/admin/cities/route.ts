import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import City from '@/lib/models/City';

// GET /api/admin/cities - Get all cities
export async function GET() {
  try {
    await connectDB();
    
    const cities = await City.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: cities,
      count: cities.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/cities - Create new city
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'state'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Create city
    const city = await City.create(body);
    
    return NextResponse.json({
      success: true,
      data: city,
      message: 'City created successfully'
    }, { status: 201 });
  } catch (error: any) {
    // Handle duplicate slug error
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
