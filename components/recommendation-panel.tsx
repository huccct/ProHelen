'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Lightbulb, Plus, Sparkles, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RecommendationResult {
  blockType: string
  score: number
  reason: string
}

interface RecommendationPanelProps {
  selectedBlock?: string
  currentBlocks: string[]
  onBlockSelect: (blockType: string) => void
  onClose: () => void
}

// 块类型的颜色映射
const blockTypeColors: Record<string, string> = {
  role_definition: 'from-blue-500 to-blue-600',
  context_setting: 'from-purple-500 to-purple-600',
  output_format: 'from-green-500 to-green-600',
  goal_setting: 'from-orange-500 to-orange-600',
  learning_style: 'from-pink-500 to-pink-600',
  subject_focus: 'from-indigo-500 to-indigo-600',
  difficulty_level: 'from-yellow-500 to-yellow-600',
  communication_style: 'from-teal-500 to-teal-600',
  feedback_style: 'from-cyan-500 to-cyan-600',
  personality_traits: 'from-rose-500 to-rose-600',
  step_by_step: 'from-violet-500 to-violet-600',
  time_management: 'from-amber-500 to-amber-600',
  prioritization: 'from-emerald-500 to-emerald-600',
  conditional_logic: 'from-gray-500 to-gray-600',
  creative_thinking: 'from-lime-500 to-lime-600',
  error_handling: 'from-red-500 to-red-600',
  career_planning: 'from-blue-600 to-indigo-600',
  skill_assessment: 'from-green-600 to-teal-600',
}

export function RecommendationPanel({
  selectedBlock,
  currentBlocks,
  onBlockSelect,
  onClose,
}: RecommendationPanelProps) {
  const { t } = useTranslation()
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [loading, setLoading] = useState(false)

  // 添加引用来跟踪最后的块列表和选中块
  const lastBlocksRef = useRef<string>('')
  const lastSelectedBlockRef = useRef<string>('')
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // 检查是否有实质性变化的函数
  const hasSignificantChange = useCallback((newBlocks: string[], newSelectedBlock?: string) => {
    const blocksKey = newBlocks.sort().join(',')
    const selectedKey = newSelectedBlock || ''

    // 如果块列表或选中块有变化，则认为是有意义的变化
    const hasChange = blocksKey !== lastBlocksRef.current || selectedKey !== lastSelectedBlockRef.current

    if (hasChange) {
      lastBlocksRef.current = blocksKey
      lastSelectedBlockRef.current = selectedKey
    }

    return hasChange
  }, [])

  const fetchRecommendations = useCallback(async () => {
    // 如果没有块，直接返回
    if (currentBlocks.length === 0) {
      setRecommendations([])
      return
    }

    // 检查是否有实质性变化
    if (!hasSignificantChange(currentBlocks, selectedBlock)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedBlockType: selectedBlock,
          currentBlocks,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    }
    catch (error) {
      console.error('Error fetching recommendations:', error)
    }
    finally {
      setLoading(false)
    }
  }, [selectedBlock, currentBlocks, hasSignificantChange])

  // 使用防抖来避免频繁请求
  const debouncedFetchRecommendations = useCallback(() => {
    // 清除之前的定时器
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // 设置新的定时器
    debounceTimeoutRef.current = setTimeout(() => {
      void fetchRecommendations()
    }, 300) // 300ms 防抖延迟
  }, [fetchRecommendations])

  useEffect(() => {
    // 立即检查，如果没有变化就不会触发请求
    debouncedFetchRecommendations()

    // 清理定时器
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = undefined
      }
    }
  }, [debouncedFetchRecommendations])

  const handleBlockSelect = async (blockType: string) => {
    onBlockSelect(blockType)

    try {
      await fetch('/api/recommendations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block_added',
          data: { blockType },
        }),
      })
    }
    catch (error) {
      console.error('Error recording block usage:', error)
    }
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="w-80 border-l border-border bg-card/95 backdrop-blur-sm p-4 relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{t('builder.components.recommendationPanel.title')}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      {loading
        ? (
            <div className="space-y-3">
              {[...Array.from({ length: 4 })].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-20 bg-muted/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          )
        : recommendations.length > 0
          ? (
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.blockType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div
                      className="p-4 border border-border/50 rounded-lg bg-muted/30 hover:border-border hover:bg-muted/50 cursor-pointer transition-all duration-200 relative overflow-hidden"
                      onClick={() => handleBlockSelect(rec.blockType)}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${blockTypeColors[rec.blockType] || 'from-gray-500 to-gray-600'} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />

                      <div className="relative">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-foreground group-hover:text-purple-300 transition-colors">
                              {t(`builder.components.blockPicker.blocks.${rec.blockType}.label`, rec.blockType)}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {rec.reason}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                              {Math.round(rec.score * 100)}
                              %
                            </div>
                            <Plus className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rec.score * 100}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                            className={`h-1 rounded-full bg-gradient-to-r ${blockTypeColors[rec.blockType] || 'from-muted to-muted-foreground'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          : (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  {t('builder.components.recommendationPanel.emptyState')}
                </p>
              </div>
            )}

      {/* Footer tip */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg"
        >
          <p className="text-xs text-purple-300">
            {t('builder.components.recommendationPanel.tip')}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
