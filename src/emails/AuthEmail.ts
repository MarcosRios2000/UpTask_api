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
      from: 'UpTask <admin@uptask.com>',
      to: user.email,
      subject: 'UpTask - Confirm your account',
      html: `<p>Hi ${user.name}, welcome to UpTask!</p>
        <p>Click the link below to confirm your account:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm account</a>
        <p>Use this code: <strong>${user.token}</strong></p>
        <p>This code will expire in 10 minutes.</p>`
    })
  }

  static sendPasswordResetToken = async (user: IEmail) => {
    await resend.emails.send({
      from: 'UpTask <admin@uptask.com>',
      to: user.email,
      subject: 'UpTask - Reset your password',
      html: `<p>Hi ${user.name}, it looks like you requested to reset your password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset password</a>
        <p>Use this code: <strong>${user.token}</strong></p>
        <p>This code will expire in 10 minutes.</p>`
    })
  }
}
