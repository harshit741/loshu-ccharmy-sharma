import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface SectionProps {
  id?: string
  label?: string       // eyebrow label above heading
  heading: string      // main h2 heading
  accentWord?: string  // word inside heading that gets accent color
  subheading?: string  // paragraph below heading
  children: ReactNode
  className?: string
  headingClassName?: string
  fullBleed?: boolean  // removes max-container constraint
  centered?: boolean   // centers heading text (default true)
  background?: 'default' | 'surface' | 'gradient-rose' | 'gradient-teal' | 'none'
}

const bgStyles: Record<NonNullable<SectionProps['background']>, string> = {
  default:        '',
  surface:        'bg-[var(--color-surface)]',
  'gradient-rose':'',
  'gradient-teal':'',
  none:           '',
}

export function Section({
  id,
  label,
  heading,
  accentWord,
  subheading,
  children,
  className,
  headingClassName,
  fullBleed = false,
  centered = true,
  background = 'default',
}: SectionProps) {
  // If accentWord provided, split heading to wrap accent word
  const renderHeading = () => {
    if (!accentWord) {
      return (
        <h2
          id={id ? `${id}-heading` : undefined}
          className={cn(
            'font-heading text-4xl sm:text-6xl font-light mt-2 mb-4',
            headingClassName
          )}
          style={{ color: 'var(--color-ink)' }}
        >
          {heading}
        </h2>
      )
    }

    const parts = heading.split(accentWord)
    return (
      <h2
        id={id ? `${id}-heading` : undefined}
        className={cn(
          'font-heading text-4xl sm:text-6xl font-light mt-2 mb-4',
          headingClassName
        )}
        style={{ color: 'var(--color-ink)' }}
      >
        {parts[0]}
        <span className="italic font-semibold" style={{ color: 'var(--color-rose)' }}>
          {accentWord}
        </span>
        {parts[1]}
      </h2>
    )
  }

  return (
    <section
      id={id}
      className={cn('py-24 px-4 relative', bgStyles[background], className)}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className={cn(!fullBleed && 'max-container')}>
        {/* Section heading block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={cn('mb-14', centered && 'text-center')}
        >
          {label && (
            <span
              className="text-sm font-medium tracking-widest uppercase"
              style={{ color: 'var(--color-teal)' }}
            >
              {label}
            </span>
          )}
          {renderHeading()}
          {subheading && (
            <p
              className={cn('text-base', centered && 'max-w-xl mx-auto')}
              style={{ color: 'var(--color-muted)' }}
            >
              {subheading}
            </p>
          )}
        </motion.div>

        {children}
      </div>
    </section>
  )
}
