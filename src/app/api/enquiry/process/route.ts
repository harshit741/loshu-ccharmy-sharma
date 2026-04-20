export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { enquirySchema } from '@/lib/enquiry'
import {
  getEnquiryNotificationRecipient,
  getMailFromValue,
  getMailTransporter,
} from '@/lib/mail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.website) {
      return Response.json({ success: true })
    }

    const parsedBody = enquirySchema.safeParse(body)
    if (!parsedBody.success) {
      return Response.json(
        { error: parsedBody.error.issues[0]?.message || 'Invalid request data' },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = parsedBody.data

    const { error: dbError } = await supabase
      .from('enquiries')
      .insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
      })

    if (dbError) {
      console.error('Enquiry DB error:', dbError)
      return Response.json({ error: 'Database error' }, { status: 500 })
    }

    const transporter = getMailTransporter()
    const from = getMailFromValue()

    await transporter.sendMail({
      from,
      to: getEnquiryNotificationRecipient(),
      subject: `New Enquiry - ${subject}`,
      html: `
        <h2>New Enquiry Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || '-'}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    })

    await transporter.sendMail({
      from,
      to: email,
      subject: 'We received your enquiry',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting <b>CcharmyShah</b>.</p>
        <p>We have received your enquiry and will respond within 24 hours.</p>
        <br/>
        <p>Warm regards,<br/>CcharmyShah</p>
      `,
    })

    console.log(`Receipt send to ${email}`)

    return Response.json({ success: true })
  } catch (error) {
    console.error('Enquiry processing error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
