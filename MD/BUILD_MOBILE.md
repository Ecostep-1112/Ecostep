# Ecostep 모바일 앱 빌드 가이드

## 1. 환경 확인
```bash
# Node.js 버전 확인 (16 이상 필요)
node --version

# 패키지 설치 확인
npm install
```

## 2. Production 빌드
```bash
# 웹 앱 빌드 (dist/ 폴더 생성)
npm run build
```

**이 단계가 중요합니다!**
- `dist/` 폴더에 최적화된 정적 파일 생성됨
- 모든 환경변수(.env.local)가 빌드에 포함됨
- Supabase, Railway API URL이 코드에 삽입됨

## 3. Capacitor 동기화
```bash
# dist/ 폴더를 Android/iOS 프로젝트로 복사
npx cap sync android
```

이 명령어는:
- `dist/` 폴더 → `android/app/src/main/assets/public/` 복사
- Capacitor 플러그인 업데이트
- 네이티브 프로젝트 설정 동기화

## 4. Android Studio에서 빌드
```bash
# Android Studio 열기
npx cap open android
```

Android Studio에서:
1. **Build > Clean Project** (이전 빌드 제거)
2. **Build > Rebuild Project** (전체 재빌드)
3. **Build > Generate Signed Bundle / APK**
4. AAB 파일 생성 및 설치

## 주의사항

### ❌ 하지 말아야 할 것
- `npm run dev` 실행 후 바로 `npx cap sync` (개발 서버는 모바일에서 접근 불가)
- `capacitor.config.json`에 `server.url` 추가 (production 빌드에서는 불필요)

### ✅ 해야 할 것
- **항상** `npm run build` 먼저 실행
- 코드 변경 시마다: `npm run build` → `npx cap sync`
- 환경변수 변경 시: `.env.local` 수정 → `npm run build` → `npx cap sync`

## 데이터 흐름

모바일 앱에서:
```
앱 (dist/ 정적 파일)
  ↓
Supabase API (직접 연결)
  - https://hezalpeneyfvslebhlbu.supabase.co
  - 인증, 데이터베이스 등

Backend API (Claude API 프록시)
  - https://ecostep-production.up.railway.app
  - ChatBot 기능용
```

## 트러블슈팅

### "localhost에 연결할 수 없음"
→ `npm run build`를 실행하지 않았거나 `dist/` 폴더가 비어있음
→ 해결: `npm run build` → `npx cap sync android` 재실행

### "환경변수가 undefined"
→ `.env.local` 파일이 없거나 `npm run build` 재실행 필요
→ 해결: `.env.local` 확인 → `npm run build` 재실행

### "OAuth 로그인 후 응답 없음"
→ Supabase redirect URL 설정 확인
→ `com.ecostep.app://callback` 추가되었는지 확인
