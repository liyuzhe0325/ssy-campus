// ============================
// 经验资料文库（文章列表页）
// 路径：/articles
// 功能：展示所有已审核文章，支持分页，点击进入详情页
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '@/hooks/useArticles'
import { useAuth } from '@/hooks/useAuth'
import ArticleCard from '@/components/articles/ArticleCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const ArticlesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 10

  // 获取文章列表
  const { 
    articles, 
    isLoadingArticles, 
    articlesError, 
    refetchArticles 
  } = useArticles({ page, pageSize })

  // 加载中状态
  if (isLoadingArticles) {
    return (
      <div className="py-10 flex justify-center">
        <Loading />
      </div>
    )
  }

  // 错误状态
  if (articlesError) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>加载失败，请稍后重试</p>
        <Button 
          variant="primary" 
          className="mt-4" 
          onClick={() => refetchArticles()}
        >
          刷新
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* 页面标题与操作区 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">经验资料文库</h1>
        <Button
          variant="primary"
          className="bg-blue-600 hover:bg-blue-500"
          onClick={() => navigate('/article/new')}
        >
          发布经验
        </Button>
      </div>

      {/* 文章列表 */}
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => navigate(`/article/${article.id}`)}
          />
        ))}

        {/* 空状态 */}
        {articles.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500">暂无经验文章，快来分享你的学习与校园经验吧～</p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/article/new')}
            >
              发布第一篇经验
            </Button>
          </div>
        )}
      </div>

      {/* 分页控制 */}
      <div className="flex justify-center gap-2 mt-8">
        <Button
          variant="ghost"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          上一页
        </Button>
        <span className="text-gray-400">第 {page} 页</span>
        <Button
          variant="ghost"
          disabled={articles.length < pageSize}
          onClick={() => setPage(page + 1)}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}

export default ArticlesPage
