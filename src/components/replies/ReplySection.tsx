// ============================
// 贴吧回复区组件（统一回复结构）
// ============================

import { useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

interface ReplySectionProps {
  postId: string
}

const ReplySection: React.FC<ReplySectionProps> = ({ postId }) => {
  const { user } = useAuth()
  const { usePostById, createReply, isCreatingReply } = usePosts({ page: 1, pageSize: 10 })
  const [content, setContent] = useState('')
  const { data: post } = usePostById(postId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return toast.error('请登录')
    if (!content.trim()) return toast.error('内容不能为空')

    try {
      await createReply({ post_id: postId, author_id: user.id, content: content.trim() })
      setContent('')
      toast.success('回复成功')
    } catch (err) {
      toast.error('回复失败')
    }
  }

  return (
    <div className="bg-[#1A1F29] rounded-xl p-5 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-4">回复 ({post?.replies?.length || 0})</h3>
      <div className="space-y-3 mb-6">
        {post?.replies?.map((r) => (
          <div key={r.id} className="border-b border-gray-700 pb-2">
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="text-white">{r.profiles?.username}</span>
              <span className="text-gray-500">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-300">{r.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} 
          className="bg-[#252B3A] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-yellow-500 resize-none"
          placeholder="回复楼主..." disabled={isCreatingReply} />
        <Button type="submit" variant="primary" size="sm" className="bg-yellow-600 hover:bg-yellow-500 ml-auto" disabled={isCreatingReply || !content.trim()}>
          回复
        </Button>
      </form>
    </div>
  )
}

export default ReplySection
