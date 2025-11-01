// Calendar integration utilities for generating .ics files and calendar events

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  url?: string;
  organizer?: {
    name: string;
    email: string;
  };
  attendees?: Array<{
    name: string;
    email: string;
  }>;
}

// Generate .ics file content
export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const escapeText = (text: string): string => {
    return text.replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SmoothCoders//Business Management System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@smoothcoders.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${escapeText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeText(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.organizer) {
    lines.push(`ORGANIZER;CN=${event.organizer.name}:mailto:${event.organizer.email}`);
  }

  if (event.attendees && event.attendees.length > 0) {
    event.attendees.forEach(attendee => {
      lines.push(`ATTENDEE;CN=${attendee.name}:mailto:${attendee.email}`);
    });
  }

  lines.push('STATUS:CONFIRMED');
  lines.push('SEQUENCE:0');
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

// Download .ics file
export function downloadICSFile(event: CalendarEvent, filename?: string) {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate Google Calendar URL
export function generateGoogleCalendarURL(event: CalendarEvent): string {
  const formatDateGoogle = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateGoogle(event.startDate)}/${formatDateGoogle(event.endDate)}`,
  });

  if (event.description) {
    params.append('details', event.description);
  }

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate Outlook Calendar URL
export function generateOutlookCalendarURL(event: CalendarEvent): string {
  const formatDateOutlook = (date: Date): string => {
    return date.toISOString();
  };

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: formatDateOutlook(event.startDate),
    enddt: formatDateOutlook(event.endDate),
  });

  if (event.description) {
    params.append('body', event.description);
  }

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Project deadline event
export function createProjectDeadlineEvent(project: any): CalendarEvent {
  return {
    title: `Project Deadline: ${project.name}`,
    description: `Project: ${project.name}\nClient: ${project.client?.name || 'N/A'}\nStatus: ${project.status}\nProgress: ${project.progress}%`,
    location: 'Online',
    startDate: new Date(project.endDate),
    endDate: new Date(new Date(project.endDate).getTime() + 60 * 60 * 1000), // 1 hour duration
    url: `https://smoothcoders.com/admin/projects/${project._id}`,
    organizer: {
      name: 'SmoothCoders',
      email: 'contact@smoothcoders.com',
    },
  };
}

// Meeting event
export function createMeetingEvent(meeting: {
  title: string;
  description?: string;
  startDate: Date;
  duration: number; // in minutes
  client?: any;
  location?: string;
}): CalendarEvent {
  const endDate = new Date(meeting.startDate.getTime() + meeting.duration * 60 * 1000);
  
  return {
    title: meeting.title,
    description: meeting.description,
    location: meeting.location || 'Online Meeting',
    startDate: meeting.startDate,
    endDate: endDate,
    organizer: {
      name: 'SmoothCoders',
      email: 'contact@smoothcoders.com',
    },
    attendees: meeting.client ? [{
      name: meeting.client.name,
      email: meeting.client.email,
    }] : undefined,
  };
}

// Invoice due date reminder
export function createInvoiceDueEvent(invoice: any): CalendarEvent {
  const reminderDate = new Date(invoice.dueDate);
  reminderDate.setDate(reminderDate.getDate() - 3); // 3 days before due date

  return {
    title: `Invoice Due: ${invoice.invoiceNumber}`,
    description: `Invoice: ${invoice.invoiceNumber}\nClient: ${invoice.client?.name || 'N/A'}\nAmount Due: ₹${invoice.amountDue.toLocaleString()}\n\nPlease ensure payment is received by the due date.`,
    startDate: reminderDate,
    endDate: new Date(reminderDate.getTime() + 30 * 60 * 1000), // 30 minutes
    url: `https://smoothcoders.com/admin/invoices/${invoice._id}`,
    organizer: {
      name: 'SmoothCoders',
      email: 'contact@smoothcoders.com',
    },
  };
}

// Quotation follow-up reminder
export function createQuotationFollowUpEvent(quotation: any): CalendarEvent {
  const followUpDate = new Date(quotation.createdAt);
  followUpDate.setDate(followUpDate.getDate() + 7); // 7 days after quotation sent

  return {
    title: `Follow up: Quotation ${quotation.quotationNumber}`,
    description: `Quotation: ${quotation.quotationNumber}\nProject: ${quotation.projectName}\nClient: ${quotation.client?.name || 'N/A'}\nAmount: ₹${quotation.total.toLocaleString()}\n\nFollow up with client regarding quotation approval.`,
    startDate: followUpDate,
    endDate: new Date(followUpDate.getTime() + 30 * 60 * 1000),
    url: `https://smoothcoders.com/admin/quotations/${quotation._id}`,
    organizer: {
      name: 'SmoothCoders',
      email: 'contact@smoothcoders.com',
    },
  };
}

// Developer availability event
export function createDeveloperAvailabilityEvent(developer: any, unavailableDate: Date, duration: number = 8): CalendarEvent {
  const endDate = new Date(unavailableDate.getTime() + duration * 60 * 60 * 1000);

  return {
    title: `${developer.name} - Unavailable`,
    description: `Developer: ${developer.name}\nRole: ${developer.role}\nReason: Leave/Unavailable`,
    startDate: unavailableDate,
    endDate: endDate,
    organizer: {
      name: 'SmoothCoders',
      email: 'contact@smoothcoders.com',
    },
  };
}
