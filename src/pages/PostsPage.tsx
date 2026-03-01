import { useNavigate } from 'react-router-dom'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import PostCard from '@/components/posts/PostCard'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'

const PostsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const pageSize = 10

  const {
    postsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = usePosts(pageSize)

  // 将所有页的数据展平
  const posts = postsPages?.flatMap(page => page) ?? []

  if (isLoading) {
    return (
      <div className="global-container py-10 flex justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="global-container py-10 text-center text-gray-400">
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
        <h1 className="text-2xl font-bold text-white">校园贴吧</h1>
        {user && (
          <Button variant="club" onClick={() => navigate('/post/new')}>
            发布新帖
          </Button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="global-card text-center py-10 text-gray-400">
          <p>暂无帖子，快来发布第一条吧！</p>
          {user && (
            <Button className="mt-4" variant="club" onClick={() => navigate('/post/new')}>
              发布新帖
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))}

          {hasNextPage && (
            <div className="py-4 text-center">
              <Button
                variant="ghost"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? '加载中...' : '加载更多'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PostsPage
