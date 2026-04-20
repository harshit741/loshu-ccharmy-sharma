'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function CountUp({ end, duration = 2000, suffix = '', prefix = '', decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, prefersReducedMotion, started])

  useEffect(() => {
    if (!started) return

    const startTime = performance.now()
    const startValue = 0

    const update = (currentTime: number) => {
      const elapsed  = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.floor(startValue + (end - startValue) * eased)
      setCount(current)
      if (progress < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }, [started, end, duration])

  return (
    <span ref={ref}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  )
}

interface StatCardProps {
  value: string | number
  label: string
  suffix?: string
  icon?: React.ReactNode
}

export function StatCard({ value, label, suffix, icon }: StatCardProps) {
  return (
    <div
      className="flex flex-col items-center text-center p-5 rounded-2xl"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      {icon && (
        <div className="mb-2 text-[var(--color-rose)]" aria-hidden="true">{icon}</div>
      )}
      <div
        className="font-heading text-3xl font-bold"
        style={{ color: 'var(--color-ink)' }}
        aria-label={`${value}${suffix || ''} ${label}`}
      >
        {typeof value === 'number'
          ? <CountUp end={value} suffix={suffix} />
          : <>{value}{suffix}</>
        }
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
        {label}
      </div>
    </div>
  )
}
