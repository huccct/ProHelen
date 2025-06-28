import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface RecommendationResult {
  blockType: string
  score: number
  reason: string
  problem?: string
  solution?: string
  suggestedContent?: string
  impact?: string
  priority?: 'high' | 'medium' | 'low'
}

export interface RecommendationContext {
  currentBlocks: string[]
  selectedBlockType?: string
  userId?: string
  blockContents?: Record<string, string>
}

export class RecommendationEngine {
  private getPracticalRecommendations(context: RecommendationContext): RecommendationResult[] {
    const { currentBlocks, blockContents = {} } = context
    const recommendations: RecommendationResult[] = []

    if (!currentBlocks.includes('role_definition')) {
      recommendations.push({
        blockType: 'role_definition',
        score: 0.95,
        reason: 'Essential foundation block',
        problem: 'AI doesn\'t know what role to play, responses may be generic',
        solution: 'Define a specific role for your AI assistant',
        suggestedContent: 'You are an experienced professional assistant who specializes in providing clear, helpful, and actionable guidance.',
        impact: 'Your AI will have a consistent professional identity and provide more targeted responses',
        priority: 'high',
      })
    }

    if (currentBlocks.includes('role_definition')
      && blockContents.role_definition
      && blockContents.role_definition.length < 50) {
      recommendations.push({
        blockType: 'context_setting',
        score: 0.85,
        reason: 'Role needs more context',
        problem: 'AI role is too vague, needs more specific background',
        solution: 'Add context to make the role more professional and specific',
        suggestedContent: 'You work in a professional environment where clear communication and detailed explanations are valued. Your responses should be thorough yet easy to understand.',
        impact: 'More professional and contextually appropriate responses',
        priority: 'high',
      })
    }

    if (!currentBlocks.includes('output_format') && currentBlocks.length >= 2) {
      recommendations.push({
        blockType: 'output_format',
        score: 0.8,
        reason: 'Improves response structure',
        problem: 'AI responses lack consistent structure, making them hard to follow',
        solution: 'Set a clear format for all responses',
        suggestedContent: 'Please structure your responses as follows:\n## Quick Answer\n## Detailed Explanation\n## Next Steps\n\nThis makes information easier to understand and act upon.',
        impact: 'Responses will be well-organized and easier to understand',
        priority: 'medium',
      })
    }

    if (currentBlocks.includes('role_definition') && !currentBlocks.includes('communication_style')) {
      recommendations.push({
        blockType: 'communication_style',
        score: 0.75,
        reason: 'Complements role definition',
        problem: 'AI has a role but communication style is unclear, may sound too formal or casual',
        solution: 'Define how the AI should communicate with users',
        suggestedContent: 'Communicate in a friendly, professional tone. Use clear, simple language and avoid jargon. Be encouraging and patient in your explanations.',
        impact: 'More natural and appropriate conversation style',
        priority: 'medium',
      })
    }

    if (currentBlocks.length >= 3 && !currentBlocks.includes('goal_setting')) {
      recommendations.push({
        blockType: 'goal_setting',
        score: 0.7,
        reason: 'Provides clear direction',
        problem: 'Conversations lack clear objectives, may become unfocused',
        solution: 'Set clear goals for what the AI should help users achieve',
        suggestedContent: 'Your goal is to help users achieve their objectives efficiently by providing actionable advice, clear explanations, and practical next steps.',
        impact: 'More focused and goal-oriented assistance',
        priority: 'low',
      })
    }

    return recommendations.sort((a, b) => b.score - a.score)
  }

  private getRuleBasedRecommendations(context: RecommendationContext): RecommendationResult[] {
    const { selectedBlockType, currentBlocks } = context

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

  private async getCollaborativeRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const { currentBlocks } = context

    if (currentBlocks.length === 0) {
      return []
    }

    try {
      const sessions = await prisma.userSession.findMany({
        select: {
          blockSequence: true,
          userId: true,
        },
        take: 1000,
      })

      const cooccurrence = new Map<string, Map<string, number>>()

      sessions.forEach((session) => {
        const blocks = session.blockSequence

        for (let i = 0; i < blocks.length; i++) {
          for (let j = i + 1; j < blocks.length; j++) {
            const blockA = blocks[i]
            const blockB = blocks[j]

            if (!cooccurrence.has(blockA)) {
              cooccurrence.set(blockA, new Map())
            }
            const blockAMap = cooccurrence.get(blockA)!
            blockAMap.set(blockB, (blockAMap.get(blockB) || 0) + 1)

            if (!cooccurrence.has(blockB)) {
              cooccurrence.set(blockB, new Map())
            }
            const blockBMap = cooccurrence.get(blockB)!
            blockBMap.set(blockA, (blockBMap.get(blockA) || 0) + 1)
          }
        }
      })

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

      const results = Array.from(recommendations.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([blockType, count]) => ({
          blockType,
          score: Math.min(count / 10, 1),
          reason: `Used together in ${count} other flows`,
        }))

      return results
    }
    catch (error) {
      console.error('Error getting collaborative recommendations:', error)
      return []
    }
  }

  private async getPersonalizedRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const { userId, currentBlocks } = context

    if (!userId) {
      return []
    }

    try {
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

  private mergeAndRankRecommendations(recommendations: RecommendationResult[][]): RecommendationResult[] {
    const merged = new Map<string, RecommendationResult>()

    recommendations.flat().forEach((rec) => {
      const existing = merged.get(rec.blockType)
      if (existing) {
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

  async getRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    // 优先使用实用性推荐
    const practical = this.getPracticalRecommendations(context)

    // 如果有实用性推荐，主要返回这些
    if (practical.length > 0) {
      return practical.slice(0, 4) // 限制为4个最重要的建议
    }

    // 否则回退到原有逻辑
    const [ruleBased, collaborative, personalized] = await Promise.all([
      Promise.resolve(this.getRuleBasedRecommendations(context)),
      this.getCollaborativeRecommendations(context),
      this.getPersonalizedRecommendations(context),
    ])

    return this.mergeAndRankRecommendations([ruleBased, collaborative, personalized])
  }

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

  async recordUserSession(userId: string, blockSequence: string[]) {
    if (blockSequence.length < 2)
      return

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
