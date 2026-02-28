import React from 'react'
import { Link } from 'react-router-dom'
import { Article } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Props {
  article: Article & { author?: Profile }
}

const ArticleCard: React.FC<Props> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
      <Link to={`/articles/${article.id}`}>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
        {article.summary && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded">
              {article.category}
            </span>
            <span>{article.author?.username || '匿名'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>👁️ {article.view_count}</span>
            <span>❤️ {article.like_count}</span>
            <span>💬 {article.comment_count}</span>
            <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: zhCN })}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ArticleCard
