import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);
const GUEST_KEY = 'gfitt_guest_mode';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(() => localStorage.getItem(GUEST_KEY) === 'true');

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user || null);
      if (currentSession) {
        localStorage.removeItem(GUEST_KEY);
        setGuestMode(false);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user || null);
      if (nextSession) {
        localStorage.removeItem(GUEST_KEY);
        setGuestMode(false);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const enterGuestMode = () => {
    localStorage.setItem(GUEST_KEY, 'true');
    setGuestMode(true);
  };

  const login = async (email, password) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    return result.data;
  };

  const signUp = async (email, password, metadata = {}) => {
    const result = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    if (result.error) throw result.error;
    return result.data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    enterGuestMode();
  };

  const value = useMemo(() => ({ user, session, loading, guestMode, isDemoMode: guestMode && !user, enterGuestMode, login, logout, signUp }), [user, session, loading, guestMode]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

export default AuthContext;
