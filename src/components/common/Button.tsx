import React from 'react'
import Loading from './Loading'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | 'primary' 
    | 'secondary' 
    | 'outline' 
    | 'ghost' 
    | 'danger'
    | 'learning'   // 青蓝主题（学习类）
    | 'interest'   // 活力橙主题（兴趣类）
    | 'private'    // 神秘紫主题（树洞）
    | 'official'   // 权威金主题（新闻）
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'global-btn'

  const variantClasses = {
    primary: 'global-btn-primary',
    secondary: 'global-btn-secondary',
    outline: 'global-btn-outline',
    ghost: 'global-btn-ghost',
    danger: 'global-btn-danger',
    learning: 'bg-learning-500 hover:bg-learning-600 text-white focus:ring-learning-500 shadow-lg shadow-learning-500/20',
    interest: 'bg-interest-500 hover:bg-interest-600 text-white focus:ring-interest-500 shadow-lg shadow-interest-500/20',
    private: 'bg-private-500 hover:bg-private-600 text-white focus:ring-private-500 shadow-lg shadow-private-500/20',
    official: 'bg-official-500 hover:bg-official-600 text-white focus:ring-official-500 shadow-lg shadow-official-500/20',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-button gap-1.5',
    md: 'px-4 py-2 rounded-button gap-2',
    lg: 'px-6 py-3 text-lg rounded-button gap-2.5',
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loading size="sm" className="mr-2" />}
      {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </button>
  )
}

export default Button
