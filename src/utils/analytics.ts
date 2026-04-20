// ============================================================
// ANALYTICS UTILITIES
// Stub file — replace with your analytics provider
// (Google Analytics 4, PostHog, Mixpanel, Plausible, etc.)
// ============================================================

export type EventName =
  | 'calculator_submit'
  | 'package_selected'
  | 'booking_started'
  | 'booking_completed'
  | 'payment_initiated'
  | 'payment_success'
  | 'enquiry_submitted'
  | 'receipt_downloaded'
  | 'faq_opened'

interface TrackEventOptions {
  event: EventName
  properties?: Record<string, string | number | boolean | undefined>
}

/**
 * Track a custom event
 * Replace the console.log with your analytics provider's track call
 */
export function trackEvent({ event, properties }: TrackEventOptions): void {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[Analytics] ${event}`, properties)
    return
  }

  // Example: Google Analytics 4
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', event, properties)
  // }

  // Example: PostHog
  // if (typeof window !== 'undefined' && (window as any).posthog) {
  //   (window as any).posthog.capture(event, properties)
  // }

  // Example: Plausible
  // if (typeof window !== 'undefined' && (window as any).plausible) {
  //   (window as any).plausible(event, { props: properties })
  // }
}

/**
 * Track page view (call in layout or route change)
 */
export function trackPageView(path: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[Analytics] pageview: ${path}`)
    return
  }
}
