// ============================
// 问答服务层：对接Supabase questions + answers表
// 功能：问题列表/详情/发布、回答列表/发布，兼容阶段二所有表结构
// 状态：默认pending，审核通过为approved
// ============================

import { supabase } from '@/config/supabase'
import { Database } from '@/types/supabase'

// 问题列表请求参数（分页、筛选、状态）
export interface QuestionListParams {
  page: number
  pageSize: number
  category?: string
  authorId?: string
  status?: 'pending' | 'approved' | 'rejected'
}

// 问题 & 回答类型（直接对接数据库）
export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type Answer = Database['public']['Tables']['answers']['Row']
export type AnswerInsert = Database['public']['Tables']['answers']['Insert']

/**
 * 获取问题列表（默认只展示审核通过）
 */
export const getQuestions = async (params: QuestionListParams) => {
  try {
    const { page, pageSize, category, authorId, status = 'approved' } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('questions')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role),
        tags:question_tags (tag:tag_id (*))
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (category) query = query.eq('category', category)
    if (authorId) query = query.eq('author_id', authorId)

    const { data, error } = await query
    if (error) throw error

    // 格式化标签
    return data?.map(q => ({
      ...q,
      tags: q.tags?.map(t => t.tag) || []
    })) || []
  } catch (err) {
    console.error('[问答服务] 获取问题列表错误：', err)
    return []
  }
}

/**
 * 获取单个问题详情 + 对应所有回答
 */
export const getQuestionById = async (questionId: string) => {
  try {
    // 1. 获取问题本体
    const { data: question, error: qErr } = await supabase
      .from('questions')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role),
        tags:question_tags (tag:tag_id (*))
      `)
      .eq('id', questionId)
      .single()

    if (qErr || !question) throw qErr

    // 2. 获取该问题的所有回答（按时间正序）
    const { data: answers, error: aErr } = await supabase
      .from('answers')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role)
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })

    if (aErr) throw aErr

    // 3. 合并返回
    return {
      ...question,
      tags: question.tags?.map(t => t.tag) || [],
      answers: answers || []
    }
  } catch (err) {
    console.error('[问答服务] 获取问题详情错误：', err)
    return null
  }
}

/**
 * 发布新问题（默认pending待审核）
 */
export const createQuestion = async (question: QuestionInsert) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        ...question,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('[问答服务] 发布问题错误：', err)
    return null
  }
}

/**
 * 发布回答（对接answers表）
 */
export const createAnswer = async (answer: AnswerInsert) => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .insert([{
        ...answer,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('[问答服务] 发布回答错误：', err)
    return null
  }
}

/**
 * 删除问题（仅作者/管理员）
 */
export const deleteQuestion = async (id: string) => {
  try {
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('[问答服务] 删除问题错误：', err)
    return false
  }
}

// 兼容别名（统一风格）
export const getQuestionList = getQuestions
export const getQuestionDetail = getQuestionById
