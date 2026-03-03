// ============================
// 全局错误边界组件
// 捕获子组件错误，显示备用 UI
// 暂时移除 Sentry 依赖，待安装后再启用
// ============================

import React from 'react';
// import * as Sentry from '@sentry/react'; // 临时注释
import Button from './Button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 暂时不上报 Sentry
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="bg-card rounded-card border border-border p-8 max-w-md text-center">
            <h1 className="text-2xl font-heading text-text mb-4">出错了</h1>
            <p className="text-text-secondary mb-6">
              页面发生了一个错误。我们已经收到报告，正在努力修复。
            </p>
            <Button onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
