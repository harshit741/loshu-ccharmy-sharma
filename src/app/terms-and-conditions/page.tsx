import Link from 'next/link'
import type { Metadata } from 'next'
import { THEME } from '@/lib/theme'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: `Terms and Conditions for ${THEME.site.name} services.`,
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the services provided by ${THEME.site.name} ("we", "us", "our"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`,
  },
  {
    title: '2. Nature of Services',
    content: 'Ccharmy Shah provides numerology readings and consultations for entertainment, self-exploration, and personal development purposes. Numerology is a metaphysical practice. Our readings are not a substitute for professional medical, psychological, legal, or financial advice. We make no guarantees regarding the accuracy or applicability of any reading to any individual\'s specific circumstances.',
  },
  {
    title: '3. Booking and Payment',
    content: 'All bookings must be completed through our online booking form and payment processed via Razorpay. Prices are displayed in Indian Rupees and include applicable taxes. Payment must be received in full before any reading commences. By completing payment, you confirm your acceptance of these terms.',
  },
  {
    title: '4. Refund Policy',
    content: 'Cancellations made within 24 hours of payment and before the reading has commenced are eligible for a full refund. Once a reading has begun, no refunds will be issued. Refund requests must be submitted to shahccharmy@gmail.com. Refunds are processed within 7-10 business days to the original payment method.',
  },
  {
    title: '5. Delivery of Services',
    content: 'Readings will be delivered within the timeframes specified for each package (Gold: 3-5 days; Platinum: 5-7 days; Diamond: 7-10 days). These are estimated timeframes and may vary during high-demand periods. We will notify you of any significant delays via email.',
  },
  {
    title: '6. Intellectual Property',
    content: 'All content, readings, reports, and materials provided by CcharmyShah are the intellectual property of Ccharmy Shah / CcharmyShah. You may not reproduce, distribute, or share your reading report publicly without explicit written consent. Personal use for your own reference is permitted.',
  },
  {
    title: '7. Limitation of Liability',
    content: 'To the maximum extent permitted by applicable law, Ccharmy Shah shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service giving rise to the claim.',
  },
  {
    title: '8. User Conduct',
    content: 'You agree not to use our services for any unlawful purpose, to provide false or misleading information, to interfere with the operation of our website, or to engage in any conduct that is harmful, offensive, or disruptive. We reserve the right to refuse service to anyone for any reason.',
  },
  {
    title: '9. Governing Law',
    content: 'These Terms are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.',
  },
  {
    title: '10. Changes to Terms',
    content: 'We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of our services constitutes acceptance of the modified Terms.',
  },
  {
    title: '11. Contact',
    content: `For any questions about these Terms, please contact us at: ${THEME.site.email} or ${THEME.site.phone}.`,
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 sm:py-20 lg:py-24" style={{ background: 'var(--color-bg)' }}>
      <div className="max-container max-w-3xl">
        <div className="mb-10 sm:mb-12">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-rose)' }}
            aria-label="Back to home"
          >
            &larr; Back to Home
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-light sm:text-4xl lg:text-5xl" style={{ color: 'var(--color-ink)' }}>
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--color-muted)' }}>
            Effective date: January 1, 2024 · Last updated: January 1, 2024
          </p>
          <p className="mt-4 text-base leading-7" style={{ color: 'var(--color-muted)' }}>
            Please read these Terms and Conditions carefully before using {THEME.site.name}&apos;s
            website and services. These terms constitute a legally binding agreement between you
            and {THEME.site.name}.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {SECTIONS.map(section => (
            <section
              key={section.title}
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <h2 className="mb-3 font-heading text-xl font-semibold sm:text-2xl" style={{ color: 'var(--color-ink)' }}>
                {section.title}
              </h2>
              <p className="text-sm leading-7 sm:text-base" style={{ color: 'var(--color-muted)' }}>
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
