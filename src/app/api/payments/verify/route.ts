export const runtime = 'nodejs'

import { z } from 'zod'
import { sendBookingConfirmationEmails } from '@/lib/booking-email'
import { captureRazorpayPayment, fetchRazorpayPayment, verifyRazorpayCheckoutSignature } from '@/lib/razorpay'
import {
  getAdminOrderById,
  updateAdminOrder,
  updateAdminOrderToPaidOnce,
} from '@/lib/supabase-admin'
import type { Order } from '@/lib/supabase'

const verifySchema = z.object({
  orderId: z.string().uuid('Invalid order id'),
  razorpay_order_id: z.string().min(1, 'Missing Razorpay order id'),
  razorpay_payment_id: z.string().min(1, 'Missing Razorpay payment id'),
  razorpay_signature: z.string().min(1, 'Missing Razorpay signature'),
})

function getOrderStatusFromPayment(status: string): Order['status'] {
  switch (status) {
    case 'captured':
      return 'paid'
    case 'authorized':
      return 'authorized'
    case 'failed':
      return 'failed'
    default:
      return 'created'
  }
}

async function captureOrFetchPayment(input: {
  paymentId: string
  amount: number
  currency: string
}) {
  try {
    return await captureRazorpayPayment({
      paymentId: input.paymentId,
      amount: input.amount,
      currency: input.currency,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    if (message.includes('already been captured')) {
      return fetchRazorpayPayment(input.paymentId)
    }
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedBody = verifySchema.safeParse(body)

    if (!parsedBody.success) {
      return Response.json(
        { error: parsedBody.error.issues[0]?.message || 'Invalid payment verification payload' },
        { status: 400 }
      )
    }

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsedBody.data
    const order = await getAdminOrderById(orderId)

    if (order.razorpay_order_id && order.razorpay_order_id !== razorpay_order_id) {
      return Response.json({ error: 'Order mismatch' }, { status: 400 })
    }

    const isSignatureValid = verifyRazorpayCheckoutSignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    })

    if (!isSignatureValid) {
      await updateAdminOrder(orderId, {
        status: 'failed',
        razorpay_order_id,
        razorpay_payment_id,
      })
      return Response.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    let payment = await fetchRazorpayPayment(razorpay_payment_id)

    if (payment.status === 'authorized') {
      payment = await captureOrFetchPayment({
        paymentId: razorpay_payment_id,
        amount: order.amount * 100,
        currency: order.currency,
      })
    }

    const nextStatus = getOrderStatusFromPayment(payment.status)
    let updatedOrder: Order
    let shouldSendBookingEmail = false

    if (nextStatus === 'paid') {
      const transitionedOrder = await updateAdminOrderToPaidOnce(orderId, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })

      if (transitionedOrder) {
        updatedOrder = transitionedOrder
        shouldSendBookingEmail = true
      } else {
        updatedOrder = await getAdminOrderById(orderId)
      }
    } else {
      updatedOrder = await updateAdminOrder(orderId, {
        status: nextStatus,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
    }

    if (shouldSendBookingEmail) {
      void sendBookingConfirmationEmails(updatedOrder).catch(error => {
        console.error('Booking confirmation email error:', error)
      })
    }

    return Response.json({
      success: true,
      orderId: updatedOrder.id,
      status: updatedOrder.status,
    })
  } catch (error) {
    console.error('Verify Razorpay payment error:', error)
    return Response.json({ error: 'Unable to verify payment right now' }, { status: 500 })
  }
}
