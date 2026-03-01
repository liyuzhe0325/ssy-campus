// 导入React Query核心钩子：查询、突变、缓存客户端
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// 导入文章服务层的所有接口函数
import { 
  getArticles, 
  getArticleById, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from '@/services/articleService'
// 导入文章相关类型定义
import type { Article, ArticleListParams } from '@/services/articleService'
// 导入用户认证Hook，用于判断登录状态
import { useAuth } from './useAuth'

/**
 * 文章业务逻辑封装Hook
 * 功能：统一管理文章的查询、创建、更新、删除操作，封装React Query缓存与状态
 * 适配：自动处理加载/错误状态，登录校验，缓存失效刷新
 */
export const useArticles = (params: ArticleListParams) => {
  // 获取当前登录用户信息
  const { user } = useAuth()
  // 获取QueryClient实例，用于手动控制缓存
  const queryClient = useQueryClient()

  // ==================== 1. 查询文章列表 ====================
  /**
   * 获取文章列表
   * 依赖：分页/筛选参数 + 登录状态
   * 缓存Key：['articles', params]，确保不同参数对应不同缓存
   */
  const {
    data: articles = [],          // 文章列表数据，默认空数组兜底
    isLoading: isLoadingArticles, // 加载状态
    error: articlesError,         // 错误信息
    refetch: refetchArticles      // 手动刷新列表
  } = useQuery({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
    enabled: !!user,               // 未登录时不发起请求
    staleTime: 5 * 60 * 1000,     // 5分钟内数据视为“新鲜”，避免重复请求
  })

  // ==================== 2. 查询单篇文章详情 ====================
  /**
   * 根据ID获取单篇文章详情
   * @param id 文章ID
   */
  const useArticleById = (id: string) => {
    return useQuery({
      queryKey: ['article', id],
      queryFn: () => getArticleById(id),
      enabled: !!id && !!user,     // 有ID且登录后才请求
      staleTime: 10 * 60 * 1000,  // 10分钟内数据视为“新鲜”
    })
  }

  // ==================== 3. 创建文章Mutation ====================
  /**
   * 创建新文章的Mutation
   * 成功后：失效文章列表缓存，触发列表自动刷新
   */
  const createArticleMutation = useMutation({
    mutationFn: (newArticle: Partial<Article>) => createArticle(newArticle),
    onSuccess: () => {
      // 使文章列表缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })

  // ==================== 4. 更新文章Mutation ====================
  /**
   * 更新文章的Mutation
   * @param id 要更新的文章ID
   * 成功后：同时失效列表和详情缓存
   */
  const updateArticleMutation = (id: string) => {
    return useMutation({
      mutationFn: (updatedArticle: Partial<Article>) => updateArticle(id, updatedArticle),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['articles'] })
        queryClient.invalidateQueries({ queryKey: ['article', id] })
      },
    })
  }

  // ==================== 5. 删除文章Mutation ====================
  /**
   * 删除文章的Mutation
   * 成功后：失效文章列表缓存
   */
  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })

  // ==================== 导出所有状态与方法 ====================
  return {
    // 列表查询相关
    articles,
    isLoadingArticles,
    articlesError,
    refetchArticles,
    // 单篇查询相关
    useArticleById,
    // 创建操作相关
    createArticle: createArticleMutation.mutate,
    isCreating: createArticleMutation.isPending,
    createError: createArticleMutation.error,
    // 更新操作相关（需传入ID）
    updateArticle: (id: string, data: Partial<Article>) => 
      updateArticleMutation(id).mutate(data),
    isUpdating: (id: string) => updateArticleMutation(id).isPending,
    updateError: (id: string) => updateArticleMutation(id).error,
    // 删除操作相关
    deleteArticle: deleteArticleMutation.mutate,
    isDeleting: deleteArticleMutation.isPending,
    deleteError: deleteArticleMutation.error,
  }
}
