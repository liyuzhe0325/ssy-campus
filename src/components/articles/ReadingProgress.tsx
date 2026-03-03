
// ============================
// 文章阅读进度条组件
// 显示在文章详情页顶部，随滚动更新阅读进度
// 依赖：无
// 样式：使用主题变量，适配个性化主题
// ============================

import React, { useEffect, useState } from 'react';

/**
 * 阅读进度条组件
 * @returns 一个固定在顶部的进度条，宽度随滚动百分比变化
 */
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // 计算当前滚动位置相对于整个文档高度的百分比
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateProgress);
    // 初始调用一次
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50"
      style={{ backgroundColor: 'var(--color-border)' }}
    >
      <div
        className="h-full transition-width duration-200 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: 'var(--color-primary)',
        }}
      />
    </div>
  );
};

export default ReadingProgress;
