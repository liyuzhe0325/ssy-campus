export type UserRole = 'user' | 'developer' | 'admin' | 'news_officer' | 'teacher'

export interface Profile {
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
  role: UserRole
  privacy_settings: {
    show_followers?: boolean
    show_following?: boolean
  }
  created_at: string
  updated_at: string
}

export interface Follow {
  follower_id: string
  following_id: string
  created_at: string
}

export interface Message {
  id: string
  from_id: string
  to_id: string
  content: string
  read: boolean
  created_at: string
}

export interface Conversation {
  otherUser: Profile
  lastMessage: Message
  unreadCount: number
}

export interface SessionUser extends Profile {
  email?: string
}
