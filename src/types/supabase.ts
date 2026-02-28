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
      // ========== 阶段二新增表 ==========
      tags: {
        Row: {
          id: string
          name: string
          color: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          usage_count?: number
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          summary: string | null
          author_id: string
          category: string
          tags: string[]
          cover_image: string | null
          status: string
          view_count: number
          like_count: number
          comment_count: number
          related_university_id: string | null
          related_major_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          summary?: string | null
          author_id: string
          category?: string
          tags?: string[]
          cover_image?: string | null
          status?: string
          view_count?: number
          like_count?: number
          comment_count?: number
          related_university_id?: string | null
          related_major_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          summary?: string | null
          author_id?: string
          category?: string
          tags?: string[]
          cover_image?: string | null
          status?: string
          view_count?: number
          like_count?: number
          comment_count?: number
          related_university_id?: string | null
          related_major_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          tags: string[]
          status: string
          view_count: number
          like_count: number
          answer_count: number
          accepted_answer_id: string | null
          related_university_id: string | null
          related_major_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          tags?: string[]
          status?: string
          view_count?: number
          like_count?: number
          answer_count?: number
          accepted_answer_id?: string | null
          related_university_id?: string | null
          related_major_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          tags?: string[]
          status?: string
          view_count?: number
          like_count?: number
          answer_count?: number
          accepted_answer_id?: string | null
          related_university_id?: string | null
          related_major_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          content: string
          author_id: string
          is_accepted: boolean
          like_count: number
          dislike_count: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          content: string
          author_id: string
          is_accepted?: boolean
          like_count?: number
          dislike_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          content?: string
          author_id?: string
          is_accepted?: boolean
          like_count?: number
          dislike_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          author_id: string
          target_type: string
          target_id: string
          like_count: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          author_id: string
          target_type: string
          target_id: string
          like_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          author_id?: string
          target_type?: string
          target_id?: string
          like_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      dynamics: {
        Row: {
          id: string
          content: string
          images: string[]
          author_id: string
          tags: string[]
          like_count: number
          comment_count: number
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          images?: string[]
          author_id: string
          tags?: string[]
          like_count?: number
          comment_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          images?: string[]
          author_id?: string
          tags?: string[]
          like_count?: number
          comment_count?: number
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          tags: string[]
          is_pinned: boolean
          is_locked: boolean
          like_count: number
          reply_count: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          tags?: string[]
          is_pinned?: boolean
          is_locked?: boolean
          like_count?: number
          reply_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          tags?: string[]
          is_pinned?: boolean
          is_locked?: boolean
          like_count?: number
          reply_count?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      replies: {
        Row: {
          id: string
          post_id: string
          content: string
          author_id: string
          like_count: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          content: string
          author_id: string
          like_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          content?: string
          author_id?: string
          like_count?: number
          created_at?: string
        }
      }
      treehole_posts: {
        Row: {
          id: string
          content: string
          tags: string[]
          anonymous_token: string
          hug_count: number
          reply_count: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          tags?: string[]
          anonymous_token: string
          hug_count?: number
          reply_count?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          tags?: string[]
          anonymous_token?: string
          hug_count?: number
          reply_count?: number
          status?: string
          created_at?: string
        }
      }
      treehole_replies: {
        Row: {
          id: string
          post_id: string
          content: string
          is_anonymous: boolean
          author_id: string | null
          hug_count: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          content: string
          is_anonymous?: boolean
          author_id?: string | null
          hug_count?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          content?: string
          is_anonymous?: boolean
          author_id?: string | null
          hug_count?: number
          status?: string
          created_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string
          cover: string | null
          category: string
          author_id: string
          is_pinned: boolean
          publish_time: string
          view_count: number
          like_count: number
          comment_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary?: string | null
          content: string
          cover?: string | null
          category: string
          author_id: string
          is_pinned?: boolean
          publish_time?: string
          view_count?: number
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          content?: string
          cover?: string | null
          category?: string
          author_id?: string
          is_pinned?: boolean
          publish_time?: string
          view_count?: number
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          target_type: string
          target_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: string
          target_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_type?: string
          target_id?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          target_type: string
          target_id: string
          reporter_id: string
          reason: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          target_type: string
          target_id: string
          reporter_id: string
          reason: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          target_type?: string
          target_id?: string
          reporter_id?: string
          reason?: string
          status?: string
          created_at?: string
        }
      }
      universities: {
        Row: {
          id: string
          name: string
          ranking: number | null
          location: string | null
          type: string | null
          level: string | null
          description: string | null
          logo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          ranking?: number | null
          location?: string | null
          type?: string | null
          level?: string | null
          description?: string | null
          logo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          ranking?: number | null
          location?: string | null
          type?: string | null
          level?: string | null
          description?: string | null
          logo?: string | null
          created_at?: string
        }
      }
      majors: {
        Row: {
          id: string
          name: string
          code: string | null
          category_id: string | null
          university_id: string | null
          description: string | null
          core_courses: string[] | null
          career_directions: string[] | null
          rating_overall: number | null
          review_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code?: string | null
          category_id?: string | null
          university_id?: string | null
          description?: string | null
          core_courses?: string[] | null
          career_directions?: string[] | null
          rating_overall?: number | null
          review_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string | null
          category_id?: string | null
          university_id?: string | null
          description?: string | null
          core_courses?: string[] | null
          career_directions?: string[] | null
          rating_overall?: number | null
          review_count?: number
          created_at?: string
        }
      }
      admission_scores: {
        Row: {
          id: string
          university_id: string | null
          major_id: string | null
          year: number | null
          category: string | null
          batch: string | null
          min_score: number | null
          min_rank: number | null
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          university_id?: string | null
          major_id?: string | null
          year?: number | null
          category?: string | null
          batch?: string | null
          min_score?: number | null
          min_rank?: number | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          university_id?: string | null
          major_id?: string | null
          year?: number | null
          category?: string | null
          batch?: string | null
          min_score?: number | null
          min_rank?: number | null
          source?: string | null
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
