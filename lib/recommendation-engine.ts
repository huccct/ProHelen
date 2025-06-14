import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface RecommendationResult {
  blockType: string
  score: number
  reason: string
}

export interface RecommendationContext {
  currentBlocks: string[]
  selectedBlockType?: string
  userId?: string
}

export class RecommendationEngine {
  // 基于规则的推荐（立即可用）
  private getRuleBasedRecommendations(context: RecommendationContext): RecommendationResult[] {
    const { selectedBlockType, currentBlocks } = context

    // 定义块之间的关联规则
    const rules: Record<string, string[]> = {
      role_definition: ['context_setting', 'communication_style', 'personality_traits'],
      context_setting: ['output_format', 'goal_setting', 'subject_focus'],
      goal_setting: ['learning_style', 'difficulty_level', 'time_management'],
      learning_style: ['subject_focus', 'feedback_style', 'step_by_step'],
      communication_style: ['feedback_style', 'personality_traits', 'output_format'],
      output_format: ['step_by_step', 'time_management', 'prioritization'],
      subject_focus: ['difficulty_level', 'learning_style', 'skill_assessment'],
      difficulty_level: ['feedback_style', 'error_handling', 'step_by_step'],
      step_by_step: ['time_management', 'prioritization', 'conditional_logic'],
      time_management: ['prioritization', 'goal_setting', 'career_planning'],
      feedback_style: ['error_handling', 'skill_assessment', 'personality_traits'],
      personality_traits: ['communication_style', 'creative_thinking', 'feedback_style'],
      prioritization: ['goal_setting', 'time_management', 'career_planning'],
      conditional_logic: ['error_handling', 'creative_thinking', 'step_by_step'],
      creative_thinking: ['conditional_logic', 'personality_traits', 'skill_assessment'],
      error_handling: ['feedback_style', 'conditional_logic', 'step_by_step'],
      career_planning: ['skill_assessment', 'goal_setting', 'time_management'],
      skill_assessment: ['career_planning', 'difficulty_level', 'feedback_style'],
    }

    if (!selectedBlockType || !rules[selectedBlockType]) {
      return []
    }

    return rules[selectedBlockType]
      .filter(blockType => !currentBlocks.includes(blockType))
      .map(blockType => ({
        blockType,
        score: 0.8,
        reason: 'Commonly used together',
      }))
  }

  // 基于协同过滤的推荐
  private async getCollaborativeRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const { currentBlocks } = context

    if (currentBlocks.length === 0) {
      return []
    }

    try {
      // 获取所有用户会话
      const sessions = await prisma.userSession.findMany({
        select: {
          blockSequence: true,
          userId: true,
        },
        take: 1000, // 限制数据量
      })

      // 计算块之间的共现频率
      const cooccurrence = new Map<string, Map<string, number>>()

      sessions.forEach((session) => {
        const blocks = session.blockSequence

        for (let i = 0; i < blocks.length; i++) {
          for (let j = i + 1; j < blocks.length; j++) {
            const blockA = blocks[i]
            const blockB = blocks[j]

            // 更新 A -> B 的共现
            if (!cooccurrence.has(blockA)) {
              cooccurrence.set(blockA, new Map())
            }
            const blockAMap = cooccurrence.get(blockA)!
            blockAMap.set(blockB, (blockAMap.get(blockB) || 0) + 1)

            // 更新 B -> A 的共现
            if (!cooccurrence.has(blockB)) {
              cooccurrence.set(blockB, new Map())
            }
            const blockBMap = cooccurrence.get(blockB)!
            blockBMap.set(blockA, (blockBMap.get(blockA) || 0) + 1)
          }
        }
      })

      // 基于当前块计算推荐
      const recommendations = new Map<string, number>()

      currentBlocks.forEach((block) => {
        const relatedBlocks = cooccurrence.get(block)
        if (relatedBlocks) {
          relatedBlocks.forEach((count, targetBlock) => {
            if (!currentBlocks.includes(targetBlock)) {
              recommendations.set(targetBlock, (recommendations.get(targetBlock) || 0) + count)
            }
          })
        }
      })

      // 转换为结果格式并排序
      const results = Array.from(recommendations.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([blockType, count]) => ({
          blockType,
          score: Math.min(count / 10, 1), // 归一化得分
          reason: `Used together in ${count} other flows`,
        }))

      return results
    }
    catch (error) {
      console.error('Error getting collaborative recommendations:', error)
      return []
    }
  }

  // 基于用户历史的推荐
  private async getPersonalizedRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const { userId, currentBlocks } = context

    if (!userId) {
      return []
    }

    try {
      // 获取用户的块使用历史
      const userUsages = await prisma.userBlockUsage.findMany({
        where: { userId },
        orderBy: { usageCount: 'desc' },
        take: 10,
      })

      return userUsages
        .filter(usage => !currentBlocks.includes(usage.blockType))
        .slice(0, 3)
        .map(usage => ({
          blockType: usage.blockType,
          score: Math.min(usage.usageCount / 10, 0.9),
          reason: `You've used this ${usage.usageCount} times before`,
        }))
    }
    catch (error) {
      console.error('Error getting personalized recommendations:', error)
      return []
    }
  }

  // 合并和排序推荐结果
  private mergeAndRankRecommendations(recommendations: RecommendationResult[][]): RecommendationResult[] {
    const merged = new Map<string, RecommendationResult>()

    recommendations.flat().forEach((rec) => {
      const existing = merged.get(rec.blockType)
      if (existing) {
        // 如果已存在，取最高分数和最好的理由
        if (rec.score > existing.score) {
          merged.set(rec.blockType, rec)
        }
      }
      else {
        merged.set(rec.blockType, rec)
      }
    })

    return Array.from(merged.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }

  // 主推荐方法
  async getRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const [ruleBased, collaborative, personalized] = await Promise.all([
      Promise.resolve(this.getRuleBasedRecommendations(context)),
      this.getCollaborativeRecommendations(context),
      this.getPersonalizedRecommendations(context),
    ])

    return this.mergeAndRankRecommendations([ruleBased, collaborative, personalized])
  }

  // 记录用户行为
  async recordBlockUsage(userId: string, blockType: string) {
    try {
      await prisma.userBlockUsage.upsert({
        where: {
          userId_blockType: { userId, blockType },
        },
        update: {
          usageCount: { increment: 1 },
          lastUsed: new Date(),
        },
        create: {
          userId,
          blockType,
          usageCount: 1,
        },
      })
    }
    catch (error) {
      console.error('Error recording block usage:', error)
    }
  }

  // 记录用户会话
  async recordUserSession(userId: string, blockSequence: string[]) {
    if (blockSequence.length < 2)
      return // 至少需要2个块才有意义

    try {
      const sessionId = `${userId}-${Date.now()}`
      await prisma.userSession.create({
        data: {
          userId,
          sessionId,
          blockSequence,
        },
      })
    }
    catch (error) {
      console.error('Error recording user session:', error)
    }
  }
}
