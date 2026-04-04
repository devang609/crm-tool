import { createSupabaseServerClient } from './supabase/server'
import { Profile } from './types'

export async function getSession() {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getUserProfile(): Promise<Profile | null> {
  const session = await getSession()
  if (!session) return null

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) return null
  return data as Profile
}

export async function checkAuthorization(requiredRole?: string) {
  const profile = await getUserProfile()
  if (!profile) return { authorized: false, profile: null }

  if (requiredRole && profile.role !== requiredRole && profile.role !== 'ADMIN') {
    return { authorized: false, profile }
  }

  return { authorized: true, profile }
}
