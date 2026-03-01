// ============================
// 贴吧服务层：对接Supabase posts + replies表（阶段二已建表）
// 结构、缓存、错误处理完全对齐文章/问答/动态，统一规范
// 状态默认pending，展示approved，支持发帖、回帖、列表、删除
// ============================

import { supabase } from '@/config/supabase'
import { Database } from '@/types/supabase'

// 贴吧列表请求参数
export interface PostListParams {
  page: number
  pageSize: number
  board?: string
  authorId?: string
  status?: 'pending' | 'approved' | 'rejected'
}

// 类型直接对接数据库
export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type Reply = Database['public']['Tables']['replies']['Row']
export type ReplyInsert = Database['public']['Tables']['replies']['Insert']

/**
 * 获取贴吧帖子列表
 */
export const getPosts = async (params: PostListParams) => {
  try {
    const { page, pageSize, board, authorId, status = 'approved' } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (board) query = query.eq('board', board)
    if (authorId) query = query.eq('author_id', authorId)

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('[贴吧服务] 获取帖子列表错误：', err)
    return []
  }
}

/**
 * 获取单贴详情 + 所有回复
 */
export const getPostById = async (postId: string) => {
  try {
    // 获取帖子
    const { data: post, error: pErr } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role)
      `)
      .eq('id', postId)
      .single()

    if (pErr || !post) throw pErr

    // 获取回复
    const { data: replies, error: rErr } = await supabase
      .from('replies')
      .select(`
        *,
        profiles:author_id (id, username, avatar, grade, role)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (rErr) throw rErr
    return { ...post, replies: replies || [] }
  } catch (err) {
    console.error('[贴吧服务] 获取帖子详情错误：', err)
    return null
  }
}

/**
 * 发布帖子（默认pending）
 */
export const createPost = async (post: PostInsert) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ ...post, status: 'pending', created_at: new Date().toISOString() }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('[贴吧服务] 发布帖子错误：', err)
    return null
  }
}

/**
 * 发布回复
 */
export const createReply = async (reply: ReplyInsert) => {
  try {
    const { data, error } = await supabase
      .from('replies')
      .insert([{ ...reply, created_at: new Date().toISOString() }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('[贴吧服务] 发布回复错误：', err)
    return null
  }
}

/**
 * 删除帖子
 */
export const deletePost = async (id: string) => {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('[贴吧服务] 删除帖子错误：', err)
    return false
  }
}

// 统一别名
export const getPostList = getPosts
export const getPostDetail = getPostById
