/** drag resize preview */
import { useCallback, useEffect, useState } from 'react'
import { PREVIEW_CONSTRAINTS } from '../constants'

export function usePreviewResize(initialWidth = PREVIEW_CONSTRAINTS.DEFAULT_WIDTH) {
  const [previewWidth, setPreviewWidth] = useState<number>(initialWidth)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => setIsDragging(true), [])
  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging)
      return

    const newWidth = window.innerWidth - e.clientX
    setPreviewWidth(Math.max(
      PREVIEW_CONSTRAINTS.MIN_WIDTH,
      Math.min(PREVIEW_CONSTRAINTS.MAX_WIDTH, newWidth),
    ))
  }, [isDragging])

  useEffect(() => {
    if (!isDragging)
      return

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    previewWidth,
    isDragging,
    handleMouseDown,
  }
}
