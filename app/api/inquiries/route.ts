import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      serviceId, 
      serviceName,
      tier,
      price,
      currency,
      type, // 'order' or 'chat'
      name,
      email,
      phone,
      message,
      // Legacy fields support
      clientName, 
      clientEmail, 
      clientPhone,
      clientCompany,
      projectDescription,
      budget,
      timeline
    } = body;
    
    // Support both new and legacy format
    const finalClientName = name || clientName;
    const finalClientEmail = email || clientEmail;
    const finalClientPhone = phone || clientPhone;
    const finalMessage = message || projectDescription;
    
    // Validate required fields
    if (!serviceId || !serviceName || !finalClientName || !finalClientEmail || !finalClientPhone || !finalMessage) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create inquiry with additional checkout data
    const inquiryData: any = {
      serviceId,
      serviceName,
      clientName: finalClientName,
      clientEmail: finalClientEmail,
      clientPhone: finalClientPhone,
      projectDescription: finalMessage,
      status: 'pending',
      messages: [{
        sender: 'client',
        message: finalMessage,
        timestamp: new Date(),
      }],
    };
    
    // Add optional fields
    if (clientCompany) inquiryData.clientCompany = clientCompany;
    if (budget) inquiryData.budget = budget;
    if (timeline) inquiryData.timeline = timeline;
    if (tier) inquiryData.tier = tier;
    if (price !== undefined) inquiryData.price = price;
    if (currency) inquiryData.currency = currency;
    if (type) inquiryData.type = type; // 'order' or 'chat'
    
    const inquiry = await Inquiry.create(inquiryData);
    
    return NextResponse.json(
      { 
        success: true, 
        message: type === 'chat' ? 'Chat request submitted! We will get back to you soon.' : 'Order submitted successfully! We will contact you shortly.',
        data: inquiry 
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    
    let query: any = {};
    
    if (email) {
      query.clientEmail = email;
    }
    
    if (status) {
      query.status = status;
    }
    
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .populate('serviceId');
    
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
