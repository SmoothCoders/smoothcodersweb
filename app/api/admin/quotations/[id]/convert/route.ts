import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Quotation from '@/lib/models/Quotation';
import ProjectModel from '@/lib/models/ProjectModel';
import Client from '@/lib/models/Client';
import ActivityLog from '@/lib/models/ActivityLog';

// POST - Convert quotation to project
export async function POST(
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
    const body = await request.json();
    
    // Get quotation
    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Check if already converted
    if (quotation.status === 'converted') {
      return NextResponse.json(
        { success: false, error: 'Quotation already converted to project' },
        { status: 400 }
      );
    }

    // Check if quotation is approved
    if (quotation.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Only approved quotations can be converted' },
        { status: 400 }
      );
    }

    // Create project from quotation
    const projectData = {
      name: quotation.projectName,
      client: quotation.client,
      type: quotation.projectType,
      description: body.description || `Project created from quotation ${quotation.quotationNumber}`,
      status: 'planning',
      priority: body.priority || 'medium',
      startDate: body.startDate || new Date(),
      endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      budget: {
        estimated: quotation.total,
        actual: 0,
        currency: quotation.currency,
      },
      paymentStatus: 'pending',
      quotationId: quotation._id,
      developers: body.developers || [],
    };

    const project = await ProjectModel.create(projectData);

    // Update quotation status
    quotation.status = 'converted';
    quotation.convertedToProject = project._id;
    await quotation.save();

    // Update client
    await Client.findByIdAndUpdate(quotation.client, {
      $inc: { totalProjects: 1 },
      status: 'active',
    });

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'create',
      module: 'project',
      targetId: project._id,
      targetType: 'Project',
      description: `Converted quotation ${quotation.quotationNumber} to project: ${project.name}`,
      metadata: { 
        quotationId: quotation._id,
        quotationNumber: quotation.quotationNumber,
        projectId: project._id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        project,
        quotation,
      },
      message: 'Quotation converted to project successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error converting quotation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
