import { z } from 'zod'
import { isValidDobDmy } from '@/utils/date'

// ============================================================
// SHARED ZOD VALIDATION SCHEMAS
// ============================================================

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be under 100 characters')
  .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, and common punctuation')

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(254, 'Email is too long')

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number is too long')
  .regex(/^[+\d\s\-()]+$/, 'Please enter a valid phone number')

export const dobSchema = z
  .string()
  .trim()
  .min(1, 'Date of birth is required')
  .refine(isValidDobDmy, 'Please enter a valid date in dd/mm/yyyy format')

// ── Form schemas ──────────────────────────────────────────────

export const numerologyFormSchema = z.object({
  fullName: nameSchema,
  dob:      dobSchema,
  email:    emailSchema.optional().or(z.literal('')),
})

export const bookingFormSchema = z.object({
  name:      nameSchema,
  email:     emailSchema,
  phone:     phoneSchema,
  dob:       dobSchema.optional().or(z.literal('')),
  packageId: z.string().min(1, 'Please select a package'),
  notes:     z.string().max(500, 'Notes must be under 500 characters').optional(),
})

export const contactFormSchema = z.object({
  name:    nameSchema,
  email:   emailSchema,
  phone:   phoneSchema.optional().or(z.literal('')),
  subject: z.string().min(2, 'Subject is required').max(200),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters'),
})

export type NumerologyFormData = z.infer<typeof numerologyFormSchema>
export type BookingFormData    = z.infer<typeof bookingFormSchema>
export type ContactFormData    = z.infer<typeof contactFormSchema>
