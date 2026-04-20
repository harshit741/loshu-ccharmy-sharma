export const runtime = 'nodejs'

import { z } from 'zod'
import { updateAdminOrder } from '@/lib/supabase-admin'

const failureSchema = z.object({
  orderId: z.string().uuid('Invalid order id'),
  razorpay_payment_id: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedBody = failureSchema.safeParse(body)

    if (!parsedBody.success) {
      return Response.json(
        { error: parsedBody.error.issues[0]?.message || 'Invalid payment failure payload' },
        { status: 400 }
      )
    }

    const { orderId, razorpay_payment_id } = parsedBody.data
    await updateAdminOrder(orderId, {
      status: 'failed',
      razorpay_payment_id,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Record payment failure error:', error)
    return Response.json({ error: 'Unable to record payment failure right now' }, { status: 500 })
  }
}
