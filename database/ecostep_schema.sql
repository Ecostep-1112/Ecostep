-- Ecostep Database Schema for Supabase
-- Environmental gamification app with fish-raising mechanics
-- Created: 2025-01-11

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- CORE USER MANAGEMENT
-- ================================

-- User information table
CREATE TABLE user_info (
    user_id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    user_password VARCHAR(300),
    phone_num VARCHAR(15),
    email VARCHAR(300) UNIQUE NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE,
    point_current INTEGER DEFAULT 0,
    points_total INTEGER DEFAULT 0,
    rank VARCHAR(20) DEFAULT 'bronze' CHECK (rank IN ('bronze', 'silver', 'gold', 'platinum')),
    amount INTEGER DEFAULT 0
);

-- User friendship system
CREATE TABLE user_friend (
    user_id VARCHAR(36) REFERENCES user_info(user_id) ON DELETE CASCADE,
    friend_id VARCHAR(36) REFERENCES user_info(user_id) ON DELETE CASCADE,
    accepted_at DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    PRIMARY KEY (user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- User purchased items
CREATE TABLE user_item (
    item_id VARCHAR(300) NOT NULL,
    user_id VARCHAR(36) REFERENCES user_info(user_id) ON DELETE CASCADE,
    ordered_at DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (item_id, user_id)
);

-- ================================
-- CHALLENGE SYSTEM
-- ================================

-- Daily challenge tracking
CREATE TABLE daily_chal_data (
    record_id VARCHAR(36) PRIMARY KEY,
    chal_id VARCHAR(36),
    user_id VARCHAR(36) REFERENCES user_info(user_id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    total_completed INTEGER DEFAULT 0,
    created_at DATE DEFAULT CURRENT_DATE,
    content TEXT
);

-- Challenge templates/lists
CREATE TABLE daily_chal_list (
    chal_id VARCHAR(36) PRIMARY KEY,
    chal_name TEXT NOT NULL,
    about_plastic BOOLEAN DEFAULT false,
    is_basic BOOLEAN DEFAULT true
);

-- ================================
-- PLASTIC TRACKING SYSTEM
-- ================================

-- Zero waste tracking data
CREATE TABLE zero_chal_data (
    record_id VARCHAR(36) PRIMARY KEY,
    item_id VARCHAR(36),
    user_id VARCHAR(36) REFERENCES user_info(user_id) ON DELETE CASCADE,
    item_type VARCHAR(300) NOT NULL,
    item_num INTEGER DEFAULT 1,
    created_at DATE DEFAULT CURRENT_DATE,
    tracked_date DATE DEFAULT CURRENT_DATE,
    quantity FLOAT DEFAULT 1,
    weight INTEGER DEFAULT 0
);

-- Plastic item types
CREATE TABLE zero_chal_item (
    item_id VARCHAR(36) PRIMARY KEY,
    item_name TEXT NOT NULL,
    tag VARCHAR(50),
    plastic_amount INTEGER NOT NULL
);

-- ================================
-- STORE SYSTEM (DIVIDED INTO CATEGORIES)
-- ================================

-- Store table for backgrounds
CREATE TABLE store_background (
    item_id VARCHAR(300) PRIMARY KEY,
    category VARCHAR(50) DEFAULT 'background',
    price INTEGER NOT NULL,
    rank VARCHAR(300) DEFAULT 'bronze'
);

-- Store table for fish
CREATE TABLE store_fish (
    item_id VARCHAR(300) PRIMARY KEY,
    category VARCHAR(50) DEFAULT 'fish',
    price INTEGER NOT NULL,
    rank VARCHAR(300) DEFAULT 'bronze'
);

-- Store table for decorations
CREATE TABLE store_decoration (
    item_id VARCHAR(300) PRIMARY KEY,
    category VARCHAR(50) DEFAULT 'decoration',
    price INTEGER NOT NULL,
    rank VARCHAR(300) DEFAULT 'bronze'
);

-- ================================
-- LOCATION FEATURES
-- ================================

-- Places for zero-waste map
CREATE TABLE places (
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    name TEXT NOT NULL,
    tag VARCHAR(50),
    description TEXT,
    PRIMARY KEY (latitude, longitude)
);

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- User info indexes
CREATE INDEX idx_user_info_email ON user_info(email);
CREATE INDEX idx_user_info_rank ON user_info(rank);
CREATE INDEX idx_user_info_points_total ON user_info(points_total DESC);

-- Challenge indexes
CREATE INDEX idx_daily_chal_data_user_date ON daily_chal_data(user_id, created_at);
CREATE INDEX idx_zero_chal_data_user_date ON zero_chal_data(user_id, tracked_date);

-- Store indexes
CREATE INDEX idx_store_background_rank ON store_background(rank);
CREATE INDEX idx_store_fish_rank ON store_fish(rank);
CREATE INDEX idx_store_decoration_rank ON store_decoration(rank);

-- Friendship indexes
CREATE INDEX idx_user_friend_status ON user_friend(status);

-- ================================
-- ROW LEVEL SECURITY (RLS)
-- ================================

-- Enable RLS on all user-related tables
ALTER TABLE user_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_friend ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_chal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE zero_chal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_item ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view their own data" ON user_info
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own data" ON user_info
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own challenges" ON daily_chal_data
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own plastic data" ON zero_chal_data
    FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own items" ON user_item
    FOR ALL USING (auth.uid()::text = user_id);

-- Allow public read access to reference tables
CREATE POLICY "Public read access" ON daily_chal_list FOR SELECT USING (true);
CREATE POLICY "Public read access" ON zero_chal_item FOR SELECT USING (true);
CREATE POLICY "Public read access" ON store_background FOR SELECT USING (true);
CREATE POLICY "Public read access" ON store_fish FOR SELECT USING (true);
CREATE POLICY "Public read access" ON store_decoration FOR SELECT USING (true);
CREATE POLICY "Public read access" ON places FOR SELECT USING (true);

-- Database schema creation completed successfully
-- Total tables: 11 core tables matching the provided diagram
-- Features: User management, challenges, plastic tracking, divided store system, location features
-- Security: Row Level Security enabled with appropriate policies
-- Performance: Indexes on frequently queried columns