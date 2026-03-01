import { useParams, useNavigate } from 'react-router-dom'
import { useDynamics } from '@/hooks/useDynamics'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import toast from 'react-hot-toast'

const DynamicDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { useDynamicById, deleteDynamic, isDeleting } = useDynamics({ page: 1, pageSize: 10 })

  const { data: dynamic, isLoading, error } = useDynamicById(id || '')
  const isAuthor = user?.id === dynamic?.author_id

  if (isLoading) return <div className="py-10 flex justify-center"><Loading /></div>
  if (error || !dynamic) {
    return (
      <div className="global-container py-10 text-center text-text-secondary">
        <p>动态不存在或加载失败</p>
        <Button className="mt-4" variant="primary" onClick={() => navigate('/dynamics')}>返回动态列表</Button>
      </div>
    )
  }

  return (
    <div className="global-container max-w-3xl">
      <div className="global-card fade-in mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
              {dynamic.profiles?.username?.charAt(0) || '用'}
            </div>
            <div>
              <p className="font-medium text-text-primary">{dynamic.profiles?.username || '匿名用户'}</p>
              <p className="text-xs text-text-muted">{new Date(dynamic.created_at).toLocaleString()}</p>
            </div>
          </div>

          {isAuthor && (
            <Button
              variant="danger"
              size="sm"
              disabled={isDeleting}
              onClick={() => {
                if (window.confirm('确定删除这条动态吗？')) {
                  deleteDynamic(dynamic.id, {
                    onSuccess: () => {
                      toast.success('删除成功')
                      navigate('/dynamics')
                    },
                    onError: () => toast.error('删除失败，请重试')
                  })
                }
              }}
            >
              删除
            </Button>
          )}
        </div>

        <div className="mt-4">
          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap text-lg">
            {dynamic.content}
          </p>
        </div>

        <div className="mt-6 flex gap-6 text-sm text-text-muted">
          <span>👁️ {dynamic.view_count || 0}</span>
          <span>❤️ {dynamic.like_count || 0}</span>
        </div>
      </div>

      <Button variant="ghost" onClick={() => navigate(-1)}>返回</Button>
    </div>
  )
}

export default DynamicDetailPage
