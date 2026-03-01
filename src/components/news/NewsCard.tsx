import React from 'react'

interface NewsCardProps {
  news: any
  onClick: () => void
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="global-card cursor-pointer hover:shadow-lg transition"
    >
      {news.is_top && (
        <div className="mb-2">
          <span className="px-2 py-0.5 bg-official-500/20 text-official-500 rounded text-xs font-semibold">
            📌 置顶
          </span>
        </div>
      )}
      <h3 className="text-lg font-bold text-text-primary mb-2">{news.title}</h3>
      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
        {news.summary || news.content}
      </p>
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>官方发布</span>
        <span>👁️ {news.view_count || 0}</span>
      </div>
      <div className="mt-2 text-xs text-text-secondary">
        {new Date(news.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}

export default NewsCard
