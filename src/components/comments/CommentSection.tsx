// ============================
// 评论区组件（临时简化版）
// 显示评论列表和提交表单
// 依赖：useAuth, commentService（待实现）
// ============================

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToastStore } from '@/store/toastStore';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    nickname: string;
    avatar_url?: string;
  };
  like_count?: number;
  reply_count?: number;
}

interface CommentSectionProps {
  targetType: string; // 'article', 'question', 'post' 等
  targetId: string;
}

// 临时模拟数据函数，实际应调用服务
const fetchComments = async (targetType: string, targetId: string): Promise<Comment[]> => {
  // TODO: 替换为真实 API 调用
  return [
    {
      id: '1',
      content: '这是一条示例评论',
      created_at: new Date().toISOString(),
      user: {
        id: 'u1',
        nickname: '学长小明',
        avatar_url: '',
      },
    },
  ];
};

const submitComment = async (targetType: string, targetId: string, content: string, userId: string) => {
  // TODO: 替换为真实 API 调用
  console.log('提交评论', { targetType, targetId, content, userId });
  return { id: Date.now().toString() };
};

const CommentSection: React.FC<CommentSectionProps> = ({ targetType, targetId }) => {
  const { user } = useAuth();
  const { addToast } = useToastStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [targetType, targetId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await fetchComments(targetType, targetId);
      setComments(data);
    } catch (error) {
      addToast({ type: 'error', message: '加载评论失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      addToast({ type: 'info', message: '请先登录' });
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await submitComment(targetType, targetId, newComment, user.id);
      setNewComment('');
      addToast({ type: 'success', message: '评论成功' });
      // 重新加载评论
      loadComments();
    } catch (error) {
      addToast({ type: 'error', message: '提交失败' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-text-secondary text-center py-4">加载评论...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-text font-heading text-xl mb-4">评论</h3>
      
      {/* 评论列表 */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-text-secondary">暂无评论，快来抢沙发吧~</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-card p-4">
              <div className="flex items-start space-x-3">
                <Avatar src={comment.user.avatar_url} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-text font-medium">{comment.user.nickname}</span>
                    <span className="text-text-secondary text-xs">
                      {formatDistanceToNow(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-text mt-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 评论输入框 */}
      {user ? (
        <div className="flex items-start space-x-3">
          <Avatar src={user.user_metadata?.avatar_url} size="sm" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              className="w-full p-3 bg-card border border-border rounded-input text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSubmit}
                loading={submitting}
                disabled={!newComment.trim()}
                size="sm"
              >
                发表评论
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 border border-border rounded-card">
          <p className="text-text-secondary">登录后可以发表评论</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
