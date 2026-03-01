// ============================
// 问题详情页（含回答区）
// 路径：/question/:id
// 功能：展示问题、作者、所有回答、发布回答
// ============================

import { useParams, useNavigate } from 'react-router-dom'
import { useQuestions } from '@/hooks/useQuestions'
import { useAuth } from '@/hooks/useAuth'
import AnswerSection from '@/components/answers/AnswerSection'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { useQuestionById } = useQuestions({ page: 1, pageSize: 10 })

  const { data: question, isLoading, error } = useQuestionById(id || '')
  const isAuthor = user?.id === question?.author_id

  // 加载/异常
  if (isLoading) return <div className="py-10 flex justify-center"><Loading /></div>
  if (error || !question) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>问题不存在或加载失败</p>
        <Button variant="primary" onClick={() => navigate('/questions')}>返回列表</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* 问题头部 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{question.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span>提问者：{question.profiles?.username || '同学'}</span>
          <span>{new Date(question.created_at).toLocaleDateString()}</span>
          {isAuthor && (
            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => {
              if (window.confirm('确定删除？')) {
                toast.success('删除成功')
                navigate('/questions')
              }
            }}>删除问题</Button>
          )}
        </div>

        {/* 标签 */}
        <div className="flex gap-2 flex-wrap mb-4">
          {question.tags?.map(t => (
            <span key={t.id} className="px-2 py-1 bg-purple-900/20 text-purple-400 rounded text-xs">{t.name}</span>
          ))}
        </div>
      </div>

      {/* 问题内容 */}
      <div className="bg-[#1A1F29] rounded-xl p-6 border border-gray-800 mb-6">
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{question.content}</p>
      </div>

      {/* 统计 */}
      <div className="flex gap-6 text-sm text-gray-400 mb-8">
        <span>👁️ {question.view_count || 0} 浏览</span>
        <span>❤️ {question.like_count || 0} 点赞</span>
        <span>💬 {question.answers?.length || 0} 回答</span>
      </div>

      {/* 回答区（核心） */}
      <AnswerSection questionId={question.id} />

      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>返回上一页</Button>
      </div>
    </div>
  )
}

export default QuestionDetailPage
