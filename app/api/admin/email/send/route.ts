import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sendEmail, emailTemplates } from '@/lib/email';
import { connectDB } from '@/lib/mongodb';
import ActivityLog from '@/lib/models/ActivityLog';

// POST - Send email
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
    const { to, templateType, data } = body;

    if (!to || !templateType || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get template
    let template;
    switch (templateType) {
      case 'quotationSent':
        template = emailTemplates.quotationSent(data);
        break;
      case 'invoiceSent':
        template = emailTemplates.invoiceSent(data);
        break;
      case 'paymentReceived':
        template = emailTemplates.paymentReceived(data);
        break;
      case 'projectAssigned':
        template = emailTemplates.projectAssigned(data);
        break;
      case 'projectStatusUpdate':
        template = emailTemplates.projectStatusUpdate(data);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid template type' },
          { status: 400 }
        );
    }

    // Send email
    const result = await sendEmail(to, template);

    if (result.success) {
      // Log activity
      await ActivityLog.create({
        user: (session.user as any)?.id,
        action: 'send',
        module: 'email',
        targetType: 'Email',
        description: `Sent ${templateType} email to ${to}`,
        metadata: { to, templateType, subject: template.subject },
      });
    }

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully' : 'Failed to send email',
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
