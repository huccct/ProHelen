import type { NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { RecommendationEngine } from '@/lib/recommendation-engine'
import { checkMaintenanceMode } from '@/lib/server-utils'
import { getServerSession } from 'next-auth'

const engine = new RecommendationEngine()

export async function POST(request: NextRequest) {
  try {
    if (await checkMaintenanceMode()) {
      return Response.json(
        { error: 'System is under maintenance' },
        { status: 503 },
      )
    }

    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { selectedBlockType, currentBlocks, blockContents } = body

    if (!currentBlocks || !Array.isArray(currentBlocks)) {
      return Response.json({ error: 'Invalid currentBlocks' }, { status: 400 })
    }

    const recommendations = await engine.getRecommendations({
      currentBlocks,
      selectedBlockType,
      userId: session?.user?.id,
      blockContents: blockContents || {},
    })

    return Response.json({ recommendations })
  }
  catch (error) {
    console.error('Error getting recommendations:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 检查维护模式
    if (await checkMaintenanceMode()) {
      return Response.json(
        { error: 'System is under maintenance' },
        { status: 503 },
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'block_added':
        await engine.recordBlockUsage(session.user.id, data.blockType)
        break

      case 'session_completed':
        await engine.recordUserSession(session.user.id, data.blockSequence)
        break
    }

    return Response.json({ success: true })
  }
  catch (error) {
    console.error('Error recording user behavior:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
