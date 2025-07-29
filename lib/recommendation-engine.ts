import type { RecommendationContext, RecommendationResult, UserPreferences } from '@/types/builder'
import { PrismaClient } from '@prisma/client'
import { BLOCK_DEFINITIONS, CACHE_CONFIG } from './constants'

const prisma = new PrismaClient()

/**
 * Smart Rule Engine for AI Prompt Block Recommendations
 *
 * This engine implements expert-based rules to provide intelligent recommendations
 * for prompt building blocks. It uses predefined conditions and expert knowledge
 * to suggest the most appropriate blocks based on current context and user preferences.
 *
 * The rules follow a hierarchical approach:
 * 1. Foundation blocks (role_definition, context_setting) are prioritized first
 * 2. Context-aware recommendations based on current block state
 * 3. User experience level considerations for personalized guidance
 */
class SmartRuleEngine {
  /**
   * Static rules array containing expert-defined recommendation logic
   * Each rule has a condition function and a recommendation object
   */
  private static rules = [
    {
      id: 'foundation_first',
      condition: (context: RecommendationContext) =>
        !context.currentBlocks.includes('role_definition'),
      recommendation: {
        blockType: 'role_definition',
        score: 0.95,
        reason: 'Essential foundation - every great prompt starts here',
        problem: 'Without a defined role, AI responses lack focus and consistency',
        solution: 'Give your AI a clear identity and purpose',
        priority: 'high' as const,
        category: 'foundation' as const,
        confidence: 0.95,
        tags: ['essential', 'foundation'],
      },
    },
    {
      id: 'context_after_role',
      condition: (context: RecommendationContext) =>
        context.currentBlocks.includes('role_definition')
        && !context.currentBlocks.includes('context_setting')
        && (context.blockContents?.role_definition?.length || 0) > 20,
      recommendation: {
        blockType: 'context_setting',
        score: 0.85,
        reason: 'Perfect time to add context to your role',
        problem: 'Your AI has a role but needs environmental context',
        solution: 'Define the setting and background for better responses',
        priority: 'high' as const,
        category: 'foundation' as const,
        confidence: 0.88,
        tags: ['context', 'structure'],
      },
    },
    {
      id: 'beginner_structure',
      condition: (context: RecommendationContext) =>
        context.userPreferences?.experienceLevel === 'beginner'
        && context.currentBlocks.length >= 2
        && !context.currentBlocks.includes('output_format'),
      recommendation: {
        blockType: 'output_format',
        score: 0.82,
        reason: 'Structure helps beginners get consistent results',
        problem: 'Responses might be inconsistent without clear formatting',
        solution: 'Add structure to make AI responses more predictable',
        priority: 'medium' as const,
        category: 'task_control' as const,
        confidence: 0.75,
        tags: ['beginner-friendly', 'structure'],
      },
    },
  ]

  /**
   * Get recommendations based on current context by evaluating all rules
   *
   * @param context - Current recommendation context including blocks and user preferences
   * @returns Array of recommendation results sorted by score
   */
  static getRecommendations(context: RecommendationContext): RecommendationResult[] {
    return this.rules
      .filter(rule => rule.condition(context))
      .map(rule => rule.recommendation)
      .sort((a, b) => b.score - a.score)
  }
}

/**
 * Multi-layered Recommendation Engine for AI Prompt Building
 *
 * This engine combines three different recommendation strategies:
 * 1. Smart Rules: Expert-based recommendations with highest priority
 * 2. Collaborative Filtering: Based on user behavior patterns across all users
 * 3. Personalized Recommendations: Tailored to individual user preferences and history
 *
 * The engine uses intelligent caching, weighted scoring, and multi-dimensional ranking
 * to provide the most relevant block recommendations for prompt building.
 */
export class RecommendationEngine {
  /**
   * Get smart rule-based recommendations
   *
   * @param context - Current recommendation context
   * @returns Array of rule-based recommendations
   */
  private getSmartRecommendations(context: RecommendationContext): RecommendationResult[] {
    return SmartRuleEngine.getRecommendations(context)
  }

  /**
   * Get collaborative filtering recommendations based on user behavior patterns
   *
   * This method analyzes how different blocks are used together across all users
   * to find popular combinations and suggest blocks that frequently co-occur.
   *
   * @param context - Current recommendation context
   * @returns Promise resolving to collaborative recommendations
   */
  private async getCollaborativeRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const { currentBlocks } = context
    if (currentBlocks.length === 0)
      return []

    const cacheKey = currentBlocks.sort().join(',')
    const cached = CACHE_CONFIG.collaborative.get(cacheKey)
    if (cached)
      return cached

    try {
      const sessions = await prisma.userSession.findMany({
        select: {
          blockSequence: true,
        },
        where: {
          blockSequence: {
            hasSome: currentBlocks,
          },
        },
        take: 500,
      })

      const cooccurrenceMatrix = this.buildCooccurrenceMatrix(sessions)
      const recommendations = this.calculateCollaborativeScores(currentBlocks, cooccurrenceMatrix)

      CACHE_CONFIG.collaborative.set(cacheKey, recommendations)
      return recommendations
    }
    catch (error) {
      console.error('Error getting collaborative recommendations:', error)
      return []
    }
  }

  /**
   * Build a co-occurrence matrix from user sessions
   *
   * Creates a matrix showing how often different blocks are used together
   * in user sessions. This enables finding popular block combinations.
   *
   * @param sessions - Array of user session data
   * @returns Map representing block co-occurrence relationships
   */
  private buildCooccurrenceMatrix(sessions: any[]): Map<string, Map<string, number>> {
    const matrix = new Map<string, Map<string, number>>()

    sessions.forEach((session) => {
      const blocks = session.blockSequence
      for (let i = 0; i < blocks.length - 1; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
          this.updateCooccurrence(matrix, blocks[i], blocks[j])
        }
      }
    })

    return matrix
  }

  /**
   * Update co-occurrence counts for a pair of blocks
   *
   * @param matrix - The co-occurrence matrix to update
   * @param blockA - First block type
   * @param blockB - Second block type
   */
  private updateCooccurrence(matrix: Map<string, Map<string, number>>, blockA: string, blockB: string) {
    const updatePair = (from: string, to: string) => {
      if (!matrix.has(from))
        matrix.set(from, new Map())
      const subMap = matrix.get(from)!
      subMap.set(to, (subMap.get(to) || 0) + 1)
    }

    updatePair(blockA, blockB)
    updatePair(blockB, blockA)
  }

  /**
   * Calculate collaborative filtering scores based on co-occurrence matrix
   *
   * @param currentBlocks - Currently selected blocks
   * @param matrix - Co-occurrence matrix
   * @returns Array of recommendation results with collaborative scores
   */
  private calculateCollaborativeScores(currentBlocks: string[], matrix: Map<string, Map<string, number>>): RecommendationResult[] {
    const scores = new Map<string, number>()
    const contexts = new Map<string, number>()

    currentBlocks.forEach((block) => {
      const related = matrix.get(block)
      if (related) {
        related.forEach((count, targetBlock) => {
          if (!currentBlocks.includes(targetBlock)) {
            scores.set(targetBlock, (scores.get(targetBlock) || 0) + count)
            contexts.set(targetBlock, (contexts.get(targetBlock) || 0) + 1)
          }
        })
      }
    })

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([blockType, count]) => ({
        blockType,
        score: Math.min(count / 20, 0.9),
        reason: `Popular combination (${count} times)`,
        confidence: Math.min(contexts.get(blockType)! / currentBlocks.length, 1),
        category: BLOCK_DEFINITIONS[blockType as keyof typeof BLOCK_DEFINITIONS]?.category || 'foundation',
        tags: ['collaborative', 'popular'],
      }))
  }

  /**
   * Get personalized recommendations based on user's individual behavior
   *
   * Analyzes the user's block usage history and recent session patterns
   * to provide tailored recommendations that match their preferences.
   *
   * @param context - Current recommendation context including user ID
   * @returns Promise resolving to personalized recommendations
   */
  private async getPersonalizedRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const { userId, currentBlocks, userPreferences } = context
    if (!userId)
      return []

    const cacheKey = `${userId}-${currentBlocks.length}`
    const cached = CACHE_CONFIG.personalized.get(cacheKey)
    if (cached)
      return cached

    try {
      const [userUsages, recentSessions] = await Promise.all([
        prisma.userBlockUsage.findMany({
          where: { userId },
          orderBy: { usageCount: 'desc' },
          take: 15,
        }),
        prisma.userSession.findMany({
          where: { userId },
          orderBy: { completedAt: 'desc' },
          take: 5,
          select: { blockSequence: true },
        }),
      ])

      const recommendations = this.generatePersonalizedScores(
        userUsages,
        recentSessions,
        currentBlocks,
        userPreferences,
      )

      CACHE_CONFIG.personalized.set(cacheKey, recommendations)
      return recommendations
    }
    catch (error) {
      console.error('Error getting personalized recommendations:', error)
      return []
    }
  }

  /**
   * Generate personalized scores based on user behavior patterns
   *
   * Combines frequency-based scoring (how often user uses each block)
   * with pattern-based scoring (recent session combinations) and applies
   * user preference multipliers based on experience level.
   *
   * @param userUsages - User's block usage statistics
   * @param recentSessions - User's recent session data
   * @param currentBlocks - Currently selected blocks
   * @param userPreferences - User preferences including experience level
   * @returns Array of personalized recommendation results
   */
  private generatePersonalizedScores(
    userUsages: any[],
    recentSessions: any[],
    currentBlocks: string[],
    userPreferences?: UserPreferences,
  ): RecommendationResult[] {
    const frequencyScores = new Map<string, number>()
    userUsages.forEach((usage) => {
      if (!currentBlocks.includes(usage.blockType)) {
        frequencyScores.set(usage.blockType, usage.usageCount)
      }
    })

    const patternScores = new Map<string, number>()
    recentSessions.forEach((session) => {
      session.blockSequence.forEach((blockType: string) => {
        if (!currentBlocks.includes(blockType)) {
          patternScores.set(blockType, (patternScores.get(blockType) || 0) + 1)
        }
      })
    })

    const preferenceMultiplier = userPreferences?.experienceLevel === 'beginner'
      ? 1.2
      : userPreferences?.experienceLevel === 'advanced' ? 0.8 : 1.0

    const combinedScores = new Map<string, number>()

    frequencyScores.forEach((score, blockType) => {
      const patternBonus = patternScores.get(blockType) || 0
      const finalScore = (score * 0.7 + patternBonus * 0.3) * preferenceMultiplier
      combinedScores.set(blockType, finalScore)
    })

    return Array.from(combinedScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([blockType, score]) => ({
        blockType,
        score: Math.min(score / 15, 0.85),
        reason: `Based on your usage pattern`,
        confidence: Math.min(score / 10, 1),
        category: BLOCK_DEFINITIONS[blockType as keyof typeof BLOCK_DEFINITIONS]?.category || 'foundation',
        tags: ['personalized', 'pattern-based'],
      }))
  }

  /**
   * Intelligently merge and rank recommendations from all three sources
   *
   * Combines smart rules, collaborative filtering, and personalized recommendations
   * using weighted scoring and multi-dimensional ranking based on priority,
   * score, and confidence levels.
   *
   * @param recommendations - Array of recommendation arrays from different sources
   * @param _context - Current recommendation context (unused in this method)
   * @returns Merged and ranked recommendation results
   */
  private intelligentMergeAndRank(
    recommendations: RecommendationResult[][],
    _context: RecommendationContext,
  ): RecommendationResult[] {
    const merged = new Map<string, RecommendationResult>()
    const weights = {
      smart: 1.0,
      collaborative: 0.7,
      personalized: 0.8,
    }

    recommendations.forEach((recs, index) => {
      const weight = Object.values(weights)[index] || 0.5

      recs.forEach((rec) => {
        const existing = merged.get(rec.blockType)
        const weightedScore = rec.score * weight

        if (!existing || weightedScore > existing.score) {
          merged.set(rec.blockType, {
            ...rec,
            score: weightedScore,
            confidence: (rec.confidence || 0.5) * weight,
          })
        }
      })
    })

    return Array.from(merged.values())
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const aPriority = priorityOrder[a.priority || 'low']
        const bPriority = priorityOrder[b.priority || 'low']

        if (aPriority !== bPriority)
          return bPriority - aPriority

        if (Math.abs(a.score - b.score) > 0.1)
          return b.score - a.score

        return (b.confidence || 0) - (a.confidence || 0)
      })
      .slice(0, 6)
  }

  /**
   * Main recommendation method that orchestrates all recommendation strategies
   *
   * This is the primary entry point for getting block recommendations.
   * It implements a smart fallback strategy: if there are enough high-priority
   * smart rule recommendations, it returns those immediately. Otherwise,
   * it combines all three recommendation sources for comprehensive results.
   *
   * @param context - Current recommendation context
   * @returns Promise resolving to final recommendation results
   */
  async getRecommendations(context: RecommendationContext): Promise<RecommendationResult[]> {
    const smartRecs = this.getSmartRecommendations(context)

    const highPriorityRecs = smartRecs.filter(rec => rec.priority === 'high')
    if (highPriorityRecs.length >= 2) {
      return highPriorityRecs.slice(0, 4)
    }

    const [collaborative, personalized] = await Promise.all([
      this.getCollaborativeRecommendations(context),
      this.getPersonalizedRecommendations(context),
    ])

    return this.intelligentMergeAndRank([smartRecs, collaborative, personalized], context)
  }

  /**
   * Record a block usage event for a user
   *
   * Updates the user's block usage statistics and clears related caches
   * to ensure fresh personalized recommendations.
   *
   * @param userId - User identifier
   * @param blockType - Type of block that was used
   */
  async recordBlockUsage(userId: string, blockType: string) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.userBlockUsage.upsert({
          where: { userId_blockType: { userId, blockType } },
          update: {
            usageCount: { increment: 1 },
            lastUsed: new Date(),
          },
          create: { userId, blockType, usageCount: 1 },
        })

        CACHE_CONFIG.personalized.delete(`${userId}-*`)
      })
    }
    catch (error) {
      console.error('Error recording block usage:', error)
    }
  }

  /**
   * Record a user session with block sequence
   *
   * Stores the sequence of blocks used in a session for collaborative
   * filtering analysis. Only records sessions with 2+ blocks.
   *
   * @param userId - User identifier
   * @param blockSequence - Array of block types used in the session
   */
  async recordUserSession(userId: string, blockSequence: string[]) {
    if (blockSequence.length < 2)
      return

    try {
      const sessionId = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      await prisma.userSession.create({
        data: { userId, sessionId, blockSequence },
      })

      this.clearRelatedCaches(blockSequence)
    }
    catch (error) {
      console.error('Error recording user session:', error)
    }
  }

  /**
   * Clear caches related to specific blocks
   *
   * Removes cached collaborative recommendations that might be affected
   * by the new session data to ensure fresh recommendations.
   *
   * @param blockSequence - Array of block types that were used
   */
  private clearRelatedCaches(blockSequence: string[]) {
    blockSequence.forEach((block) => {
      CACHE_CONFIG.collaborative.forEach((_, key) => {
        if (key.includes(block)) {
          CACHE_CONFIG.collaborative.delete(key)
        }
      })
    })
  }

  /**
   * Warm up the recommendation cache with popular combinations
   *
   * Pre-loads the cache with frequently used block combinations
   * to improve response times for common scenarios.
   */
  async warmupCache() {
    try {
      const popularCombinations = await prisma.userSession.groupBy({
        by: ['blockSequence'],
        _count: { blockSequence: true },
        orderBy: { _count: { blockSequence: 'desc' } },
        take: 50,
      })

      popularCombinations.forEach((combo) => {
        const _key = combo.blockSequence.sort().join(',')
        this.getCollaborativeRecommendations({ currentBlocks: combo.blockSequence })
      })
    }
    catch (error) {
      console.error('Error warming up cache:', error)
    }
  }
}
