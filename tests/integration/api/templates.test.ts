/** @jest-environment node */

jest.mock('@/lib/server-utils', () => ({
  checkMaintenanceMode: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    template: { findMany: jest.fn(), count: jest.fn(), create: jest.fn() },
  },
}))

describe('/api/templates', () => {
  beforeEach(() => {
    jest.resetModules()
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.template.findMany.mockReset()
    prisma.template.count.mockReset()
    prisma.template.create.mockReset()
    const { checkMaintenanceMode } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockReset()
  })

  it('gET returns templates with pagination', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    const { checkMaintenanceMode } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockResolvedValueOnce(false)

    prisma.template.findMany.mockResolvedValueOnce([{ id: 't1', title: 'A' }])
    prisma.template.count.mockResolvedValueOnce(5)

    const { GET } = await import('@/app/api/templates/route')
    const req = new Request('http://localhost/api/templates?search=a&limit=2&offset=2', { method: 'GET' })
    const res = await GET(req as any)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.templates).toHaveLength(1)
    expect(data.pagination).toEqual({ total: 5, limit: 2, offset: 2, hasMore: true })
  })

  it('gET returns 503 in maintenance', async () => {
    const { checkMaintenanceMode } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockResolvedValueOnce(true)

    const { GET } = await import('@/app/api/templates/route')
    const req = new Request('http://localhost/api/templates', { method: 'GET' })
    const res = await GET(req as any)

    expect(res.status).toBe(503)
  })

  it('pOST creates a template', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.template.create.mockResolvedValueOnce({ id: 't1', title: 'A' })

    const { POST } = await import('@/app/api/templates/route')
    const req = new Request('http://localhost/api/templates', {
      method: 'POST',
      body: JSON.stringify({ title: 'A', description: 'd', category: 'c' }),
    })

    const res = await POST(req as any)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toBe('t1')
  })
})
