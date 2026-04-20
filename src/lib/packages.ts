export interface Package {
  id: string
  tier: 'GOLD' | 'PLATINUM' | 'DIAMOND'
  name: string
  tagline: string
  price: number
  originalPrice?: number
  currency: string
  features: string[]
  deliveryTime: string
  highlighted?: boolean
  razorpayLink?: string
}

export const PACKAGES: Package[] = [
  {
    id: 'gold',
    tier: 'GOLD',
    name: 'Gold Reading',
    tagline: 'Your foundational cosmic blueprint',
    price: 1499,
    currency: 'INR',
    deliveryTime: '3–5 business days',
    features: [
      'Loshu Grid Analysis',
      'Details of Personality and Destiny (Mulank & Bhagyank)',
      'Details on Planes and Missing Planes',
      'Lucky Colors and Numbers',
      'Vedic Remedies',
      'Report shared over email'
    ],
    razorpayLink: process.env.NEXT_PUBLIC_RAZORPAY_LINK_GOLD || '#',
  },
  {
    id: 'platinum',
    tier: 'PLATINUM',
    name: 'Platinum Reading',
    tagline: 'Deep dive into your life purpose',
    price: 2999,
    originalPrice: 3999,
    currency: 'INR',
    deliveryTime: '5–7 business days',
    highlighted: true,
    features: [
      'Loshu Grid Analysis',
      'Details of Personality and Destiny (Mulank & Bhagyank)',
      'Details on Planes and Missing Planes',
      'Relationship Compatibility',
      'Health Guidance',
      'Career Options',
      'Lucky Colors and Numbers',
      'Vedic Remedies',
      'Report shared over email',
      '30 min Voice Call'
    ],
    razorpayLink: process.env.NEXT_PUBLIC_RAZORPAY_LINK_PLATINUM || '#',
  },
  {
    id: 'diamond',
    tier: 'DIAMOND',
    name: 'Diamond Reading',
    tagline: 'Complete transformation blueprint',
    price: 5999,
    currency: 'INR',
    deliveryTime: '7–10 business days',
    features: [
      'Loshu Grid Analysis',
      'Details of Personality and Destiny (Mulank & Bhagyank)',
      'Details on Planes and Missing Planes',
      'Relationship Compatibility',
      'Health Guidance',
      'Career Options',
      'Astro-Numero Grid Analysis',
      'Personal Year reading (for 3 years)',
      'Name Correction',
      'Lucky Colors and Numbers',
      'Vedic Remedies',
      'Report shared over email',
      '60 min Video Call'
    ],
    razorpayLink: process.env.NEXT_PUBLIC_RAZORPAY_LINK_DIAMOND || '#',
  },
]

export function getPackageById(id: string): Package | undefined {
  return PACKAGES.find(p => p.id === id)
}
