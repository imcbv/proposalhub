'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import Link from 'next/link'

export default function ProductsPage() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }
        
        setUser(user)
        await loadProducts(user.id)
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }

    loadData()
  }, [router])

  const loadProducts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        console.error('Error deleting product:', error)
      } else {
        setProducts(products.filter(p => p.id !== productId))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading products...</div>
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
              <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Products & Services</h1>
              <p className="text-gray-600">Manage your service catalog for proposals</p>
            </div>
            <Link href="/products/new">
              <Button>Add New Product</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('')}
                size="sm"
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {products.length === 0 ? 'No products yet' : 'No products match your search'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {products.length === 0 
                    ? 'Add your first product to start building comprehensive proposals'
                    : 'Try adjusting your search terms or filters'
                  }
                </p>
                {products.length === 0 && (
                  <Link href="/products/new">
                    <Button>Add Your First Product</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                      {product.category && (
                        <Badge variant="secondary" className="mb-3">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Product Image Placeholder */}
                  <div className="bg-gray-100 rounded-lg p-8 mb-4 text-center">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="max-h-32 mx-auto rounded"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {product.description || 'No description provided'}
                  </p>

                  {product.price_range && (
                    <div className="text-lg font-semibold text-blue-600 mb-4">
                      {product.price_range}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link href={`/products/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {products.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {products.filter(p => p.image_url).length}
                </div>
                <div className="text-sm text-gray-600">With Images</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}