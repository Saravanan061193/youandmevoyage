import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || 'youandmevoyage@gmail.com';
const SMTP_PASS = (process.env.SMTP_PASS || 'yboa opkn arrj odys').replace(/\s+/g, '');
const SMTP_FROM = process.env.SMTP_FROM || '"You & Me - Independent Voyage" <youandmevoyage@gmail.com>';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface SendResetEmailParams {
  toEmail: string;
  otpCode: string;
}

export async function sendResetCodeEmail({ toEmail, otpCode }: SendResetEmailParams) {
  try {
    const mailOptions = {
      from: SMTP_FROM,
      to: toEmail,
      subject: '🔒 You & Me Voyage Admin - Security Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #141210; color: #fdfbf7; padding: 30px; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1px solid #c5a059;">
          <h2 style="color: #c5a059; margin-top: 0; font-family: Georgia, serif;">You & Me – Independent Voyage</h2>
          <p style="color: #d1c7b8; font-size: 14px;">You requested to reset your Admin Control Panel password.</p>
          <div style="background-color: #1e1b18; border: 1px solid #c5a059; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="color: #8c8273; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">Your Security OTP Verification Code</span>
            <strong style="color: #c5a059; font-size: 32px; font-family: monospace; letter-spacing: 6px;">${otpCode}</strong>
          </div>
          <p style="color: #a79d91; font-size: 12px; line-height: 1.5;">This code will expire in 10 minutes. If you did not request this password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #383128; margin: 20px 0;" />
          <p style="color: #756e63; font-size: 11px; text-align: center;">© You & Me – Independent Voyage · Private Journeys</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[GMAIL_SMTP] Reset Code email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[GMAIL_SMTP_ERROR] Failed to send email via Gmail App Password:', error);
    return { success: false, error: error.message || 'SMTP Error' };
  }
}

interface SendInquiryEmailParams {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  destination?: string;
  travelers?: number;
  duration?: string;
  message?: string;
}

export async function sendInquiryNotificationEmail(data: SendInquiryEmailParams) {
  try {
    const mailOptions = {
      from: SMTP_FROM,
      to: SMTP_USER,
      subject: `✨ New Travel Inquiry Received from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #0284c7;">
          <h2 style="color: #38bdf8; margin-top: 0; font-family: Georgia, serif;">You & Me – Independent Voyage</h2>
          <h3 style="color: #f1f5f9; border-bottom: 1px solid #334155; padding-bottom: 10px;">New Customer Travel Inquiry</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; color: #e2e8f0;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 140px;"><strong>Customer Name:</strong></td><td style="padding: 8px 0;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;"><strong>Email Address:</strong></td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #38bdf8;">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;"><strong>Phone:</strong></td><td style="padding: 8px 0;">${data.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;"><strong>Tour Category:</strong></td><td style="padding: 8px 0;">${data.category || 'General Safari Inquiry'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;"><strong>Destination:</strong></td><td style="padding: 8px 0;">${data.destination || 'Not Specified'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;"><strong>Travelers Count:</strong></td><td style="padding: 8px 0;">${data.travelers || 2} Persons</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;"><strong>Duration:</strong></td><td style="padding: 8px 0;">${data.duration || 'Flexible'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;"><strong>Message / Details:</strong></td><td style="padding: 8px 0;">${data.message || 'No additional message provided.'}</td></tr>
          </table>

          <div style="margin-top: 25px; text-align: center;">
            <a href="mailto:${data.email}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reply to Customer</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 25px 0 15px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center;">© You & Me – Independent Voyage · Automated Inquiry Notification System</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[INQUIRY_SMTP] Inquiry notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[INQUIRY_SMTP_ERROR] Failed to send inquiry email:', error);
    return { success: false, error: error.message || 'SMTP Error' };
  }
}

