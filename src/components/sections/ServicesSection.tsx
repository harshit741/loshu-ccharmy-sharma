'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PACKAGES } from '@/lib/packages'
import { bookingSchema, type BookingInput } from '@/lib/booking'
import { openRazorpayCheckout } from '@/lib/checkout'
import { formatDobInputValue } from '@/utils/date'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

type BookingFormData = BookingInput

const fieldClassName =
  'min-h-[44px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-rose)] sm:text-sm'

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString('en-IN')}`
}

export default function ServicesSection() {
  const [selected, setSelected] = useState('platinum')
  const [submitting, setSubmitting] = useState(false)

  const selectedPkg = PACKAGES.find(pkg => pkg.id === selected) || PACKAGES[1]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { packageId: 'platinum' },
  })

  const handlePackageSelect = (pkgId: string) => {
    setSelected(pkgId)
    setValue('packageId', pkgId)
  }

  const onSubmit = async (data: BookingFormData) => {
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
      toast.error(error instanceof Error ? error.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <section id="services" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24" aria-labelledby="services-heading">
      <div className="max-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-14"
        >
          <span className="text-sm font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--color-rose)' }}>
            Tailored Guidance
          </span>
          <h2
            id="services-heading"
            className="mt-2 font-heading text-3xl font-light sm:text-5xl lg:text-6xl"
            style={{ color: 'var(--color-ink)' }}
          >
            Choose Your{' '}
            <span className="italic font-semibold" style={{ color: 'var(--color-rose)' }}>
              Service
            </span>
          </h2>
        </motion.div>

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {PACKAGES.map((pkg, index) => {
            const isSelected = selected === pkg.id
            const isHighlight = pkg.highlighted
            const textColor = isSelected ? 'white' : 'var(--color-ink)'
            const muted = isSelected ? 'rgba(255,255,255,0.85)' : 'var(--color-muted)'

            return (
              <motion.button
                key={pkg.id}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePackageSelect(pkg.id)}
                className={cn(
                  'relative flex h-full flex-col rounded-3xl p-5 text-left transition-all duration-300 sm:p-6 lg:p-8',
                  isSelected
                    ? 'shadow-2xl lg:-translate-y-1'
                    : 'hover:shadow-xl lg:hover:-translate-y-1'
                )}
                style={{
                  background: 'var(--color-surface)',
                  border: isSelected ? '2px solid transparent' : '1px solid var(--color-border)',
                  color: textColor,
                  boxShadow: isSelected ? '0 25px 60px rgba(20,23,125,.28)' : undefined,
                }}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <motion.div
                    layoutId="package-highlight"
                    className="absolute inset-0 rounded-3xl"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 28,
                    }}
                    style={{
                      background: 'linear-gradient(135deg,var(--color-rose),var(--color-teal))',
                      zIndex: 0,
                    }}
                  />
                )}

                <div className="relative z-10 flex h-full flex-col">
                  {isHighlight && (
                    <div
                      className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-xs font-semibold"
                      style={{
                        background: isSelected ? 'white' : 'var(--color-rose)',
                        color: isSelected ? 'var(--color-rose)' : 'white',
                      }}
                    >
                      <Star size={10} fill="currentColor" aria-hidden="true" />
                      Most Popular
                    </div>
                  )}

                  <span className="mb-1 block text-xs font-bold tracking-[0.28em]" style={{ opacity: 0.8 }}>
                    {pkg.tier}
                  </span>

                  <h3 className="font-heading text-2xl font-semibold">{pkg.name}</h3>

                  <p className="mb-5 mt-2 text-sm leading-6" style={{ color: muted }}>
                    {pkg.tagline}
                  </p>

                  <div className="mb-6">
                    {pkg.originalPrice && (
                      <span className="mr-2 text-sm line-through" style={{ opacity: 0.6 }}>
                        {formatPrice(pkg.originalPrice)}
                      </span>
                    )}
                    <span className="font-heading text-3xl font-bold sm:text-4xl">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>

                  <ul className="mb-8 space-y-2.5">
                    {pkg.features.map(feature => (
                      <li key={feature} className="flex gap-2 text-sm leading-6">
                        <Check size={16} color={isSelected ? 'white' : undefined} className="mt-1 shrink-0" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mb-5 mt-auto text-xs sm:text-sm" style={{ color: muted }}>
                    Delivery: {pkg.deliveryTime}
                  </p>

                  <span
                    className={cn(
                      'inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-4 text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-white text-[var(--color-rose)]'
                        : 'border border-[var(--color-rose)] text-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-white'
                    )}
                  >
                    {isSelected ? 'Selected' : 'Select Package'}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <div
            className="rounded-3xl p-5 sm:p-6 lg:p-8"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <h3 className="font-heading text-2xl font-semibold" style={{ color: 'var(--color-ink)' }}>
              Book Your Reading
            </h3>
            <p className="mb-6 mt-2 text-sm leading-6" style={{ color: 'var(--color-muted)' }}>
              You&apos;ve selected the <strong>{selectedPkg.name}</strong> package ({formatPrice(selectedPkg.price)}).
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <label htmlFor="packageId" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  Selected Package
                </label>
                <select
                  id="packageId"
                  className={fieldClassName}
                  {...register('packageId')}
                  onChange={event => handlePackageSelect(event.target.value)}
                >
                  {PACKAGES.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {formatPrice(pkg.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-name" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Full Name *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    className={cn(fieldClassName, errors.name && 'border-red-400')}
                    {...register('name')}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500" role="alert">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="booking-dob" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Date of Birth
                  </label>
                  <input
                    id="booking-dob"
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
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-email" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Email *
                  </label>
                  <input
                    id="booking-email"
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
                  <label htmlFor="booking-phone" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Phone *
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className={cn(fieldClassName, errors.phone && 'border-red-400')}
                    {...register('phone')}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500" role="alert">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="booking-notes" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  What would you like clarity on? (optional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={4}
                  placeholder="Career change, relationship, business name..."
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-rose)] sm:text-sm"
                  {...register('notes')}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--color-rose)] px-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70"
                aria-busy={submitting}
              >
                {submitting ? 'Opening secure checkout...' : `Proceed to Pay ${formatPrice(selectedPkg.price)}`}
              </button>

              <p className="text-center text-xs leading-5" style={{ color: 'var(--color-muted)' }}>
                Secure payment via Razorpay. 100% refund if cancelled within 24 hours.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
