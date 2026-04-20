import type { BookingInput } from '@/lib/booking'
import { THEME } from '@/lib/theme'

export interface CheckoutOrderPayload extends BookingInput {
  orderId: string
  amount: number
  currency: string
  razorpayOrderId: string
  packageName: string
  keyId: string
}

let razorpayScriptPromise: Promise<void> | null = null

function loadRazorpayScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay is only available in the browser'))
  }

  if (window.Razorpay) {
    return Promise.resolve()
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Razorpay checkout'))
      document.body.appendChild(script)
    })
  }

  return razorpayScriptPromise
}

export async function openRazorpayCheckout(
  payload: CheckoutOrderPayload,
  callbacks: {
    onSuccess: (response: RazorpaySuccessResponse) => Promise<void> | void
    onFailure?: (response: RazorpayFailureResponse) => Promise<void> | void
    onDismiss?: () => void
  }
) {
  await loadRazorpayScript()

  const Razorpay = window.Razorpay

  if (!Razorpay) {
    throw new Error('Razorpay checkout is unavailable right now')
  }

  const razorpay = new Razorpay({
    key: payload.keyId,
    amount: payload.amount,
    currency: payload.currency,
    name: THEME.site.name,
    description: payload.packageName,
    order_id: payload.razorpayOrderId,
    prefill: {
      name: payload.name,
      email: payload.email,
      contact: payload.phone,
    },
    notes: {
      local_order_id: payload.orderId,
      package_id: payload.packageId,
    },
    theme: {
      color: THEME.colors.rose,
    },
    modal: {
      ondismiss: callbacks.onDismiss,
    },
    handler: response => callbacks.onSuccess(response),
  })

  if (callbacks.onFailure) {
    razorpay.on('payment.failed', response => {
      void callbacks.onFailure?.(response)
    })
  }

  razorpay.open()
}
