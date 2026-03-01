// ============================
// 树洞业务Hook：完全对齐全项目Hook结构
// 匿名、无用户信息展示、缓存/加载/提交状态统一
// ============================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTreeholePosts,
  getTreeholePostById,
  createTreeholePost,
  createTreeholeReply,
  deleteTreeholePost,
  type TreeholeListParams,
  type TreeholePostInsert,
  type TreeholeReplyInsert
} from '@/services/treeholeService'
import { useAuth } from '@/hooks/useAuth'

export const useTreehole = (params: TreeholeListParams) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // 树洞列表查询
  const {
    data: treeholePosts = [],
    isLoading: isLoadingTreehole,
    error: treeholeError,
    refetch: refetchTreehole
  } = useQuery({
    queryKey: ['treehole', params],
    queryFn: () => getTreeholePosts(params),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  // 单条树洞查询
  const useTreeholeById = (id: string) => {
    return useQuery({
      queryKey: ['treehole', id],
      queryFn: () => getTreeholePostById(id),
      enabled: !!id && !!user,
      staleTime: 8 * 60 * 1000,
    })
  }

  // 发布树洞Mutation
  const createPostMutation = useMutation({
    mutationFn: (data: TreeholePostInsert) => createTreeholePost(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['treehole'] }),
  })

  // 回复树洞Mutation
  const createReplyMutation = useMutation({
    mutationFn: (data: TreeholeReplyInsert) => createTreeholeReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['treehole', variables.post_id] })
    },
  })

  // 删除树洞Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTreeholePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['treehole'] }),
  })

  return {
    treeholePosts,
    isLoadingTreehole,
    treeholeError,
    refetchTreehole,

    useTreeholeById,

    createTreeholePost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,

    createTreeholeReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,

    deleteTreeholePost: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}
