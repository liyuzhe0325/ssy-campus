import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo与首页入口 */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="text-xl font-bold text-primary-600">
            省实验经验传承
          </Link>
          {/* 移动端用户入口 */}
          <div className="flex items-center space-x-2 md:hidden">
            {user ? (
              <Link to={`/profile/${user.id}`}>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                  {user.username?.charAt(0).toUpperCase() || '?'}
                </div>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm">登录</Button>
              </Link>
            )}
          </div>
        </div>

        {/* 全局搜索框（核心入口） */}
        <div className="w-full md:w-1/3 relative">
          <Input
            placeholder="搜经验、大学、专业、学长..."
            className="pl-10 pr-4 py-2 w-full"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* 桌面端导航与用户操作 */}
        <div className="hidden md:flex items-center space-x-5">
          {user ? (
            <>
              <Link to="/messages" className="text-gray-600 hover:text-primary-600 transition-colors">
                消息
              </Link>
              <Link to={`/profile/${user.id}`} className="text-gray-600 hover:text-primary-600 transition-colors">
                个人中心
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                退出
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">登录</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
