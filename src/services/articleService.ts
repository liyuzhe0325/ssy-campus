import { supabase } from '@/config/supabase'
import { Article } from '@/types'

// 获取文章列表（默认只显示已审核通过的）
export const getArticles = async (options?: {
  category?: string
  tag?: string
  authorId?: string
  limit?: number
}) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      author:profiles!author_id(*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.tag) {
    query = query.contains('tags', [options.tag])
  }
  if (options?.authorId) {
    query = query.eq('author_id', options.authorId)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as (Article & { author: Profile })[]
}

// 获取单篇文章详情
export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!author_id(*)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Article & { author: Profile }
}

// 创建新文章（默认状态为 pending）
export const createArticle = async (article: Partial<Article>, authorId: string) => {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...article,
      author_id: authorId,
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// 更新文章
export const updateArticle = async (id: string, updates: Partial<Article>) => {
  const { data, error } = await supabase
    .from('articles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// 删除文章
export const deleteArticle = async (id: string) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
  if (error) throw error
}
