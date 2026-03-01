// ============================
// 校园互助问答 · 列表页
// 路径：/questions
// 功能：展示所有已审核问题，支持分页、分类，点击进详情
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuestions } from '@/hooks/useQuestions'
import { useAuth } from '@/hooks/useAuth'
import QuestionCard from '@/components/questions/QuestionCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const QuestionsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    questions,
    isLoadingQuestions,
    questionsError,
    refetchQuestions
  } = useQuestions({ page, pageSize })

  if (isLoadingQuestions) {
    return <div className="py-10 flex justify-center"><Loading /></div>
  }

  if (questionsError) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>加载失败，请重试</p>
        <Button variant="primary" className="mt-4" onClick={refetchQuestions}>刷新</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* 标题区 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">校园互助问答</h1>
        <Button
          variant="primary"
          className="bg-purple-600 hover:bg-purple-500"
          onClick={() => navigate('/question/new')}
        >
          我要提问
        </Button>
      </div>

      {/* 问题列表 */}
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onClick={() => navigate(`/question/${q.id}`)}
          />
        ))}

        {/* 空状态 */}
        {questions.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500">暂无问题，快来提出你的疑问吧～</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/question/new')}>
              发起第一个提问
            </Button>
          </div>
        )}
      </div>

      {/* 分页 */}
      <div className="flex justify-center gap-2 mt-8">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
        <span className="text-gray-400">第 {page} 页</span>
        <Button variant="ghost" disabled={questions.length < pageSize} onClick={() => setPage(page + 1)}>下一页</Button>
      </div>
    </div>
  )
}

export default QuestionsPage
