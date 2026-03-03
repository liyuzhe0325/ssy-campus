import React, { useEffect, useState } from 'react';
import { isDevModeEnabled, enableDevMode } from '@/utils/devMode';

const DevPanel: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isDevModeEnabled());
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-card border border-border rounded-card p-3 shadow-lg text-sm">
      <div className="flex items-center space-x-2">
        <span className="text-primary">⚙️ 开发者模式</span>
        <button
          onClick={() => enableDevMode(false)}
          className="px-2 py-1 bg-error/20 text-error rounded hover:bg-error/30"
        >
          关闭
        </button>
      </div>
      <p className="text-text-secondary text-xs mt-1">使用 Ctrl+Shift+D 切换</p>
      {/* 后续可添加更多调试信息 */}
    </div>
  );
};

export default DevPanel;
