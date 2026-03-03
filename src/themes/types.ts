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
    secondary: string;
    background: string;
    card: string;
    text: string;
    'text-secondary': string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    body: string;            // 正文字体族
    heading: string;         // 标题字体族
  };
  borderRadius: {
    card: string;
    button: string;
    input: string;
  };
  boxShadow?: string;
  backgroundImage?: string;
  iconSet?: string;           // 图标集标识，如 'heroicons', 'pixel'
  breathingIntensity?: number; // 呼吸效果强度 0-1
  customVars?: Record<string, string>; // 其他自定义CSS变量
}
