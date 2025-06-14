import type { NextRequest } from 'next/server'
import { RecommendationEngine } from '@/lib/recommendation-engine'
import { getServerSession } from 'next-auth'

// 简化的 auth 配置
const authOptions = {
  session: { strategy: 'jwt' as const },
}

const engine = new RecommendationEngine()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { selectedBlockType, currentBlocks } = body

    if (!currentBlocks || !Array.isArray(currentBlocks)) {
      return Response.json({ error: 'Invalid currentBlocks' }, { status: 400 })
    }

    // 获取推荐
    const recommendations = await engine.getRecommendations({
      currentBlocks,
      selectedBlockType,
      userId: session?.user?.id,
    })

    return Response.json({ recommendations })
  }
  catch (error) {
    console.error('Error getting recommendations:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 记录用户行为
export async function PUT(request: NextRequest) {
  try {
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
