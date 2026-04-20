'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { THEME } from '@/lib/theme'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { label: 'Calculator', href: '#loshu' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(88)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeOnDesktop, { passive: true })
    return () => window.removeEventListener('resize', closeOnDesktop)
  }, [])

  useEffect(() => {
    const node = headerRef.current

    if (!node) return

    const syncHeaderHeight = () => {
      setHeaderHeight(node.getBoundingClientRect().height)
    }

    syncHeaderHeight()

    const observer = new ResizeObserver(() => {
      syncHeaderHeight()
    })

    observer.observe(node)
    window.addEventListener('resize', syncHeaderHeight, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncHeaderHeight)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'py-2.5 shadow-lg sm:py-3' : 'py-3 sm:py-4',
        scrolled || menuOpen
          ? 'border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl'
          : 'bg-transparent'
      )}
      role="banner"
    >
      <nav
        className="max-container flex min-h-[4.5rem] items-center justify-between gap-3 px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5"
          aria-label={`${THEME.site.name} home`}
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full dark:bg-white dark:p-1">
            <Image
              src="/logo.png"
              alt={`${THEME.site.name} logo`}
              width={44}
              height={44}
              sizes="44px"
              className="h-10 w-auto object-contain"
              priority
            />
          </span>
          <div className="min-w-0">
            <span
              className="block truncate font-heading text-base font-semibold tracking-wide sm:text-lg xl:text-xl"
              style={{ color: 'var(--color-ink)' }}
            >
              {THEME.site.name}
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-4 md:flex lg:gap-5 xl:gap-6" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-[44px] items-center text-sm font-medium transition-colors duration-200 hover:text-[var(--color-rose)]"
                style={{ color: 'var(--color-muted)' }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 lg:gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors hover:bg-[var(--color-sage-light)]"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} style={{ color: 'var(--color-rose)' }} />
              ) : (
                <Moon size={18} style={{ color: 'var(--color-muted)' }} />
              )}
            </button>
          )}

          <Link
            href="/consultation"
            className="hidden min-h-[44px] items-center rounded-full bg-[var(--color-rose)] px-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg md:inline-flex lg:px-5"
          >
            Book a Consultation
          </Link>

          <button
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-[var(--color-sage-light)] md:hidden"
            onClick={() => setMenuOpen(open => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <X size={20} style={{ color: 'var(--color-ink)' }} />
            ) : (
              <Menu size={20} style={{ color: 'var(--color-ink)' }} />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 bottom-0 bg-[var(--color-bg)]/70 md:hidden"
              style={{ top: `${headerHeight}px` }}
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed left-0 right-0 overflow-y-auto border-b border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl md:hidden"
              style={{
                top: `${headerHeight}px`,
                maxHeight: `calc(100dvh - ${headerHeight}px)`,
              }}
            >
              <ul className="grid gap-2 px-4 pb-5 pt-3 sm:px-6" role="list">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex min-h-[44px] items-center rounded-2xl px-4 text-base font-medium"
                      style={{ color: 'var(--color-ink)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}

                <li className="pt-1">
                  <Link
                    href="/consultation"
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--color-rose)] px-5 text-sm font-medium text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Book a Consultation
                  </Link>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
