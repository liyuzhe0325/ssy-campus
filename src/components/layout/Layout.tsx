import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-base">
      {/* 左侧固定侧边栏 */}
      <Sidebar />
      
      {/* 右侧主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部固定导航栏 */}
        <Header />
        {/* 页面内容区 */}
        <main className="flex-1 w-full fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
