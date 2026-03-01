// ============================
// 新闻业务Hook（完全对齐所有模块结构）
// ============================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNews,
  getNewsById,
  createNews,
  type NewsListParams,
  type NewsInsert
} from '@/services/newsService'
import { useAuth } from '@/hooks/useAuth'

export const useNews = (params: NewsListParams) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: newsList = [],
    isLoading: isLoadingNews,
    error: newsError,
    refetch: refetchNews
  } = useQuery({
    queryKey: ['news', params],
    queryFn: () => getNews(params),
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  })

  const useNewsById = (id: string) => useQuery({
    queryKey: ['news', id],
    queryFn: () => getNewsById(id),
    enabled: !!id && !!user,
  })

  const createNewsMutation = useMutation({
    mutationFn: (d: NewsInsert) => createNews(d),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news'] }),
  })

  return {
    newsList,
    isLoadingNews,
    newsError,
    refetchNews,
    useNewsById,
    createNews: createNewsMutation.mutate,
    isCreatingNews: createNewsMutation.isPending,
  }
}
