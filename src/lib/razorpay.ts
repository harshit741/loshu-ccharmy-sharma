import crypto from 'crypto'

export interface RazorpayOrderResponse {
  id: string
  entity: 'order'
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: 'created' | 'attempted' | 'paid'
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface RazorpayPaymentResponse {
  id: string
  entity: 'payment'
  amount: number
  currency: string
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
  order_id: string | null
  email?: string | null
  contact?: string | null
  captured?: boolean
  error_code?: string | null
  error_description?: string | null
  error_source?: string | null
  error_step?: string | null
  error_reason?: string | null
}

function getRazorpayKeyId() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  if (!keyId) {
    throw new Error('Missing Razorpay key id')
  }
  return keyId
}

function getRazorpayKeySecret() {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    throw new Error('Missing Razorpay key secret')
  }
  return keySecret
}

function getWebhookSecret() {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('Missing Razorpay webhook secret')
  }
  return webhookSecret
}

async function razorpayRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const auth = Buffer.from(`${getRazorpayKeyId()}:${getRazorpayKeySecret()}`).toString('base64')
  const response = await fetch(`https://api.razorpay.com${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.error?.description ||
      payload?.error?.reason ||
      payload?.message ||
      'Razorpay request failed'
    throw new Error(message)
  }

  return payload as T
}

export async function createRazorpayOrder(input: {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}) {
  return razorpayRequest<RazorpayOrderResponse>('/v1/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function fetchRazorpayPayment(paymentId: string) {
  return razorpayRequest<RazorpayPaymentResponse>(`/v1/payments/${paymentId}`, {
    method: 'GET',
  })
}

export async function captureRazorpayPayment(input: {
  paymentId: string
  amount: number
  currency: string
}) {
  return razorpayRequest<RazorpayPaymentResponse>(`/v1/payments/${input.paymentId}/capture`, {
    method: 'POST',
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency,
    }),
  })
}

export function verifyRazorpayCheckoutSignature(input: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}) {
  const digest = crypto
    .createHmac('sha256', getRazorpayKeySecret())
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest('hex')

  return digest === input.razorpaySignature
}

export function verifyRazorpayWebhookSignature(payload: string, signature: string) {
  const digest = crypto
    .createHmac('sha256', getWebhookSecret())
    .update(payload)
    .digest('hex')

  return digest === signature
}
