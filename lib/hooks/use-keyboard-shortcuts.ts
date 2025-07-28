/** keyboard shortcuts */
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { KEYBOARD_SHORTCUTS } from '../constants'

export function useKeyboardShortcuts({
  onShowHelp,
  onHideModals,
  undo,
  redo,
  canUndo,
  canRedo,
}: {
  onShowHelp: () => void
  onHideModals: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 for help
      if (e.key === KEYBOARD_SHORTCUTS.HELP) {
        e.preventDefault()
        onShowHelp()
        return
      }

      // Escape to close modals
      if (e.key === KEYBOARD_SHORTCUTS.ESCAPE) {
        onHideModals()
        return
      }

      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === KEYBOARD_SHORTCUTS.UNDO && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) {
          undo()
          Sentry.addBreadcrumb({
            category: 'user-action',
            message: 'Undo operation',
            level: 'info',
          })
        }
        return
      }

      // Ctrl+Y for redo (or Ctrl+Shift+Z)
      if ((e.ctrlKey && e.key === KEYBOARD_SHORTCUTS.REDO) || (e.ctrlKey && e.shiftKey && e.key === KEYBOARD_SHORTCUTS.UNDO)) {
        e.preventDefault()
        if (canRedo()) {
          redo()
          Sentry.addBreadcrumb({
            category: 'user-action',
            message: 'Redo operation',
            level: 'info',
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onShowHelp, onHideModals, undo, redo, canUndo, canRedo])
}
