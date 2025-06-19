'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'

interface SaveInstructionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (instructionData: InstructionFormData) => void
  isLoading?: boolean
  initialTitle?: string
  initialDescription?: string
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

export function SaveInstructionModal({ open, onOpenChange, onSave, isLoading, initialTitle = '', initialDescription = '' }: SaveInstructionModalProps) {
  const [formData, setFormData] = useState<InstructionFormData>({
    title: initialTitle,
    description: initialDescription,
    category: 'General',
    tags: [],
    isFavorite: false,
  })
  const [tagInput, setTagInput] = useState('')

  // Update form data when modal opens or initial values change
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        title: initialTitle,
        description: initialDescription,
      }))
    }
  }, [open, initialTitle, initialDescription])

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
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Save Instruction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter instruction title..."
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-card border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this instruction does..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-card border-border text-foreground resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-foreground hover:bg-muted">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-foreground">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-card border-border text-foreground flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="cursor-pointer"
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-card text-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1 border border-border"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground ml-1"
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
              className="rounded border-border bg-card"
            />
            <Label htmlFor="favorite" className="text-foreground text-sm">
              Add to favorites
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {isLoading ? 'Saving...' : 'Save Instruction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
