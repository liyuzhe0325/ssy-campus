-- 管理员角色表
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 管理员用户关联表
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role_id UUID REFERENCES admin_roles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 敏感词表
CREATE TABLE IF NOT EXISTS sensitive_words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT UNIQUE NOT NULL,
  level INT DEFAULT 1, -- 1=普通, 2=高危
  created_at TIMESTAMPTZ DEFAULT NOW()
);
