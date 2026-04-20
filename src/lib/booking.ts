import { z } from 'zod'
import { isValidDobDmy } from '@/utils/date'

export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email required'),
  phone: z.string().trim().min(10, 'Phone number required'),
  dob: z
    .string()
    .trim()
    .optional()
    .refine(value => !value || isValidDobDmy(value), 'Please enter date in dd/mm/yyyy format'),
  packageId: z.string().trim().min(1, 'Select a package'),
  notes: z.string().trim().optional(),
})

export type BookingInput = z.infer<typeof bookingSchema>
