# Supabase RLS (Row Level Security) 정책 가이드

코드 분석 결과, 다음과 같은 RLS 정책이 필요합니다.

## 🔐 필수 RLS 정책

### 1. `user_info` 테이블
**용도**: 사용자 프로필 및 통계 정보

```sql
-- 읽기: 모든 인증된 사용자가 다른 사용자 정보 조회 가능 (랭킹, 친구 정보)
CREATE POLICY "user_info_select" ON user_info
FOR SELECT TO authenticated
USING (true);

-- 삽입: 본인의 프로필만 생성 가능
CREATE POLICY "user_info_insert" ON user_info
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- 업데이트: 본인의 프로필만 수정 가능
CREATE POLICY "user_info_update" ON user_info
FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- 삭제: 본인의 프로필만 삭제 가능
CREATE POLICY "user_info_delete" ON user_info
FOR DELETE TO authenticated
USING (auth.uid()::text = user_id);
```

---

### 2. `user_item` 테이블
**용도**: 사용자가 구매한 아이템

```sql
-- 읽기: 본인의 구매 아이템만 조회
CREATE POLICY "user_item_select" ON user_item
FOR SELECT TO authenticated
USING (auth.uid()::text = user_id);

-- 삽입: 본인의 구매 아이템만 추가
CREATE POLICY "user_item_insert" ON user_item
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- 업데이트: 필요 없음 (구매 후 변경 불가)
-- 삭제: 필요 없음 (구매 취소 불가)
```

---

### 3. `user_friend` 테이블
**용도**: 친구 관계

```sql
-- 읽기: 본인과 관련된 친구 관계만 조회
CREATE POLICY "user_friend_select" ON user_friend
FOR SELECT TO authenticated
USING (
  auth.uid()::text = user_id
  OR auth.uid()::text = friend_id
);

-- 삽입: 본인이 포함된 친구 관계만 추가
CREATE POLICY "user_friend_insert" ON user_friend
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid()::text = user_id
  OR auth.uid()::text = friend_id
);

-- 삭제: 본인이 포함된 친구 관계만 삭제
CREATE POLICY "user_friend_delete" ON user_friend
FOR DELETE TO authenticated
USING (
  auth.uid()::text = user_id
  OR auth.uid()::text = friend_id
);
```

---

### 4. `daily_chal_data` 테이블
**용도**: 데일리 챌린지 기록

```sql
-- 읽기: 본인의 챌린지 기록만 조회
CREATE POLICY "daily_chal_data_select" ON daily_chal_data
FOR SELECT TO authenticated
USING (auth.uid()::text = user_id);

-- 삽입: 본인의 챌린지 기록만 추가
CREATE POLICY "daily_chal_data_insert" ON daily_chal_data
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- 업데이트: 본인의 챌린지 기록만 수정
CREATE POLICY "daily_chal_data_update" ON daily_chal_data
FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
```

---

### 5. `zero_chal_data` 테이블
**용도**: 제로 챌린지(플라스틱 사용 기록)

```sql
-- 읽기: 본인의 플라스틱 기록만 조회
CREATE POLICY "zero_chal_data_select" ON zero_chal_data
FOR SELECT TO authenticated
USING (auth.uid()::text = user_id);

-- 삽입: 본인의 플라스틱 기록만 추가
CREATE POLICY "zero_chal_data_insert" ON zero_chal_data
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- 업데이트: 본인의 플라스틱 기록만 수정
CREATE POLICY "zero_chal_data_update" ON zero_chal_data
FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
```

---

### 6. `store` 테이블
**용도**: 상점 아이템 (읽기 전용)

```sql
-- 읽기: 모든 인증된 사용자가 상점 아이템 조회 가능
CREATE POLICY "store_select" ON store
FOR SELECT TO authenticated
USING (true);

-- 삽입/업데이트/삭제: 관리자만 가능 (service_role)
-- RLS 정책 불필요, 클라이언트에서 접근 불가
```

---

### 7. `places` 테이블
**용도**: 제로 웨이스트 장소 (읽기/쓰기)

```sql
-- 읽기: 모든 인증된 사용자가 장소 조회 가능
CREATE POLICY "places_select" ON places
FOR SELECT TO authenticated
USING (true);

-- 삽입: 모든 인증된 사용자가 장소 추가 가능 (사용자 제보)
CREATE POLICY "places_insert" ON places
FOR INSERT TO authenticated
WITH CHECK (true);

-- 업데이트/삭제: 관리자만 가능 (service_role)
-- 또는 본인이 추가한 장소만 수정/삭제 (created_by 필드 필요)
```

---

## ✅ RLS 활성화 확인

각 테이블에서 RLS를 활성화해야 합니다:

```sql
ALTER TABLE user_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_friend ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_chal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE zero_chal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE store ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
```

---

## 🧪 RLS 정책 테스트

### 1. Supabase Dashboard에서 확인
1. Supabase Dashboard → Authentication → Policies
2. 각 테이블의 정책 목록 확인
3. 누락된 정책이 있는지 체크

### 2. SQL 쿼리로 확인
```sql
-- 모든 테이블의 RLS 활성화 상태 확인
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 특정 테이블의 정책 목록 확인
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_info';
```

---

## 🚨 보안 체크리스트

- [ ] 모든 테이블에 RLS 활성화됨
- [ ] user_info: 본인 데이터만 수정 가능
- [ ] user_item: 본인 아이템만 조회 가능
- [ ] user_friend: 본인 관련 친구만 조회/삭제
- [ ] daily_chal_data: 본인 챌린지만 조회/수정
- [ ] zero_chal_data: 본인 플라스틱 기록만 조회/수정
- [ ] store: 읽기 전용
- [ ] places: 모든 사용자 읽기 가능, 추가 가능

---

## 📝 주의사항

### 현재 코드의 잠재적 보안 이슈

1. **user_info SELECT 정책**: 모든 사용자가 다른 사용자 정보를 조회 가능
   - 랭킹, 친구 검색 기능을 위해 필요
   - 민감한 정보(email, phone_num)는 SELECT 정책에서 제외 고려

2. **places INSERT 정책**: 악의적인 사용자가 가짜 장소 추가 가능
   - 관리자 승인 시스템 또는 신고 시스템 고려

### 개선 제안

```sql
-- user_info: 민감한 정보 제외하고 조회
CREATE POLICY "user_info_select_public" ON user_info
FOR SELECT TO authenticated
USING (true);  -- 하지만 SELECT에서 email, phone_num 제외

-- 또는 VIEW 생성
CREATE VIEW user_info_public AS
SELECT user_id, name, user_f_id, point_current, points_total, rank, amount
FROM user_info;

-- VIEW에 RLS 적용
ALTER VIEW user_info_public OWNER TO authenticated;
```

---

## 🔗 참고 링크

- [Supabase RLS 공식 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
