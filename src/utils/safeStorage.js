/**
 * Safe localStorage wrapper with automatic error handling
 * localStorage 손상 시 앱 크래시를 방지하는 안전한 래퍼
 */

/**
 * localStorage에서 값을 안전하게 가져와 파싱
 * @param {string} key - localStorage 키
 * @param {*} defaultValue - 파싱 실패 시 반환할 기본값
 * @returns {*} 파싱된 값 또는 기본값
 */
export function safeGetJSON(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to parse localStorage key "${key}":`, error);
    }
    return defaultValue;
  }
}

/**
 * localStorage에 값을 안전하게 저장
 * @param {string} key - localStorage 키
 * @param {*} value - 저장할 값 (자동으로 JSON.stringify 됨)
 * @returns {boolean} 성공 여부
 */
export function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to save to localStorage key "${key}":`, error);
    }
    return false;
  }
}

/**
 * localStorage에서 값을 안전하게 제거
 * @param {string} key - localStorage 키
 * @returns {boolean} 성공 여부
 */
export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to remove localStorage key "${key}":`, error);
    }
    return false;
  }
}

/**
 * localStorage를 안전하게 클리어
 * @returns {boolean} 성공 여부
 */
export function safeClear() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to clear localStorage:', error);
    }
    return false;
  }
}
