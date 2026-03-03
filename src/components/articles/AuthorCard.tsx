// ============================
// 作者卡片组件
// 显示作者信息、关注按钮、作者其他文章推荐
// 依赖：useAuth, followService（待实现）
// 样式：使用主题变量，适配个性化主题
// ============================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { followUser, unfollowUser, checkIsFollowing } from '@/services/followService';
import { getArticlesByAuthor } from '@/services/articleService';
import Avatar from '@/components/common/Avatar'; // 假设已有 Avatar 组件，若无则用 img 替代

interface Author {
  id: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
  article_count?: number;
  follower_count?: number;
}

interface AuthorCardProps {
  author: Author;
  currentArticleId?: string; // 当前文章ID，用于排除自身
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, currentArticleId }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // 检查是否已关注
  useEffect(() => {
    if (user && author.id !== user.id) {
      checkIsFollowing(user.id, author.id).then(setIsFollowing).catch(console.error);
    }
  }, [user, author.id]);

  // 获取作者的其他文章
  useEffect(() => {
    getArticlesByAuthor(author.id, { excludeId: currentArticleId, limit: 3 })
      .then(setRelatedArticles)
      .catch(console.error);
  }, [author.id, currentArticleId]);

  const handleFollowToggle = async () => {
    if (!user) return;
    setLoadingFollow(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.id, author.id);
      } else {
        await followUser(user.id, author.id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('关注操作失败', error);
    } finally {
      setLoadingFollow(false);
    }
  };

  // 如果是自己，不显示关注按钮
  const isSelf = user?.id === author.id;

  return (
    <div className="bg-card rounded-card border border-border p-6 shadow-card">
      <div className="flex items-start space-x-4">
        {/* 头像 */}
        <Link to={`/profile/${author.id}`}>
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.nickname}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl text-primary">
              {author.nickname?.[0]?.toUpperCase()}
            </div>
          )}
        </Link>

        {/* 作者信息 */}
        <div className="flex-1">
          <Link to={`/profile/${author.id}`} className="hover:text-primary">
            <h3 className="text-text font-heading text-xl">{author.nickname}</h3>
          </Link>
          {author.bio && (
            <p className="text-text-secondary text-sm mt-1 line-clamp-2">{author.bio}</p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
            <span>文章 {author.article_count || 0}</span>
            <span>粉丝 {author.follower_count || 0}</span>
          </div>
        </div>

        {/* 关注按钮 */}
        {!isSelf && user && (
          <button
            onClick={handleFollowToggle}
            disabled={loadingFollow}
            className={`px-4 py-2 rounded-button text-sm font-medium transition-colors ${
              isFollowing
                ? 'border border-border text-text-secondary hover:border-primary/50'
                : 'bg-primary text-white hover:bg-primary/80'
            }`}
          >
            {loadingFollow ? '处理中...' : isFollowing ? '已关注' : '关注'}
          </button>
        )}
      </div>

      {/* 作者其他文章 */}
      {relatedArticles.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-text font-medium mb-3">作者的其他文章</h4>
          <ul className="space-y-2">
            {relatedArticles.map((article) => (
              <li key={article.id}>
                <Link
                  to={`/article/${article.id}`}
                  className="text-text-secondary hover:text-primary transition-colors text-sm line-clamp-1"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={`/profile/${author.id}?tab=articles`}
            className="inline-block mt-2 text-xs text-primary hover:underline"
          >
            查看全部文章 →
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthorCard;
