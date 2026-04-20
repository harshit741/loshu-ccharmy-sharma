export const runtime = 'nodejs'

import { calculateNumerology } from '@/utils/numerology'
import { loshuCalculatorSchema } from '@/lib/loshuCalculator'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedBody = loshuCalculatorSchema.safeParse(body)

    if (!parsedBody.success) {
      return Response.json(
        { error: parsedBody.error.issues[0]?.message || 'Invalid request data' },
        { status: 400 }
      )
    }

    const { fullName, dob } = parsedBody.data
    const result = calculateNumerology(fullName, dob)

    return Response.json({ success: true, result })
  } catch (error) {
    console.error('LoshuCalculator calculation error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
