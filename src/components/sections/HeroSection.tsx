'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import heroDesktopImage from '@/assets/images/hero-ccharmy-shah-optimized.jpg'
import heroMobileImage from '@/assets/images/hero-small-screens-2-optimized.jpg'
import { THEME } from '@/lib/theme'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const TRUST_ITEMS = [
  { value: '500+', label: 'Readings Done' },
  { value: '3+ yrs', label: 'Experience' },
  { value: '98%', label: 'Client Satisfaction' },
]

// const GUIDANCE_PILLARS = [
//   'Life path guidance',
//   'Balance and timing',
//   'Destiny insights',
// ]

const MARQUEE_ITEMS = [
  '100% Personalized',
  'Delivered within 72 hours',
  'Expert-verified predictions',
  'Career timing guidance',
  'Relationship clarity',
  'Name correction support',
  'Life path guidance',
  'Balance and timing',
  'Destiny insights',
]

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const allowRichMotion = !shouldReduceMotion && !isCoarsePointer

  const revealParent: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  }

  const revealItem: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 sm:pt-28 lg:pt-32"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="absolute inset-0 z-0">
        <picture className="block h-full w-full">
          <source media="(max-width: 767px)" srcSet={heroMobileImage.src} />
          <img
            src={heroDesktopImage.src}
            alt=""
            aria-hidden="true"
            width={heroDesktopImage.width}
            height={heroDesktopImage.height}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[76%_center] sm:object-[74%_center] lg:object-[68%_center]"
          />
        </picture>

        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: `
              linear-gradient(
              to right,
                var(--color-bg) 10%,
                color-mix(in srgb, var(--color-bg) 90%, transparent) 40%,
                transparent 80%
              )
            `,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
        <motion.div
          className="max-w-[min(100%,42rem)]"
          variants={revealParent}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={revealItem}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-xl sm:text-sm sm:normal-case sm:tracking-normal"
            style={{
              background: 'color-mix(in srgb, var(--color-surface) 78%, transparent)',
              borderColor: 'color-mix(in srgb, var(--color-rose) 18%, var(--color-border))',
              color: 'var(--color-rose)',
            }}
          >
            <Sparkles size={14} aria-hidden="true" />
            Ancient wisdom, modern clarity
          </motion.div>

          <motion.div variants={revealItem} className="mt-6">

            <h1
              className="mt-4 max-w-[12ch] font-heading text-4xl leading-[0.95] text-balance sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
              style={{ color: 'var(--color-ink)' }}
            >
              Career problems?
              <br />
              Marriage troubles?
            </h1>
          </motion.div>



          <motion.p
            variants={revealItem}
            className="mt-5 max-w-xl text-base leading-7 sm:text-lg lg:text-xl"
            style={{ color: 'var(--color-muted)' }}
          >
            Personalized Loshu grid readings by{' '}
            <span style={{ color: 'var(--color-ink)' }}>
              {THEME.site.numerologistName}
            </span>{' '}
            that bring clarity to your strengths, timing, and destiny path.
          </motion.p>

            {/* <motion.p
            variants={revealItem}
            className="mt-10 max-w-xl text-base leading-7 sm:text-lg lg:text-xl"
            style={{ color: 'var(--color-muted)' }}
          >
            Personalized Loshu grid <br/> readings by{' '} <br />
            <span style={{ color: 'var(--color-ink)', fontWeight: 'bold', fontStyle: 'italic' }}>
              {THEME.site.numerologistName}
            </span> <br />
            that bring clarity to your  <br/> strengths, timing and destiny path.
          </motion.p> */}

          {/* <motion.ul
            variants={revealItem}
            className="mt-6 flex flex-wrap gap-2.5 sm:gap-3"
            role="list"
          >
            {GUIDANCE_PILLARS.map(item => (
              <li
                key={item}
                className="rounded-full px-3 py-1.5 text-sm"
                style={{
                  color: 'var(--color-muted)',
                  background: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-border) 84%, white)',
                }}
              >
                {item}
              </li>
            ))}
          </motion.ul> */}

          <motion.div
            variants={revealItem}
            className="mt-24 flex flex-col gap-3 sm:mt-12 sm:flex-row"
          >
            <motion.a
              href="#loshu"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-base font-medium text-white shadow-[0_20px_45px_rgba(79,70,229,0.24)] sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, var(--color-rose), var(--color-rose-dark))',
              }}
              whileHover={allowRichMotion ? { scale: 1.02, y: -2 } : undefined}
              whileTap={{ scale: 0.98 }}
            >
              Get Your Free Chart
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </motion.a>

            <motion.a
              href="#services"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-7 text-base font-medium sm:w-auto"
              style={{
                color: 'var(--color-teal)',
                borderColor: 'color-mix(in srgb, var(--color-teal) 24%, var(--color-border))',
                background: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
              }}
              whileHover={allowRichMotion ? { scale: 1.02, y: -2 } : undefined}
              whileTap={{ scale: 0.98 }}
            >
              Explore Services
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </motion.a>
          </motion.div>

          <motion.div
            variants={revealItem}
            className="mt-8 grid grid-cols-3 gap-2 border-t pt-6 sm:mt-10 sm:gap-6 lg:gap-8"
            style={{
              borderColor: 'color-mix(in srgb, var(--color-border) 78%, white)',
            }}
          >
            {TRUST_ITEMS.map(item => (
              <div key={item.label} className="min-w-0 text-center sm:text-left">
                <div
                  className="font-heading text-xl leading-none sm:text-3xl"
                  style={{ color: 'var(--color-ink)', fontWeight: '600' }}
                >
                  {item.value}
                </div>
                <div className="mt-1 text-[0.80rem] leading-tight sm:mt-2 sm:text-base" style={{ color: 'var(--color-muted)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={revealItem} className="mt-8 w-full max-w-none sm:mt-10 sm:w-[min(100vw-3rem,54rem)] lg:w-[min(100vw-6rem,62rem)]">
            <p className="sr-only">
              Personalized readings, delivered within 72 hours, with expert-verified predictions.
            </p>

              <div
                className="relative overflow-hidden rounded-full border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--color-border) 84%, white)',
                  background: 'color-mix(in srgb, white 22%, transparent)',
                }}
              >
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/50 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-bg)] via-[var(--color-bg)]/50 to-transparent"
                  aria-hidden="true"
                />

                <div className="flex min-w-max whitespace-nowrap animate-marquee gap-10 px-6 py-3 sm:gap-12 sm:px-8" aria-hidden="true">
                  {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="text-sm font-medium sm:text-base"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      {item} <span className="mx-3 opacity-40">|</span>
                    </span>
                  ))}
                </div>
              </div>
       
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
