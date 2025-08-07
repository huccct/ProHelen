/** @jest-environment node */

jest.mock('next/server', () => {
  const mockJson = jest.fn((body: any) => body)
  return { NextResponse: { json: mockJson }, __esModule: true, mockJson }
})

jest.mock('@/lib/server-utils', () => ({
  checkMaintenanceMode: jest.fn(),
}))

const { checkMaintenanceMode } = jest.requireMock('@/lib/server-utils') as {
  checkMaintenanceMode: jest.Mock
}

describe('get /api/maintenance-status', () => {
  beforeEach(() => {
    const { mockJson } = jest.requireMock('next/server') as any
    mockJson.mockClear()
  })

  it('returns maintenanceMode true when in maintenance', async () => {
    const { mockJson } = jest.requireMock('next/server') as any
    checkMaintenanceMode.mockResolvedValueOnce(true)
    const { GET } = await import('@/app/api/maintenance-status/route')
    await GET()
    expect(mockJson).toHaveBeenCalledWith({ maintenanceMode: true })
  })

  it('returns maintenanceMode false when not in maintenance', async () => {
    const { mockJson } = jest.requireMock('next/server') as any
    checkMaintenanceMode.mockResolvedValueOnce(false)
    const { GET } = await import('@/app/api/maintenance-status/route')
    await GET()
    expect(mockJson).toHaveBeenCalledWith({ maintenanceMode: false })
  })
})
