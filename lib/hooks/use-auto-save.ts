/** auto save */
import { useEffect, useRef } from 'react'

export function useAutoSave(hasPendingChanges: boolean, isExistingContent: boolean, saveDraft: () => Promise<void>) {
  const hasChangesRef = useRef(hasPendingChanges)
  const isExistingRef = useRef(isExistingContent)

  useEffect(() => {
    hasChangesRef.current = hasPendingChanges
    isExistingRef.current = isExistingContent
  }, [hasPendingChanges, isExistingContent])

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (hasChangesRef.current && !isExistingRef.current) {
        await saveDraft()
      }
    }

    const handleUnload = () => {
      if (hasChangesRef.current && !isExistingRef.current) {
        return ''
      }
      return null
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.onbeforeunload = handleUnload

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.onbeforeunload = null
    }
  }, [saveDraft])
}
