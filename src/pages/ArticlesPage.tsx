import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// 导入文章业务Hook
import { useArticles } from '@/hooks/useArticles'
// 导入通用组件
import ContentCard from '@/components/common/ContentCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

/**
 * 经验资料文库（文章列表页）
 * 路径：/articles
 * 功能：展示所有经验文章，支持分页，点击跳转到详情页
 */
const ArticlesPage = () => {
  const navigate = useNavigate()
  // 分页状态：当前页码
  const [page, setPage] = useState(1)
  // 每页显示数量
  const pageSize = 10

  // 使用业务Hook获取文章列表
  const { 
    articles, 
    isLoadingArticles, 
    articlesError, 
    refetchArticles 
  } = useArticles({ page, pageSize })

  // 加载中状态渲染
  if (isLoadingArticles) {
    return (
      <div className="py-10 flex justify-center">
        <Loading />
      </div>
    )
  }

  // 错误状态渲染
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
    <div className="max-w-3xl mx-auto py-2">
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
          <ContentCard
            key={article.id}
            data={{
              id: article.id,
              title: article.title,
              summary: article.summary || article.content.substring(0, 100),
              author: {
                id: article.author_id,
                username: article.profiles?.username || '同学',
                avatar: article.profiles?.avatar || '',
                tag: article.profiles?.grade || '省实验在校生'
              },
              tags: article.tags || [],
              viewCount: article.view_count || 0,
              likeCount: article.like_count || 0,
              commentCount: article.comment_count || 0,
              createdAt: new Date(article.created_at).toLocaleDateString()
            }}
            // 点击卡片跳转到详情页
            onClick={() => navigate(`/article/${article.id}`)}
          />
        ))}

        {/* 空状态：无文章时的提示 */}
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

      {/* 分页控制区 */}
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
          disabled={articles.length < pageSize} // 最后一页禁用下一页
          onClick={() => setPage(page + 1)}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}

export default ArticlesPage
