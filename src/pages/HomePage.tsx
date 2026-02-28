import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import QuickAction from '@/components/common/QuickAction'
import ContentCard from '@/components/common/ContentCard'
import Button from '@/components/common/Button'
import { PlusIcon } from '@heroicons/react/24/outline'
import Modal from '@/components/common/Modal'

// 临时mock数据，阶段二上传后替换为真实接口数据
const mockContentList = [
  {
    id: '1',
    title: '2026高考数学一轮复习避坑指南，亲测提分50+',
    summary: '作为去年高考数学142分的学长，给大家整理了一轮复习最容易踩的10个坑，附复习规划',
    author: {
      id: '1001',
      username: '张学长',
      avatar: '',
      tag: '2025届 | 武汉大学'
    },
    tags: ['高考', '数学', '复习规划'],
    viewCount: 1286,
    likeCount: 245,
    commentCount: 56,
    createdAt: '2026-02-28'
  },
  {
    id: '2',
    title: '计算机专业到底值不值得报？四年学习+就业全解析',
    summary: '很多同学问计算机专业的真实情况，给大家讲清楚学习内容、就业方向、院校选择，避免盲目报考',
    author: {
      id: '1002',
      username: '李学姐',
      avatar: '',
      tag: '2024届 | 华中科技大学'
    },
    tags: ['专业解读', '计算机', '志愿填报'],
    viewCount: 2103,
    likeCount: 367,
    commentCount: 89,
    createdAt: '2026-02-27'
  },
  {
    id: '3',
    title: '高三心态调整方法，模考波动大不用慌',
    summary: '模考成绩起起伏伏很正常，分享我高三一年调整心态的方法，帮你稳定发挥',
    author: {
      id: '1003',
      username: '王学长',
      avatar: '',
      tag: '2025届 | 武汉理工大学'
    },
    tags: ['高三', '心态调整', '模考'],
    viewCount: 956,
    likeCount: 189,
    commentCount: 32,
    createdAt: '2026-02-26'
  }
]

// 快捷入口配置
const quickActions = [
  { icon: '📝', name: '经验文章', path: '/articles' },
  { icon: '❓', name: '问答求助', path: '/questions' },
  { icon: '🏫', name: '大学库', path: '/universities' },
  { icon: '📊', name: '分数线', path: '/score' },
  { icon: '💬', name: '动态广场', path: '/dynamics' },
  { icon: '🌳', name: '匿名树洞', path: '/treehole' },
  { icon: '📋', name: '校园贴吧', path: '/posts' },
  { icon: '🛒', name: '校园市集', path: '/market' },
]

// 内容分类Tab
const tabList = [
  { id: 'recommend', name: '推荐' },
  { id: 'follow', name: '关注' },
  { id: 'latest', name: '最新' },
  { id: 'gaokao', name: '高考' },
  { id: 'volunteer', name: '志愿' },
  { id: 'university', name: '大学' },
  { id: 'career', name: '职业' },
]

const HomePage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('recommend')
  const [publishModalOpen, setPublishModalOpen] = useState(false)

  return (
    <div className="max-w-3xl mx-auto">
      {/* 欢迎语 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          欢迎回来，{user?.username || '同学'}！
        </h1>
        <p className="text-gray-500">这里是省实验学长学姐的经验传承平台</p>
      </div>

      {/* 快捷入口 */}
      <QuickAction actions={quickActions} className="mb-6" />

      {/* Banner横幅 */}
      <div className="mb-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 text-center">
        <p className="text-primary-800 font-medium">
          连接省实验 | 高考·志愿·大学·职业经验一站式传承
        </p>
      </div>

      {/* 内容分类Tab */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-6 min-w-max">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* 核心内容流 */}
      <div className="space-y-4">
        {mockContentList.map(item => (
          <ContentCard key={item.id} data={item} />
        ))}
      </div>

      {/* 悬浮发布按钮 */}
      <button
        onClick={() => setPublishModalOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors z-30"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* 发布选择弹窗 */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="选择发布类型"
      >
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-1"
            onClick={() => {
              setPublishModalOpen(false)
              // 后续替换为真实路由跳转
              console.log('跳转到发布文章页')
            }}
          >
            <span className="text-xl">📝</span>
            <span>发经验文章</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-1"
            onClick={() => {
              setPublishModalOpen(false)
              console.log('跳转到提问页')
            }}
          >
            <span className="text-xl">❓</span>
            <span>提问题求助</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-1"
            onClick={() => {
              setPublishModalOpen(false)
              console.log('跳转到发动态页')
            }}
          >
            <span className="text-xl">💬</span>
            <span>发校园动态</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-1"
            onClick={() => {
              setPublishModalOpen(false)
              console.log('跳转到树洞发布页')
            }}
          >
            <span className="text-xl">🌳</span>
            <span>匿名发树洞</span>
          </Button>
        </div>
        <div className="mt-4">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setPublishModalOpen(false)}
          >
            取消
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default HomePage
