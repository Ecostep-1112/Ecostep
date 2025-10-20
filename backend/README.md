# Ecostep Backend API

백엔드 API 서버 - Railway에 배포용

## 환경 변수 설정

Railway에서 다음 환경 변수를 설정해야 합니다:

```
VITE_CLAUDE_API_KEY=your_claude_api_key
PORT=5176 (Railway가 자동으로 설정)
```

## 로컬 실행

```bash
# 백엔드 폴더로 이동
cd backend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 서버 실행
npm start
```

## Railway 배포

1. Railway 프로젝트 생성
2. GitHub 리포지토리 연결
3. Root Directory를 `backend`로 설정
4. 환경 변수 설정 (VITE_CLAUDE_API_KEY)
5. 자동 배포 완료

## API 엔드포인트

- `GET  /` - 서버 상태 확인
- `GET  /api/health` - Health check
- `POST /api/chatbot` - 챗봇 응답
- `POST /api/environmental-tip` - 환경 팁 생성
- `POST /api/validate-plastic-challenge` - 플라스틱 챌린지 검증
- `POST /api/classify-plastic-item` - 플라스틱 아이템 분류
- `POST /api/validate-plastic-item` - 플라스틱 아이템 무게 계산
