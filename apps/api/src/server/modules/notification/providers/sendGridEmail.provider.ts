import sgMail from "@sendgrid/mail";
import type {
  NotificationProvider,
  NotificationMessage,
  NotificationSendResult,
} from "../provider";

/**
 * SendGrid email provider
 * Sends emails via SendGrid's v3 API
 */
export class SendGridEmailProvider implements NotificationProvider {
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey) {
      throw new Error(
        "Missing SendGrid configuration: SENDGRID_API_KEY must be set"
      );
    }

    if (!fromEmail) {
      throw new Error(
        "Missing SendGrid from email: SENDGRID_FROM_EMAIL must be set"
      );
    }

    sgMail.setApiKey(apiKey);

    // Optional: Set data residency for EU (uncomment if needed)
    // sgMail.setDataResidency('eu');

    this.fromEmail = fromEmail;
  }

  async send(message: NotificationMessage): Promise<NotificationSendResult> {
    // recipientRef for EMAIL channel should be an email address
    const toEmail = message.recipientRef;

    // Validate email format
    if (!this.isValidEmail(toEmail)) {
      throw new Error(`Invalid email address: ${toEmail}`);
    }

    // Build email message
    // For now, we'll use simple text/html from payload
    // If you use SendGrid dynamic templates, you can map templateId to SendGrid template ID
    const emailContent = this.buildEmailContent(message);

    const msg = {
      to: toEmail,
      from: this.fromEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
      // If using SendGrid dynamic templates, uncomment and use:
      // templateId: message.templateId, // Map to SendGrid template ID
      // dynamicTemplateData: message.payload,
    };

    try {
      const [response] = await sgMail.send(msg);

      // SendGrid returns response with headers containing message ID
      const messageId = response.headers["x-message-id"] || undefined;

      return {
        provider: "sendgrid-email",
        providerMessageId: messageId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to send email via SendGrid: ${errorMessage}`);
    }
  }

  /**
   * Build email content from message payload
   * Assumes payload contains subject, text, and html fields
   */
  private buildEmailContent(message: NotificationMessage): {
    subject: string;
    text: string;
    html: string;
  } {
    const payload = message.payload;

    // If payload is an object with email fields, use them
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const payloadObj = payload as Record<string, unknown>;
      return {
        subject:
          (payloadObj.subject as string) ||
          (payloadObj.title as string) ||
          "Notification",
        text: (payloadObj.text as string) || (payloadObj.body as string) || "",
        html:
          (payloadObj.html as string) ||
          (payloadObj.body as string) ||
          (payloadObj.text as string) ||
          "",
      };
    }

    // Fallback: use templateId as subject, payload as text/html
    return {
      subject: message.templateId || "Notification",
      text: String(payload || ""),
      html: String(payload || ""),
    };
  }

  /**
   * Basic email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
