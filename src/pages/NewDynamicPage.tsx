// ============================
// 发布校园动态页
// 路径：/dynamic/new
// 特点：简短文字、无标题、极简发布，适合在校生快速发动态
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useDynamics } from '@/hooks/useDynamics'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'

const NewDynamicPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createDynamic, isCreatingDynamic } = useDynamics({ page: 1, pageSize: 10 })

  // 动态只有内容（极简）
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!content.trim()) {
      toast.error('动态内容不能为空')
      return
    }

    try {
      await createDynamic({
        author_id: user.id,
        content: content.trim(),
        status: 'pending'
      })
      toast.success('动态发布成功，等待审核')
      navigate('/dynamics')
    } catch (err) {
      toast.error('发布失败，请稍后重试')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">发布校园动态</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 动态内容（极简多行输入） */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">动态内容（简短真实）</label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 resize-none"
            placeholder="分享校内新鲜事、学习日常、班级动态、心情状态～"
            disabled={isCreatingDynamic}
          />
        </div>

        {/* 按钮组 */}
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => navigate(-1)} disabled={isCreatingDynamic}>取消</Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-green-600 hover:bg-green-500"
            disabled={isCreatingDynamic}
          >
            {isCreatingDynamic ? <Loading className="w-4 h-4 text-white" /> : '发布动态'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewDynamicPage
