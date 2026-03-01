import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { signIn, signUp } from '@/services/authService'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  })

  const navigate = useNavigate()
  const { user } = useAuth()

  // 已登录用户自动跳转首页
  React.useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLoginMode) {
        await signIn(formData.email, formData.password)
        toast.success('登录成功！')
        navigate('/', { replace: true })
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('两次输入的密码不一致')
        }
        if (formData.nickname.trim().length < 2) {
          throw new Error('昵称至少需要2个字符')
        }
        await signUp(formData.email, formData.password, formData.nickname.trim())
        toast.success('注册成功！已自动登录')
        navigate('/', { replace: true })
      }
    } catch (error: any) {
      toast.error(error.message || '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-800 rounded-2xl shadow-soft p-8 border border-dark-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {isLoginMode ? '欢迎回来' : '注册账号'}
          </h1>
          <p className="text-text-secondary">
            {isLoginMode ? '登录你的账号，开启经验传承之旅' : '加入我们，分享你的校园经验'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="邮箱"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="请输入你的邮箱"
            required
          />

          {!isLoginMode && (
            <Input
              label="昵称"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="请输入你的昵称"
              required
            />
          )}

          <Input
            label="密码"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="请输入密码"
            required
          />

          {!isLoginMode && (
            <Input
              label="确认密码"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="请再次输入密码"
              required
            />
          )}

          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            {isLoginMode ? '登录' : '注册'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-primary-500 hover:text-primary-400 text-sm transition-colors"
          >
            {isLoginMode ? '还没有账号？点击注册' : '已有账号？点击登录'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
