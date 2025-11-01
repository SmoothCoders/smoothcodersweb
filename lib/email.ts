import nodemailer from 'nodemailer';

// Email configuration using Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: 'contact@smoothcoders.com',
    pass: 'Pradipnv@761976',
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server ready to send messages');
  }
});

// Email templates
export const emailTemplates = {
  quotationSent: (data: any) => ({
    subject: `Quotation ${data.quotationNumber} - ${data.projectName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .table th { background: #f0f0f0; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmoothCoders</h1>
            <p>Your Quotation is Ready</p>
          </div>
          <div class="content">
            <h2>Dear ${data.clientName},</h2>
            <p>Thank you for your interest in our services! We're pleased to present your quotation.</p>
            
            <h3>Quotation Details:</h3>
            <ul>
              <li><strong>Quotation Number:</strong> ${data.quotationNumber}</li>
              <li><strong>Project:</strong> ${data.projectName}</li>
              <li><strong>Valid Until:</strong> ${new Date(data.validUntil).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</li>
            </ul>

            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map((item: any) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.rate.toLocaleString()}</td>
                    <td>₹${item.total.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <p class="total">Total Amount: ₹${data.total.toLocaleString()}</p>

            <a href="https://smoothcoders.com/admin/quotations/${data.id}" class="button">View Full Quotation</a>

            <p>If you have any questions or need clarification, please don't hesitate to reach out.</p>
          </div>
          <div class="footer">
            <p>SmoothCoders - Web Development & Digital Solutions</p>
            <p>Email: contact@smoothcoders.com | Phone: +91 123 456 7890</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  invoiceSent: (data: any) => ({
    subject: `Invoice ${data.invoiceNumber} - Payment Due`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .total { font-size: 20px; font-weight: bold; color: #11998e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SmoothCoders</h1>
            <p>Invoice</p>
          </div>
          <div class="content">
            <h2>Dear ${data.clientName},</h2>
            <p>Your invoice is ready. Please find the details below:</p>
            
            <h3>Invoice Details:</h3>
            <ul>
              <li><strong>Invoice Number:</strong> ${data.invoiceNumber}</li>
              <li><strong>Issue Date:</strong> ${new Date(data.issueDate).toLocaleDateString()}</li>
              <li><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</li>
              <li><strong>Payment Status:</strong> ${data.status.toUpperCase()}</li>
            </ul>

            <div class="alert">
              <strong>⚠️ Payment Due:</strong> Please ensure payment is received by ${new Date(data.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            <p class="total">Amount Due: ₹${data.amountDue.toLocaleString()}</p>

            <a href="https://smoothcoders.com/admin/invoices/${data.id}" class="button">View Invoice</a>

            <h3>Payment Methods:</h3>
            <ul>
              <li>Bank Transfer</li>
              <li>UPI: smoothcoders@paytm</li>
              <li>Cash</li>
            </ul>

            <p>Thank you for your business!</p>
          </div>
          <div class="footer">
            <p>SmoothCoders - Web Development & Digital Solutions</p>
            <p>Email: contact@smoothcoders.com | Phone: +91 123 456 7890</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  paymentReceived: (data: any) => ({
    subject: `Payment Received - ${data.invoiceNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Confirmed</h1>
          </div>
          <div class="content">
            <h2>Dear ${data.clientName},</h2>
            
            <div class="success">
              <strong>Thank you!</strong> We have received your payment.
            </div>

            <h3>Payment Details:</h3>
            <ul>
              <li><strong>Invoice:</strong> ${data.invoiceNumber}</li>
              <li><strong>Amount Paid:</strong> ₹${data.amountPaid.toLocaleString()}</li>
              <li><strong>Payment Date:</strong> ${new Date(data.paymentDate).toLocaleDateString()}</li>
              <li><strong>Transaction ID:</strong> ${data.transactionId || 'N/A'}</li>
              <li><strong>Remaining Balance:</strong> ₹${data.remainingBalance.toLocaleString()}</li>
            </ul>

            <p>Your payment has been successfully processed and applied to your account.</p>
            ${data.remainingBalance > 0 ? `<p><strong>Note:</strong> You still have an outstanding balance of ₹${data.remainingBalance.toLocaleString()}</p>` : '<p><strong>Status:</strong> Your invoice is now fully paid. Thank you!</p>'}
          </div>
          <div class="footer">
            <p>SmoothCoders - Web Development & Digital Solutions</p>
            <p>Email: contact@smoothcoders.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  projectAssigned: (data: any) => ({
    subject: `New Project Assignment - ${data.projectName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Project Assignment</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.developerName},</h2>
            <p>You have been assigned to a new project!</p>
            
            <h3>Project Details:</h3>
            <ul>
              <li><strong>Project:</strong> ${data.projectName}</li>
              <li><strong>Client:</strong> ${data.clientName}</li>
              <li><strong>Start Date:</strong> ${new Date(data.startDate).toLocaleDateString()}</li>
              <li><strong>Deadline:</strong> ${new Date(data.endDate).toLocaleDateString()}</li>
              <li><strong>Your Role:</strong> ${data.role}</li>
            </ul>

            <a href="https://smoothcoders.com/admin/projects/${data.projectId}" class="button">View Project</a>

            <p>Please review the project details and start planning your work.</p>
          </div>
          <div class="footer">
            <p>SmoothCoders - Web Development & Digital Solutions</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  projectStatusUpdate: (data: any) => ({
    subject: `Project Update - ${data.projectName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .progress { background: #e0e0e0; border-radius: 10px; height: 30px; margin: 20px 0; }
          .progress-bar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; border-radius: 10px; text-align: center; line-height: 30px; color: white; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Project Progress Update</h1>
          </div>
          <div class="content">
            <h2>Dear ${data.clientName},</h2>
            <p>We have an update on your project:</p>
            
            <h3>${data.projectName}</h3>
            <p><strong>Status:</strong> ${data.status}</p>
            
            <div class="progress">
              <div class="progress-bar" style="width: ${data.progress}%">${data.progress}%</div>
            </div>

            <p>${data.message || 'Work is progressing smoothly.'}</p>

            <p>If you have any questions, feel free to reach out!</p>
          </div>
          <div class="footer">
            <p>SmoothCoders - Web Development & Digital Solutions</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
export async function sendEmail(to: string | string[], template: any) {
  try {
    const mailOptions = {
      from: {
        name: 'SmoothCoders',
        address: 'contact@smoothcoders.com',
      },
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error };
  }
}

// Bulk email function
export async function sendBulkEmail(recipients: string[], template: any) {
  const results = await Promise.allSettled(
    recipients.map(email => sendEmail(email, template))
  );
  
  return {
    total: recipients.length,
    sent: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
    results,
  };
}

export default transporter;
