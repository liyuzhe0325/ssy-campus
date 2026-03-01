import React from 'react'
import Loading from './Loading'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'learning' | 'interest' | 'private' | 'official'
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
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-lg shadow-primary-500/20',
    secondary: 'bg-success-500 hover:bg-success-600 text-white focus:ring-success-500 shadow-lg shadow-success-500/20',
    outline: 'border border-dark-600 hover:border-primary-500 text-gray-300 hover:text-white focus:ring-primary-500',
    ghost: 'text-gray-400 hover:text-white hover:bg-dark-800 focus:ring-white/10',
    danger: 'bg-danger hover:bg-red-600 text-white focus:ring-red-500',
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
