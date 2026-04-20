export const runtime = 'nodejs'

import { assertAdminApiAuthorized, getListParams } from '@/lib/adminApi'
import { listAdminLoshuCalculatorLeads } from '@/lib/supabase-admin'

export async function GET(req: Request) {
  const unauthorizedResponse = assertAdminApiAuthorized(req)
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const { page, limit, from, to } = getListParams(req)
    const { items, total } = await listAdminLoshuCalculatorLeads(from, to)

    return Response.json({
      success: true,
      page,
      limit,
      total,
      items,
    })
  } catch (error) {
    console.error('List LoshuCalculator leads error:', error)
    return Response.json({ error: 'Unable to load LoshuCalculator records' }, { status: 500 })
  }
}
