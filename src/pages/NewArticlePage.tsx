import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { createArticle } from '@/services/articleService'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'

const NewArticlePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 发布提交（真实可用）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空')
      return
    }

    setLoading(true)
    setError('')

    const res = await createArticle({
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim() || content.substring(0, 100),
      author_id: user.id,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    })

    setLoading(false)

    if (res) {
      navigate('/articles') // 发布成功 → 跳文章列表
    } else {
      setError('发布失败，请稍后重试')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-2">
      <h1 className="text-2xl font-bold text-white mb-6">发布经验文章</h1>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="请输入文章标题"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">简介（可选）</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="简短介绍，不超过100字"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">标签（用英文逗号分隔）</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="如：备考,学习方法,高三"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">正文内容</label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
            placeholder="写下你的学习、校内、备考、志愿经验..."
            disabled={loading}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            返回
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="flex-1 bg-blue-600 hover:bg-blue-500"
            disabled={loading}
          >
            {loading ? <Loading className="w-4 h-4 text-white" /> : '发布文章'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewArticlePage
