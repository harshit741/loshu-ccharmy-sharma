const DEFAULT_LIMIT = 50
const MAX_LIMIT = 200

function getHeaderApiKey(req: Request) {
  const directHeader = req.headers.get('x-admin-api-key')?.trim()
  if (directHeader) return directHeader

  const authorization = req.headers.get('authorization')?.trim()
  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    return null
  }

  return authorization.slice(7).trim() || null
}

export function assertAdminApiAuthorized(req: Request) {
  const configuredKey = process.env.ADMIN_API_KEY?.trim()

  if (!configuredKey) {
    return Response.json(
      { error: 'ADMIN_API_KEY is not configured on the server' },
      { status: 500 }
    )
  }

  const providedKey = getHeaderApiKey(req)

  if (!providedKey || providedKey !== configuredKey) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

export function getListParams(req: Request) {
  const { searchParams } = new URL(req.url)
  const limitValue = Number(searchParams.get('limit') ?? DEFAULT_LIMIT)
  const pageValue = Number(searchParams.get('page') ?? 1)

  const limit = Number.isFinite(limitValue)
    ? Math.min(Math.max(Math.trunc(limitValue), 1), MAX_LIMIT)
    : DEFAULT_LIMIT

  const page = Number.isFinite(pageValue)
    ? Math.max(Math.trunc(pageValue), 1)
    : 1

  const from = (page - 1) * limit
  const to = from + limit - 1

  return { page, limit, from, to }
}
