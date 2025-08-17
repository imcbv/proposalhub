'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Trash2, Save, X, Plus } from 'lucide-react'
import { ServicesBlock, BlockComponentProps } from './types'

interface ServicesBlockProps extends Omit<BlockComponentProps, 'block'> {
  block: ServicesBlock
}

export default function ServicesBlockComponent({ 
  block, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: ServicesBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [title, setTitle] = useState(block.title)
  const [items, setItems] = useState(block.items)

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...block,
        title,
        items
      })
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(block.title)
    setItems(block.items)
    setEditing(false)
  }

  const addItem = () => {
    setItems([...items, { name: 'New Service', description: 'Description here...' }])
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
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
      
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                {editing ? (
                  <>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Service name..."
                      className="font-medium"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Service description..."
                      className="text-sm"
                    />
                    {item.investment && (
                      <Input
                        value={item.investment}
                        onChange={(e) => updateItem(index, 'investment', e.target.value)}
                        placeholder="Investment amount..."
                        className="text-sm"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    {item.investment && (
                      <div className="text-sm font-medium text-blue-600">{item.investment}</div>
                    )}
                  </>
                )}
              </div>
              
              {editing && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => removeItem(index)}
                  className="ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {editing && (
          <Button 
            variant="outline" 
            onClick={addItem}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        )}
      </CardContent>
    </Card>
  )
}