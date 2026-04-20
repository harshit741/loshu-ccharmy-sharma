'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ChevronDown } from 'lucide-react'
import { calculateNumerology, LOSHU_GRID_LAYOUT, type NumerologyResult } from '@/utils/numerology'
import { formatDobInputValue } from '@/utils/date'
import { cn } from '@/utils/cn'
import { staggerItem, staggerParent } from '@/lib/motion'
import toast from 'react-hot-toast'
import { loshuCalculatorSchema, type LoshuCalculatorInput } from '@/lib/loshuCalculator'

type FormData = LoshuCalculatorInput

// Confetti animation trigger
const triggerConfetti = () => {
  if (typeof window !== 'undefined' && window.innerWidth > 0) {
    // Create canvas-based confetti using CSS animations
    const confettiPieces = 50
    const container = document.createElement('div')
    container.id = 'confetti-container'
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(container)

    for (let i = 0; i < confettiPieces; i++) {
      const confetti = document.createElement('div')
      const size = Math.random() * 8 + 4
      const x = Math.random() * window.innerWidth
      const delay = Math.random() * 0.2
      const duration = Math.random() * 1 + 2.5
      const rotation = Math.random() * 360
      const colors = ['#d946ef', '#14b8a6', '#f97316', '#06b6d4', '#8b5cf6']
      const color = colors[Math.floor(Math.random() * colors.length)]
      
      confetti.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: -10px;
        opacity: 1;
        animation: fall-confetti ${duration}s linear ${delay}s forwards;
      `
      container.appendChild(confetti)
    }

    // Add animation keyframes if not already present
    if (!document.getElementById('confetti-styles')) {
      const style = document.createElement('style')
      style.id = 'confetti-styles'
      style.textContent = `
        @keyframes fall-confetti {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }

    // Clean up after 3 seconds
    setTimeout(() => {
      container.remove()
    }, 3000)
  }
}

interface Props {
  onResult: (result: NumerologyResult, name: string, dob: string) => void
}

const fieldClassName =
  'min-h-[44px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-rose)] sm:text-sm'

export default function LoshuSection({ onResult }: Props) {
  const [result, setResult] = useState<NumerologyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [gridRevealKey, setGridRevealKey] = useState(0)
  const [confettiTriggered, setConfettiTriggered] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loshuCalculatorSchema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/loshu-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to save your details right now.')
      }

      const nextResult = payload?.result ?? calculateNumerology(data.fullName, data.dob)
      setGridRevealKey(prev => prev + 1)
      setResult(nextResult)
      
      // Trigger confetti if planes are found
      if (nextResult.activePlanes.length > 0) {
        setConfettiTriggered(true)
        triggerConfetti()
      }
      
      onResult(nextResult, data.fullName, data.dob)

      void fetch('/api/loshu-calculator/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(error => {
        console.error('Failed to save Lo Shu calculator submission in background:', error)
      })
    } catch (error) {
      console.error('Failed to calculate Lo Shu result:', error)
      toast.error(error instanceof Error ? error.message : 'Unable to calculate your result right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="loshu"
      className="relative px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      aria-labelledby="loshu-heading"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--color-teal) 12%, transparent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-container">
        <motion.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mb-12 text-center sm:mb-14"
        >
          <motion.span
            variants={staggerItem}
            className="block text-sm font-medium uppercase tracking-[0.28em]"
            style={{ color: 'var(--color-teal)' }}
          >
            Free Calculator
          </motion.span>
          <motion.h2
            variants={staggerItem}
            id="loshu-heading"
            className="mt-2 font-heading text-3xl font-light sm:text-5xl lg:text-6xl"
            style={{ color: 'var(--color-ink)' }}
          >
            Your Lo Shu{' '}
            <span className="italic" style={{ color: 'var(--color-rose)' }}>
              Grid Reading
            </span>
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="mx-auto mt-4 max-w-2xl text-base leading-7"
            style={{ color: 'var(--color-muted)' }}
          >
            Enter your full name and date of birth to reveal your cosmic blueprint through the
            ancient 3x3 Lo Shu magic square.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerParent(0.06, 0.16)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20"
        >
          <motion.div variants={staggerItem} className="space-y-5 sm:space-y-6 lg:mx-auto lg:w-full lg:max-w-[30rem]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col space-y-5 rounded-3xl p-5 shadow-xl sm:p-6 lg:min-h-[30rem] lg:aspect-square lg:p-8"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              aria-label="Numerology calculator form"
            >
              <div className="space-y-5">
                <h3 className="font-heading text-2xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                  Enter Your Details
                </h3>

                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Full Name <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="As on birth certificate"
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    aria-invalid={!!errors.fullName}
                    className={cn(fieldClassName, errors.fullName && 'border-2 border-red-400')}
                    {...register('fullName')}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-xs text-red-500" role="alert">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="dob" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Date of Birth <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <input
                    id="dob"
                    type="text"
                    inputMode="numeric"
                    autoComplete="bday"
                    placeholder="dd/mm/yyyy"
                    maxLength={10}
                    pattern={'\\d{2}/\\d{2}/\\d{4}'}
                    onInput={event => {
                      event.currentTarget.value = formatDobInputValue(event.currentTarget.value)
                    }}
                    aria-describedby={errors.dob ? 'dob-error' : undefined}
                    aria-invalid={!!errors.dob}
                    className={cn(fieldClassName, errors.dob && 'border-2 border-red-400')}
                    {...register('dob', { setValueAs: value => typeof value === 'string' ? value.trim() : value })}
                  />
                  {errors.dob && (
                    <p id="dob-error" className="mt-1 text-xs text-red-500" role="alert">
                      {errors.dob.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    Mobile Number <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
                    aria-invalid={!!errors.mobileNumber}
                    className={cn(fieldClassName, errors.mobileNumber && 'border-2 border-red-400')}
                    {...register('mobileNumber')}
                  />
                  {errors.mobileNumber && (
                    <p id="mobileNumber-error" className="mt-1 text-xs text-red-500" role="alert">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-auto lg:pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-rose)] px-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                      Calculating your numbers...
                    </>
                  ) : (
                    'Reveal My Numbers'
                  )}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-stretch sm:justify-end"
                >
                  <a
                    href="#analysis"
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[var(--color-teal)] px-8 text-sm font-medium text-white transition-all hover:-translate-y-0.5 sm:w-auto"
                  >
                    View Detailed Analysis
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-5 sm:space-y-6 lg:mx-auto lg:w-full lg:max-w-[30rem]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col rounded-3xl p-5 shadow-xl sm:p-6 lg:min-h-[30rem] lg:aspect-square lg:p-8"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              aria-label="Lo Shu grid visualization"
            >
              <h3 className="mb-6 text-center font-heading text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                Lo Shu Magic Square
              </h3>

              <div className="flex flex-1 flex-col justify-center">
                <div
                  className="mx-auto grid w-full max-w-[20rem] grid-cols-3 gap-2.5 sm:max-w-xs sm:gap-3"
                  role="grid"
                  aria-label="3 by 3 Lo Shu grid"
                >
                  {LOSHU_GRID_LAYOUT.flat().map((num, index) => {
                    const freq = result?.loshuFrequency[num] ?? 0
                    const isPersonality = result?.personalityNumber === num
                    const isDestiny = result?.destinyNumber === num
                    const extraCount = Number(isPersonality) + Number(isDestiny)
                    const totalCount = freq + extraCount
                    const isFilled = totalCount > 0
                    const isActive = isFilled
                    const isMissing = !!result && !isFilled
                    const hasSpecialNumber = isPersonality || isDestiny
                    const isSpecialOnly = hasSpecialNumber && freq === 0
                    const specialLabel = [isPersonality ? 'personality number' : null, isDestiny ? 'destiny number' : null]
                      .filter(Boolean)
                      .join(' and ')
                    const specialTag = [isPersonality ? 'Personality' : null, isDestiny ? 'Destiny' : null]
                      .filter(Boolean)
                      .join(' & ')
                    const revealDelay = index * 0.05

                    return (
                      <motion.div
                        key={`${num}-${gridRevealKey}`}
                        role="gridcell"
                        aria-label={`Number ${num}: ${
                          result
                            ? isFilled
                              ? `present ${totalCount} time${totalCount > 1 ? 's' : ''}${specialLabel ? ` including ${specialLabel}` : ''}`
                              : 'missing'
                            : 'not yet calculated'
                        }`}
                        className={cn('loshu-cell group', isActive && 'active', isMissing && 'missing')}
                        style={
                          isSpecialOnly
                            ? {
                                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-teal-dark) 80%, white) 10%, color-mix(in srgb, var(--color-teal-light) 70%, white) 100%)',
                                color: 'var(--color-ink)',
                                borderColor: 'color-mix(in srgb, var(--color-teal) 26%, var(--color-border))',
                                boxShadow: '0 10px 28px color-mix(in srgb, var(--color-teal) 24%, transparent)',
                              }
                            : undefined
                        }
                        initial={result ? { opacity: 0, scale: 0.78, y: 12 } : false}
                        animate={
                          result
                            ? isFilled
                              ? { opacity: 1, y: 0, scale: [0.78, 1.08, 1] }
                              : { opacity: 1, y: 0, scale: [0.86, 1.02, 1] }
                            : { opacity: 1, y: 0, scale: 1 }
                        }
                        transition={{
                          duration: 0.55,
                          delay: result ? revealDelay : 0,
                          type: 'spring',
                          stiffness: 250,
                          damping: 17,
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {result && isActive && (
                          <>
                            <motion.span
                              key={`bubble-ring-${num}-${gridRevealKey}`}
                              className="pointer-events-none absolute inset-1 rounded-lg"
                              style={{ border: '1px solid rgba(255,255,255,0.45)' }}
                              initial={{ opacity: 0, scale: 0.55 }}
                              animate={{ opacity: [0, 0.35, 0], scale: [0.55, 1.15, 1.45] }}
                              transition={{ duration: 0.9, delay: revealDelay + 0.08, ease: 'easeOut' }}
                              aria-hidden="true"
                            />
                            <motion.span
                              key={`bubble-dot-${num}-${gridRevealKey}`}
                              className="pointer-events-none absolute"
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 999,
                                right: '20%',
                                top: '22%',
                                background: 'rgba(255,255,255,0.75)',
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: [0, 0.8, 0], y: [4, -10, -16], x: [0, 2, 5], scale: [0, 1, 0.4] }}
                              transition={{ duration: 1.1, delay: revealDelay + 0.16, ease: 'easeOut' }}
                              aria-hidden="true"
                            />
                          </>
                        )}
                        <span aria-hidden="true">
                          {result
                            ? isFilled
                              ? String(num).repeat(totalCount)
                              : '-'
                            : num}
                        </span>
                        {specialTag && (
                          <span className="cell-tag" aria-hidden="true">
                            {specialTag}
                          </span>
                        )}
                        {freq > 1 && !hasSpecialNumber && (
                          <span
                            className="absolute right-1.5 top-1 text-xs font-bold opacity-80"
                            aria-hidden="true"
                          >
                            x{freq}
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                <div className="mt-4 min-h-[1.5rem] text-center text-sm" style={{ color: 'var(--color-muted)' }}>
                  {!result ? 'Fill in the form to reveal your grid' : '\u00A0'}
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-stretch pt-1 sm:justify-start"
                >
                  <a
                    href="#services"
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[var(--color-rose)] px-8 text-sm font-medium text-[var(--color-rose)] transition-all hover:-translate-y-0.5 sm:w-auto"
                  >
                    Book a Consultation
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Congratulations message when planes are found */}
        <AnimatePresence>
          {result && result.activePlanes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
              className="mt-12 rounded-3xl px-6 py-8 text-center shadow-xl sm:mt-16 sm:px-8 sm:py-10"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-teal-light) 92%, white) 0%, color-mix(in srgb, var(--color-rose-light) 92%, white) 100%)',
                border: '1px solid color-mix(in srgb, var(--color-teal) 30%, var(--color-border))',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="font-heading text-3xl font-bold sm:text-4xl" style={{ color: 'var(--color-ink)' }}>
                  🎉 Congratulations! 🎉
                </h3>
                <p className="mt-3 text-lg font-semibold sm:text-xl" style={{ color: 'var(--color-teal)' }}>
                  You have <span className="font-bold text-2xl">{result.activePlanes.length}</span> powerful{' '}
                  {result.activePlanes.length === 1 ? 'Plane' : 'Planes'} in your Lo Shu Grid!
                </p>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-6" style={{ color: 'var(--color-muted)' }}>
                  This is a rare and special combination that reveals important insights about your personality and life
                  path.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 flex items-center justify-center gap-2"
                style={{ color: 'var(--color-muted)' }}
              >
                <ChevronDown size={20} aria-hidden="true" />
                <span className="text-sm font-medium">Scroll below to know more</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-2"
              >
                <ChevronDown size={20} style={{ color: 'var(--color-teal)', margin: '0 auto' }} aria-hidden="true" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
