import { Theme } from './types';

export const pixelTheme: Theme = {
  id: 'pixel',
  name: '像素庄园',
  description: '复古像素风格，带你回到8位时代',
  colors: {
    primary: '#6B4F3C',      // 土褐色
    secondary: '#A57C5C',    // 浅棕色
    background: '#1A1E2C',   // 深蓝黑背景
    card: '#2D2F3B',         // 深灰卡片
    text: '#F0E6D2',         // 米白文字
    'text-secondary': '#A9B7C6', // 灰蓝辅助
    border: '#4A4E5C',       // 中灰边框
    success: '#6AAA64',
    warning: '#F9C74F',
    error: '#F9844A',
  },
  fonts: {
    body: '"Press Start 2P", "Courier New", monospace',
    heading: '"Press Start 2P", "Courier New", monospace',
  },
  borderRadius: {
    card: '0px',            // 直角
    button: '0px',
    input: '0px',
  },
  boxShadow: '4px 4px 0px 0px #000000', // 硬阴影
  backgroundImage: '/images/pixel-bg.png',
  iconSet: 'pixel',
  breathingIntensity: 0.1,
};
