import { useState, useEffect } from 'react' // 导入 useEffect
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { login, register, isLoading, user } = useAuth() // 从 useAuth 中获取 user 状态
  const navigate = useNavigate()

  // --- 新增的 useEffect 监听器 ---
  // 当 user 对象从 null 变为有值（即登录成功）时，跳转到首页
  useEffect(() => {
    if (user) {
      // 如果已经登录，且不是加载中状态，就跳转
      // 这个小延迟可以让“登录成功”的提示显示得更自然一些，不是必须的
      const timer = setTimeout(() => {
        navigate('/', { replace: true }) // 使用 replace 可以避免登录页被保留在历史记录中
      }, 100)
      return () => clearTimeout(timer) // 清理定时器
    }
  }, [user, navigate]) // 当 user 或 navigate 函数发生变化时，执行这个 effect

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await login(email, password)
        // 注意：这里我们移除了 navigate 和 toast.success，让 useEffect 去处理跳转
        // 但我们可以保留一个提示，告知用户操作成功
        toast.success('登录成功！正在跳转...')
      } else {
        await register(email, password, username)
        toast.success('注册成功！请检查邮箱验证。')
        setIsLogin(true) // 注册成功后切换到登录界面
        setPassword('')
      }
    } catch (error: any) {
      toast.error(error.message || '操作失败')
    }
  }

  // ... 后面的 JSX 部分完全不变，和你之前的一样 ...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* ... 你的 JSX 代码 ... */}
      {/* 为了确保完整，我把 JSX 部分也复制过来了，你可以直接覆盖整个文件 */}
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? '登录账号' : '注册新账号'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="电子邮箱"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isLogin && (
              <Input
                label="用户名"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <Input
              label="密码"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              {isLogin ? '登录' : '注册'}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-500 text-sm"
            >
              {isLogin ? '没有账号？立即注册' : '已有账号？返回登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
