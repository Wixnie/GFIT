import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasConfig = Boolean(supabaseUrl && supabaseAnonKey);

const demoQuery = () => ({
  select() { return this; },
  eq() { return this; },
  order() { return Promise.resolve({ data: null, error: null }); },
  upsert: async () => ({ data: null, error: null }),
  delete() { return this; },
  then(resolve) { return Promise.resolve({ data: null, error: null }).then(resolve); },
});

const demoSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: async () => ({ data: null, error: new Error('Demo Mode: Supabase ayarları yok.') }),
    signUp: async () => ({ data: null, error: new Error('Demo Mode: Supabase ayarları yok.') }),
    signOut: async () => ({ error: null }),
  },
  from: () => demoQuery(),
};

export const supabase = hasConfig ? createClient(supabaseUrl, supabaseAnonKey) : demoSupabase;
export const isSupabaseConfigured = hasConfig;

export default supabase;
