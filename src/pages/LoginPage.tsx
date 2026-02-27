import { useState, useEffect } from 'react'
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
  const [rememberMe, setRememberMe] = useState(false)
  const { login, register, isLoading, user } = useAuth()
  const navigate = useNavigate()

  // 监听 user 状态变化，登录成功后跳转
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 简单表单验证
    if (!email.trim()) {
      toast.error('请输入邮箱')
      return
    }
    if (!password.trim()) {
      toast.error('请输入密码')
      return
    }
    if (!isLogin && !username.trim()) {
      toast.error('请输入用户名')
      return
    }

    try {
      if (isLogin) {
        await login(email, password)
        toast.success('登录成功！')
      } else {
        await register(email, password, username)
        toast.success('注册成功！请检查邮箱验证。')
        setIsLogin(true)
        setPassword('')
        setUsername('')
      }
    } catch (error: any) {
      // 错误已经通过 toast 显示，这里不需要额外操作
      console.error('登录/注册失败:', error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? '登录账号' : '注册新账号'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? '欢迎回来' : '加入校园经验传承社区'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="电子邮箱"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            {!isLogin && (
              <Input
                label="用户名"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="如何称呼你"
              />
            )}
            <Input
              label="密码"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? '输入密码' : '至少6位'}
            />
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    记住我
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    忘记密码？
                  </a>
                </div>
              </div>
            )}
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
              onClick={() => {
                setIsLogin(!isLogin)
                setPassword('')
              }}
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
