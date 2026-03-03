-- 自动更新 updated_at 的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要 updated_at 的表添加触发器
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_majors_updated_at BEFORE UPDATE ON majors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fundraising_projects_updated_at BEFORE UPDATE ON fundraising_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- 可根据需要添加更多

-- 资源评分更新触发器
CREATE OR REPLACE FUNCTION update_resource_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE resources SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM resource_ratings WHERE resource_id = NEW.resource_id),
    rating_count = (SELECT COUNT(*) FROM resource_ratings WHERE resource_id = NEW.resource_id)
  WHERE id = NEW.resource_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_resource_rating
AFTER INSERT OR UPDATE OR DELETE ON resource_ratings
FOR EACH ROW EXECUTE FUNCTION update_resource_rating();

-- 索引（部分示例，实际可根据需要添加）
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created_at ON coin_transactions(created_at);
