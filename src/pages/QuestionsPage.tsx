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

  const { questions, isLoading, error, refetch } = useQuestions({ page, pageSize })

  if (isLoading) {
    return (
      <div className="global-container py-10 flex justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="global-container py-10 text-center text-text-secondary">
        <p>加载失败，请重试</p>
        <Button className="mt-4" variant="primary" onClick={() => refetch()}>
          刷新
        </Button>
      </div>
    )
  }

  return (
    <div className="global-container max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">校园互助问答</h1>
        {user && (
          <Button variant="learning" onClick={() => navigate('/question/new')}>
            发起提问
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onClick={() => navigate(`/question/${question.id}`)}
          />
        ))}

        {questions.length === 0 && (
          <div className="global-card text-center py-10 text-text-secondary">
            <p>暂无提问，快来发起第一个问题吧～</p>
            {user && (
              <Button className="mt-4" variant="learning" onClick={() => navigate('/question/new')}>
                发起提问
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          上一页
        </Button>
        <span className="text-text-secondary">第 {page} 页</span>
        <Button
          variant="ghost"
          disabled={questions.length < pageSize}
          onClick={() => setPage(p => p + 1)}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}

export default QuestionsPage
