// ============================
// 贴吧业务Hook - 无限滚动版
// 功能：帖子无限滚动列表 + 单帖查询 + 发帖/回复/删除操作
// ============================

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getPosts,
  getPostById,
  createPost,
  createReply,
  deletePost,
  type PostInsert,
  type ReplyInsert
} from '@/services/postService'
import { useAuth } from './useAuth'

export const usePosts = (pageSize: number = 10) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // ========== 帖子列表（无限滚动） ==========
  const postsInfiniteQuery = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => getPosts({ page: pageParam, pageSize }),
    getNextPageParam: (lastPage, allPages) => {
      // 如果返回的数据少于 pageSize，说明没有更多
      return lastPage.length < pageSize ? undefined : allPages.length + 1
    },
    initialPageParam: 1,
    enabled: !!user,
    staleTime: 4 * 60 * 1000,
  })

  // ========== 单帖详情 ==========
  const usePostById = (id: string) => {
    return useQuery({
      queryKey: ['post', id],
      queryFn: () => getPostById(id),
      enabled: !!id && !!user,
      staleTime: 8 * 60 * 1000,
    })
  }

  // ========== 发帖 ==========
  const createPostMutation = useMutation({
    mutationFn: (data: PostInsert) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'infinite'] })
    },
  })

  // ========== 回复 ==========
  const createReplyMutation = useMutation({
    mutationFn: (data: ReplyInsert) => createReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.post_id] })
      // 回复后帖子列表的回复数变化，也可以考虑刷新列表
      queryClient.invalidateQueries({ queryKey: ['posts', 'infinite'] })
    },
  })

  // ========== 删帖 ==========
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'infinite'] })
    },
  })

  return {
    // 无限滚动相关
    postsPages: postsInfiniteQuery.data?.pages,
    fetchNextPage: postsInfiniteQuery.fetchNextPage,
    hasNextPage: postsInfiniteQuery.hasNextPage,
    isFetchingNextPage: postsInfiniteQuery.isFetchingNextPage,
    isLoading: postsInfiniteQuery.isLoading,
    error: postsInfiniteQuery.error,
    refetch: postsInfiniteQuery.refetch,

    // 单帖查询
    usePostById,

    // 发帖
    createPost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,

    // 回复
    createReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,

    // 删帖
    deletePost: deletePostMutation.mutate,
    isDeletingPost: deletePostMutation.isPending,
  }
}
