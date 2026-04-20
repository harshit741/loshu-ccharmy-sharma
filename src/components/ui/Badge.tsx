import { type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'rose' | 'teal' | 'sage' | 'cream' | 'success' | 'warning' | 'error' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  rose:    { bg: 'color-mix(in srgb, var(--color-rose) 12%, transparent)', color: 'var(--color-rose)' },
  teal:    { bg: 'color-mix(in srgb, var(--color-teal) 14%, transparent)', color: 'var(--color-teal)' },
  sage:    { bg: 'var(--color-sage-light)', color: 'var(--color-muted)' },
  cream:   { bg: 'var(--color-cream)',      color: 'var(--color-ink)' },
  success: { bg: 'rgba(34,197,94,0.12)',    color: '#16a34a' },
  warning: { bg: 'rgba(234,179,8,0.15)',    color: '#b45309' },
  error:   { bg: 'rgba(239,68,68,0.12)',    color: '#dc2626' },
  neutral: { bg: 'var(--color-border)',     color: 'var(--color-muted)' },
}

export function Badge({ variant = 'rose', dot = false, className, children, ...props }: BadgeProps) {
  const styles = variantStyles[variant]

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', className)}
      style={{ background: styles.bg, color: styles.color }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: 'currentColor' }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
