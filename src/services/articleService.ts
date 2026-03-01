import { supabase } from '@/lib/supabase'

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

export interface ArticleItem {
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

export const getArticleList = async (params: ArticleListParams): Promise<ArticleItem[]> => {
  try {
    const { page, pageSize } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error } = await supabase
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

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('[articleService] getArticleList error:', err)
    return []
  }
}

export const getArticleDetail = async (id: string): Promise<ArticleItem | null> => {
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
    console.error('[articleService] getArticleDetail error:', err)
    return null
  }
}

export const createArticle = async (article: Partial<ArticleItem>): Promise<ArticleItem | null> => {
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
