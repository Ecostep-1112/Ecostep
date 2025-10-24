# Ecostep 데이터베이스 초기 데이터

## 📋 개요

Ecostep 프로젝트의 Supabase 데이터베이스 초기 데이터 삽입 스크립트입니다.

## 📁 파일 구조

```
database/
├── ecostep_schema.sql          # 데이터베이스 스키마 정의
├── add_item_name_column.sql    # item_name 컬럼 추가 (스키마 수정)
├── store_data.sql              # 상점 데이터 (물고기, 장식품, 배경)
├── places_data.sql             # 제로웨이스트 맵 장소 데이터
├── initial_data.sql            # 통합 실행 파일 (위 3개 포함)
└── README.md                   # 이 파일
```

## 🗄️ 데이터베이스 구조

### store 테이블 (통합)
- **item_id** (PK, TEXT): 영문 식별자 (fish_1, decoration_1, background_1)
- **item_name** (TEXT): 한글 표시명 (코리도라스, 해초, 브론즈 어항)
- **category** (ENUM): Fish, Decoration, Background
- **price** (INTEGER): 가격 (포인트)
- **rank** (ENUM): Bronze, Silver, Gold, Platinum

### places 테이블
- **latitude** (FLOAT): 위도
- **longitude** (FLOAT): 경도
- **name** (TEXT): 장소명
- **tag** (VARCHAR): 태그
- **description** (TEXT): 설명

## 🚀 실행 방법

### 📌 필수: 최초 설정 (순서대로 실행)

#### 1단계: 데이터베이스 스키마 생성
Supabase SQL Editor에서 실행:
```sql
-- ecostep_schema.sql 전체 실행
-- 테이블 생성 + 인덱스 + 기본 RLS 정책
```

#### 2단계: 통합 store 테이블로 마이그레이션
store 테이블을 통합 테이블로 변경 (category enum 사용):
```sql
-- 기존 분리된 테이블 삭제
DROP TABLE IF EXISTS store_fish CASCADE;
DROP TABLE IF EXISTS store_decoration CASCADE;
DROP TABLE IF EXISTS store_background CASCADE;

-- 통합 store 테이블 생성
CREATE TYPE Store_type AS ENUM ('Fish', 'Decoration', 'Background');
CREATE TYPE Rank AS ENUM ('Bronze', 'Silver', 'Gold', 'Platinum');

CREATE TABLE store (
    item_id VARCHAR(300) PRIMARY KEY,
    item_name TEXT NOT NULL,
    category Store_type NOT NULL,
    price INTEGER NOT NULL,
    rank Rank NOT NULL
);
```

#### 3단계: 초기 데이터 삽입 + 개발용 RLS 설정 (권장)
Supabase SQL Editor에서 실행:
```sql
-- initData.sql 전체 실행
-- ✅ RLS 정책을 개발 모드로 변경 (공개 접근 허용)
-- ✅ 물고기 12개 삽입
-- ✅ 장식품 12개 삽입
-- ✅ 배경 4개 삽입
-- ✅ 제로웨이스트 장소 20개 삽입
```

**왜 initData.sql이 필요한가?**
- 현재 앱은 `localStorage` 기반 userId를 사용 (Supabase Auth 미사용)
- RLS (Row Level Security)가 활성화되면 `auth.uid()`가 없어서 데이터 접근 불가
- `initData.sql`은 개발 단계에서 공개 접근을 허용하는 RLS 정책을 설정합니다

---

### 방법 2: 개별 실행 (고급)

특정 데이터만 다시 삽입하거나 수정할 때 사용합니다.

#### 상점 데이터만 삽입/재삽입
```sql
-- store_data.sql 실행
-- 물고기, 장식품, 배경 데이터 삽입
-- DELETE 문이 포함되어 있어 재실행 가능
```

#### 장소 데이터만 삽입/재삽입
```sql
-- places_data.sql 실행
-- 제로웨이스트 맵 장소 데이터 삽입
-- DELETE 문이 포함되어 있어 재실행 가능
```

---

## 📊 삽입되는 데이터

### 🐠 물고기 (Fish) - 12개

| item_id | item_name | rank | price |
|---------|-----------|------|-------|
| fish_1 | 코리도라스 | Bronze | 200 |
| fish_2 | 체리바브 | Bronze | 300 |
| fish_3 | 네온테트라 | Bronze | 400 |
| fish_4 | 아피스토그라마 | Silver | 600 |
| fish_5 | 람시클리드 | Silver | 700 |
| fish_6 | 구피 | Silver | 800 |
| fish_7 | 엔젤피쉬 | Gold | 1200 |
| fish_8 | 킬리피쉬 | Gold | 1300 |
| fish_9 | 베타 | Gold | 1400 |
| fish_10 | 디스커스 | Platinum | 2000 |
| fish_11 | 만다린피쉬 | Platinum | 2200 |
| fish_12 | 아로와나 | Platinum | 2500 |

### 🪨 장식품 (Decoration) - 12개

| item_id | item_name | rank | price |
|---------|-----------|------|-------|
| decoration_1 | 해초 | Bronze | 150 |
| decoration_2 | 용암석 | Bronze | 250 |
| decoration_3 | 작은 동굴 | Bronze | 350 |
| decoration_4 | 산호 | Silver | 500 |
| decoration_5 | 드리프트 우드 | Silver | 600 |
| decoration_6 | 조개 껍질 | Silver | 700 |
| decoration_7 | 그리스 신전 | Gold | 1000 |
| decoration_8 | 보물 상자 | Gold | 1100 |
| decoration_9 | 해적선 | Gold | 1200 |
| decoration_10 | 크리스탈 동굴 | Platinum | 1600 |
| decoration_11 | LED 해파리 | Platinum | 1800 |
| decoration_12 | 아틀란티스 유적 | Platinum | 2000 |

### 🖼️ 배경 (Background) - 4개

| item_id | item_name | rank | price |
|---------|-----------|------|-------|
| background_1 | 브론즈 어항 | Bronze | 0 |
| background_2 | 실버 어항 | Silver | 0 |
| background_3 | 골드 어항 | Gold | 0 |
| background_4 | 플래티넘 어항 | Platinum | 0 |

※ 배경은 랭크 업그레이드 시 자동 해금됩니다 (가격 0)

### 📍 제로웨이스트 장소 (places) - 20개

서울 지역별 제로웨이스트 매장 및 친환경 장소 20곳

---

## ⚠️ 주의사항

1. **재실행 가능**: `store_data.sql`과 `places_data.sql`은 DELETE 문이 포함되어 재실행 가능합니다.
2. **ENUM 타입**: category와 rank는 enum 타입이므로 대소문자를 정확히 지켜야 합니다.
   - category: `Fish`, `Decoration`, `Background`
   - rank: `Bronze`, `Silver`, `Gold`, `Platinum`
3. **RLS 정책**: 개발 단계에서는 `initData.sql`의 공개 접근 정책을 사용하세요.
4. **프로덕션 배포**: 실제 서비스 배포 시에는 반드시 `setup_supabase_auth.sql`을 실행하여 보안 정책으로 전환해야 합니다.

---

## 🔧 문제 해결

### ❌ "Could not find the table 'public.store_fish'" 오류

**원인**: 기존 분리된 테이블(store_fish, store_decoration, store_background)을 사용하는 코드가 남아있습니다.

**해결**:
1. `src/lib/database.js`에서 함수 수정 완료 (이미 수정됨)
2. Supabase에서 통합 store 테이블이 생성되었는지 확인

### ❌ "Could not find the table 'public.places'" 오류

**원인**: places 테이블이 생성되지 않았습니다.

**해결**: `initData.sql` 실행 (places 데이터 포함)

### ❌ User info가 저장되지 않음

**원인**: RLS 정책이 활성화되어 있고, localStorage 기반 userId는 `auth.uid()`와 매칭되지 않습니다.

**해결**: `initData.sql` 실행하여 개발용 공개 접근 정책 적용

**확인 방법**:
```sql
-- Supabase SQL Editor에서 실행
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_info';

-- "Public access for development" 정책이 있어야 함
```

### ❌ "new row violates row-level security policy" 오류

**원인**: RLS 정책이 INSERT를 차단하고 있습니다.

**해결 방법 1** (권장): `initData.sql` 실행
**해결 방법 2** (임시): RLS 비활성화 (보안 위험)
```sql
ALTER TABLE user_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_chal_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE zero_chal_data DISABLE ROW LEVEL SECURITY;
```

---

## 🔍 데이터 확인 쿼리

### 상점 데이터 확인
```sql
-- 전체 상점 아이템 수
SELECT COUNT(*) as total_items FROM store;

-- 카테고리별 아이템 수
SELECT category, COUNT(*) as count
FROM store
GROUP BY category;

-- 랭크별 아이템 수
SELECT rank, COUNT(*) as count
FROM store
GROUP BY rank;

-- 카테고리 + 랭크별 아이템 수
SELECT category, rank, COUNT(*) as count
FROM store
GROUP BY category, rank
ORDER BY category, rank;
```

### 장소 데이터 확인
```sql
-- 전체 장소 수
SELECT COUNT(*) as total_places FROM places;

-- 태그별 장소 수
SELECT tag, COUNT(*) as count
FROM places
GROUP BY tag
ORDER BY count DESC;
```

---

## 🔗 관련 파일

- **Frontend**: `src/lib/database.js` - Supabase 쿼리 함수
- **Components**: `src/components/FishIcons.jsx` - 물고기 SVG 아이콘
- **Components**: `src/components/DecorationIcons.jsx` - 장식품 SVG 아이콘
- **Data**: `src/data/fishData.json` - 물고기 정보 JSON

---

## 📝 마이그레이션 이력

- **2025-01-11**: 초기 데이터 스크립트 작성
  - store 테이블 통합 (store_fish, store_decoration, store_background → store)
  - item_id를 한글 → 영문 식별자로 변경
  - item_name 컬럼 추가 (한글 표시명)
  - enum 타입 적용 (category, rank)
  - 개발용 RLS 정책 추가 (localStorage 기반 userId 지원)

---

## 🔐 보안 및 인증

### 현재 상태 (개발 단계)
- ✅ localStorage 기반 userId 사용
- ✅ RLS 활성화 + 공개 접근 정책 (개발용)
- ⏳ Supabase Auth 미적용

### 프로덕션 배포 전 필수 작업

1. **Supabase Auth 통합**
   ```sql
   -- Supabase SQL Editor에서 실행
   -- database/setup_supabase_auth.sql 전체 실행
   ```

2. **프론트엔드 수정**
   - `src/contexts/AuthContext.jsx` 사용
   - localStorage userId → `auth.uid()` 전환
   - 로그인/회원가입 페이지 구현

3. **상세 가이드**
   - `docs/SUPABASE_AUTH_MIGRATION.md` 참조

**⚠️ 경고**: 개발용 공개 접근 정책은 프로덕션에서 절대 사용하지 마세요!
