// Block types for template builder
export interface BaseBlock {
  id: string
  type: string
  title: string
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  content: string
}

export interface ServicesBlock extends BaseBlock {
  type: 'services'
  items: Array<{
    name: string
    description: string
    investment?: string
  }>
}

export interface TimelineBlock extends BaseBlock {
  type: 'timeline'
  milestones: Array<{
    phase: string
    duration: string
    deliverables: string
  }>
}

export interface TeamBlock extends BaseBlock {
  type: 'team'
  team: Array<{
    name: string
    role: string
    experience: string
  }>
}

export interface StatsBlock extends BaseBlock {
  type: 'stats'
  stats: Array<{
    label: string
    value: string
    description?: string
  }>
}

export type Block = TextBlock | ServicesBlock | TimelineBlock | TeamBlock | StatsBlock

export interface BlockComponentProps {
  block: Block
  isEditing?: boolean
  onEdit?: (block: Block) => void
  onDelete?: () => void
  className?: string
}