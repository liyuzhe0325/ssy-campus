// ============================
// 点赞服务
// 支持多态点赞（文章、问答、回答、评论等）
// 依赖：supabase客户端
// ============================

import { supabase } from '@/config/supabase';
import { handleSupabaseRequest } from '@/config/supabase';

export type TargetType = 'article' | 'question' | 'answer' | 'post' | 'dynamic' | 'comment';

/**
 * 点赞
 * @param userId - 用户ID
 * @param targetType - 目标类型
 * @param targetId - 目标ID
 */
export async function like(
  userId: string,
  targetType: TargetType,
  targetId: string
): Promise<void> {
  await handleSupabaseRequest(
    supabase
      .from('likes')
      .insert({
        user_id: userId,
        target_type: targetType,
        target_id: targetId,
      })
  );

  // 可选：更新对应表的 like_count 字段（可通过触发器或应用层处理）
  // 这里假设由数据库触发器自动更新
}

/**
 * 取消点赞
 * @param userId - 用户ID
 * @param targetType - 目标类型
 * @param targetId - 目标ID
 */
export async function unlike(
  userId: string,
  targetType: TargetType,
  targetId: string
): Promise<void> {
  await handleSupabaseRequest(
    supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
  );
}

/**
 * 检查是否已点赞
 * @param userId - 用户ID
 * @param targetType - 目标类型
 * @param targetId - 目标ID
 * @returns 是否已点赞
 */
export async function checkIsLiked(
  userId: string,
  targetType: TargetType,
  targetId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/**
 * 获取目标的点赞数
 * @param targetType - 目标类型
 * @param targetId - 目标ID
 */
export async function getLikeCount(
  targetType: TargetType,
  targetId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId);

  if (error) throw error;
  return count || 0;
}

/**
 * 获取用户点赞过的目标ID列表（用于批量查询）
 * @param userId - 用户ID
 * @param targetType - 目标类型
 * @param targetIds - 目标ID数组
 * @returns 已点赞的目标ID集合
 */
export async function getLikedTargetIds(
  userId: string,
  targetType: TargetType,
  targetIds: string[]
): Promise<Set<string>> {
  if (targetIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from('likes')
    .select('target_id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .in('target_id', targetIds);

  if (error) throw error;
  return new Set(data.map(item => item.target_id));
}
