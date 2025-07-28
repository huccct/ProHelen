import type { ChecklistItem, ProgressData } from '@/types/builder'
import { useMemo } from 'react'
import { EXAMPLE_KEYWORDS, SCORING_CONFIG, TASK_KEYWORDS } from '../constants'
import { categorizeNodeType, containsKeywords } from '../utils'

export function useProgressCalculation(nodes: any[]) {
  return useMemo((): ProgressData => {
    if (nodes.length === 0) {
      return {
        score: 0,
        checklist: [],
        nodeCount: 0,
        contentProgress: 0,
        hasExamples: false,
        hasTaskClarity: false,
        diversityCount: 0,
      }
    }

    const checklist: ChecklistItem[] = []

    const hasRoleDefinition = nodes.some(node => node.data?.type === 'role_definition')
    const hasContextSetting = nodes.some(node => node.data?.type === 'context_setting')
    const hasOutputFormat = nodes.some(node => node.data?.type === 'output_format')

    checklist.push(
      {
        id: 'role',
        label: 'builder.components.progressIndicator.checklist.roleDefinition',
        completed: hasRoleDefinition,
        points: SCORING_CONFIG.CORE_BLOCKS.ROLE_DEFINITION,
      },
      {
        id: 'context',
        label: 'builder.components.progressIndicator.checklist.contextSetting',
        completed: hasContextSetting,
        points: SCORING_CONFIG.CORE_BLOCKS.CONTEXT_SETTING,
      },
      {
        id: 'output',
        label: 'builder.components.progressIndicator.checklist.outputFormat',
        completed: hasOutputFormat,
        points: SCORING_CONFIG.CORE_BLOCKS.OUTPUT_FORMAT,
      },
    )

    const hasTaskClarity = nodes.some((node) => {
      const content = node.data?.content || ''
      return containsKeywords(content, [...TASK_KEYWORDS.ZH, ...TASK_KEYWORDS.EN])
    })

    checklist.push({
      id: 'taskClarity',
      label: 'builder.components.progressIndicator.checklist.taskClarity',
      completed: hasTaskClarity,
      points: SCORING_CONFIG.SUPPLEMENTARY.TASK_CLARITY,
    })

    const hasCommunicationStyle = nodes.some(node => node.data?.type === 'communication_style')
    checklist.push({
      id: 'communication',
      label: 'builder.components.progressIndicator.checklist.communicationStyle',
      completed: hasCommunicationStyle,
      points: SCORING_CONFIG.SUPPLEMENTARY.COMMUNICATION_STYLE,
    })

    const nodesWithContent = nodes.filter(node =>
      node.data?.content
      && node.data.content.trim().length > SCORING_CONFIG.THRESHOLDS.MIN_CONTENT_LENGTH,
    ).length

    const contentCompleteness = (nodesWithContent / nodes.length) * 100
    const contentQualityMet = contentCompleteness >= SCORING_CONFIG.THRESHOLDS.CONTENT_COMPLETENESS

    checklist.push({
      id: 'content',
      label: 'builder.components.progressIndicator.checklist.customContent',
      completed: contentQualityMet,
      points: SCORING_CONFIG.SUPPLEMENTARY.CONTENT_QUALITY,
    })

    const hasExamples = nodes.some((node) => {
      const content = node.data?.content || ''
      return containsKeywords(content, [...EXAMPLE_KEYWORDS.ZH, ...EXAMPLE_KEYWORDS.EN])
    })

    checklist.push({
      id: 'examples',
      label: 'builder.components.progressIndicator.checklist.examples',
      completed: hasExamples,
      points: SCORING_CONFIG.SUPPLEMENTARY.EXAMPLES,
    })

    const categories = new Set(
      nodes
        .filter(node => node.data?.type)
        .map(node => categorizeNodeType(node.data.type)),
    )

    const diversityMet = categories.size >= 2
    checklist.push({
      id: 'diversity',
      label: 'builder.components.progressIndicator.checklist.diversity',
      completed: diversityMet,
      points: SCORING_CONFIG.SUPPLEMENTARY.DIVERSITY,
    })

    const baseScore = checklist.reduce((total, item) =>
      total + (item.completed ? item.points : 0), 0)

    let qualityBonus = 0
    if (contentCompleteness >= SCORING_CONFIG.THRESHOLDS.HIGH_CONTENT_QUALITY) {
      qualityBonus += SCORING_CONFIG.BONUS.HIGH_CONTENT_QUALITY
    }
    if (categories.size >= SCORING_CONFIG.THRESHOLDS.HIGH_DIVERSITY) {
      qualityBonus += SCORING_CONFIG.BONUS.HIGH_DIVERSITY
    }

    const finalScore = Math.min(100, Math.round(baseScore + qualityBonus))

    return {
      score: finalScore,
      checklist,
      nodeCount: nodes.length,
      contentProgress: Math.round(contentCompleteness),
      hasExamples,
      hasTaskClarity,
      diversityCount: categories.size,
    }
  }, [nodes])
}
