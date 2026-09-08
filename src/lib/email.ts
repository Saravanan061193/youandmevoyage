import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || 'info@discoverysafaris.com';
const SMTP_PASS = (process.env.SMTP_PASS || 'yniy tolz fqxr ihcs').replace(/\s+/g, '');
const SMTP_FROM = process.env.SMTP_FROM || '"Discovery Safaris Namibia" <info@discoverysafaris.com>';

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
      subject: '🔒 Discovery Safaris Admin - Security Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #141210; color: #fdfbf7; padding: 30px; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1px solid #c5a059;">
          <h2 style="color: #c5a059; margin-top: 0; font-family: Georgia, serif;">Discovery Safaris Namibia</h2>
          <p style="color: #d1c7b8; font-size: 14px;">You requested to reset your Admin Control Panel password.</p>
          <div style="background-color: #1e1b18; border: 1px solid #c5a059; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="color: #8c8273; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">Your Security OTP Verification Code</span>
            <strong style="color: #c5a059; font-size: 32px; font-family: monospace; letter-spacing: 6px;">${otpCode}</strong>
          </div>
          <p style="color: #a79d91; font-size: 12px; line-height: 1.5;">This code will expire in 10 minutes. If you did not request this password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #383128; margin: 20px 0;" />
          <p style="color: #756e63; font-size: 11px; text-align: center;">© Discovery Safaris Namibia · Private Luxury Expeditions</p>
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
