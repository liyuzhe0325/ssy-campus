// src/services/articleService.ts
import { supabase } from '@/lib/supabase'

// ==================== 类型定义 ====================
export interface ArticleListParams {
  page: number
  pageSize: number
  category?: string
  authorId?: string
}

export interface ArticleAuthor {
  id: string
  username: string
  avatar?: string
  grade?: string
}

export interface Article {
  id: string
  title: string
  content: string
  summary?: string
  author_id: string
  created_at: string
  updated_at?: string
  view_count?: number
  like_count?: number
  comment_count?: number
  tags?: string[]
  profiles?: ArticleAuthor
}

// ==================== 核心导出函数（与 useArticles.ts 完全匹配） ====================

/**
 * 获取文章列表（对应导入的 getArticles）
 */
export const getArticles = async (params: ArticleListParams): Promise<Article[]> => {
  try {
    const { page, pageSize, category, authorId } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('articles')
      .select(`
        *,
        profiles:author_id (
          id,
          username,
          avatar,
          grade
        )
      `)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (category) {
      query = query.eq('category', category)
    }
    if (authorId) {
      query = query.eq('author_id', authorId)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('[articleService] getArticles error:', err)
    return []
  }
}

/**
 * 根据 ID 获取单篇文章（对应导入的 getArticleById）
 */
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        profiles:author_id (
          id, username, avatar, grade
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data || null
  } catch (err) {
    console.error('[articleService] getArticleById error:', err)
    return null
  }
}

/**
 * 创建新文章（对应导入的 createArticle）
 */
export const createArticle = async (article: Partial<Article>): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single()

    if (error) throw error
    return data || null
  } catch (err) {
    console.error('[articleService] createArticle error:', err)
    return null
  }
}

/**
 * 更新文章（对应导入的 updateArticle）
 */
export const updateArticle = async (id: string, article: Partial<Article>): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data || null
  } catch (err) {
    console.error('[articleService] updateArticle error:', err)
    return null
  }
}

/**
 * 删除文章（对应导入的 deleteArticle）
 */
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('[articleService] deleteArticle error:', err)
    return false
  }
}

// 兼容旧代码的别名（可选，确保向后兼容）
export const getArticleList = getArticles
export const getArticleDetail = getArticleById
// 获取推荐文章（基于标签相似度）
export const getRelatedArticles = async (articleId: string, tagIds: string[], limit = 3) => {
  try {
    // 查询具有相同标签的其他已审核文章，排除当前文章
    let query = supabase
      .from('articles')
      .select(`
        *,
        profiles:author_id (
          id, username, avatar, grade
        ),
        tags:article_tags (
          tag:tag_id (*)
        )
      `)
      .eq('status', 'approved')
      .neq('id', articleId)
      .order('created_at', { ascending: false })
      .limit(limit)

    // 如果有标签，优先匹配标签（使用contains过滤）
    if (tagIds && tagIds.length > 0) {
      // PostgreSQL中数组包含操作符 @>，这里用contains
      query = query.contains('tag_ids', tagIds)
    }

    const { data, error } = await query
    if (error) throw error

    // 格式化标签数据
    return (data || []).map(article => ({
      ...article,
      tags: article.tags?.map((t: any) => t.tag) || []
    }))
  } catch (err) {
    console.error('[文章服务] 获取推荐文章失败:', err)
    return []
  }
}
