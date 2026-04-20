export const runtime = 'nodejs'

import { assertAdminApiAuthorized, getListParams } from '@/lib/adminApi'
import { listAdminOrders } from '@/lib/supabase-admin'

export async function GET(req: Request) {
  const unauthorizedResponse = assertAdminApiAuthorized(req)
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  try {
    const { page, limit, from, to } = getListParams(req)
    const { items, total } = await listAdminOrders(from, to)

    return Response.json({
      success: true,
      page,
      limit,
      total,
      items,
    })
  } catch (error) {
    console.error('List orders error:', error)
    return Response.json({ error: 'Unable to load orders' }, { status: 500 })
  }
}
