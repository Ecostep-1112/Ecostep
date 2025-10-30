import { supabase } from './supabase';
import { Capacitor } from '@capacitor/core';

// 플랫폼에 따른 redirect URL 반환
const getRedirectUrl = () => {
  const platform = Capacitor.getPlatform();

  if (platform === 'android' || platform === 'ios') {
    // 모바일 앱: custom URL scheme 사용
    return 'com.ecostep.app://callback';
  } else {
    // 웹: 현재 origin 사용
    return `${window.location.origin}/`;
  }
};

// 친환경 관련 단어 목록 (1~10글자)
const ecoWords = [
  'Eco', 'Green', 'Nature', 'Earth', 'Clean',
  'Pure', 'Fresh', 'Ocean', 'Forest', 'Solar',
  'Wind', 'Water', 'Leaf', 'Tree', 'Recycle',
  'Save', 'Blue', 'Life', 'Air', 'Bio',
  'Sustain', 'Energy', 'Planet', 'Climate', 'Carbon'
];

// 랜덤 아이디 생성 함수
const generateRandomUserId = () => {
  const randomWord = ecoWords[Math.floor(Math.random() * ecoWords.length)];
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${randomWord}${randomNumber}`;
};

// 아이디 중복 확인 함수
const checkUserIdAvailability = async (userId) => {
  try {
    console.log('중복 확인할 아이디:', userId);
    const { data, error } = await supabase
      .from('user_info')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle(); // single() 대신 maybeSingle() 사용

    if (error) {
      console.error('중복 확인 쿼리 에러:', error);
      // 에러가 발생하면 사용 가능한 것으로 처리
      return true;
    }

    console.log('중복 확인 결과:', data);
    // 데이터가 없으면 사용 가능
    return !data;
  } catch (error) {
    console.error('아이디 중복 확인 에러:', error);
    // 에러가 발생하면 사용 가능한 것으로 처리
    return true;
  }
};

// 유니크한 아이디 생성 함수
const generateUniqueUserId = async () => {
  let userId;
  let isAvailable = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isAvailable && attempts < maxAttempts) {
    userId = generateRandomUserId();
    isAvailable = await checkUserIdAvailability(userId);
    attempts++;
  }
  
  if (!isAvailable) {
    // 10번 시도 후에도 실패하면 타임스탬프 추가
    userId = `${userId}_${Date.now().toString().slice(-4)}`;
  }
  
  return userId;
};

// 사용자 프로필 생성 또는 업데이트
export const createOrUpdateUserProfile = async (user) => {
  try {
    console.log('프로필 생성/업데이트 시작:', user.id);

    // 기존 프로필 확인 (user_info 테이블의 user_id는 auth.uid()::text)
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_info')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(); // single() 대신 maybeSingle() 사용

    console.log('기존 프로필:', existingProfile);

    if (existingProfile) {
      // 이미 프로필이 있으면 반환
      console.log('기존 프로필 있음:', existingProfile.user_id);
      return { profile: existingProfile, error: null };
    }

    // user_info는 트리거를 통해 자동 생성되므로,
    // 프로필이 없다면 아직 트리거가 실행되지 않은 것
    // 잠시 대기 후 다시 조회
    await new Promise(resolve => setTimeout(resolve, 500));

    const { data: retryProfile, error: retryError } = await supabase
      .from('user_info')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (retryProfile) {
      return { profile: retryProfile, error: null };
    }

    // 그래도 없으면 에러 반환
    return {
      profile: null,
      error: retryError || new Error('프로필이 자동 생성되지 않았습니다.')
    };
  } catch (error) {
    console.error('프로필 생성/업데이트 에러:', error);
    return { profile: null, error };
  }
};

// 구글 로그인
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('구글 로그인 에러:', error);
    return { data: null, error };
  }
};

// 카카오 로그인
export const signInWithKakao = async () => {
  try {
    console.log('카카오 로그인 시작');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('카카오 로그인 에러:', error);
    return { data: null, error };
  }
};

// 애플 로그인
export const signInWithApple = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('애플 로그인 에러:', error);
    return { data: null, error };
  }
};

// 로그아웃
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('로그아웃 에러:', error);
    return { error };
  }
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('사용자 정보 가져오기 에러:', error);
    return { user: null, error };
  }
};

// 세션 확인
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('세션 확인 에러:', error);
    return { session: null, error };
  }
};

// 인증 상태 변경 리스너
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// 사용자 아이디 업데이트 함수
export const updateUserId = async (newUserId) => {
  try {
    console.log('아이디 업데이트 시작:', newUserId);

    // 입력값 검증
    if (!newUserId || newUserId.trim() === '') {
      return { success: false, error: '아이디를 입력해주세요.' };
    }

    const trimmedUserId = newUserId.trim();

    // profileData에서 현재 프로필 정보 가져오기
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

    // 아이디 중복 체크 (로컬에서만)
    const existingIds = JSON.parse(localStorage.getItem('allUserIds') || '[]');

    // 현재 사용자의 이전 아이디는 목록에서 제거
    const filteredIds = existingIds.filter(id => id !== profileData.userId && id !== userProfile.userId);

    // 새 아이디가 이미 사용 중인지 확인
    if (filteredIds.includes(trimmedUserId)) {
      console.log('중복된 아이디:', trimmedUserId);
      return { success: false, error: '이미 사용 중인 아이디입니다.' };
    }

    // userProfile 업데이트
    userProfile.userId = trimmedUserId;
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    // profileData 업데이트
    profileData.userId = trimmedUserId;
    localStorage.setItem('profileData', JSON.stringify(profileData));

    // 전체 아이디 목록 업데이트
    filteredIds.push(trimmedUserId);
    localStorage.setItem('allUserIds', JSON.stringify(filteredIds));

    console.log('로컬 저장 성공:', {
      userId: trimmedUserId,
      allUserIds: filteredIds
    });

    return { success: true, data: { user_id: trimmedUserId }, error: null };
  } catch (error) {
    console.error('아이디 업데이트 에러:', error);
    return { success: false, error: error.message || '아이디 업데이트에 실패했습니다.' };
  }
};

// 계정 삭제 함수
export const deleteAccount = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 1. user_info 테이블에서 사용자 데이터 삭제
    // ON DELETE CASCADE로 인해 관련 테이블도 자동 삭제됨
    const { error: profileError } = await supabase
      .from('user_info')
      .delete()
      .eq('user_id', user.id);

    if (profileError) {
      console.error('프로필 삭제 에러:', profileError);
    }

    // 2. localStorage 데이터 모두 삭제
    localStorage.clear();

    // 3. 계정 삭제 (Supabase Auth)
    // 주의: Supabase는 클라이언트에서 직접 계정 삭제를 지원하지 않음
    // 대신 로그아웃 처리
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      throw signOutError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('계정 삭제 에러:', error);
    return { success: false, error: error.message || '계정 삭제에 실패했습니다.' };
  }
};

// 사용자 프로필 가져오기
export const getUserProfile = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Auth error:', userError);
      return { profile: null, error: userError };
    }

    if (!user) {
      console.error('No user found');
      return { profile: null, error: new Error('로그인이 필요합니다.') };
    }

    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(); // single() 대신 maybeSingle() 사용

    // 프로필이 없는 경우 생성 (트리거를 통해 자동 생성 대기)
    if (!data && !error) {
      const result = await createOrUpdateUserProfile(user);
      return result;
    }

    if (error) {
      console.error('프로필 조회 에러:', error);
      throw error;
    }

    return { profile: data, error: null };
  } catch (error) {
    console.error('프로필 가져오기 에러:', error);
    return { profile: null, error };
  }
};