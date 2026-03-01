import React from 'react'

interface ArticleCardProps {
  article: any
  onClick: () => void
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const readingTime = article.content ? Math.ceil(article.content.length / 500) : 0

  return (
    <div
      onClick={onClick}
      className="global-card cursor-pointer hover:shadow-lg transition group"
    >
      <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary-500">
        {article.title}
      </h3>
      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
        {article.summary || article.content.substring(0, 100)}
      </p>
      
      {article.tags && article.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {article.tags.slice(0, 3).map((tag: any) => (
            <span key={tag.id} className="px-2 py-0.5 bg-learning-500/20 text-learning-500 rounded text-xs">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>👤 {article.profiles?.username || '同学'}</span>
        <div className="flex items-center gap-3">
          <span>📖 {readingTime} 分钟</span>
          <span>👁️ {article.view_count || 0}</span>
          <span>❤️ {article.like_count || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default ArticleCard
