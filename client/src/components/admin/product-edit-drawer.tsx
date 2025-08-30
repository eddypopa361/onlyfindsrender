import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Save, Upload, AlertCircle } from 'lucide-react'
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

interface ProductEditDrawerProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  isAddMode: boolean
  onSaveSuccess: () => void
}

interface ProductFormData {
  title: string
  price: string
  priceUSD: string
  image: string
  buyUrl: string
  category: string
  subCategory: string
  featured: boolean
  carousel: boolean
}

const CATEGORIES = [
  'Trending Now',
  'Latest Finds',
  'Shoes', 
  'T-shirt and Shorts',
  'Hoodies and Pants',
  'Coats and Jackets',
  'Accessories',
  'Electronic products',
  'Perfumes',
  'Women'
]

const SUB_CATEGORIES = [
  'Peaked Cap',
  'Knitted Hat',
  'Belts',
  'Scarf',
  'Bags',
  'Wallet', 
  'Jewelry',
  'Sunglasses',
  'Underwear and Socks',
  'Other'
]

export function ProductEditDrawer({ isOpen, onClose, product, isAddMode, onSaveSuccess }: ProductEditDrawerProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: '',
    priceUSD: '',
    image: '',
    buyUrl: '',
    category: '',
    subCategory: '',
    featured: false,
    carousel: false,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (product && !isAddMode && isOpen) {
      console.log('Loading product for editing:', {
        title: product.title,
        category: product.category,
        subCategory: product.subCategory
      })
      setFormData({
        title: product.title || '',
        price: product.priceUSD?.toString() || '',
        priceUSD: product.priceUSD?.toString() || '',
        image: product.image || '',
        buyUrl: product.buyUrl || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        featured: !!product.featured,
        carousel: !!product.carousel,
      })
    } else if (isAddMode && isOpen) {
      console.log('Resetting form for new product')
      setFormData({
        title: '',
        price: '',
        priceUSD: '',
        image: '',
        buyUrl: '',
        category: '',
        subCategory: '',
        featured: false,
        carousel: false,
      })
    }
    setErrors({})
    setImageFile(null)
  }, [product, isAddMode, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.priceUSD.trim()) {
      newErrors.priceUSD = 'Price is required'
    } else if (isNaN(parseFloat(formData.priceUSD))) {
      newErrors.priceUSD = 'Price must be a valid number'
    }

    if (!formData.buyUrl.trim()) {
      newErrors.buyUrl = 'Buy URL is required'
    } else {
      try {
        new URL(formData.buyUrl)
      } catch {
        newErrors.buyUrl = 'Buy URL must be a valid URL'
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (!formData.image.trim() && !imageFile) {
      newErrors.image = 'Image filename is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return null

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/products/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.filename
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "destructive"
      })
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      let finalImageName = formData.image

      // Upload image if selected
      if (imageFile) {
        const uploadedImageName = await handleImageUpload(imageFile)
        if (uploadedImageName) {
          finalImageName = uploadedImageName
        } else {
          setLoading(false)
          return
        }
      }

      const productData = {
        title: formData.title,
        priceUSD: parseFloat(formData.priceUSD),
        image: finalImageName.startsWith('/uploads/') ? finalImageName : `/uploads/${finalImageName}`,
        buyUrl: formData.buyUrl,
        viewUrl: null,
        category: formData.category,
        subCategory: formData.subCategory || null,
        brand: null,
        featured: formData.featured,
        carousel: formData.carousel,
      }

      let response
      if (isAddMode) {
        response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        })
      } else {
        response = await fetch(`/api/admin/products/${product!.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Success",
        description: `Product ${isAddMode ? 'added' : 'updated'} successfully`,
      })

      onSaveSuccess()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "Error",
        description: `Failed to ${isAddMode ? 'add' : 'update'} product`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      // Clear subcategory if category changes and is not Accessories
      if (field === 'category' && value !== 'Accessories') {
        newData.subCategory = ''
      }
      return newData
    })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-gradient-to-b from-black via-gray-900 to-black border-[#00BDFF]/30 text-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white bg-gradient-to-r from-[#00BDFF] to-blue-400 bg-clip-text text-transparent font-bold">
            {isAddMode ? 'Add New Product' : 'Edit Product'}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            {isAddMode ? 'Add a new product to the catalog' : 'Make changes to the product details'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50 focus:ring-[#00BDFF]/20"
              placeholder="Product title"
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="priceUSD" className="text-gray-300">Price (USD) *</Label>
            <Input
              id="priceUSD"
              value={formData.priceUSD}
              onChange={(e) => handleInputChange('priceUSD', e.target.value)}
              className="text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50 focus:ring-[#00BDFF]/20"
              placeholder="29.99"
              type="number"
              step="0.01"
            />
            {errors.priceUSD && (
              <p className="text-sm text-red-400">{errors.priceUSD}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">Category *</Label>
            <Select value={formData.category || ''} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-[#00BDFF]/30">
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-[#00BDFF]/20 focus:bg-[#00BDFF]/20">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-400">{errors.category}</p>
            )}
          </div>

          {/* Sub Category - Only for Accessories */}
          {formData.category === 'Accessories' && (
            <div className="space-y-2">
              <Label htmlFor="subCategory" className="text-gray-300">Sub Category</Label>
              <Select value={formData.subCategory || ''} onValueChange={(value) => handleInputChange('subCategory', value)}>
                <SelectTrigger className="text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50">
                  <SelectValue placeholder="Select accessories subcategory (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-[#00BDFF]/30">
                  {SUB_CATEGORIES.map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory} className="text-white hover:bg-[#00BDFF]/20 focus:bg-[#00BDFF]/20">
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}



          {/* Buy URL */}
          <div className="space-y-2">
            <Label htmlFor="buyUrl" className="text-gray-300">Buy URL *</Label>
            <Input
              id="buyUrl"
              value={formData.buyUrl}
              onChange={(e) => handleInputChange('buyUrl', e.target.value)}
              className="text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50 focus:ring-[#00BDFF]/20"
              placeholder="https://cnfans.com/product/..."
            />
            {errors.buyUrl && (
              <p className="text-sm text-red-400">{errors.buyUrl}</p>
            )}
          </div>



          {/* Image */}
          <div className="space-y-2">
            <Label className="text-gray-300">Product Image *</Label>
            <div className="space-y-2">
              <Input
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50 focus:ring-[#00BDFF]/20"
                placeholder="image-filename.webp"
              />
              <div className="text-center text-gray-400 text-sm">or</div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="text-white bg-gray-900/50 border-[#00BDFF]/30 focus:border-[#00BDFF]/50 focus:ring-[#00BDFF]/20"
              />
              {imageFile && (
                <p className="text-sm text-blue-400">Selected: {imageFile.name}</p>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-400">{errors.image}</p>
            )}
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', !!checked)}
                className="border-[#00BDFF]/30 data-[state=checked]:bg-[#00BDFF] data-[state=checked]:border-[#00BDFF]"
              />
              <Label htmlFor="featured" className="text-gray-300">Featured Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="carousel"
                checked={formData.carousel}
                onCheckedChange={(checked) => handleInputChange('carousel', !!checked)}
                className="border-[#00BDFF]/30 data-[state=checked]:bg-[#00BDFF] data-[state=checked]:border-[#00BDFF]"
              />
              <Label htmlFor="carousel" className="text-gray-300">Show in Carousel</Label>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || uploadingImage}
            className="bg-gradient-to-r from-[#00BDFF] to-blue-500 hover:from-[#00BDFF]/80 hover:to-blue-500/80 text-white border-none shadow-lg transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </>
            ) : uploadingImage ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isAddMode ? 'Add Product' : 'Save Changes'}
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}