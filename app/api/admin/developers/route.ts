import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Developer from '@/lib/models/Developer';
import ActivityLog from '@/lib/models/ActivityLog';

// GET - Fetch all developers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    let query: any = {};
    
    if (status) query.status = status;
    if (role) query.role = role;

    const developers = await Developer.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: developers,
    });
  } catch (error: any) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new developer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    
    // Check if developer with same email exists
    const existingDeveloper = await Developer.findOne({ email: body.email });
    if (existingDeveloper) {
      return NextResponse.json(
        { success: false, error: 'Developer with this email already exists' },
        { status: 400 }
      );
    }

    const developer = await Developer.create(body);

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'create',
      module: 'developer',
      targetId: developer._id,
      targetType: 'Developer',
      description: `Created developer: ${developer.name}`,
      metadata: { developerName: developer.name, role: developer.role },
    });

    return NextResponse.json({
      success: true,
      data: developer,
      message: 'Developer created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
