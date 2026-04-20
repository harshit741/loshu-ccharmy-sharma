export const runtime = 'nodejs'

import { sendBookingConfirmationEmails } from '@/lib/booking-email'
import { captureRazorpayPayment, verifyRazorpayWebhookSignature } from '@/lib/razorpay'
import {
  getAdminOrderByRazorpayOrderId,
  updateAdminOrderByRazorpayOrderId,
  updateAdminOrderToPaidByRazorpayOrderIdOnce,
} from '@/lib/supabase-admin'
import type { Order } from '@/lib/supabase'

interface RazorpayWebhookPayload {
  event: string
  payload?: {
    payment?: {
      entity?: {
        id?: string
        order_id?: string
        status?: string
      }
    }
    refund?: {
      entity?: {
        payment_id?: string
      }
    }
  }
}

function getOrderStatusFromEvent(event: string, paymentStatus?: string): Order['status'] {
  if (event === 'payment.captured') return 'paid'
  if (event === 'payment.failed') return 'failed'
  if (event === 'refund.processed') return 'refunded'
  if (paymentStatus === 'authorized') return 'authorized'
  return 'created'
}

async function capturePaymentIfNeeded(input: {
  paymentId: string
  amount: number
  currency: string
}) {
  try {
    await captureRazorpayPayment({
      paymentId: input.paymentId,
      amount: input.amount,
      currency: input.currency,
    })
    return 'paid' as const
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (message.includes('already been captured')) {
      return 'paid' as const
    }
    throw error
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return Response.json({ error: 'Missing webhook signature' }, { status: 400 })
  }

  const rawBody = await req.text()

  try {
    const isValidSignature = verifyRazorpayWebhookSignature(rawBody, signature)
    if (!isValidSignature) {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const body = JSON.parse(rawBody) as RazorpayWebhookPayload
    const payment = body.payload?.payment?.entity
    const razorpayOrderId = payment?.order_id

    if (!razorpayOrderId) {
      return Response.json({ success: true })
    }

    const order = await getAdminOrderByRazorpayOrderId(razorpayOrderId)
    let nextStatus = getOrderStatusFromEvent(body.event, payment?.status)

    if (body.event === 'payment.authorized' && payment?.id) {
      try {
        nextStatus = await capturePaymentIfNeeded({
          paymentId: payment.id,
          amount: order.amount * 100,
          currency: order.currency,
        })
      } catch (error) {
        console.error('Webhook capture error:', error)
      }
    }

    let updatedOrder: Order
    let shouldSendBookingEmail = false

    if (nextStatus === 'paid') {
      const transitionedOrder = await updateAdminOrderToPaidByRazorpayOrderIdOnce(razorpayOrderId, {
        razorpay_payment_id: payment?.id,
      })

      if (transitionedOrder) {
        updatedOrder = transitionedOrder
        shouldSendBookingEmail = true
      } else {
        updatedOrder = await getAdminOrderByRazorpayOrderId(razorpayOrderId)
      }
    } else {
      updatedOrder = await updateAdminOrderByRazorpayOrderId(razorpayOrderId, {
        status: nextStatus,
        razorpay_payment_id: payment?.id,
      })
    }

    if (shouldSendBookingEmail) {
      void sendBookingConfirmationEmails(updatedOrder).catch(error => {
        console.error('Webhook booking confirmation email error:', error)
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
