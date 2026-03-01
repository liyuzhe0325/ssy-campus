import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTreehole } from '@/hooks/useTreehole'
import { useAuth } from '@/hooks/useAuth'
import TreeholeCard from '@/components/treehole/TreeholeCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const TreeholePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { posts, isLoading, error, refetch } = useTreehole({ page, pageSize })

  if (isLoading) {
    return (
      <div className="global-container py-10 flex justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="global-container py-10 text-center text-text-secondary">
        <p>加载失败，请重试</p>
        <Button className="mt-4" variant="primary" onClick={() => refetch()}>
          刷新
        </Button>
      </div>
    )
  }

  return (
    <div className="global-container max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">匿名树洞</h1>
        {user && (
          <Button variant="private" onClick={() => navigate('/treehole/new')}>
            匿名倾诉
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <TreeholeCard
            key={post.id}
            post={post}
            onClick={() => navigate(`/treehole/${post.id}`)}
          />
        ))}

        {posts.length === 0 && (
          <div className="global-card text-center py-10 text-text-secondary">
            <p>暂无树洞内容，快来匿名倾诉吧～</p>
            {user && (
              <Button className="mt-4" variant="private" onClick={() => navigate('/treehole/new')}>
                匿名倾诉
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          上一页
        </Button>
        <span className="text-text-secondary">第 {page} 页</span>
        <Button
          variant="ghost"
          disabled={posts.length < pageSize}
          onClick={() => setPage(p => p + 1)}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}

export default TreeholePage
