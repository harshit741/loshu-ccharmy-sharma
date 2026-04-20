// ============================================================
// GLOBAL TYPE DEFINITIONS
// ============================================================

export interface NumerologyFormInput {
  fullName: string
  dob: string
  email?: string
}

export interface BookingFormInput {
  name: string
  email: string
  phone: string
  dob?: string
  packageId: string
  notes?: string
}

export interface ContactFormInput {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export type PackageTier = 'GOLD' | 'PLATINUM' | 'DIAMOND'

export type OrderStatus = 'created' | 'authorized' | 'paid' | 'failed' | 'refunded'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ToastOptions {
  message: string
  type: 'success' | 'error' | 'info'
}

export interface SectionProps {
  className?: string
  id?: string
}

export interface SEOMeta {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}
