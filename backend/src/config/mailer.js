import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

export async function sendContactNotification(message) {
  const transporter = getTransporter();
  if (!transporter) return false;

  const recipient =
    process.env.PORTFOLIO_NOTIFICATION_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.SMTP_USER;

  if (!recipient) return false;

  const subject = message.subject?.trim() || 'New portfolio contact message';
  const text = [
    'You received a new message through your portfolio website.',
    '',
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message.message
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
      <h2>New portfolio contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipient,
    replyTo: message.email,
    subject: `[Portfolio Contact] ${subject}`,
    text,
    html
  });

  return true;
}
