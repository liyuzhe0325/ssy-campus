import { supabase } from '@/config/supabase'

export type TargetType = 'article' | 'question' | 'post' | 'dynamic' | 'treehole_post' | 'comment'

/**
 * 点赞/取消点赞
 * @param userId 当前用户ID
 * @param targetType 内容类型
 * @param targetId 内容ID
 * @returns 当前点赞状态（true=已点赞，false=未点赞）
 */
export const toggleLike = async (userId: string, targetType: TargetType, targetId: string) => {
  // 先检查是否已点赞
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle()

  if (checkError) throw checkError

  if (existingLike) {
    // 已点赞 → 取消点赞
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id)
    if (deleteError) throw deleteError
    return false // 当前未点赞
  } else {
    // 未点赞 → 添加点赞
    const { error: insertError } = await supabase
      .from('likes')
      .insert({ user_id: userId, target_type: targetType, target_id: targetId })
    if (insertError) throw insertError
    return true // 当前已点赞
  }
}

/**
 * 获取某个内容的点赞数
 */
export const getLikeCount = async (targetType: TargetType, targetId: string) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId)
  if (error) throw error
  return count || 0
}

/**
 * 检查当前用户是否已点赞
 */
export const checkUserLiked = async (userId: string, targetType: TargetType, targetId: string) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
  if (error) throw error
  return (count || 0) > 0
}
