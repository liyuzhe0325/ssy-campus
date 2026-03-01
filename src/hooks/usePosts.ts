// ============================
// 贴吧业务Hook：完全对齐useArticles/useQuestions/useDynamics结构
// 缓存、加载、提交、删除状态统一管理
// ============================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPosts,
  getPostById,
  createPost,
  createReply,
  deletePost,
  type PostListParams,
  type PostInsert,
  type ReplyInsert
} from '@/services/postService'
import { useAuth } from './useAuth'

export const usePosts = (params: PostListParams) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // 帖子列表查询
  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    enabled: !!user,
    staleTime: 4 * 60 * 1000,
  })

  // 单贴详情查询
  const usePostById = (id: string) => {
    return useQuery({
      queryKey: ['post', id],
      queryFn: () => getPostById(id),
      enabled: !!id && !!user,
      staleTime: 8 * 60 * 1000,
    })
  }

  // 发帖Mutation
  const createPostMutation = useMutation({
    mutationFn: (data: PostInsert) => createPost(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  // 回复Mutation
  const createReplyMutation = useMutation({
    mutationFn: (data: ReplyInsert) => createReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.post_id] })
    },
  })

  // 删帖Mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  return {
    posts,
    isLoadingPosts,
    postsError,
    refetchPosts,

    usePostById,

    createPost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,

    createReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,

    deletePost: deletePostMutation.mutate,
    isDeletingPost: deletePostMutation.isPending,
  }
}
