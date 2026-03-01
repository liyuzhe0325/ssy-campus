// ============================
// 发布匿名树洞（无标题、纯匿名、极简）
// 路径：/treehole/new
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTreehole } from '@/hooks/useTreehole'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'

const NewTreeholePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createTreeholePost, isCreatingPost } = useTreehole({ page: 1, pageSize: 10 })

  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!content.trim()) {
      toast.error('树洞内容不能为空')
      return
    }

    try {
      await createTreeholePost({
        author_id: user.id,
        content: content.trim(),
        status: 'pending'
      })
      toast.success('匿名发布成功，等待审核')
      navigate('/treehole')
    } catch (err) {
      toast.error('发布失败，请重试')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">发布匿名树洞</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-300 mb-2">匿名心事（完全保密）</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500 resize-none"
            placeholder="匿名说出压力、烦恼、心事、秘密，无人知晓你是谁～"
            disabled={isCreatingPost}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => navigate(-1)} disabled={isCreatingPost}>取消</Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-pink-600 hover:bg-pink-500"
            disabled={isCreatingPost}
          >
            {isCreatingPost ? <Loading className="w-4 h-4 text-white" /> : '匿名发布'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewTreeholePage
