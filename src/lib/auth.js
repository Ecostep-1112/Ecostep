import { supabase } from './supabase';

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
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle(); // single() 대신 maybeSingle() 사용
    
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
    
    // 기존 프로필 확인
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(); // single() 대신 maybeSingle() 사용
    
    console.log('기존 프로필:', existingProfile);
    
    if (existingProfile && existingProfile.user_id) {
      // 이미 아이디가 있으면 반환
      console.log('기존 user_id 있음:', existingProfile.user_id);
      return { profile: existingProfile, error: null };
    }
    
    // 새로운 아이디 생성
    const newUserId = await generateUniqueUserId();
    console.log('새로 생성된 user_id:', newUserId);
    
    // 프로필 데이터 준비
    const profileData = {
      id: user.id,
      email: user.email,
      user_id: newUserId,
      username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // 프로필이 없으면 insert, 있으면 update
    let data, error;
    if (!existingProfile) {
      // 새로 생성
      const result = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // 업데이트 - user_id가 없는 경우에만 새로 생성
      if (!existingProfile.user_id) {
        const result = await supabase
          .from('profiles')
          .update({
            user_id: newUserId,
            username: existingProfile.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // 이미 user_id가 있으면 기존 프로필 반환
        data = existingProfile;
        error = null;
      }
    }
    
    if (error) {
      console.error('프로필 저장 에러:', error);
      throw error;
    }
    
    return { profile: data, error: null };
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
        redirectTo: `${window.location.origin}/`,
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
        redirectTo: `${window.location.origin}/`,
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
        redirectTo: `${window.location.origin}/`,
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
export const updateUserId = async (newUserId) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Auth error:', userError);
      throw new Error('로그인이 필요합니다.');
    }
    if (!user) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }
    
    // 먼저 현재 프로필이 존재하는지 확인
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // 프로필이 없으면 먼저 생성
    if (!currentProfile) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          user_id: newUserId,
          username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (createError) {
        console.error('프로필 생성 에러:', createError);
        throw new Error('프로필 생성에 실패했습니다.');
      }
      
      return { success: true, data: { user_id: newUserId }, error: null };
    }
    
    // 아이디 중복 확인 (자기 자신 제외)
    if (currentProfile.user_id !== newUserId) {
      const isAvailable = await checkUserIdAvailability(newUserId);
      if (!isAvailable) {
        return { success: false, error: '이미 사용 중인 아이디입니다.' };
      }
    }
    
    // 아이디 업데이트
    const { data, error } = await supabase
      .from('profiles')
      .update({ user_id: newUserId, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('업데이트 에러:', error);
      throw error;
    }
    
    return { success: true, data, error: null };
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
    
    // 1. profiles 테이블에서 사용자 데이터 삭제
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);
    
    if (profileError) {
      console.error('프로필 삭제 에러:', profileError);
    }
    
    // 2. user_stats 테이블에서 데이터 삭제 (있다면)
    const { error: statsError } = await supabase
      .from('user_stats')
      .delete()
      .eq('user_id', user.id);
    
    if (statsError) {
      console.error('통계 삭제 에러:', statsError);
    }
    
    // 3. challenge_history 테이블에서 데이터 삭제 (있다면)
    const { error: challengeError } = await supabase
      .from('challenge_history')
      .delete()
      .eq('user_id', user.id);
    
    if (challengeError) {
      console.error('챌린지 기록 삭제 에러:', challengeError);
    }
    
    // 4. localStorage 데이터 모두 삭제
    localStorage.clear();
    
    // 5. 계정 삭제 (Supabase Auth)
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
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(); // single() 대신 maybeSingle() 사용
    
    // 프로필이 없는 경우 생성
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