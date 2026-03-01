// ============================
// 问答业务Hook：封装React Query，管理问题/回答的查询、发布、缓存
// 完全对齐useArticles结构，便于维护和扩展
// ============================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  createAnswer,
  deleteQuestion,
  type QuestionListParams,
  type QuestionInsert,
  type AnswerInsert
} from '@/services/questionService'
import { useAuth } from './useAuth'

export const useQuestions = (params: QuestionListParams) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // ==================== 1. 问题列表查询 ====================
  const {
    data: questions = [],
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions
  } = useQuery({
    queryKey: ['questions', params],
    queryFn: () => getQuestions(params),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  // ==================== 2. 单个问题详情查询 ====================
  const useQuestionById = (id: string) => {
    return useQuery({
      queryKey: ['question', id],
      queryFn: () => getQuestionById(id),
      enabled: !!id && !!user,
      staleTime: 10 * 60 * 1000,
    })
  }

  // ==================== 3. 发布问题Mutation ====================
  const createQuestionMutation = useMutation({
    mutationFn: (data: QuestionInsert) => createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    },
  })

  // ==================== 4. 发布回答Mutation ====================
  const createAnswerMutation = useMutation({
    mutationFn: (data: AnswerInsert) => createAnswer(data),
    onSuccess: (_, variables) => {
      // 刷新当前问题详情
      queryClient.invalidateQueries({ queryKey: ['question', variables.question_id] })
    },
  })

  // ==================== 5. 删除问题Mutation ====================
  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    },
  })

  // ==================== 统一导出 ====================
  return {
    // 列表
    questions,
    isLoadingQuestions,
    questionsError,
    refetchQuestions,
    // 详情
    useQuestionById,
    // 发布问题
    createQuestion: createQuestionMutation.mutate,
    isCreatingQuestion: createQuestionMutation.isPending,
    createQuestionError: createQuestionMutation.error,
    // 发布回答
    createAnswer: createAnswerMutation.mutate,
    isCreatingAnswer: createAnswerMutation.isPending,
    // 删除问题
    deleteQuestion: deleteQuestionMutation.mutate,
    isDeletingQuestion: deleteQuestionMutation.isPending,
  }
}
