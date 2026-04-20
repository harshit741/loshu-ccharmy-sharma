// ============================================================
// APPLICATION CONSTANTS
// ============================================================

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://CcharmyShah.com'

export const ROUTES = {
  home:         '/',
  consultation: '/consultation',
  success:      '/success',
  privacy:      '/privacy-policy',
  terms:        '/terms-and-conditions',
} as const

export const ANCHOR_IDS = {
  hero:         'hero',
  loshu:        'loshu',
  analysis:     'analysis',
  services:     'services',
  about:        'about',
  testimonials: 'testimonials',
  faq:          'faq',
  contact:      'contact',
  footer:       'footer',
} as const

// Success page query params from Razorpay webhook/redirect
export const RAZORPAY_PARAMS = {
  orderId:   'order_id',
  paymentId: 'razorpay_payment_id',
  rzpOrderId:'razorpay_order_id',
  signature: 'razorpay_signature',
} as const

// DB table names
export const DB_TABLES = {
  orders:    'orders',
  enquiries: 'enquiries',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  theme:          'theme',
  numerologyResult:'numerology_result',
  lastPackage:    'last_selected_package',
} as const

// Animation durations (ms)
export const ANIMATION = {
  fast:   150,
  normal: 300,
  slow:   500,
  spring: { stiffness: 300, damping: 25 },
} as const

// Viewport breakpoints (px) - mirrors Tailwind defaults
export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const

// Number meanings for extended display
export const NUMBER_KEYWORDS: Record<number, string[]> = {
  1:  ['Leadership', 'Independence', 'Ambition'],
  2:  ['Cooperation', 'Sensitivity', 'Balance'],
  3:  ['Creativity', 'Joy', 'Expression'],
  4:  ['Stability', 'Discipline', 'Foundation'],
  5:  ['Freedom', 'Adventure', 'Versatility'],
  6:  ['Nurturing', 'Responsibility', 'Harmony'],
  7:  ['Wisdom', 'Spirituality', 'Analysis'],
  8:  ['Power', 'Abundance', 'Mastery'],
  9:  ['Compassion', 'Completion', 'Universality'],
  11: ['Intuition', 'Enlightenment', 'Vision'],
  22: ['Mastery', 'Global Impact', 'Manifestation'],
  33: ['Service', 'Divine Love', 'Teaching'],
}

// Colors for number visualization
export const NUMBER_COLORS: Record<number, string> = {
  1: '#D6A99D', // rose
  2: '#9CAFAA', // teal
  3: '#E8C28A', // amber
  4: '#A8C4A2', // green
  5: '#C4A8D4', // lavender
  6: '#F0B8B8', // soft pink
  7: '#8AB4C4', // blue
  8: '#D4C4A8', // warm gold
  9: '#B8A8D4', // purple
}
