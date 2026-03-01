// ============================
// 动态卡片组件：校园动态列表用
// 样式完全对齐你现有ArticleCard、QuestionCard，风格统一
// ============================

import React from 'react'
import { Dynamic } from '@/services/dynamicService'

interface DynamicCardProps {
  dynamic: Dynamic
  onClick: () => void
}

const DynamicCard: React.FC<DynamicCardProps> = ({ dynamic, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#1A1F29] rounded-xl p-4 border border-gray-800 hover:border-green-500/30 hover:shadow-lg transition-all cursor-pointer"
    >
      {/* 作者信息行 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center">
          {dynamic.profiles?.username?.charAt(0) || '动'}
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">{dynamic.profiles?.username || '同学'}</span>
          <span className="text-gray-500 text-xs">{new Date(dynamic.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 动态内容（最多3行截断） */}
      <p className="text-gray-300 text-sm mb-3 line-clamp-3 leading-relaxed">
        {dynamic.content}
      </p>

      {/* 互动统计 */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span>👁️ {dynamic.view_count || 0}</span>
        <span>❤️ {dynamic.like_count || 0}</span>
        <span>💬 {dynamic.comment_count || 0}</span>
      </div>
    </div>
  )
}

export default DynamicCard
