import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/services/authService'
import toast from 'react-hot-toast'  // 改用 react-hot-toast
import Button from '@/components/common/Button'
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftIcon,
  HomeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  HeartIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline'

const Header: React.FC = () => {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('退出登录成功')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.message || '退出登录失败')
    }
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">省实验传承</span>
          </Link>

          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索文章、问答、贴吧..."
                className="w-full bg-dark-800/50 border border-dark-700 rounded-full py-2 pl-10 pr-4 text-sm text-text-primary placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
              />
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            {/* 快捷导航图标 */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/">
                <Button variant="ghost" size="sm" icon={<HomeIcon className="w-5 h-5" />} />
              </Link>
              <Link to="/articles">
                <Button variant="ghost" size="sm" icon={<DocumentTextIcon className="w-5 h-5" />} />
              </Link>
              <Link to="/questions">
                <Button variant="ghost" size="sm" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} />
              </Link>
              <Link to="/posts">
                <Button variant="ghost" size="sm" icon={<UsersIcon className="w-5 h-5" />} />
              </Link>
              <Link to="/treehole">
                <Button variant="ghost" size="sm" icon={<HeartIcon className="w-5 h-5" />} />
              </Link>
              <Link to="/news">
                <Button variant="ghost" size="sm" icon={<NewspaperIcon className="w-5 h-5" />} />
              </Link>
            </div>

            <Link to="/messages">
              <Button variant="ghost" size="sm" icon={<ChatBubbleLeftIcon className="w-5 h-5" />}>
                <span className="hidden md:inline">私信</span>
              </Button>
            </Link>

            {/* 用户菜单 */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-dark-700 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {profile?.nickname?.[0] || '用'}
                </div>
                <span className="hidden md:inline text-sm text-gray-300">{profile?.nickname || '用户'}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-soft py-1 z-50">
                  <Link
                    to={`/profile/${user?.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    我的主页
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
