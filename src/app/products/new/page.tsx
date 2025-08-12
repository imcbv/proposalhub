'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sampleProducts } from '@/data/sample-products'
import Link from 'next/link'

const categories = [
  'Clinical Services',
  'Regulatory Services', 
  'Data Services',
  'Analytics',
  'Documentation',
  'Quality',
  'Safety',
  'Consulting',
  'Other'
]

export default function NewProductPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_range: '',
    category: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

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

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `product-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return null
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    setImageFile(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!user) {
      setError('User not authenticated')
      setSaving(false)
      return
    }

    try {
      let imageUrl = formData.image_url

      // Upload image if file is selected
      if (imageFile) {
        setUploading(true)
        const uploadedUrl = await uploadImage(imageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          setError('Failed to upload image')
          setSaving(false)
          setUploading(false)
          return
        }
        setUploading(false)
      }

      const { data, error: dbError } = await supabase
        .from('products')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            description: formData.description || null,
            price_range: formData.price_range || null,
            category: formData.category || null,
            image_url: imageUrl || null
          }
        ])
        .select()
        .single()

      if (dbError) {
        setError(`Failed to create product: ${dbError.message}`)
      } else {
        router.push('/products')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const loadSampleProduct = (sample: typeof sampleProducts[0]) => {
    setFormData({
      name: sample.name,
      description: sample.description || '',
      price_range: sample.price_range || '',
      category: sample.category || '',
      image_url: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
              <Link href="/products" className="text-blue-600 hover:underline text-sm">
                ← Back to Products
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Add New Product</h1>
              <p className="text-gray-600">Create a new service or product for your proposals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name">Product/Service Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Clinical Site Management"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed description of the service or product..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_range">Price Range</Label>
                    <Input
                      id="price_range"
                      value={formData.price_range}
                      onChange={(e) => handleInputChange('price_range', e.target.value)}
                      placeholder="e.g., $50,000 - $100,000"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Product Image (optional)</Label>
                    <div className="mt-1 space-y-3">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500">
                        Upload an image (max 5MB). JPG, PNG, GIF supported.
                      </p>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-3">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-32 rounded border"
                          />
                        </div>
                      )}
                      
                      {/* Or URL input as fallback */}
                      <div className="pt-2 border-t">
                        <Label htmlFor="image_url" className="text-sm text-gray-600">Or enter image URL</Label>
                        <Input
                          id="image_url"
                          value={formData.image_url}
                          onChange={(e) => handleInputChange('image_url', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          type="url"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" disabled={saving || uploading} className="flex-1">
                      {uploading ? 'Uploading Image...' : saving ? 'Creating Product...' : 'Create Product'}
                    </Button>
                    <Link href="/products">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sample Products & Preview */}
          <div className="space-y-6">
            {/* Preview */}
            {formData.name && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <div className="bg-gray-100 rounded p-6 mb-4 text-center">
                      {(imagePreview || formData.image_url) ? (
                        <img 
                          src={imagePreview || formData.image_url} 
                          alt={formData.name}
                          className="max-h-24 mx-auto rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="text-gray-400">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs">No image</p>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{formData.name}</h3>
                    {formData.category && (
                      <div className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mb-2">
                        {formData.category}
                      </div>
                    )}
                    {formData.description && (
                      <p className="text-sm text-gray-600 mb-3">{formData.description}</p>
                    )}
                    {formData.price_range && (
                      <div className="text-lg font-semibold text-blue-600">
                        {formData.price_range}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sample Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Start Templates</CardTitle>
                <p className="text-sm text-gray-600">
                  Click any sample to auto-fill the form
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleProducts.slice(0, 4).map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => loadSampleProduct(sample)}
                      className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-sm">{sample.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{sample.category}</div>
                      <div className="text-xs text-blue-600 mt-1">{sample.price_range}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  These are sample pharma industry services you can customize
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}