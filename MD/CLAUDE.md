# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Ecostep is a mobile app concept that combines environmental protection with a fish-raising game. The app encourages users to track and reduce plastic usage while gamifying the experience through virtual fish care.

## Core Features

### Main Tabs
1. **Home Tab**: Fish aquarium display with plastic/CO2 savings stats
2. **Challenge Tab**: 
   - Habit challenges (e.g., "No plastic straws for a week")
   - Plastic usage tracking with weekly goals
3. **Rewards Tab**: Store for purchasing fish and aquarium customizations
4. **Community Tab**: Friend rankings and global leaderboards
5. **Settings Tab**: Profile and app configuration

### Key Components
- **Fish System**: 12 different fish types, unlock based on user rank
- **Aquarium Customization**: Colors, seaweed, decorations
- **Tracking System**: Records plastic item usage (bottles, cups, containers) with weight calculations
- **Progress Visualization**: Charts and progress bars for goals and achievements
- **Social Features**: Friend invites via KakaoTalk, ID search, rankings

## Design Requirements

### UI/UX Guidelines
- Modern, clean design suitable for mobile devices
- Dark mode should follow Toss app's color scheme and design
- Mobile-first design with phone frame borders for realistic preview
- Android and iOS compatible aspect ratios
- Use appropriate icons throughout the interface

### Screen Layout
- Header with app name, points, and profile icon
- Large rectangular aquarium area on home screen
- Tab navigation at bottom
- Progress bars for challenges and goals
- List views for rankings and past challenges

## Development Notes
- This is currently a concept/design phase project
- Focus on creating responsive mobile layouts
- Implement gamification elements to encourage environmental behavior
- Ensure smooth transitions between tabs and screens

## Technical Stack
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (connected and configured)
- **Mobile Deployment**: Capacitor (hybrid app framework)
- **Version Control**: Git + GitHub (repository: https://github.com/Ecostep-1112/Ecostep)

## Project Setup
- **Development Server**: `npm run dev`
- **Backend Server**: `npm run server`
- **Both Servers**: `npm run dev:all`
- **Build**: `npm run build`
- **Environment Variables**: Configured in `.env.local`
  - Supabase URL and API keys are set up
  - Claude API key for chatbot functionality
  - Kakao API key for KakaoTalk sharing (get from https://developers.kakao.com)
  - Naver Maps API credentials
  - Do not commit `.env.local` file (already in .gitignore)

## Capacitor Setup
Capacitor is used to convert this React web app into native iOS and Android apps.

### Installation
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

### Build & Sync
1. **Build web app**: `npm run build`
2. **Add platforms**:
   - iOS: `npx cap add ios`
   - Android: `npx cap add android`
3. **Sync web code**: `npx cap sync`
4. **Open in native IDE**:
   - iOS: `npx cap open ios` (opens Xcode)
   - Android: `npx cap open android` (opens Android Studio)

### Capacitor Plugins
- `@capacitor/preferences`: Local storage
- `@capacitor/storage`: Persistent key-value storage
- `@capacitor/splash-screen`: Native splash screen
- `@capacitor/status-bar`: Status bar customization
- `@capacitor/keyboard`: Keyboard behavior
- `@capacitor/share`: Native sharing (for KakaoTalk)

### Development Workflow
1. Develop and test in web browser (`npm run dev`)
2. When ready for mobile testing: `npm run build && npx cap sync`
3. Test on iOS/Android simulator or device
4. Iterate and repeat

### Important Notes
- Web code in `dist/` folder is copied to native projects
- Always run `npx cap sync` after `npm run build`
- Native code lives in `ios/` and `android/` folders
- Keep `capacitor.config.ts` updated with app settings

## Kakao API Setup
1. Visit https://developers.kakao.com
2. Create an application
3. Get your JavaScript API key
4. Add the key to `.env.local` as `VITE_KAKAO_API_KEY`
5. Register your domain (localhost:5175 for development) in Kakao console
6. Enable "카카오톡 공유" in your app settings

## Git Workflow
After making changes:
1. `git add .` - Stage changes
2. `git commit -m "Description of changes"` - Commit (간결하고 명확한 한글 커밋 메시지 작성)
3. `git push` - Push to GitHub

### Commit Message Guidelines
- **언어**: 한글로 작성
- **형식**: `type: 간단한 설명` (예: `feat: 새로운 기능 추가`, `fix: 버그 수정`, `style: 스타일 변경`)
- **금지사항**: 커밋 메시지에 "🤖 Generated with Claude Code" 또는 "Co-Authored-By: Claude" 등의 자동 생성 메시지를 추가하지 않음
- **승인 필요**: Push하기 전에 반드시 사용자의 승인을 받아야 함

## Database Integration
- Supabase client is configured at `src/lib/supabase.js`
- Use `import { supabase } from '@/lib/supabase'` to access database
- Authentication and database operations ready to implement

## Development Priorities
1. Complete UI/UX design in React (web)
2. Implement core features and game mechanics
3. Set up database schema in Supabase
4. Test with users via web browser
5. Once design is finalized (~80%), build with Capacitor for iOS/Android deployment

## Authentication & Data Storage

### Current Implementation
- **Supabase OAuth**: Google, Kakao, Apple 소셜 로그인 구현 완료
- **인증 관리**: App.jsx에서 직접 관리 (AuthContext 미사용)
- **자동 프로필 생성**: 로그인 시 user_info 테이블에 자동 생성
- **Deep Link**: 모바일 앱에서 OAuth callback 처리

### Authentication Files
- `src/lib/auth.js`: OAuth 로그인 함수
- `src/pages/auth/Login.jsx`: 로그인 페이지
- `src/App.jsx`: 인증 상태 리스너 및 관리

### Data Storage Strategy

1. **Cloud Storage (Supabase)**
   - User authentication (OAuth)
   - User profiles (user_info 테이블)
   - Challenge completion records
   - Points and rankings
   - Friend relationships
   - Plastic usage history

2. **Local Storage (localStorage)**
   - App settings (theme, language, notifications)
   - Aquarium configuration (fish, decorations)
   - Challenge preferences
   - Temporary cache

3. **Hybrid Strategy**
   - Local: User preferences, offline functionality
   - Cloud: Critical user data, cross-device sync
   - Sync: Online/offline data synchronization

### Data Classification
- **Cloud (Supabase)**: User account, social features, leaderboards, challenge records
- **Local (localStorage)**: Theme, language, notifications, aquarium layout
- **Hybrid**: Challenge progress (local cache + cloud backup)

## Claude API Integration

### Current Features Using Claude API
1. **Customer Service Chatbot** (`src/pages/more/ChatBot.jsx`)
2. **Environmental Tips Generation**
3. **Plastic Weight Calculation** (`src/utils/validatePlastic.js`, `src/utils/validatePlasticItem.js`)

### API Configuration
- Claude API key stored in `.env.local` as `VITE_CLAUDE_API_KEY`
- Service layer at `src/services/claudeService.js`
- Backend proxy server for API calls (`server.js`)

## UI/UX Guidelines

### Keyboard Input Handling
모바일 환경에서 키보드 입력이 필요한 페이지는 특별한 처리가 필요합니다.

- **가이드 문서**: `MD/KEYBOARD_INPUT_GUIDE.md` 참조
- **핵심 규칙**: `fixed inset-0` 사용하여 키보드 올라올 때 배경 고정
- **적용 파일**:
  - `src/pages/more/ChatBot.jsx`: 고객센터 챗봇
  - `src/pages/settings/ProfileScreen.jsx`: 프로필 편집
  - `src/pages/community/SearchFriends.jsx`: 친구 검색
  - `src/pages/community/FriendsList.jsx`: 친구 목록 검색
  - `src/pages/challenge/Challenge.jsx`: 커스텀 챌린지/플라스틱 입력

### Mobile Considerations
- 플랫폼 감지: `Capacitor.getPlatform()` 사용
- 키보드 이벤트: `Keyboard.addListener()` 사용
- Safe Area 처리: iOS notch 및 Android navigation bar 고려
- 하단 네비게이션: 키보드 올라올 때 자동 숨김

## Recent Updates

### 2025-10
1. **OAuth 로그인 구현**
   - Google, Kakao, Apple 소셜 로그인 추가
   - 자동 프로필 생성 및 Deep link 처리
   - 로그인 페이지 및 인증 관리 구현

### 2025-11
1. **키보드 입력 UI 개선**
   - 모바일 키보드 올라올 때 배경 축소 문제 해결
   - 키보드 입력 가이드라인 문서 작성
   - 모든 입력 페이지에 일관된 패턴 적용

2. **문서화**
   - `MD/KEYBOARD_INPUT_GUIDE.md`: 키보드 입력 UI 가이드
   - `MD/AUTHENTICATION.md`: 인증 시스템 구현 문서
   - `MD/BUILD_MOBILE.md`: 모바일 빌드 가이드
   - `MD/README.md`: 데이터베이스 초기 데이터 가이드

## 작업
1. 작업을 진행하기 전에, 항상 한 번 더 생각해보고, 단계별로 차근차근 순차적으로 진행해주세요.
2. 관련 파일을 먼저 확인하고 진행해주세요.
3. 다른 얘기 없으면, 계속해서 이전 작업을 이어서 수정하는 겁니다.
4. 요청한 사항 이외에 것을 과하게 수정하지 말아주세요. 즉, 실수로 다른 부분의 코드를 건드리지 않도록 해주세요.
5. 항상 맞춤법과 띄어쓰기를 검토해서 반영해주세요.
6. 항상 수정을 완료 했으면 변경 내용을 간략히 정리해서 보여주세요.
7. 제 허락 없이, push하지 마세요.
8. **커밋 메시지**: "🤖 Generated with Claude Code" 또는 "Co-Authored-By: Claude" 같은 자동 생성 메시지를 절대 추가하지 마세요. 간결한 한글 커밋 메시지만 작성해주세요.
9. **이모지 사용 금지**: 응답, 코드 설명, 커밋 메시지 등 모든 커뮤니케이션에서 이모지/아이콘을 사용하지 마세요. 100% 필수적인 경우(코드에 이미 이모지가 포함되어 있거나 사용자가 명시적으로 요청한 경우)에만 예외적으로 사용하세요. 