import { isSupabaseConfigured, supabase } from './supabase'
import { localDb } from './localStore'

export async function getProfile(userId) {
  if (!isSupabaseConfigured) return localDb.getProfile(userId)
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, patch) {
  if (!isSupabaseConfigured) return localDb.updateProfile(userId, patch)
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', userId).select().single()
  if (error) throw error
  return data
}

export async function listFood(userId, date) {
  if (!isSupabaseConfigured) return localDb.listFood(userId, date)
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_on', date)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addFood(userId, row) {
  if (!isSupabaseConfigured) return localDb.addFood(userId, row)
  const { data, error } = await supabase
    .from('food_logs')
    .insert({ user_id: userId, ...row })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteFood(userId, id) {
  if (!isSupabaseConfigured) return localDb.deleteFood(userId, id)
  const { error } = await supabase.from('food_logs').delete().eq('id', id)
  if (error) throw error
}

export async function listWorkouts(userId, date) {
  if (!isSupabaseConfigured) return localDb.listWorkouts(userId, date)
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_sets(*)')
    .eq('user_id', userId)
    .eq('logged_on', date)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map((w) => ({
    ...w,
    sets: (w.workout_sets || []).sort((a, b) => a.set_index - b.set_index),
  }))
}

export async function saveWorkout(userId, { template_id, name, logged_on, notes, sets }) {
  if (!isSupabaseConfigured) {
    return localDb.saveWorkout(userId, { template_id, name, logged_on, notes, sets })
  }
  const { data: workout, error } = await supabase
    .from('workouts')
    .insert({ user_id: userId, template_id, name, logged_on, notes })
    .select()
    .single()
  if (error) throw error
  if (sets?.length) {
    const { error: setErr } = await supabase.from('workout_sets').insert(
      sets.map((s) => ({ ...s, workout_id: workout.id })),
    )
    if (setErr) throw setErr
  }
  return { ...workout, sets }
}

export async function listSupplements(userId, date) {
  if (!isSupabaseConfigured) return localDb.listSupplements(userId, date)
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_on', date)
  if (error) throw error
  return data
}

export async function toggleSupplement(userId, supplement_id, date) {
  if (!isSupabaseConfigured) return localDb.toggleSupplement(userId, supplement_id, date)
  const { data: existing } = await supabase
    .from('supplement_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('supplement_id', supplement_id)
    .eq('logged_on', date)
    .maybeSingle()
  if (existing) {
    const { error } = await supabase.from('supplement_logs').delete().eq('id', existing.id)
    if (error) throw error
    return false
  }
  const { error } = await supabase
    .from('supplement_logs')
    .insert({ user_id: userId, supplement_id, logged_on: date, taken: true })
  if (error) throw error
  return true
}

export async function listWeight(userId) {
  if (!isSupabaseConfigured) return localDb.listWeight(userId)
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_on', { ascending: true })
  if (error) throw error
  return data
}

export async function upsertWeight(userId, weight_kg, logged_on) {
  if (!isSupabaseConfigured) return localDb.upsertWeight(userId, weight_kg, logged_on)
  const { data, error } = await supabase
    .from('weight_logs')
    .upsert({ user_id: userId, weight_kg, logged_on }, { onConflict: 'user_id,logged_on' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listRecentFood(userId, days = 30) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const from = cutoff.toISOString().slice(0, 10)
  if (!isSupabaseConfigured) {
    const db = JSON.parse(localStorage.getItem('fitapp.v1') || '{}')
    const foods = db.users?.[userId]?.food || []
    return foods.filter((f) => f.logged_on >= from)
  }
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_on', from)
    .order('logged_on', { ascending: true })
  if (error) throw error
  return data
}
