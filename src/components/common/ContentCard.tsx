import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ContentCardProps {
  data: {
    id: string
    title: string
    summary: string
    author: {
      id: string
      username: string
      avatar?: string
      tag?: string
    }
    tags: any[]
    viewCount: number
    likeCount: number
    commentCount: number
    createdAt: string
  }
}

const ContentCard: React.FC<ContentCardProps> = ({ data }) => {
  const navigate = useNavigate()
  const { id, title, summary, author, tags, viewCount, likeCount, commentCount, createdAt } = data

  return (
    <div
      onClick={() => navigate(`/article/${id}`)}
      className="global-card cursor-pointer hover:shadow-lg transition"
    >
      <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">{title}</h3>
      <p className="text-text-secondary text-sm mb-3 line-clamp-2">{summary}</p>
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {tags.slice(0, 3).map(tag => (
            <span key={tag.id} className="px-2 py-0.5 bg-learning-500/20 text-learning-500 rounded text-xs">
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500">
            {author.username[0]}
          </div>
          <span>{author.username}</span>
          {author.tag && <span className="text-text-secondary">· {author.tag}</span>}
        </div>
        <div className="flex gap-3">
          <span>👁️ {viewCount}</span>
          <span>❤️ {likeCount}</span>
          <span>💬 {commentCount}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-text-secondary text-right">{createdAt}</div>
    </div>
  )
}

export default ContentCard
