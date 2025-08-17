'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BlockComponents, createBlock, Block } from '@/components/blocks'
import { Plus, Save, Eye, ArrowLeft, FileText, List, Calendar, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const BLOCK_TYPES = [
  { type: 'text', label: 'Text Section', icon: FileText, description: 'Add paragraphs and content' },
  { type: 'services', label: 'Services List', icon: List, description: 'List of services or features' },
  { type: 'timeline', label: 'Timeline', icon: Calendar, description: 'Project phases and milestones' },
  { type: 'team', label: 'Team Profiles', icon: Users, description: 'Team member bios' },
  { type: 'stats', label: 'Statistics', icon: BarChart3, description: 'Key metrics and numbers' },
] as const

// Draggable Block Component
function DraggableBlock({ blockType }: { blockType: typeof BLOCK_TYPES[number] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${blockType.type}`,
  })
  
  const Icon = blockType.icon
  
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-4 border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow bg-white ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <div>
          <div className="font-medium text-gray-900">{blockType.label}</div>
          <div className="text-xs text-gray-500">{blockType.description}</div>
        </div>
      </div>
    </div>
  )
}

// Sortable Block Component (for canvas blocks)
function SortableBlock({ 
  block, 
  onEdit, 
  onDelete, 
  previewMode 
}: { 
  block: Block
  onEdit: (block: Block) => void
  onDelete: () => void
  previewMode: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const BlockComponent = BlockComponents[block.type]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50 opacity-75' : ''}`}
    >
      <BlockComponent
        block={block}
        onEdit={onEdit}
        onDelete={onDelete}
        className={previewMode ? 'pointer-events-none' : ''}
      />
      
      {/* Drag handle - positioned over the block */}
      {!previewMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded cursor-move opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center shadow-sm"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Droppable Canvas Component
function DroppableCanvas({ children, isEmpty }: { children: React.ReactNode, isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  })
  
  return (
    <div 
      ref={setNodeRef}
      className={`max-w-4xl mx-auto min-h-96 border-2 border-dashed rounded-lg p-6 bg-white transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {isEmpty ? (
        <div className="text-center py-12">
          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building</h3>
          <p className="text-gray-600">
            Drag blocks from the sidebar to start creating your template
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default function TemplateBuilderPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [templateName, setTemplateName] = useState('Custom Template')
  const [templateDescription, setTemplateDescription] = useState('Built with template builder')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      return
    }
    
    // Dragging from sidebar to canvas
    if (typeof active.id === 'string' && active.id.startsWith('sidebar-') && over.id === 'canvas') {
      const blockType = active.id.replace('sidebar-', '') as Block['type']
      const newBlock = createBlock(blockType)
      setBlocks(prev => [...prev, newBlock])
    }
    
    // Reordering blocks within canvas
    if (active.id !== over.id && !active.id.toString().startsWith('sidebar-')) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex(block => block.id === active.id)
        const newIndex = blocks.findIndex(block => block.id === over.id)
        
        return arrayMove(blocks, oldIndex, newIndex)
      })
    }
    
    setActiveId(null)
  }

  const handleBlockEdit = (blockId: string, updatedBlock: Block) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? updatedBlock : block
    ))
  }

  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId))
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    if (blocks.length === 0) {
      alert('Please add at least one block to your template')
      return
    }

    try {
      // Generate a unique template ID
      const templateId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Convert blocks to the template format
      const templateContent = {
        hero: {
          title: templateName,
          subtitle: templateDescription
        },
        sections: blocks.map(block => {
          switch (block.type) {
            case 'text':
              return {
                id: block.id,
                title: block.title,
                content: block.content
              }
            case 'services':
              return {
                id: block.id,
                title: block.title,
                items: block.items
              }
            case 'timeline':
              return {
                id: block.id,
                title: block.title,
                milestones: block.milestones
              }
            case 'team':
              return {
                id: block.id,
                title: block.title,
                team: block.team
              }
            case 'stats':
              return {
                id: block.id,
                title: block.title,
                stats: block.stats
              }
            default:
              return {
                id: block.id,
                title: block.title,
                content: 'Content not supported'
              }
          }
        })
      }

      // Save to database
      const { error } = await supabase
        .from('templates')
        .insert({
          id: templateId,
          name: templateName,
          description: templateDescription,
          category: 'Custom',
          preview_image: null,
          default_content: templateContent,
          is_active: true
        })

      if (error) {
        console.error('Error saving template:', error)
        alert('Error saving template: ' + error.message)
      } else {
        alert('Template saved successfully! You can now use it to create proposals.')
        // Optionally redirect to create page to show the new template
        // router.push('/create')
      }
    } catch (error) {
      console.error('Unexpected error saving template:', error)
      alert('Unexpected error occurred while saving template')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 flex">
        
        {/* Left Sidebar - Block Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <Link href="/create" className="text-blue-600 hover:underline text-sm mb-4 block">
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Back to Templates
            </Link>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Template Builder</h2>
            <p className="text-sm text-gray-600">Drag blocks to build your template</p>
          </div>
          
          <div className="flex-1 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Content Blocks</h3>
            <div className="space-y-3">
              {BLOCK_TYPES.map((blockType) => (
                <DraggableBlock key={blockType.type} blockType={blockType} />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="font-semibold text-lg w-64"
                  placeholder="Template name..."
                />
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleSaveTemplate}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {previewMode ? (
              /* Preview Mode - Clean view without editing controls */
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
                <div className="p-8 space-y-8">
                  <div className="text-center border-b pb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{templateName}</h1>
                    <p className="text-gray-600">{templateDescription}</p>
                  </div>
                  {blocks.map((block) => {
                    const BlockComponent = BlockComponents[block.type]
                    return (
                      <div key={block.id} className="proposal-section">
                        <BlockComponent
                          block={block}
                          onEdit={() => {}}
                          onDelete={() => {}}
                          className="pointer-events-none"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Edit Mode - With drag/drop and editing controls */
              <DroppableCanvas isEmpty={blocks.length === 0}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-6">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        onEdit={(updatedBlock) => handleBlockEdit(block.id, updatedBlock)}
                        onDelete={() => handleBlockDelete(block.id)}
                        previewMode={previewMode}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DroppableCanvas>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties (for future) */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Template Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="templateDescription">Description</Label>
              <Input
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Template Stats</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Blocks: {blocks.length}</div>
                <div>Type: Custom</div>
                <div>Category: Professional</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && activeId.startsWith('sidebar-') && (
          <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-lg opacity-90">
            <div className="font-medium text-gray-900">
              {BLOCK_TYPES.find(bt => bt.type === activeId.replace('sidebar-', ''))?.label}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}