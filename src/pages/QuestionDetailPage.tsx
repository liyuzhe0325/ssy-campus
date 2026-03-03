// ============================
// 问答详情页
// 展示问题内容、回答列表，支持采纳最佳答案、回答等功能
// 依赖：useQuestion hook，AnswerItem组件
// 样式：使用主题变量
// ============================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuestion } from '@/hooks/useQuestion';
import { formatDate } from '@/utils/dateUtils';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import RichTextEditor from '@/components/common/RichTextEditor'; // 假设有富文本编辑器
import AnswerItem from '@/components/questions/AnswerItem';
import SimilarQuestions from '@/components/questions/SimilarQuestions';

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    question,
    loading,
    error,
    acceptAnswer,
    addAnswer,
    likeQuestion,
    unlikeQuestion,
  } = useQuestion(id!);

  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (question) {
      setLikeCount(question.like_count || 0);
      setIsLiked(question.user_liked || false);
    }
  }, [question]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isLiked) {
        await unlikeQuestion(id!);
        setLikeCount(prev => prev - 1);
      } else {
        await likeQuestion(id!);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('点赞失败', error);
    }
  };

  const handleAccept = async (answerId: string) => {
    try {
      await acceptAnswer(answerId);
    } catch (error) {
      console.error('采纳失败', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) return;
    setSubmitting(true);
    try {
      await addAnswer(answerContent);
      setAnswerContent('');
      // 可刷新回答列表，但 useQuestion 可能已自动更新
    } catch (error) {
      console.error('提交回答失败', error);
    } finally {
      setSubmitting(false);
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
  const sortedAnswers = question.answers?.sort((a: any, b: any) => {
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
                <span>
                  {question.user?.nickname}
                  {question.is_anonymous && '（匿名）'}
                </span>
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
              {question.tags.map((tag: any) => (
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
              {question.answer_count || 0} 个回答
            </h2>
            {sortedAnswers && sortedAnswers.length > 0 ? (
              sortedAnswers.map((answer: any) => (
                <AnswerItem
                  key={answer.id}
                  answer={answer}
                  questionUserId={question.user_id}
                  onAccept={handleAccept}
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
          {/* 相似问题 */}
          <SimilarQuestions title={question.title} currentQuestionId={question.id} />

          {/* 可添加其他组件如问题状态、分享等 */}
        </aside>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
