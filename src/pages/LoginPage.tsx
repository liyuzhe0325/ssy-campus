import { useState } from 'react'
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
  const { login, register, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await login(email, password)
        toast.success('登录成功！')
        navigate('/')
      } else {
        await register(email, password, username)
        toast.success('注册成功！请检查邮箱验证。')
        setIsLogin(true)
        setPassword('')
      }
    } catch (error: any) {
      toast.error(error.message || '操作失败')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
