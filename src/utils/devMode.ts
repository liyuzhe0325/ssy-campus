// ============================
// 开发者模式工具
// 判断是否开启，提供全局开关
// ============================

const DEV_MODE_KEY = 'dev_mode_enabled';

export function isDevModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  // 优先检查 URL 参数
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('dev') === 'true') {
    localStorage.setItem(DEV_MODE_KEY, 'true');
    return true;
  }
  if (urlParams.get('dev') === 'false') {
    localStorage.removeItem(DEV_MODE_KEY);
    return false;
  }
  // 然后检查 localStorage
  return localStorage.getItem(DEV_MODE_KEY) === 'true';
}

export function enableDevMode(enable: boolean) {
  if (enable) {
    localStorage.setItem(DEV_MODE_KEY, 'true');
  } else {
    localStorage.removeItem(DEV_MODE_KEY);
  }
  // 刷新页面以应用
  window.location.reload();
}

// 快捷键 Ctrl+Shift+D 切换
export function registerDevModeShortcut() {
  if (typeof window === 'undefined') return;
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      const current = isDevModeEnabled();
      enableDevMode(!current);
    }
  });
}
