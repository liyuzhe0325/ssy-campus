// ============================
// 动态服务层：对接Supabase dynamics表（阶段二已建表）
// 功能：动态列表查询、发布、详情、删除，默认pending审核
// 完全对齐文章/问答服务结构，统一缓存、错误处理
// ============================

import { supabase } from '@/config/supabase'
import { Database } from '@/types/supabase'

// 动态列表请求参数（分页、用户筛选、审核状态）
export interface DynamicListParams {
  page: number
  pageSize: number
  authorId?: string
  status?: 'pending' | 'approved' | 'rejected'
}

// 动态类型（直接对接数据库，兼容你现有types）
export type Dynamic = Database['public']['Tables']['dynamics']['Row']
export type DynamicInsert = Database['public']['Tables']['dynamics']['Insert']

/**
 * 获取动态列表（默认只展示已审核approved）
 */
export const getDynamics = async (params: DynamicListParams) => {
  try {
    const { page, pageSize, authorId, status = 'approved' } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('dynamics')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (authorId) query = query.eq('author_id', authorId)

    const { data, error } = await query
    if (error) throw error

    return data || []
  } catch (err) {
    console.error('[动态服务] 获取列表错误：', err)
    return []
  }
}

/**
 * 获取单条动态详情（后续扩展详情页用）
 */
export const getDynamicById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('dynamics')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data || null
  } catch (err) {
    console.error('[动态服务] 获取详情错误：', err)
    return null
  }
}

/**
 * 发布新动态（默认pending待审核）
 */
export const createDynamic = async (dynamic: DynamicInsert) => {
  try {
    const { data, error } = await supabase
      .from('dynamics')
      .insert([{
        ...dynamic,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('[动态服务] 发布动态错误：', err)
    return null
  }
}

/**
 * 删除动态（仅作者/管理员）
 */
export const deleteDynamic = async (id: string) => {
  try {
    const { error } = await supabase.from('dynamics').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('[动态服务] 删除动态错误：', err)
    return false
  }
}

// 统一别名（和文章/问答保持一致）
export const getDynamicList = getDynamics
export const getDynamicDetail = getDynamicById
