import React from 'react'

interface QuestionCardProps {
  question: any
  onClick: () => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="global-card cursor-pointer hover:shadow-lg transition"
    >
      <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
        {question.title}
      </h3>
      <p className="text-text-secondary text-sm mb-3 line-clamp-2">
        {question.content}
      </p>
      <div className="flex gap-2 flex-wrap mb-3">
        {question.tags?.slice(0, 3).map((tag: any) => (
          <span key={tag.id} className="px-2 py-0.5 bg-learning-500/20 text-learning-500 rounded text-xs">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>作者：{question.author?.username || '同学'}</span>
        <div className="flex gap-3">
          <span>👁️ {question.view_count || 0}</span>
          <span>❤️ {question.like_count || 0}</span>
          <span>💬 {question.answer_count || 0} 回答</span>
        </div>
      </div>
      {question.is_solved && (
        <div className="mt-2">
          <span className="px-2 py-0.5 bg-success-500/20 text-success-500 rounded text-xs">
            ✓ 已解决
          </span>
        </div>
      )}
    </div>
  )
}

export default QuestionCard
