import React from 'react'
import { useParams } from 'react-router-dom'
import { useArticle } from '@/hooks/useArticles'
import Loading from '@/components/common/Loading'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import CommentSection from '@/components/comments/CommentSection'

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: article, isLoading, error } = useArticle(id!)

  if (isLoading) return <Loading />
  if (error || !article) return <div className="text-red-500">文章不存在或加载失败</div>

  return (
    <div className="max-w-3xl mx-auto">
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded mr-3">
            {article.category}
          </span>
          <span>作者：{article.author?.username || '匿名'}</span>
          <span className="mx-2">·</span>
          <span>{format(new Date(article.created_at), 'PPP', { locale: zhCN })}</span>
          <span className="mx-2">·</span>
          <span>👁️ {article.view_count} 阅读</span>
        </div>
        <div className="prose max-w-none">
          {/* 这里简单展示文本，实际应该支持富文本渲染，需用 dangerouslySetInnerHTML 但要注意 XSS */}
          <p className="whitespace-pre-wrap">{article.content}</p>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200">
          <CommentSection targetType="article" targetId={article.id} />
        </div>
      </article>
    </div>
  )
}

export default ArticleDetailPage
