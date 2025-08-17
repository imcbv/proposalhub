'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Trash2, Save, X, Plus } from 'lucide-react'
import { TimelineBlock, BlockComponentProps } from './types'

interface TimelineBlockProps extends Omit<BlockComponentProps, 'block'> {
  block: TimelineBlock
}

export default function TimelineBlockComponent({ 
  block, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: TimelineBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [title, setTitle] = useState(block.title)
  const [milestones, setMilestones] = useState(block.milestones)

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...block,
        title,
        milestones
      })
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(block.title)
    setMilestones(block.milestones)
    setEditing(false)
  }

  const addMilestone = () => {
    setMilestones([...milestones, { 
      phase: 'New Phase', 
      duration: '3 months', 
      deliverables: 'Key deliverables...' 
    }])
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...milestones]
    newMilestones[index] = { ...newMilestones[index], [field]: value }
    setMilestones(newMilestones)
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
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
              placeholder="Timeline title..."
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
        <div className="relative">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-start space-x-4 pb-6 last:pb-0">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="border rounded-lg p-4 bg-gray-50">
                  {editing ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={milestone.phase}
                          onChange={(e) => updateMilestone(index, 'phase', e.target.value)}
                          placeholder="Phase name..."
                          className="font-medium"
                        />
                        <Input
                          value={milestone.duration}
                          onChange={(e) => updateMilestone(index, 'duration', e.target.value)}
                          placeholder="Duration..."
                          className="w-32"
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => removeMilestone(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={milestone.deliverables}
                        onChange={(e) => updateMilestone(index, 'deliverables', e.target.value)}
                        placeholder="Key deliverables..."
                        className="text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{milestone.phase}</h4>
                        <span className="text-sm text-blue-600 font-medium">{milestone.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600">{milestone.deliverables}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {editing && (
          <Button 
            variant="outline" 
            onClick={addMilestone}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        )}
      </CardContent>
    </Card>
  )
}