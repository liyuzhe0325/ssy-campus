// ============================
// 匿名树洞服务层：对接Supabase treehole_posts、treehole_replies（阶段二已建表）
// 核心特点：完全匿名，不关联profiles展示，仅保留user_id用于RLS权限
// 结构、错误处理、缓存完全对齐文章/问答/动态/贴吧
// 状态默认pending，展示approved
// ============================

import { supabase } from '@/config/supabase'
import { Database } from '@/types/supabase'

// 树洞列表请求参数（分页、状态）
export interface TreeholeListParams {
  page: number
  pageSize: number
  status?: 'pending' | 'approved' | 'rejected'
}

// 数据库类型直接映射
export type TreeholePost = Database['public']['Tables']['treehole_posts']['Row']
export type TreeholePostInsert = Database['public']['Tables']['treehole_posts']['Insert']
export type TreeholeReply = Database['public']['Tables']['treehole_replies']['Row']
export type TreeholeReplyInsert = Database['public']['Tables']['treehole_replies']['Insert']

/**
 * 获取树洞匿名帖子列表（仅展示approved）
 */
export const getTreeholePosts = async (params: TreeholeListParams) => {
  try {
    const { page, pageSize, status = 'approved' } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('treehole_posts')
      .select(`*`)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('[树洞服务] 获取列表错误：', err)
    return []
  }
}

/**
 * 获取单条树洞 + 匿名回复
 */
export const getTreeholePostById = async (postId: string) => {
  try {
    // 主贴
    const { data: post, error: pErr } = await supabase
      .from('treehole_posts')
      .select(`*`)
      .eq('id', postId)
      .single()

    if (pErr || !post) throw pErr

    // 回复
    const { data: replies, error: rErr } = await supabase
      .from('treehole_replies')
      .select(`*`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (rErr) throw rErr
    return { ...post, replies: replies || [] }
  } catch (err) {
    console.error('[树洞服务] 获取详情错误：', err)
    return null
  }
}

/**
 * 发布匿名树洞（无标题、纯内容、匿名）
 */
export const createTreeholePost = async (post: TreeholePostInsert) => {
  try {
    const { data, error } = await supabase
      .from('treehole_posts')
      .insert([{
        ...post,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('[树洞服务] 发布树洞错误：', err)
    return null
  }
}

/**
 * 匿名回复树洞
 */
export const createTreeholeReply = async (reply: TreeholeReplyInsert) => {
  try {
    const { data, error } = await supabase
      .from('treehole_replies')
      .insert([{
        ...reply,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('[树洞服务] 回复树洞错误：', err)
    return null
  }
}

/**
 * 删除树洞（仅作者/管理员，RLS控制）
 */
export const deleteTreeholePost = async (id: string) => {
  try {
    const { error } = await supabase
      .from('treehole_posts')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('[树洞服务] 删除树洞错误：', err)
    return false
  }
}

// 统一别名（保持全模块一致）
export const getTreeholeList = getTreeholePosts
export const getTreeholeDetail = getTreeholePostById
