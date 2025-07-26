import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.systemSetting.findMany({
    orderBy: {
      category: 'asc',
    },
  })

  return Response.json({ settings })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const { settings } = data

  try {
    await prisma.$transaction(
      settings.map((setting: any) =>
        prisma.systemSetting.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            updatedBy: session.user.id,
          },
          create: {
            key: setting.key,
            value: setting.value,
            category: setting.category,
            description: setting.description,
            updatedBy: session.user.id,
          },
        }),
      ),
    )

    return Response.json({ success: true })
  }
  catch (error) {
    console.error('Failed to save settings:', error)
    return Response.json(
      { error: 'Failed to save settings' },
      { status: 500 },
    )
  }
}
