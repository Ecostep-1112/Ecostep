-- Ecostep Store Data Insertion
-- Insert initial fish, decorations, and background items into Supabase

-- ================================
-- STORE FISH DATA
-- ================================

-- Bronze Fish (200-400P)
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('코리도라스', 'fish', 200, 'bronze'),
('체리바브', 'fish', 300, 'bronze'),
('네온테트라', 'fish', 400, 'bronze');

-- Silver Fish (500-700P)
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('아피스토그라마', 'fish', 500, 'silver'),
('람시클리드', 'fish', 600, 'silver'),
('구피', 'fish', 700, 'silver');

-- Gold Fish (1000-1200P)
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('엔젤피쉬', 'fish', 1000, 'gold'),
('킬리피쉬', 'fish', 1100, 'gold'),
('베타', 'fish', 1200, 'gold');

-- Platinum Fish (1500-1700P)
INSERT INTO store_fish (item_id, category, price, rank) VALUES
('디스커스', 'fish', 1500, 'platinum'),
('만다린피쉬', 'fish', 1600, 'platinum'),
('아로와나', 'fish', 1700, 'platinum');

-- ================================
-- STORE DECORATION DATA
-- ================================

-- Bronze Decorations (200-400P)
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('해초', 'decoration', 200, 'bronze'),
('용암석', 'decoration', 300, 'bronze'),
('작은 동굴', 'decoration', 400, 'bronze');

-- Silver Decorations (500-700P)
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('산호', 'decoration', 500, 'silver'),
('드리프트 우드', 'decoration', 600, 'silver'),
('조개 껍질', 'decoration', 700, 'silver');

-- Gold Decorations (900-1100P)
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('그리스 신전', 'decoration', 900, 'gold'),
('보물 상자', 'decoration', 1000, 'gold'),
('해적선', 'decoration', 1100, 'gold');

-- Platinum Decorations (1400-1600P)
INSERT INTO store_decoration (item_id, category, price, rank) VALUES
('크리스탈 동굴', 'decoration', 1400, 'platinum'),
('LED 해파리', 'decoration', 1500, 'platinum'),
('아틀란티스 유적', 'decoration', 1600, 'platinum');

-- ================================
-- STORE BACKGROUND DATA (TANKS)
-- ================================

-- Rank reward tanks
INSERT INTO store_background (item_id, category, price, rank) VALUES
('bronze_tank', 'background', 0, 'bronze'),
('silver_tank', 'background', 0, 'silver'),
('gold_tank', 'background', 0, 'gold'),
('platinum_tank', 'background', 0, 'platinum');

-- Data insertion completed successfully
