import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import { generateInvoicePDF } from '@/lib/pdf-generator';

// GET - Generate invoice PDF
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
    const invoice = await Invoice.findById(id)
      .populate('client', 'name email phone company address')
      .populate('project', 'name');

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Get custom fields from query params
    const searchParams = request.nextUrl.searchParams;
    const customFields = {
      poNumber: searchParams.get('poNumber') || undefined,
    };

    // Generate PDF
    const doc = generateInvoicePDF(invoice.toObject(), customFields);
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating invoice PDF:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
