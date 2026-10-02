function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function renderActionEmail(input: {
  name: string;
  url: string;
  subject: string;
  heading: string;
  description: string;
  action: string;
  fallback: string;
}) {
  const name = escapeHtml(input.name.trim() || "there");
  const url = escapeHtml(input.url);

  return {
    text: `${input.heading}\n\nHello ${input.name.trim() || "there"},\n\n${input.description}\n\n${input.action}: ${input.url}\n\nIf you did not request this, you can ignore this email.`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(input.subject)}</title>
  </head>
  <body style="margin:0;background:#f4f6f8;color:#17212b;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #dce2e8;">
          <tr><td style="padding:28px 32px 12px;font-size:14px;font-weight:700;color:#17212b;">der.my.id</td></tr>
          <tr><td style="padding:8px 32px 32px;">
            <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;">${escapeHtml(input.heading)}</h1>
            <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hello ${name},</p>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">${escapeHtml(input.description)}</p>
            <p style="margin:0 0 28px;">
              <a href="${url}" style="display:inline-block;padding:12px 18px;background:#17212b;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">${escapeHtml(input.action)}</a>
            </p>
            <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#52606d;">${escapeHtml(input.fallback)}:</p>
            <p style="margin:0 0 20px;font-size:13px;line-height:1.6;overflow-wrap:anywhere;"><a href="${url}" style="color:#176b87;">${url}</a></p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#52606d;">If you did not request this, you can ignore this email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
  };
}

export function renderVerificationEmail(name: string, url: string) {
  return renderActionEmail({
    name,
    url,
    subject: "Verify your der.my.id email address",
    heading: "Verify your email address",
    description: "Confirm your email address to finish setting up your der.my.id account.",
    action: "Verify email",
    fallback: "If the button does not work, open this link",
  });
}

export function renderPasswordResetEmail(name: string, url: string) {
  return renderActionEmail({
    name,
    url,
    subject: "Reset your der.my.id password",
    heading: "Reset your password",
    description: "Use this link to choose a new password for your der.my.id account.",
    action: "Reset password",
    fallback: "If the button does not work, open this link",
  });
}