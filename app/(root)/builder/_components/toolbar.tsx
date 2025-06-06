'use client'

import { Button } from '@/components/ui/button'
import {
  Download,
  Grid3X3,
  Maximize2,
  Play,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { toast } from 'sonner'

interface ToolbarProps {
  className?: string
}

export function Toolbar({ className }: ToolbarProps) {
  const handleUndo = () => {
    toast.info('Undo action')
    // TODO: 实现撤销逻辑
  }

  const handleRedo = () => {
    toast.info('Redo action')
    // TODO: 实现重做逻辑
  }

  const handleZoomIn = () => {
    toast.info('Zoom in')
    // TODO: 实现放大逻辑
  }

  const handleZoomOut = () => {
    toast.info('Zoom out')
    // TODO: 实现缩小逻辑
  }

  const handleFitToScreen = () => {
    toast.info('Fit to screen')
    // TODO: 实现适应屏幕逻辑
  }

  const handleToggleGrid = () => {
    toast.info('Toggle grid')
    // TODO: 实现网格切换逻辑
  }

  const handleClear = () => {
    toast.info('Clear canvas')
    // TODO: 实现清空画布逻辑
  }

  const handleAutoLayout = () => {
    toast.info('Auto layout')
    // TODO: 实现自动布局逻辑
  }

  const handleExport = () => {
    toast.info('Export')
    // TODO: 实现导出逻辑
  }

  const handleTest = () => {
    toast.info('Test prompt')
    // TODO: 实现测试逻辑
  }

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-black ${className}`}>
      {/* Left section - Edit actions */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </Button>

        <div className="h-4 w-px bg-gray-800 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-red-400 hover:bg-zinc-800 h-8 w-8 p-0"
          title="Clear canvas"
        >
          <Trash2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAutoLayout}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
          title="Auto layout"
        >
          <RotateCcw size={16} />
        </Button>
      </div>

      {/* Center section - View controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </Button>
        <span className="text-sm text-gray-400 px-2 min-w-[50px] text-center">100%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFitToScreen}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
          title="Fit to screen"
        >
          <Maximize2 size={16} />
        </Button>

        <div className="h-4 w-px bg-gray-800 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleGrid}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0"
          title="Toggle grid"
        >
          <Grid3X3 size={16} />
        </Button>
      </div>

      {/* Right section - Export and test */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTest}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 px-3"
          title="Test prompt"
        >
          <Play size={16} className="mr-1" />
          Test
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="text-gray-400 hover:text-white hover:bg-zinc-800 h-8 px-3"
          title="Export"
        >
          <Download size={16} className="mr-1" />
          Export
        </Button>
      </div>
    </div>
  )
}
