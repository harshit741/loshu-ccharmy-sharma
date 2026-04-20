export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { loshuCalculatorSchema } from '@/lib/loshuCalculator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    const { fullName, dob, mobileNumber } = parsedBody.data

    const { error } = await supabase
      .from('LoshuCalculator')
      .insert({
        full_name: fullName,
        dob,
        mobile_number: mobileNumber,
      })

    if (error) {
      console.error('LoshuCalculator insert error:', error)
      return Response.json({ error: 'Database error' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('LoshuCalculator save error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
