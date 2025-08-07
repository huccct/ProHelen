/** @jest-environment node */

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/server-utils', () => ({
  checkMaintenanceMode: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    instruction: { findMany: jest.fn(), count: jest.fn(), create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
  },
}))

describe('/api/instructions', () => {
  beforeEach(() => {
    jest.resetModules()
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.instruction.findMany.mockReset()
    prisma.instruction.count.mockReset()
    prisma.instruction.create.mockReset()
    prisma.instruction.findFirst.mockReset()
    prisma.instruction.update.mockReset()
    const { getServerSession } = jest.requireMock('next-auth') as any
    getServerSession.mockReset()
    const { checkMaintenanceMode } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockReset()
  })

  it('gET returns 401 when unauthenticated', async () => {
    const { getServerSession } = jest.requireMock('next-auth') as any
    getServerSession.mockResolvedValueOnce(null)

    const { GET } = await import('@/app/api/instructions/route')
    const req = new Request('http://localhost/api/instructions', { method: 'GET' })
    const res = await GET(req as any)
    expect(res.status).toBe(401)
  })

  it('gET returns user instructions with pagination', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    const { getServerSession } = jest.requireMock('next-auth') as any
    const { checkMaintenanceMode } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockResolvedValueOnce(false)
    getServerSession.mockResolvedValueOnce({ user: { id: 'u1' } })

    prisma.instruction.findMany.mockResolvedValueOnce([{ id: 'i1', title: 'T' }])
    prisma.instruction.count.mockResolvedValueOnce(1)

    const { GET } = await import('@/app/api/instructions/route')
    const req = new Request('http://localhost/api/instructions?limit=10&offset=0', { method: 'GET' })
    const res = await GET(req as any)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.instructions).toHaveLength(1)
    expect(data.pagination).toEqual({ total: 1, limit: 10, offset: 0, hasMore: false })
  })

  it('pOST rejects missing title/content when not draft', async () => {
    const { getServerSession } = jest.requireMock('next-auth') as any
    getServerSession.mockResolvedValueOnce({ user: { id: 'u1' } })

    const { POST } = await import('@/app/api/instructions/route')
    const req = new Request('http://localhost/api/instructions', {
      method: 'POST',
      body: JSON.stringify({ isDraft: false, title: '', content: '' }),
    })

    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('pOST creates new draft when none exists', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    const { getServerSession } = jest.requireMock('next-auth') as any
    getServerSession.mockResolvedValueOnce({ user: { id: 'u1' } })
    prisma.instruction.findFirst.mockResolvedValueOnce(null)
    prisma.instruction.create.mockResolvedValueOnce({ id: 'i2', isDraft: true })

    const { POST } = await import('@/app/api/instructions/route')
    const req = new Request('http://localhost/api/instructions', {
      method: 'POST',
      body: JSON.stringify({ isDraft: true, title: 'A', content: 'C' }),
    })

    const res = await POST(req as any)
    expect(res.status).toBe(201)
  })
})
