# Claude 작업 규칙

## 중요 규칙 (최우선)

### 커밋 메시지 규칙
- ❌ **절대 금지**: 커밋 메시지에 이모지 사용 금지
- ❌ **절대 금지**: 커밋 메시지에 Claude 서명 추가 금지
  - "Generated with Claude Code" 사용 금지
  - "Co-Authored-By: Claude" 사용 금지
- ✅ **사용**: 간결하고 명확한 한국어 커밋 메시지
- ✅ **형식**: `type: 간단한 설명` (예: `fix: 버그 수정`, `feat: 새 기능 추가`)

### 커밋 타입
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 코드
- `chore`: 빌드 업무, 패키지 매니저 설정 등

### 설정
- `includeCoAuthoredBy: false` - Claude 서명 자동 추가 비활성화

### Git Push 규칙
- 사용자가 "push 해주세요" 명령 시, 반드시 다음 내용 포함:
  - 어떤 변경 사항이 push 되는지 설명
  - 커밋 메시지 요약
  - 영향받는 파일 목록
  - 브랜치 정보

## 예시

### 좋은 커밋 메시지
```
feat: 어항 장식품 회전 기능 추가
fix: 물고기 경계 충돌 버그 수정
perf: React.memo를 사용한 렌더링 최적화
```

### 나쁜 커밋 메시지
```
✨ feat: 새 기능 추가 (이모지 사용 금지!)
fix: 버그 수정

🤖 Generated with Claude Code (서명 금지!)
```
