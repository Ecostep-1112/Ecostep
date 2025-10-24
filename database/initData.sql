-- Ecostep 초기 데이터 & 개발용 RLS 설정
-- 작성일: 2025-01-11
-- 목적: 데이터 삽입 + 개발 환경을 위한 공개 접근 정책

-- ================================
-- STEP 1: RLS 정책 설정 (개발용)
-- ================================
-- 개발 단계에서는 localStorage 기반 userId를 사용하므로
-- auth.uid()가 없어도 데이터 접근이 가능하도록 공개 정책 설정

-- user_info: 모든 사용자가 읽기/쓰기 가능 (개발용)
DROP POLICY IF EXISTS "Users can view their own user_info" ON user_info;
DROP POLICY IF EXISTS "Users can update their own user_info" ON user_info;
DROP POLICY IF EXISTS "System can insert user_info" ON user_info;
DROP POLICY IF EXISTS "Public access for development" ON user_info;

CREATE POLICY "Public access for development" ON user_info
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- daily_chal_data: 공개 접근 허용 (개발용)
DROP POLICY IF EXISTS "Users can manage their own challenges" ON daily_chal_data;
DROP POLICY IF EXISTS "Public access for development" ON daily_chal_data;

CREATE POLICY "Public access for development" ON daily_chal_data
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- zero_chal_data: 공개 접근 허용 (개발용)
DROP POLICY IF EXISTS "Users can manage their own plastic data" ON zero_chal_data;
DROP POLICY IF EXISTS "Public access for development" ON zero_chal_data;

CREATE POLICY "Public access for development" ON zero_chal_data
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- user_friend: 공개 접근 허용 (개발용)
DROP POLICY IF EXISTS "Users can manage their own friendships" ON user_friend;
DROP POLICY IF EXISTS "Public access for development" ON user_friend;

CREATE POLICY "Public access for development" ON user_friend
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- user_item: 공개 접근 허용 (개발용)
DROP POLICY IF EXISTS "Users can manage their own items" ON user_item;
DROP POLICY IF EXISTS "Public access for development" ON user_item;

CREATE POLICY "Public access for development" ON user_item
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- store: 공개 읽기 허용
DROP POLICY IF EXISTS "Public read access" ON store;

CREATE POLICY "Public read access" ON store
    FOR SELECT
    USING (true);

-- places: 공개 읽기 허용
DROP POLICY IF EXISTS "Public read access" ON places;

CREATE POLICY "Public read access" ON places
    FOR SELECT
    USING (true);

-- ================================
-- STEP 2: 상점 초기 데이터 삽입
-- ================================
-- DELETE FROM store;
-- ================================
-- 상점: 물고기 (Fish)
-- ================================

-- 브론즈 물고기
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('fish_01', '코리도라스', 'Fish', 200, 'Bronze'),
('fish_02', '체리바브', 'Fish', 300, 'Bronze'),
('fish_03', '네온테트라', 'Fish', 400, 'Bronze');

-- 실버 물고기
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('fish_04', '아피스토그라마', 'Fish', 600, 'Silver'),
('fish_05', '람시클리드', 'Fish', 700, 'Silver'),
('fish_06', '구피', 'Fish', 800, 'Silver');

-- 골드 물고기
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('fish_07', '엔젤피쉬', 'Fish', 1200, 'Gold'),
('fish_08', '킬리피쉬', 'Fish', 1300, 'Gold'),
('fish_09', '베타', 'Fish', 1400, 'Gold');

-- 플래티넘 물고기
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('fish_10', '디스커스', 'Fish', 2000, 'Platinum'),
('fish_11', '만다린피쉬', 'Fish', 2200, 'Platinum'),
('fish_12', '아로와나', 'Fish', 2500, 'Platinum');

-- ================================
-- 상점: 장식품 (Decoration)
-- ================================

-- 브론즈 장식품
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('decoration_01', '해초', 'Decoration', 150, 'Bronze'),
('decoration_02', '용암석', 'Decoration', 250, 'Bronze'),
('decoration_03', '작은 동굴', 'Decoration', 350, 'Bronze');

-- 실버 장식품
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('decoration_04', '산호', 'Decoration', 500, 'Silver'),
('decoration_05', '드리프트 우드', 'Decoration', 600, 'Silver'),
('decoration_06', '조개 껍질', 'Decoration', 700, 'Silver');

-- 골드 장식품
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('decoration_07', '그리스 신전', 'Decoration', 1000, 'Gold'),
('decoration_08', '보물 상자', 'Decoration', 1100, 'Gold'),
('decoration_09', '해적선', 'Decoration', 1200, 'Gold');

-- 플래티넘 장식품
INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('decoration_10', '크리스탈 동굴', 'Decoration', 1600, 'Platinum'),
('decoration_11', 'LED 해파리', 'Decoration', 1800, 'Platinum'),
('decoration_12', '아틀란티스 유적', 'Decoration', 2000, 'Platinum');

-- ================================
-- 상점: 배경/어항 (Background)
-- ================================

INSERT INTO store (item_id, item_name, category, price, rank) VALUES
('background_01', '브론즈 어항', 'Background', 0, 'Bronze'),
('background_02', '실버 어항', 'Background', 0, 'Silver'),
('background_03', '골드 어항', 'Background', 0, 'Gold'),
('background_04', '플래티넘 어항', 'Background', 0, 'Platinum');

-- ================================
-- 제로웨이스트 맵 장소 (places)
-- ================================
-- DELETE FROM places;

-- 서울역/용산 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5547, 126.9707, '알맹상점 서울역점', '리필샵', '세제, 화장품 리필 전문 매장'),
(37.5326, 126.9909, '더피커 이태원', '제로웨이스트샵', '친환경 생활용품 편집숍');
-- 홍대/연남동 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5563, 126.9220, '지구샵 홍대점', '비건 카페', '플라스틱 프리 카페'),
(37.5665, 126.9251, '보틀팩토리 연남점', '제로웨이스트샵', '텀블러 및 친환경 용기 전문'),
(37.5689, 126.9212, '알맹상점 망원점', '리필샵', '포장 없는 가게');
-- 강남 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5040, 127.0492, '지구샵 강남점', '제로웨이스트샵', '친환경 생활용품 매장'),
(37.4979, 127.0276, '리필리 강남', '리필샵', '화장품 리필 전문점'),
(37.5175, 127.0476, '보틀팩토리 강남점', '친환경 매장', '재사용 용기 판매');
-- 성수/건대 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5447, 127.0557, '더피커 성수', '제로웨이스트샵', '친환경 라이프스타일 편집숍'),
(37.5401, 127.0695, '리필스테이션 건대', '리필샵', '세제 및 생활용품 리필');
-- 송파/잠실 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5145, 127.1065, '송파 나눔장터', '재활용/업사이클', '재활용품 거래 및 교환'),
(37.5133, 127.1028, '제로그램 송파점', '무포장 가게', '무포장 식료품점');
-- 마포/신촌 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5585, 126.9388, '지구샵 신촌점', '제로웨이스트샵', '친환경 용품 전문'),
(37.5663, 126.9390, '알맹상점 신촌점', '리필샵', '리필 스테이션');
-- 성북/노원 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.6027, 126.9288, '동네정미소', '무포장 가게', '곡물 및 견과류 리필매장'),
(37.6545, 127.0617, '노원 새활용센터', '재활용/업사이클', '업사이클링 교육 및 판매');
-- 서대문/은평 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5773, 126.9681, '허그어웨일', '업사이클 매장', '업사이클링 제품 판매'),
(37.6102, 126.9227, '은평 제로웨이스트샵', '친환경 매장', '친환경 생활용품');
-- 용산/한남 지역
INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5340, 126.9948, '얼스어스 한남점', '비건 카페', '비건 제로웨이스트 카페'),
(37.5444, 126.9881, '리필리 이태원점', '리필샵', '화장품 및 세제 리필');

-- ================================
-- 데이터 확인 쿼리
-- ================================

-- 카테고리별 아이템 수 확인
SELECT
  category,
  rank,
  COUNT(*) as count
FROM store
GROUP BY category, rank
ORDER BY
  CASE category
    WHEN 'Fish' THEN 1
    WHEN 'Decoration' THEN 2
    WHEN 'Background' THEN 3
  END,
  CASE rank
    WHEN 'Bronze' THEN 1
    WHEN 'Silver' THEN 2
    WHEN 'Gold' THEN 3
    WHEN 'Platinum' THEN 4
  END;

-- 전체 요약
SELECT
  '✅ 물고기 (Fish): ' || COUNT(*) || '개' as result
FROM store WHERE category = 'Fish'
UNION ALL
SELECT
  '✅ 장식품 (Decoration): ' || COUNT(*) || '개' as result
FROM store WHERE category = 'Decoration'
UNION ALL
SELECT
  '✅ 배경 (Background): ' || COUNT(*) || '개' as result
FROM store WHERE category = 'Background'
UNION ALL
SELECT
  '✅ 총 상점 아이템: ' || COUNT(*) || '개' as result
FROM store;

SELECT '✅ 제로웨이스트 장소: ' || COUNT(*) || '개 삽입 완료' AS result FROM places;

-- ================================
-- STEP 3: 설정 확인
-- ================================

-- RLS 정책 확인
SELECT
    '✅ RLS 정책 설정 완료' AS status,
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('user_info', 'daily_chal_data', 'zero_chal_data', 'user_item', 'user_friend', 'store', 'places')
ORDER BY tablename, policyname;

-- ================================
-- 중요: 프로덕션 배포 시
-- ================================
-- 프로덕션 환경에 배포하기 전에는 반드시
-- database/setup_supabase_auth.sql을 실행하여
-- auth.uid() 기반의 보안 정책으로 변경해야 합니다.
