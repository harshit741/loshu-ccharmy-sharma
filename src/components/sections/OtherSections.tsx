'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star, MessageCircle, Mail, Instagram, Youtube, Facebook, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import profileImage from '@/assets/images/Ccharmy-optimized.jpg'
import { THEME } from '@/lib/theme'
import toast from 'react-hot-toast'
import { enquirySchema, type EnquiryInput } from '@/lib/enquiry'
import { cn } from '@/utils/cn'

const TESTIMONIALS = [
  {
    name: 'Anjali Mehta',
    city: 'Mumbai',
    rating: 5,
    text: 'The reading completely changed how I approached my career. Ccharmy identified patterns I had never noticed and gave me the confidence to make the leap I had been avoiding for years.',
    service: 'Platinum Reading',
  },
  {
    name: 'Rahul Kapoor',
    city: 'Bengaluru',
    rating: 5,
    text: 'My business was struggling until I got a name correction and business numerology reading. Within three months, the shifts were visible. Absolutely remarkable work.',
    service: 'Diamond Reading',
  },
  {
    name: 'Nisha Iyer',
    city: 'Chennai',
    rating: 5,
    text: 'I was skeptical at first but the Lo Shu analysis was eerily accurate. It validated so much of what I had felt intuitively. The 30-minute consultation was incredibly personal and warm.',
    service: 'Platinum Reading',
  },
  {
    name: 'Arjun Shah',
    city: 'Delhi',
    rating: 5,
    text: 'The Lo Shu reading was an excellent starting point. Clear, actionable, and deeply insightful. I will definitely be booking a deeper package next time.',
    service: 'Gold Reading',
  },
  {
    name: 'Pooja Gupta',
    city: 'Pune',
    rating: 5,
    text: 'Ccharmy has a rare gift for making complex ideas simple. My annual forecast has been accurate so far. Highly recommend to anyone seeking genuine clarity.',
    service: 'Diamond Reading',
  },
  {
    name: 'Kiran Rao',
    city: 'Hyderabad',
    rating: 5,
    text: 'Got a relationship compatibility reading alongside the basic analysis. It helped me understand my partner on a completely new level. Ccharmy is professional, kind, and accurate.',
    service: 'Platinum Reading',
  },
]

const FAQS = [
  {
    q: 'How accurate is numerology?',
    a: 'Numerology is a metaphysical science with roots in ancient civilizations. While it is not a predictive tool in the literal sense, it offers remarkably accurate personality profiles and life tendency maps that resonate deeply with most clients. Over 3+ years, Ccharmy has observed a very high correlation between numerological patterns and lived experience.',
  },
  {
    q: 'How long does it take to receive my reading?',
    a: 'Gold readings are delivered within 3-5 business days. Platinum readings take 5-7 days. Diamond readings, which include a 12-month forecast and business analysis, take 7-10 business days. You will receive an email update with your PDF report and a link to schedule your consultation call.',
  },
  {
    q: 'What is the booking process?',
    a: 'Simply select your package on this page, fill in your details, and proceed to the Razorpay payment gateway. Once payment is confirmed, you will receive a booking confirmation email. Ccharmy will then begin working on your personalized report.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Payments are processed via Razorpay, which accepts all major credit and debit cards, UPI, net banking, and EMI options. All transactions are fully secure and encrypted.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Absolutely. Your name, date of birth, and contact details are used solely for the purpose of your numerology reading and are never shared with third parties. Please review our Privacy Policy for full details.',
  },
]

type ContactFormData = EnquiryInput

const fieldClassName =
  'min-h-[44px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-rose)] sm:text-sm'

const contactFields: Array<{
  id: string
  label: string
  type: string
  key: keyof ContactFormData
  placeholder: string
}> = [
  { id: 'contact-name', label: 'Your Name *', type: 'text', key: 'name', placeholder: 'Full name' },
  { id: 'contact-email', label: 'Email *', type: 'email', key: 'email', placeholder: 'you@example.com' },
  { id: 'contact-phone', label: 'Phone', type: 'tel', key: 'phone', placeholder: '+91 98765 43210' },
  { id: 'contact-subj', label: 'Subject *', type: 'text', key: 'subject', placeholder: 'What can we help with?' },
]

export function AboutSection() {
  return (
    <section id="about" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24" aria-labelledby="about-heading">
      <div className="max-container">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mx-auto w-full max-w-md lg:max-w-none"
          >
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] group"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <Image
                src={profileImage}
                alt="Ccharmy Shah - Certified Numerologist"
                fill
                sizes="(min-width: 1024px) 32rem, (min-width: 640px) 28rem, calc(100vw - 2rem)"
                placeholder="blur"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent 40%)',
                }}
              />

              <div className="absolute bottom-4 left-4 text-white sm:bottom-6 sm:left-6">
                <p className="font-heading text-2xl sm:text-3xl">Ccharmy Shah</p>
                <p className="text-sm opacity-80">Certified Numerologist and Vastu Consultant</p>
              </div>
            </div>

            {/* <div
              className="relative z-10 ml-auto mt-4 w-fit rounded-2xl p-4 shadow-xl lg:-mt-24 lg:mr-8"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="font-heading text-2xl font-bold" style={{ color: 'var(--color-rose)' }}>
              3+
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Years of Practice
              </div>
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--color-teal)' }}>
              About the Numerologist
            </span>
            <h2
              id="about-heading"
              className="mt-2 font-heading text-3xl font-light sm:text-5xl"
              style={{ color: 'var(--color-ink)' }}
            >
              Ccharmy{' '}
              <span className="italic font-semibold" style={{ color: 'var(--color-rose)' }}>
                Shah
              </span>
            </h2>

            <div className="mt-6 space-y-4 text-base leading-7" style={{ color: 'var(--color-muted)' }}>
              <p>
                With more than three years of focused experience, Ccharmy has guided over 500 individuals in India and around the world, helping them uncover the hidden patterns in their birth dates and names through the ancient practice of numerology.
              </p>
              <p>
                A certified numerologist and vastu consultant, she is trained in both Vedic and Chaldean numerology traditions. By combining these with practical, real-life insights, she creates meaningful and lasting transformations.
                Using a deeply intuitive approach, she empowers individuals to overcome challenges, align with the right energies, and attract opportunities that support a balanced and harmonious life.
              </p>
            </div>

            <div
              className="mt-8 rounded-2xl p-5 sm:p-6"
              style={{
                background: 'color-mix(in srgb, var(--color-rose) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-rose) 24%, transparent)',
              }}
            >
              <h3 className="font-heading text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                Philosophy
              </h3>
              <p className="mt-3 text-sm italic leading-7 sm:text-base" style={{ color: 'var(--color-muted)' }}>
                &ldquo;Numerology is more than predicting the future or choosing the ideal partner. 
                It’s the bridge between who you are now and who you have the potential to become.&rdquo;
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {['Vedic Numerology', 'Lo Shu Expert', 'Chaldean Numerology', 'Name Correction'].map(credential => (
                <span
                  key={credential}
                  className="rounded-full px-3 py-2 text-xs font-medium"
                  style={{ background: 'var(--color-sage-light)', color: 'var(--color-muted)' }}
                >
                  {credential}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24" aria-labelledby="testimonials-heading">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--color-rose) 10%, transparent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="max-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-14"
        >
          <span className="text-sm font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--color-rose)' }}>
            Social Proof
          </span>
          <h2
            id="testimonials-heading"
            className="mt-2 font-heading text-3xl font-light sm:text-5xl lg:text-6xl"
            style={{ color: 'var(--color-ink)' }}
          >
            What Clients{' '}
            <span className="italic font-semibold" style={{ color: 'var(--color-rose)' }}>
              Say
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl p-5 card-hover sm:p-6"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              aria-label={`Testimonial from ${testimonial.name}`}
            >
              <div className="mb-4 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                  <Star key={starIndex} size={14} fill="var(--color-rose)" color="var(--color-rose)" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mb-5 text-sm leading-7" style={{ color: 'var(--color-muted)' }}>
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                    {testimonial.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {testimonial.city}
                  </div>
                </div>
                <span
                  className="w-fit rounded-full px-3 py-1 text-xs"
                  style={{ background: 'color-mix(in srgb, var(--color-rose) 12%, transparent)', color: 'var(--color-rose)' }}
                >
                  {testimonial.service}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24" aria-labelledby="faq-heading">
      <div className="max-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-14"
        >
          <span className="text-sm font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--color-teal)' }}>
            Common Questions
          </span>
          <h2
            id="faq-heading"
            className="mt-2 font-heading text-3xl font-light sm:text-5xl lg:text-6xl"
            style={{ color: 'var(--color-ink)' }}
          >
            Frequently{' '}
            <span className="italic font-semibold" style={{ color: 'var(--color-rose)' }}>
              Asked
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="overflow-hidden rounded-2xl"
              style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
            >
              <button
                className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
                onClick={() => setOpenIdx(openIdx === index ? null : index)}
                aria-expanded={openIdx === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="text-sm font-medium leading-6 sm:text-base" style={{ color: 'var(--color-ink)' }}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className="shrink-0 transition-transform duration-300"
                  style={{
                    color: 'var(--color-muted)',
                    transform: openIdx === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence>
                {openIdx === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-5 text-sm leading-7 sm:px-5" style={{ color: 'var(--color-muted)' }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(enquirySchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to submit enquiry. Please try again.')
      }

      reset()
      toast.success('Your enquiry has been received! We will respond within 24 hours.')

      void fetch('/api/enquiry/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      })
        .then(response => {
          if (!response.ok) {
            console.error('enquiry/process failed:', response.status, response.statusText)
          } else {
            console.log('enquiry/process completed successfully')
          }
        })
        .catch(error => {
          console.error('Failed to process enquiry in background:', error)
        })
    } catch {
      toast.error('Failed to send enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24" aria-labelledby="contact-heading">
      <div className="max-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-14"
        >
          <span className="text-sm font-medium uppercase tracking-[0.28em]" style={{ color: 'var(--color-rose)' }}>
            Get in Touch
          </span>
          <h2
            id="contact-heading"
            className="mt-2 font-heading text-3xl font-light sm:text-5xl lg:text-6xl"
            style={{ color: 'var(--color-ink)' }}
          >
            Contact and{' '}
            <span className="italic font-semibold" style={{ color: 'var(--color-rose)' }}>
              Support
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h3 className="mb-4 font-heading text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                Reach Out Directly
              </h3>
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${THEME.site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[56px] items-center gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  aria-label="Chat on WhatsApp"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: '#25D366', color: 'white' }}
                    aria-hidden="true"
                  >
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>WhatsApp</div>
                    <div className="break-words text-xs" style={{ color: 'var(--color-muted)' }}>{THEME.site.phone}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${THEME.site.email}`}
                  className="flex min-h-[56px] items-center gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  aria-label={`Email ${THEME.site.email}`}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'var(--color-rose)', color: 'white' }}
                    aria-hidden="true"
                  >
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Email</div>
                    <div className="break-words text-xs" style={{ color: 'var(--color-muted)' }}>{THEME.site.email}</div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                Follow Along
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { Icon: Instagram, href: THEME.site.instagram, label: 'Instagram', color: '#E1306C' },
                  { Icon: Youtube, href: THEME.site.youtube, label: 'YouTube', color: '#FF0000' },
                ].map(({ Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color }}
                    aria-label={label}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4 rounded-3xl p-5 sm:p-6 lg:p-8"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              aria-label="Contact enquiry form"
            >
              <h3 className="mb-4 font-heading text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
                Send an Enquiry
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {contactFields.map(field => (
                  <div key={field.key}>
                    <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className={cn(fieldClassName, errors[field.key] && 'border-red-400')}
                      {...register(field.key)}
                      aria-invalid={!!errors[field.key]}
                    />
                    {errors[field.key] && (
                      <p className="mt-1 text-xs text-red-500" role="alert">
                        {errors[field.key]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us about your query..."
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-rose)] sm:text-sm"
                  {...register('message')}
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500" role="alert">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-teal)] px-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                    Sending message...
                  </>
                ) : (
                  'Send Enquiry'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
