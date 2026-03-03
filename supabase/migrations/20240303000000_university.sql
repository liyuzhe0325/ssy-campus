-- 大学表
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT,
  logo_url TEXT,
  description TEXT,
  province TEXT,
  city TEXT,
  type TEXT[],
  level TEXT[],
  rank_nation INT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 专业表
CREATE TABLE IF NOT EXISTS majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  discipline TEXT,
  description TEXT,
  core_courses TEXT[],
  career_directions TEXT[],
  required_subjects TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMETAMPTZ DEFAULT NOW()
);

-- 大学-专业关联表
CREATE TABLE IF NOT EXISTS university_majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  major_id UUID REFERENCES majors(id) ON DELETE CASCADE,
  degree TEXT,
  duration INT,
  description TEXT,
  admission_scores JSONB,
  rank_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(university_id, major_id)
);

-- 学长认证表
CREATE TABLE IF NOT EXISTS alumni_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  major_id UUID REFERENCES majors(id) ON DELETE CASCADE,
  enrollment_year INT,
  graduation_year INT,
  student_id_photo TEXT, -- 加密存储路径
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户-专业匹配预计算结果表
CREATE TABLE IF NOT EXISTS user_major_match (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  major_id UUID REFERENCES majors(id) ON DELETE CASCADE,
  score DECIMAL(4,2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, major_id)
);
