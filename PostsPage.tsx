// ============================
// 校园贴吧列表页（适配当前深色布局）
// 路径：/posts
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import PostCard from '@/components/posts/PostCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const PostsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    posts,
    isLoadingPosts,
    postsError,
    refetchPosts
  } = usePosts({ page, pageSize })

  if (isLoadingPosts) return <div className="py-10 flex justify-center"><Loading /></div>
  if (postsError) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>贴吧加载失败，请重试</p>
        <Button variant="primary" className="mt-4" onClick={refetchPosts}>刷新</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">校园贴吧</h1>
        <Button variant="primary" className="bg-yellow-600 hover:bg-yellow-500" onClick={() => navigate('/post/new')}>
          发帖子
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onClick={() => navigate(`/post/${post.id}`)} />
        ))}

        {posts.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            <p>暂无帖子，快来发帖交流～</p>
            <Button variant="primary" className="mt-4 bg-yellow-600" onClick={() => navigate('/post/new')}>
              发布新帖
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
        <span className="text-gray-400">第 {page} 页</span>
        <Button variant="ghost" disabled={posts.length < pageSize} onClick={() => setPage(page + 1)}>下一页</Button>
      </div>
    </div>
  )
}

export default PostsPage
