'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ProposalViewPage() {
  const [user, setUser] = useState<any>(null)
  const [proposal, setProposal] = useState<any>(null)
  const [proposalProducts, setProposalProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  
  const proposalId = params.id as string

  useEffect(() => {
    async function loadData() {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }
        
        setUser(user)

        // Get proposal
        const { data: proposalData, error: proposalError } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', proposalId)
          .single()

        if (proposalError) {
          setError('Proposal not found')
        } else if (proposalData.user_id !== user.id) {
          setError('Access denied')
        } else {
          setProposal(proposalData)
          
          // Load proposal products
          const { data: productsData, error: productsError } = await supabase
            .from('proposal_products')
            .select(`
              *,
              products (*)
            `)
            .eq('proposal_id', proposalId)

          if (productsError) {
            console.error('Error loading proposal products:', productsError)
          } else {
            setProposalProducts(productsData || [])
          }
        }
      } catch (err) {
        setError('Failed to load proposal')
      } finally {
        setLoading(false)
      }
    }

    if (proposalId) {
      loadData()
    }
  }, [proposalId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading proposal...</div>
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{error || 'Proposal not found'}</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'viewed': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <div className="flex items-center mt-2 space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
                <Badge className={getStatusColor(proposal.status)}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>Client: {proposal.client_name}</span>
                {proposal.client_company && <span>• {proposal.client_company}</span>}
                <span>• Created {new Date(proposal.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">Edit Proposal</Button>
              <Button>Share with Client</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg mb-8">
                  <h2 className="text-3xl font-bold mb-3">
                    {proposal.content.hero?.title || proposal.title}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {proposal.content.hero?.subtitle || 'Professional proposal tailored for your needs'}
                  </p>
                  <div className="mt-4">
                    <span className="bg-blue-500 px-3 py-1 rounded text-sm">
                      For: {proposal.client_name}
                    </span>
                    {proposal.client_company && (
                      <span className="bg-blue-500 px-3 py-1 rounded text-sm ml-2">
                        {proposal.client_company}
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom Project Description */}
                {proposal.content.project_description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Project Overview</h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {proposal.content.project_description}
                    </p>
                  </div>
                )}

                {/* Template Sections */}
                {proposal.content.sections?.map((section: any, index: number) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                    
                    {section.content && (
                      <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
                    )}

                    {/* Services/Items */}
                    {section.items && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {section.items.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            {item.investment && (
                              <div className="text-sm font-medium text-green-600">
                                Investment: {item.investment}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timeline/Milestones */}
                    {section.milestones && (
                      <div className="space-y-3 mb-4">
                        {section.milestones.map((milestone: any, mIndex: number) => (
                          <div key={mIndex} className="flex items-center space-x-4 bg-green-50 p-3 rounded-lg">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {mIndex + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{milestone.milestone || milestone.phase}</div>
                              <div className="text-sm text-gray-600">
                                {milestone.timeline || milestone.duration}
                                {milestone.payment && ` • ${milestone.payment}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Team profiles */}
                    {section.team && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {section.team.map((member: any, teamIndex: number) => (
                          <div key={teamIndex} className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900">{member.name}</h4>
                            <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                            <p className="text-sm text-gray-600">{member.experience}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Selected Products/Services */}
                {proposalProducts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Selected Services & Investment</h3>
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                          <div className="col-span-6">Service</div>
                          <div className="col-span-2 text-center">Quantity</div>
                          <div className="col-span-4 text-right">Investment</div>
                        </div>
                      </div>
                      
                      <div className="divide-y">
                        {proposalProducts.map((pp: any, index: number) => (
                          <div key={index} className="px-4 py-4">
                            <div className="grid grid-cols-12 gap-4 items-start">
                              <div className="col-span-6 flex items-start space-x-3">
                                {pp.products.image_url && (
                                  <img 
                                    src={pp.products.image_url} 
                                    alt={pp.products.name}
                                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                                  />
                                )}
                                <div>
                                  <h4 className="font-semibold text-gray-900">{pp.products.name}</h4>
                                  {pp.products.category && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      {pp.products.category}
                                    </Badge>
                                  )}
                                  {pp.products.description && (
                                    <p className="text-sm text-gray-600 mt-1">{pp.products.description}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="col-span-2 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                  {pp.quantity}
                                </span>
                              </div>
                              
                              <div className="col-span-4 text-right">
                                <div className="text-lg font-semibold text-green-600">
                                  {pp.custom_price || pp.products.price_range || 'Contact for pricing'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 px-4 py-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Total Services: {proposalProducts.length}
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            Comprehensive Package Solution
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 text-green-600 mt-0.5">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">Complete Service Package</h4>
                          <p className="text-sm text-green-700">
                            All selected services are designed to work together seamlessly, 
                            providing you with comprehensive support throughout your project lifecycle.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-semibold mb-4">Ready to Move Forward?</h3>
                  <p className="text-gray-600 mb-6">
                    We're excited to partner with {proposal.client_company || proposal.client_name} on this important initiative.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Accept Proposal
                    </Button>
                    <Button variant="outline">
                      Request Changes
                    </Button>
                    <Button variant="outline">
                      Schedule Discussion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposal Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Views</div>
                    <div className="text-2xl font-bold">{proposal.view_count}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Viewed</div>
                    <div className="text-sm">
                      {proposal.last_viewed_at ? 
                        new Date(proposal.last_viewed_at).toLocaleDateString() : 
                        'Never'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Template</div>
                    <div className="text-sm font-medium">
                      {proposal.content.template_name || 'Custom'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium">{proposal.client_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="text-sm">{proposal.client_email}</div>
                  </div>
                  {proposal.client_company && (
                    <div>
                      <div className="text-sm text-gray-600">Company</div>
                      <div className="font-medium">{proposal.client_company}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}