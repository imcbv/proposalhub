'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Trash2, Save, X, Plus, User } from 'lucide-react'
import { TeamBlock, BlockComponentProps } from './types'

interface TeamBlockProps extends Omit<BlockComponentProps, 'block'> {
  block: TeamBlock
}

export default function TeamBlockComponent({ 
  block, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: TeamBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [title, setTitle] = useState(block.title)
  const [team, setTeam] = useState(block.team)

  const handleSave = () => {
    if (onEdit) {
      onEdit({
        ...block,
        title,
        team
      })
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(block.title)
    setTeam(block.team)
    setEditing(false)
  }

  const addTeamMember = () => {
    setTeam([...team, { 
      name: 'Team Member', 
      role: 'Position', 
      experience: 'Background and experience...' 
    }])
  }

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newTeam = [...team]
    newTeam[index] = { ...newTeam[index], [field]: value }
    setTeam(newTeam)
  }

  const removeTeamMember = (index: number) => {
    setTeam(team.filter((_, i) => i !== index))
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
              placeholder="Team section title..."
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
        <div className="grid gap-4 md:grid-cols-2">
          {team.map((member, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex-1 space-y-2">
                  {editing ? (
                    <>
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        placeholder="Name..."
                        className="font-medium"
                      />
                      <Input
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                        placeholder="Role/Position..."
                        className="text-sm"
                      />
                      <Textarea
                        value={member.experience}
                        onChange={(e) => updateTeamMember(index, 'experience', e.target.value)}
                        placeholder="Experience and background..."
                        className="text-sm"
                      />
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                      <p className="text-xs text-gray-600">{member.experience}</p>
                    </>
                  )}
                </div>
                
                {editing && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => removeTeamMember(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {editing && (
          <Button 
            variant="outline" 
            onClick={addTeamMember}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        )}
      </CardContent>
    </Card>
  )
}