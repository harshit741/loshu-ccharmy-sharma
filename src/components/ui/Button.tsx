import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--color-rose)] text-white hover:opacity-90 shadow-md hover:shadow-lg',
  secondary: 'bg-[var(--color-teal)] text-white hover:opacity-90 shadow-md hover:shadow-lg',
  outline:   'border border-[var(--color-rose)] text-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-white',
  ghost:     'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-sage-light)]',
  danger:    'bg-red-500 text-white hover:bg-red-600 shadow-md',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] px-4 text-sm rounded-lg',
  md: 'min-h-[44px] px-6 text-sm rounded-xl',
  lg: 'min-h-12 px-8 text-base rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'hover:-translate-y-0.5 active:translate-y-0',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin flex-shrink-0" size={16} aria-hidden="true" />
        ) : (
          leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
