export const runtime = 'nodejs'

import { enquirySchema } from '@/lib/enquiry'

// ============================
// API Route
// ============================
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Honeypot spam field (optional)
    if (body.website) {
      return Response.json({ success: true }) // silently ignore bots
    }

    const parsedBody = enquirySchema.safeParse(body)
    if (!parsedBody.success) {
      return Response.json(
        { error: parsedBody.error.issues[0]?.message || 'Invalid request data' },
        { status: 400 }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Server Error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
