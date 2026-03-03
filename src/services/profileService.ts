// ============================
// 用户资料服务
// 提供用户资料的获取、更新等功能
// ============================

import { supabase } from '@/config/supabase'
import { handleSupabaseRequest } from '@/config/supabase'

/**
 * 根据用户ID获取个人资料
 * @param userId - 用户ID
 */
export async function getProfileByUserId(userId: string) {
  return handleSupabaseRequest(
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  )
}

/**
 * 获取用户统计数据（文章数、点赞数、关注数等）
 * @param userId - 用户ID
 */
export async function getUserStats(userId: string) {
  // 获取文章数
  const { count: articleCount, error: articleError } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'approved')

  if (articleError) throw articleError

  // 获取粉丝数
  const { count: followerCount, error: followerError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)

  if (followerError) throw followerError

  // 获取关注数
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

/**
 * 更新用户资料
 * @param userId - 用户ID
 * @param updates - 更新的字段
 */
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

/**
 * 获取用户的文章数
 * @param userId - 用户ID
 */
export async function getUserArticleCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'approved')
  if (error) throw error
  return count || 0
}

/**
 * 获取用户收到的点赞总数（所有内容）
 * @param userId - 用户ID
 */
export async function getUserTotalLikes(userId: string): Promise<number> {
  return 0
}

// 别名，兼容旧代码
export const getProfile = getProfileByUserId
