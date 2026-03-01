// ============================
// 发布贴吧帖子
// 路径：/post/new
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/usePosts'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import toast from 'react-hot-toast'

const NewPostPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createPost, isCreatingPost } = usePosts({ page: 1, pageSize: 10 })

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [board, setBoard] = useState('综合交流')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!title.trim() || !content.trim()) {
      toast.error('标题和内容不能为空')
      return
    }

    try {
      await createPost({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        board,
        status: 'pending'
      })
      toast.success('发帖成功，等待审核')
      navigate('/posts')
    } catch (err) {
      toast.error('发帖失败，请重试')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">发布贴吧帖子</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-300 mb-2">标题</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="简洁明了" disabled={isCreatingPost} />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">贴吧分类</label>
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500"
            disabled={isCreatingPost}
          >
            <option value="综合交流">综合交流</option>
            <option value="学习讨论">学习讨论</option>
            <option value="班级事务">班级事务</option>
            <option value="娱乐休闲">娱乐休闲</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">正文内容</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#1A1F29] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500 resize-none"
            placeholder="写下你的帖子内容..."
            disabled={isCreatingPost}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => navigate(-1)} disabled={isCreatingPost}>取消</Button>
          <Button type="submit" variant="primary" className="bg-yellow-600 hover:bg-yellow-500" disabled={isCreatingPost}>
            {isCreatingPost ? <Loading className="w-4 h-4 text-white" /> : '发布帖子'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewPostPage
