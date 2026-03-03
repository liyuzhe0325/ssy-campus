import React, { useEffect } from 'react';
import { useToastStore } from '@/store/toastStore';

const toastIcons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center p-4 rounded-card shadow-lg border
            bg-card border-border text-text
            animate-slide-in-right
          `}
        >
          <span className="mr-2 text-lg">{toastIcons[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-text-secondary hover:text-text"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
