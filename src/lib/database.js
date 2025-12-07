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
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('프로필 가져오기 에러:', error);
    return { data: null, error };
  }
};

// ======================== 데일리 챌린지 관련 함수 ========================

// 데일리 챌린지 리스트 가져오기 (DB + localStorage)
// 기본 제공 챌린지(DB) + 유저 커스텀 챌린지(localStorage)를 함께 반환
export const getDailyChallengeList = async (userId = null) => {
  try {
    // 1. DB에서 기본 챌린지 가져오기
    const { data: basicChallenges, error: dbError } = await supabase
      .from('daily_chal_list')
      .select('*')
      .eq('is_basic', true)
      .order('chal_id', { ascending: true });

    if (dbError) {
      console.error('기본 챌린지 로드 에러:', dbError);
      throw dbError;
    }

    // 2. localStorage에서 커스텀 챌린지 가져오기
    const customChallenges = dailyChallengeListStorage.getCustom();

    // 3. 데이터 포맷 변환 (DB 형식 → 앱 형식)
    const formattedBasicChallenges = (basicChallenges || []).map(chal => ({
      id: chal.chal_id,
      title: chal.chal_name,
      description: chal.chal_name,
      category: chal.about_plastic ? '플라스틱 줄이기' : '일반',
      estimatedSavings: 0, // DB에 없으면 기본값
      isBasic: true
    }));

    // 4. 기본 + 커스텀 합치기
    const allChallenges = [...formattedBasicChallenges, ...customChallenges];

    return { data: allChallenges, error: null };
  } catch (error) {
    console.error('데일리 챌린지 리스트 가져오기 에러:', error);
    // 에러 발생 시 localStorage만 사용
    const fallbackData = dailyChallengeListStorage.getAll();
    return { data: fallbackData, error };
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
      amount: userInfo.amount !== undefined ? userInfo.amount : 0, // 총 플라스틱 절약량 (totalPlasticSaved)
      consecutive_days: userInfo.consecutive_days !== undefined ? userInfo.consecutive_days : 0, // 연속 달성 일수
      water_quality: userInfo.water_quality !== undefined ? userInfo.water_quality : 100, // 수질 (기본값 100)
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
    // 이메일 중복 에러(23505) 처리
    if (error.code === '23505' && error.message.includes('user_info_email_key')) {

      try {
        // email 필드를 제외하고 UPDATE 수행
        const { email, ...updateInfo } = mappedInfo;

        const { data, error: updateError } = await supabase
          .from('user_info')
          .update(updateInfo)
          .eq('user_id', userId)
          .select()
          .single();

        if (updateError) throw updateError;
        return { data, error: null };
      } catch (retryError) {
        console.error('재시도 실패:', retryError);
        return { data: null, error: retryError };
      }
    }

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

// 사용자의 총 플라스틱 절약량 계산 (DB에서 직접 계산)
export const getTotalPlasticSaved = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('zero_chal_data')
      .select('weight')
      .eq('user_id', userId);

    if (error) throw error;

    // 모든 weight 합산
    const total = data.reduce((sum, record) => sum + (record.weight || 0), 0);

    return { data: total, error: null };
  } catch (error) {
    console.error('총 플라스틱 절약량 계산 에러:', error);
    return { data: 0, error };
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

// 주간 챌린지 기록 가져오기 (특정 주의 챌린지)
export const getWeeklyChallengeRecord = async (userId, weekStartDate) => {
  try {
    const { data, error } = await supabase
      .from('daily_chal_data')
      .select('*')
      .eq('user_id', userId)
      .eq('created_at', weekStartDate)
      .maybeSingle(); // 0개 또는 1개 결과 (없으면 null 반환)

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('주간 챌린지 기록 가져오기 에러:', error);
    return { data: null, error };
  }
};

// 주간 챌린지 완료 (insert or update)
// currentDayIndex: 0(월) ~ 6(일)
export const completeWeeklyChallenge = async (userId, weekStartDate, challengeId, challengeName, currentDayIndex) => {
  try {
    // 먼저 이번 주 기록이 있는지 확인
    const { data: existing } = await getWeeklyChallengeRecord(userId, weekStartDate);

    if (existing) {
      // 기존 기록이 있으면 total_completed 증가 (최대 7)
      // ⚠️ 주의: 실제로는 Challenge.jsx에서 todayCompleted 체크로 중복 방지
      const newTotal = Math.min(existing.total_completed + 1, 7);

      const { data, error } = await supabase
        .from('daily_chal_data')
        .update({
          total_completed: newTotal,
          is_completed: newTotal === 7 // 7일 모두 완료하면 true
        })
        .eq('record_id', existing.record_id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } else {
      // 새로운 주 시작 - 새 레코드 생성
      const recordId = `${userId}_${weekStartDate}_${Date.now()}`;

      const { data, error } = await supabase
        .from('daily_chal_data')
        .insert({
          record_id: recordId,
          user_id: userId,
          chal_id: challengeId,
          content: challengeName,
          is_completed: false,
          total_completed: 1,
          created_at: weekStartDate
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error('주간 챌린지 완료 에러:', error);
    return { data: null, error };
  }
};

// ======================== 제로 챌린지 (플라스틱 기록) 관련 함수 ========================

// 제로 챌린지 플라스틱 기록 저장
export const saveZeroChallengeRecord = async (userId, plasticData) => {
  try {
    // ✅ item_name 필수 검증
    if (!plasticData.item_name || plasticData.item_name.trim() === '') {
      console.error('❌ item_name이 비어있습니다:', plasticData);
      throw new Error('플라스틱 아이템 이름이 필요합니다.');
    }

    const trackedDate = plasticData.tracked_date || new Date().toISOString().split('T')[0];
    const itemName = plasticData.item_name;

    // 1. 기존 데이터 확인 (같은 날짜, 같은 아이템)
    const { data: existing, error: fetchError } = await supabase
      .from('zero_chal_data')
      .select('*')
      .eq('user_id', userId)
      .eq('tracked_date', trackedDate)
      .eq('item_name', itemName)
      .maybeSingle(); // single 대신 maybeSingle 사용 (없으면 null 반환)

    if (fetchError) {
      console.error('기존 데이터 조회 에러:', fetchError);
      throw fetchError;
    }

    let result;

    if (existing) {
      // 2-A. 기존 데이터가 있으면 수량과 무게 증가
      const { data, error } = await supabase
        .from('zero_chal_data')
        .update({
          quantity: existing.quantity + (plasticData.quantity || 1),
          weight: existing.weight + (plasticData.weight || 0)
        })
        .eq('record_id', existing.record_id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 2-B. 기존 데이터가 없으면 새로 생성
      const { data, error } = await supabase
        .from('zero_chal_data')
        .insert({
          record_id: crypto.randomUUID(),
          user_id: userId,
          item_id: null, // Foreign key constraint 우회
          item_name: plasticData.item_name,
          item_num: plasticData.item_num || 1,
          tracked_date: trackedDate,
          quantity: plasticData.quantity || 1,
          weight: plasticData.weight || 0,
          created_at: trackedDate
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return { data: result, error: null };
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

// ======================== 챌린지 히스토리 관련 함수 ========================

// 챌린지 완료 날짜 저장 (challengeHistory)
export const saveChallengeCompletionDate = async (userId, challengeDate = null) => {
  try {
    const dateToSave = challengeDate || new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_chal_record')
      .insert({
        user_id: userId,
        challenge_date: dateToSave
      })
      .select()
      .single();

    if (error) {
      // UNIQUE constraint violation (already exists for this date)
      if (error.code === '23505') {
        return { data: null, error: null }; // Not an error, just already recorded
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('챌린지 날짜 저장 에러:', error);
    return { data: null, error };
  }
};

// 사용자의 챌린지 완료 기록 가져오기 (challengeHistory)
export const getUserChallengeHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('daily_chal_record')
      .select('challenge_date')
      .eq('user_id', userId)
      .order('challenge_date', { ascending: true });

    if (error) throw error;

    // Convert to ISO string array format (matching current challengeHistory format)
    const dates = data.map(record => new Date(record.challenge_date).toISOString());

    return { data: dates, error: null };
  } catch (error) {
    console.error('챌린지 히스토리 가져오기 에러:', error);
    return { data: [], error };
  }
};