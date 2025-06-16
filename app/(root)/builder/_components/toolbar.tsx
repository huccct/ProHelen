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
import { toast } from 'sonner'
import { ConfirmClearModal } from './confirm-clear-modal'

interface ToolbarProps {
  className?: string
}

export function Toolbar({ className }: ToolbarProps) {
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
      toast.success('Undone')
    }
  }

  const handleRedo = () => {
    if (canRedo) {
      redo()
      toast.success('Redone')
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
        toast.success('Entered fullscreen mode')
      }
      else {
        await document.exitFullscreen()
        setIsFullscreen(false)
        toast.success('Exited fullscreen mode')
      }
    }
    catch {
      toast.error('Fullscreen not supported')
    }
  }

  // Listen for fullscreen changes
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
    toast.success('Canvas cleared')
  }

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomInput(e.target.value)
  }

  const handleZoomInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newZoom = Number.parseInt(zoomInput)
    if (Number.isNaN(newZoom) || newZoom < 10 || newZoom > 500) {
      toast.error('Please enter a zoom value between 10% and 500%')
      setZoomInput(currentZoom.toString())
      return
    }
    setViewport({ x, y, zoom: newZoom / 100 })
  }

  const handleZoomInputBlur = () => {
    setZoomInput(currentZoom.toString())
  }

  // Sync input value with current zoom when zoom changes externally
  useEffect(() => {
    setZoomInput(currentZoom.toString())
  }, [currentZoom])

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-black ${className}`} data-tour="toolbar">
      {/* Left section - Edit actions */}
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
                  ? 'text-gray-400 hover:text-white hover:bg-zinc-800 cursor-pointer'
                  : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <Undo2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo last action</p>
            <p className="text-xs text-gray-300 mt-1">Ctrl+Z</p>
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
                  ? 'text-gray-400 hover:text-white hover:bg-zinc-800 cursor-pointer'
                  : 'text-gray-600 cursor-not-allowed opacity-50'
              }`}
            >
              <Redo2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo last action</p>
            <p className="text-xs text-gray-300 mt-1">Ctrl+Y</p>
          </TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-gray-800 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-red-400 hover:bg-zinc-800 h-8 w-8 p-0 cursor-pointer"
          title="Clear canvas"
        >
          <Trash2 size={16} />
        </Button>

      </div>

      {/* Center section - View controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0 cursor-pointer"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </Button>
        <form onSubmit={handleZoomInputSubmit} className="min-w-[50px]">
          <input
            type="text"
            value={zoomInput}
            onChange={handleZoomInputChange}
            onBlur={handleZoomInputBlur}
            className="w-12 text-sm text-gray-400 bg-transparent text-center border-none focus:outline-none focus:text-white"
            placeholder="100"
          />
          <span className="text-sm text-gray-400">%</span>
        </form>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0 cursor-pointer"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleFullscreen}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0 cursor-pointer"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </Button>

      </div>

      {/* Right section - placeholder for future tools */}
      <div className="flex items-center space-x-2">
        {/* Export and Test functions are available in the right panel */}
      </div>

      {/* Confirm Clear Modal */}
      <ConfirmClearModal
        open={showClearModal}
        onOpenChange={setShowClearModal}
        onConfirm={handleConfirmClear}
      />
    </div>
  )
}
