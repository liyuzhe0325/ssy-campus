// ============================
// 树洞匿名回复区（完全匿名、无用户信息）
// ============================

import { useState } from 'react'
import { useTreehole } from '@/hooks/useTreehole'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

interface TreeholeReplySectionProps {
  postId: string
}

const TreeholeReplySection: React.FC<TreeholeReplySectionProps> = ({ postId }) => {
  const { user } = useAuth()
  const { useTreeholeById, createTreeholeReply, isCreatingReply } = useTreehole({ page: 1, pageSize: 10 })
  const [content, setContent] = useState('')
  const { data: post } = useTreeholeById(postId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return toast.error('请登录')
    if (!content.trim()) return toast.error('内容不能为空')

    try {
      await createTreeholeReply({
        post_id: postId,
        author_id: user.id,
        content: content.trim()
      })
      setContent('')
      toast.success('匿名回复成功')
    } catch (err) {
      toast.error('回复失败')
    }
  }

  return (
    <div className="bg-[#1A1F29] rounded-xl p-5 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-4">匿名回复 ({post?.replies?.length || 0})</h3>
      <div className="space-y-3 mb-6">
        {post?.replies?.map((r) => (
          <div key={r.id} className="border-b border-gray-700 pb-2">
            <p className="text-sm text-gray-300">{r.content}</p>
            <span className="text-xs text-gray-500">匿名用户 · {new Date(r.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-[#252B3A] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-pink-500 resize-none"
          placeholder="匿名安慰、回复..."
          disabled={isCreatingReply}
        />
        <Button type="submit" size="sm" variant="primary" className="bg-pink-600 hover:bg-pink-500 ml-auto" disabled={isCreatingReply || !content.trim()}>
          匿名回复
        </Button>
      </form>
    </div>
  )
}

export default TreeholeReplySection
