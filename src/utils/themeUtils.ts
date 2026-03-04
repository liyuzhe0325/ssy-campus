import { Theme } from '@/themes/types';

/**
 * 将十六进制颜色转换为HSL对象
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // 移除 # 号
  hex = hex.replace(/^#/, '');
  
  // 解析RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * 将HSL转换为CSS颜色字符串
 */
export function hslToString(hsl: { h: number; s: number; l: number }): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * 应用主题变量到根元素
 */
export function applyThemeVariables(
  theme: Theme,
  hueShift: number = 0,
  saturationScale: number = 1,
  lightnessScale: number = 1
) {
  const root = document.documentElement;
  
  // 应用颜色
  Object.entries(theme.colors).forEach(([key, value]) => {
    const hsl = hexToHsl(value);
    const adjustedHsl = {
      h: (hsl.h + hueShift) % 360,
      s: Math.min(100, Math.max(0, hsl.s * saturationScale)),
      l: Math.min(100, Math.max(0, hsl.l * lightnessScale)),
    };
    root.style.setProperty(`--color-${key}`, hslToString(adjustedHsl));
  });
  
  // 应用字体
  root.style.setProperty('--font-body', theme.fonts.body);
  root.style.setProperty('--font-heading', theme.fonts.heading);
  
  // 应用圆角
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
  
  // 应用阴影
  if (theme.boxShadow) {
    root.style.setProperty('--box-shadow-card', theme.boxShadow);
  }
  
  // 呼吸强度
  if (theme.breathingIntensity !== undefined) {
    root.style.setProperty('--breathing-intensity', theme.breathingIntensity.toString());
  }
  
  // 背景图
  if (theme.backgroundImage) {
    root.style.setProperty('--bg-image', `url(${theme.backgroundImage})`);
  }
  
  // 自定义变量
  if (theme.customVars) {
    Object.entries(theme.customVars).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }
}
