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
- **Version Control**: Git + GitHub (repository: https://github.com/Ecostep-1112/Ecostep)
- **Future**: Will migrate to Expo/React Native for App Store deployment

## Project Setup
- **Development Server**: `npm run dev`
- **Build**: `npm run build`
- **Environment Variables**: Configured in `.env.local`
  - Supabase URL and API keys are set up
  - Do not commit `.env.local` file (already in .gitignore)

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
5. Once design is finalized (~80%), migrate to Expo for native app

## 작업 
1. 작업을 진행하기 전에, 항상 한 번 더 생각해보고, 단계별로 차근차근 순차적으로 진행해주세요. 
2. 관련 파일을 먼저 확인하고 진행해주세요. 
3. 다른 얘기 없으면, 계속해서 이전 작업을 이어서 수정하는 겁니다. 
4. 요청한 사항 이외에 것을 과하게 수정하지 말아주세요. 즉, 실수로 다른 부분의 코드를 건드리지 않도록 해주세요. 
5. 항상 맞춤법과 띄어쓰기를 검토해서 반영해주세요. 