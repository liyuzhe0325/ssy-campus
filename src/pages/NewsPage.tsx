import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNews } from '@/hooks/useNews'
import { useAuth } from '@/hooks/useAuth'
import NewsCard from '@/components/news/NewsCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const NewsPage = () => {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { news, isLoading, error, refetch } = useNews({ page, pageSize })

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
        <h1 className="text-2xl font-bold text-text-primary">校园新闻</h1>
        {isAdmin && (
          <Button variant="official" onClick={() => navigate('/news/new')}>
            发布新闻
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <NewsCard
            key={item.id}
            news={item}
            onClick={() => navigate(`/news/${item.id}`)}
          />
        ))}

        {news.length === 0 && (
          <div className="global-card text-center py-10 text-text-secondary">
            <p>暂无新闻</p>
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
          disabled={news.length < pageSize}
          onClick={() => setPage(p => p + 1)}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}

export default NewsPage
