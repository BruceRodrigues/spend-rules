import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Thanks for signing up! Click the link below to verify your email and activate your account:</p>
        <p>
          <a href="${verificationUrl}" style="background-color: #006FEE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
        <p style="color: #666; font-size: 14px;">If you did not sign up for this account, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  // Placeholder for future use
}
