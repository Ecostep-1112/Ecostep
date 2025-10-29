import { supabase } from './supabase';
import { dailyChallengeListStorage, zeroItemListStorage } from '../utils/localStorage';

// 사용자 프로필 생성 또는 업데이트 (user_info 테이블 사용)
export const upsertUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .upsert({
        user_id: userId,
        ...profileData
      }, {
        onConflict: 'user_id' // PRIMARY KEY 명시
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

// 사용자 프로필 가져오기 (user_info 테이블 사용)
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // single() 대신 maybeSingle() 사용 - 데이터 없어도 에러 안남

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('프로필 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 사용자 정보 저장 (user_info 테이블 사용)
export const saveUserStats = async (userId, stats) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .upsert({
        user_id: userId,
        point_current: stats.point_current || stats.points || 0,
        points_total: stats.points_total || stats.totalPoints || 0,
        rank: stats.rank || 'bronze',
        amount: stats.amount || stats.plasticGoal || 0,
        ...stats
      }, {
        onConflict: 'user_id' // PRIMARY KEY 명시
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('유저 정보 저장 에러:', error);
    return { data: null, error };
  }
};

// 사용자 정보 가져오기 (user_info 테이블 사용)
export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // single() 대신 maybeSingle() 사용 - 데이터 없어도 에러 안남

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('유저 정보 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 챌린지 기록 저장 (주석: challenge_history 테이블이 스키마에 없음 - daily_chal_data 사용)
// export const saveChallengeHistory = async (userId, challenge) => {
//   try {
//     const { data, error } = await supabase
//       .from('challenge_history')
//       .insert({
//         user_id: userId,
//         ...challenge,
//         created_at: new Date().toISOString()
//       })
//       .select()
//       .single();
//
//     if (error) throw error;
//     return { data, error: null };
//   } catch (error) {
//     console.error('챌린지 기록 저장 에러:', error);
//     return { data: null, error };
//   }
// };

// 챌린지 기록 가져오기 (주석: challenge_history 테이블이 스키마에 없음 - daily_chal_data 사용)
// export const getChallengeHistory = async (userId) => {
//   try {
//     const { data, error } = await supabase
//       .from('challenge_history')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return { data, error: null };
//   } catch (error) {
//     console.error('챌린지 기록 가져오기 에러:', error);
//     return { data: null, error };
//   }
// };

// ======================== 데일리 챌린지 관련 함수 ========================

// 데일리 챌린지 리스트 가져오기 (localStorage 기반)
// 기본 제공 챌린지 + 유저 커스텀 챌린지를 함께 반환
export const getDailyChallengeList = async () => {
  try {
    const data = dailyChallengeListStorage.getAll();
    return { data, error: null };
  } catch (error) {
    console.error('데일리 챌린지 리스트 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 커스텀 데일리 챌린지 추가
export const addCustomDailyChallenge = (challenge) => {
  try {
    const newChallenge = dailyChallengeListStorage.addCustom(challenge);
    return { data: newChallenge, error: null };
  } catch (error) {
    console.error('커스텀 챌린지 추가 에러:', error);
    return { data: null, error };
  }
};

// 커스텀 데일리 챌린지 삭제
export const removeCustomDailyChallenge = (id) => {
  try {
    const success = dailyChallengeListStorage.removeCustom(id);
    return { data: success, error: null };
  } catch (error) {
    console.error('커스텀 챌린지 삭제 에러:', error);
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
        ...challengeData
      }, {
        onConflict: 'record_id' // PRIMARY KEY 명시
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

// 제로 챌린지 아이템 가져오기 (localStorage 기반)
// 기본 제공 아이템 + 유저 커스텀 아이템을 함께 반환
export const getZeroChallengeItems = async () => {
  try {
    const data = zeroItemListStorage.getAll();
    return { data, error: null };
  } catch (error) {
    console.error('제로 챌린지 아이템 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 커스텀 제로 챌린지 아이템 추가
export const addCustomZeroItem = (item) => {
  try {
    const newItem = zeroItemListStorage.addCustom(item);
    return { data: newItem, error: null };
  } catch (error) {
    console.error('커스텀 아이템 추가 에러:', error);
    return { data: null, error };
  }
};

// 커스텀 제로 챌린지 아이템 삭제
export const removeCustomZeroItem = (id) => {
  try {
    const success = zeroItemListStorage.removeCustom(id);
    return { data: success, error: null };
  } catch (error) {
    console.error('커스텀 아이템 삭제 에러:', error);
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
        ...challengeData
      }, {
        onConflict: 'record_id' // PRIMARY KEY 명시
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
      .from('store')
      .select('*')
      .eq('category', 'Background')
      .order('rank', { ascending: true });

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
      .from('store')
      .select('*')
      .eq('category', 'Fish')
      .order('rank', { ascending: true });

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
      .from('store')
      .select('*')
      .eq('category', 'Decoration')
      .order('rank', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('상점 장식 정보 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 사용자 정보 관련 함수 ========================

// 사용자 정보 저장/업데이트 (통합 함수)
export const saveUserInfo = async (userId, userInfo) => {
  try {
    // user_info 테이블에 맞게 필드명 매핑
    const mappedInfo = {
      user_id: userId,
      name: userInfo.name || userInfo.username || 'User',
      email: userInfo.email,
      point_current: userInfo.point_current !== undefined ? userInfo.point_current : (userInfo.points || 0),
      points_total: userInfo.points_total !== undefined ? userInfo.points_total : (userInfo.totalPoints || 0),
      rank: userInfo.rank || 'bronze',
      amount: userInfo.amount !== undefined ? userInfo.amount : (userInfo.plasticGoal || 0),
      phone_num: userInfo.phone_num || userInfo.phone,
      user_password: userInfo.user_password
    };

    const { data, error } = await supabase
      .from('user_info')
      .upsert(mappedInfo, {
        onConflict: 'user_id' // PRIMARY KEY 명시
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
      .maybeSingle(); // single() 대신 maybeSingle() 사용 - 데이터 없어도 에러 안남

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('사용자 정보 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 구매 아이템 관련 함수 ========================

// 사용자 구매 아이템 저장
export const saveUserItem = async (userId, itemId) => {
  try {
    const { data, error } = await supabase
      .from('user_item')
      .insert({
        user_id: userId,
        item_id: itemId,
        ordered_at: new Date().toISOString().split('T')[0] // DATE 형식
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('아이템 저장 에러:', error);
    return { data: null, error };
  }
};

// 사용자 구매 아이템 목록 가져오기
export const getUserItems = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_item')
      .select('item_id, ordered_at')
      .eq('user_id', userId)
      .order('ordered_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('아이템 목록 가져오기 에러:', error);
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
        accepted_at: new Date().toISOString().split('T')[0], // DATE 타입
        status: 'accepted' // 기본값 설정
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
        ...placeData
        // places 테이블에는 created_at 컬럼이 없음
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

// ======================== 사용자 구매 아이템 관련 함수 ========================

// 사용자가 구매한 아이템 목록 가져오기
export const getUserPurchasedItems = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_item')
      .select('item_id')
      .eq('user_id', userId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('구매 아이템 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 아이템 구매 (user_item에 추가)
export const purchaseItem = async (userId, itemId) => {
  try {
    const { data, error } = await supabase
      .from('user_item')
      .insert({
        user_id: userId,
        item_id: itemId,
        ordered_at: new Date().toISOString().split('T')[0] // DATE 타입
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('아이템 구매 에러:', error);
    return { data: null, error };
  }
};

// ======================== 데일리 챌린지 기록 관련 함수 ========================

// 데일리 챌린지 기록 저장
export const saveDailyChallengeRecord = async (userId, challengeData) => {
  try {
    const { data, error } = await supabase
      .from('daily_chal_data')
      .insert({
        record_id: `${userId}_${Date.now()}`,
        user_id: userId,
        chal_id: challengeData.chal_id || null,
        is_completed: challengeData.is_completed || false,
        total_completed: challengeData.total_completed || 1,
        content: challengeData.content || '',
        created_at: new Date().toISOString().split('T')[0] // DATE 타입
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('데일리 챌린지 저장 에러:', error);
    return { data: null, error };
  }
};

// 사용자의 데일리 챌린지 기록 가져오기
export const getUserDailyChallengeRecords = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('daily_chal_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('데일리 챌린지 기록 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 제로 챌린지 (플라스틱 기록) 관련 함수 ========================

// 제로 챌린지 플라스틱 기록 저장
export const saveZeroChallengeRecord = async (userId, plasticData) => {
  try {
    const { data, error } = await supabase
      .from('zero_chal_data')
      .insert({
        record_id: `${userId}_${Date.now()}`,
        user_id: userId,
        item_id: plasticData.item_id || null,
        item_num: plasticData.item_num || 1,
        tracked_date: plasticData.tracked_date || new Date().toISOString().split('T')[0],
        quantity: plasticData.quantity || 1,
        weight: plasticData.weight || 0,
        created_at: new Date().toISOString().split('T')[0] // DATE 타입으로 변경
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('플라스틱 기록 저장 에러:', error);
    return { data: null, error };
  }
};

// 사용자의 플라스틱 기록 가져오기
export const getUserZeroChallengeRecords = async (userId, startDate = null, endDate = null) => {
  try {
    let query = supabase
      .from('zero_chal_data')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('tracked_date', startDate);
    }
    if (endDate) {
      query = query.lte('tracked_date', endDate);
    }

    query = query.order('tracked_date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('플라스틱 기록 가져오기 에러:', error);
    return { data: null, error };
  }
};