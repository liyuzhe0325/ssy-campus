// ============================
// 回答区组件：展示回答列表 + 发布回答
// 对接answers表，完全适配阶段二结构
// ============================

import { useState } from 'react'
import { useQuestions } from '@/hooks/useQuestions'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

interface AnswerSectionProps {
  questionId: string
}

const AnswerSection: React.FC<AnswerSectionProps> = ({ questionId }) => {
  const { user } = useAuth()
  const { useQuestionById, createAnswer, isCreatingAnswer } = useQuestions({ page: 1, pageSize: 10 })
  const [answerContent, setAnswerContent] = useState('')

  // 获取当前问题的所有回答
  const { data: question } = useQuestionById(questionId)

  // 提交回答
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return toast.error('请先登录')
    if (!answerContent.trim()) return toast.error('回答内容不能为空')

    try {
      await createAnswer({
        question_id: questionId,
        author_id: user.id,
        content: answerContent.trim(),
        is_accepted: false
      })
      setAnswerContent('')
      toast.success('回答成功，感谢帮助！')
    } catch (err) {
      toast.error('回答失败，请重试')
    }
  }

  return (
    <div className="bg-[#1A1F29] rounded-xl p-5 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-4">
        回答区 ({question?.answers?.length || 0})
      </h3>

      {/* 回答列表 */}
      <div className="space-y-4 mb-6">
        {question?.answers?.map((ans) => (
          <div key={ans.id} className="border-b border-gray-700 pb-3 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs flex items-center justify-center">
                {ans.profiles?.username?.charAt(0) || '答'}
              </div>
              <span className="text-white text-sm font-medium">{ans.profiles?.username || '学长'}</span>
              <span className="text-xs text-gray-500">{new Date(ans.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{ans.content}</p>
          </div>
        ))}

        {!question?.answers?.length && (
          <p className="text-gray-400 text-sm">暂无回答，快来成为第一个解答者～</p>
        )}
      </div>

      {/* 发布回答 */}
      <form onSubmit={handleSubmitAnswer} className="flex flex-col gap-2">
        <textarea
          rows={4}
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          className="w-full bg-[#252B3A] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-purple-500 resize-none"
          placeholder="写下你的回答，帮助提问同学～"
          disabled={isCreatingAnswer}
        />
        <Button
          type="submit"
          variant="primary"
          className="bg-purple-600 hover:bg-purple-500 ml-auto"
          disabled={isCreatingAnswer || !answerContent.trim()}
        >
          提交回答
        </Button>
      </form>
    </div>
  )
}

export default AnswerSection
