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

// ======================== 데일리 챌린지 관련 함수 ========================

// 데일리 챌린지 리스트 가져오기
export const getDailyChallengeList = async () => {
  try {
    const { data, error } = await supabase
      .from('daily_chal_list')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('데일리 챌린지 리스트 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 데일리 챌린지 데이터 저장
export const saveDailyChallengeData = async (userId, challengeData) => {
  try {
    const { data, error } = await supabase
      .from('daily_chal_data')
      .upsert({
        user_id: userId,
        ...challengeData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('데일리 챌린지 데이터 저장 에러:', error);
    return { data: null, error };
  }
};

// 데일리 챌린지 데이터 가져오기
export const getDailyChallengeData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('daily_chal_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('데일리 챌린지 데이터 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 제로 챌린지 관련 함수 ========================

// 제로 챌린지 아이템 가져오기
export const getZeroChallengeItems = async () => {
  try {
    const { data, error } = await supabase
      .from('zero_chal_item')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('제로 챌린지 아이템 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 제로 챌린지 기록 저장
export const saveZeroChallengeData = async (userId, challengeData) => {
  try {
    const { data, error } = await supabase
      .from('zero_chal_data')
      .upsert({
        user_id: userId,
        ...challengeData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('제로 챌린지 기록 저장 에러:', error);
    return { data: null, error };
  }
};

// 제로 챌린지 기록 가져오기
export const getZeroChallengeData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('zero_chal_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('제로 챌린지 기록 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 상점 관련 함수 ========================

// 상점 배경 정보 가져오기
export const getStoreBackgrounds = async () => {
  try {
    const { data, error } = await supabase
      .from('store_background')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('상점 배경 정보 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 상점 물고기 정보 가져오기
export const getStoreFish = async () => {
  try {
    const { data, error } = await supabase
      .from('store_fish')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('상점 물고기 정보 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 상점 장식 정보 가져오기
export const getStoreDecorations = async () => {
  try {
    const { data, error } = await supabase
      .from('store_decoration')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('상점 장식 정보 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 사용자 정보 관련 함수 ========================

// 사용자 정보 저장/업데이트
export const saveUserInfo = async (userId, userInfo) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .upsert({
        user_id: userId,
        ...userInfo,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('사용자 정보 저장 에러:', error);
    return { data: null, error };
  }
};

// 사용자 정보 가져오기
export const getUserInfo = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('사용자 정보 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 친구 관련 함수 ========================

// 친구 추가
export const addFriend = async (userId, friendId) => {
  try {
    const { data, error } = await supabase
      .from('user_friend')
      .insert({
        user_id: userId,
        friend_id: friendId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('친구 추가 에러:', error);
    return { data: null, error };
  }
};

// 친구 목록 가져오기
export const getUserFriends = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_friend')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('친구 목록 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 친구 삭제
export const removeFriend = async (userId, friendId) => {
  try {
    const { data, error } = await supabase
      .from('user_friend')
      .delete()
      .eq('user_id', userId)
      .eq('friend_id', friendId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('친구 삭제 에러:', error);
    return { data: null, error };
  }
};

// ======================== 제로 웨이스트 맵 관련 함수 ========================

// 제로 웨이스트 장소 가져오기
export const getZeroWastePlaces = async () => {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('제로 웨이스트 장소 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 특정 지역의 제로 웨이스트 장소 가져오기
export const getZeroWastePlacesByLocation = async (latitude, longitude, radius = 10) => {
  try {
    // 반경 내 장소 검색 (단순 거리 계산)
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .gte('latitude', latitude - radius * 0.009) // 대략 1km = 0.009도
      .lte('latitude', latitude + radius * 0.009)
      .gte('longitude', longitude - radius * 0.009)
      .lte('longitude', longitude + radius * 0.009);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('지역별 제로 웨이스트 장소 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 새로운 제로 웨이스트 장소 추가
export const addZeroWastePlace = async (placeData) => {
  try {
    const { data, error } = await supabase
      .from('places')
      .insert({
        ...placeData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('제로 웨이스트 장소 추가 에러:', error);
    return { data: null, error };
  }
};