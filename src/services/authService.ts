import { supabase } from '@/config/supabase'
import { SessionUser } from '@/types'

export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: window.location.origin,
    },
  })
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async (): Promise<SessionUser | null> => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error || !profile) {
    // 如果不存在，创建一个基本 profile
    const newProfile = {
      id: session.user.id,
      username: session.user.user_metadata.username || null,
      avatar: null,
      grade: null,
      bio: null,
      graduate_university_id: null,
      graduate_major_id: null,
      graduate_year: null,
      is_verified: false,
      points: 0,
      level: 1,
      badges: [],
      role: 'user',
      privacy_settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await supabase.from('profiles').insert(newProfile)
    return { ...newProfile, email: session.user.email }
  }

  return { ...profile, email: session.user.email }
}

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}
