// ============================
// 全局搜索服务：同时搜索文章、问答、动态、贴吧、新闻
// ============================

import { supabase } from '@/config/supabase'

export const globalSearch = async (keyword: string) => {
  if (!keyword.trim()) return { articles: [], questions: [], posts: [], dynamics: [] }
  const kw = `%${keyword}%`

  const [articles, questions, dynamics, posts] = await Promise.all([
    supabase.from('articles').select('*').ilike('title', kw).eq('status','approved').limit(6),
    supabase.from('questions').select('*').ilike('title', kw).eq('status','approved').limit(6),
    supabase.from('dynamics').select('*').ilike('content', kw).eq('status','approved').limit(6),
    supabase.from('posts').select('*').ilike('title', kw).eq('status','approved').limit(6),
  ])

  return {
    articles: articles.data || [],
    questions: questions.data || [],
    dynamics: dynamics.data || [],
    posts: posts.data || [],
  }
}
