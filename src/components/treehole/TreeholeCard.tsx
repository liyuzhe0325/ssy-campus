import React from 'react'

interface TreeholeCardProps {
  post: any
  onClick: () => void
}

const TreeholeCard: React.FC<TreeholeCardProps> = ({ post, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="global-card cursor-pointer hover:shadow-lg transition border-l-4 border-private-500"
    >
      <p className="text-text-primary text-sm mb-3 whitespace-pre-wrap">
        {post.content}
      </p>
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>匿名同学</span>
        <div className="flex gap-3">
          <span>❤️ {post.like_count || 0}</span>
          <span>💬 {post.reply_count || 0}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-text-secondary">
        {new Date(post.created_at).toLocaleString()}
      </div>
    </div>
  )
}

export default TreeholeCard
