'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { pharmaTemplates } from '@/lib/templates'
import { Template } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function CreatePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [allTemplates, setAllTemplates] = useState<Template[]>([])
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Load custom templates from database
      const { data: customTemplates, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.log('Using default templates only:', error.message)
        setAllTemplates(pharmaTemplates)
      } else {
        // Combine hardcoded templates with custom templates
        const dbTemplates = customTemplates?.map(template => ({
          id: template.id,
          name: template.name,
          description: template.description || '',
          category: template.category || 'Custom',
          preview_image: template.preview_image || '',
          is_active: template.is_active,
          default_content: template.default_content
        })) || []
        
        console.log(`Loaded ${dbTemplates.length} custom templates`)
        setAllTemplates([...pharmaTemplates, ...dbTemplates])
      }
      
      setLoading(false)
    }

    loadData()
  }, [router])

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Create New Proposal</h1>
              <p className="text-gray-600">Choose a template to get started</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Template Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Templates</h2>
          <p className="text-gray-600 mb-6">
            Choose from professional templates or your custom templates created with the builder
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTemplates.map((template) => (
              <Link key={template.id} href={`/create/${template.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                      <Badge variant="secondary" className="mb-3">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {template.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  {/* Template Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/5"></div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <div className="h-6 bg-blue-100 rounded w-16"></div>
                        <div className="h-6 bg-green-100 rounded w-20"></div>
                      </div>
                    </div>
                  </div>

                  {/* Template Features */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Includes:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {template.default_content.sections?.slice(0, 3).map((section: any, index: number) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          {section.title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full group-hover:bg-blue-700">
                    Use This Template
                  </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Custom Template Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Template Builder</h3>
            <p className="text-gray-600 mb-4">
              Use our visual drag-and-drop builder to create custom templates
            </p>
            <Link href="/create/builder">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Launch Builder
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Start from Scratch</h3>
            <p className="text-gray-600 mb-4">
              Create a basic proposal without using a template
            </p>
            <Link href="/create/blank-template/form">
              <Button variant="outline">
                Create Blank Proposal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}