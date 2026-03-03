import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

/**
 * 通用按钮组件，支持主题变量
 * @param variant - 按钮样式变体
 * @param size - 尺寸
 * @param loading - 是否加载状态
 * @param fullWidth - 是否100%宽度
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-button transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  // 使用主题变量，但保留具体颜色以应对主题未加载的情况（实际已加载）
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/80 text-white focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/80 text-white focus:ring-secondary',
    outline: 'border border-border hover:border-primary/50 text-text-secondary hover:text-text',
    ghost: 'text-text-secondary hover:text-text hover:bg-card/50',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '加载中...' : children}
    </button>
  )
}

export default Button
