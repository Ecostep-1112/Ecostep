-- Zero Challenge Item 초기 데이터
-- 작성일: 2025-01-11
-- 플라스틱 아이템 기본 데이터 삽입

-- 기존 데이터 삭제 (재실행 가능하도록)
DELETE FROM zero_chal_item;

-- 음료 관련
INSERT INTO zero_chal_item (item_id, item_name, tag, plastic_amount) VALUES
('plastic_bottle_500ml', '플라스틱병', 'drink', 25),
('disposable_cup', '일회용 컵', 'drink', 10),
('plastic_bottle_1500ml', '페트병(대)', 'drink', 45),
('straw', '빨대', 'drink', 1);

-- 봉투류
INSERT INTO zero_chal_item (item_id, item_name, tag, plastic_amount) VALUES
('plastic_bag_small', '비닐봉지(소)', 'bag', 3),
('plastic_bag_large', '비닐봉지(대)', 'bag', 7);

-- 배달/음식 관련
INSERT INTO zero_chal_item (item_id, item_name, tag, plastic_amount) VALUES
('food_container', '음식용기', 'food', 35),
('disposable_cutlery', '일회용 수저/포크', 'food', 3),
('disposable_plate', '일회용 접시', 'food', 8);

-- 기타 생활용품
INSERT INTO zero_chal_item (item_id, item_name, tag, plastic_amount) VALUES
('cosmetic_container', '화장품 용기', 'etc', 15);

-- 데이터 확인
SELECT
    '✅ 총 ' || COUNT(*) || '개 플라스틱 아이템 삽입 완료' AS result
FROM zero_chal_item;

-- 카테고리별 확인
SELECT
    tag AS category,
    COUNT(*) AS count,
    SUM(plastic_amount) AS total_weight
FROM zero_chal_item
GROUP BY tag
ORDER BY tag;
