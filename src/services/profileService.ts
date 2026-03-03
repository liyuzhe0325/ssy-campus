import { supabase } from '@/config/supabase'
import { handleSupabaseRequest } from '@/config/supabase'

export async function getProfileByUserId(userId: string) {
  return handleSupabaseRequest(
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  )
}

export async function getUserStats(userId: string) {
  const { count: articleCount, error: articleError } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'approved')
  if (articleError) throw articleError

  const { count: followerCount, error: followerError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)
  if (followerError) throw followerError

  const { count: followingCount, error: followingError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)
  if (followingError) throw followingError

  return {
    articleCount: articleCount || 0,
    followerCount: followerCount || 0,
    followingCount: followingCount || 0,
    totalLikes: 0,
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<{
    nickname: string
    avatar_url: string
    bio: string
    grade: string
    interests: string[]
  }>
) {
  const data = await handleSupabaseRequest(
    supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
  )
  return data
}

export async function getUserArticleCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'approved')
  if (error) throw error
  return count || 0
}

export async function getUserTotalLikes(userId: string): Promise<number> {
  return 0
}

export const getProfile = getProfileByUserId
