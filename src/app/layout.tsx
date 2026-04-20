import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { THEME } from '@/lib/theme'
import MotionProvider from '@/components/providers/MotionProvider'

export const metadata: Metadata = {
  title: {
    default: `${THEME.site.name} — ${THEME.site.tagline}`,
    template: `%s | ${THEME.site.name}`,
  },
  description: `Professional numerology consultations by ${THEME.site.numerologistName}. Uncover your life path, destiny number, and hidden patterns through the ancient science of numbers.`,
  keywords: ['numerology', 'life path number', 'destiny number', 'lo shu grid', 'numerologist', 'numerology reading', 'numerology consultation'],
  authors: [{ name: THEME.site.numerologistName }],
  creator: THEME.site.name,
  metadataBase: new URL('https://CcharmyShah.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://CcharmyShah.com',
    siteName: THEME.site.name,
    title: `${THEME.site.name} — ${THEME.site.tagline}`,
    description: `Transform your life with personalized numerology readings by ${THEME.site.numerologistName}. Book your consultation today.`,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: THEME.site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${THEME.site.name} — ${THEME.site.tagline}`,
    description: 'Discover your numbers, decode your destiny.',
    images: ['/og-image.jpg'],
  },
  manifest: '/site.webmanifest',
  icons: {
    shortcut: '/favicon.ico',
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: THEME.colors.rose,
  width: 'device-width',
  initialScale: 1,
}

function generateThemeCSS() {
  const c = THEME.colors

  return `
    :root {
      --color-rose: ${c.rose};
      --color-cream: ${c.cream};
      --color-sage: ${c.sage};
      --color-teal: ${c.teal};

      --color-rose-dark: ${c.roseDark};
      --color-rose-light: ${c.roseLight};
      --color-teal-dark: ${c.tealDark};
      --color-teal-light: ${c.tealLight};
      --color-sage-light: ${c.sageLight};

      --color-bg: ${c.cream};
      --color-surface: ${c.white};
      --color-border: ${c.sage};
      --color-ink: ${c.ink};
      --color-muted: ${c.muted};
      --color-accent: ${c.rose};
      --color-accent2: ${c.teal};
    }

    .dark {
      --color-bg: #091127;
      --color-surface: #121B38;
      --color-border: #26345E;
      --color-ink: #EFF3FF;
      --color-muted: #A9B5DA;
      --color-accent: ${c.rose};
      --color-accent2: ${c.teal};
    }
  `
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <style
          dangerouslySetInnerHTML={{
            __html: generateThemeCSS(),
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MotionProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-ink)',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-body)',
                },
              }}
            />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
