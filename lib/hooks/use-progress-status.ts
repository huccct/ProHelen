import type { ProgressStatus } from '@/types/builder'
import { useMemo } from 'react'
import { STATUS_CONFIG } from '../constants'

export function useProgressStatus(score: number): ProgressStatus {
  return useMemo(() => {
    const statusEntries = Object.values(STATUS_CONFIG).sort((a, b) => b.threshold - a.threshold)
    const status = statusEntries.find(config => score >= config.threshold) || STATUS_CONFIG.STARTING

    return {
      status: status.status,
      color: status.color,
      bgColor: status.bgColor,
    }
  }, [score])
}
