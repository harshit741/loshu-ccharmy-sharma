import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Youtube, Facebook } from 'lucide-react'
import { THEME } from '@/lib/theme'

const FOOTER_LINKS = [
  { label: 'Calculator', href: '/#loshu' },
  { label: 'Services', href: '/#services' },
  { label: 'About Ccharmy', href: '/#about' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="footer"
      className="border-t px-4 py-14 sm:px-6 sm:py-16"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
      role="contentinfo"
    >
      <div className="max-container">
        <div className="mb-12 grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center justify-center gap-3 md:justify-start">
              <span className="flex h-12 w-12 items-center justify-center rounded-full dark:bg-white dark:p-1">
                <Image
                  src="/logo.png"
                  alt={`${THEME.site.name} logo`}
                  width={44}
                  height={44}
                  sizes="48px"
                  className="h-11 w-auto object-contain"
                />
              </span>
              <span className="font-heading text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                {THEME.site.name}
              </span>
            </div>

            <p className="mx-auto max-w-xs text-sm leading-relaxed md:mx-0" style={{ color: 'var(--color-muted)' }}>
              Professional numerology consultations rooted in ancient Vedic and Chaldean Numerology.
              Helping you discover your numbers and decode your destiny.
            </p>

            <div className="mt-5 flex justify-center gap-3 md:justify-start">
              {[
                { Icon: Instagram, href: THEME.site.instagram, label: 'Instagram' },
                { Icon: Youtube, href: THEME.site.youtube, label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-all hover:-translate-y-0.5"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                  aria-label={label}
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
              Navigate
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2.5">
                {FOOTER_LINKS.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center text-sm transition-colors hover:text-[var(--color-rose)]"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
              Legal
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center text-sm transition-colors hover:text-[var(--color-rose)]"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                Contact
              </h3>
              <p className="break-words text-sm" style={{ color: 'var(--color-muted)' }}>
                {THEME.site.email}
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
                {THEME.site.phone}
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row sm:text-left"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            &copy; {currentYear} {THEME.site.name}. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Made with care by{' '}
            <a href="http://harshitsingh.work" target="_blank" rel="noopener noreferrer">
              Harshit Singh
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
