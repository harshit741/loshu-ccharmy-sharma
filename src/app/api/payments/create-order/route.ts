export const runtime = 'nodejs'

import { bookingSchema } from '@/lib/booking'
import { getPackageById } from '@/lib/packages'
import { createAdminOrder, updateAdminOrder } from '@/lib/supabase-admin'
import { createRazorpayOrder } from '@/lib/razorpay'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedBody = bookingSchema.safeParse(body)

    if (!parsedBody.success) {
      return Response.json(
        { error: parsedBody.error.issues[0]?.message || 'Invalid booking details' },
        { status: 400 }
      )
    }

    const booking = parsedBody.data
    const pkg = getPackageById(booking.packageId)

    if (!pkg) {
      return Response.json({ error: 'Selected package was not found' }, { status: 400 })
    }

    const localOrder = await createAdminOrder({
      customer_name: booking.name,
      customer_email: booking.email,
      customer_phone: booking.phone,
      package_id: pkg.id,
      package_name: pkg.name,
      amount: pkg.price,
      currency: pkg.currency,
      status: 'created',
      numerology_dob: booking.dob?.trim() || undefined,
      notes: booking.notes,
    })

    try {
      const razorpayOrder = await createRazorpayOrder({
        amount: pkg.price * 100,
        currency: pkg.currency,
        receipt: localOrder.id!,
        notes: {
          local_order_id: localOrder.id!,
          package_id: pkg.id,
          customer_email: booking.email,
          customer_phone: booking.phone,
        },
      })

      await updateAdminOrder(localOrder.id!, {
        razorpay_order_id: razorpayOrder.id,
        status: 'created',
      })

      return Response.json({
        success: true,
        orderId: localOrder.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        packageName: pkg.name,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '',
      })
    } catch (error) {
      await updateAdminOrder(localOrder.id!, { status: 'failed' })
      throw error
    }
  } catch (error) {
    console.error('Create Razorpay order error:', error)
    return Response.json({ error: 'Unable to initiate payment right now' }, { status: 500 })
  }
}
