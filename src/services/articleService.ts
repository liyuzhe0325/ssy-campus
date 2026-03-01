// src/services/articleService.ts
import { supabase } from '@/lib/supabase';

// ==================== 类型定义 ====================
/**
 * 获取文章列表的请求参数
 */
export interface ArticleListParams {
  page: number;
  pageSize: number;
  category?: string;
  authorId?: string;
}

/**
 * 文章作者信息
 */
export interface ArticleAuthor {
  id: string;
  username: string;
  avatar?: string;
  grade?: string;
}

/**
 * 单篇文章的数据结构
 */
export interface ArticleItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author_id: string;
  created_at: string;
  updated_at?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  tags?: string[];
  profiles?: ArticleAuthor;
}

// ==================== 核心导出函数（与 HomePage.tsx 完全匹配） ====================
/**
 * 获取文章列表（HomePage.tsx 中使用的核心函数）
 */
export const getArticleList = async (params: ArticleListParams): Promise<ArticleItem[]> => {
  const { page, pageSize, category, authorId } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

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
    .range(from, to);

  if (category) {
    query = query.eq('category', category);
  }
  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取文章列表失败:', error);
    throw new Error(`获取文章列表失败: ${error.message}`);
  }

  return data as ArticleItem[];
};

// ==================== 其他文章相关接口（可选，用于后续扩展） ====================
/**
 * 根据 ID 获取单篇文章详情
 */
export const getArticleDetail = async (id: string): Promise<ArticleItem> => {
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
    .eq('id', id)
    .single();

  if (error) {
    console.error('获取文章详情失败:', error);
    throw new Error(`获取文章详情失败: ${error.message}`);
  }

  return data as ArticleItem;
};

/**
 * 创建新文章
 */
export const createArticle = async (article: Omit<ArticleItem, 'id' | 'created_at' | 'updated_at'>): Promise<ArticleItem> => {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) {
    console.error('创建文章失败:', error);
    throw new Error(`创建文章失败: ${error.message}`);
  }

  return data as ArticleItem;
};
