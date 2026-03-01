import { supabase } from '@/config/supabase'
import { TargetType } from './likeService'

export interface Comment {
  id: string
  target_type: TargetType
  target_id: string
  user_id: string
  content: string
  parent_id: string | null
  like_count: number
  created_at: string
  user?: {
    id: string
    username: string
    avatar: string | null
  }
  replies?: Comment[]
}

/**
 * 获取某个内容的评论列表（包含回复）
 */
export const getComments = async (targetType: TargetType, targetId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:user_id (
        id, username, avatar
      ),
      replies:comments!parent_id (
        *,
        user:user_id (id, username, avatar)
      )
    `)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .is('parent_id', null) // 只取顶级评论
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * 发表评论
 */
export const addComment = async (
  userId: string,
  targetType: TargetType,
  targetId: string,
  content: string,
  parentId: string | null = null
) => {
  if (!content.trim()) throw new Error('评论内容不能为空')

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
      content: content.trim(),
      parent_id: parentId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 删除评论（仅作者本人可操作）
 */
export const deleteComment = async (commentId: string, userId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId)
  if (error) throw error
}
