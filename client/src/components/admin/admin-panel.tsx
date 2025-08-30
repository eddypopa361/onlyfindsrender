import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductsTab } from './tabs/products-tab'
import { BulkImportTab } from './tabs/bulk-import-tab'
import { ImagesTab } from './tabs/images-tab'
import { HelpTab } from './tabs/help-tab'
import { LogOut, Settings, Package, Upload, Image, HelpCircle } from 'lucide-react'
import { Helmet } from 'react-helmet'

export function AdminPanel() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('products')

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel - ONLYFINDS</title>
      </Helmet>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="border-b border-gray-800 bg-black/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Settings className="h-6 w-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-white">ONLYFINDS Admin Panel</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Welcome, {user?.email}
                </span>
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  size="sm"
                  className="text-gray-400 border-gray-700 hover:bg-gray-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-900 border border-gray-800">
              <TabsTrigger 
                value="products" 
                className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="bulk-import" 
                className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </TabsTrigger>
              <TabsTrigger 
                value="images" 
                className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white"
              >
                <Image className="w-4 h-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger 
                value="help" 
                className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-0">
              <ProductsTab />
            </TabsContent>
            
            <TabsContent value="bulk-import" className="mt-0">
              <BulkImportTab />
            </TabsContent>
            
            <TabsContent value="images" className="mt-0">
              <ImagesTab />
            </TabsContent>
            
            <TabsContent value="help" className="mt-0">
              <HelpTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}