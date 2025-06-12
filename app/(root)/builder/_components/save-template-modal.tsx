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
      <DialogContent className="bg-zinc-900 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Save as Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500"
              placeholder="Enter template title..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500 h-20 resize-none"
              placeholder="Describe what this template does..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500"
              disabled={isLoading}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-500"
                placeholder="Add tags..."
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600"
                disabled={isLoading}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-gray-700 text-xs rounded cursor-pointer hover:bg-gray-600"
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
            <label htmlFor="isPublic" className="text-sm">
              Make this template public (others can discover and use it)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-white text-black hover:bg-gray-100"
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
