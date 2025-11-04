# Ecostep 인증 시스템

이 문서는 Ecostep 프로젝트의 Supabase OAuth 인증 시스템 구현 상태를 설명합니다.

## 개요

**현재 구현 상태:**
- Supabase OAuth 로그인 (Google, Kakao, Apple)
- 자동 프로필 생성
- 인증 상태 관리
- 모바일 앱 Deep link 처리

---

## 구현된 인증 기능

### 1. OAuth 로그인

지원하는 소셜 로그인:
- Google
- Kakao
- Apple

**구현 파일**: `src/lib/auth.js`

**주요 함수**:
```javascript
// Google 로그인
export const signInWithGoogle = async () => { ... }

// Kakao 로그인
export const signInWithKakao = async () => { ... }

// Apple 로그인
export const signInWithApple = async () => { ... }

// 로그아웃
export const signOut = async () => { ... }

// 현재 사용자 정보
export const getCurrentUser = async () => { ... }
```

---

### 2. 로그인 페이지

**파일**: `src/pages/auth/Login.jsx`

기능:
- Google, Kakao, Apple 로그인 버튼
- 로그인 없이 둘러보기 옵션
- 에러 처리
- 로딩 상태 표시

```jsx
<Login onLogin={() => setIsLoggedIn(true)} />
```

---

### 3. 인증 상태 관리

**파일**: `src/App.jsx`

구현 방식:
- `onAuthStateChange` 리스너로 인증 상태 감지
- 로그인 시 자동 프로필 생성
- 세션 유지
- 로그아웃 처리

**주요 로직**:
```javascript
useEffect(() => {
  // 초기 세션 확인
  const checkUser = async () => {
    const { user } = await getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);

      // 프로필 생성 또는 업데이트
      await createOrUpdateUserProfile(user);
    }
  };

  checkUser();

  // 인증 상태 변경 리스너
  const { data: { subscription } } = onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      setCurrentUser(session.user);
      setIsLoggedIn(true);
    } else if (event === 'SIGNED_OUT') {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  });

  return () => subscription?.unsubscribe();
}, []);
```

---

### 4. 모바일 앱 Deep Link

**파일**: `src/App.jsx`

Capacitor를 사용한 OAuth callback 처리:

```javascript
useEffect(() => {
  const platform = Capacitor.getPlatform();

  if (platform === 'android' || platform === 'ios') {
    // 앱 URL 리스너 설정
    const listener = CapacitorApp.addListener('appUrlOpen', async (data) => {
      if (data.url.includes('callback')) {
        const url = new URL(data.url);

        if (url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken) {
            // Supabase 세션 설정
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
          }
        }
      }
    });

    return () => listener.remove();
  }
}, []);
```

---

### 5. 자동 프로필 생성

**파일**: `src/lib/auth.js`

로그인 시 user_info 테이블에 자동으로 프로필 생성:

```javascript
export const createOrUpdateUserProfile = async (user) => {
  // 기존 프로필 확인
  const { data: existingProfile } = await supabase
    .from('user_info')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingProfile) {
    return { profile: existingProfile, error: null };
  }

  // 프로필이 없으면 트리거를 통해 자동 생성 대기
  await new Promise(resolve => setTimeout(resolve, 500));

  const { data: retryProfile } = await supabase
    .from('user_info')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return { profile: retryProfile, error: null };
};
```

---

## 데이터베이스 구조

### user_info 테이블

주요 컬럼:
- `user_id` (PK): Supabase Auth UUID
- `name`: 사용자 이름
- `email`: 이메일
- `phone_num`: 휴대폰 번호
- `point_current`: 현재 포인트
- `points_total`: 누적 포인트
- `rank`: 사용자 랭크
- `amount`: 플라스틱 목표량
- `plastic_saved`: 절약한 플라스틱량

### RLS 정책

Auth 기반 정책 적용:
- 사용자는 자신의 데이터만 조회/수정 가능
- 랭킹 조회를 위한 공개 읽기 정책

---

## Supabase 설정

### 1. OAuth 제공자 설정

Supabase Dashboard → Authentication → Providers에서 설정:

**Google:**
- Client ID 입력
- Client Secret 입력
- Redirect URL: `com.ecostep.app://callback` (모바일)

**Kakao:**
- Client ID 입력
- Client Secret 입력
- Redirect URL: `com.ecostep.app://callback` (모바일)

**Apple:**
- Services ID 입력
- Team ID 입력
- Key ID 입력
- Private Key 업로드
- Redirect URL: `com.ecostep.app://callback` (모바일)

### 2. Redirect URLs

Supabase Dashboard → Authentication → URL Configuration:

모바일 앱:
```
com.ecostep.app://callback
```

웹 개발:
```
http://localhost:5175/
```

---

## 환경 변수

`.env.local` 파일:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 보안 고려사항

1. **환경변수 보호**
   - `.env.local`은 git에 커밋하지 않음
   - `.gitignore`에 포함되어 있음

2. **RLS 정책**
   - Auth 기반 정책으로 사용자 데이터 보호
   - 공개 데이터는 최소화

3. **OAuth Redirect URL**
   - 승인된 URL만 사용
   - 프로덕션에서 http://localhost 제거

---

## 프로덕션 배포 체크리스트

- [ ] Supabase OAuth 제공자 설정 완료 (Google, Kakao, Apple)
- [ ] Redirect URL 설정 확인
- [ ] RLS 정책 검토
- [ ] 환경변수 프로덕션 설정
- [ ] 민감한 정보 보호 확인
- [ ] 로그인 플로우 테스트
- [ ] 모바일 앱 Deep link 테스트

---

## 문제 해결

### 로그인 후 리다이렉트 안됨

**원인**: Redirect URL 설정 오류

**해결**:
1. Supabase Dashboard에서 Redirect URL 확인
2. 모바일: `com.ecostep.app://callback` 추가
3. 웹: `http://localhost:5175/` 추가

### 프로필이 자동 생성되지 않음

**원인**: user_info 테이블 트리거 문제

**해결**:
1. Supabase SQL Editor에서 트리거 확인
2. `database/setup_supabase_auth.sql` 실행
3. 브라우저 콘솔에서 에러 로그 확인

### OAuth 제공자 에러

**원인**: OAuth 제공자 설정 오류

**해결**:
1. Supabase Dashboard에서 Provider 설정 확인
2. Client ID/Secret 확인
3. Redirect URL 확인

---

## 참고 자료

- **Supabase Auth 문서**: https://supabase.com/docs/guides/auth
- **Capacitor Deep Links**: https://capacitorjs.com/docs/guides/deep-links
- **프로젝트 파일**:
  - `src/lib/auth.js`: OAuth 로그인 함수
  - `src/pages/auth/Login.jsx`: 로그인 페이지
  - `src/App.jsx`: 인증 상태 관리
