// 这是一个简化版的类型定义，仅包含第一阶段必要的表
// 后续可使用 Supabase CLI 自动生成完整类型

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar: string | null
          grade: string | null
          bio: string | null
          graduate_university_id: string | null
          graduate_major_id: string | null
          graduate_year: number | null
          is_verified: boolean
          points: number
          level: number
          badges: string[]
          role: string
          privacy_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar?: string | null
          grade?: string | null
          bio?: string | null
          graduate_university_id?: string | null
          graduate_major_id?: string | null
          graduate_year?: number | null
          is_verified?: boolean
          points?: number
          level?: number
          badges?: string[]
          role?: string
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar?: string | null
          grade?: string | null
          bio?: string | null
          graduate_university_id?: string | null
          graduate_major_id?: string | null
          graduate_year?: number | null
          is_verified?: boolean
          points?: number
          level?: number
          badges?: string[]
          role?: string
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      follows: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          from_id: string
          to_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          from_id: string
          to_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          from_id?: string
          to_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
