// ============================
// 新闻详情页
// ============================

import { useParams, useNavigate } from 'react-router-dom'
import { useNews } from '@/hooks/useNews'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const NewsDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { useNewsById } = useNews({ page:1, pageSize:10 })
  const { data: news, isLoading } = useNewsById(id!)

  if (isLoading) return <div className="py-10 flex justify-center"><Loading /></div>
  if (!news) return (
    <div className="py-10 text-center text-gray-400">
      <p>新闻不存在</p>
      <Button onClick={() => navigate('/news')}>返回</Button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">{news.title}</h1>
        <p className="text-xs text-gray-400 mt-1">
          {news.category} · {new Date(news.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-[#1A1F29] rounded-xl p-6 border border-gray-800 mb-6">
        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{news.content}</div>
      </div>

      <Button variant="ghost" onClick={() => navigate(-1)}>返回</Button>
    </div>
  )
}

export default NewsDetailPage
