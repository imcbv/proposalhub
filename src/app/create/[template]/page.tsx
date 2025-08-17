'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { pharmaTemplates } from '@/lib/templates'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function TemplatePreviewPage() {
  const [user, setUser] = useState<any>(null)
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  
  const templateId = params.template as string

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // First check hardcoded templates
      let foundTemplate = pharmaTemplates.find(t => t.id === templateId)
      
      // If not found, check database
      if (!foundTemplate) {
        const { data: dbTemplate, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .eq('is_active', true)
          .single()

        if (!error && dbTemplate) {
          foundTemplate = {
            id: dbTemplate.id,
            name: dbTemplate.name,
            description: dbTemplate.description || '',
            category: dbTemplate.category || 'Custom',
            preview_image: dbTemplate.preview_image || '',
            is_active: dbTemplate.is_active,
            default_content: dbTemplate.default_content
          }
        }
      }
      
      setTemplate(foundTemplate)
      setLoading(false)
    }

    loadData()
  }, [router, templateId])

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

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Template Not Found</h2>
          <Link href="/create">
            <Button>Back to Templates</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/create" className="text-blue-600 hover:underline text-sm">
                ← Back to Templates
              </Link>
              <div className="flex items-center mt-2 space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <p className="text-gray-600">{template.description}</p>
            </div>
            <Link href={`/create/${templateId}/form`}>
              <Button size="lg">
                Use This Template
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Preview */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Hero Section Preview */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg mb-6">
                  <h2 className="text-2xl font-bold mb-2">{template.default_content.hero.title}</h2>
                  <p className="text-blue-100">{template.default_content.hero.subtitle}</p>
                </div>

                {/* Sections Preview */}
                <div className="space-y-6">
                  {template.default_content.sections?.map((section: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {section.content || 'Content section with rich formatting and interactive elements'}
                      </p>
                      
                      {/* Show items/services if available */}
                      {section.items && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {section.items.slice(0, 4).map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-center text-xs">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                <span className="font-medium">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Show timeline if available */}
                      {section.milestones && (
                        <div className="bg-green-50 rounded p-3">
                          <div className="grid grid-cols-2 gap-2">
                            {section.milestones.slice(0, 4).map((milestone: any, mIndex: number) => (
                              <div key={mIndex} className="text-xs">
                                <div className="font-medium text-green-800">{milestone.milestone || milestone.phase}</div>
                                <div className="text-green-600">{milestone.timeline || milestone.duration}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Call to Action Preview */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                  <h3 className="font-semibold mb-2">Ready to Move Forward?</h3>
                  <div className="flex justify-center space-x-3">
                    <div className="px-4 py-2 bg-green-600 text-white text-sm rounded">Accept Proposal</div>
                    <div className="px-4 py-2 bg-gray-600 text-white text-sm rounded">Request Changes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Professional pharma industry design
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Interactive client engagement
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time analytics tracking
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Mobile responsive layout
                  </li>
                  <li className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Fully customizable content
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {template.default_content.sections?.map((section: any, index: number) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {section.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Link href={`/create/${templateId}/form`}>
                  <Button className="w-full" size="lg">
                    Start Creating Proposal
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Customize content and add client details
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}