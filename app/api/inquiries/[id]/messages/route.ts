import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { sender, message, attachments } = body;
    
    if (!sender || !message) {
      return NextResponse.json(
        { success: false, error: 'Sender and message are required' },
        { status: 400 }
      );
    }
    
    const inquiry = await Inquiry.findById(id);
    
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    // Add message to inquiry
    inquiry.messages.push({
      sender,
      message,
      timestamp: new Date(),
      attachments: attachments || [],
    } as any);
    
    // Update status if needed
    if (inquiry.status === 'pending' && sender === 'admin') {
      inquiry.status = 'in-progress';
    }
    
    await inquiry.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: inquiry 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
