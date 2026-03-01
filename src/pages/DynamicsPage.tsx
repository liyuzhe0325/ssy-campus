import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDynamics } from '@/hooks/useDynamics'
import { useAuth } from '@/hooks/useAuth'
import DynamicCard from '@/components/dynamics/DynamicCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const DynamicsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { dynamics, isLoading, error, refetch } = useDynamics({ page, pageSize })

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
        <h1 className="text-2xl font-bold text-text-primary">校园动态</h1>
        {user && (
          <Button variant="secondary" onClick={() => navigate('/dynamic/new')}>
            发动态
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {dynamics.map((dynamic) => (
          <DynamicCard
            key={dynamic.id}
            dynamic={dynamic}
            onClick={() => navigate(`/dynamic/${dynamic.id}`)}
          />
        ))}

        {dynamics.length === 0 && (
          <div className="global-card text-center py-10 text-text-secondary">
            <p>暂无动态，快来分享你的校园生活吧～</p>
            {user && (
              <Button className="mt-4" variant="secondary" onClick={() => navigate('/dynamic/new')}>
                发动态
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
          disabled={dynamics.length < pageSize}
          onClick={() => setPage(p => p + 1)}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}

export default DynamicsPage
