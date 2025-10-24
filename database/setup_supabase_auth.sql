-- Setup Supabase Authentication Integration
-- This links auth.users (Supabase's built-in auth) with your user_info table

-- ================================
-- STEP 0: Clean up existing policies (재실행 가능하도록)
-- ================================

-- user_info 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view their own data" ON user_info;
DROP POLICY IF EXISTS "Users can update their own data" ON user_info;
DROP POLICY IF EXISTS "Users can view their own user_info" ON user_info;
DROP POLICY IF EXISTS "Users can update their own user_info" ON user_info;
DROP POLICY IF EXISTS "Users can insert their own user_info" ON user_info;
DROP POLICY IF EXISTS "System can insert user_info" ON user_info;
DROP POLICY IF EXISTS "Users can view public profiles" ON user_info;
DROP POLICY IF EXISTS "Public access for development" ON user_info;

-- daily_chal_data 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view their own challenges" ON daily_chal_data;
DROP POLICY IF EXISTS "Users can manage their own challenges" ON daily_chal_data;
DROP POLICY IF EXISTS "Allow all operations on daily_chal_data" ON daily_chal_data;
DROP POLICY IF EXISTS "Public access for development" ON daily_chal_data;

-- zero_chal_data 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view their own plastic data" ON zero_chal_data;
DROP POLICY IF EXISTS "Users can manage their own plastic data" ON zero_chal_data;
DROP POLICY IF EXISTS "Allow all operations on zero_chal_data" ON zero_chal_data;
DROP POLICY IF EXISTS "Public access for development" ON zero_chal_data;

-- user_friend 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can manage their own friendships" ON user_friend;
DROP POLICY IF EXISTS "Allow all operations on user_friend" ON user_friend;
DROP POLICY IF EXISTS "Public access for development" ON user_friend;

-- user_item 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view their own items" ON user_item;
DROP POLICY IF EXISTS "Users can manage their own items" ON user_item;
DROP POLICY IF EXISTS "Allow all operations on user_item" ON user_item;
DROP POLICY IF EXISTS "Public access for development" ON user_item;

-- ================================
-- STEP 1: Create trigger functions for user lifecycle
-- ================================

-- Function 1: Auto-create user_info when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_info (user_id, name, email, created_at, point_current, points_total, rank, amount)
  VALUES (
    NEW.id::text,  -- Use auth.uid as user_id
    COALESCE(NEW.raw_user_meta_data->>'name', '새 사용자'),  -- Extract name from signup metadata
    NEW.email,
    CURRENT_DATE,
    0,  -- Starting points
    0,  -- Starting total points
    'bronze',  -- Starting rank
    0  -- Starting amount
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Auto-delete user_info when a user is deleted from auth
-- This ensures cascade deletion: auth.users → user_info → all related tables
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete user_info (this will cascade to all related tables)
  DELETE FROM public.user_info WHERE user_id = OLD.id::text;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================
-- STEP 2: Create triggers for user lifecycle events
-- ================================

-- Trigger 1: On user signup (INSERT)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: On user deletion (DELETE)
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- ================================
-- STEP 3: Update RLS policies to use auth.uid()
-- ================================

-- user_info: Users can only see and update their own data

CREATE POLICY "Users can view their own user_info" ON user_info
    FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own user_info" ON user_info
    FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Allow the trigger to insert (system operation)
CREATE POLICY "System can insert user_info" ON user_info
    FOR INSERT
    WITH CHECK (true);

-- daily_chal_data: Users can manage their own challenges

CREATE POLICY "Users can manage their own challenges" ON daily_chal_data
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- zero_chal_data: Users can manage their own plastic data

CREATE POLICY "Users can manage their own plastic data" ON zero_chal_data
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- user_friend: Users can manage their own friendships

CREATE POLICY "Users can manage their own friendships" ON user_friend
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- user_item: Users can manage their own items

CREATE POLICY "Users can manage their own items" ON user_item
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- ================================
-- STEP 4: Allow users to view other users' public info (for rankings/friends)
-- ================================

CREATE POLICY "Users can view public profiles" ON user_info
    FOR SELECT
    USING (true);  -- Everyone can read all user_info for rankings/leaderboards

-- ================================
-- VERIFICATION
-- ================================
SELECT 'Supabase Auth integration setup complete!' AS status;

-- Test that the trigger functions exist
SELECT proname FROM pg_proc WHERE proname IN ('handle_new_user', 'handle_user_delete');

-- Check triggers
SELECT tgname, tgenabled FROM pg_trigger
WHERE tgname IN ('on_auth_user_created', 'on_auth_user_deleted');

-- Check policies
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ================================
-- CASCADE DELETION FLOW
-- ================================
-- When a user deletes their account:
-- 1. Frontend calls: supabase.auth.signOut() + supabase.auth.admin.deleteUser(userId)
-- 2. auth.users row deleted
-- 3. on_auth_user_deleted trigger fires → handle_user_delete() function
-- 4. user_info row deleted
-- 5. CASCADE: user_friend, user_item, daily_chal_data, zero_chal_data all deleted
--
-- Result: Complete data cleanup with no orphaned records
