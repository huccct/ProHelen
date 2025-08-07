/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    systemSetting: { findUnique: jest.fn() },
    user: { findUnique: jest.fn(), create: jest.fn() },
  },
}))

jest.mock('@/lib/xss-protection', () => ({
  sanitizeText: (v: string) => v,
  sanitizeEmail: (v: string) => v,
  sanitizePassword: (v: string) => v,
}))

describe('pOST /api/auth/register', () => {
  beforeEach(() => {
    jest.resetModules()
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.systemSetting.findUnique.mockReset()
    prisma.user.findUnique.mockReset()
    prisma.user.create.mockReset()
  })

  it('forbids when registration disabled', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.systemSetting.findUnique.mockResolvedValueOnce({ key: 'security.allow.registration', value: 'false' })
    const { POST } = await import('@/app/api/auth/register/route')

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'A', email: 'a@example.com', password: 'pass1234' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('rejects when email exists', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.systemSetting.findUnique.mockResolvedValueOnce(null)
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'u1', email: 'a@example.com' })

    const { POST } = await import('@/app/api/auth/register/route')
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'A', email: 'a@example.com', password: 'pass1234' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('creates user when valid', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.systemSetting.findUnique.mockResolvedValueOnce(null)
    prisma.user.findUnique.mockResolvedValueOnce(null)
    prisma.user.create.mockResolvedValueOnce({ id: 'u1', name: 'A', email: 'a@example.com' })

    const { POST } = await import('@/app/api/auth/register/route')
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'A', email: 'a@example.com', password: 'pass1234' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.user).toEqual({ name: 'A', email: 'a@example.com' })
  })
})
