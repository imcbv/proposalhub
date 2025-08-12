'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { pharmaTemplates } from '@/lib/templates'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import Link from 'next/link'

export default function ProposalFormPage() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  
  const templateId = params.template as string
  const template = pharmaTemplates.find(t => t.id === templateId)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    client_email: '',
    client_company: '',
    project_description: ''
  })

  // Selected products with quantities and custom pricing
  const [selectedProducts, setSelectedProducts] = useState<{
    product_id: string
    quantity: number
    custom_price: string
  }[]>([])

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
        await loadProducts(user.id)
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  const loadProducts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error loading products:', error)
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: `${template.name} - Proposal`
      }))
    }
  }, [template])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!user || !template) {
      setError('Missing user or template data')
      setSaving(false)
      return
    }

    try {
      // Create proposal in Supabase
      const { data: proposal, error: dbError } = await supabase
        .from('proposals')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            client_name: formData.client_name,
            client_email: formData.client_email,
            client_company: formData.client_company || null,
            template_id: template.id,
            content: {
              ...template.default_content,
              project_description: formData.project_description,
              created_from: 'template',
              template_name: template.name,
              selected_products_count: selectedProducts.length
            },
            status: 'draft'
          }
        ])
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        setError(`Failed to create proposal: ${dbError.message}`)
      } else {
        // Save selected products if any
        if (selectedProducts.length > 0) {
          const { error: productsError } = await supabase
            .from('proposal_products')
            .insert(
              selectedProducts.map(sp => ({
                proposal_id: proposal.id,
                product_id: sp.product_id,
                quantity: sp.quantity,
                custom_price: sp.custom_price || null
              }))
            )

          if (productsError) {
            console.error('Error saving products:', productsError)
            // Don't fail the whole process, just log the error
          }
        }

        // Redirect to the proposal view/edit page
        router.push(`/proposal/${proposal.id}`)
      }
    } catch (err) {
      console.error('Error creating proposal:', err)
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.product_id === productId)
      if (existing) {
        // Remove product
        return prev.filter(p => p.product_id !== productId)
      } else {
        // Add product with default values
        return [...prev, {
          product_id: productId,
          quantity: 1,
          custom_price: ''
        }]
      }
    })
  }

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(prev => 
      prev.map(p => 
        p.product_id === productId 
          ? { ...p, quantity: Math.max(1, quantity) }
          : p
      )
    )
  }

  const updateProductPrice = (productId: string, price: string) => {
    setSelectedProducts(prev => 
      prev.map(p => 
        p.product_id === productId 
          ? { ...p, custom_price: price }
          : p
      )
    )
  }

  const isProductSelected = (productId: string) => {
    return selectedProducts.some(p => p.product_id === productId)
  }

  const getSelectedProduct = (productId: string) => {
    return selectedProducts.find(p => p.product_id === productId)
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
              <Link href={`/create/${templateId}`} className="text-blue-600 hover:underline text-sm">
                ← Back to Template
              </Link>
              <div className="flex items-center mt-2 space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">Create Proposal</h1>
                <Badge variant="secondary">{template.name}</Badge>
              </div>
              <p className="text-gray-600">Add client details to personalize your proposal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="title">Proposal Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter proposal title"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client_name">Client Name</Label>
                      <Input
                        id="client_name"
                        value={formData.client_name}
                        onChange={(e) => handleInputChange('client_name', e.target.value)}
                        placeholder="John Smith"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_email">Client Email</Label>
                      <Input
                        id="client_email"
                        type="email"
                        value={formData.client_email}
                        onChange={(e) => handleInputChange('client_email', e.target.value)}
                        placeholder="john@company.com"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="client_company">Client Company</Label>
                    <Input
                      id="client_company"
                      value={formData.client_company}
                      onChange={(e) => handleInputChange('client_company', e.target.value)}
                      placeholder="Acme Pharmaceuticals"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project_description">Project Description</Label>
                    <Textarea
                      id="project_description"
                      value={formData.project_description}
                      onChange={(e) => handleInputChange('project_description', e.target.value)}
                      placeholder="Brief description of the project scope, timeline, or specific requirements..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  {/* Product Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Services & Products</Label>
                      {products.length === 0 && (
                        <Link href="/products/new" className="text-sm text-blue-600 hover:underline">
                          Add products first →
                        </Link>
                      )}
                    </div>
                    
                    {products.length === 0 ? (
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          No products available. Create your service catalog first.
                        </p>
                        <Link href="/products/new">
                          <Button type="button" size="sm" variant="outline">
                            Create Products
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {products.map((product) => {
                          const selected = getSelectedProduct(product.id)
                          return (
                            <div 
                              key={product.id} 
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                isProductSelected(product.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => toggleProductSelection(product.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    isProductSelected(product.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                  }`}>
                                    {isProductSelected(product.id) && (
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                                      {product.category && (
                                        <Badge variant="secondary" className="text-xs mt-1">
                                          {product.category}
                                        </Badge>
                                      )}
                                      {product.description && (
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                          {product.description}
                                        </p>
                                      )}
                                    </div>
                                    {product.price_range && (
                                      <div className="text-sm font-medium text-green-600 ml-2">
                                        {product.price_range}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Quantity and Custom Price Controls */}
                                  {isProductSelected(product.id) && (
                                    <div className="mt-3 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                                      <div>
                                        <Label className="text-xs text-gray-600">Quantity</Label>
                                        <Input
                                          type="number"
                                          min="1"
                                          value={selected?.quantity || 1}
                                          onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 1)}
                                          className="h-8 text-sm"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs text-gray-600">Custom Price</Label>
                                        <Input
                                          placeholder="Optional"
                                          value={selected?.custom_price || ''}
                                          onChange={(e) => updateProductPrice(product.id, e.target.value)}
                                          className="h-8 text-sm"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    {selectedProducts.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✓ {selectedProducts.length} service{selectedProducts.length > 1 ? 's' : ''} selected for this proposal
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? 'Creating Proposal...' : 'Create Proposal'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Template Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Template Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Personalized Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-4">
                  <h2 className="text-xl font-bold mb-2">
                    {formData.client_company ? 
                      `${template.default_content.hero.title} - ${formData.client_company}` : 
                      template.default_content.hero.title
                    }
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {template.default_content.hero.subtitle}
                  </p>
                  {formData.client_name && (
                    <div className="mt-3 text-sm">
                      <span className="bg-blue-500 px-2 py-1 rounded text-xs">
                        For: {formData.client_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Section Preview */}
                <div className="space-y-4">
                  {template.default_content.sections?.slice(0, 3).map((section: any, index: number) => (
                    <div key={index} className="border-l-3 border-blue-200 pl-3">
                      <h3 className="font-medium text-sm text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {section.content?.slice(0, 100)}...
                      </p>
                    </div>
                  ))}
                  
                  {formData.project_description && (
                    <div className="bg-yellow-50 border-l-3 border-yellow-200 pl-3 py-2">
                      <h3 className="font-medium text-sm text-gray-900 mb-1">
                        Custom Project Details
                      </h3>
                      <p className="text-xs text-gray-600">
                        {formData.project_description.slice(0, 100)}
                        {formData.project_description.length > 100 && '...'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded text-center">
                  <p className="text-xs text-green-700">
                    ✨ Your proposal will be fully customizable after creation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}