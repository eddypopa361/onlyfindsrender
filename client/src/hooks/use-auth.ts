import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  })

  useEffect(() => {
    if (!supabase) {
      setAuthState({ user: null, isAdmin: false, loading: false })
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAdminStatus(session.user)
      } else {
        setAuthState({ user: null, isAdmin: false, loading: false })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          checkAdminStatus(session.user)
        } else {
          setAuthState({ user: null, isAdmin: false, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (user: User) => {
    if (!supabase) {
      setAuthState({ user, isAdmin: false, loading: false })
      return
    }
    
    try {
      // First check if user is already in admins table
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      let isAdmin = !!data && !error

      // If not admin, check if their email should make them admin
      if (!isAdmin && user.email) {
        const adminEmails = ['doarcarlos666@gmail.com', 'lucasnili91@gmail.com', 'tangsenquan996@gmail.com']
        
        if (adminEmails.includes(user.email)) {
          // Add them to admins table
          const { error: insertError } = await supabase
            .from('admins')
            .upsert({ id: user.id, email: user.email })
          
          if (!insertError) {
            isAdmin = true
          }
        }
      }

      setAuthState({
        user,
        isAdmin,
        loading: false,
      })
    } catch (error) {
      console.error('Error checking admin status:', error)
      setAuthState({ user, isAdmin: false, loading: false })
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    ...authState,
    signIn,
    signOut,
  }
}