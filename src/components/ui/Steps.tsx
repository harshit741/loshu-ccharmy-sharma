'use client'

import { cn } from '@/utils/cn'

interface Step {
  id: string
  label: string
  description?: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <nav aria-label="Progress steps" className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive    = index === currentStep
        const isPending   = index > currentStep

        return (
          <div key={step.id} className="flex items-center gap-2">
            {/* Step indicator */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  isCompleted && 'bg-[var(--color-teal)] text-white',
                  isActive    && 'bg-[var(--color-rose)] text-white ring-4 ring-[var(--color-rose-light)]',
                  isPending   && 'border-2 border-[var(--color-border)] text-[var(--color-muted)]'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap hidden sm:block"
                style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-muted)' }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-px flex-1 min-w-[2rem] transition-all mb-5',
                  isCompleted ? 'bg-[var(--color-teal)]' : 'bg-[var(--color-border)]'
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
