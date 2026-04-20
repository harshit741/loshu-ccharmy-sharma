import { getPackageById } from '@/lib/packages'
import type { Order } from '@/lib/supabase'
import { THEME } from '@/lib/theme'
import {
  escapeHtml,
  getBookingNotificationRecipient,
  getMailFromValue,
  getMailTransporter,
} from '@/lib/mail'
import { generateReceiptPdfAttachment } from '@/utils/generateReceiptServer'

function formatPrice(amount: number, currency: string) {
  if (currency === 'INR') {
    return `Rs. ${amount.toLocaleString('en-IN')}`
  }

  return `${currency} ${amount.toLocaleString('en-IN')}`
}

function detailRow(label: string, value?: string | null) {
  if (!value) {
    return ''
  }

  return `<p style="margin:0 0 10px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
}

export async function sendBookingConfirmationEmails(order: Order) {
  const transporter = getMailTransporter()
  const from = getMailFromValue()
  const adminRecipient = getBookingNotificationRecipient()
  const packageDetails = getPackageById(order.package_id)
  const amount = formatPrice(order.amount, order.currency)
  const deliveryTime = packageDetails?.deliveryTime || 'within the selected package timeline'
  const receiptAttachment = await generateReceiptPdfAttachment(order)
  const featureList = packageDetails?.features.length
    ? `<ul style="margin:10px 0 0;padding-left:20px;">${packageDetails.features
        .map(feature => `<li style="margin-bottom:6px;">${escapeHtml(feature)}</li>`)
        .join('')}</ul>`
    : ''

  const adminEmail = transporter.sendMail({
    from,
    to: adminRecipient,
    subject: `New booking confirmed - ${order.package_name}`,
    html: `
      <h2 style="margin-bottom:16px;">New Paid Booking</h2>
      ${detailRow('Customer', order.customer_name)}
      ${detailRow('Email', order.customer_email)}
      ${detailRow('Phone', order.customer_phone)}
      ${detailRow('Package', order.package_name)}
      ${detailRow('Amount', amount)}
      ${detailRow('Date of Birth', order.numerology_dob)}
      ${detailRow('Order ID', order.id)}
      ${detailRow('Razorpay Payment ID', order.razorpay_payment_id)}
      ${detailRow('Notes', order.notes)}
    `,
  })

  const customerEmail = transporter.sendMail({
    from,
    to: order.customer_email,
    subject: `Your ${order.package_name} booking is confirmed`,
    attachments: [receiptAttachment],
    html: `
      <p>Hi ${escapeHtml(order.customer_name)},</p>
      <p>Thank you for booking your numerology reading with <strong>${escapeHtml(THEME.site.name)}</strong>.</p>
      <p>Your payment has been received and your booking is now confirmed.</p>
      <div style="margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px;">
        ${detailRow('Package', order.package_name)}
        ${detailRow('Amount Paid', amount)}
        ${detailRow('Order ID', order.id)}
        ${detailRow('Date of Birth', order.numerology_dob)}
        ${detailRow('Phone', order.customer_phone)}
      </div>
      <p><strong>Your booking receipt is attached as a PDF</strong> for your records.</p>
      <p>Your report is typically delivered in ${escapeHtml(deliveryTime)}.</p>
      ${featureList ? `<p style="margin-bottom:8px;"><strong>Your package includes:</strong></p>${featureList}` : ''}
      <p>We will share your PDF report by email, and if your package includes a consultation call, the scheduling details will follow as well.</p>
      <p>If you need any help, reply to this email or contact us at ${escapeHtml(THEME.site.email)}.</p>
      <p style="margin-top:20px;">Warm regards,<br/>${escapeHtml(THEME.site.numerologistName)}</p>
    `,
  })

  const results = await Promise.allSettled([adminEmail, customerEmail])

  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  )

  failures.forEach(failure => {
    console.error('Booking email delivery failed:', failure.reason)
  })

  if (failures.length === results.length) {
    throw new Error('Unable to send booking emails')
  }
}
