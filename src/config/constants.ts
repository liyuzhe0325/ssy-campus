// ============================
// 全局常量配置
// ============================

// 用户等级阈值
export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

// 传承币每日获取上限
export const DAILY_COIN_LIMIT = 200;

// 默认头像
export const DEFAULT_AVATAR = '/images/default-avatar.png';

// 支持的文件类型
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// 正则表达式
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 模块类型枚举
export const CONTENT_TYPES = ['article', 'question', 'post', 'dynamic', 'comment'] as const;

// 通知类型
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  REPLY: 'reply',
  FOLLOW: 'follow',
  SYSTEM: 'system',
  TASK: 'task',
} as const;

// 事件重要性
export const EVENT_IMPORTANCE = {
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
} as const;

// 树洞情绪标签
export const TREEHOLE_EMOTIONS = [
  '开心', '压力', '迷茫', '焦虑', '孤独', '恋爱', '友情', '家庭', '学习', '烦躁'
] as const;
