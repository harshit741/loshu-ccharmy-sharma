import { z } from 'zod'

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Name required'),
  email: z.string().trim().email('Valid email required'),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(2, 'Subject required'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
})

export type EnquiryInput = z.infer<typeof enquirySchema>
