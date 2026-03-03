// ============================
// 关注服务
// 处理用户之间的关注/取消关注、关注状态检查
// 依赖：supabase客户端
// ============================

import { supabase } from '@/config/supabase';
import { handleSupabaseRequest } from '@/config/supabase';

/**
 * 关注用户
 * @param followerId - 关注者ID
 * @param followingId - 被关注者ID
 */
export async function followUser(followerId: string, followingId: string): Promise<void> {
  await handleSupabaseRequest(
    supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId })
  );
}

/**
 * 取消关注
 * @param followerId - 关注者ID
 * @param followingId - 被关注者ID
 */
export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  await handleSupabaseRequest(
    supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
  );
}

/**
 * 检查是否已关注
 * @param followerId - 关注者ID
 * @param followingId - 被关注者ID
 * @returns 是否已关注
 */
export async function checkIsFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// 别名，兼容旧代码（如 useFollow.ts 中导入 isFollowing）
export const isFollowing = checkIsFollowing;

/**
 * 获取用户的粉丝数
 * @param userId - 用户ID
 */
export async function getFollowerCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  if (error) throw error;
  return count || 0;
}

/**
 * 获取用户的关注数
 * @param userId - 用户ID
 */
export async function getFollowingCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (error) throw error;
  return count || 0;
}

/**
 * 获取用户的粉丝列表（带分页）
 * @param userId - 用户ID
 * @param page - 页码
 * @param pageSize - 每页数量
 */
export async function getFollowers(userId: string, page = 1, pageSize = 20) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower_id,
      profiles:follower_id (
        id,
        nickname,
        avatar_url,
        bio
      )
    `)
    .eq('following_id', userId)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => item.profiles);
}

/**
 * 获取用户的关注列表（带分页）
 * @param userId - 用户ID
 * @param page - 页码
 * @param pageSize - 每页数量
 */
export async function getFollowing(userId: string, page = 1, pageSize = 20) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error } = await supabase
    .from('follows')
    .select(`
      following_id,
      profiles:following_id (
        id,
        nickname,
        avatar_url,
        bio
      )
    `)
    .eq('follower_id', userId)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => item.profiles);
}
