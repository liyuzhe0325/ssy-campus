// ============================
// 匿名树洞列表页（适配当前深色布局）
// 路径：/treehole
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTreehole } from '@/hooks/useTreehole'
import { useAuth } from '@/hooks/useAuth'
import TreeholeCard from '@/components/treehole/TreeholeCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const TreeholePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 12

  const {
    treeholePosts,
    isLoadingTreehole,
    treeholeError,
    refetchTreehole
  } = useTreehole({ page, pageSize })

  if (isLoadingTreehole) return <div className="py-10 flex justify-center"><Loading /></div>
  if (treeholeError) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>树洞加载失败，请重试</p>
        <Button variant="primary" className="mt-4" onClick={refetchTreehole}>刷新</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">匿名树洞</h1>
        <Button
          variant="primary"
          className="bg-pink-600 hover:bg-pink-500"
          onClick={() => navigate('/treehole/new')}
        >
          发树洞
        </Button>
      </div>

      <div className="space-y-4">
        {treeholePosts.map((post) => (
          <TreeholeCard
            key={post.id}
            post={post}
            onClick={() => navigate(`/treehole/${post.id}`)}
          />
        ))}

        {treeholePosts.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            <p>树洞空空如也，匿名说出你的心事～</p>
            <Button variant="primary" className="mt-4 bg-pink-600" onClick={() => navigate('/treehole/new')}>
              发布第一条匿名心事
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3 mt-8">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
        <span className="text-gray-400">第 {page} 页</span>
        <Button variant="ghost" disabled={treeholePosts.length < pageSize} onClick={() => setPage(page + 1)}>下一页</Button>
      </div>
    </div>
  )
}

export default TreeholePage
