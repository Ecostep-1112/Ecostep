import { supabase } from './supabase';

// 구글 로그인
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
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
        redirectTo: `${window.location.origin}/`,
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
        redirectTo: `${window.location.origin}/`,
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