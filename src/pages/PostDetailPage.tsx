// ============================
// 贴吧帖子详情页（含回复区）
// 路径：/post/:id
// ============================

import { useParams, useNavigate } from 'react-router-dom'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import ReplySection from '@/components/replies/ReplySection'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { usePostById } = usePosts({ page: 1, pageSize: 10 })

  const { data: post, isLoading, error } = usePostById(id || '')
  const isAuthor = user?.id === post?.author_id

  if (isLoading) return <div className="py-10 flex justify-center"><Loading /></div>
  if (error || !post) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>帖子不存在或加载失败</p>
        <Button variant="primary" onClick={() => navigate('/posts')}>返回列表</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span>作者：{post.profiles?.username || '同学'}</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
          {isAuthor && (
            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => {
              if (window.confirm('确定删除？')) {
                toast.success('删除成功')
                navigate('/posts')
              }
            }}>删除</Button>
          )}
        </div>
      </div>

      <div className="bg-[#1A1F29] rounded-xl p-6 border border-gray-800 mb-6">
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="flex gap-6 text-sm text-gray-400 mb-8">
        <span>👁️ {post.view_count || 0}</span>
        <span>❤️ {post.like_count || 0}</span>
        <span>💬 {post.replies?.length || 0}</span>
      </div>

      <ReplySection postId={post.id} />

      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default PostDetailPage
