import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

interface IEmail {
  email: string
  name: string
  token: string
}
export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    await resend.emails.send({
      from: 'UpTask <no-reply@marcosrios.xyz>',
      to: user.email,
      subject: 'UpTask - Confirm your account',
      html: `
      <div style="background-color: #1c2c34; color: #ffffff; font-family: Arial, sans-serif; padding: 24px; border-radius: 8px;">
        <h2>Welcome, ${user.name} 👋</h2>
        <p>To complete your registration, please confirm your account:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account"
           style="display: inline-block; margin: 16px 0; padding: 10px 18px; background-color: #a997f1; color: #1c2c34; text-decoration: none; font-weight: bold; border-radius: 4px;">
           Confirm Account
        </a>
        <p>Or enter this code:</p>
        <p style="font-size: 18px;"><strong>${user.token}</strong></p>
        <p style="color: #aaa; font-size: 14px;">This code will expire in 10 minutes.</p>
      </div>
    `
    })
  }

  static sendPasswordResetToken = async (user: IEmail) => {
    await resend.emails.send({
      from: 'UpTask <no-reply@marcosrios.xyz>',
      to: user.email,
      subject: 'UpTask - Reset your password',
      html: `
      <div style="background-color: #1c2c34; color: #ffffff; font-family: Arial, sans-serif; padding: 24px; border-radius: 8px;">
        <h2>Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. If you made this request, click the button below:</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password"
           style="display: inline-block; margin: 16px 0; padding: 10px 18px; background-color: #a997f1; color: #1c2c34; text-decoration: none; font-weight: bold; border-radius: 4px;">
           Reset Password
        </a>
        <p>Or enter this code:</p>
        <p style="font-size: 18px;"><strong>${user.token}</strong></p>
        <p style="color: #aaa; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, feel free to ignore it.</p>
      </div>
    `
    })
  }
}
