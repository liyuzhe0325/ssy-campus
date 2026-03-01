// ============================
// 校园动态列表页（适配你当前深色左侧布局）
// 路径：/dynamics
// 功能：展示校园实时动态、简短内容、发布入口、分页、作者信息
// ============================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDynamics } from '@/hooks/useDynamics'
import { useAuth } from '@/hooks/useAuth'
import DynamicCard from '@/components/dynamics/DynamicCard'
import Loading from '@/components/common/Loading'
import Button from '@/components/common/Button'

const DynamicsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 12

  const {
    dynamics,
    isLoadingDynamics,
    dynamicsError,
    refetchDynamics
  } = useDynamics({ page, pageSize })

  // 加载状态
  if (isLoadingDynamics) {
    return <div className="py-10 flex justify-center"><Loading /></div>
  }

  // 错误状态
  if (dynamicsError) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p>动态加载失败，请刷新重试</p>
        <Button variant="primary" className="mt-4" onClick={refetchDynamics}>刷新</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* 顶部标题 + 发布按钮 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">校园动态</h1>
        <Button
          variant="primary"
          className="bg-green-600 hover:bg-green-500"
          onClick={() => navigate('/dynamic/new')}
        >
          发动态
        </Button>
      </div>

      {/* 动态列表（流式卡片） */}
      <div className="space-y-4">
        {dynamics.map((dynamic) => (
          <DynamicCard
            key={dynamic.id}
            dynamic={dynamic}
            onClick={() => navigate(`/dynamic/${dynamic.id}`)}
          />
        ))}

        {/* 空状态 */}
        {dynamics.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            <p>暂无校园动态，快来分享身边新鲜事～</p>
            <Button variant="primary" className="mt-4 bg-green-600" onClick={() => navigate('/dynamic/new')}>
              发布第一条动态
            </Button>
          </div>
        )}
      </div>

      {/* 分页 */}
      <div className="flex justify-center gap-3 mt-8">
        <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</Button>
        <span className="text-gray-400">第 {page} 页</span>
        <Button variant="ghost" disabled={dynamics.length < pageSize} onClick={() => setPage(page + 1)}>下一页</Button>
      </div>
    </div>
  )
}

export default DynamicsPage
