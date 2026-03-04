// ============================
// 主题类型定义
// 每个主题必须包含以下字段
// ============================

export interface Theme {
  id: string;                // 唯一标识，如 'default', 'pixel'
  name: string;              // 显示名称
  description?: string;      // 描述
  colors: {
    primary: string;         // 主色（十六进制）
    secondary: string;       // 辅色
    background: string;      // 页面背景色
    card: string;            // 卡片背景色
    text: string;            // 主文字颜色
    'text-secondary': string; // 辅助文字颜色
    border: string;          // 边框颜色
    success: string;         // 成功状态色
    warning: string;         // 警告状态色
    error: string;           // 错误状态色
  };
  fonts: {
    body: string;            // 正文字体族
    heading: string;         // 标题字体族
  };
  borderRadius: {
    card: string;            // 卡片圆角（如 '1rem'）
    button: string;          // 按钮圆角
    input: string;           // 输入框圆角
  };
  boxShadow?: string;        // 卡片阴影
  backgroundImage?: string;  // 背景图URL（可选）
  iconSet?: string;          // 图标集标识，如 'heroicons', 'pixel'
  breathingIntensity?: number; // 呼吸效果强度 0-1
  customVars?: Record<string, string>; // 其他自定义CSS变量
}
