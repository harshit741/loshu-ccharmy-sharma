'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error('Global error:', error)
  }, [error])

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'color-mix(in srgb, var(--color-rose) 16%, transparent)' }}
          aria-hidden="true"
        >
          <AlertTriangle size={36} style={{ color: 'var(--color-rose)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-heading text-3xl font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>
            Something went wrong
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            An unexpected error occurred. Don&apos;t worry — your booking and reading data is safe.
            Please try refreshing the page.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white"
              style={{ background: 'var(--color-rose)' }}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-ink)' }}
            >
              <Home size={14} aria-hidden="true" />
              Go home
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="text-xs cursor-pointer" style={{ color: 'var(--color-muted)' }}>
                Error details (dev only)
              </summary>
              <pre className="mt-2 p-4 rounded-xl text-xs overflow-auto"
                style={{ background: 'var(--color-surface)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </motion.div>
      </div>
    </main>
  )
}
