// ============================
// 贴吧帖子卡片（风格统一）
// ============================

import React from 'react'
import { Post } from '@/services/postService'

interface PostCardProps {
  post: Post
  onClick: () => void
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div onClick={onClick} className="bg-[#1A1F29] rounded-xl p-4 border border-gray-800 hover:border-yellow-500/30 hover:shadow-lg transition-all cursor-pointer">
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.content.substring(0, 100)}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center justify-center">
            {post.profiles?.username?.charAt(0) || '贴'}
          </div>
          <span>{post.profiles?.username || '同学'}</span>
        </div>
        <div className="flex gap-3">
          <span>👁️ {post.view_count || 0}</span>
          <span>💬 {post.reply_count || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
