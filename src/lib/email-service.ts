/**
 * Email Service
 *
 * Send emails via SendGrid through Firebase Extension
 * Emails are queued in Firestore 'mail' collection
 */

import {
  collection,
  addDoc,
  getFirestore,
  Timestamp,
} from 'firebase/firestore';
import { app } from './firebase';
import { createEngagement } from './engagement-service';

const db = getFirestore(app);
const MAIL_COLLECTION = 'mail';

export interface EmailTemplate {
  templateId: string;
  data: Record<string, any>;
}

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  template?: EmailTemplate;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
    type?: string;
  }>;
}

/**
 * Send email via SendGrid (through Firebase Extension)
 *
 * Creates document in 'mail' collection which triggers SendGrid extension
 */
export async function sendEmail(options: EmailOptions): Promise<string> {
  const {to, cc, bcc, subject, text, html, template, replyTo, attachments} = options;

  // Build email document
  const emailDoc: any = {
    to: Array.isArray(to) ? to : [to],
    message: {
      subject,
      text,
      html,
    },
  };

  // Add optional fields
  if (cc) {
    emailDoc.cc = Array.isArray(cc) ? cc : [cc];
  }

  if (bcc) {
    emailDoc.bcc = Array.isArray(bcc) ? bcc : [bcc];
  }

  if (replyTo) {
    emailDoc.replyTo = replyTo;
  }

  if (template) {
    emailDoc.template = {
      name: template.templateId,
      data: template.data,
    };
  }

  if (attachments && attachments.length > 0) {
    emailDoc.message.attachments = attachments;
  }

  // Add to mail queue
  const docRef = await addDoc(collection(db, MAIL_COLLECTION), emailDoc);

  return docRef.id;
}

/**
 * Send templated email with engagement tracking
 */
export async function sendTemplatedEmail(
  to: string,
  templateId: string,
  templateData: Record<string, any>,
  options?: {
    userId?: string;
    trackEngagement?: boolean;
  }
): Promise<{emailId: string; engagementId?: string}> {
  // Send email
  const emailId = await sendEmail({
    to,
    template: {
      templateId,
      data: templateData,
    },
  });

  // Track engagement if enabled
  let engagementId: string | undefined;

  if (options?.trackEngagement && options?.userId) {
    engagementId = await createEngagement({
      eventType: 'email_sent',
      source: 'email',
      contactEmail: to,
      userId: options.userId,
      timestamp: new Date(),
      metadata: {
        emailId,
        templateId,
        subject: templateData.subject || 'Email from RealDeal',
      },
    });
  }

  return {emailId, engagementId};
}

/**
 * Send welcome email to new contact
 */
export async function sendWelcomeEmail(
  to: string,
  contactName: string,
  projectType: string,
  userId: string
): Promise<{emailId: string; engagementId: string}> {
  return await sendTemplatedEmail(
    to,
    'realdeal-welcome', // SendGrid template ID
    {
      contactName,
      projectType,
    },
    {
      userId,
      trackEngagement: true,
    }
  );
}

/**
 * Send 7-day follow-up email
 */
export async function send7DayFollowUp(
  to: string,
  contactName: string,
  userId: string
): Promise<{emailId: string; engagementId: string}> {
  return await sendTemplatedEmail(
    to,
    'realdeal-followup-7day',
    {
      contactName,
    },
    {
      userId,
      trackEngagement: true,
    }
  );
}

/**
 * Send 30-day check-in email
 */
export async function send30DayCheckIn(
  to: string,
  contactName: string,
  userId: string
): Promise<{emailId: string; engagementId: string}> {
  return await sendTemplatedEmail(
    to,
    'realdeal-checkin-30day',
    {
      contactName,
    },
    {
      userId,
      trackEngagement: true,
    }
  );
}

/**
 * Send deal closed thank you email
 */
export async function sendDealClosedEmail(
  to: string,
  contactName: string,
  dealValue: number,
  userId: string
): Promise<{emailId: string; engagementId: string}> {
  return await sendTemplatedEmail(
    to,
    'realdeal-closed-thankyou',
    {
      contactName,
      dealValue: dealValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    },
    {
      userId,
      trackEngagement: true,
    }
  );
}

/**
 * Send bulk email (newsletter, announcement)
 */
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string,
  options?: {
    text?: string;
    userId?: string;
    trackEngagements?: boolean;
  }
): Promise<string[]> {
  const emailIds: string[] = [];

  // Send to each recipient (SendGrid batches them)
  for (const to of recipients) {
    const emailId = await sendEmail({
      to,
      subject,
      html,
      text: options?.text,
    });

    emailIds.push(emailId);

    // Track engagement if enabled
    if (options?.trackEngagements && options?.userId) {
      await createEngagement({
        eventType: 'email_sent',
        source: 'email',
        contactEmail: to,
        userId: options.userId,
        timestamp: new Date(),
        metadata: {
          emailId,
          subject,
          isBulk: true,
        },
      });
    }
  }

  return emailIds;
}

/**
 * Test email sending
 */
export async function sendTestEmail(to: string): Promise<string> {
  return await sendEmail({
    to,
    subject: 'Test Email from RealDeal CRM',
    html: `
      <h1>Success!</h1>
      <p>Your SendGrid integration is working!</p>
      <p>This test email was sent via Firebase Extension + SendGrid.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `,
    text: 'Success! Your SendGrid integration is working!',
  });
}
