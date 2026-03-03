// ============================
// API 客户端
// 用于调用自定义后端接口（Cloudflare Functions）
// ============================

import { supabase } from '@/config/supabase';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 10000, headers = {}, ...rest } = options;

  // 获取当前会话的 access token
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`/api${endpoint}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || `请求失败: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('请求超时，请重试');
    }
    throw error;
  }
}

export default apiClient;
