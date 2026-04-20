import type { Metadata } from 'next'
import { THEME } from '@/lib/theme'
import ConsultationPageClient from './ConsultationPageClient'

export const metadata: Metadata = {
  title: 'Book a Consultation',
  description: `Book a personal numerology consultation with ${THEME.site.numerologistName}. Choose from Gold, Platinum, or Diamond packages.`,
  openGraph: {
    title: `Book a Numerology Consultation | ${THEME.site.name}`,
    description: `Personal numerology readings by ${THEME.site.numerologistName}. Gain clarity on love, career, health and life purpose.`,
    images: [{ url: '/og-consultation.jpg', width: 1200, height: 630 }],
  },
}

export default function ConsultationPage() {
  return <ConsultationPageClient />
}
