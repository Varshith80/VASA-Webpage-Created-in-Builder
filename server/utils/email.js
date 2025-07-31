// Email utility for VASA platform
// This is a placeholder implementation - in production, integrate with services like SendGrid, AWS SES, or Mailgun

export const sendEmail = async ({ to, subject, template, data }) => {
  // For development, just log the email details
  console.log("📧 Email would be sent:", {
    to,
    subject,
    template,
    data,
  });

  // In production, implement actual email sending:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html: await renderTemplate(template, data)
  };
  
  return await sgMail.send(msg);
  */

  return Promise.resolve({ success: true });
};

// Template rendering function
const renderTemplate = async (template, data) => {
  // Simple template system - in production, use a proper template engine
  const templates = {
    "email-verification": `
      <h2>Welcome to VASA, ${data.name}!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${data.verificationUrl}">Verify Email Address</a>
      <p>This link will expire in 24 hours.</p>
    `,
    "password-reset": `
      <h2>Password Reset Request</h2>
      <p>Hello ${data.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${data.resetUrl}">Reset Password</a>
      <p>This link will expire in ${data.expiresIn}.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  return templates[template] || "<p>Template not found</p>";
};

export default { sendEmail };
