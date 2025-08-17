'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Trash2, Save, X } from 'lucide-react'
import { TextBlock, BlockComponentProps } from './types'

interface TextBlockProps extends Omit<BlockComponentProps, 'block'> {
  block: TextBlock
}

export default function TextBlockComponent({ 
  block, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: TextBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [title, setTitle] = useState(block.title)
  const [content, setContent] = useState(block.content)

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...block,
        title,
        content
      })
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(block.title)
    setContent(block.content)
    setEditing(false)
  }

  return (
    <Card className={`group hover:shadow-md transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold text-lg"
              placeholder="Section title..."
            />
          ) : (
            <h3 className="font-semibold text-lg text-gray-900">{block.title}</h3>
          )}
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {editing ? (
              <>
                <Button size="sm" variant="outline" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Edit3 className="w-4 h-4" />
                </Button>
                {onDelete && (
                  <Button size="sm" variant="outline" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {editing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here..."
            className="min-h-[100px] resize-none"
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">{block.content}</p>
        )}
      </CardContent>
    </Card>
  )
}