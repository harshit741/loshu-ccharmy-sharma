'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  titleAccent?: string
  accentStyle?: 'italic' | 'gradient' | 'teal'
  subtitle?: string
  center?: boolean
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  accentStyle = 'italic',
  subtitle,
  center = true,
  id,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('mb-14', center && 'text-center')}
    >
      {eyebrow && (
        <span
          className="text-sm font-medium tracking-widest uppercase"
          style={{ color: 'var(--color-rose)' }}
        >
          {eyebrow}
        </span>
      )}

      <h2
        id={id}
        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light mt-2 mb-4 text-balance"
        style={{ color: 'var(--color-ink)' }}
      >
        {title}{' '}
        {titleAccent && (
          <span
            className={cn(
              accentStyle === 'italic'   && 'italic font-semibold',
              accentStyle === 'gradient' && 'italic font-semibold gradient-text',
              accentStyle === 'teal'     && 'italic font-semibold',
            )}
            style={
              accentStyle === 'teal'
                ? { color: 'var(--color-teal)' }
                : accentStyle === 'italic'
                ? { color: 'var(--color-rose)' }
                : {}
            }
          >
            {titleAccent}
          </span>
        )}
      </h2>

      {subtitle && (
        <p
          className="max-w-2xl text-base leading-relaxed"
          style={{
            color: 'var(--color-muted)',
            marginInline: center ? 'auto' : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
