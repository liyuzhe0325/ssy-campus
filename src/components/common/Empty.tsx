// ============================
// 空状态组件
// 用于展示没有数据时的占位提示
// 依赖：无
// ============================

import React from 'react';

interface EmptyProps {
  description?: string;
  className?: string;
}

const Empty: React.FC<EmptyProps> = ({
  description = '暂无数据',
  className = '',
}) => {
  return (
    <div className={`text-center py-8 text-text-secondary ${className}`}>
      <p>{description}</p>
    </div>
  );
};

export default Empty;
