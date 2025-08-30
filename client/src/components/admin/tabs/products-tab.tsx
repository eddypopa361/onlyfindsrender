import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ProductEditDrawer } from '../product-edit-drawer'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, Edit2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '../../../../shared/schema'

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
      if (!supabase) {
        throw new Error('Supabase not configured')
      }
      
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
        .order('id', { ascending: false })

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,buyUrl.ilike.%${searchQuery}%`)
      }

      const { data, error, count } = await query

      if (error) throw error

      setProducts(data || [])
      setTotalCount(count || 0)
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

  const formatPrice = (price: string | null, priceUSD: string | null) => {
    return priceUSD || price || 'N/A'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <>
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Product Management</CardTitle>
            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
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
              className="pl-10 text-white bg-gray-900 border-gray-700"
            />
          </div>

          {/* Products Table */}
          <div className="rounded-md border border-gray-800 bg-gray-900/50">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Brand</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
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
                        {formatPrice(product.price, product.priceUSD)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.category}
                        {product.subCategory && (
                          <div className="text-xs text-gray-500">{product.subCategory}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {product.brand || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.featured && (
                            <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-400">
                              Featured
                            </Badge>
                          )}
                          {product.carousel && (
                            <Badge variant="secondary" className="bg-blue-900/30 text-blue-400">
                              Carousel
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(product.buyUrl, '_blank')}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
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
      />
    </>
  )
}