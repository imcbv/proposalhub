'use client'

import { useState } from 'react'
import { TextBlock, ServicesBlock, TimelineBlock, TeamBlock, StatsBlock, createBlock, BlockComponents } from '@/components/blocks'

export default function TestBlocksPage() {
  const [blocks, setBlocks] = useState([
    createBlock('text', 'Sample Text Block'),
    createBlock('services', 'Our Services'),
    createBlock('timeline', 'Project Timeline'),
    createBlock('team', 'Meet the Team'),
    createBlock('stats', 'Key Metrics')
  ])

  const handleBlockEdit = (blockId: string, updatedBlock: any) => {
    console.log('Block edited:', blockId, updatedBlock)
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId ? updatedBlock : block
      )
    )
  }

  const handleBlockDelete = (blockId: string) => {
    console.log('Block deleted:', blockId)
    setBlocks(prevBlocks => 
      prevBlocks.filter(block => block.id !== blockId)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Block Components Test</h1>
        
        <div className="space-y-6">
          {blocks.map((block) => {
            const BlockComponent = BlockComponents[block.type]
            return (
              <BlockComponent
                key={block.id}
                block={block}
                onEdit={(updatedBlock) => handleBlockEdit(block.id, updatedBlock)}
                onDelete={() => handleBlockDelete(block.id)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}