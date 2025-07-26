import { prisma } from '@/lib/db'

const requestCounts = new Map<string, { count: number, resetTime: number }>()

export async function checkRateLimit(identifier: string) {
  const now = Date.now()

  const rateLimitSetting = await prisma.systemSetting.findUnique({
    where: { key: 'api.rate.limit' },
  })

  const rateLimit = Number.parseInt(rateLimitSetting?.value || '60')
  const windowMs = 60 * 1000

  const current = requestCounts.get(identifier)

  if (!current || now > current.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: rateLimit - 1 }
  }

  if (current.count >= rateLimit) {
    return { allowed: false, remaining: 0 }
  }

  current.count++
  return { allowed: true, remaining: rateLimit - current.count }
}

export async function checkMaintenanceMode() {
  const maintenanceSetting = await prisma.systemSetting.findUnique({
    where: { key: 'maintenance.mode' },
  })

  return maintenanceSetting?.value === 'true'
}
