// ============================
// 标签服务：对接tags、article_tags、question_tags等
// 功能：标签列表、标签关联内容查询、热门标签
// ============================

import { supabase } from '@/config/supabase'

export const getTags = async () => {
  try {
    const { data } = await supabase.from('tags').select('*').order('use_count', { ascending: false })
    return data || []
  } catch (e) { return [] }
}

export const getPostsByTag = async (tagId: string) => {
  try {
    // 简化：只返回关联文章（后续可扩展全内容）
    const { data } = await supabase
      .from('article_tags')
      .select('article:article_id(*)')
      .eq('tag_id', tagId)
    return data?.map(i => i.article) || []
  } catch (e) { return [] }
}
