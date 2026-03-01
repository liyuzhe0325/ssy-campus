import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-b-white/5 shadow-sm">
      <div className="global-container flex items-center justify-between h-16 py-0">
        {/* 移动端Logo（平板/PC端侧边栏已显示，移动端补充） */}
        <div className="md:hidden font-bold text-lg text-white">
          省实验传承
        </div>

        {/* 搜索入口 */}
        <button
          onClick={() => navigate('/search')}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-bg-hover text-text-secondary text-sm hover:bg-bg-hover/80 transition-all"
        >
          🔍 搜索文章、问答、贴吧...
        </button>
        <button
          onClick={() => navigate('/search')}
          className="md:hidden text-xl text-text-secondary"
        >
          🔍
        </button>

        {/* 用户操作区 */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="text-sm text-text-secondary hover:text-white transition-all"
              >
                我的主页
              </button>
              <button
                onClick={logout}
                className="global-btn global-btn-ghost text-sm !px-3 !py-1.5"
              >
                退出
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="global-btn global-btn-primary text-sm"
            >
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
