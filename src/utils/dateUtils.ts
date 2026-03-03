// ============================
// 日期工具函数
// 提供常用的日期格式化、相对时间等功能
// ============================

/**
 * 格式化日期为 yyyy-mm-dd
 * @param date - 日期对象或字符串
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期为 yyyy年mm月dd日
 * @param date - 日期对象或字符串
 */
export function formatChineseDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 格式化时间为 HH:MM
 * @param date - 日期对象或字符串
 */
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 格式化日期时间为 yyyy-mm-dd HH:MM
 * @param date - 日期对象或字符串
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * 计算相对时间（如“3分钟前”）
 * @param date - 日期对象或字符串
 */
export function formatDistanceToNow(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay < 30) {
    return `${diffDay}天前`;
  } else if (diffMonth < 12) {
    return `${diffMonth}个月前`;
  } else {
    return `${diffYear}年前`;
  }
}

/**
 * 判断是否为今天
 * @param date - 日期对象或字符串
 */
export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * 判断是否为昨天
 * @param date - 日期对象或字符串
 */
export function isYesterday(date: Date | string): boolean {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
}
