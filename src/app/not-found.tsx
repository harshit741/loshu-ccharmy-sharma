import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="max-w-md text-center">
        <div
          className="font-heading text-7xl font-light leading-none opacity-10 select-none sm:text-[9rem] lg:text-[12rem]"
          style={{ color: 'var(--color-rose)' }}
          aria-hidden="true"
        >
          404
        </div>

        <div className="-mt-6 sm:-mt-10">
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl" style={{ color: 'var(--color-ink)' }}>
            Page not found
          </h1>
          <p className="mb-8 mt-3 text-sm leading-7 sm:text-base" style={{ color: 'var(--color-muted)' }}>
            The cosmic thread you followed seems to have dissolved into the ether.
            Let us guide you back.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-rose)] px-6 text-sm font-medium text-white"
            >
              Return Home
            </Link>
            <Link
              href="/consultation"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 text-sm font-medium"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-ink)' }}
            >
              Book a Reading
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
