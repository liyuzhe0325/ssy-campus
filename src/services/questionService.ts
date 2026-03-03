// ============================
// 问答服务（完整版）
// 包含问题 CRUD、答案管理、采纳、相似问题等
// 依赖：supabase客户端
// ============================

import { supabase } from '@/config/supabase';
import { handleSupabaseRequest } from '@/config/supabase';

/**
 * 获取问题详情（包含作者、标签、答案及回答者信息）
 * @param id - 问题ID
 */
export async function getQuestionById(id: string) {
  // 先获取问题基本信息
  const question = await handleSupabaseRequest(
    supabase
      .from('questions')
      .select(`
        *,
        user:user_id (
          id,
          nickname,
          avatar_url,
          is_verified
        ),
        tags:tag_ids (
          id,
          name,
          color
        )
      `)
      .eq('id', id)
      .single()
  );

  // 获取该问题的所有答案，并带上回答者信息
  const answers = await handleSupabaseRequest(
    supabase
      .from('answers')
      .select(`
        *,
        user:user_id (
          id,
          nickname,
          avatar_url,
          is_verified
        )
      `)
      .eq('question_id', id)
      .order('created_at', { ascending: true })
  );

  return {
    ...question,
    answers,
  };
}

/**
 * 获取问题列表（分页、筛选）
 * @param params - 查询参数
 */
export async function getQuestions(params?: {
  page?: number;
  pageSize?: number;
  tagId?: string;
  solved?: boolean;
  search?: string;
}) {
  const { page = 1, pageSize = 10, tagId, solved, search } = params || {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('questions')
    .select(`
      *,
      user:user_id (
        id,
        nickname,
        avatar_url
      ),
      tags:tag_ids (
        id,
        name,
        color
      )
    `, { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (tagId) {
    query = query.contains('tag_ids', [tagId]);
  }

  if (solved !== undefined) {
    query = query.eq('is_solved', solved);
  }

  if (search) {
    query = query.textSearch('title', search, { config: 'chinese' });
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { data, total: count || 0 };
}

/**
 * 创建新问题
 * @param userId - 用户ID
 * @param title - 标题
 * @param content - 内容（HTML）
 * @param tagIds - 标签ID数组
 * @param isAnonymous - 是否匿名
 */
export async function createQuestion(
  userId: string,
  title: string,
  content: string,
  tagIds: string[] = [],
  isAnonymous = false
) {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      user_id: userId,
      title,
      content,
      tag_ids: tagIds,
      is_anonymous: isAnonymous,
      status: 'pending', // 需要审核
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 更新问题
 * @param id - 问题ID
 * @param userId - 用户ID（用于权限验证）
 * @param updates - 更新字段
 */
export async function updateQuestion(
  id: string,
  userId: string,
  updates: Partial<{
    title: string;
    content: string;
    tag_ids: string[];
    is_anonymous: boolean;
  }>
) {
  const { data, error } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId) // 确保是作者
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 删除问题
 * @param id - 问题ID
 * @param userId - 用户ID（权限验证）
 */
export async function deleteQuestion(id: string, userId: string) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * 采纳答案
 * @param questionId - 问题ID
 * @param answerId - 被采纳的答案ID
 * @param userId - 当前用户ID（用于验证权限）
 */
export async function acceptAnswer(
  questionId: string,
  answerId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase.rpc('accept_answer', {
    p_question_id: questionId,
    p_answer_id: answerId,
    p_user_id: userId,
  });

  if (error) throw error;
}

/**
 * 添加回答
 * @param questionId - 问题ID
 * @param userId - 回答者ID
 * @param content - 回答内容（HTML）
 */
export async function addAnswer(
  questionId: string,
  userId: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('answers')
    .insert({
      question_id: questionId,
      user_id: userId,
      content,
    });

  if (error) throw error;
}

/**
 * 获取相似问题（基于标题模糊匹配）
 * @param title - 当前问题标题
 * @param excludeId - 排除的问题ID
 * @param limit - 返回数量
 */
export async function getSimilarQuestions(
  title: string,
  excludeId?: string,
  limit = 5
) {
  let query = supabase
    .from('questions')
    .select(`
      id,
      title,
      answer_count,
      created_at
    `)
    .eq('status', 'approved')
    .textSearch('title', title, { config: 'chinese' })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const data = await handleSupabaseRequest(query);
  return data;
}

/**
 * 增加问题浏览量
 * @param questionId - 问题ID
 */
export async function incrementQuestionViewCount(questionId: string): Promise<void> {
  await supabase.rpc('increment_question_view', { question_id: questionId });
}

/**
 * 获取用户的问题列表
 * @param userId - 用户ID
 * @param page - 页码
 * @param pageSize - 每页数量
 */
export async function getUserQuestions(
  userId: string,
  page = 1,
  pageSize = 10
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('questions')
    .select(`
      id,
      title,
      created_at,
      answer_count,
      view_count,
      is_solved,
      status
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data, total: count || 0 };
}
