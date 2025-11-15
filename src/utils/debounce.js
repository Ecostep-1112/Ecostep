/**
 * Debounce utility function
 * 짧은 시간 내에 여러 번 호출되는 함수를 마지막 호출 후 일정 시간이 지난 후 한 번만 실행
 *
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (ms)
 * @returns {Function} debounced 함수
 */
export function debounce(func, delay) {
  let timeoutId;

  return function debounced(...args) {
    // 이전 타이머 취소
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 새 타이머 설정
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Throttle utility function
 * 일정 시간 간격으로 최대 한 번만 함수 실행
 *
 * @param {Function} func - 실행할 함수
 * @param {number} limit - 최소 실행 간격 (ms)
 * @returns {Function} throttled 함수
 */
export function throttle(func, limit) {
  let inThrottle;

  return function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
