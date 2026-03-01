import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useArticles, useRelatedArticles } from '@/hooks/useArticle'
import { useAuth } from '@/hooks/useAuth'
import { useLike } from '@/hooks/useLike'
import { useFavorite } from '@/hooks/useFavorite'
import { useComments } from '@/hooks/useComments'
import CommentSection from '@/components/comments/CommentSection'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'
import ArticleCard from '@/components/articles/ArticleCard'
import toast from 'react-hot-toast'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { useArticleById } = useArticles({ page: 1, pageSize: 10 })
  const { data: article, isLoading, error } = useArticleById(id || '')

  // 阅读进度条
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrolled)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 互动 hooks
  const { likeCount, userLiked, toggleLike, isToggling } = useLike('article', id!)
  const { isFavorited, toggleFavorite, isToggling: isFavToggling } = useFavorite('article', id!)
  const { comments, addComment, isAdding, deleteComment } = useComments('article', id!)

  // 推荐文章
  const tagIds = article?.tags?.map((t: any) => t.id) || []
  const { data: relatedArticles = [] } = useRelatedArticles(id!, tagIds, 3)

  const isAuthor = user?.id === article?.author_id

  // 阅读时长计算
  const readingTime = article?.content ? Math.ceil(article.content.length / 500) : 0

  const handleDelete = async () => {
    if (!window.confirm('确定删除这篇文章吗？')) return
    try {
      // 调用删除API（需在 useArticles 中添加 deleteArticle）
      toast.success('删除成功')
      navigate('/articles')
    } catch {
      toast.error('删除失败')
    }
  }

  if (isLoading) return <div className="global-container py-10 flex justify-center"><Loading /></div>
  if (error || !article) return (
    <div className="global-container py-10 text-center text-text-secondary">
      <p>文章不存在或加载失败</p>
      <Button className="mt-4" variant="primary" onClick={() => navigate('/articles')}>返回列表</Button>
    </div>
  )

  return (
    <>
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-dark-700 z-50">
        <div 
          className="h-full bg-learning-500 transition-all duration-100" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="global-container max-w-3xl py-6">
        {/* 返回按钮 */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-text-secondary hover:text-text-primary transition flex items-center gap-1"
        >
          ← 返回
        </button>

        {/* 文章标题区 */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            {/* 作者信息 */}
            <Link 
              to={`/profile/${article.author_id}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500">
                {article.profiles?.username?.[0] || '作'}
              </div>
              <div>
                <div className="font-medium text-text-primary group-hover:text-primary-500 transition">
                  {article.profiles?.username || '同学'}
                </div>
                <div className="text-xs text-text-secondary">
                  {article.profiles?.grade || '省实验校友'} · {readingTime} 分钟阅读
                </div>
              </div>
            </Link>

            {/* 文章元信息 */}
            <div className="flex items-center gap-4 text-text-secondary text-sm">
              <span>📅 {new Date(article.created_at).toLocaleDateString()}</span>
              <span>👁️ {article.view_count || 0}</span>
            </div>
          </div>

          {/* 标签 */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag: any) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.id}`}
                  className="px-3 py-1 bg-learning-500/10 text-learning-500 rounded-full text-xs hover:bg-learning-500/20 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 文章正文 */}
        <div className="global-card mb-8 prose prose-invert max-w-none">
          <div className="text-text-primary leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {/* 互动栏 */}
        <div className="flex items-center gap-6 text-text-secondary mb-8 border-t border-dark-700 pt-6">
          <button
            onClick={() => toggleLike()}
            disabled={isToggling}
            className="flex items-center gap-1 hover:text-learning-500 transition group"
          >
            {userLiked ? 
              <HeartSolid className="w-5 h-5 text-learning-500" /> : 
              <HeartOutline className="w-5 h-5 group-hover:text-learning-500" />
            }
            <span>{likeCount} 点赞</span>
          </button>

          <button
            onClick={() => toggleFavorite()}
            disabled={isFavToggling}
            className="flex items-center gap-1 hover:text-official-500 transition group"
          >
            {isFavorited ? 
              <BookmarkSolid className="w-5 h-5 text-official-500" /> : 
              <BookmarkOutline className="w-5 h-5 group-hover:text-official-500" />
            }
            <span>收藏</span>
          </button>

          {isAuthor && (
            <>
              <Button variant="ghost" size="sm" onClick={() => toast.loading('编辑功能开发中')}>
                编辑
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                删除
              </Button>
            </>
          )}
        </div>

        {/* 评论区 */}
        <CommentSection
          comments={comments}
          onAddComment={addComment}
          onDeleteComment={deleteComment}
          isAdding={isAdding}
        />

        {/* 相关文章推荐 */}
        {relatedArticles.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <span>📚</span> 相关推荐
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((relArticle: any) => (
                <ArticleCard
                  key={relArticle.id}
                  article={relArticle}
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate(`/article/${relArticle.id}`)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ArticleDetailPage
