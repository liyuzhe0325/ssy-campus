import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Comment {
  id: string
  user_id: string
  content: string
  parent_id: string | null
  created_at: string
  user?: {
    id: string
    username: string
    avatar: string | null
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment: (data: { content: string; parentId?: string | null }) => void
  onDeleteComment?: (commentId: string) => void
  isAdding?: boolean
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  onDeleteComment,
  isAdding = false,
}) => {
  const { user } = useAuth()
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null)
  const [commentContent, setCommentContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return
    onAddComment({
      content: commentContent,
      parentId: replyTo?.id,
    })
    setCommentContent('')
    setReplyTo(null)
  }

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: zhCN })
    } catch {
      return dateStr
    }
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mt-4'} p-4 bg-dark-700/30 rounded-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs text-primary-500">
            {comment.user?.username?.[0] || '匿'}
          </div>
          <span className="text-sm font-medium text-text-primary">{comment.user?.username || '匿名'}</span>
          <span className="text-xs text-text-secondary">{formatTime(comment.created_at)}</span>
        </div>
        {user?.id === comment.user_id && onDeleteComment && (
          <button
            onClick={() => onDeleteComment(comment.id)}
            className="text-xs text-danger hover:text-danger/80"
          >
            删除
          </button>
        )}
      </div>
      <p className="text-sm text-text-primary mt-2">{comment.content}</p>
      {!isReply && (
        <button
          onClick={() => setReplyTo({ id: comment.id, username: comment.user?.username || '匿名' })}
          className="text-xs text-primary-500 hover:text-primary-400 mt-2"
        >
          回复
        </button>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  )

  return (
    <div className="global-card">
      <h3 className="text-lg font-bold text-text-primary mb-4">评论区</h3>

      {comments.length === 0 ? (
        <p className="text-text-secondary text-sm py-4">暂无评论，快来抢沙发吧～</p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        {replyTo && (
          <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
            <span>回复 @{replyTo.username}</span>
            <button type="button" onClick={() => setReplyTo(null)} className="text-danger hover:text-danger/80">
              取消
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder={replyTo ? `回复 @${replyTo.username}...` : '写下你的评论...'}
            className="flex-1"
            disabled={isAdding}
          />
          <Button type="submit" variant="primary" disabled={isAdding || !commentContent.trim()}>
            {isAdding ? '发送中...' : '发表'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CommentSection
