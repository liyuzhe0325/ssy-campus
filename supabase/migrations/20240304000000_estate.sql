-- 用户资产表
CREATE TABLE IF NOT EXISTS user_assets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  coins INT DEFAULT 0,
  total_coins_earned INT DEFAULT 0,
  level INT DEFAULT 1,
  exp INT DEFAULT 0,
  last_daily_claim DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 传承币交易流水
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  type TEXT NOT NULL, -- 'earn', 'spend'
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户庄园信息
CREATE TABLE IF NOT EXISTS user_estate (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  estate_theme TEXT DEFAULT 'pixel',
  hue_override INT,
  saturation_override FLOAT,
  lightness_override FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户拥有的家具
CREATE TABLE IF NOT EXISTS user_furniture (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  furniture_id TEXT NOT NULL,
  acquired_at TIMESTAMPTZ DEFAULT NOW()
);

-- 已摆放的家具
CREATE TABLE IF NOT EXISTS user_furniture_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  furniture_instance_id UUID REFERENCES user_furniture(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL,
  rotation INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 花园地块
CREATE TABLE IF NOT EXISTS garden_plots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_index INT NOT NULL,
  plant_id TEXT,
  stage INT DEFAULT 0,
  planted_at TIMESTAMPTZ,
  last_watered TIMESTAMPTZ,
  UNIQUE(user_id, plot_index)
);

-- 牧场动物
CREATE TABLE IF NOT EXISTS pasture_animals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_id TEXT NOT NULL,
  name TEXT,
  hunger INT DEFAULT 100,
  happiness INT DEFAULT 100,
  intimacy INT DEFAULT 0,
  last_fed TIMESTAMPTZ,
  last_played TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 宠物
CREATE TABLE IF NOT EXISTS user_pets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_type TEXT DEFAULT 'fox',
  pet_name TEXT DEFAULT '小芯',
  hunger INT DEFAULT 100,
  happiness INT DEFAULT 100,
  intimacy INT DEFAULT 0,
  evolution_level INT DEFAULT 1,
  last_fed TIMESTAMPTZ,
  last_played TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 宠物服饰
CREATE TABLE IF NOT EXISTS user_pet_clothes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clothes_id TEXT NOT NULL,
  equipped BOOLEAN DEFAULT FALSE,
  acquired_at TIMESTAMPTZ DEFAULT NOW()
);
