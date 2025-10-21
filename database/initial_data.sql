-- Ecostep 초기 데이터 삽입
-- 상점 아이템, 제로웨이스트 장소 등

-- ================================
-- 상점: 물고기 (store_fish)
-- ================================

-- 브론즈 물고기
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('코리도라스', 'fish', 200, 'bronze'),
('체리바브', 'fish', 300, 'bronze'),
('네온테트라', 'fish', 400, 'bronze');

-- 실버 물고기
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('아피스토그라마', 'fish', 500, 'silver'),
('람시클리드', 'fish', 600, 'silver'),
('구피', 'fish', 700, 'silver');

-- 골드 물고기
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('엔젤피쉬', 'fish', 1000, 'gold'),
('킬리피쉬', 'fish', 1100, 'gold'),
('베타', 'fish', 1200, 'gold');

-- 플래티넘 물고기
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('디스커스', 'fish', 1500, 'platinum'),
('만다린피쉬', 'fish', 1600, 'platinum'),
('아로와나', 'fish', 1700, 'platinum');

-- ================================
-- 상점: 장식품 (store_decoration)
-- ================================

-- 브론즈 장식품
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('해초', 'decoration', 200, 'bronze'),
('용암석', 'decoration', 300, 'bronze'),
('작은 동굴', 'decoration', 400, 'bronze');

-- 실버 장식품
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('산호', 'decoration', 500, 'silver'),
('드리프트 우드', 'decoration', 600, 'silver'),
('조개 껍질', 'decoration', 700, 'silver');

-- 골드 장식품
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('그리스 신전', 'decoration', 900, 'gold'),
('보물 상자', 'decoration', 1000, 'gold'),
('해적선', 'decoration', 1100, 'gold');

-- 플래티넘 장식품
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('크리스탈 동굴', 'decoration', 1400, 'platinum'),
('LED 해파리', 'decoration', 1500, 'platinum'),
('아틀란티스 유적', 'decoration', 1600, 'platinum');

-- ================================
-- 상점: 배경/어항 (store_background)
-- ================================

INSERT INTO store_background (item_id, category, price, rank) VALUES
('브론즈 어항', 'background', 0, 'bronze'),
('실버 어항', 'background', 0, 'silver'),
('골드 어항', 'background', 0, 'gold'),
('플래티넘 어항', 'background', 0, 'platinum');

-- ================================
-- 제로웨이스트 맵 장소 (places)
-- ================================

INSERT INTO places (latitude, longitude, name, tag, description) VALUES
(37.5547, 126.9707, '알맹상점 서울역점', '리필샵', '리필 전문 매장'),
(37.5447, 127.0557, '더피커 성수', '친환경 매장', '친환경 편집숍'),
(37.5145, 127.1065, '송파 나눔장터', '재활용/업사이클', '재활용품 거래소'),
(37.5563, 126.9220, '지구샵 홍대점', '비건/친환경 카페', '플라스틱 프리 카페'),
(37.5665, 126.9251, '채움소 연남점', '리필샵', '세제 리필 스테이션'),
(37.5040, 127.0492, '덕분애 제로웨이스트샵', '친환경 매장', '친환경 생활용품'),
(37.5773, 126.9681, '허그어웨일', '재활용/업사이클', '업사이클링 매장'),
(37.4979, 127.0276, '보틀팩토리', '친환경 매장', '텀블러 전문점'),
(37.5585, 126.9388, '제로그램', '무포장 가게', '무포장 식료품점'),
(37.5663, 127.0090, '리필리', '리필샵', '화장품 리필샵'),
(37.6027, 126.9288, '동네정미소', '무포장 가게', '곡물 리필매장'),
(37.5340, 126.9948, '얼스어스', '비건/친환경 카페', '비건 제로웨이스트');

-- ================================
-- 완료 메시지
-- ================================

-- 삽입 완료 확인
SELECT '상점 물고기: ' || COUNT(*) || '개' FROM store_fish;
SELECT '상점 장식품: ' || COUNT(*) || '개' FROM store_decoration;
SELECT '상점 배경: ' || COUNT(*) || '개' FROM store_background;
SELECT '제로웨이스트 장소: ' || COUNT(*) || '개' FROM places;
