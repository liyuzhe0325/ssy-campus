// ============================
// 头像组件
// 显示用户头像，支持大小、默认头像、在线状态等
// 依赖：无
// ============================

import React from 'react';
import { DEFAULT_AVATAR } from '@/config/constants';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away';
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  size = 'md',
  className = '',
  status,
}) => {
  const [error, setError] = React.useState(false);

  const handleError = () => setError(true);

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={error || !src ? DEFAULT_AVATAR : src}
        alt={alt}
        className={`${sizeMap[size]} rounded-full object-cover border-2 border-border`}
        onError={handleError}
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-card ${
            status === 'online' ? 'bg-success' : status === 'away' ? 'bg-warning' : 'bg-text-secondary'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
