import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  FileText, 
  Database, 
  Image as ImageIcon, 
  Package, 
  Mail, 
  ExternalLink,
  Info
} from 'lucide-react'

export function HelpTab() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <Alert className="bg-blue-900/20 border-blue-500">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-400">Admin Panel Overview</AlertTitle>
        <AlertDescription className="text-gray-300">
          This admin panel allows you to manage products, perform bulk imports, and maintain your ONLYFINDS catalog. 
          All changes are immediately reflected on the public website.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Management Help */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Product Management
            </CardTitle>
            <CardDescription>How to add and edit products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-300">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-white mb-2">Adding a New Product</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>Click "Add Product" in the Products tab</li>
                  <li>Fill in required fields marked with <Badge variant="destructive" className="text-xs">*</Badge></li>
                  <li>Upload an image or specify a filename</li>
                  <li>Set category and optional subcategory</li>
                  <li>Choose if the product is featured or in carousel</li>
                  <li>Click "Add Product" to save</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Editing Existing Products</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>Use the search bar to find specific products</li>
                  <li>Click the edit icon in the Actions column</li>
                  <li>Modify any fields as needed</li>
                  <li>Click "Save Changes" to update</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSV Import Help */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              CSV Import Format
            </CardTitle>
            <CardDescription>Required CSV structure for bulk imports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-white mb-2">CSV Format (New)</h4>
                <div className="bg-gray-900 p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto">
                  title,price_usd,image,buy_url,category,sub_category,featured,carousel
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <strong>Note:</strong> Old format (priceUSD, buyUrl, subcategory) is still supported for compatibility.
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Column Descriptions</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li><code className="bg-gray-800 px-1 rounded">title</code> - Product name (required)</li>
                  <li><code className="bg-gray-800 px-1 rounded">price_usd</code> - Price in USD (required, as text)</li>
                  <li><code className="bg-gray-800 px-1 rounded">image</code> - Image filename or URL (optional)</li>
                  <li><code className="bg-gray-800 px-1 rounded">buy_url</code> - Purchase link (required, full URL)</li>
                  <li><code className="bg-gray-800 px-1 rounded">category</code> - Main category (required)</li>
                  <li><code className="bg-gray-800 px-1 rounded">sub_category</code> - Subcategory (optional)</li>
                  <li><code className="bg-gray-800 px-1 rounded">featured</code> - true/false (optional, default: false)</li>
                  <li><code className="bg-gray-800 px-1 rounded">carousel</code> - true/false (optional, default: false)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Management Help */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              Image Management
            </CardTitle>
            <CardDescription>How to handle product images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-300">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-white mb-2">Image Requirements</h4>
                <ul className="space-y-1 text-gray-400 list-disc list-inside">
                  <li>Supported formats: JPG, PNG, GIF, WebP</li>
                  <li>Maximum file size: 50MB</li>
                  <li>Recommended size: 800x800px or higher</li>
                  <li>Images are stored in Supabase Storage</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Upload Methods</h4>
                <ul className="space-y-1 text-gray-400 list-disc list-inside">
                  <li><strong>Individual products:</strong> Upload directly when adding/editing products</li>
                  <li><strong>Bulk upload:</strong> Upload ZIP file in Bulk Import section</li>
                  <li><strong>Image URLs:</strong> Use full Supabase Storage URLs in CSV</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Image Storage</h4>
                <p className="text-xs text-gray-400">
                  All images are stored in Supabase Cloud Storage. Images uploaded via the admin panel 
                  are automatically processed and given public URLs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Help */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Available Categories
            </CardTitle>
            <CardDescription>Current product categories and subcategories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-white mb-2">Main Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Electronic products',
                    'Clothing and Jewelry', 
                    'Bags',
                    'Coats and Jackets',
                    'Shoes',
                    'Belts'
                  ].map(cat => (
                    <Badge key={cat} variant="secondary" className="text-xs bg-blue-900/30 text-blue-300">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Common Subcategories</h4>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Belts', 'Backpacks', 'Handbags', 'Shoulder Bags',
                    'Sneakers', 'Boots', 'Sandals', 'Watches',
                    'Headphones', 'Speakers'
                  ].map(subcat => (
                    <Badge key={subcat} variant="outline" className="text-xs border-gray-600 text-gray-400">
                      {subcat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              If you encounter any issues or need assistance with the admin panel, please contact support:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => window.open('mailto:onlyfinds@gmail.com', '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => window.open('https://discord.gg/4jzdSZGD', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Discord Community
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}