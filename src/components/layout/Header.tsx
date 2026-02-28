import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* 首页链接：网站标题 */}
        <Link to="/" className="text-xl font-bold text-primary-600">
          省实验经验传承
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/messages" className="text-gray-600 hover:text-primary-600">
                消息
              </Link>
              <Link to={`/profile/${user.id}`} className="text-gray-600 hover:text-primary-600">
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
