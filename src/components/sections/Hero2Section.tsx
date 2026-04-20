'use client'

import Image from 'next/image'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'
import bookImage from '@/assets/images/book-p-optimized-medium.png'
import { Button } from '@/components/ui/Button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

const LOSHU_GRID_LAYOUT = [[4, 9, 2], [3, 5, 7], [8, 1, 6]]

const GRID_RESONANCE: Partial<Record<number, string>> = {}

const GRID_LABELS: Record<number, string> = {
  1: 'Sun',
  2: 'Moon',
  3: 'Jupiter',
  4: 'Rahu',
  5: 'Mercury',
  6: 'Venus',
  7: 'Ketu',
  8: 'Saturn',
  9: 'Mars',
}

const STAR_POSITIONS = [
  { top: '12%', left: '8%', size: 'h-1.5 w-1.5', delay: 0.2 },
  { top: '22%', left: '86%', size: 'h-1 w-1', delay: 0.8 },
  { top: '64%', left: '7%', size: 'h-1.5 w-1.5', delay: 1.2 },
  { top: '72%', left: '82%', size: 'h-1 w-1', delay: 1.8 },
  { top: '14%', left: '58%', size: 'h-1 w-1', delay: 2.1 },
  { top: '80%', left: '56%', size: 'h-1.5 w-1.5', delay: 2.8 },
]

function HeroBackground({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at top left, color-mix(in srgb, var(--color-rose, #f43f5e) 14%, transparent), transparent 34%),
            radial-gradient(circle at 82% 20%, color-mix(in srgb, var(--color-teal, #14b8a6) 16%, transparent), transparent 28%),
            radial-gradient(circle at 50% 78%, color-mix(in srgb, var(--color-rose-light, #fda4af) 65%, transparent), transparent 32%),
            linear-gradient(180deg, color-mix(in srgb, var(--color-bg, #0f172a) 90%, white), var(--color-bg, #0f172a))
          `,
        }}
      />

      <div className="absolute inset-0 bg-noise opacity-[0.06]" />

      <motion.div
        className="absolute -left-10 top-16 h-56 w-56 rounded-full blur-[96px] sm:-left-20 sm:top-20 sm:h-72 sm:w-72 sm:blur-[110px]"
        style={{ background: 'color-mix(in srgb, var(--color-rose, #f43f5e) 24%, transparent)' }}
        animate={shouldReduceMotion ? undefined : { x: [0, 26, 0], y: [0, -18, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <motion.div
        className="absolute -right-8 top-1/3 h-64 w-64 rounded-full blur-[110px] sm:-right-20 sm:h-80 sm:w-80 sm:blur-[120px]"
        style={{ background: 'color-mix(in srgb, var(--color-teal, #14b8a6) 22%, transparent)' }}
        animate={shouldReduceMotion ? undefined : { x: [0, -24, 0], y: [0, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {STAR_POSITIONS.map(star => (
          <motion.span
            key={star.top}
            className={`absolute rounded-full bg-white/70 ${star.size}`}
            style={{ top: star.top, left: star.left }}
            animate={shouldReduceMotion ? undefined : { opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>
    </>
  )
}

function FloatingBook({
  shouldReduceMotion,
  className,
}: {
  shouldReduceMotion: boolean
  className?: string
}) {
  return (
    <div className={cn('relative flex w-[min(100%,14rem)] shrink-0 items-center justify-center sm:w-60 lg:w-72 xl:w-80', className)}>
      <motion.div
        className="absolute -bottom-10 left-1/2 h-6 w-[90%] -translate-x-1/2 rounded-full blur-[18px] sm:-bottom-12"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.5) 0%, transparent 70%)',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.6, 0.3, 0.6],
                scaleX: [1, 0.8, 1],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -16, 0],
                rotate: [0, 0, 0],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="relative"
          style={{
            filter: 'drop-shadow(-18px 22px 18px rgba(15, 23, 42, 0.16))',
          }}
        >
          <Image
            src={bookImage}
            alt="Numerology book"
            width={520}
            height={520}
            sizes="(min-width: 1280px) 320px, (min-width: 1024px) 288px, (min-width: 640px) 240px, 224px"
            placeholder="blur"
            className="h-auto w-full select-none"
          />
        </div>
      </motion.div>
    </div>
  )
}

function LoshuVisual({
  shouldReduceMotion,
  interactiveEnabled,
}: {
  shouldReduceMotion: boolean
  interactiveEnabled: boolean
}) {
  const rotateXBase = useMotionValue(0)
  const rotateYBase = useMotionValue(0)
  const shiftXBase = useMotionValue(0)
  const shiftYBase = useMotionValue(0)
  const glowXBase = useMotionValue(50)
  const glowYBase = useMotionValue(50)

  const rotateX = useSpring(rotateXBase, { stiffness: 110, damping: 18, mass: 0.6 })
  const rotateY = useSpring(rotateYBase, { stiffness: 110, damping: 18, mass: 0.6 })
  const shiftX = useSpring(shiftXBase, { stiffness: 120, damping: 20, mass: 0.7 })
  const shiftY = useSpring(shiftYBase, { stiffness: 120, damping: 20, mass: 0.7 })
  const glowX = useSpring(glowXBase, { stiffness: 140, damping: 24, mass: 0.8 })
  const glowY = useSpring(glowYBase, { stiffness: 140, damping: 24, mass: 0.8 })

  const glow = useMotionTemplate`
    radial-gradient(220px circle at ${glowX}% ${glowY}%, color-mix(in srgb, var(--color-rose, #f43f5e) 18%, transparent), transparent 72%)
  `

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!interactiveEnabled) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - bounds.left) / bounds.width) * 100
    const py = ((event.clientY - bounds.top) / bounds.height) * 100

    glowXBase.set(px)
    glowYBase.set(py)
    rotateYBase.set((px - 50) / 8)
    rotateXBase.set((50 - py) / 9)
    shiftXBase.set((px - 50) / 13)
    shiftYBase.set((py - 50) / 13)
  }

  const handleLeave = () => {
    rotateXBase.set(0)
    rotateYBase.set(0)
    shiftXBase.set(0)
    shiftYBase.set(0)
    glowXBase.set(50)
    glowYBase.set(50)
  }

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,30rem)] [perspective:1400px] lg:mx-0 lg:max-w-[26rem] xl:max-w-[28rem]">
      <motion.div
        className="absolute inset-6 rounded-full border sm:inset-7"
        aria-hidden="true"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-teal, #14b8a6) 20%, var(--color-border, #e2e8f0))',
        }}
        animate={shouldReduceMotion ? undefined : { rotate: [0, 360] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute inset-12 rounded-full border border-dashed sm:inset-14"
        aria-hidden="true"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-rose, #f43f5e) 24%, var(--color-border, #e2e8f0))',
        }}
        animate={shouldReduceMotion ? undefined : { rotate: [360, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative overflow-hidden rounded-[2rem] border p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6 lg:p-5 xl:p-6"
          style={{
            rotateX,
            rotateY,
            x: shiftX,
            y: shiftY,
            transformStyle: 'preserve-3d',
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-surface, #ffffff) 94%, transparent), color-mix(in srgb, var(--color-bg, #0f172a) 88%, white))',
            borderColor: 'color-mix(in srgb, var(--color-border, #e2e8f0) 82%, white)',
          }}
        >
          <motion.div className="pointer-events-none absolute inset-0 rounded-[2rem]" style={{ backgroundImage: glow }} />

          <div
            className="absolute inset-0 opacity-55"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle at center, color-mix(in srgb, var(--color-teal-light, #99f6e4) 70%, transparent), transparent 55%)',
            }}
          />

          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.32em]" style={{ color: 'var(--color-muted, #64748b)' }}>
                  Loshu grid reading
                </p>
                <h3 className="mt-3 font-heading text-2xl leading-none sm:text-[2.4rem] lg:text-[2.2rem] xl:text-[2.6rem]" style={{ color: 'var(--color-ink, #1e293b)' }}>
                  Sacred Loshu Grid
                </h3>
              </div>

              {/* <div
                className="w-fit rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.26em]"
                style={{
                  color: 'var(--color-teal, #14b8a6)',
                  borderColor: 'color-mix(in srgb, var(--color-teal, #14b8a6) 22%, var(--color-border, #e2e8f0))',
                  background: 'color-mix(in srgb, var(--color-teal-light, #99f6e4) 55%, transparent)',
                }}
              >
                Live intuition
              </div> */}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:mt-7 sm:gap-3.5">
              {LOSHU_GRID_LAYOUT.flat().map(number => {
                const active = GRID_RESONANCE[number] !== undefined

                return (
                  <motion.div
                    key={number}
                    className="relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 lg:p-3.5 xl:p-4"
                    style={{
                      borderColor: active
                        ? 'color-mix(in srgb, var(--color-rose, #f43f5e) 20%, var(--color-border, #e2e8f0))'
                        : 'color-mix(in srgb, var(--color-border, #e2e8f0) 84%, white)',
                      background: active
                        ? 'linear-gradient(180deg, color-mix(in srgb, var(--color-rose-light, #fda4af) 72%, white), color-mix(in srgb, var(--color-surface, #ffffff) 88%, white))'
                        : 'color-mix(in srgb, var(--color-surface, #ffffff) 86%, transparent)',
                    }}
                    whileHover={interactiveEnabled ? { scale: 1.03, y: -4 } : undefined}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="text-[0.65rem] uppercase tracking-[0.24em]" style={{ color: 'var(--color-muted, #64748b)' }}>
                      {GRID_LABELS[number]}
                    </div>
                    <div className="mt-3 font-heading text-3xl leading-none sm:text-4xl lg:text-[2rem] xl:text-4xl" style={{ color: 'var(--color-ink, #1e293b)' }}>
                      {number}
                    </div>

                    {active && (
                      <motion.div
                        className="absolute inset-x-3 bottom-2 h-px"
                        aria-hidden="true"
                        style={{
                          background: 'linear-gradient(90deg, transparent, var(--color-rose, #f43f5e), transparent)',
                        }}
                        animate={shouldReduceMotion ? undefined : { opacity: [0.3, 0.9, 0.3] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* <div className="mt-6 border-t pt-5" style={{ borderColor: 'color-mix(in srgb, var(--color-border, #e2e8f0) 78%, white)' }}>
              <p className="text-sm leading-7" style={{ color: 'var(--color-muted, #64748b)' }}>
                A calm reading surface designed to highlight strengths, gaps, and energetic balance at a glance.
              </p>
            </div> */}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Hero2Section() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const disableAmbientMotion = shouldReduceMotion || isCoarsePointer
  const [interactiveEnabled, setInteractiveEnabled] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const sync = () => setInteractiveEnabled(!disableAmbientMotion && mediaQuery.matches)

    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [disableAmbientMotion])

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
      <HeroBackground shouldReduceMotion={disableAmbientMotion} />

      <div className="relative z-10 max-container px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <div className="flex flex-col items-center gap-10 text-center lg:items-start lg:text-left">
            <FloatingBook shouldReduceMotion={disableAmbientMotion} className="lg:-ml-10 xl:-ml-12" />

            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto lg:ml-2 xl:ml-3"
              onClick={() => {
                window.location.href = '/#loshu'
              }}
            >
              Get your Free Reading
            </Button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LoshuVisual
              shouldReduceMotion={disableAmbientMotion}
              interactiveEnabled={interactiveEnabled}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
