import React from 'react'
import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

interface QuickActionProps {
  actions: {
    icon: string
    name: string
    path: string
  }[]
  className?: string
}

const QuickAction: React.FC<QuickActionProps> = ({ actions, className }) => {
  return (
    <div className={twMerge('grid grid-cols-4 gap-3', className)}>
      {actions.map((action) => (
        <Link
          key={action.path}
          to={action.path}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">{action.icon}</span>
          <span className="text-xs text-gray-700 font-medium">{action.name}</span>
        </Link>
      ))}
    </div>
  )
}

export default QuickAction
