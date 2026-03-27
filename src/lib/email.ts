import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendOTP(email: string, otp: string) {
  const mailOptions = {
    from: `"Moodify AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${otp} is your Moodify verification code`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #a855f7; text-align: center;">Welcome to Moodify</h2>
        <p>Thank you for signing up! Use the verification code below to complete your registration:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">Moodify AI Music App • Your Personal Soundscape</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] OTP sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL] Error sending OTP:', error);
    return { success: false, error };
  }
}
