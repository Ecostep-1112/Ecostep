/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} YYYY-MM-DD 형식의 날짜
 */
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * 특정 날짜를 YYYY-MM-DD 형식으로 반환
 * @param {Date|string} date - 변환할 날짜
 * @returns {string} YYYY-MM-DD 형식의 날짜
 */
export const toDateString = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

/**
 * 두 날짜가 같은 날인지 확인
 * @param {Date|string} date1 - 첫 번째 날짜
 * @param {Date|string} date2 - 두 번째 날짜
 * @returns {boolean} 같은 날이면 true
 */
export const isSameDay = (date1, date2) => {
  return toDateString(date1) === toDateString(date2);
};

/**
 * 오늘인지 확인
 * @param {Date|string} date - 확인할 날짜
 * @returns {boolean} 오늘이면 true
 */
export const isToday = (date) => {
  return toDateString(date) === getTodayDateString();
};

/**
 * 특정 날짜로부터 며칠이 지났는지 계산
 * @param {Date|string} date - 기준 날짜
 * @returns {number} 지난 일수
 */
export const getDaysSince = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = Math.abs(today - d);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * N일 전 날짜를 YYYY-MM-DD 형식으로 반환
 * @param {number} days - 며칠 전
 * @returns {string} YYYY-MM-DD 형식의 날짜
 */
export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateString(date);
};

/**
 * 이번 주 월요일 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns {string} YYYY-MM-DD 형식의 월요일 날짜
 */
export const getThisMonday = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 일요일이면 -6, 아니면 1
  const monday = new Date(today.setDate(diff));
  return toDateString(monday);
};

/**
 * 특정 날짜가 이번 주인지 확인
 * @param {Date|string} date - 확인할 날짜
 * @returns {boolean} 이번 주면 true
 */
export const isThisWeek = (date) => {
  const monday = getThisMonday();
  const dateStr = toDateString(date);
  return dateStr >= monday;
};

/**
 * localStorage에 저장된 날짜가 오늘인지 확인
 * @param {string} storageKey - localStorage 키
 * @returns {boolean} 오늘이면 true
 */
export const isStoredDateToday = (storageKey) => {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return false;
  return isToday(stored);
};

/**
 * localStorage에 오늘 날짜 저장
 * @param {string} storageKey - localStorage 키
 */
export const setStoredDateToday = (storageKey) => {
  localStorage.setItem(storageKey, getTodayDateString());
};

/**
 * localStorage 캐시 키 생성
 * @param {string} prefix - 접두사
 * @param {string} category - 카테고리 (선택사항)
 * @returns {string} 캐시 키
 */
export const createCacheKey = (prefix, category = '') => {
  const today = getTodayDateString();
  return category ? `${prefix}-${today}-${category}` : `${prefix}-${today}`;
};

/**
 * 오래된 캐시 정리
 * @param {string} prefix - 삭제할 캐시 키 접두사
 * @param {number} maxAgeDays - 최대 보관 일수 (기본 1일)
 */
export const cleanOldCache = (prefix, maxAgeDays = 1) => {
  const cutoffDate = getDaysAgo(maxAgeDays);
  const keysToRemove = [];

  // localStorage의 모든 키 순회
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      // 키에서 날짜 추출 (예: "env-tip-2025-01-15-랜덤" → "2025-01-15")
      const parts = key.split('-');
      if (parts.length >= 4) {
        const dateStr = `${parts[2]}-${parts[3]}-${parts[4]}`;
        if (dateStr < cutoffDate) {
          keysToRemove.push(key);
        }
      }
    }
  }

  // 오래된 캐시 삭제
  keysToRemove.forEach(key => localStorage.removeItem(key));

  if (keysToRemove.length > 0) {
    console.log(`🧹 ${keysToRemove.length}개의 오래된 캐시 삭제됨`);
  }
};
