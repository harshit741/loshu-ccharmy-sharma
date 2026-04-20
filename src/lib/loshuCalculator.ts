import { z } from 'zod'
import { isValidDobDmy } from '@/utils/date'

export const loshuCalculatorSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  dob: z
    .string()
    .trim()
    .refine(isValidDobDmy, 'Date of birth must be a valid date in dd/mm/yyyy format'),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Mobile number must be 10 digits starting with 6, 7, 8, or 9'),
})

export type LoshuCalculatorInput = z.infer<typeof loshuCalculatorSchema>
