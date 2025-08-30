import { useAuth } from '@/hooks/use-auth'
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminPanel } from '@/components/admin/admin-panel'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, LogOut } from 'lucide-react'
import { Helmet } from 'react-helmet'

export default function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth()

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