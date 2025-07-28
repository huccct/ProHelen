'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderStore } from '@/store/builder'
import { useReactFlow, useViewport } from '@xyflow/react'
import {
  Maximize,
  Minimize,
  Redo2,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmClearModal } from './confirm-clear-modal'
import { ProgressIndicator } from './progress-indicator'

interface ToolbarProps {
  className?: string
}

export function Toolbar({ className }: ToolbarProps) {
  const { t } = useTranslation()
  const { zoomIn, zoomOut, setViewport } = useReactFlow()
  const resetFlow = useBuilderStore(state => state.resetFlow)
  const undo = useBuilderStore(state => state.undo)
  const redo = useBuilderStore(state => state.redo)
  const canUndo = useBuilderStore(state => state.canUndo())
  const canRedo = useBuilderStore(state => state.canRedo())
  const { zoom, x, y } = useViewport()
  const currentZoom = Math.round(zoom * 100)
  const [zoomInput, setZoomInput] = useState(currentZoom.toString())
  const [showClearModal, setShowClearModal] = useState(false)

  const handleUndo = () => {
    if (canUndo) {
      undo()
      toast.success(t('builder.components.toolbar.undone'))
    }
  }

  const handleRedo = () => {
    if (canRedo) {
      redo()
      toast.success(t('builder.components.toolbar.redone'))
    }
  }

  const handleZoomIn = () => {
    zoomIn()
  }

  const handleZoomOut = () => {
    zoomOut()
  }

  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
        toast.success(t('builder.components.toolbar.enteredFullscreen'))
      }
      else {
        await document.exitFullscreen()
        setIsFullscreen(false)
        toast.success(t('builder.components.toolbar.exitedFullscreen'))
      }
    }
    catch {
      toast.error(t('builder.components.toolbar.fullscreenNotSupported'))
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleClear = () => {
    setShowClearModal(true)
  }

  const handleConfirmClear = () => {
    resetFlow()
    toast.success(t('builder.components.toolbar.canvasCleared'))
  }

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomInput(e.target.value)
  }

  const handleZoomInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newZoom = Number.parseInt(zoomInput)
    if (Number.isNaN(newZoom) || newZoom < 10 || newZoom > 500) {
      toast.error(t('builder.components.toolbar.zoomError'))
      setZoomInput(currentZoom.toString())
      return
    }
    setViewport({ x, y, zoom: newZoom / 100 })
  }

  const handleZoomInputBlur = () => {
    setZoomInput(currentZoom.toString())
  }

  useEffect(() => {
    setZoomInput(currentZoom.toString())
  }, [currentZoom])

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b border-border bg-background ${className}`} data-tour="toolbar">
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={!canUndo}
              className={`h-8 w-8 p-0 ${
                canUndo
                  ? 'text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer'
                  : 'text-muted-foreground/50 cursor-not-allowed opacity-50'
              }`}
            >
              <Undo2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('builder.components.toolbar.undo')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('builder.components.toolbar.shortcuts.ctrlZ')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={!canRedo}
              className={`h-8 w-8 p-0 ${
                canRedo
                  ? 'text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer'
                  : 'text-muted-foreground/50 cursor-not-allowed opacity-50'
              }`}
            >
              <Redo2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('builder.components.toolbar.redo')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('builder.components.toolbar.shortcuts.ctrlY')}</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-border mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-muted-foreground hover:text-red-400 hover:bg-muted h-8 w-8 p-0 cursor-pointer"
          title={t('builder.components.toolbar.clearCanvas')}
        >
          <Trash2 size={16} />
        </Button>

      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 cursor-pointer"
          title={t('builder.components.toolbar.zoomOut')}
        >
          <ZoomOut size={16} />
        </Button>
        <form onSubmit={handleZoomInputSubmit} className="flex items-center">
          <input
            type="text"
            value={zoomInput}
            onChange={handleZoomInputChange}
            onBlur={handleZoomInputBlur}
            className="w-12 text-sm text-muted-foreground bg-transparent text-center border-none focus:outline-none focus:text-foreground"
            style={{ width: '45px' }}
          />
          <span className="text-sm text-muted-foreground">%</span>
        </form>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 cursor-pointer"
          title={t('builder.components.toolbar.zoomIn')}
        >
          <ZoomIn size={16} />
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        <ProgressIndicator />

        <div className="h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleFullscreen}
          className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 cursor-pointer"
          title={t('builder.components.toolbar.fullscreen')}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </Button>
      </div>

      <ConfirmClearModal
        open={showClearModal}
        onOpenChange={setShowClearModal}
        onConfirm={handleConfirmClear}
      />
    </div>
  )
}
