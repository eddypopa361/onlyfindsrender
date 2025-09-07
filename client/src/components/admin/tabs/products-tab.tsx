import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ProductEditDrawer } from '../product-edit-drawer'

import { useToast } from '@/hooks/use-toast'
import { Search, Plus, Edit2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
// Product interface for admin panel
interface Product {
  id: string
  title: string
  priceUSD: number | null
  image: string | null
  buyUrl: string | null
  viewUrl?: string | null
  category: string | null
  subCategory?: string | null
  brand?: string | null
  featured: boolean
  carousel: boolean
  created_at?: string
  updated_at?: string
}

const ITEMS_PER_PAGE = 20

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const { toast } = useToast()

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Use the admin API endpoint instead of direct Supabase
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })

      if (searchQuery.trim()) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/admin/products?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setProducts(data.products || [])
      setTotalCount(data.total || 0)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsAddMode(false)
    setIsDrawerOpen(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setIsAddMode(true)
    setIsDrawerOpen(true)
  }

  const handleSaveSuccess = () => {
    fetchProducts()
    setIsDrawerOpen(false)
    setEditingProduct(null)
    setIsAddMode(false)
  }

  const handleDeleteSuccess = () => {
    fetchProducts()
    setIsDrawerOpen(false)
    setEditingProduct(null)
    setIsAddMode(false)
  }

  const formatPrice = (priceUSD: number | null) => {
    return priceUSD ? `$${priceUSD.toFixed(2)}` : 'N/A'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <>
      <Card className="bg-black/50 border-[#00BDFF]/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Product Management</CardTitle>
            <Button onClick={handleAddNew} className="bg-gradient-to-r from-[#00BDFF] to-blue-500 hover:from-[#00BDFF]/80 hover:to-blue-500/80 text-white border-none shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by title or URL..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50 focus:ring-[#00BDFF]/20"
            />
          </div>

          {/* Products Table */}
          <div className="rounded-md border border-[#00BDFF]/20 bg-gray-900/30 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Buy URL</TableHead>
                  <TableHead className="text-gray-300">Product Image</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="border-gray-800">
                      <TableCell className="text-white font-medium max-w-xs truncate">
                        {product.title}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatPrice(product.priceUSD)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.category}
                        {product.subCategory && (
                          <div className="text-xs text-gray-500">{product.subCategory}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {product.buyUrl ? (
                          <a 
                            href={product.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00BDFF] hover:text-[#00BDFF]/80 underline"
                          >
                            {product.buyUrl}
                          </a>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.image ? (
                          <div className="flex items-center space-x-2">
                            <img 
                              src={resolveImage(product.image)} 
                              alt={product.title}
                              className="w-8 h-8 object-cover rounded border border-gray-600"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            <span className="text-xs text-gray-400 truncate max-w-[100px]">
                              {product.image.split('/').pop()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">No image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="border-[#00BDFF]/30 text-gray-300 hover:bg-[#00BDFF]/10 hover:border-[#00BDFF]/50"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(product.buyUrl, '_blank')}
                            className="border-[#00BDFF]/30 text-[#00BDFF] hover:bg-[#00BDFF]/10 hover:border-[#00BDFF]/50"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <div className="flex gap-1 mt-1">
                            {product.featured && (
                              <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-400 text-xs px-1">
                                F
                              </Badge>
                            )}
                            {product.carousel && (
                              <Badge variant="secondary" className="bg-[#00BDFF]/20 text-[#00BDFF] text-xs px-1">
                                C
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-700 text-gray-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-400 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-700 text-gray-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductEditDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={editingProduct}
        isAddMode={isAddMode}
        onSaveSuccess={handleSaveSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  )
}