// ============================
// 相关文章推荐组件
// 基于当前文章的标签，获取相关文章列表并展示
// 依赖：articleService.getRelatedArticles（待实现）
// 样式：使用主题变量，适配个性化主题
// ============================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  summary?: string;
  cover_url?: string;
  created_at: string;
  author?: {
    id: string;
    nickname: string;
  };
}

interface RelatedArticlesProps {
  articleId: string;
  tagIds: string[]; // 当前文章的标签ID数组
  limit?: number;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articleId,
  tagIds,
  limit = 3,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        // TODO: 实现 getRelatedArticles API，排除当前文章，按标签匹配度排序
        // 这里暂时使用模拟数据，实际需调用服务
        // const data = await getRelatedArticles({ excludeId: articleId, tagIds, limit });
        // setArticles(data);
        
        // 模拟数据（开发时使用）
        setTimeout(() => {
          setArticles([
            {
              id: '1',
              title: '如何高效学习数学',
              summary: '分享我的数学学习方法...',
              created_at: new Date().toISOString(),
              author: { id: 'u1', nickname: '学长A' },
            },
            {
              id: '2',
              title: '物理竞赛经验分享',
              summary: '从零开始备战物理竞赛...',
              created_at: new Date().toISOString(),
              author: { id: 'u2', nickname: '学长B' },
            },
            {
              id: '3',
              title: '英语阅读理解技巧',
              summary: '提升阅读速度的秘诀...',
              created_at: new Date().toISOString(),
              author: { id: 'u3', nickname: '学姐C' },
            },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取相关文章失败', error);
        setLoading(false);
      }
    };

    if (tagIds.length > 0) {
      fetchRelated();
    }
  }, [articleId, tagIds, limit]);

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-text font-heading text-xl mb-4">相关推荐</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-card/50 rounded-card h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-text font-heading text-xl mb-4">相关推荐</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
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
              <span>{article.author?.nickname}</span>
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
