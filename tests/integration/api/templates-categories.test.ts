/** @jest-environment node */

jest.mock('@prisma/client', () => {
  const mockFindMany = jest.fn()
  const PrismaClient = jest.fn().mockImplementation(() => ({
    template: { findMany: mockFindMany },
  }))
  return { PrismaClient, __esModule: true, mockFindMany }
})

describe('gET /api/templates/categories', () => {
  it('returns distinct categories with All prefix', async () => {
    const { mockFindMany } = jest.requireMock('@prisma/client') as any
    mockFindMany.mockResolvedValueOnce([
      { category: 'Art' },
      { category: 'Business' },
      { category: 'Education' },
    ])

    const { GET } = await import('@/app/api/templates/categories/route')
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await (res as any).json()
    expect(data.categories).toEqual(['All', 'Art', 'Business', 'Education'])
  })
})
