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
2. `git commit -m "Description of changes"` - Commit
3. `git push` - Push to GitHub

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

## Local Storage Strategy

### Current Implementation (Web Prototype)
- **localStorage**: Used for web browser prototype phase
- **Purpose**: Quick development and testing of core features
- **Scope**: App settings, aquarium configuration, challenge preferences

### Production App Migration Plan
When building with Capacitor for iOS/Android:

1. **Local Storage (Device)**
   - **Capacitor Preferences**: For app settings and user preferences
   - **Capacitor Storage**: Key-value storage API (replaces localStorage)
   - **Capacitor SecureStorage**: For sensitive data (tokens, credentials)
   - **Native**: UserDefaults (iOS) / SharedPreferences (Android) via Capacitor plugins

2. **Cloud Storage (Database)**
   - User profiles and authentication
   - Challenge completion records
   - Points and rankings
   - Friend relationships
   - Plastic usage history

3. **Hybrid Strategy**
   - Local: User preferences, offline functionality (Capacitor Storage)
   - Cloud: Critical user data, cross-device sync (Supabase)
   - Sync: Online/offline data synchronization

### Data Classification
- **Local Only**: Theme, language, notifications, aquarium layout
- **Cloud Only**: User account, social features, leaderboards
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

## 작업
1. 작업을 진행하기 전에, 항상 한 번 더 생각해보고, 단계별로 차근차근 순차적으로 진행해주세요.
2. 관련 파일을 먼저 확인하고 진행해주세요.
3. 다른 얘기 없으면, 계속해서 이전 작업을 이어서 수정하는 겁니다.
4. 요청한 사항 이외에 것을 과하게 수정하지 말아주세요. 즉, 실수로 다른 부분의 코드를 건드리지 않도록 해주세요.
5. 항상 맞춤법과 띄어쓰기를 검토해서 반영해주세요.
6. 항상 수정을 완료 했으면 변경 내용을 간략히 정리해서 보여주세요. 