'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Star, ArrowLeft, Loader2 } from 'lucide-react'
import { PACKAGES } from '@/lib/packages'
import { bookingSchema, type BookingInput } from '@/lib/booking'
import { openRazorpayCheckout } from '@/lib/checkout'
import { formatDobInputValue } from '@/utils/date'
import { cn } from '@/utils/cn'
import { THEME } from '@/lib/theme'
import toast from 'react-hot-toast'

type FormData = BookingInput

const STEPS = [
  { id: 'package', label: 'Choose Package' },
  { id: 'details', label: 'Your Details' },
  { id: 'payment', label: 'Payment' },
]

const fieldClassName =
  'min-h-[44px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-rose)] sm:text-sm'

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString('en-IN')}`
}

export default function ConsultationPageClient() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string>('platinum')
  const [submitting, setSubmitting] = useState(false)

  const selectedPkg = PACKAGES.find(pkg => pkg.id === selected) || PACKAGES[1]

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { packageId: 'platinum' },
  })

  const handlePackageSelect = (id: string) => {
    setSelected(id)
    setValue('packageId', id)
  }

  const goNext = async () => {
    if (step === 0) {
      setStep(1)
      return
    }

    if (step === 1) {
      const valid = await trigger(['name', 'email', 'phone', 'dob'])
      if (valid) setStep(2)
    }
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload?.orderId) {
        throw new Error(payload?.error || 'Unable to initiate payment right now.')
      }

      toast.success('Opening secure Razorpay checkout...')

      await openRazorpayCheckout(
        {
          ...data,
          orderId: payload.orderId,
          amount: payload.amount,
          currency: payload.currency,
          razorpayOrderId: payload.razorpayOrderId,
          packageName: payload.packageName,
          keyId: payload.keyId,
        },
        {
          onSuccess: async razorpayResponse => {
            const verification = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: payload.orderId,
                ...razorpayResponse,
              }),
            })

            if (!verification.ok) {
              const errorPayload = await verification.json().catch(() => null)
              console.error('Payment verification failed:', errorPayload)
            }

            window.location.href = `/success?order_id=${payload.orderId}`
          },
          onFailure: async failure => {
            await fetch('/api/payments/failure', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: payload.orderId,
                razorpay_payment_id: failure.error?.metadata?.payment_id,
              }),
            }).catch(error => {
              console.error('Failed to record payment failure:', error)
            })

            setSubmitting(false)
            toast.error(failure.error?.description || 'Payment failed. Please try again.')
          },
          onDismiss: () => {
            setSubmitting(false)
          },
        }
      )
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-x-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="pointer-events-none fixed right-0 top-0 h-72 w-72 rounded-full blur-[96px] opacity-20 sm:h-96 sm:w-96 sm:blur-[120px] lg:h-[32rem] lg:w-[32rem]"
        style={{ background: 'var(--color-rose)' }}
        aria-hidden="true"
      />

      <div className="max-container max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex min-h-[44px] items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 sm:mb-12"
        >
          <span className="text-sm font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--color-rose)' }}>
            Book Now
          </span>
          <h1 className="mt-2 font-heading text-3xl font-light sm:text-4xl lg:text-5xl" style={{ color: 'var(--color-ink)' }}>
            Book Your{' '}
            <span className="italic font-semibold gradient-text">Reading</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7" style={{ color: 'var(--color-muted)' }}>
            Personal numerology consultations with {THEME.site.numerologistName}.
            Complete your booking in 3 simple steps.
          </p>
        </motion.div>

        <div className="mb-10 flex items-center justify-between gap-2 overflow-x-auto pb-1" aria-label="Booking steps">
          {STEPS.map((stepItem, index) => (
            <div key={stepItem.id} className="flex min-w-[5.5rem] items-center gap-2 sm:min-w-0 sm:flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all',
                    index < step && 'bg-[var(--color-teal)] text-white',
                    index === step && 'bg-[var(--color-rose)] text-white ring-4 ring-[var(--color-rose-light)]',
                    index > step && 'border-2 border-[var(--color-border)]'
                  )}
                  style={index > step ? { color: 'var(--color-muted)' } : undefined}
                  aria-current={index === step ? 'step' : undefined}
                >
                  {index < step ? <Check size={14} aria-hidden="true" /> : index + 1}
                </div>
                <span
                  className="hidden text-sm font-medium sm:block"
                  style={{ color: index === step ? 'var(--color-ink)' : 'var(--color-muted)' }}
                >
                  {stepItem.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className="h-px w-8 flex-1 sm:w-full"
                  style={{ background: index < step ? 'var(--color-teal)' : 'var(--color-border)' }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {PACKAGES.map(pkg => {
                const isSelected = selected === pkg.id

                return (
                  <motion.button
                    key={pkg.id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      'relative flex h-full flex-col rounded-3xl p-5 text-left transition-all duration-300 sm:p-6',
                      isSelected ? 'shadow-xl ring-2 ring-[var(--color-rose)]' : 'hover:shadow-md'
                    )}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-rose) 12%, white), color-mix(in srgb, var(--color-teal) 12%, white))'
                        : 'var(--color-surface)',
                      border: isSelected ? '2px solid var(--color-rose)' : '1px solid var(--color-border)',
                    }}
                    onClick={() => handlePackageSelect(pkg.id)}
                    aria-pressed={isSelected}
                  >
                    {pkg.highlighted && (
                      <div
                        className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                        style={{ background: 'var(--color-rose)', color: 'white' }}
                      >
                        <Star size={10} fill="currentColor" aria-hidden="true" />
                        Popular
                      </div>
                    )}

                    <p className="mb-1 text-xs font-bold tracking-[0.28em] opacity-60" style={{ color: 'var(--color-ink)' }}>
                      {pkg.tier}
                    </p>
                    <h3 className="font-heading text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                      {pkg.name}
                    </h3>
                    <p className="mb-4 mt-2 text-sm leading-6" style={{ color: 'var(--color-muted)' }}>
                      {pkg.tagline}
                    </p>
                    <div className="mb-4 font-heading text-3xl font-bold" style={{ color: isSelected ? 'var(--color-rose)' : 'var(--color-ink)' }}>
                      {formatPrice(pkg.price)}
                    </div>
                    <ul className="space-y-1.5">
                      {pkg.features.slice(0, 4).map(feature => (
                        <li key={feature} className="flex items-start gap-1.5 text-xs leading-5" style={{ color: 'var(--color-muted)' }}>
                          <Check size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                      {pkg.features.length > 4 && (
                        <li className="text-xs italic" style={{ color: 'var(--color-muted)' }}>
                          +{pkg.features.length - 4} more...
                        </li>
                      )}
                    </ul>
                  </motion.button>
                )
              })}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 rounded-3xl p-5 sm:p-6 lg:p-8"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div
                className="mb-6 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  background: 'color-mix(in srgb, var(--color-rose) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-rose) 24%, transparent)',
                }}
              >
                <div>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Selected Package</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{selectedPkg.name}</p>
                </div>
                <div className="font-heading text-xl font-bold" style={{ color: 'var(--color-rose)' }}>
                  {formatPrice(selectedPkg.price)}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    placeholder="As per birth certificate"
                    autoComplete="name"
                    className={cn(fieldClassName, errors.name && 'border-red-400')}
                    {...register('name')}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500" role="alert">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="c-dob" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Date of Birth
                  </label>
                  <input
                    id="c-dob"
                    type="text"
                    inputMode="numeric"
                    autoComplete="bday"
                    placeholder="dd/mm/yyyy"
                    maxLength={10}
                    pattern={'\\d{2}/\\d{2}/\\d{4}'}
                    onInput={event => {
                      event.currentTarget.value = formatDobInputValue(event.currentTarget.value)
                    }}
                    className={cn(fieldClassName, errors.dob && 'border-red-400')}
                    {...register('dob', { setValueAs: value => typeof value === 'string' ? value.trim() : value })}
                    aria-invalid={!!errors.dob}
                  />
                  {errors.dob && <p className="mt-1 text-xs text-red-500" role="alert">{errors.dob.message}</p>}
                </div>

                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(fieldClassName, errors.email && 'border-red-400')}
                    {...register('email')}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500" role="alert">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="c-phone" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="c-phone"
                    type="tel"
                    placeholder="+91 7304623234"
                    autoComplete="tel"
                    className={cn(fieldClassName, errors.phone && 'border-red-400')}
                    {...register('phone')}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500" role="alert">{errors.phone.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="c-notes" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    What area would you like clarity on? (optional)
                  </label>
                  <textarea
                    id="c-notes"
                    rows={4}
                    placeholder="Career, relationship, business, health..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-rose)] sm:text-sm"
                    {...register('notes')}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 rounded-3xl p-5 sm:p-6 lg:p-8"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <h3 className="mb-6 font-heading text-2xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                Review Your Booking
              </h3>

              <div
                className="mb-6 overflow-hidden rounded-2xl"
                style={{ border: '1px solid var(--color-border)' }}
              >
                {[
                  { label: 'Package', value: selectedPkg.name },
                  { label: 'Price', value: formatPrice(selectedPkg.price) },
                  { label: 'Delivery', value: selectedPkg.deliveryTime },
                ].map((row, index, rows) => (
                  <div
                    key={row.label}
                    className={cn(
                      'flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between',
                      index < rows.length - 1 && 'border-b border-[var(--color-border)]'
                    )}
                    style={{ background: index % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{row.label}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'color-mix(in srgb, var(--color-rose) 8%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-rose) 24%, transparent)',
                }}
              >
                <p className="text-xs leading-6" style={{ color: 'var(--color-muted)' }}>
                  Secure payment via Razorpay. Supports UPI, cards, net banking, and EMI.
                  100% refund if cancelled within 24 hours of payment.
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(current => current - 1)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-medium transition-all hover:-translate-y-0.5 sm:w-auto"
                style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-muted)' }}
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Back
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--color-rose)] px-8 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-rose)] px-8 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 sm:w-auto"
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                    Opening secure checkout...
                  </>
                ) : (
                  `Pay ${formatPrice(selectedPkg.price)}`
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
