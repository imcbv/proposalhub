'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit3, Trash2, Save, X, Plus, TrendingUp } from 'lucide-react'
import { StatsBlock, BlockComponentProps } from './types'

interface StatsBlockProps extends Omit<BlockComponentProps, 'block'> {
  block: StatsBlock
}

export default function StatsBlockComponent({ 
  block, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: StatsBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [title, setTitle] = useState(block.title)
  const [stats, setStats] = useState(block.stats)

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...block,
        title,
        stats
      })
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(block.title)
    setStats(block.stats)
    setEditing(false)
  }

  const addStat = () => {
    setStats([...stats, { 
      label: 'New Metric', 
      value: '100%', 
      description: 'Description...' 
    }])
  }

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setStats(newStats)
  }

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index))
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
              placeholder="Statistics title..."
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-1" />
                {editing && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => removeStat(index)}
                    className="ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {editing ? (
                <div className="space-y-2">
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="Value..."
                    className="text-center font-bold text-lg"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="Label..."
                    className="text-center text-sm"
                  />
                  {stat.description && (
                    <Input
                      value={stat.description}
                      onChange={(e) => updateStat(index, 'description', e.target.value)}
                      placeholder="Description..."
                      className="text-center text-xs"
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
                  {stat.description && (
                    <div className="text-xs text-gray-600">{stat.description}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        {editing && (
          <Button 
            variant="outline" 
            onClick={addStat}
            className="w-full border-dashed mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Statistic
          </Button>
        )}
      </CardContent>
    </Card>
  )
}