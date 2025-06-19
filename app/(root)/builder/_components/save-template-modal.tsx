'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'

interface SaveTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (templateData: TemplateFormData) => void
  isLoading?: boolean
}

export interface TemplateFormData {
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
}

const categories = [
  'Goal Setting',
  'Education',
  'Career',
  'Productivity',
  'Communication',
  'Planning',
  'Other',
]

export function SaveTemplateModal({ open, onOpenChange, onSave, isLoading }: SaveTemplateModalProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    description: '',
    category: 'Other',
    tags: [],
    isPublic: false,
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description')
      return
    }

    onSave(formData)
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Save as Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80"
              placeholder="Enter template title..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80 h-20 resize-none"
              placeholder="Describe what this template does..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80"
              disabled={isLoading}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80"
                placeholder="Add tags..."
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-muted hover:bg-muted/80"
                disabled={isLoading}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-muted text-xs rounded cursor-pointer hover:bg-muted/80"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  {' '}
                  ×
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={e => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="w-4 h-4"
              disabled={isLoading}
            />
            <label htmlFor="isPublic" className="text-sm text-foreground">
              Make this template public (others can discover and use it)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
