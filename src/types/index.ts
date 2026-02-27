// ==================== 用户相关 ====================
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

export interface SessionUser extends Profile {
  email?: string
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

// ==================== 内容通用 ====================
export type ContentStatus = 'draft' | 'pending' | 'approved' | 'rejected'

// ==================== 标签 ====================
export interface Tag {
  id: string
  name: string
  color: string
  usage_count: number
  created_at: string
}

// ==================== 文章 ====================
export interface Article {
  id: string
  title: string
  content: string
  summary?: string
  author_id: string
  author?: Profile
  category: '学习' | '心态' | '社团' | '选科' | '志愿' | '大学' | '其他'
  tags: string[]
  cover_image?: string
  status: ContentStatus
  view_count: number
  like_count: number
  comment_count: number
  related_university_id?: string
  related_major_id?: string
  created_at: string
  updated_at: string
}

// ==================== 问答 ====================
export interface Question {
  id: string
  title: string
  content: string
  author_id: string
  author?: Profile
  tags: string[]
  status: ContentStatus
  view_count: number
  like_count: number
  answer_count: number
  accepted_answer_id?: string
  related_university_id?: string
  related_major_id?: string
  created_at: string
  updated_at: string
}

export interface Answer {
  id: string
  question_id: string
  content: string
  author_id: string
  author?: Profile
  is_accepted: boolean
  like_count: number
  dislike_count: number
  status: ContentStatus
  created_at: string
  updated_at: string
}

// ==================== 通用评论 ====================
export type CommentTargetType = 'article' | 'question' | 'answer' | 'dynamic' | 'post' | 'treehole_post' | 'news'

export interface Comment {
  id: string
  content: string
  author_id: string
  author?: Profile
  target_type: CommentTargetType
  target_id: string
  like_count: number
  status: ContentStatus
  created_at: string
  updated_at: string
}

// ==================== 即时动态 ====================
export interface Dynamic {
  id: string
  content: string
  images: string[]
  author_id: string
  author?: Profile
  tags: string[]
  like_count: number
  comment_count: number
  created_at: string
}

// ==================== 贴吧 ====================
export interface Post {
  id: string
  title: string
  content: string
  author_id: string
  author?: Profile
  tags: string[]
  is_pinned: boolean
  is_locked: boolean
  like_count: number
  reply_count: number
  status: ContentStatus
  created_at: string
  updated_at: string
}

export interface Reply {
  id: string
  post_id: string
  content: string
  author_id: string
  author?: Profile
  like_count: number
  created_at: string
}

// ==================== 树洞 ====================
export interface TreeholePost {
  id: string
  content: string
  tags: string[]
  anonymous_token: string
  hug_count: number
  reply_count: number
  status: ContentStatus
  created_at: string
}

export interface TreeholeReply {
  id: string
  post_id: string
  content: string
  is_anonymous: boolean
  author_id?: string
  author?: Profile
  hug_count: number
  status: ContentStatus
  created_at: string
}

// ==================== 新闻 ====================
export interface News {
  id: string
  title: string
  summary?: string
  content: string
  cover?: string
  category: '通知公告' | '校园活动' | '荣誉表彰' | '校友动态'
  author_id: string
  author?: Profile
  is_pinned: boolean
  publish_time: string
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
}

// ==================== 点赞 ====================
export type LikeTargetType = CommentTargetType | 'answer' | 'reply' | 'treehole_reply'

export interface Like {
  id: string
  user_id: string
  target_type: LikeTargetType
  target_id: string
  created_at: string
}

// ==================== 举报 ====================
export type ReportTargetType = LikeTargetType | 'comment'

export interface Report {
  id: string
  target_type: ReportTargetType
  target_id: string
  reporter_id: string
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
}
