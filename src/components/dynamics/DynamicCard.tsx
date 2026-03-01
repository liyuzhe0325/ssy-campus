import React from 'react'

interface DynamicCardProps {
  dynamic: any
  onClick: () => void
}

const DynamicCard: React.FC<DynamicCardProps> = ({ dynamic, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="global-card cursor-pointer hover:shadow-lg transition"
    >
      <p className="text-text-primary text-sm mb-3 whitespace-pre-wrap">
        {dynamic.content}
      </p>
      {dynamic.image_urls && dynamic.image_urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {dynamic.image_urls.slice(0, 3).map((url: string, idx: number) => (
            <img
              key={idx}
              src={url}
              alt="动态图片"
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>作者：{dynamic.author?.username || '同学'}</span>
        <div className="flex gap-3">
          <span>❤️ {dynamic.like_count || 0}</span>
          <span>💬 {dynamic.comment_count || 0}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-text-secondary">
        {new Date(dynamic.created_at).toLocaleString()}
      </div>
    </div>
  )
}

export default DynamicCard
