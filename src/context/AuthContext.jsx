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

  useEffect(() => {
    let unsub = () => {}
    async function boot() {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession()
        const user = data.session?.user
        await hydrate(user ? { id: user.id, email: user.email } : null)
        const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
          hydrate(s?.user ? { id: s.user.id, email: s.user.email } : null)
        })
        unsub = () => listener.subscription.unsubscribe()
      } else {
        await hydrate(localAuth.getSession())
      }
    }
    boot()
    return () => unsub()
  }, [])

  const value = useMemo(
    () => ({
      session,
      profile,
      setProfile,
      loading,
      demo: !isSupabaseConfigured,
      async signUp(email, password, display_name) {
        if (isSupabaseConfigured) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name } },
          })
          if (error) throw error
        } else {
          await hydrate(localAuth.signUp({ email, password, display_name }))
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
      async startDemo() {
        if (isSupabaseConfigured) throw new Error('Supabase bağlıyken demo kapalı.')
        try {
          await hydrate(localAuth.signIn({ email: 'demo@fitapp.local', password: 'demo123' }))
        } catch {
          await hydrate(
            localAuth.signUp({
              email: 'demo@fitapp.local',
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
