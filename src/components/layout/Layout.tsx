import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import TabBar from './TabBar'
import { useAuth } from '@/hooks/useAuth'

const Layout = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4 pb-20 md:pb-6">
        <Outlet />
      </main>
      {/* 仅登录用户显示底部TabBar，桌面端隐藏，移动端显示 */}
      {user && <TabBar className="md:hidden" />}
      <Footer className="hidden md:block" />
    </div>
  )
}

export default Layout
