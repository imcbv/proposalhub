export { default as TextBlock } from './TextBlock'
export { default as ServicesBlock } from './ServicesBlock'
export { default as TimelineBlock } from './TimelineBlock'
export { default as TeamBlock } from './TeamBlock'
export { default as StatsBlock } from './StatsBlock'

export * from './types'

// Block factory function
import { Block } from './types'
import TextBlockComponent from './TextBlock'
import ServicesBlockComponent from './ServicesBlock'
import TimelineBlockComponent from './TimelineBlock'
import TeamBlockComponent from './TeamBlock'
import StatsBlockComponent from './StatsBlock'

export const BlockComponents = {
  text: TextBlockComponent,
  services: ServicesBlockComponent,
  timeline: TimelineBlockComponent,
  team: TeamBlockComponent,
  stats: StatsBlockComponent,
}

export function createBlock(type: Block['type'], title: string = ''): Block {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  switch (type) {
    case 'text':
      return {
        id,
        type: 'text',
        title: title || 'Text Section',
        content: 'Enter your content here...'
      }
    case 'services':
      return {
        id,
        type: 'services',
        title: title || 'Services & Solutions',
        items: [
          { name: 'Service 1', description: 'Description of the service...' },
          { name: 'Service 2', description: 'Description of the service...' }
        ]
      }
    case 'timeline':
      return {
        id,
        type: 'timeline',
        title: title || 'Project Timeline',
        milestones: [
          { phase: 'Phase 1', duration: '3 months', deliverables: 'Key deliverables...' },
          { phase: 'Phase 2', duration: '6 months', deliverables: 'Key deliverables...' }
        ]
      }
    case 'team':
      return {
        id,
        type: 'team',
        title: title || 'Our Team',
        team: [
          { name: 'Team Member', role: 'Position', experience: 'Background and experience...' }
        ]
      }
    case 'stats':
      return {
        id,
        type: 'stats',
        title: title || 'Key Statistics',
        stats: [
          { label: 'Success Rate', value: '95%', description: 'Project success rate' },
          { label: 'Clients Served', value: '100+', description: 'Happy clients worldwide' }
        ]
      }
    default:
      throw new Error(`Unknown block type: ${type}`)
  }
}