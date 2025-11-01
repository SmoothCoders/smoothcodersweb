import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Client from '@/lib/models/Client';
import ActivityLog from '@/lib/models/ActivityLog';

// GET - Fetch all clients
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
    const source = searchParams.get('source');

    let query: any = {};
    
    if (status) query.status = status;
    if (source) query.source = source;

    const clients = await Client.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: clients,
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new client
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
    
    // Check if client with same email exists
    const existingClient = await Client.findOne({ email: body.email });
    if (existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client with this email already exists' },
        { status: 400 }
      );
    }

    const client = await Client.create(body);

    // Log activity
    await ActivityLog.create({
      user: (session.user as any)?.id,
      action: 'create',
      module: 'client',
      targetId: client._id,
      targetType: 'Client',
      description: `Created client: ${client.name}`,
      metadata: { clientName: client.name, company: client.company },
    });

    return NextResponse.json({
      success: true,
      data: client,
      message: 'Client created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
