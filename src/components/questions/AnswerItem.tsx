// ============================
// 回答项组件
// 用于问答详情页，展示单个回答
// 包含采纳按钮、专家标识、点赞、楼中楼等
// 依赖：useAuth, likeService（待实现）
// 样式：使用主题变量
// ============================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from '@/utils/dateUtils';
import Avatar from '@/components/common/Avatar'; // 假设已有
import Button from '@/components/common/Button';
import CommentSection from '@/components/comments/CommentSection'; // 复用评论组件（楼中楼）

interface Answer {
  id: string;
  content: string;
  created_at: string;
  like_count: number;
  is_accepted: boolean;
  user: {
    id: string;
    nickname: string;
    avatar_url?: string;
    is_verified?: boolean; // 是否认证学长/老师
  };
}

interface AnswerItemProps {
  answer: Answer;
  questionUserId: string; // 提问者ID，用于判断是否显示采纳按钮
  onAccept?: (answerId: string) => Promise<void>; // 采纳回调
  canAccept: boolean; // 当前用户是否有权采纳（通常是提问者）
}

const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  questionUserId,
  onAccept,
  canAccept,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(answer.like_count);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    // TODO: 调用点赞服务
    if (isLiked) {
      // await unlikeAnswer(answer.id);
      setLikeCount(prev => prev - 1);
    } else {
      // await likeAnswer(answer.id);
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsAccepting(true);
    try {
      await onAccept(answer.id);
    } catch (error) {
      console.error('采纳失败', error);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div
      className={`p-6 rounded-card border ${
        answer.is_accepted
          ? 'border-success bg-success/5'
          : 'border-border bg-card'
      } mb-4`}
    >
      {/* 回答头部：作者信息 + 采纳标识 + 时间 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${answer.user.id}`}>
            <Avatar
              src={answer.user.avatar_url}
              alt={answer.user.nickname}
              size="sm"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${answer.user.id}`}
              className="text-text font-medium hover:text-primary"
            >
              {answer.user.nickname}
              {answer.user.is_verified && (
                <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  认证学长
                </span>
              )}
            </Link>
            <p className="text-text-secondary text-xs">
              {formatDistanceToNow(answer.created_at)}
            </p>
          </div>
        </div>
        {answer.is_accepted && (
          <span className="text-success text-sm font-medium flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            最佳答案
          </span>
        )}
      </div>

      {/* 回答内容 */}
      <div
        className="prose prose-invert max-w-none mb-4"
        dangerouslySetInnerHTML={{ __html: answer.content }}
      />

      {/* 操作栏：点赞 + 采纳按钮 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 text-sm ${
            isLiked ? 'text-primary' : 'text-text-secondary hover:text-text'
          }`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>

        {canAccept && !answer.is_accepted && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAccept}
            loading={isAccepting}
          >
            采纳为最佳答案
          </Button>
        )}
      </div>

      {/* 楼中楼评论区（复用评论组件） */}
      <div className="mt-4 pt-4 border-t border-border">
        <CommentSection targetType="answer" targetId={answer.id} />
      </div>
    </div>
  );
};

export default AnswerItem;
