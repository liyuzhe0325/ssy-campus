// ============================
// 用户资料服务
// 提供用户资料的获取、更新等功能
// 依赖：supabase客户端
// ============================

import { supabase } from '@/config/supabase';
import { handleSupabaseRequest } from '@/config/supabase';

/**
 * 根据用户ID获取个人资料
 * @param userId - 用户ID
 */
export async function getProfileByUserId(userId: string) {
  const data = await handleSupabaseRequest(
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  );
  return data;
}

/**
 * 更新用户资料
 * @param userId - 用户ID
 * @param updates - 更新的字段
 */
export async function updateProfile(
  userId: string,
  updates: Partial<{
    nickname: string;
    avatar_url: string;
    bio: string;
    grade: string;
    interests: string[];
  }>
) {
  const data = await handleSupabaseRequest(
    supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
  );
  return data;
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
    .eq('status', 'approved');
  if (error) throw error;
  return count || 0;
}

/**
 * 获取用户收到的点赞总数（所有内容）
 * @param userId - 用户ID
 */
export async function getUserTotalLikes(userId: string): Promise<number> {
  // 需要统计所有内容类型的点赞，复杂，暂时返回0
  // 后续可通过数据库函数或统计表实现
  return 0;
}
