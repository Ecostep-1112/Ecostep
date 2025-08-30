-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  user_id TEXT UNIQUE,
  birth_date DATE,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 사용자 통계 테이블
CREATE TABLE user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  points INTEGER DEFAULT 0,
  total_earned_points INTEGER DEFAULT 0,
  ranking TEXT DEFAULT 'bronze',
  plastic_goal INTEGER,
  current_plastic INTEGER DEFAULT 0,
  total_plastic_saved INTEGER DEFAULT 0,
  consecutive_days INTEGER DEFAULT 0,
  last_challenge_date DATE,
  water_quality INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- 챌린지 기록 테이블
CREATE TABLE challenge_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  challenge_name TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  completion_date DATE NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 구매한 아이템 테이블
CREATE TABLE purchased_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL, -- 'fish', 'decoration', 'tank'
  item_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- 어항 설정 테이블
CREATE TABLE aquarium_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  current_tank TEXT DEFAULT 'basic',
  tank_name TEXT DEFAULT '나의 어항',
  fish_count INTEGER DEFAULT 5,
  is_random_fish BOOLEAN DEFAULT true,
  is_random_decorations BOOLEAN DEFAULT true,
  selected_fish JSONB DEFAULT '[]'::jsonb,
  selected_decorations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquarium_settings ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 통계 정책
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 챌린지 기록 정책
CREATE POLICY "Users can view own challenges" ON challenge_history
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own challenges" ON challenge_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 구매 아이템 정책
CREATE POLICY "Users can view own items" ON purchased_items
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own items" ON purchased_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 어항 설정 정책
CREATE POLICY "Users can view own aquarium" ON aquarium_settings
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own aquarium" ON aquarium_settings
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own aquarium" ON aquarium_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_aquarium_settings_updated_at BEFORE UPDATE ON aquarium_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();