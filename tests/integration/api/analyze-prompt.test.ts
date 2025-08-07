/** @jest-environment node */

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/server-utils', () => ({
  checkMaintenanceMode: jest.fn(),
  checkRateLimit: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    systemSetting: { findUnique: jest.fn() },
  },
}))

describe('post /api/analyze-prompt', () => {
  beforeEach(() => {
    jest.resetModules()
    const { checkMaintenanceMode, checkRateLimit } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockReset()
    checkRateLimit.mockReset()
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.systemSetting.findUnique.mockReset()
    const { getServerSession } = jest.requireMock('next-auth') as any
    getServerSession.mockReset()
    getServerSession.mockResolvedValue(null)
  })

  it('returns 400 when userPrompt missing', async () => {
    const { checkMaintenanceMode, checkRateLimit } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockResolvedValueOnce(false)
    checkRateLimit.mockResolvedValueOnce({ allowed: true })

    const { POST } = await import('@/app/api/analyze-prompt/route')
    const req = new Request('http://localhost/api/analyze-prompt', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('returns 500 when OpenAI key not configured', async () => {
    const { checkMaintenanceMode, checkRateLimit } = jest.requireMock('@/lib/server-utils') as any
    checkMaintenanceMode.mockResolvedValueOnce(false)
    checkRateLimit.mockResolvedValueOnce({ allowed: true })
    const { prisma } = jest.requireMock('@/lib/db') as any
    prisma.systemSetting.findUnique.mockResolvedValueOnce(null)
    const previous = process.env.OPENAI_API_KEY
    process.env.OPENAI_API_KEY = ''

    const { POST } = await import('@/app/api/analyze-prompt/route')
    const req = new Request('http://localhost/api/analyze-prompt', {
      method: 'POST',
      body: JSON.stringify({ userPrompt: 'hello' }),
    })

    const res = await POST(req as any)
    expect(res.status).toBe(500)

    process.env.OPENAI_API_KEY = previous
  })
})
