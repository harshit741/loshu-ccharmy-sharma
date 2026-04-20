import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, id, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: 'var(--color-ink)' }}
          >
            {label}
            {required && (
              <span className="text-red-400 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <span
              className="absolute left-3 flex items-center"
              style={{ color: 'var(--color-muted)' }}
              aria-hidden="true"
            >
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              'w-full px-4 py-3 rounded-xl text-sm transition-all outline-none',
              'bg-[var(--color-bg)] text-[var(--color-ink)]',
              'border placeholder:text-[var(--color-muted)]',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-[var(--color-border)] focus:border-[var(--color-rose)] focus:ring-2 focus:ring-[var(--color-rose-light)]',
              leftAddon  && 'pl-10',
              rightAddon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <span
              className="absolute right-3 flex items-center"
              style={{ color: 'var(--color-muted)' }}
              aria-hidden="true"
            >
              {rightAddon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
