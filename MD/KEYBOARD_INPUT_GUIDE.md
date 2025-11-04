# 키보드 입력 UI 가이드라인

## 문제점
모바일 환경에서 키보드가 올라올 때, `h-full` 또는 `flex-1`을 사용한 컨테이너는 뷰포트 크기가 변경되어 배경이 축소되거나 색상이 달라 보이는 문제가 발생합니다.

## 해결 방법

### 1. 전체 화면 페이지 (Full Screen Pages)

키보드 입력이 필요한 전체 화면 페이지는 **`fixed inset-0`**를 사용합니다.

#### ❌ 잘못된 예시
```jsx
const MyPage = ({ isDarkMode }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';

  return (
    <div className={`h-full ${bgColor}`}>  {/* ❌ 키보드가 올라오면 배경 축소 */}
      <input type="text" placeholder="입력하세요" />
    </div>
  );
};
```

#### ✅ 올바른 예시
```jsx
const MyPage = ({ isDarkMode }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';

  return (
    <div className={`fixed inset-0 ${bgColor}`}>  {/* ✅ 키보드와 무관하게 배경 고정 */}
      <input type="text" placeholder="입력하세요" />
    </div>
  );
};
```

### 2. 모달/오버레이 화면 (Modal/Overlay Screens)

입력 필드가 있는 모달이나 오버레이는 **`fixed inset-0`**와 **높은 z-index**를 사용합니다.

#### ✅ 올바른 예시
```jsx
const EditModal = ({ isDarkMode, onClose }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`fixed inset-0 z-50 ${bgColor}`}>  {/* ✅ 전체 화면 고정 */}
      {/* 헤더 */}
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={onClose}>닫기</button>
        <h2 className={textColor}>제목</h2>
      </div>

      {/* 입력 영역 */}
      <div className="p-4">
        <input
          type="text"
          placeholder="입력하세요"
          className={`w-full px-4 py-2 ${bgColor} ${textColor} border ${borderColor}`}
          autoFocus
        />
      </div>
    </div>
  );
};
```

### 3. 채팅/메시지 화면

채팅처럼 메시지 목록과 하단 입력란이 있는 경우:

```jsx
const ChatScreen = ({ isDarkMode }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`fixed inset-0 ${bgColor} flex flex-col overflow-hidden`}>
      {/* 헤더 - Sticky */}
      <div className={`sticky top-0 z-10 ${bgColor} border-b ${borderColor} p-4`}>
        <h1>채팅</h1>
      </div>

      {/* 메시지 영역 - 스크롤 가능, 여백 최소화 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-2">
        {/* 메시지 목록 */}
      </div>

      {/* 입력 영역 - Sticky Bottom, 여백 최소화 */}
      <div className={`sticky bottom-0 z-10 ${bgColor} py-1.5 px-4 border-t ${borderColor}`}>
        <textarea
          placeholder="메시지를 입력하세요"
          className={`w-full ${inputBg} rounded-2xl px-3 py-1.5`}
        />
      </div>
    </div>
  );
};
```

### 4. 여백(Padding) 처리

키보드와 입력란 사이의 여백을 최소화하여 자연스럽게 만듭니다.

#### 메시지 영역
- 상단: `pt-4` (적당한 여백)
- 하단: `pb-2` (최소한의 여백, 키보드와의 간격 줄임)

#### 입력 영역
- 상하: `py-1.5` (최소한의 여백)

```jsx
{/* 메시지 영역 */}
<div className="px-4 pt-4 pb-2">  {/* ✅ 하단 여백 최소화 */}
  {/* 내용 */}
</div>

{/* 입력 영역 */}
<div className="py-1.5 px-4">  {/* ✅ 상하 여백 최소화 */}
  <input />
</div>
```

## 체크리스트

새로운 입력 기능을 추가할 때 다음을 확인하세요:

- [ ] 루트 컨테이너에 `fixed inset-0` 사용
- [ ] 모달/오버레이는 `z-50` 이상 사용
- [ ] 배경색(`bgColor`)이 전체 화면에 적용되는지 확인
- [ ] 키보드 주변 여백을 최소화했는지 확인 (`py-1.5`, `pb-2` 등)
- [ ] 입력 필드에 `autoFocus` 속성 추가 고려
- [ ] 다크모드와 라이트모드 모두에서 테스트

## 실제 적용 예시

### 고객센터 챗봇
```jsx
// src/pages/more/ChatBot.jsx
return (
  <div className={`fixed inset-0 ${bgColor} flex flex-col overflow-hidden`}>
    {/* ... */}
  </div>
);
```

### 프로필 편집
```jsx
// src/pages/settings/ProfileScreen.jsx
return (
  <div className={`fixed inset-0 z-50 ${bgColor}`}>
    {/* ... */}
  </div>
);
```

### 친구 검색
```jsx
// src/pages/community/SearchFriends.jsx
return (
  <div className={`fixed inset-0 ${bgColor} overflow-y-auto`}>
    {/* ... */}
  </div>
);
```

### 챌린지 페이지
```jsx
// src/pages/challenge/Challenge.jsx
return (
  <div className={`fixed inset-0 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
    {/* ... */}
  </div>
);
```

## 주의사항

1. **`absolute`는 사용하지 않기**: `absolute inset-0`는 부모 요소의 크기에 영향을 받으므로 키보드가 올라올 때 문제가 발생합니다.

2. **`h-full`/`flex-1`은 피하기**: 뷰포트 높이가 변경될 때 컨테이너 크기도 변경됩니다.

3. **z-index 관리**:
   - 일반 페이지: `z-10` 미만
   - 모달/오버레이: `z-50` 이상
   - 드롭다운/팝업: `z-20~40`

4. **스크롤 처리**:
   - 전체 화면이 스크롤되어야 하면 루트에 `overflow-y-auto`
   - 내부 영역만 스크롤되면 해당 영역에 `overflow-y-auto`

## 요약

```jsx
// 기본 템플릿
const InputPage = ({ isDarkMode, onBack }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`fixed inset-0 ${bgColor}`}>
      {/* 헤더 */}
      <div className={`p-4 border-b ${borderColor}`}>
        <button onClick={onBack}>뒤로</button>
        <h1 className={textColor}>제목</h1>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4">
        <input
          type="text"
          placeholder="입력하세요"
          className={`w-full px-4 py-2 ${inputBg} ${textColor} border ${borderColor}`}
          autoFocus
        />
      </div>
    </div>
  );
};
```
