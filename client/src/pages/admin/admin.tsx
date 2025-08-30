import { useAuth } from '@/hooks/use-auth'
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminPanel } from '@/components/admin/admin-panel'
import { supabaseConfig } from '@/lib/supabase'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ExternalLink, LogOut } from 'lucide-react'
import { Helmet } from 'react-helmet'

export default function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth()

  // Check Supabase configuration first
  if (!supabaseConfig.isConfigured) {
    const missingVars = []
    if (!supabaseConfig.url) missingVars.push('VITE_SUPABASE_URL')
    if (!supabaseConfig.anonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')

    return (
      <>
        <Helmet>
          <title>Configuration Required - ONLYFINDS Admin</title>
        </Helmet>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-6">
            <Alert className="bg-red-900/20 border-red-500">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-400">Admin Panel Configuration Missing</AlertTitle>
              <AlertDescription className="text-gray-300 space-y-4">
                <p>The admin panel requires Supabase configuration. Please add these environment variables to Replit Secrets:</p>
                <div className="bg-gray-900 p-3 rounded text-sm font-mono space-y-1">
                  {missingVars.map(varName => (
                    <div key={varName} className="text-red-400">❌ {varName}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p><strong>How to get these values:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to Settings → API</li>
                    <li>Copy the "URL" and "anon/public" key</li>
                    <li>Add them to Replit Secrets with the exact variable names above</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300"
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Supabase Dashboard
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Retry After Configuration
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin />
  }

  if (!isAdmin) {
    return (
      <>
        <Helmet>
          <title>Access Denied - ONLYFINDS Admin</title>
        </Helmet>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Alert className="bg-red-900/20 border-red-500">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertTitle className="text-red-400">Access Denied</AlertTitle>
              <AlertDescription className="text-gray-300">
                You don't have admin permissions to access this panel. Please contact an administrator if you believe this is an error.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full text-gray-400 border-gray-700 hover:bg-gray-800"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </>
    )
  }

  return <AdminPanel />
}