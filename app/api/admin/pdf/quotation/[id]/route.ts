import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Quotation from '@/lib/models/Quotation';
import { generateQuotationPDF } from '@/lib/pdf-generator';

// GET - Generate quotation PDF
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
    const quotation = await Quotation.findById(id).populate('client', 'name email phone company address');

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Get custom fields from query params
    const searchParams = request.nextUrl.searchParams;
    const customFields = {
      reference: searchParams.get('reference') || undefined,
      terms: searchParams.get('terms') ? JSON.parse(searchParams.get('terms')!) : undefined,
    };

    // Generate PDF
    const doc = generateQuotationPDF(quotation.toObject(), customFields);
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quotation-${quotation.quotationNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating quotation PDF:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
