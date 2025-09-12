-- Ecostep Database Schema for Supabase
-- Environmental gamification app with fish-raising mechanics
-- Created: 2025-01-11

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- CORE USER MANAGEMENT
-- ================================

-- User information table (enhanced)
CREATE TABLE user_info (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(300) UNIQUE NOT NULL,
    user_password VARCHAR(300), -- For custom auth, can be null if using OAuth
    phone_num VARCHAR(15),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Game stats
    points_current INTEGER DEFAULT 0 CHECK (points_current >= 0),
    points_total INTEGER DEFAULT 0 CHECK (points_total >= 0),
    rank VARCHAR(20) DEFAULT 'bronze' CHECK (rank IN ('bronze', 'silver', 'gold', 'platinum')),
    consecutive_days INTEGER DEFAULT 0 CHECK (consecutive_days >= 0),
    total_plastic_saved_grams DECIMAL(10,2) DEFAULT 0 CHECK (total_plastic_saved_grams >= 0),
    
    -- Aquarium settings
    current_tank VARCHAR(20) DEFAULT 'basic' CHECK (current_tank IN ('basic', 'silver', 'gold', 'platinum')),
    tank_name VARCHAR(50) DEFAULT '수질',
    water_quality INTEGER DEFAULT 100 CHECK (water_quality >= 0 AND water_quality <= 100),
    last_challenge_date DATE,
    
    -- Preferences
    is_dark_mode BOOLEAN DEFAULT false,
    language_code VARCHAR(5) DEFAULT 'ko',
    notifications_enabled BOOLEAN DEFAULT true,
    location_sharing_enabled BOOLEAN DEFAULT false
);

-- User friendship system
CREATE TABLE user_friends (
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    friend_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- ================================
-- GAMIFICATION SYSTEM
-- ================================

-- Available challenges
CREATE TABLE challenges (
    chal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chal_name VARCHAR(100) NOT NULL,
    description TEXT,
    points_reward INTEGER DEFAULT 0 CHECK (points_reward >= 0),
    duration_days INTEGER DEFAULT 1 CHECK (duration_days > 0),
    difficulty VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category VARCHAR(30) DEFAULT 'plastic' CHECK (category IN ('plastic', 'energy', 'transport', 'water', 'waste')),
    is_active BOOLEAN DEFAULT true,
    required_rank VARCHAR(20) DEFAULT 'bronze' CHECK (required_rank IN ('bronze', 'silver', 'gold', 'platinum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User challenge participation
CREATE TABLE user_challenges (
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    chal_id UUID REFERENCES challenges(chal_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'abandoned')),
    completion_date DATE,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, chal_id, start_date)
);

-- Daily challenge tracking
CREATE TABLE daily_chal_data (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    chal_id UUID REFERENCES challenges(chal_id) ON DELETE CASCADE,
    tracked_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    total_completed INTEGER DEFAULT 0,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, chal_id, tracked_date)
);

-- Challenge templates/lists
CREATE TABLE daily_chal_list (
    chal_id UUID PRIMARY KEY REFERENCES challenges(chal_id) ON DELETE CASCADE,
    chal_name VARCHAR(100) NOT NULL,
    about_plastic BOOLEAN DEFAULT false,
    is_basic BOOLEAN DEFAULT true
);

-- ================================
-- PLASTIC TRACKING SYSTEM
-- ================================

-- Zero waste tracking data
CREATE TABLE zero_chal_data (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    item_id UUID,
    item_type VARCHAR(100) NOT NULL,
    item_name VARCHAR(100),
    quantity DECIMAL(8,2) DEFAULT 1 CHECK (quantity > 0),
    weight_grams INTEGER DEFAULT 0 CHECK (weight_grams >= 0),
    tracked_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plastic item types
CREATE TABLE zero_chal_item (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(100) NOT NULL,
    tag VARCHAR(50),
    plastic_amount_grams INTEGER NOT NULL CHECK (plastic_amount_grams > 0),
    category VARCHAR(30) DEFAULT 'general' CHECK (category IN ('bottles', 'containers', 'bags', 'utensils', 'packaging', 'general')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- AQUARIUM & REWARDS SYSTEM
-- ================================

-- Fish collection
CREATE TABLE fish_collection (
    fish_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fish_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    required_rank VARCHAR(20) NOT NULL CHECK (required_rank IN ('bronze', 'silver', 'gold', 'platinum')),
    price INTEGER NOT NULL CHECK (price > 0),
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User owned fish
CREATE TABLE user_fish (
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    fish_id UUID REFERENCES fish_collection(fish_id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active_in_tank BOOLEAN DEFAULT false,
    fish_level INTEGER DEFAULT 1 CHECK (fish_level >= 1),
    happiness INTEGER DEFAULT 100 CHECK (happiness >= 0 AND happiness <= 100),
    PRIMARY KEY (user_id, fish_id)
);

-- Decoration collection
CREATE TABLE decorations (
    decoration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decoration_name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    required_rank VARCHAR(20) NOT NULL CHECK (required_rank IN ('bronze', 'silver', 'gold', 'platinum')),
    price INTEGER NOT NULL CHECK (price > 0),
    category VARCHAR(30) DEFAULT 'plants' CHECK (category IN ('plants', 'rocks', 'structures', 'special')),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User owned decorations
CREATE TABLE user_decorations (
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    decoration_id UUID REFERENCES decorations(decoration_id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active_in_tank BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, decoration_id)
);

-- Store items (unified store system)
CREATE TABLE store (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('fish', 'decoration', 'tank', 'special')),
    price INTEGER NOT NULL CHECK (price > 0),
    required_rank VARCHAR(20) DEFAULT 'bronze' CHECK (required_rank IN ('bronze', 'silver', 'gold', 'platinum')),
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User purchase history
CREATE TABLE user_purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    item_id UUID REFERENCES store(item_id) ON DELETE CASCADE,
    purchase_price INTEGER NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- LOCATION & SOCIAL FEATURES
-- ================================

-- Places for zero-waste map
CREATE TABLE places (
    place_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    tag VARCHAR(50),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT false
);

-- User achievements
CREATE TABLE achievements (
    achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    required_action VARCHAR(50) NOT NULL,
    required_count INTEGER DEFAULT 1,
    points_reward INTEGER DEFAULT 0,
    badge_icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User earned achievements
CREATE TABLE user_achievements (
    user_id UUID REFERENCES user_info(user_id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, achievement_id)
);

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- User info indexes
CREATE INDEX idx_user_info_email ON user_info(email);
CREATE INDEX idx_user_info_rank ON user_info(rank);
CREATE INDEX idx_user_info_points_total ON user_info(points_total DESC);

-- Challenge indexes
CREATE INDEX idx_user_challenges_user_status ON user_challenges(user_id, status);
CREATE INDEX idx_daily_chal_data_user_date ON daily_chal_data(user_id, tracked_date);
CREATE INDEX idx_zero_chal_data_user_date ON zero_chal_data(user_id, tracked_date);

-- Store indexes
CREATE INDEX idx_store_category_rank ON store(category, required_rank);
CREATE INDEX idx_fish_collection_rank ON fish_collection(required_rank);
CREATE INDEX idx_decorations_rank ON decorations(required_rank);

-- Friendship indexes
CREATE INDEX idx_user_friends_status ON user_friends(status);

-- ================================
-- TRIGGERS FOR AUTO-UPDATES
-- ================================

-- Update user rank based on total points
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
BEGIN
    NEW.rank := CASE
        WHEN NEW.points_total < 2100 THEN 'bronze'
        WHEN NEW.points_total < 6300 THEN 'silver'
        WHEN NEW.points_total < 12600 THEN 'gold'
        ELSE 'platinum'
    END;
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_rank
    BEFORE UPDATE OF points_total ON user_info
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rank();

-- Update user total points when earning points
CREATE OR REPLACE FUNCTION update_points_total()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.points_current > OLD.points_current THEN
        NEW.points_total := NEW.points_total + (NEW.points_current - OLD.points_current);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_points_total
    BEFORE UPDATE OF points_current ON user_info
    FOR EACH ROW
    EXECUTE FUNCTION update_points_total();

-- ================================
-- SEED DATA
-- ================================

-- Insert default challenges
INSERT INTO challenges (chal_name, description, points_reward, duration_days, category, difficulty) VALUES
('플라스틱 빨대 사용 안하기', '일주일 동안 플라스틱 빨대를 사용하지 않기', 100, 7, 'plastic', 'easy'),
('텀블러 사용하기', '3일 연속 텀블러 사용하기', 150, 3, 'plastic', 'easy'),
('장바구니 챙기기', '5일 연속 장보기 할 때 장바구니 챙기기', 200, 5, 'plastic', 'medium'),
('플라스틱 용기 재사용하기', '플라스틱 용기 3개 이상 재사용하기', 120, 1, 'plastic', 'easy'),
('대중교통 이용하기', '일주일 동안 대중교통만 이용하기', 300, 7, 'transport', 'medium'),
('전기 절약하기', '불필요한 전자제품 끄기 3일 실천', 180, 3, 'energy', 'easy'),
('분리수거 완벽하게 하기', '일주일 동안 분리수거 완벽 실천', 250, 7, 'waste', 'medium'),
('물 절약하기', '3분 샤워 도전 5일', 160, 5, 'water', 'medium');

-- Insert fish collection
INSERT INTO fish_collection (fish_name, description, required_rank, price, rarity) VALUES
-- Bronze tier
('코리도라스', '바닥 청소 요정', 'bronze', 500, 'common'),
('체리바브', '체리 같은 귀요미', 'bronze', 600, 'common'),
('네온테트라', '반짝이는 보석', 'bronze', 700, 'common'),
-- Silver tier
('아피스토그라마', '포켓 드래곤', 'silver', 1000, 'rare'),
('람시클리드', '온화한 젠틀맨', 'silver', 1200, 'rare'),
('구피', '꼬리 댄싱퀸', 'silver', 800, 'common'),
-- Gold tier
('엔젤피쉬', '수중의 천사', 'gold', 2000, 'epic'),
('킬리피쉬', '자유로운 모험가', 'gold', 1800, 'rare'),
('베타', '실크 드레스 퀸', 'gold', 2200, 'epic'),
-- Platinum tier
('디스커스', '수중 황제', 'platinum', 5000, 'legendary'),
('만다린피쉬', '네온 아티스트', 'platinum', 4500, 'legendary'),
('아로와나', '전설의 용', 'platinum', 6000, 'legendary');

-- Insert decorations
INSERT INTO decorations (decoration_name, description, required_rank, price, category) VALUES
-- Bronze tier
('해초', '자연스러운 수초', 'bronze', 100, 'plants'),
('용암석', '신비로운 화산석', 'bronze', 150, 'rocks'),
('작은 동굴', '아늑한 은신처', 'bronze', 200, 'structures'),
-- Silver tier
('산호', '화려한 바다 정원', 'silver', 250, 'plants'),
('드리프트 우드', '오래된 바다 목재', 'silver', 300, 'structures'),
('조개 껍질', '바다의 보석함', 'silver', 350, 'special'),
-- Gold tier
('그리스 신전', '고대 문명의 흔적', 'gold', 400, 'structures'),
('보물 상자', '해적의 황금 보물', 'gold', 450, 'special'),
('해적선', '전설의 침몰선', 'gold', 500, 'structures'),
-- Platinum tier
('크리스탈 동굴', '신비한 크리스탈', 'platinum', 600, 'special'),
('LED 해파리', '빛나는 수중 요정', 'platinum', 700, 'special'),
('아틀란티스 유적', '잃어버린 문명', 'platinum', 800, 'structures');

-- Insert plastic items
INSERT INTO zero_chal_item (item_name, tag, plastic_amount_grams, category) VALUES
('페트병 500ml', 'bottle', 25, 'bottles'),
('페트병 1.5L', 'bottle', 45, 'bottles'),
('플라스틱 컵', 'cup', 15, 'utensils'),
('비닐봉지 소', 'bag', 8, 'bags'),
('비닐봉지 대', 'bag', 15, 'bags'),
('플라스틱 용기 소', 'container', 30, 'containers'),
('플라스틱 용기 대', 'container', 60, 'containers'),
('플라스틱 빨대', 'straw', 2, 'utensils'),
('일회용 포크', 'utensil', 5, 'utensils'),
('일회용 숟가락', 'utensil', 4, 'utensils'),
('포장재', 'packaging', 20, 'packaging'),
('배달 용기', 'delivery', 40, 'containers');

-- Insert achievements
INSERT INTO achievements (achievement_name, description, required_action, required_count, points_reward) VALUES
('첫 걸음', '첫 번째 챌린지 완료하기', 'complete_challenge', 1, 50),
('일주일 연속', '7일 연속 챌린지 완료', 'consecutive_days', 7, 200),
('한 달 챔피언', '30일 연속 챌린지 완료', 'consecutive_days', 30, 1000),
('플라스틱 절약왕', '플라스틱 1kg 절약하기', 'plastic_saved_grams', 1000, 300),
('물고기 수집가', '물고기 5마리 수집하기', 'collect_fish', 5, 250),
('수족관 마스터', '모든 등급의 물고기 수집하기', 'collect_all_ranks', 4, 500);

-- Insert store items (unified)
INSERT INTO store (item_name, category, price, required_rank, description) VALUES
-- Tanks
('실버 어항', 'tank', 2100, 'silver', '실버 등급 달성 시 획득 가능한 어항'),
('골드 어항', 'tank', 6300, 'gold', '골드 등급 달성 시 획득 가능한 어항'),
('플래티넘 어항', 'tank', 12600, 'platinum', '플래티넘 등급 달성 시 획득 가능한 어항');

-- ================================
-- ROW LEVEL SECURITY (RLS)
-- ================================

-- Enable RLS on all user-related tables
ALTER TABLE user_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_chal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE zero_chal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_fish ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view their own data" ON user_info
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON user_info
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own challenges" ON user_challenges
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tracking data" ON daily_chal_data
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own plastic data" ON zero_chal_data
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own fish" ON user_fish
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own decorations" ON user_decorations
    FOR ALL USING (auth.uid() = user_id);

-- Allow public read access to reference tables
CREATE POLICY "Public read access" ON challenges FOR SELECT USING (true);
CREATE POLICY "Public read access" ON fish_collection FOR SELECT USING (true);
CREATE POLICY "Public read access" ON decorations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON zero_chal_item FOR SELECT USING (true);
CREATE POLICY "Public read access" ON store FOR SELECT USING (true);
CREATE POLICY "Public read access" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON places FOR SELECT USING (true);

-- ================================
-- HELPFUL VIEWS
-- ================================

-- User leaderboard view
CREATE VIEW user_leaderboard AS
SELECT 
    user_id,
    name,
    rank,
    points_total,
    total_plastic_saved_grams,
    consecutive_days,
    ROW_NUMBER() OVER (ORDER BY points_total DESC) as global_rank
FROM user_info
WHERE points_total > 0
ORDER BY points_total DESC;

-- User progress summary
CREATE VIEW user_progress_summary AS
SELECT 
    ui.user_id,
    ui.name,
    ui.rank,
    ui.points_current,
    ui.points_total,
    ui.consecutive_days,
    ui.total_plastic_saved_grams,
    COUNT(DISTINCT uc.chal_id) as total_challenges_completed,
    COUNT(DISTINCT uf.fish_id) as total_fish_owned,
    COUNT(DISTINCT ud.decoration_id) as total_decorations_owned
FROM user_info ui
LEFT JOIN user_challenges uc ON ui.user_id = uc.user_id AND uc.status = 'completed'
LEFT JOIN user_fish uf ON ui.user_id = uf.user_id
LEFT JOIN user_decorations ud ON ui.user_id = ud.user_id
GROUP BY ui.user_id, ui.name, ui.rank, ui.points_current, ui.points_total, 
         ui.consecutive_days, ui.total_plastic_saved_grams;

-- ================================
-- COMMENTS
-- ================================

COMMENT ON TABLE user_info IS 'Core user information and game progress';
COMMENT ON TABLE challenges IS 'Available environmental challenges';
COMMENT ON TABLE user_challenges IS 'User participation in challenges';
COMMENT ON TABLE fish_collection IS 'Available fish for collection';
COMMENT ON TABLE decorations IS 'Available aquarium decorations';
COMMENT ON TABLE zero_chal_data IS 'Plastic usage tracking data';
COMMENT ON TABLE zero_chal_item IS 'Types of plastic items with weight data';

-- Database schema creation completed successfully
-- Total tables: 17 core tables + 2 views
-- Features: User management, challenges, fish collection, plastic tracking, social features, achievements
-- Security: Row Level Security enabled with appropriate policies
-- Performance: Indexes on frequently queried columns
-- Automation: Triggers for rank calculation and point updates