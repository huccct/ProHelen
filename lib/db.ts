import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
