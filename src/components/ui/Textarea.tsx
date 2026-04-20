import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, required, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 8)}`

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium"
            style={{ color: 'var(--color-ink)' }}
          >
            {label}
            {required && (
              <span className="text-red-400 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none',
            'bg-[var(--color-bg)] text-[var(--color-ink)]',
            'border placeholder:text-[var(--color-muted)]',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-[var(--color-border)] focus:border-[var(--color-rose)] focus:ring-2 focus:ring-[var(--color-rose-light)]',
            className
          )}
          {...props}
        />

        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${textareaId}-hint`} className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
