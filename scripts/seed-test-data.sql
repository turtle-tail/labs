-- Seed data for "2025 나의 키워드 3개 찾기" test
-- Based on Figma design

-- Insert test
INSERT INTO tests (
  id,
  title,
  slug,
  description,
  question_count,
  estimated_time,
  is_published,
  share_text
) VALUES (
  gen_random_uuid(),
  '2025 나의 키워드 3개 찾기',
  '2025-keyword-check',
  E'2025년의 나는 어떤 모습이었을까?\n올해의 당신을 가장 잘 설명하는 선택지를 골라보세요.',
  10,
  2,
  true,
  '나의 2025 키워드를 확인해보세요!'
);

-- Get test ID for foreign keys
DO $$
DECLARE
  test_id uuid;

  -- Question IDs
  q1_id uuid;
  q2_id uuid;
  q3_id uuid;

  -- Result IDs
  result_multi_id uuid;
  result_focused_id uuid;
  result_explorer_id uuid;
  result_healing_id uuid;
BEGIN
  -- Get test ID
  SELECT id INTO test_id FROM tests WHERE slug = '2025-keyword-check';

  -- Create result IDs
  result_multi_id := gen_random_uuid();
  result_focused_id := gen_random_uuid();
  result_explorer_id := gen_random_uuid();
  result_healing_id := gen_random_uuid();

  -- Insert results
  INSERT INTO results (id, test_id, title, keywords, description, share_description) VALUES
  (result_multi_id, test_id, '나만의 페이스로 산 한 해 🎭',
   ARRAY['집중', '성장', '안정'],
   '2025년, 당신은 여러 가지를 다 경험했어요. 기쁨도, 슬픔도, 혼란도, 성장도 다 있었죠. 어떤 하나로 정의되지 않는 게 오히려 당신다운 거 아닐까요? 멀티 플레이어 인정합니다 ✌️',
   '나는 멀티 플레이어! 나만의 페이스로 산 한 해였어요 🎭'),
  (result_focused_id, test_id, '목표 달성형 🎯',
   ARRAY['집중', '계획', '성취'],
   '올해 당신은 한 가지에 집중하고 목표를 향해 달려왔어요. 계획적이고 침착한 당신의 모습이 돋보였던 한 해였습니다.',
   '나는 목표 달성형! 계획적이고 집중력 있는 한 해를 보냈어요 🎯'),
  (result_explorer_id, test_id, '도전과 탐험가 🌟',
   ARRAY['도전', '변화', '성장'],
   '새로운 것을 시도하고 변화를 두려워하지 않았던 당신. 올해는 모험과 도전으로 가득한 한 해였어요!',
   '나는 도전과 탐험가! 새로운 것을 향해 달려간 한 해였어요 🌟'),
  (result_healing_id, test_id, '회복과 치유의 시간 🌸',
   ARRAY['회복', '안정', '자기돌봄'],
   '올해 당신은 자신을 돌보고 회복하는 시간을 가졌어요. 천천히, 그리고 건강하게 나아가는 모습이 아름다웠습니다.',
   '나는 회복과 치유의 시간! 나를 돌보는 한 해를 보냈어요 🌸');

  -- Insert questions
  -- Q1
  q1_id := gen_random_uuid();
  INSERT INTO questions (id, test_id, text, type, order_index) VALUES
  (q1_id, test_id, '올해의 나는 ___ 시간에 가장 집중했다.', 'single', 1);

  INSERT INTO question_options (question_id, text, points, order_index) VALUES
  (q1_id, '일이나 목표', jsonb_build_object(result_focused_id::text, 2, result_multi_id::text, 1), 1),
  (q1_id, '관계나 사람', jsonb_build_object(result_explorer_id::text, 2, result_multi_id::text, 1), 2),
  (q1_id, '나 자신', jsonb_build_object(result_healing_id::text, 2, result_multi_id::text, 1), 3),
  (q1_id, '변화와 새로운 시도', jsonb_build_object(result_explorer_id::text, 2, result_multi_id::text, 1), 4);

  -- Q2
  q2_id := gen_random_uuid();
  INSERT INTO questions (id, test_id, text, type, order_index) VALUES
  (q2_id, test_id, '예상치 못한 상황이 왔을 때 나는 ___ 했다.', 'single', 2);

  INSERT INTO question_options (question_id, text, points, order_index) VALUES
  (q2_id, '침착하게 대처했다', jsonb_build_object(result_focused_id::text, 2), 1),
  (q2_id, '계획을 새로 짰다', jsonb_build_object(result_focused_id::text, 1, result_explorer_id::text, 1), 2),
  (q2_id, '조금 흔들렸지만 결국 적응했다', jsonb_build_object(result_multi_id::text, 2), 3),
  (q2_id, '그냥 부딪혀봤다', jsonb_build_object(result_explorer_id::text, 2), 4);

  -- Q3
  q3_id := gen_random_uuid();
  INSERT INTO questions (id, test_id, text, type, order_index) VALUES
  (q3_id, test_id, '올해 가장 많이 떠올린 단어는?', 'single', 3);

  INSERT INTO question_options (question_id, text, points, order_index) VALUES
  (q3_id, '안정', jsonb_build_object(result_focused_id::text, 2), 1),
  (q3_id, '도전', jsonb_build_object(result_explorer_id::text, 2), 2),
  (q3_id, '성장', jsonb_build_object(result_multi_id::text, 2), 3),
  (q3_id, '회복', jsonb_build_object(result_healing_id::text, 2), 4);

  -- Add remaining 7 questions (simplified for now)
  FOR i IN 4..10 LOOP
    DECLARE
      q_id uuid := gen_random_uuid();
    BEGIN
      INSERT INTO questions (id, test_id, text, type, order_index) VALUES
      (q_id, test_id, format('질문 %s', i), 'single', i);

      -- Add 4 options per question
      INSERT INTO question_options (question_id, text, points, order_index) VALUES
      (q_id, format('옵션 A %s', i), jsonb_build_object(result_focused_id::text, 2), 1),
      (q_id, format('옵션 B %s', i), jsonb_build_object(result_explorer_id::text, 2), 2),
      (q_id, format('옵션 C %s', i), jsonb_build_object(result_multi_id::text, 2), 3),
      (q_id, format('옵션 D %s', i), jsonb_build_object(result_healing_id::text, 2), 4);
    END;
  END LOOP;

END $$;
