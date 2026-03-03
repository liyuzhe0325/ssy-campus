-- 扩展 profiles 表，增加主题、引导、旅行日志等字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_preferences JSONB DEFAULT '{
  "baseTemplate": "default",
  "hueShift": 0,
  "saturationScale": 1,
  "lightnessScale": 1,
  "animationSpeed": 1,
  "breathingIntensity": 0.5,
  "activeDecorations": []
}'::jsonb;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS guided_flags JSONB DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS travel_log JSONB DEFAULT '{
  "visitedLocations": [],
  "postcards": [],
  "encounters": []
}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS personalization JSONB DEFAULT '{}'::jsonb;
