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
        <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-900 to-black">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/images/onlyfinds.png" 
                  alt="ONLYFINDS Logo" 
                  className="h-8 w-8 object-contain"
                />
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00BDFF] via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    ONLYFINDS
                  </h1>
                  <span className="text-lg text-gray-400">Admin Panel</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Welcome, {user?.email}
                </span>
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  size="sm"
                  className="text-gray-400 border-[#00BDFF]/30 hover:bg-[#00BDFF]/10 hover:text-[#00BDFF] hover:border-[#00BDFF]/50 transition-colors"
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
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-900/50 border border-[#00BDFF]/20 backdrop-blur-sm">
              <TabsTrigger 
                value="products" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BDFF]/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-[#00BDFF] data-[state=active]:border-[#00BDFF]/30 hover:text-[#00BDFF]/80 transition-colors"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="bulk-import" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BDFF]/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-[#00BDFF] data-[state=active]:border-[#00BDFF]/30 hover:text-[#00BDFF]/80 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Import
              </TabsTrigger>
              <TabsTrigger 
                value="images" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BDFF]/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-[#00BDFF] data-[state=active]:border-[#00BDFF]/30 hover:text-[#00BDFF]/80 transition-colors"
              >
                <Image className="w-4 h-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger 
                value="help" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00BDFF]/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-[#00BDFF] data-[state=active]:border-[#00BDFF]/30 hover:text-[#00BDFF]/80 transition-colors"
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