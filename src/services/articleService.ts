// ============================
// 文章服务
// 处理文章的获取、创建、更新、删除等
// 依赖：supabase客户端
// ============================

import { supabase } from '@/config/supabase';
import { handleSupabaseRequest } from '@/config/supabase';

/**
 * 获取文章列表（分页、筛选）
 * @param params - 查询参数
 */
export async function getArticles(params?: {
  page?: number;
  pageSize?: number;
  tagId?: string;
  search?: string;
}) {
  const { page = 1, pageSize = 10, tagId, search } = params || {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        id,
        nickname,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (tagId) {
    query = query.contains('tag_ids', [tagId]);
  }

  if (search) {
    query = query.textSearch('title', search, { config: 'chinese' });
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { data, total: count || 0 };
}

// 为兼容 HomePage 的导入，添加 getArticleList 别名
export const getArticleList = getArticles;

/**
 * 获取单篇文章详情
 * @param id - 文章ID
 */
export async function getArticleById(id: string) {
  const data = await handleSupabaseRequest(
    supabase
      .from('articles')
      .select(`
        *,
        author:author_id (
          id,
          nickname,
          avatar_url,
          bio
        ),
        tags:tag_ids (
          id,
          name,
          color
        )
      `)
      .eq('id', id)
      .single()
  );
  return data;
}

/**
 * 创建新文章
 * @param userId - 用户ID
 * @param article - 文章数据
 */
export async function createArticle(
  userId: string,
  article: {
    title: string;
    content: string;
    summary?: string;
    cover_url?: string;
    tag_ids?: string[];
  }
) {
  const data = await handleSupabaseRequest(
    supabase
      .from('articles')
      .insert({
        user_id: userId,
        ...article,
        status: 'pending',
      })
      .select()
      .single()
  );
  return data;
}

/**
 * 更新文章
 * @param id - 文章ID
 * @param userId - 用户ID（权限验证）
 * @param updates - 更新字段
 */
export async function updateArticle(
  id: string,
  userId: string,
  updates: Partial<{
    title: string;
    content: string;
    summary: string;
    cover_url: string;
    tag_ids: string[];
  }>
) {
  const data = await handleSupabaseRequest(
    supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
  );
  return data;
}

/**
 * 删除文章
 * @param id - 文章ID
 * @param userId - 用户ID
 */
export async function deleteArticle(id: string, userId: string) {
  await handleSupabaseRequest(
    supabase
      .from('articles')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
  );
}

/**
 * 获取作者的其他文章
 * @param authorId - 作者ID
 * @param options - 可选参数
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
 * @param articleId - 当前文章ID
 * @param tagIds - 标签ID数组
 * @param limit - 返回数量
 */
export async function getRelatedArticles(
  articleId: string,
  tagIds: string[],
  limit = 3
) {
  if (tagIds.length === 0) return [];

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      summary,
      cover_url,
      created_at,
      profiles:author_id (
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('status', 'approved')
    .neq('id', articleId)
    .overlaps('tag_ids', tagIds)
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
  await supabase.rpc('increment_article_view', { article_id: articleId });
}

/**
 * 获取用户文章列表
 * @param userId - 用户ID
 * @param page - 页码
 * @param pageSize - 每页数量
 */
export async function getUserArticles(
  userId: string,
  page = 1,
  pageSize = 10
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      created_at,
      view_count,
      like_count,
      comment_count,
      status
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data, total: count || 0 };
}
