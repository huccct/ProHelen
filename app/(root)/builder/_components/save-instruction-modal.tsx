'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface SaveInstructionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (instructionData: InstructionFormData) => void
  isLoading?: boolean
}

export interface InstructionFormData {
  title: string
  description: string
  category: string
  tags: string[]
  isFavorite: boolean
}

const categories = [
  'General',
  'Academic',
  'Writing',
  'Programming',
  'Data Analysis',
  'Creative',
  'Productivity',
  'Research',
  'Education',
  'Business',
]

export function SaveInstructionModal({ open, onOpenChange, onSave, isLoading }: SaveInstructionModalProps) {
  const [formData, setFormData] = useState<InstructionFormData>({
    title: '',
    description: '',
    category: 'General',
    tags: [],
    isFavorite: false,
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim())
      return
    onSave(formData)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Save Instruction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter instruction title..."
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this instruction does..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-zinc-800 border-zinc-700 text-white resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-zinc-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-zinc-800 border-zinc-700 text-white flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-zinc-800 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-400 hover:text-white ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={e => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
              className="rounded border-zinc-700 bg-zinc-800"
            />
            <Label htmlFor="favorite" className="text-white text-sm">
              Add to favorites
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="bg-white text-black hover:bg-gray-100"
            >
              {isLoading ? 'Saving...' : 'Save Instruction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
