/** @jest-environment node */

jest.mock('@/lib/server-utils', () => ({
  checkMaintenanceMode: jest.fn().mockResolvedValue(false),
}))

// The route uses a direct PrismaClient import; so mock @prisma/client
jest.mock('@prisma/client', () => {
  const mockFindMany = jest.fn()
  const mockCount = jest.fn()
  const mockFindUnique = jest.fn()
  const mockUpdate = jest.fn()
  const mockDelete = jest.fn()
  const mockCreate = jest.fn()
  const PrismaClient = jest.fn().mockImplementation(() => ({
    template: {
      findMany: mockFindMany,
      count: mockCount,
      findUnique: mockFindUnique,
      update: mockUpdate,
      delete: mockDelete,
      create: mockCreate,
    },
  }))
  return { PrismaClient, __esModule: true, mockFindMany, mockCount, mockFindUnique, mockUpdate, mockDelete, mockCreate }
})

describe('e2e: templates list/detail CRUD', () => {
  beforeEach(() => {
    const prismaMock = jest.requireMock('@prisma/client') as any
    prismaMock.mockFindMany.mockReset()
    prismaMock.mockCount.mockReset()
    prismaMock.mockFindUnique.mockReset()
    prismaMock.mockUpdate.mockReset()
    prismaMock.mockDelete.mockReset()
    prismaMock.mockCreate.mockReset()
  })

  it('lists templates and paginates', async () => {
    const prismaMock = jest.requireMock('@prisma/client') as any
    prismaMock.mockFindMany.mockResolvedValueOnce([{ id: 't1', title: 'A' }])
    prismaMock.mockCount.mockResolvedValueOnce(3)

    const { GET } = await import('@/app/api/templates/route')
    const req = new Request('http://localhost/api/templates?limit=1&offset=0', { method: 'GET' })
    const res = await GET(req as any)
    expect(res.status).toBe(200)
    const data = await (res as any).json()
    expect(data.templates).toHaveLength(1)
    expect(data.pagination).toEqual({ total: 3, limit: 1, offset: 0, hasMore: true })
  })

  it('reads/updates/deletes a template by id', async () => {
    const prismaMock = jest.requireMock('@prisma/client') as any
    prismaMock.mockFindUnique.mockResolvedValueOnce({ id: 't1', title: 'A', examples: [], reviews: [], _count: { reviews: 0, favorites: 0 } })

    const { GET, PATCH, DELETE } = await import('@/app/api/templates/[id]/route')

    // GET by id
    const getRes = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(getRes.status).toBe(200)

    // PATCH
    prismaMock.mockUpdate.mockResolvedValueOnce({ id: 't1', title: 'B', examples: [] })
    const patchRes = await PATCH(new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ title: 'B' }) }), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(patchRes.status).toBe(200)

    // DELETE
    prismaMock.mockDelete.mockResolvedValueOnce({})
    const delRes = await DELETE(new Request('http://localhost', { method: 'DELETE' }), { params: Promise.resolve({ id: 't1' }) } as any)
    expect(delRes.status).toBe(200)
  })
})
