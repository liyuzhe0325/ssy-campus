// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// 从环境变量中读取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// 创建并导出 Supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
