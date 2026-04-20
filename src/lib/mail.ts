import nodemailer from 'nodemailer'
import { THEME } from '@/lib/theme'

function getRequiredEnv(name: 'SMTP_HOST' | 'SMTP_PORT' | 'SMTP_USER' | 'SMTP_PASS') {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name} environment variable`)
  }

  return value
}

let transporter: nodemailer.Transporter | null = null

export function getMailTransporter() {
  if (!transporter) {
    const port = Number(getRequiredEnv('SMTP_PORT'))

    transporter = nodemailer.createTransport({
      host: getRequiredEnv('SMTP_HOST'),
      port,
      secure: port === 465,
      auth: {
        user: getRequiredEnv('SMTP_USER'),
        pass: getRequiredEnv('SMTP_PASS'),
      },
    })
  }

  return transporter
}

export function getMailSender() {
  return {
    name: process.env.SMTP_FROM_NAME || THEME.site.name,
    email: process.env.SMTP_USER || getRequiredEnv('SMTP_USER'),
  }
}

export function getMailFromValue() {
  const sender = getMailSender()
  return `"${sender.name}" <${sender.email}>`
}

export function getEnquiryNotificationRecipient() {
  return process.env.ENQUIRY_BOOKING_NOTIFICATION_EMAIL || getRequiredEnv('SMTP_USER')
}

export function getBookingNotificationRecipient() {
  return process.env.BOOKING_NOTIFICATION_EMAIL || getRequiredEnv('SMTP_USER')
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
