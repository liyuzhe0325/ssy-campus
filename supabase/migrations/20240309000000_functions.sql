-- 增加文章浏览量的函数
CREATE OR REPLACE FUNCTION increment_article_view(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE articles SET view_count = view_count + 1 WHERE id = article_id;
END;
$$;

-- 增加问题浏览量的函数
CREATE OR REPLACE FUNCTION increment_question_view(question_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE questions SET view_count = view_count + 1 WHERE id = question_id;
END;
$$;

-- 采纳答案的函数（包含事务）
CREATE OR REPLACE FUNCTION accept_answer(
  p_question_id UUID,
  p_answer_id UUID,
  p_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_question_owner_id UUID;
BEGIN
  -- 检查当前用户是否是问题所有者
  SELECT user_id INTO v_question_owner_id FROM questions WHERE id = p_question_id;
  IF v_question_owner_id != p_user_id THEN
    RAISE EXCEPTION '只有提问者可以采纳答案';
  END IF;

  -- 检查问题是否已解决
  IF EXISTS (SELECT 1 FROM questions WHERE id = p_question_id AND is_solved = true) THEN
    RAISE EXCEPTION '问题已解决，不能重复采纳';
  END IF;

  -- 开始事务
  BEGIN
    -- 将该问题的所有答案的 is_accepted 设为 false
    UPDATE answers SET is_accepted = false WHERE question_id = p_question_id;

    -- 将指定的答案设为采纳
    UPDATE answers SET is_accepted = true WHERE id = p_answer_id AND question_id = p_question_id;

    -- 将问题标记为已解决
    UPDATE questions SET is_solved = true WHERE id = p_question_id;

    -- 可选：给被采纳者奖励传承币（需要额外逻辑）
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$;
