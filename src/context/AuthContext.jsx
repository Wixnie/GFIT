import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { localAuth } from '../lib/localStore'
import { getProfile } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function hydrate(user) {
    if (!user) {
      setSession(null)
      setProfile(null)
      setLoading(false)
      return
    }
    setSession(user)
    try {
      const p = await getProfile(user.id)
      setProfile(p)
    } catch {
      setProfile({ id: user.id, display_name: user.email?.split('@')[0] })
    }
    setLoading(false)
  }

  async function refreshProfile() {
    if (session) {
      try {
        const p = await getProfile(session.id)
        setProfile(p)
      } catch {
        console.error('Failed to refresh profile')
      }
    }
  }

  useEffect(() => {
    let subscription = null

    async function boot() {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession()
        const user = data.session?.user
        await hydrate(user ? { id: user.id, email: user.email } : null)

        const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
          hydrate(s?.user ? { id: s.user.id, email: s.user.email } : null)
        })
        subscription = listener.subscription
      } else {
        await hydrate(localAuth.getSession())
      }
    }

    boot()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      profile,
      setProfile,
      loading,
      refreshProfile,
      demo: !isSupabaseConfigured,
      async signUp(email, password, display_name, phone) {
        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name, phone } },
          })
          if (error) throw error
        } else {
          await hydrate(localAuth.signUp({ email, password, display_name, phone }))
        }
      },
      async signIn(email, password) {
        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
        } else {
          await hydrate(localAuth.signIn({ email, password }))
        }
      },
      async signInWithOAuth(provider) {
        if (!isSupabaseConfigured) {
          throw new Error('OAuth sadece Supabase bağlantısı ile çalışır.')
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin + '/dashboard'
          }
        })
        if (error) throw error
      },
      async startDemo() {
        if (isSupabaseConfigured) throw new Error('Supabase bağlıyken demo kapalı.')
        try {
          await hydrate(localAuth.signIn({ email: 'demo@gfitt.local', password: 'demo123' }))
        } catch {
          await hydrate(
            localAuth.signUp({
              email: 'demo@gfitt.local',
              password: 'demo123',
              display_name: 'Demo',
            }),
          )
        }
      },
      async signOut() {
        if (isSupabaseConfigured) await supabase.auth.signOut()
        else localAuth.signOut()
        setSession(null)
        setProfile(null)
      },
    }),
    [session, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
