import { useEffect } from 'react'

export function useEventHandlers(isEditing: boolean, textareaRef: React.RefObject<HTMLTextAreaElement>) {
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || !isEditing)
      return

    const stopPropagation = (e: Event) => e.stopPropagation()

    const events = [
      'wheel',
      'mousedown',
      'mousemove',
      'mouseup',
      'dragstart',
      'select',
      'selectstart',
    ]

    events.forEach((event) => {
      textarea.addEventListener(event, stopPropagation, { passive: false })
    })

    return () => {
      events.forEach((event) => {
        textarea.removeEventListener(event, stopPropagation)
      })
    }
  }, [isEditing, textareaRef])
}
