import { cn } from '@/utils/cn'

interface DividerProps {
  label?: string
  variant?: 'solid' | 'dashed' | 'gradient'
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Divider({ label, variant = 'solid', className, orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('w-px self-stretch', className)}
        style={{ background: 'var(--color-border)' }}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (label) {
    return (
      <div
        className={cn('flex items-center gap-3', className)}
        role="separator"
        aria-label={label}
      >
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} aria-hidden="true" />
        <span className="text-xs font-medium px-2" style={{ color: 'var(--color-muted)' }}>
          {label}
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} aria-hidden="true" />
      </div>
    )
  }

  const borderStyle =
    variant === 'gradient'
      ? { background: 'linear-gradient(90deg, transparent, var(--color-rose), transparent)', height: '1px' }
      : variant === 'dashed'
      ? { borderTop: '1px dashed var(--color-border)' }
      : { borderTop: '1px solid var(--color-border)' }

  return (
    <hr
      className={cn('border-0', className)}
      style={borderStyle}
      role="separator"
    />
  )
}
