// ============================
// 问题列表卡片组件
// 展示标题、摘要、作者、回答数、浏览点赞
// ============================

import React from 'react'
import { Question } from '@/services/questionService'

interface QuestionCardProps {
  question: Question
  onClick: () => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#1A1F29] rounded-xl p-4 border border-gray-800 hover:border-purple-500/30 hover:shadow-lg transition-all cursor-pointer"
    >
      {/* 标题 */}
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{question.title}</h3>

      {/* 摘要 */}
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
        {question.content.substring(0, 120)}
      </p>

      {/* 作者 + 统计 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">
            {question.profiles?.username?.charAt(0) || '问'}
          </div>
          <span>{question.profiles?.username || '同学'}</span>
        </div>
        <div className="flex gap-3">
          <span>👁️ {question.view_count || 0}</span>
          <span>💬 {question.answer_count || 0} 回答</span>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
