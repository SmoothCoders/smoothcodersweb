import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { 
  generateICSFile, 
  createProjectDeadlineEvent, 
  createInvoiceDueEvent,
  createQuotationFollowUpEvent,
  createMeetingEvent
} from '@/lib/calendar';
import { connectDB } from '@/lib/mongodb';
import ProjectModel from '@/lib/models/ProjectModel';
import Invoice from '@/lib/models/Invoice';
import Quotation from '@/lib/models/Quotation';

// POST - Generate calendar event
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
    const { type, id, customEvent } = body;

    let event;

    if (customEvent) {
      // Custom event provided directly
      event = customEvent;
    } else {
      // Generate event based on type and id
      switch (type) {
        case 'project-deadline': {
          const project = await ProjectModel.findById(id).populate('client', 'name email');
          if (!project) {
            return NextResponse.json(
              { success: false, error: 'Project not found' },
              { status: 404 }
            );
          }
          event = createProjectDeadlineEvent(project.toObject());
          break;
        }

        case 'invoice-due': {
          const invoice = await Invoice.findById(id).populate('client', 'name email');
          if (!invoice) {
            return NextResponse.json(
              { success: false, error: 'Invoice not found' },
              { status: 404 }
            );
          }
          event = createInvoiceDueEvent(invoice.toObject());
          break;
        }

        case 'quotation-followup': {
          const quotation = await Quotation.findById(id).populate('client', 'name email');
          if (!quotation) {
            return NextResponse.json(
              { success: false, error: 'Quotation not found' },
              { status: 404 }
            );
          }
          event = createQuotationFollowUpEvent(quotation.toObject());
          break;
        }

        case 'meeting': {
          if (!customEvent) {
            return NextResponse.json(
              { success: false, error: 'Meeting details required' },
              { status: 400 }
            );
          }
          event = createMeetingEvent(customEvent);
          break;
        }

        default:
          return NextResponse.json(
            { success: false, error: 'Invalid event type' },
            { status: 400 }
          );
      }
    }

    // Generate ICS file content
    const icsContent = generateICSFile(event);

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar;charset=utf-8',
        'Content-Disposition': `attachment; filename="${event.title.replace(/\s+/g, '-').toLowerCase()}.ics"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating calendar event:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
