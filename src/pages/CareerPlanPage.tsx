// src/pages/CareerPlanPage.tsx
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'

/**
 * 成长规划页面（职业规划/学业规划）
 * 路径：/career-plan
 * 功能：展示规划入口、后续可扩展数字孪生体、职业测评等功能
 */
const CareerPlanPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-white mb-6">成长学业中心</h1>
      
      <div className="bg-[#1A1F29] rounded-2xl p-6 border border-gray-800 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">欢迎，{user?.username || '同学'}！</h2>
        <p className="text-gray-400 mb-6">
          这里是你的专属成长规划中心，我们将结合你的兴趣、成绩和目标，
          为你定制个性化的学业与职业发展路径。
        </p>
        
        <Button 
          variant="primary" 
          className="bg-cyan-600 hover:bg-cyan-500"
          disabled={loading}
          onClick={() => setLoading(true)}
        >
          {loading ? '加载中...' : '开始规划'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1A1F29] rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-2">学业规划</h3>
          <p className="text-gray-400 text-sm">
            基于你的年级和目标，制定科学的学习计划与选科建议。
          </p>
        </div>
        <div className="bg-[#1A1F29] rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-2">职业探索</h3>
          <p className="text-gray-400 text-sm">
            了解不同专业的就业前景，匹配你的兴趣与能力。
          </p>
        </div>
      </div>
    </div>
  )
}

export default CareerPlanPage
