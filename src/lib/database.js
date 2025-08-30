import { supabase } from './supabase';

// 사용자 프로필 생성 또는 업데이트
export const upsertUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('프로필 업데이트 에러:', error);
    return { data: null, error };
  }
};

// 사용자 프로필 가져오기
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('프로필 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 사용자 통계 저장
export const saveUserStats = async (userId, stats) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        ...stats,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('통계 저장 에러:', error);
    return { data: null, error };
  }
};

// 사용자 통계 가져오기
export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('통계 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 챌린지 기록 저장
export const saveChallengeHistory = async (userId, challenge) => {
  try {
    const { data, error } = await supabase
      .from('challenge_history')
      .insert({
        user_id: userId,
        ...challenge,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('챌린지 기록 저장 에러:', error);
    return { data: null, error };
  }
};

// 챌린지 기록 가져오기
export const getChallengeHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('challenge_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('챌린지 기록 가져오기 에러:', error);
    return { data: null, error };
  }
};