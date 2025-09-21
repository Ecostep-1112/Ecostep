-- Sample data for Ecostep database
-- Insert one entity to each table for testing purposes

-- Sample user
INSERT INTO user_info (user_id, name, email, user_password, phone_num, point_current, points_total, rank, amount)
VALUES ('user-001', '김에코', 'eco@example.com', 'hashed_password', '010-1234-5678', 500, 2500, 'silver', 10);

-- Sample friend relationship
INSERT INTO user_friend (user_id, friend_id, accepted_at, status)
VALUES ('user-001', 'user-002', '2025-01-15', 'accepted');

-- Sample user item purchase
INSERT INTO user_item (item_id, user_id, ordered_at)
VALUES ('fish-neon-tetra', 'user-001', '2025-01-15');

-- Sample daily challenge data
INSERT INTO daily_chal_data (record_id, chal_id, user_id, is_completed, total_completed, created_at, content)
VALUES ('record-001', 'chal-001', 'user-001', true, 5, '2025-01-15', '플라스틱 빨대 사용하지 않기 완료');

-- Sample daily challenge list
INSERT INTO daily_chal_list (chal_id, chal_name, about_plastic, is_basic)
VALUES ('chal-001', '플라스틱 빨대 사용 안하기', true, true);

-- Sample zero waste tracking data
INSERT INTO zero_chal_data (record_id, item_id, user_id, item_type, item_num, created_at, tracked_date, quantity, weight)
VALUES ('zero-001', 'item-001', 'user-001', '페트병', 2, '2025-01-15', '2025-01-15', 2.0, 50);

-- Sample plastic item
INSERT INTO zero_chal_item (item_id, item_name, tag, plastic_amount)
VALUES ('item-001', '페트병 500ml', 'bottle', 25);

-- Sample store background
INSERT INTO store_background (item_id, category, price, rank)
VALUES ('bg-ocean-blue', 'background', 200, 'bronze');

-- Sample store fish
INSERT INTO store_fish (item_id, category, price, rank)
VALUES ('fish-neon-tetra', 'fish', 700, 'bronze');

-- Sample store decoration
INSERT INTO store_decoration (item_id, category, price, rank)
VALUES ('deco-seaweed', 'decoration', 100, 'bronze');

-- Sample place
INSERT INTO places (latitude, longitude, name, tag, description)
VALUES (37.5665, 126.9780, '서울역 제로웨이스트샵', 'zero-waste', '친환경 제품을 판매하는 제로웨이스트 매장');