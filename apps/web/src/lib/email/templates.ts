/**
 * Email templates. Kept as plain functions returning { subject, html } so they
 * stay framework-agnostic and easy to unit test.
 */

function loginUrl(): string {
  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/login`;
}

interface WelcomeEmailInput {
  email: string;
  password: string;
  companyName: string;
  roleLabel: string;
  invitedBy?: string;
}

export function buildWelcomeEmail(input: WelcomeEmailInput): { subject: string; html: string } {
  const url = loginUrl();
  const subject = `You've been added to ${input.companyName} on Productix`;

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:28px 32px 8px;">
                <h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">Welcome to Productix</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 0;font-size:14px;line-height:1.6;color:#374151;">
                <p style="margin:0 0 16px;">
                  ${input.invitedBy ? `${escapeHtml(input.invitedBy)} added you` : "You've been added"}
                  to <strong>${escapeHtml(input.companyName)}</strong> as a <strong>${escapeHtml(input.roleLabel)}</strong>.
                </p>
                <p style="margin:0 0 8px;">Use these credentials to sign in:</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:8px 0 20px;">
                  <tr>
                    <td style="padding:14px 16px;font-size:13px;color:#374151;">
                      <div style="margin-bottom:8px;"><span style="color:#6b7280;">Email:</span> <strong>${escapeHtml(input.email)}</strong></div>
                      <div><span style="color:#6b7280;">Temporary password:</span> <strong style="font-family:monospace;">${escapeHtml(input.password)}</strong></div>
                    </td>
                  </tr>
                </table>
                <a href="${url}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:8px;">Sign in</a>
                <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">
                  For your security, please sign in and change your password from Settings.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;font-size:11px;color:#9ca3af;">
                If you weren't expecting this email, you can safely ignore it.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
