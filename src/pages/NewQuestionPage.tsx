// ============================
// 发布提问页面
// 路径：/question/new
// 功能：标题+内容+分类+标签，提交后pending待审核
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useQuestions } from '@/hooks/useQuestions'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'

const NewQuestionPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createQuestion, isCreatingQuestion } = useQuestions({ page: 1, pageSize: 10 })

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('学习疑问')
  const [tags, setTags] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!title.trim() || !content.trim()) {
      toast.error('标题和问题内容不能为空')
      return
    }

    try {
      await createQuestion({
        title: title.trim(),
        content: content.trim(),
        author_id: user.id,
        category,
        status: 'pending'
      })
      toast.success('提问成功，等待学长学姐回答～')
      navigate('/questions')
    } catch (err) {
      toast.error('提问失败，请重试')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">发起校园提问</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 标题 */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">问题标题（简洁明确）</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="如：高三物理怎么快速提分？"
            disabled={isCreatingQuestion}
          />
        </div>

        {/* 分类 */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">问题分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
            disabled={isCreatingQuestion}
          >
            <option value="学习疑问">学习疑问</option>
            <option value="备考求助">备考求助</option>
            <option value="校园生活">校园生活</option>
            <option value="志愿专业">志愿专业</option>
          </select>
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">标签（英文逗号分隔）</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="如：物理,高三,备考"
            disabled={isCreatingQuestion}
          />
        </div>

        {/* 详细描述 */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">问题详细描述</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 resize-none"
            placeholder="详细描述你的问题，便于学长学姐精准解答..."
            disabled={isCreatingQuestion}
          />
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => navigate(-1)} disabled={isCreatingQuestion}>取消</Button>
          <Button variant="primary" className="flex-1 bg-purple-600 hover:bg-purple-500" type="submit" disabled={isCreatingQuestion}>
            {isCreatingQuestion ? <Loading className="w-4 h-4 text-white" /> : '提交提问'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewQuestionPage
