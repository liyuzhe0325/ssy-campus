import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
  BellIcon, UserIcon, HomeIcon, DocumentTextIcon,
  QuestionMarkCircleIcon, AcademicCapIcon, ChartBarIcon,
  ChatBubbleLeftIcon, CogIcon, ChevronDownIcon
} from '@heroicons/react/24/outline'

const Layout = () => {
  const { user } = useAuthStore()
  const [profileExpand, setProfileExpand] = useState(false)

  // 导航全面适配：在校生为主 + 毕业生为辅
  const navItems = [
    { icon: <HomeIcon className="w-5 h-5" />, label: '首页', path: '/' },
    { icon: <DocumentTextIcon className="w-5 h-5" />, label: '经验资料', path: '/articles' },
    { icon: <QuestionMarkCircleIcon className="w-5 h-5" />, label: '校园互助', path: '/questions' },
    { icon: <AcademicCapIcon className="w-5 h-5" />, label: '专业院校', path: '/universities' },
    { icon: <ChartBarIcon className="w-5 h-5" />, label: '升学数据', path: '/score' },
    { icon: <ChatBubbleLeftIcon className="w-5 h-5" />, label: '校园动态', path: '/dynamics' },
  ]

  return (
    <div className="min-h-screen bg-[#0F1217] text-gray-200 flex overflow-hidden">
      {/* 左侧固定侧边栏｜在校生友好版 */}
      <aside className="w-[220px] h-screen fixed left-0 top-0 bg-[#1A1F29] border-r border-gray-800 flex flex-col z-50">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-blue-400">🎓</span>
            省实验传承平台
          </h1>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#252B3A] hover:text-white transition-all"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* 个人中心（折叠隐藏扩展功能） */}
        <div className="border-t border-gray-800 p-3">
          <button
            onClick={() => setProfileExpand(!profileExpand)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-400 hover:bg-[#252B3A] hover:text-white transition-all"
          >
            <div className="flex items-center gap-3">
              <UserIcon className="w-5 h-5" />
              <span className="text-sm font-medium">个人中心</span>
            </div>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${profileExpand ? 'rotate-180' : ''}`} />
          </button>

          {profileExpand && (
            <div className="mt-1 ml-8 space-y-1 flex flex-col">
              <a href="/profile" className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#252B3A]">个人资料</a>
              <a href="/digital-twin" className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#252B3A]">数字孪生体</a>
              <a href="/career-plan" className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#252B3A]">成长规划</a>
              <a href="/settings" className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#252B3A]">系统设置</a>
            </div>
          )}
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 ml-[220px] flex flex-col">
        <header className="h-16 fixed left-[220px] right-0 top-0 bg-[#1A1F29]/80 backdrop-blur-md border-b border-gray-800 z-40 flex items-center justify-between px-8">
          <div className="text-sm text-gray-400">在校生·毕业生共同成长社区</div>
          <div className="flex items-center gap-4">
            <BellIcon className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium">
              {user?.username?.charAt(0) || '学'}
            </div>
          </div>
        </header>

        <main className="flex-1 mt-16 p-8 max-w-[1200px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
