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

// 아이디 중복 확인 함수 (user_f_id 기준)
const checkUserFIdAvailability = async (userFId) => {
  try {
    console.log('중복 확인할 아이디:', userFId);
    const { data, error } = await supabase
      .from('user_info')
      .select('user_f_id')
      .eq('user_f_id', userFId)
      .maybeSingle();

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

// 유니크한 user_f_id 생성 함수
const generateUniqueUserFId = async () => {
  let userFId;
  let isAvailable = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isAvailable && attempts < maxAttempts) {
    userFId = generateRandomUserId(); // 환경 관련 단어 + 랜덤 4자리 숫자
    isAvailable = await checkUserFIdAvailability(userFId);
    attempts++;
  }

  if (!isAvailable) {
    // 10번 시도 후에도 실패하면 타임스탬프 추가
    userFId = `${userFId}_${Date.now().toString().slice(-4)}`;
  }

  return userFId;
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
      // 기존 프로필이 있지만 user_f_id가 없는 경우 자동 생성
      if (!existingProfile.user_f_id) {
        console.log('user_f_id 없음, 자동 생성 시작');
        const newUserFId = await generateUniqueUserFId();

        const { data: updatedProfile, error: updateError } = await supabase
          .from('user_info')
          .update({ user_f_id: newUserFId })
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('user_f_id 업데이트 실패:', updateError);
          return { profile: existingProfile, error: null };
        }

        console.log('user_f_id 자동 생성 완료:', newUserFId);
        return { profile: updatedProfile, error: null };
      }

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
      // 새로 생성된 프로필에 user_f_id가 없으면 추가
      if (!retryProfile.user_f_id) {
        console.log('새 프로필에 user_f_id 추가');
        const newUserFId = await generateUniqueUserFId();

        const { data: updatedProfile, error: updateError } = await supabase
          .from('user_info')
          .update({ user_f_id: newUserFId })
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('user_f_id 업데이트 실패:', updateError);
          return { profile: retryProfile, error: null };
        }

        console.log('user_f_id 자동 생성 완료:', newUserFId);
        return { profile: updatedProfile, error: null };
      }

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

    // 로그인 성공 후 프로필 생성은 onAuthStateChange에서 처리
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

    // 로그인 성공 후 프로필 생성은 onAuthStateChange에서 처리
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

    // 로그인 성공 후 프로필 생성은 onAuthStateChange에서 처리
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
export const updateUserFId = async (newUserFId) => {
  try {
    console.log('user_f_id 업데이트 시작:', newUserFId);

    // 입력값 검증
    if (!newUserFId || newUserFId.trim() === '') {
      return { success: false, error: '아이디를 입력해주세요.' };
    }

    const trimmedUserFId = newUserFId.trim();

    // 현재 로그인한 사용자 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // 중복 확인
    const isAvailable = await checkUserFIdAvailability(trimmedUserFId);
    if (!isAvailable) {
      return { success: false, error: '이미 사용 중인 아이디입니다.' };
    }

    // DB에 저장
    const { data, error: updateError } = await supabase
      .from('user_info')
      .update({ user_f_id: trimmedUserFId })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('user_f_id 업데이트 DB 에러:', updateError);
      return { success: false, error: 'DB 업데이트에 실패했습니다.' };
    }

    console.log('user_f_id 업데이트 성공:', data);
    return { success: true, data, error: null };
  } catch (error) {
    console.error('user_f_id 업데이트 에러:', error);
    return { success: false, error: error.message || '아이디 업데이트에 실패했습니다.' };
  }
};

// user_f_id 중복 확인 (export용)
export const checkUserFIdDuplicate = async (userFId) => {
  try {
    if (!userFId || userFId.trim() === '') {
      return { isAvailable: false, error: '아이디를 입력해주세요.' };
    }

    const isAvailable = await checkUserFIdAvailability(userFId.trim());
    return { isAvailable, error: null };
  } catch (error) {
    console.error('user_f_id 중복 확인 에러:', error);
    return { isAvailable: false, error: error.message || '중복 확인에 실패했습니다.' };
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