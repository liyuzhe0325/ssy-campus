import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import {
  HomeIcon,
  BuildingLibraryIcon,
  BellIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface TabBarProps {
  className?: string
}

const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const location = useLocation()

  const tabList = [
    {
      path: '/',
      name: '首页',
      icon: HomeIcon
    },
    {
      path: '/universities',
      name: '大学库',
      icon: BuildingLibraryIcon
    },
    {
      path: '/notification',
      name: '互动',
      icon: BellIcon
    },
    {
      path: '/profile/me',
      name: '我的',
      icon: UserIcon
    }
  ]

  return (
    <div className={twMerge(
      'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30',
      className
    )}>
      <div className="grid grid-cols-4 h-16">
        {tabList.map((tab) => {
          const isActive = location.pathname === tab.path
          const Icon = tab.icon
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center justify-center gap-1"
            >
              <Icon
                className={twMerge(
                  'w-5 h-5',
                  isActive ? 'text-primary-600' : 'text-gray-500'
                )}
              />
              <span
                className={twMerge(
                  'text-xs font-medium',
                  isActive ? 'text-primary-600' : 'text-gray-500'
                )}
              >
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TabBar
