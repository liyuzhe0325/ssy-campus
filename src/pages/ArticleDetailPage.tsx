import { useParams, useNavigate } from 'react-router-dom'
// 导入文章业务Hook
import { useArticles } from '@/hooks/useArticles'
// 导入用户认证Hook，判断是否为作者
import { useAuth } from '@/hooks/useAuth'
// 导入通用组件
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

/**
 * 文章详情页
 * 路径：/article/:id
 * 功能：展示文章完整内容、作者信息，提供编辑/删除权限（仅作者本人）
 */
const ArticleDetailPage = () => {
  // 从路由参数获取文章ID
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  // 获取当前登录用户
  const { user } = useAuth()
  // 使用业务Hook获取文章详情
  const { useArticleById } = useArticles({ page: 1, pageSize: 10 })
  const { 
    data: article, 
    isLoading, 
    error, 
    refetch 
  } = useArticleById(id || '')

  // 加载中状态渲染
  if (isLoading) {
    return (
      <div className="py-10 flex justify-center">
        <Loading />
      </div>
    )
  }

  // 错误或文章不存在状态渲染
  if (error || !article) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>文章不存在或加载失败</p>
        <Button 
          variant="primary" 
          className="mt-4" 
          onClick={() => navigate('/articles')}
        >
          返回列表
        </Button>
      </div>
    )
  }

  // 判断当前用户是否为文章作者（用于控制编辑/删除权限）
  const isAuthor = user?.id === article.author_id

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* 文章标题与操作区 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{article.title}</h1>
        <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
          <span>作者：{article.profiles?.username || '同学'}</span>
          <span>发布时间：{new Date(article.created_at).toLocaleDateString()}</span>
          {/* 仅作者可见编辑/删除按钮 */}
          {isAuthor && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // 后续可扩展编辑页，目前先占位
                  alert('编辑功能开发中')
                }}
              >
                编辑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400"
                onClick={() => {
                  if (window.confirm('确定要删除这篇文章吗？')) {
                    // 调用删除Mutation（后续完善）
                    console.log('删除文章', article.id)
                  }
                }}
              >
                删除
              </Button>
            </div>
          )}
        </div>
        {/* 文章标签 */}
        <div className="flex gap-2 flex-wrap">
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 文章正文内容区 */}
      <div className="bg-[#1A1F29] rounded-xl p-6 border border-gray-800 mb-6">
        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </div>

      {/* 文章统计信息 */}
      <div className="flex gap-6 text-gray-400 text-sm">
        <span>👁️ {article.view_count || 0} 阅读</span>
        <span>❤️ {article.like_count || 0} 点赞</span>
        <span>💬 {article.comment_count || 0} 评论</span>
      </div>

      {/* 返回按钮 */}
      <div className="mt-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
      </div>
    </div>
  )
}

export default ArticleDetailPage
