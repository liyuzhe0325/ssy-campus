// ============================
// 树洞卡片（纯匿名、无头像、无用户名）
// 样式完全统一全项目
// ============================

import React from 'react'
import { TreeholePost } from '@/services/treeholeService'

interface TreeholeCardProps {
  post: TreeholePost
  onClick: () => void
}

const TreeholeCard: React.FC<TreeholeCardProps> = ({ post, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#1A1F29] rounded-xl p-4 border border-gray-800 hover:border-pink-500/30 hover:shadow-lg transition-all cursor-pointer"
    >
      <p className="text-gray-300 text-sm mb-3 line-clamp-3 leading-relaxed">
        {post.content}
      </p>
      <div className="flex justify-between text-xs text-gray-500">
        <span>匿名用户</span>
        <div className="flex gap-3">
          <span>👁️ {post.view_count || 0}</span>
          <span>💬 {post.reply_count || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default TreeholeCard
