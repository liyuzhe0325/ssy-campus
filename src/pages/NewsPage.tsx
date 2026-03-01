// ============================
// 校园新闻列表页（官方资讯）
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNews } from '@/hooks/useNews'
import { useAuth } from '@/hooks/useAuth'
import NewsCard from '@/components/news/NewsCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const NewsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { newsList, isLoadingNews, newsError, refetchNews } = useNews({ page, pageSize })

  if (isLoadingNews) return <div className="py-10 flex justify-center"><Loading /></div>
  if (newsError) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>新闻加载失败</p>
        <Button variant="primary" onClick={refetchNews}>刷新</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">校园新闻</h1>
      </div>

      <div className="space-y-4">
        {newsList.map(n => (
          <NewsCard key={n.id} news={n} onClick={() => navigate(`/news/${n.id}`)} />
        ))}
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page-1)}>上一页</Button>
        <span className="text-gray-400">第{page}页</span>
        <Button variant="ghost" disabled={newsList.length < pageSize} onClick={() => setPage(page+1)}>下一页</Button>
      </div>
    </div>
  )
}

export default NewsPage
