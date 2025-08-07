/** @jest-environment node */

// Mocks
jest.mock('@/lib/server-utils', () => ({
  checkMaintenanceMode: jest.fn().mockResolvedValue(false),
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    systemSetting: { findUnique: jest.fn() },
    user: { findUnique: jest.fn(), create: jest.fn() },
    instruction: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

describe('e2e: register -> create instruction flow', () => {
  beforeEach(() => {
    jest.resetModules()
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.systemSetting.findUnique.mockReset()
    prisma.user.findUnique.mockReset()
    prisma.user.create.mockReset()
    prisma.instruction.findFirst.mockReset()
    prisma.instruction.create.mockReset()
    prisma.instruction.update.mockReset()
    prisma.instruction.count.mockReset()
    prisma.instruction.findMany.mockReset()
    const { getServerSession } = jest.requireMock('next-auth') as any
    getServerSession.mockReset()
  })

  it('registers a user, creates a draft, then creates a final instruction', async () => {
    const { prisma } = jest.requireMock('@/lib/db') as any
    const { getServerSession } = jest.requireMock('next-auth') as any

    // Registration allowed
    prisma.systemSetting.findUnique.mockResolvedValueOnce(null)
    // No existing user, then user created
    prisma.user.findUnique.mockResolvedValueOnce(null)
    prisma.user.create.mockResolvedValueOnce({ id: 'u1', name: 'User', email: 'u@example.com' })

    // Register
    const { POST: REGISTER } = await import('@/app/api/auth/register/route')
    const regReq = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'User', email: 'u@example.com', password: 'pass1234' }),
    })
    const regRes = await REGISTER(regReq)
    expect(regRes.status).toBe(200)

    // Auth session for instruction APIs
    getServerSession.mockResolvedValue({ user: { id: 'u1' } })

    // Create draft first time
    prisma.instruction.findFirst.mockResolvedValueOnce(null)
    prisma.instruction.create.mockResolvedValueOnce({ id: 'i1', isDraft: true })

    const { POST: CREATE } = await import('@/app/api/instructions/route')
    const draftReq = new Request('http://localhost/api/instructions', {
      method: 'POST',
      body: JSON.stringify({ isDraft: true, title: 'Draft A', content: 'C' }),
    })
    const draftRes = await CREATE(draftReq as any)
    expect(draftRes.status).toBe(201)

    // Update same draft second time
    prisma.instruction.findFirst.mockResolvedValueOnce({ id: 'i1', isDraft: true })
    prisma.instruction.update.mockResolvedValueOnce({ id: 'i1', isDraft: true, title: 'Draft A2' })

    const draftReq2 = new Request('http://localhost/api/instructions', {
      method: 'POST',
      body: JSON.stringify({ isDraft: true, title: 'Draft A2', content: 'C' }),
    })
    const draftRes2 = await CREATE(draftReq2 as any)
    expect(draftRes2.status).toBe(200)

    // Create final (non-draft)
    prisma.instruction.create.mockResolvedValueOnce({ id: 'i2', isDraft: false, title: 'Final' })
    const finalReq = new Request('http://localhost/api/instructions', {
      method: 'POST',
      body: JSON.stringify({ isDraft: false, title: 'Final', content: 'Content', tags: ['x'] }),
    })
    const finalRes = await CREATE(finalReq as any)
    expect(finalRes.status).toBe(201)
  })
})
