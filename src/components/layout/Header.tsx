import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToastStore } from '@/store/toastStore';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      addToast({ type: 'success', message: '已退出登录' });
      navigate('/login');
    } catch (error) {
      addToast({ type: 'error', message: '退出失败' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-heading font-semibold text-primary">省实验传承</span>
        </Link>

        {/* 搜索框（MVP暂为占位） */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索文章、问答..."
              className="w-full bg-background border border-border rounded-input px-4 py-2 text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <button className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-background transition">
                <Bell size={20} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Avatar src={profile?.avatar_url} size="sm" />
                  <span className="text-text hidden sm:inline">{profile?.nickname}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-card shadow-card py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-text hover:bg-background transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>个人中心</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-text hover:bg-background transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      <span>设置</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-text hover:bg-background transition"
                    >
                      <LogOut size={16} />
                      <span>退出</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button onClick={() => navigate('/login')} variant="primary" size="sm">
              登录
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
