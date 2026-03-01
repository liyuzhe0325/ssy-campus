import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  // 导航菜单（按模块分组，和路由完全对应）
  const navGroups = [
    {
      name: '核心功能',
      items: [
        { name: '首页', path: '/', icon: '🏠' },
        { name: '干货文章', path: '/articles', icon: '📚' },
        { name: '学长答疑', path: '/questions', icon: '❓' },
        { name: '校园新闻', path: '/news', icon: '📢' },
      ]
    },
    {
      name: '兴趣交流',
      items: [
        { name: '校园贴吧', path: '/posts', icon: '💬' },
        { name: '校园动态', path: '/dynamics', icon: '📸' },
        { name: '匿名树洞', path: '/treehole', icon: '🔒' },
      ]
    },
    {
      name: '个人中心',
      items: [
        { name: '我的主页', path: '/profile', icon: '👤' },
        { name: '我的消息', path: '/messages', icon: '✉️' },
        { name: '全局搜索', path: '/search', icon: '🔍' },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex w-64 h-screen sticky top-0 flex-col backdrop-blur border-r border-r-white/5 shadow-lg z-50">
      {/* 项目Logo */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          省实验传承平台
        </h1>
        <p className="text-xs text-text-muted mt-1">
          {user?.username ? `欢迎你，${user.username}` : '校内专属社区'}
        </p>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-6">
        {navGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            <p className="text-xs font-semibold text-text-muted px-3 mb-2 uppercase tracking-wider">
              {group.name}
            </p>
            {group.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                  ${pathname === item.path
                    ? 'bg-primary-700/30 text-white border-l-2 border-primary-500'
                    : 'text-text-secondary hover:bg-bg-hover'
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* 底部版权 */}
      <div className="p-4 border-t border-white/5 text-xs text-text-muted">
        © 2024 省实验传承平台
      </div>
    </aside>
  );
}
