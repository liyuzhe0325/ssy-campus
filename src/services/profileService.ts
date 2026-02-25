import { supabase } from '@/config/supabase'
import { Profile } from '@/types'

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  await updateProfile(userId, { avatar: publicUrl })

  return publicUrl
}
