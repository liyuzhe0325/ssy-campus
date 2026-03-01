import React from 'react'
import { News } from '@/services/newsService'

interface NewsCardProps { news: News; onClick: () => void }

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  return (
    <div onClick={onClick} className="bg-[#1A1F29] rounded-xl p-4 border border-gray-800 hover:border-blue-500/30 cursor-pointer">
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{news.title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2 mb-2">{news.summary || news.content.substring(0,80)}</p>
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{news.category}</span>
        <span>{new Date(news.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default NewsCard
