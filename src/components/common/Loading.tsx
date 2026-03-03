// ============================
// 全局加载组件
// 支持全屏加载、内嵌加载、骨架屏模式
// 样式使用主题变量
// ============================

import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  text = '加载中...',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={`inline-block animate-spin rounded-full border-solid border-primary border-t-transparent ${sizeClasses[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center ${className}`}>
        {spinner}
        {text && <p className="mt-4 text-text-secondary">{text}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {spinner}
      {text && <p className="mt-4 text-text-secondary">{text}</p>}
    </div>
  );
};

export default Loading;
