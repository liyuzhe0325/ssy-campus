// ============================
// 问答详情页
// 展示问题、回答列表，支持采纳、回答、点赞等
// 使用真实服务：questionService, likeService
// ============================

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToastStore } from '@/store/toastStore';
import { formatDate } from '@/utils/dateUtils';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import RichTextEditor from '@/components/common/RichTextEditor';
import AnswerItem from '@/components/questions/AnswerItem';
import SimilarQuestions from '@/components/questions/SimilarQuestions';
import { getQuestionById, addAnswer, acceptAnswer, incrementQuestionViewCount } from '@/services/questionService';
import { like, unlike, checkIsLiked } from '@/services/likeService';

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
    is_verified?: boolean;
  };
}

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  like_count: number;
  answer_count: number;
  is_solved: boolean;
  user_id: string;
  user?: {
    id: string;
    nickname: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
  tags?: { id: string; name: string }[];
  answers?: Answer[];
}

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToastStore();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取问题详情（包含答案）
        const data = await getQuestionById(id);
        setQuestion(data);
        setLikeCount(data.like_count || 0);
        setAnswers(data.answers || []);

        // 增加浏览量
        await incrementQuestionViewCount(id);

        // 检查当前用户是否已点赞
        if (user) {
          const liked = await checkIsLiked(user.id, 'question', id);
          setIsLiked(liked);
        }
      } catch (err: any) {
        setError(err.message || '获取问题失败');
        addToast({ type: 'error', message: '获取问题失败' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isLiked) {
        await unlike(user.id, 'question', id!);
        setLikeCount(prev => prev - 1);
        addToast({ type: 'success', message: '已取消点赞' });
      } else {
        await like(user.id, 'question', id!);
        setLikeCount(prev => prev + 1);
        addToast({ type: 'success', message: '点赞成功' });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      addToast({ type: 'error', message: '操作失败，请重试' });
    }
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!answerContent.trim()) return;

    setSubmitting(true);
    try {
      await addAnswer(id!, user.id, answerContent);
      // 重新获取答案列表
      const updated = await getQuestionById(id!);
      setAnswers(updated.answers || []);
      setAnswerContent('');
      addToast({ type: 'success', message: '回答提交成功' });
    } catch (error) {
      addToast({ type: 'error', message: '提交失败，请重试' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user) return;
    try {
      await acceptAnswer(id!, answerId, user.id);
      // 重新获取数据
      const updated = await getQuestionById(id!);
      setQuestion(updated);
      setAnswers(updated.answers || []);
      addToast({ type: 'success', message: '已采纳最佳答案' });
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || '采纳失败' });
    }
  };

  if (loading) return <Loading />;
  if (error || !question) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-text">问题不存在或已被删除</h1>
        <Button onClick={() => navigate('/questions')} className="mt-4">
          返回列表
        </Button>
      </div>
    );
  }

  const isQuestionOwner = user?.id === question.user_id;
  const sortedAnswers = [...answers].sort((a, b) => {
    // 最佳答案置顶
    if (a.is_accepted && !b.is_accepted) return -1;
    if (!a.is_accepted && b.is_accepted) return 1;
    // 然后按点赞数排序
    return (b.like_count || 0) - (a.like_count || 0);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* 主要内容区 */}
        <div className="flex-1 max-w-3xl">
          {/* 问题头部 */}
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-heading text-text mb-2">
              {question.title}
              {question.is_solved && (
                <span className="ml-3 text-sm bg-success/20 text-success px-3 py-1 rounded-full">
                  已解决
                </span>
              )}
            </h1>
            <div className="flex items-center text-text-secondary text-sm space-x-4">
              <Link to={`/profile/${question.user?.id}`} className="flex items-center space-x-2 hover:text-primary">
                {question.user?.avatar_url ? (
                  <img src={question.user.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20" />
                )}
                <span>{question.user?.nickname}</span>
              </Link>
              <span>·</span>
              <span>{formatDate(question.created_at)}</span>
              <span>·</span>
              <span>{question.view_count || 0} 浏览</span>
            </div>
          </header>

          {/* 问题内容 */}
          <div
            className="prose prose-invert max-w-none mb-6 p-6 bg-card rounded-card border border-border"
            dangerouslySetInnerHTML={{ __html: question.content }}
          />

          {/* 标签 */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.id}`}
                  className="px-3 py-1 bg-card border border-border rounded-full text-sm text-text-secondary hover:text-primary"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* 点赞按钮 */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-button border ${
                isLiked
                  ? 'border-primary text-primary'
                  : 'border-border text-text-secondary hover:text-text'
              }`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{likeCount}</span>
            </button>
          </div>

          {/* 回答列表 */}
          <div className="mb-8">
            <h2 className="text-xl font-heading text-text mb-4">
              {answers.length} 个回答
            </h2>
            {sortedAnswers.length > 0 ? (
              sortedAnswers.map((answer) => (
                <AnswerItem
                  key={answer.id}
                  answer={answer}
                  questionUserId={question.user_id}
                  onAccept={handleAcceptAnswer}
                  canAccept={isQuestionOwner && !question.is_solved}
                />
              ))
            ) : (
              <p className="text-text-secondary">还没有回答，快来抢沙发吧~</p>
            )}
          </div>

          {/* 撰写回答 */}
          {user ? (
            <div className="border border-border rounded-card p-4">
              <h3 className="text-text font-medium mb-3">撰写你的回答</h3>
              <RichTextEditor
                value={answerContent}
                onChange={setAnswerContent}
                placeholder="分享你的见解..."
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleSubmitAnswer}
                  loading={submitting}
                  disabled={!answerContent.trim()}
                >
                  提交回答
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 border border-border rounded-card">
              <p className="text-text-secondary mb-2">登录后可以回答</p>
              <Button onClick={() => navigate('/login')} variant="outline">
                去登录
              </Button>
            </div>
          )}
        </div>

        {/* 右侧边栏 */}
        <aside className="lg:w-80 space-y-6">
          <SimilarQuestions title={question.title} currentQuestionId={question.id} />
        </aside>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
