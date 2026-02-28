import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from '@/services/articleService'
import { Article } from '@/types'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

// 获取文章列表
export const useArticles = (options?: Parameters<typeof getArticles>[0]) => {
  return useQuery({
    queryKey: ['articles', options],
    queryFn: () => getArticles(options),
  })
}

// 获取单篇文章
export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  })
}

// 创建文章
export const useCreateArticle = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: (article: Partial<Article>) => createArticle(article, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success('文章已提交，等待审核')
    },
    onError: (error: any) => {
      toast.error('发布失败：' + error.message)
    },
  })
}

// 更新文章
export const useUpdateArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Article> }) =>
      updateArticle(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['article', data.id] })
      toast.success('文章已更新')
    },
    onError: (error: any) => {
      toast.error('更新失败：' + error.message)
    },
  })
}

// 删除文章
export const useDeleteArticle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success('文章已删除')
    },
    onError: (error: any) => {
      toast.error('删除失败：' + error.message)
    },
  })
}
