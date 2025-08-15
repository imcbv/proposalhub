'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PublicProposalPage() {
  const [proposal, setProposal] = useState<any>(null)
  const [proposalProducts, setProposalProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [responded, setResponded] = useState(false)
  const params = useParams()
  
  const proposalId = params.id as string

  useEffect(() => {
    async function loadProposal() {
      try {
        // Get proposal (no auth required for public sharing)
        const { data: proposalData, error: proposalError } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', proposalId)
          .single()

        if (proposalError || !proposalData) {
          notFound()
          return
        }

        setProposal(proposalData)
        
        // Load proposal products
        const { data: productsData, error: productsError } = await supabase
          .from('proposal_products')
          .select(`
            *,
            products (*)
          `)
          .eq('proposal_id', proposalId)

        if (!productsError) {
          setProposalProducts(productsData || [])
        }

        // Track view (increment view count and update last_viewed_at)
        await supabase
          .from('proposals')
          .update({
            view_count: (proposalData.view_count || 0) + 1,
            last_viewed_at: new Date().toISOString()
          })
          .eq('id', proposalId)

      } catch (err) {
        console.error('Error loading proposal:', err)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    if (proposalId) {
      loadProposal()
    }
  }, [proposalId])

  const handleResponse = async (response: 'accepted' | 'rejected') => {
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ 
          status: response,
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId)

      if (!error) {
        setProposal({ ...proposal, status: response })
        setResponded(true)
      }
    } catch (err) {
      console.error('Error updating proposal:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading proposal...</div>
      </div>
    )
  }

  if (!proposal) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
                <Badge className={`${
                  proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>For: {proposal.client_name}</span>
                {proposal.client_company && <span>• {proposal.client_company}</span>}
                <span>• {new Date(proposal.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Shared Proposal
              </div>
              <div className="text-xs text-gray-400">
                Views: {proposal.view_count || 0}
              </div>
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
                {/* Enhanced Hero Section */}
                <div className="relative overflow-hidden rounded-2xl mb-12 shadow-2xl">
                  {/* Background Image with Overlay */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${
                        proposalProducts.length > 0 && proposalProducts[0].products.image_url
                          ? proposalProducts[0].products.image_url
                          : 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
                      }')`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95" />
                  
                  {/* Content */}
                  <div className="relative px-12 py-16 text-white">
                    <div className="max-w-4xl">
                      {/* Animated Title */}
                      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
                        {proposal.content.hero?.title || proposal.title}
                      </h1>
                      
                      {/* Subtitle with typing effect */}
                      <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed animate-fade-in-up animation-delay-300">
                        {proposal.content.hero?.subtitle || 'Professional proposal tailored for your needs'}
                      </p>
                      
                      {/* Client Tags with Glass Effect */}
                      <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up animation-delay-500">
                        <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-white font-medium">
                          👤 {proposal.client_name}
                        </div>
                        {proposal.client_company && (
                          <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-white font-medium">
                            🏢 {proposal.client_company}
                          </div>
                        )}
                        <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-white font-medium">
                          📅 {new Date(proposal.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Floating Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up animation-delay-700">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold">{proposal.view_count || 0}</div>
                          <div className="text-sm text-blue-200">Views</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold">{proposalProducts.length}</div>
                          <div className="text-sm text-blue-200">Services</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-300">
                            {proposal.content.template_name?.split(' ')[0] || 'Pro'}
                          </div>
                          <div className="text-sm text-blue-200">Package</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-300">★</div>
                          <div className="text-sm text-blue-200">Premium</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-8 left-8 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse animation-delay-1000" />
                  </div>
                </div>

                {/* Custom Project Description */}
                {proposal.content.project_description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Project Overview</h3>
                    <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {proposal.content.project_description}
                    </div>
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
                  </div>
                )}

                {/* Response Section */}
                {!responded && proposal.status === 'sent' && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center border">
                    <h3 className="text-xl font-semibold mb-4">Ready to Move Forward?</h3>
                    <p className="text-gray-600 mb-6">
                      We're excited to partner with {proposal.client_company || proposal.client_name} on this important initiative.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={() => handleResponse('accepted')} 
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700 px-8"
                      >
                        {submitting ? 'Processing...' : 'Accept Proposal'}
                      </Button>
                      <Button 
                        onClick={() => handleResponse('rejected')} 
                        disabled={submitting}
                        variant="outline"
                        className="px-8"
                      >
                        {submitting ? 'Processing...' : 'Decline'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Response Confirmation */}
                {responded && (
                  <div className={`rounded-lg p-8 text-center border ${
                    proposal.status === 'accepted' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <h3 className="text-xl font-semibold mb-2">
                      {proposal.status === 'accepted' ? 'Proposal Accepted! 🎉' : 'Response Recorded'}
                    </h3>
                    <p className="text-gray-600">
                      {proposal.status === 'accepted' 
                        ? 'Thank you for accepting our proposal. We will be in touch soon to get started!'
                        : 'Thank you for your response. We appreciate your consideration.'
                      }
                    </p>
                  </div>
                )}

                {/* Already Responded */}
                {!responded && (proposal.status === 'accepted' || proposal.status === 'rejected') && (
                  <div className={`rounded-lg p-8 text-center border ${
                    proposal.status === 'accepted' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className="text-xl font-semibold mb-2">
                      {proposal.status === 'accepted' ? 'Proposal Accepted ✅' : 'Response Recorded'}
                    </h3>
                    <p className="text-gray-600">
                      This proposal has already been {proposal.status}.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-medium">
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Views</div>
                    <div className="text-xl font-bold">{proposal.view_count}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Template</div>
                    <div className="text-sm font-medium">
                      {proposal.content.template_name || 'Custom'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Created</div>
                    <div className="text-sm">
                      {new Date(proposal.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Have questions about this proposal? Get in touch with us directly.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}