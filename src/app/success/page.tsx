'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Home, Loader2, AlertCircle } from 'lucide-react'
import { getOrderById, type Order } from '@/lib/supabase'
import { THEME } from '@/lib/theme'
import toast from 'react-hot-toast'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      setError('Invalid payment session. Please contact support.')
      setLoading(false)
      return
    }

    let isActive = true

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    const loadOrder = async () => {
      try {
        for (let attempt = 0; attempt < 6; attempt++) {
          const fetchedOrder = await getOrderById(orderId)

          if (!isActive) return

          setOrder(fetchedOrder)

          if (fetchedOrder.status === 'paid') {
            setError(null)
            setLoading(false)
            return
          }

          if (fetchedOrder.status === 'failed' || fetchedOrder.status === 'refunded') {
            setError('This payment could not be confirmed. Please contact support if you were charged.')
            setLoading(false)
            return
          }

          if (attempt < 5) {
            await wait(1500)
          }
        }

        if (isActive) {
          setError('We are still confirming your payment. Please refresh this page in a few seconds.')
        }
      } catch (fetchError) {
        console.error(fetchError)
        if (isActive) {
          setError('Could not retrieve your order. Please contact support.')
        }
      }

      if (isActive) {
        setLoading(false)
      }
    }

    void loadOrder()

    return () => {
      isActive = false
    }
  }, [searchParams])

  const downloadReceipt = async () => {
    if (!order) return
    try {
      const { generateReceiptPDF } = await import('@/utils/generateReceipt')
      await generateReceiptPDF(order)
      toast.success('Receipt downloaded!')
    } catch {
      toast.error('Failed to generate receipt. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin" size={40} style={{ color: 'var(--color-rose)' }} />
          <p style={{ color: 'var(--color-muted)' }}>Confirming your payment with Razorpay...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl p-6 text-center sm:p-8" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <AlertCircle className="mx-auto mb-4" size={42} style={{ color: 'var(--color-rose)' }} aria-hidden="true" />
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--color-ink)' }}>
            Something went wrong
          </h1>
          <p className="mb-6 mt-3 text-sm leading-7 sm:text-base" style={{ color: 'var(--color-muted)' }}>
            {error}
          </p>
          <a
            href={`mailto:${THEME.site.email}`}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--color-rose)] px-6 text-sm font-medium text-white sm:w-auto"
          >
            Contact Support
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24"
          style={{ background: 'color-mix(in srgb, var(--color-teal) 18%, transparent)' }}
          aria-hidden="true"
        >
          <CheckCircle size={44} style={{ color: 'var(--color-teal)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--color-ink)' }}>
            Payment Successful
          </h1>
          <p className="mb-2 mt-3 text-base leading-7" style={{ color: 'var(--color-muted)' }}>
            Thank you, <strong style={{ color: 'var(--color-ink)' }}>{order?.customer_name}</strong>.
            Your booking is confirmed.
          </p>
          <p className="text-sm leading-6 sm:text-base" style={{ color: 'var(--color-muted)' }}>
            A confirmation email with your booking receipt will be sent to{' '}
            <strong style={{ color: 'var(--color-ink)' }}>{order?.customer_email}</strong> {' '} shortly.
          </p>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="my-8 rounded-3xl p-5 text-left sm:p-6"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            aria-label="Order summary"
          >
            <h2 className="mb-4 font-heading text-lg font-semibold sm:text-xl" style={{ color: 'var(--color-ink)' }}>
              Order Summary
            </h2>
            <dl className="space-y-3">
              {[
                { label: 'Package', value: order.package_name },
                { label: 'Amount', value: `Rs. ${order.amount.toLocaleString('en-IN')}` },
                { label: 'Status', value: 'Paid' },
                ...(order.razorpay_payment_id ? [{ label: 'Payment ID', value: order.razorpay_payment_id }] : []),
              ].map(item => (
                <div key={item.label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm" style={{ color: 'var(--color-muted)' }}>{item.label}</dt>
                  <dd className="break-all text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6 rounded-2xl p-5 text-left"
          style={{
            background: 'color-mix(in srgb, var(--color-rose) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-rose) 24%, transparent)',
          }}
        >
          <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
            What happens next?
          </h3>
          <ul className="space-y-1 text-sm leading-7" style={{ color: 'var(--color-muted)' }}>
            <li>1. Your booking confirmation email and PDF receipt have already been sent.</li>
            <li>2. Ccharmy will begin preparing your personalized reading.</li>
            <li>3. Your PDF report and any consultation details will be shared by email.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <button
            onClick={downloadReceipt}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-rose)] px-6 text-sm font-medium text-white sm:w-auto"
            aria-label="Download PDF receipt"
          >
            <Download size={16} aria-hidden="true" />
            Download Receipt
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium sm:w-auto"
            style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-ink)' }}
          >
            <Home size={16} aria-hidden="true" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--color-teal) 24%, transparent), transparent 70%)' }}
        />
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="animate-spin" size={40} style={{ color: 'var(--color-rose)' }} />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  )
}
