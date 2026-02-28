import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'
import { Comment, Profile } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Props {
  targetType: string
  targetId: string
}

// 获取评论
const fetchComments = async (targetType: string, targetId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as (Comment & { author: Profile })[]
}

// 发布评论
const postComment = async (userId: string, targetType: string, targetId: string, content: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      author_id: userId,
      target_type: targetType,
      target_id: targetId,
      content,
      status: 'approved', // 直接通过，不审核
    })
    .select()
    .single()
  if (error) throw error
  return data
}

const CommentSection: React.FC<Props> = ({ targetType, targetId }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', targetType, targetId],
    queryFn: () => fetchComments(targetType, targetId),
  })

  const mutation = useMutation({
    mutationFn: (content: string) => postComment(user!.id, targetType, targetId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', targetType, targetId] })
      setNewComment('')
      toast.success('评论成功')
    },
    onError: (error: any) => {
      toast.error('评论失败：' + error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('请先登录')
      return
    }
    if (!newComment.trim()) return
    mutation.mutate(newComment)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">评论 ({comments?.length || 0})</h3>
      {user ? (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="flex-1"
          />
          <Button type="submit" size="sm" isLoading={mutation.isPending}>
            发布
          </Button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">请<a href="/login" className="text-primary-600">登录</a>后评论</p>
      )}
      <div className="space-y-3 mt-4">
        {isLoading && <div>加载评论...</div>}
        {comments?.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium">{comment.author?.username || '匿名'}</span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: zhCN })}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
        {comments?.length === 0 && (
          <p className="text-gray-400 text-center py-4">还没有评论，来说两句吧~</p>
        )}
      </div>
    </div>
  )
}

export default CommentSection
