import React from 'react'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import {
  EyeIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

interface ContentCardProps {
  data: {
    id: string
    title: string
    summary: string
    author: {
      id: string
      username: string
      avatar: string
      tag: string
    }
    tags: string[]
    viewCount: number
    likeCount: number
    commentCount: number
    createdAt: string
  }
  className?: string
}

const ContentCard: React.FC<ContentCardProps> = ({ data, className }) => {
  return (
    <div className={twMerge(
      'bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow',
      className
    )}>
      {/* 作者信息 */}
      <div className="flex items-center justify-between mb-3">
        <Link to={`/profile/${data.author.id}`} className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
            {data.author.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{data.author.username}</p>
            <p className="text-xs text-gray-500">{data.author.tag} · {data.createdAt}</p>
          </div>
        </Link>
      </div>

      {/* 内容主体 */}
      <Link to={`/article/${data.id}`} className="block mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          {data.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-1 mb-3">
          {data.summary}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {data.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </Link>

      {/* 互动数据 */}
      <div className="flex items-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <EyeIcon className="w-4 h-4" />
          <span>{data.viewCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <HandThumbUpIcon className="w-4 h-4" />
          <span>{data.likeCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ChatBubbleLeftIcon className="w-4 h-4" />
          <span>{data.commentCount}</span>
        </div>
      </div>
    </div>
  )
}

export default ContentCard
