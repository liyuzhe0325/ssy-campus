import React from 'react'
import { useArticles } from '@/hooks/useArticles'
import ArticleCard from '@/components/articles/ArticleCard'
import Loading from '@/components/common/Loading'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

const ArticlesPage: React.FC = () => {
  const { data: articles, isLoading, error } = useArticles()

  if (isLoading) return <Loading />
  if (error) return <div className="text-red-500">加载失败：{error.message}</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">经验文章</h1>
        <Link to="/articles/new">
          <Button>写文章</Button>
        </Link>
      </div>
      {!articles || articles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          暂无文章，快去发布第一篇吧！
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ArticlesPage
