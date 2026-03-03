import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const fetchWithRetry = async (url: RequestInfo, options: RequestInit = {}, retries = 3) => {
  let lastError: Error | null = null
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }
      return response
    } catch (error) {
      lastError = error as Error
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }
  throw lastError
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetchWithRetry,
  },
})

export async function handleSupabaseRequest<T>(
  request: Promise<{ data: T | null; error: any }>
): Promise<T | null> {
  const { data, error } = await request
  if (error) {
    // PGRST116 是 PostgreSQL 的 406 错误（无数据）
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Supabase request failed:', error)
    throw new Error(error.message || '数据库请求失败')
  }
  return data
}
