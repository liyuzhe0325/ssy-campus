// ============================
// 文章服务（扩展）
// 添加相关文章、作者文章等方法
// 依赖：supabase客户端
// ============================

import { supabase } from '@/config/supabase';
import { handleSupabaseRequest } from '@/config/supabase';

// 假设已有 getArticles, getArticleById 等方法，现在添加以下：

/**
 * 获取作者的其他文章
 * @param authorId - 作者ID
 * @param options - 可选参数：排除文章ID、限制数量
 */
export async function getArticlesByAuthor(
  authorId: string,
  options?: { excludeId?: string; limit?: number }
) {
  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      summary,
      cover_url,
      created_at,
      view_count,
      like_count,
      comment_count
    `)
    .eq('user_id', authorId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (options?.excludeId) {
    query = query.neq('id', options.excludeId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const data = await handleSupabaseRequest(query);
  return data;
}

/**
 * 获取相关文章（基于标签）
 * @param articleId - 当前文章ID（用于排除自身）
 * @param tagIds - 标签ID数组
 * @param limit - 返回数量
 */
export async function getRelatedArticles(
  articleId: string,
  tagIds: string[],
  limit = 3
) {
  if (tagIds.length === 0) return [];

  // 查询包含任意相同标签且已审核的文章，排除自身
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      summary,
      cover_url,
      created_at,
      user_id,
      profiles:user_id (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('status', 'approved')
    .neq('id', articleId)
    .overlaps('tag_ids', tagIds) // 假设 tag_ids 是数组字段
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * 增加文章浏览量
 * @param articleId - 文章ID
 */
export async function incrementViewCount(articleId: string): Promise<void> {
  // 使用 RPC 函数原子增加，或者直接 update
  await supabase.rpc('increment_article_view', { article_id: articleId });
}
