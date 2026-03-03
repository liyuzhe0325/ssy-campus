// ============================
// 文章详情页
// 整合阅读进度条、目录、作者卡片、相关推荐等组件
// 依赖：useArticle hook，各子组件
// 样式：使用主题变量
// ============================

import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useArticle } from '@/hooks/useArticle';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/dateUtils';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import CommentSection from '@/components/comments/CommentSection'; // 假设已有
import ReadingProgress from '@/components/articles/ReadingProgress';
import TableOfContents from '@/components/articles/TableOfContents';
import AuthorCard from '@/components/articles/AuthorCard';
import RelatedArticles from '@/components/articles/RelatedArticles';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { article, loading, error, likeArticle, unlikeArticle, favoriteArticle, unfavoriteArticle } = useArticle(id!);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);

  useEffect(() => {
    if (article) {
      setLikeCount(article.like_count || 0);
      // 检查当前用户是否已点赞/收藏（需要从后端获取，暂时模拟）
      // 实际应从 article.user_liked 等字段获取，后端应返回
      setIsLiked(article.user_liked || false);
      setIsFavorited(article.user_favorited || false);
    }
  }, [article]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isLiked) {
        await unlikeArticle(id!);
        setLikeCount(prev => prev - 1);
      } else {
        await likeArticle(id!);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('点赞操作失败', error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isFavorited) {
        await unfavoriteArticle(id!);
      } else {
        await favoriteArticle(id!);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('收藏操作失败', error);
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

            {/* 文章封面（如果有） */}
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
                {article.tags.map((tag: any) => (
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
                onClick={handleFavorite}
                className={`flex items-center space-x-2 px-4 py-2 rounded-button border ${
                  isFavorited
                    ? 'border-primary text-primary'
                    : 'border-border text-text-secondary hover:text-text'
                }`}
              >
                <span>{isFavorited ? '⭐' : '☆'}</span>
                <span>收藏</span>
              </button>
            </div>

            {/* 评论区 */}
            <CommentSection targetType="article" targetId={article.id} />
          </article>

          {/* 右侧侧边栏（仅大屏显示） */}
          <aside className="hidden lg:block w-64 space-y-6">
            {/* 目录 */}
            <TableOfContents content={article.content} />

            {/* 作者卡片（固定在某个位置，或跟随滚动） */}
            {article.author && (
              <div className="sticky top-24">
                <AuthorCard author={article.author} currentArticleId={article.id} />
              </div>
            )}
          </aside>
        </div>

        {/* 相关文章（放在评论区下方，全宽） */}
        {article.tags && article.tags.length > 0 && (
          <RelatedArticles
            articleId={article.id}
            tagIds={article.tags.map((t: any) => t.id)}
            limit={3}
          />
        )}
      </div>
    </>
  );
};

export default ArticleDetailPage;
