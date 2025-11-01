import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Developer from '@/lib/models/Developer';
import ActivityLog from '@/lib/models/ActivityLog';

// GET - Fetch single developer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const developer = await Developer.findById(id);

    if (!developer) {
      return NextResponse.json(
        { success: false, error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: developer,
    });
  } catch (error: any) {
    console.error('Error fetching developer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update developer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    
    const developer = await Developer.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!developer) {
      return NextResponse.json(
        { success: false, error: 'Developer not found' },
        { status: 404 }
      );
    }

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'update',
      module: 'developer',
      targetId: developer._id,
      targetType: 'Developer',
      description: `Updated developer: ${developer.name}`,
      metadata: { changes: body },
    });

    return NextResponse.json({
      success: true,
      data: developer,
      message: 'Developer updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating developer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete developer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const developer = await Developer.findByIdAndDelete(id);

    if (!developer) {
      return NextResponse.json(
        { success: false, error: 'Developer not found' },
        { status: 404 }
      );
    }

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'delete',
      module: 'developer',
      targetId: developer._id,
      targetType: 'Developer',
      description: `Deleted developer: ${developer.name}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Developer deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting developer:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
