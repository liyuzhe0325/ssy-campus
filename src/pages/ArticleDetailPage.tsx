// ============================
// 文章详情页
// 整合阅读进度条、目录、作者卡片、相关推荐等组件
// 使用真实服务：likeService, articleService, followService
// ============================

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToastStore } from '@/store/toastStore';
import { getArticleById, incrementViewCount, getRelatedArticles } from '@/services/articleService';
import { like, unlike, checkIsLiked } from '@/services/likeService';
import { formatDate } from '@/utils/dateUtils';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import CommentSection from '@/components/comments/CommentSection';
import ReadingProgress from '@/components/articles/ReadingProgress';
import TableOfContents from '@/components/articles/TableOfContents';
import AuthorCard from '@/components/articles/AuthorCard';
import RelatedArticles from '@/components/articles/RelatedArticles';

interface Article {
  id: string;
  title: string;
  content: string;
  cover_url?: string;
  created_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  user_id: string;
  author?: {
    id: string;
    nickname: string;
    avatar_url?: string;
    bio?: string;
    article_count?: number;
    follower_count?: number;
  };
  tags?: { id: string; name: string }[];
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToastStore();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取文章详情
        const articleData = await getArticleById(id);
        setArticle(articleData);
        setLikeCount(articleData.like_count || 0);

        // 增加浏览量
        await incrementViewCount(id);

        // 检查当前用户是否已点赞
        if (user) {
          const liked = await checkIsLiked(user.id, 'article', id);
          setIsLiked(liked);
        }

        // 获取相关文章（如果有标签）
        if (articleData.tags && articleData.tags.length > 0) {
          const related = await getRelatedArticles(
            id,
            articleData.tags.map((t: any) => t.id),
            3
          );
          setRelatedArticles(related);
        }
      } catch (err: any) {
        setError(err.message || '获取文章失败');
        addToast({ type: 'error', message: '获取文章失败' });
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
        await unlike(user.id, 'article', id!);
        setLikeCount(prev => prev - 1);
        addToast({ type: 'success', message: '已取消点赞' });
      } else {
        await like(user.id, 'article', id!);
        setLikeCount(prev => prev + 1);
        addToast({ type: 'success', message: '点赞成功' });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      addToast({ type: 'error', message: '操作失败，请重试' });
    }
  };

  if (loading) return <Loading />;
  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-text">文章不存在或已被删除</h1>
        <Button onClick={() => navigate('/articles')} className="mt-4">
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* 主要内容区 */}
          <article className="flex-1 max-w-3xl mx-auto lg:mx-0">
            {/* 文章头部 */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-heading text-text mb-4">
                {article.title}
              </h1>
              <div className="flex items-center text-text-secondary text-sm space-x-4">
                <Link to={`/profile/${article.author?.id}`} className="flex items-center space-x-2 hover:text-primary">
                  {article.author?.avatar_url ? (
                    <img src={article.author.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20" />
                  )}
                  <span>{article.author?.nickname}</span>
                </Link>
                <span>·</span>
                <span>{formatDate(article.created_at)}</span>
                <span>·</span>
                <span>{article.view_count || 0} 阅读</span>
              </div>
            </header>

            {/* 文章封面 */}
            {article.cover_url && (
              <img
                src={article.cover_url}
                alt={article.title}
                className="w-full rounded-card mb-8"
              />
            )}

            {/* 文章内容 */}
            <div
              className="prose prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* 标签列表 */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
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

            {/* 互动按钮 */}
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
              <button
                onClick={() => {/* 收藏功能待实现 */}}
                className="flex items-center space-x-2 px-4 py-2 rounded-button border border-border text-text-secondary hover:text-text"
              >
                <span>☆</span>
                <span>收藏</span>
              </button>
            </div>

            {/* 评论区 */}
            <CommentSection targetType="article" targetId={article.id} />
          </article>

          {/* 右侧侧边栏 */}
          <aside className="hidden lg:block w-64 space-y-6">
            {/* 目录 */}
            <TableOfContents content={article.content} />

            {/* 作者卡片 */}
            {article.author && (
              <div className="sticky top-24">
                <AuthorCard author={article.author} currentArticleId={article.id} />
              </div>
            )}
          </aside>
        </div>

        {/* 相关文章 */}
        {relatedArticles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-text font-heading text-xl mb-4">相关推荐</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group bg-card rounded-card border border-border p-4 hover:shadow-lg transition-all hover:scale-105"
                >
                  {article.cover_url && (
                    <img
                      src={article.cover_url}
                      alt={article.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h4 className="text-text font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  {article.summary && (
                    <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
                    <span>{article.profiles?.nickname}</span>
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleDetailPage;
