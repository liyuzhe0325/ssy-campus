// ============================
// 树洞详情页（匿名，无用户信息）
// 路径：/treehole/:id
// ============================

import { useParams, useNavigate } from 'react-router-dom'
import { useTreehole } from '@/hooks/useTreehole'
import { useAuth } from '@/hooks/useAuth'
import TreeholeReplySection from '@/components/treehole/TreeholeReplySection'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

const TreeholeDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { useTreeholeById } = useTreehole({ page: 1, pageSize: 10 })

  const { data: post, isLoading, error } = useTreeholeById(id || '')
  const isAuthor = user?.id === post?.author_id

  if (isLoading) return <div className="py-10 flex justify-center"><Loading /></div>
  if (error || !post) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>树洞不存在或加载失败</p>
        <Button variant="primary" onClick={() => navigate('/treehole')}>返回</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#1A1F29] rounded-xl p-6 border border-gray-800 mb-6">
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        <div className="text-xs text-gray-500 mt-4">
          发布时间：{new Date(post.created_at).toLocaleDateString()}
          {isAuthor && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-400 ml-4" 
              onClick={() => {
                if (confirm('确认删除？')) {
                  toast.success('删除成功')
                  navigate('/treehole')
                }
              }}
            >
              删除
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-400 mb-8">
        <span>👁️ {post.view_count || 0}</span>
        <span>❤️ {post.like_count || 0}</span>
        <span>💬 {post.replies?.length || 0}</span>
      </div>

      <TreeholeReplySection postId={post.id} />

      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default TreeholeDetailPage
