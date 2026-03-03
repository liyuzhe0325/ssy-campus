// ============================
// 问答// ============================
// 问答服务（扩展）
// 添加采纳答案、提交回答、相似问题等
// 依赖：supabase客户端
// ============================

import { supabase } from '@/config/supabase';
import { handleSupabaseRequest } from '@/config/supabase';

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
  // 先验证当前用户是否为提问者（可在hook中做，也可在RLS策略中做）
  // 这里假设由RLS保证

  // 开启事务（使用Supabase的rpc或顺序执行）
  // 1. 将问题的 is_solved 设为 true
  // 2. 将对应答案的 is_accepted 设为 true
  // 3. 将其他答案的 is_accepted 设为 false（可选）

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
  await handleSupabaseRequest(
    supabase.from('answers').insert({
      question_id: questionId,
      user_id: userId,
      content,
    })
  );
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
  // 使用 PostgreSQL 全文检索
  let query = supabase
    .from('questions')
    .select(`
      id,
      title,
      answer_count,
      created_at
    `)
    .eq('status', 'approved')
    .textSearch('title', title, { config: 'chinese' }) // 使用中文分词
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
