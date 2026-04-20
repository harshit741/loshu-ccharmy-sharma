'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

type ScrollSceneVariant = 'cosmic' | 'flow' | 'portal'

interface ScrollSceneProps {
  children: ReactNode
  variant?: ScrollSceneVariant
  className?: string
  contentClassName?: string
}

export function ScrollScene({
  children,
  variant = 'flow',
  className,
  contentClassName,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.6,
  })

  const enterOpacity =
    variant === 'portal'
      ? [0, 0.88, 1, 0.94]
      : variant === 'cosmic'
        ? [0, 0.82, 1, 0]
        : [0, 0.85, 1, 0.18]

  const enterScale =
    variant === 'portal'
      ? [0.94, 1, 1.012, 1]
      : variant === 'cosmic'
        ? [1, 1, 1, 0.96]
        : [0.985, 1, 1, 0.985]

  const contentYMap =
    variant === 'portal'
      ? [54, 0, -10, -18]
      : variant === 'cosmic'
        ? [40, 0, 0, -20]
        : [56, 0, -18, -30]

  const glowOpacityMap =
    variant === 'cosmic'
      ? [0.44, 0.18, 0.12, 0.04]
      : variant === 'portal'
        ? [0.08, 0.38, 0.22, 0.1]
        : [0.12, 0.16, 0.1, 0.03]

  const backgroundYMap =
    variant === 'portal'
      ? ['8%', '0%', '-6%', '-10%']
      : variant === 'cosmic'
        ? ['12%', '0%', '-4%', '-10%']
        : ['10%', '2%', '-6%', '-12%']

  const textureScaleMap =
    variant === 'portal'
      ? [1.06, 1, 1, 0.98]
      : [1.04, 1, 1, 0.99]

  const opacity = useTransform(smoothProgress, [0, 0.22, 0.62, 1], shouldReduceMotion ? [1, 1, 1, 1] : enterOpacity)
  const scale = useTransform(smoothProgress, [0, 0.22, 0.62, 1], shouldReduceMotion ? [1, 1, 1, 1] : enterScale)
  const y = useTransform(smoothProgress, [0, 0.22, 0.62, 1], shouldReduceMotion ? [0, 0, 0, 0] : contentYMap)
  const glowOpacity = useTransform(smoothProgress, [0, 0.22, 0.62, 1], shouldReduceMotion ? [0, 0, 0, 0] : glowOpacityMap)
  const backgroundY = useTransform(smoothProgress, [0, 0.22, 0.62, 1], shouldReduceMotion ? ['0%', '0%', '0%', '0%'] : backgroundYMap)
  const textureScale = useTransform(smoothProgress, [0, 0.22, 0.62, 1], shouldReduceMotion ? [1, 1, 1, 1] : textureScaleMap)

  const cosmicGlow =
    variant === 'portal'
      ? 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-teal) 18%, transparent), transparent 56%)'
      : variant === 'cosmic'
        ? 'radial-gradient(circle at 50% 26%, color-mix(in srgb, var(--color-rose) 18%, transparent), transparent 58%)'
        : 'radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--color-teal) 14%, transparent), transparent 62%)'

  const texture =
    variant === 'portal'
      ? 'linear-gradient(180deg, color-mix(in srgb, var(--color-teal-light) 34%, transparent), transparent 65%)'
      : 'linear-gradient(180deg, color-mix(in srgb, var(--color-rose-light) 32%, transparent), transparent 62%)'

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
    >
      <motion.div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 rounded-[2.5rem] blur-3xl',
          variant === 'portal' ? 'bottom-8 top-8' : 'bottom-10 top-10'
        )}
        style={{
          opacity: glowOpacity,
          y: backgroundY,
          background: cosmicGlow,
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[6%] inset-y-8 rounded-[2.2rem] opacity-70"
        style={{
          y: backgroundY,
          scale: textureScale,
          background: texture,
        }}
      />

      {variant === 'portal' && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] top-[12%] h-40 rounded-full blur-[60px] sm:h-60 sm:blur-[72px] lg:h-72 lg:blur-[80px]"
          style={{
            opacity: glowOpacity,
            y: backgroundY,
            background: 'radial-gradient(circle at center, color-mix(in srgb, var(--color-rose) 22%, transparent), transparent 68%)',
          }}
        />
      )}

      <motion.div
        className={cn('relative z-10 origin-center will-change-transform', contentClassName)}
        style={{
          y,
          scale,
          opacity,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
