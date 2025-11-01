import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Company details (customizable)
export const companyInfo = {
  name: 'SmoothCoders',
  address: 'Your Address Line 1\nYour Address Line 2',
  phone: '+91 123 456 7890',
  email: 'contact@smoothcoders.com',
  website: 'www.smoothcoders.com',
  gstin: 'GSTIN123456789',
  logo: '', // Add logo URL if available
};

// Generate Quotation PDF
export function generateQuotationPDF(quotation: any, customFields?: any) {
  const doc = new jsPDF();
  
  // Add custom fields if provided
  const fields = customFields || {};
  
  // Header with gradient effect (simulated with rectangles)
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Web Development & Digital Solutions', 15, 28);
  
  // Document title
  doc.setFontSize(16);
  doc.text('QUOTATION', 150, 20);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Company details (left side)
  let yPos = 50;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('From:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(companyInfo.name, 15, yPos + 5);
  doc.setFontSize(9);
  const addressLines = companyInfo.address.split('\n');
  addressLines.forEach((line, index) => {
    doc.text(line, 15, yPos + 10 + (index * 4));
  });
  doc.text(`Phone: ${companyInfo.phone}`, 15, yPos + 22);
  doc.text(`Email: ${companyInfo.email}`, 15, yPos + 27);
  doc.text(`GSTIN: ${companyInfo.gstin}`, 15, yPos + 32);
  
  // Client details (right side)
  doc.setFont('helvetica', 'bold');
  doc.text('To:', 120, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.client?.name || 'Client Name', 120, yPos + 5);
  if (quotation.client?.company) {
    doc.text(quotation.client.company, 120, yPos + 10);
  }
  doc.text(`Email: ${quotation.client?.email || ''}`, 120, yPos + 15);
  doc.text(`Phone: ${quotation.client?.phone || ''}`, 120, yPos + 20);
  
  // Quotation details
  yPos += 45;
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos, 180, 30, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('Quotation Number:', 20, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.quotationNumber, 70, yPos + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 20, yPos + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(quotation.createdAt).toLocaleDateString(), 70, yPos + 15);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Valid Until:', 20, yPos + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(quotation.validUntil).toLocaleDateString(), 70, yPos + 22);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Project:', 120, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.projectName, 145, yPos + 8);
  
  // Custom fields
  if (fields.reference) {
    doc.setFont('helvetica', 'bold');
    doc.text('Reference:', 120, yPos + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(fields.reference, 145, yPos + 15);
  }
  
  // Items table
  yPos += 40;
  
  const tableData = quotation.items.map((item: any) => [
    item.description,
    item.quantity.toString(),
    `₹${item.rate.toLocaleString()}`,
    `₹${item.total.toLocaleString()}`,
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
  });
  
  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY;
  
  // Totals section
  yPos = finalY + 10;
  
  const totalsX = 120;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPos);
  doc.text(`₹${quotation.subtotal.toLocaleString()}`, 170, yPos);
  
  if (quotation.discount?.amount > 0) {
    yPos += 6;
    doc.text(`Discount ${quotation.discount.type === 'percentage' ? `(${quotation.discount.value}%)` : ''}:`, totalsX, yPos);
    doc.text(`-₹${quotation.discount.amount.toLocaleString()}`, 170, yPos);
  }
  
  yPos += 6;
  doc.text(`Tax (${quotation.tax.percentage}%):`, totalsX, yPos);
  doc.text(`₹${quotation.tax.amount.toLocaleString()}`, 170, yPos);
  
  // Total line
  yPos += 8;
  doc.setFillColor(102, 126, 234);
  doc.rect(115, yPos - 5, 80, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total Amount:', totalsX, yPos);
  doc.text(`₹${quotation.total.toLocaleString()}`, 170, yPos);
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  
  // Terms and conditions
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const terms = fields.terms || quotation.terms || [
    '1. This quotation is valid for 30 days from the date of issue',
    '2. 50% advance payment required to start the project',
    '3. Payment terms: Net 30 days',
    '4. All prices are in INR and exclusive of taxes unless stated',
    '5. Project timeline may vary based on client feedback and requirements',
  ];
  
  terms.forEach((term: string, index: number) => {
    doc.text(term, 15, yPos + 5 + (index * 4));
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(102, 126, 234);
  doc.rect(0, pageHeight - 20, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Thank you for your business!', 105, pageHeight - 12, { align: 'center' });
  doc.text(`${companyInfo.website} | ${companyInfo.email} | ${companyInfo.phone}`, 105, pageHeight - 7, { align: 'center' });
  
  return doc;
}

// Generate Invoice PDF
export function generateInvoicePDF(invoice: any, customFields?: any) {
  const doc = new jsPDF();
  
  const fields = customFields || {};
  
  // Header with gradient effect
  doc.setFillColor(17, 153, 142);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(companyInfo.name, 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Web Development & Digital Solutions', 15, 28);
  
  // Document title
  doc.setFontSize(16);
  doc.text('INVOICE', 155, 20);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Company details (left side)
  let yPos = 50;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('From:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(companyInfo.name, 15, yPos + 5);
  doc.setFontSize(9);
  const addressLines = companyInfo.address.split('\n');
  addressLines.forEach((line, index) => {
    doc.text(line, 15, yPos + 10 + (index * 4));
  });
  doc.text(`Phone: ${companyInfo.phone}`, 15, yPos + 22);
  doc.text(`Email: ${companyInfo.email}`, 15, yPos + 27);
  doc.text(`GSTIN: ${companyInfo.gstin}`, 15, yPos + 32);
  
  // Client details (right side)
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 120, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.client?.name || 'Client Name', 120, yPos + 5);
  if (invoice.client?.company) {
    doc.text(invoice.client.company, 120, yPos + 10);
  }
  doc.text(`Email: ${invoice.client?.email || ''}`, 120, yPos + 15);
  doc.text(`Phone: ${invoice.client?.phone || ''}`, 120, yPos + 20);
  
  // Invoice details
  yPos += 45;
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPos, 180, 35, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 20, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber, 70, yPos + 8);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Issue Date:', 20, yPos + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.issueDate).toLocaleDateString(), 70, yPos + 15);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', 20, yPos + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(invoice.dueDate).toLocaleDateString(), 70, yPos + 22);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 20, yPos + 29);
  doc.setFont('helvetica', 'normal');
  const statusColor = invoice.status === 'paid' ? [34, 197, 94] : 
                      invoice.status === 'overdue' ? [239, 68, 68] : [59, 130, 246];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(invoice.status.toUpperCase(), 70, yPos + 29);
  doc.setTextColor(0, 0, 0);
  
  // Project reference (if available)
  if (invoice.project?.name) {
    doc.setFont('helvetica', 'bold');
    doc.text('Project:', 120, yPos + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.project.name, 145, yPos + 8);
  }
  
  // Custom fields
  if (fields.poNumber) {
    doc.setFont('helvetica', 'bold');
    doc.text('PO Number:', 120, yPos + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(fields.poNumber, 145, yPos + 15);
  }
  
  // Items table
  yPos += 45;
  
  const tableData = invoice.items.map((item: any) => [
    item.description,
    item.quantity.toString(),
    `₹${item.rate.toLocaleString()}`,
    `₹${item.total.toLocaleString()}`,
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [17, 153, 142],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
    },
  });
  
  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY;
  
  // Totals section
  yPos = finalY + 10;
  
  const totalsX = 120;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPos);
  doc.text(`₹${invoice.subtotal.toLocaleString()}`, 170, yPos);
  
  if (invoice.discount?.amount > 0) {
    yPos += 6;
    doc.text(`Discount:`, totalsX, yPos);
    doc.text(`-₹${invoice.discount.amount.toLocaleString()}`, 170, yPos);
  }
  
  yPos += 6;
  doc.text(`Tax (${invoice.tax.percentage}%):`, totalsX, yPos);
  doc.text(`₹${invoice.tax.amount.toLocaleString()}`, 170, yPos);
  
  // Total line
  yPos += 8;
  doc.setFillColor(17, 153, 142);
  doc.rect(115, yPos - 5, 80, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total Amount:', totalsX, yPos);
  doc.text(`₹${invoice.total.toLocaleString()}`, 170, yPos);
  
  // Amount paid and due
  yPos += 8;
  doc.setFillColor(240, 240, 240);
  doc.rect(115, yPos - 5, 80, 16, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Amount Paid:', totalsX, yPos);
  doc.text(`₹${invoice.amountPaid.toLocaleString()}`, 170, yPos);
  
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68);
  doc.text('Amount Due:', totalsX, yPos);
  doc.text(`₹${invoice.amountDue.toLocaleString()}`, 170, yPos);
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  
  // Payment details
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Methods:', 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Bank Transfer: Account Name: SmoothCoders | Account No: 123456789 | IFSC: BANK0001234', 15, yPos + 5);
  doc.text('UPI: smoothcoders@paytm', 15, yPos + 10);
  doc.text('Cash/Cheque: Payable to "SmoothCoders"', 15, yPos + 15);
  
  // Payment history if available
  if (invoice.payments && invoice.payments.length > 0) {
    yPos += 25;
    doc.setFont('helvetica', 'bold');
    doc.text('Payment History:', 15, yPos);
    
    invoice.payments.forEach((payment: any, index: number) => {
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${new Date(payment.date).toLocaleDateString()} - ₹${payment.amount.toLocaleString()} via ${payment.method} ${payment.transactionId ? `(Txn: ${payment.transactionId})` : ''}`,
        20,
        yPos
      );
    });
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(17, 153, 142);
  doc.rect(0, pageHeight - 20, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Thank you for your business!', 105, pageHeight - 12, { align: 'center' });
  doc.text(`${companyInfo.website} | ${companyInfo.email} | ${companyInfo.phone}`, 105, pageHeight - 7, { align: 'center' });
  
  return doc;
}

// Preview PDF in browser
export function previewPDF(doc: jsPDF) {
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
}

// Download PDF
export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(filename);
}

// Get PDF as base64
export function getPDFBase64(doc: jsPDF) {
  return doc.output('datauristring');
}
