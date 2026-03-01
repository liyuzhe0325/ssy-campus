// ============================
// 动态业务Hook：完全对齐useArticles、useQuestions结构
// 封装React Query，缓存、加载、错误、提交状态统一管理
// ============================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDynamics,
  getDynamicById,
  createDynamic,
  deleteDynamic,
  type DynamicListParams,
  type DynamicInsert
} from '@/services/dynamicService'
import { useAuth } from './useAuth'

export const useDynamics = (params: DynamicListParams) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // ==================== 1. 动态列表查询 ====================
  const {
    data: dynamics = [],
    isLoading: isLoadingDynamics,
    error: dynamicsError,
    refetch: refetchDynamics
  } = useQuery({
    queryKey: ['dynamics', params],
    queryFn: () => getDynamics(params),
    enabled: !!user,
    staleTime: 3 * 60 * 1000, // 动态时效性更高，3分钟缓存
  })

  // ==================== 2. 单条动态详情查询 ====================
  const useDynamicById = (id: string) => {
    return useQuery({
      queryKey: ['dynamic', id],
      queryFn: () => getDynamicById(id),
      enabled: !!id && !!user,
      staleTime: 5 * 60 * 1000,
    })
  }

  // ==================== 3. 发布动态Mutation ====================
  const createDynamicMutation = useMutation({
    mutationFn: (data: DynamicInsert) => createDynamic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamics'] })
    },
  })

  // ==================== 4. 删除动态Mutation ====================
  const deleteDynamicMutation = useMutation({
    mutationFn: (id: string) => deleteDynamic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamics'] })
    },
  })

  // ==================== 统一导出（和文章/问答完全同结构） ====================
  return {
    dynamics,
    isLoadingDynamics,
    dynamicsError,
    refetchDynamics,

    useDynamicById,

    createDynamic: createDynamicMutation.mutate,
    isCreatingDynamic: createDynamicMutation.isPending,
    createDynamicError: createDynamicMutation.error,

    deleteDynamic: deleteDynamicMutation.mutate,
    isDeletingDynamic: deleteDynamicMutation.isPending,
  }
}
