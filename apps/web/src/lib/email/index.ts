import "server-only";
import sgMail from "@sendgrid/mail";

/**
 * SendGrid email helper.
 *
 * Configured via env:
 *   SENDGRID_API_KEY   - the SendGrid API key
 *   SENDGRID_FROM_EMAIL - a *verified* sender address (required by SendGrid)
 *   SENDGRID_FROM_NAME  - optional friendly from-name
 *
 * If the API key is missing we no-op (and log) rather than throwing, so that
 * user-creation flows still succeed in environments where email isn't set up.
 */

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL || "no-reply@productix.io";
const fromName = process.env.SENDGRID_FROM_NAME || "Productix";

let configured = false;
function ensureConfigured(): boolean {
  if (!apiKey) return false;
  if (!configured) {
    sgMail.setApiKey(apiKey);
    configured = true;
  }
  return true;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send a single email. Returns `{ sent: boolean; error?: string }` and never
 * throws, so callers can treat email as best-effort.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; error?: string }> {
  if (!ensureConfigured()) {
    console.warn("[email] SENDGRID_API_KEY not set — skipping email to", input.to);
    return { sent: false, error: "Email is not configured." };
  }

  try {
    await sgMail.send({
      to: input.to,
      from: { email: fromEmail, name: fromName },
      subject: input.subject,
      text: input.text ?? stripHtml(input.html),
      html: input.html,
    });
    return { sent: true };
  } catch (error: any) {
    const detail =
      error?.response?.body?.errors?.[0]?.message ?? error?.message ?? "Unknown error";
    console.error("[email] Failed to send to", input.to, "—", detail);
    return { sent: false, error: detail };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
