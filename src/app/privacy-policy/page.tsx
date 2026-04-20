import Link from 'next/link'
import type { Metadata } from 'next'
import { THEME } from '@/lib/theme'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${THEME.site.name} - How we collect, use, and protect your personal information.`,
}

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: 'We collect personal information you provide directly to us, including your full name, date of birth, email address, phone number, and any notes or queries you share during a booking or enquiry. We also collect payment information (processed securely by Razorpay) and standard usage data such as IP address, browser type, and pages visited.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'Your information is used solely to deliver your numerology reading, process payments, communicate updates about your order, respond to enquiries, and improve our services. We do not use your data for automated decision-making or profiling beyond the scope of your reading.',
  },
  {
    title: '3. Data Sharing',
    content: 'We do not sell, rent, or share your personal data with third parties for marketing purposes. We share your data only with service providers necessary to operate our platform (Supabase for database, Razorpay for payments) and only to the extent required to provide our services. These providers are bound by their own privacy and security policies.',
  },
  {
    title: '4. Data Security',
    content: 'We take reasonable technical and organizational measures to protect your personal data from unauthorized access, disclosure, or loss. Payment data is handled exclusively by Razorpay, a PCI-DSS compliant payment processor. We store data on Supabase infrastructure with row-level security enabled.',
  },
  {
    title: '5. Data Retention',
    content: 'We retain your personal data for as long as necessary to fulfill the purposes described in this policy, or as required by law. Order records are retained for a minimum of 7 years for accounting compliance. You may request deletion of your data by contacting us at the email below.',
  },
  {
    title: '6. Your Rights',
    content: 'You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, object to processing, and withdraw consent where processing is based on consent. To exercise these rights, please contact us at shahccharmy@gmail.com.',
  },
  {
    title: '7. Cookies',
    content: 'We use essential cookies necessary for the functioning of our website (for example, session management and theme preferences). We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect certain site features.',
  },
  {
    title: '8. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our services after changes constitutes acceptance of the updated policy.',
  },
  {
    title: '9. Contact Us',
    content: `For any privacy-related questions or to exercise your rights, please contact us at: ${THEME.site.email} or call ${THEME.site.phone}.`,
  },
]

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--color-muted)' }}>
            Effective date: January 1, 2024 · Last updated: January 1, 2024
          </p>
          <p className="mt-4 text-base leading-7" style={{ color: 'var(--color-muted)' }}>
            {THEME.site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal
            information and your right to privacy. This policy explains how we collect, use,
            and safeguard your information when you use our website and services.
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
