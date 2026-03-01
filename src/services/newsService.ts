// ============================
// 新闻服务层：对接Supabase news表（阶段二已建表）
// 特点：仅管理员/官方发布，普通用户只读，状态默认approved
// 结构、缓存、错误处理完全对齐所有内容模块
// ============================

import { supabase } from '@/config/supabase'
import { Database } from '@/types/supabase'

export interface NewsListParams {
  page: number
  pageSize: number
  category?: '校园' | '升学' | '行业' | '政策'
  status?: 'pending' | 'approved'
}

export type News = Database['public']['Tables']['news']['Row']
export type NewsInsert = Database['public']['Tables']['news']['Insert']

/**
 * 获取新闻列表（默认直接展示approved）
 */
export const getNews = async (params: NewsListParams) => {
  try {
    const { page, pageSize, category, status = 'approved' } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('news')
      .select(`*, profiles:author_id(*)`)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('[新闻服务] 获取错误：', err)
    return []
  }
}

/**
 * 单条新闻详情
 */
export const getNewsById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select(`*, profiles:author_id(*)`)
      .eq('id', id)
      .single()

    if (error) throw error
    return data || null
  } catch (err) {
    console.error('[新闻服务] 详情错误：', err)
    return null
  }
}

/**
 * 发布新闻（仅管理员）
 */
export const createNews = async (news: NewsInsert) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([{ ...news, created_at: new Date().toISOString(), status: 'approved' }])
      .select()
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.error('[新闻服务] 发布错误：', err)
    return null
  }
}

// 别名统一
export const getNewsList = getNews
export const getNewsDetail = getNewsById
