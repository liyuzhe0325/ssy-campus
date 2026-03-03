// ============================
// Supabase 客户端配置
// 包含重试机制和错误处理
// ============================

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // 自动生成类型

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 自定义 fetch 以实现重试
const fetchWithRetry = async (url: RequestInfo, options: RequestInit = {}, retries = 3) => {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // 指数退避
      }
    }
  }
  throw lastError;
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetchWithRetry,
  },
});

// 错误处理包装器
export async function handleSupabaseRequest<T>(
  request: Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await request;
  if (error) {
    console.error('Supabase request failed:', error);
    throw new Error(error.message || '数据库请求失败');
  }
  if (!data) {
    throw new Error('未找到数据');
  }
  return data;
}
