import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

interface IEmail {
  email: string
  name: string
  token: string
}

const baseStyles = `background-color: #1c2c34; color: #ffffff; font-family: Arial, sans-serif; padding: 24px; border-radius: 8px;`
const linkStyle = `display: inline-block; margin: 16px 0; padding: 10px 18px; background-color: #a997f1; color: #1c2c34; text-decoration: none; font-weight: bold; border-radius: 4px;`
const logoSection = `<div style=\"display: flex; align-items: center; margin-bottom: 20px;\"><div style=\"width: 40px; height: 40px; background: linear-gradient(70deg, #a997f1 80%, #c424d4 20%); border-radius: 8px; margin-right: 12px;\"></div><h1 style=\"color: white; font-size: 20px; margin: 0;\">UpTask</h1></div>`

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'UpTask - Confirm your account',
      html: `
        <div style="${baseStyles}">
          ${logoSection}
          <h2>Welcome, ${user.name} 👋</h2>
          <p>To complete your registration, please confirm your account:</p>
          <a href="${process.env.FRONTEND_URL}/auth/confirm-account" style="${linkStyle}">Confirm Account</a>
          <p>Or enter this code:</p>
          <p style="font-size: 18px;"><strong>${user.token}</strong></p>
          <p style="color: #aaa; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `
    })
  }

  static sendPasswordResetToken = async (user: IEmail) => {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'UpTask - Reset your password',
      html: `
        <div style="${baseStyles}">
          ${logoSection}
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. If you made this request, click the button below:</p>
          <a href="${process.env.FRONTEND_URL}/auth/new-password" style="${linkStyle}">Reset Password</a>
          <p>Or enter this code:</p>
          <p style="font-size: 18px;"><strong>${user.token}</strong></p>
          <p style="color: #aaa; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, feel free to ignore it.</p>
        </div>
      `
    })
  }
}
