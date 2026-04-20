'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Zap } from 'lucide-react'
import type { NumerologyResult } from '@/utils/numerology'
import { MISSING_NUMBER_MEANINGS } from '@/utils/numerology'
import { formatDobForDisplay } from '@/utils/date'
import { staggerItem, staggerParent } from '@/lib/motion'

interface Props {
  result: NumerologyResult | null
  name: string
  dob: string
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--color-teal)' }}>
      {children}
    </p>
  )
}

function TraitList({ items, icon = 'check' }: { items: string[]; icon?: 'check' | 'alert' }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {icon === 'check' ? (
            <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-teal)' }} aria-hidden="true" />
          ) : (
            <AlertCircle size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-rose)' }} aria-hidden="true" />
          )}
          {item}
        </li>
      ))}
    </ul>
  )
}

function EmptyState() {
  return (
    <section id="analysis" className="px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="analysis-heading">
      <div className="max-container text-center">
        <h2 id="analysis-heading" className="font-heading text-3xl font-light sm:text-4xl lg:text-5xl" style={{ color: 'var(--color-ink)' }}>
          Detailed{' '}
          <span className="italic font-semibold" style={{ color: 'var(--color-rose)' }}>
            Analysis
          </span>
        </h2>
        <p style={{ color: 'var(--color-muted)' }} className="mt-4 text-base leading-7">
          Complete the Lo Shu calculator above to unlock your full personalized reading.
        </p>
      </div>
    </section>
  )
}

export default function AnalysisSection({ result, name, dob }: Props) {
  if (!result) return <EmptyState />

  const { personalityData, destinyData, activePlanes, missingNumbers, repeatingNumbers } = result
  const formattedDob = formatDobForDisplay(dob)

  return (
    <section id="analysis" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24" aria-labelledby="analysis-heading">
      <div className="max-container">
        <motion.div
          variants={staggerParent()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mb-12 text-center sm:mb-14"
        >
          <motion.h2
            variants={staggerItem}
            id="analysis-heading"
            className="font-heading text-3xl font-light sm:text-4xl lg:text-5xl"
            style={{ color: 'var(--color-ink)' }}
          >
            Reading for <span className="italic font-semibold gradient-text">{name}</span>
          </motion.h2>
          <motion.p variants={staggerItem} className="mt-3 text-sm sm:text-base" style={{ color: 'var(--color-muted)' }}>
            Born {formattedDob}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerParent(0.05, 0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {[
            { label: 'Personality Number', value: result.personalityNumber, sub: personalityData.planet, color: 'var(--color-rose)' },
            { label: 'Destiny Number', value: result.destinyNumber, sub: destinyData.planet, color: 'var(--color-teal)' },
          ].map(item => (
            <motion.div
              key={item.label}
              variants={staggerItem}
              className="rounded-3xl p-5 text-center sm:p-6"
              style={{ border: `2px solid ${item.color}`, background: 'var(--color-surface)' }}
            >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.1,
                filter: `drop-shadow(0 0 6px ${item.color}60)`
              }}
            transition={{ type: 'spring', stiffness: 220, damping: 24, duration: 0.45 }}
              className="font-heading text-5xl font-bold sm:text-6xl inline-block"
              style={{
                color: item.color,

                // ✨ subtle, soft glow
                textShadow: `0 0 4px ${item.color}`,

                // ✨ very light outer bloom
                filter: `drop-shadow(0 0 10px ${item.color}40)`,

                WebkitTextFillColor: item.color,
              }}
            >
              {item.value}
            </motion.div>
              <div className="mt-3 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                {item.label}
              </div>
              <div className="mt-2 text-sm" style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
                {item.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div
            className="rounded-3xl p-5 sm:p-6 lg:p-8"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-rose) 10%, white) 0%, color-mix(in srgb, var(--color-teal) 10%, white) 100%)',
              border: '1px solid color-mix(in srgb, var(--color-rose) 28%, transparent)',
            }}
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-heading text-2xl font-bold sm:h-14 sm:w-14"
                style={{ background: 'var(--color-rose)', color: 'white' }}
              >
                {result.personalityNumber}
              </div>
              <div className="min-w-0">
                <SectionLabel>
                  Personality Number {result.personalityNumber} &middot; {personalityData.planet}
                </SectionLabel>
                <h3 className="font-heading text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--color-ink)' }}>
                  {personalityData.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--color-rose)' }}>
                  General Traits
                </p>
                <TraitList items={personalityData.generalTraits} icon="check" />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--color-rose)' }}>
                    Challenges to Watch
                  </p>
                  <TraitList items={personalityData.negativeTraits} icon="alert" />
                </div>

                {personalityData.advice.length > 0 && (
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: 'color-mix(in srgb, var(--color-rose) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-rose) 24%, transparent)',
                    }}
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--color-rose)' }}>
                      Guidance and Advice
                    </p>
                    <ul className="space-y-2">
                      {personalityData.advice.map((advice, index) => (
                        <li key={index} className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                          <span style={{ color: 'var(--color-rose)' }}>&bull;</span> {advice}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div
            className="rounded-3xl p-5 sm:p-6 lg:p-8"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-teal) 10%, white) 0%, color-mix(in srgb, var(--color-sage-light) 85%, white) 100%)',
              border: '1px solid color-mix(in srgb, var(--color-teal) 24%, transparent)',
            }}
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-heading text-2xl font-bold sm:h-14 sm:w-14"
                style={{ background: 'var(--color-teal)', color: 'white' }}
              >
                {result.destinyNumber}
              </div>
              <div className="min-w-0">
                <SectionLabel>
                  Destiny Number {result.destinyNumber} &middot; {destinyData.planet}
                </SectionLabel>
                <h3 className="font-heading text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--color-ink)' }}>
                  {destinyData.title}
                </h3>
              </div>
            </div>
            <TraitList items={destinyData.traits} icon="check" />
          </div>
        </motion.div>

        {activePlanes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="relative rounded-3xl p-5 sm:p-6 lg:p-8 overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              {/* Floating particles background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Randomly moving circles */}
                <motion.div
                  className="absolute h-16 w-16 rounded-full border border-dashed opacity-15"
                  style={{
                    borderColor: 'var(--color-teal)',
                    top: '10%',
                    left: '5%'
                  }}
                  animate={{
                    x: [0, 200, -10, 10, 0],
                    y: [0, -10, 80, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.1
                  }}
                />

                <motion.div
                  className="absolute h-12 w-12 rounded-full border opacity-12"
                  style={{
                    borderColor: 'var(--color-rose)',
                    top: '70%',
                    right: '10%'
                  }}
                  animate={{
                    x: [0, 200, -10, 10, 0],
                    y: [0, -10, 80, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2
                  }}
                />

                <motion.div
                  className="absolute h-8 w-8 rounded-full border opacity-10"
                  style={{
                    borderColor: 'var(--color-teal)',
                    backgroundColor: 'color-mix(in srgb, var(--color-teal) 1%, transparent)',
                    top: '40%',
                    left: '60%'
                  }}
                  animate={{
                    x: [0, 200, -10, 10, 0],
                    y: [0, -10, 80, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1
                  }}
                />

                <motion.div
                  className="absolute h-10 w-10 rounded-full border opacity-13"
                  style={{
                    borderColor: 'var(--color-rose)',
                    top: '20%',
                    right: '30%'
                  }}
                  animate={{
                    x: [0, 200, -10, 10, 0],
                    y: [0, -10, 80, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 3
                  }}
                />

                <motion.div
                  className="absolute h-6 w-6 rounded-full border opacity-8"
                  style={{
                    borderColor: 'var(--color-teal)',
                    backgroundColor: 'color-mix(in srgb, var(--color-teal) 1%, transparent)',
                    bottom: '15%',
                    left: '25%'
                  }}
                  animate={{
                    x: [0, 200, -10, 10, 0],
                    y: [0, -10, 80, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5
                  }}
                />

                <motion.div
                  className="absolute h-14 w-14 rounded-full border opacity-18"
                  style={{
                    borderColor: 'var(--color-rose)',
                    top: '5%',
                    right: '5%'
                  }}
                  animate={{
                    x: [0, 200, -10, 10, 0],
                    y: [0, -10, 80, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 4
                  }}
                />

                <motion.div
                  className="absolute h-7 w-7 rounded-full border opacity-6"
                  style={{
                    borderColor: 'var(--color-teal)',
                    backgroundColor: 'color-mix(in srgb, var(--color-teal) 1%, transparent)',
                    bottom: '30%',
                    left: '70%'
                  }}
                  animate={{
                    x: [0, 200, -10, 10, 0],
                    y: [0, -10, 80, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.5
                  }}
                />

                {/* Floating particles */}
                {[
                  { top: '15%', left: '12%', size: 'h-2 w-2', delay: 0.5, color: 'var(--color-teal)' },
                  { top: '25%', right: '18%', size: 'h-1.5 w-1.5', delay: 1.2, color: 'var(--color-rose)' },
                  { top: '60%', left: '15%', size: 'h-1 w-1', delay: 2.1, color: 'var(--color-teal)' },
                  { top: '75%', right: '12%', size: 'h-2 w-2', delay: 0.8, color: 'var(--color-rose)' },
                  { top: '40%', left: '85%', size: 'h-1.5 w-1.5', delay: 1.8, color: 'var(--color-teal)' },
                  { top: '85%', right: '25%', size: 'h-1 w-1', delay: 2.5, color: 'var(--color-rose)' },
                  { top: '8%', left: '50%', size: 'h-1 w-1', delay: 0.3, color: 'var(--color-teal)' },
                  { top: '35%', left: '8%', size: 'h-1.5 w-1.5', delay: 1.5, color: 'var(--color-rose)' },
                  { top: '50%', right: '8%', size: 'h-1 w-1', delay: 2.8, color: 'var(--color-teal)' },
                  { top: '90%', left: '45%', size: 'h-2 w-2', delay: 1.0, color: 'var(--color-rose)' },
                  { top: '20%', left: '80%', size: 'h-1 w-1', delay: 2.3, color: 'var(--color-teal)' },
                  { top: '65%', right: '35%', size: 'h-1.5 w-1.5', delay: 0.7, color: 'var(--color-rose)' },
                  { top: '5%', right: '5%', size: 'h-1 w-1', delay: 1.9, color: 'var(--color-teal)' },
                  { top: '55%', left: '25%', size: 'h-1 w-1', delay: 2.6, color: 'var(--color-rose)' },
                  { top: '30%', left: '60%', size: 'h-1.5 w-1.5', delay: 0.9, color: 'var(--color-teal)' },
                ].map((particle, index) => (
                  <motion.div
                    key={index}
                    className={`absolute rounded-full opacity-60 ${particle.size}`}
                    style={{
                      top: particle.top,
                      left: particle.left,
                      right: particle.right,
                      backgroundColor: particle.color,
                    }}
                    animate={{
                      y: [0, -8, 0],
                      x: [0, 4, 0],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 3 + index * 0.3, // Shorter duration = higher frequency
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: particle.delay,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-2">
                  <Zap size={18} style={{ color: 'var(--color-rose)' }} aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--color-teal)' }}>
                    Active Planes and Yogs in Your Grid
                  </p>
                </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {activePlanes.map((plane, index) => (
                  <motion.div
                    key={plane.name}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 18 }}
                    whileHover={{
                      y: -4,
                      scale: 1.02,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    }}
                    className="rounded-2xl p-5 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-teal) 6%, white) 0%, color-mix(in srgb, var(--color-teal) 12%, white) 100%)',
                      border: '1px solid color-mix(in srgb, var(--color-teal) 28%, transparent)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 10,
                    }}
                  >
                    {/* Subtle animated background effect */}
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `radial-gradient(circle at 30% 20%, ${'var(--color-teal)'} 0%, transparent 50%)`,
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.5,
                      }}
                    />

                    <div className="relative z-10">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                          {plane.name}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {[...plane.numbers].map(number => (
                            <motion.span
                              key={number}
                              whileHover={{ scale: 1.1 }}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold transition-colors"
                              style={{
                                background: 'var(--color-teal)',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              }}
                            >
                              {number}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      <p className="mb-3 text-xs italic" style={{ color: 'var(--color-rose)' }}>
                        {plane.shortDesc}
                      </p>
                      <TraitList items={plane.traits} icon="check" />
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {missingNumbers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-full rounded-3xl p-5 sm:p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <SectionLabel>Missing Numbers</SectionLabel>
                <p className="mb-4 text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  Absent numbers represent areas of growth, learning, and karmic lessons in this lifetime.
                </p>
                <div className="space-y-3">
                  {missingNumbers.map(number => (
                    <div key={number} className="flex items-start gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-heading text-base font-bold"
                        style={{ background: 'var(--color-sage-light)', color: 'var(--color-muted)' }}
                      >
                        {number}
                      </span>
                      <p className="pt-1.5 text-sm" style={{ color: 'var(--color-muted)' }}>
                        {MISSING_NUMBER_MEANINGS[number]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {repeatingNumbers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <div className="h-full rounded-3xl p-5 sm:p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <SectionLabel>Repeating Numbers</SectionLabel>
                <p className="mb-4 text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  Numbers appearing more than once carry amplified energy. Their qualities are intensified in your chart.
                </p>
                <div className="space-y-3">
                  {repeatingNumbers.map(({ num, count }) => (
                    <div key={num} className="flex items-start gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-heading text-base font-bold"
                        style={{ background: 'color-mix(in srgb, var(--color-rose) 14%, transparent)', color: 'var(--color-rose)' }}
                      >
                        {num}
                      </span>
                      <div className="pt-0.5">
                        <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                          Appears {count}x - energy amplified
                        </p>
                        <p className="mt-0.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                          The qualities of {num} are a defining force in your chart
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl p-6 text-center sm:p-8"
          style={{ background: 'linear-gradient(135deg, var(--color-rose) 0%, var(--color-teal) 100%)', color: 'white' }}
        >
          <h3 className="font-heading text-2xl font-semibold sm:text-3xl">Want the Complete Picture?</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed opacity-90 sm:text-base">
            This is a preview. Your full reading includes relationship compatibility, career roadmap,
            health analysis, 12-month forecast, name correction, and a personal consultation with Ccharmy.
          </p>
          <a
            href="#services"
            className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-white px-8 text-sm font-medium sm:w-auto"
            style={{ color: 'var(--color-rose)' }}
          >
            Explore Packages
          </a>
        </motion.div>
      </div>
    </section>
  )
}
