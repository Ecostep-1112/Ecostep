// 로컬 스토리지 유틸리티 함수들

/**
 * 로컬 스토리지에서 데이터를 가져오는 함수
 * @param {string} key - 저장소 키
 * @param {any} defaultValue - 기본값
 * @returns {any} 저장된 데이터 또는 기본값
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * 로컬 스토리지에 데이터를 저장하는 함수
 * @param {string} key - 저장소 키
 * @param {any} value - 저장할 값
 * @returns {boolean} 저장 성공 여부
 */
export const setLocalStorage = (key, value) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * 로컬 스토리지에서 데이터를 삭제하는 함수
 * @param {string} key - 삭제할 키
 * @returns {boolean} 삭제 성공 여부
 */
export const removeLocalStorage = (key) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * 로컬 스토리지 전체를 초기화하는 함수
 * @returns {boolean} 초기화 성공 여부
 */
export const clearLocalStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// 특정 도메인의 키들만 관리하는 헬퍼 함수들
const STORAGE_KEYS = {
  // 챌린지 관련
  CUSTOM_CHALLENGES: 'ecostep_custom_challenges',
  CUSTOM_PLASTIC_ITEMS: 'ecostep_custom_plastic_items',
  SELECTED_CHALLENGE: 'ecostep_selected_challenge',

  // 어항 설정 관련
  AQUARIUM_SETTINGS: 'ecostep_aquarium_settings',
  FISH_SETTINGS: 'ecostep_fish_settings',
  DECORATION_SETTINGS: 'ecostep_decoration_settings',

  // 앱 설정 관련
  APP_SETTINGS: 'ecostep_app_settings',
  USER_PREFERENCES: 'ecostep_user_preferences',
  THEME_SETTINGS: 'ecostep_theme_settings',
};

export { STORAGE_KEYS };

// 도메인별 헬퍼 함수들

/**
 * 커스텀 챌린지 목록 관리
 */
export const customChallengeStorage = {
  get: () => getLocalStorage(STORAGE_KEYS.CUSTOM_CHALLENGES, []),
  set: (challenges) => setLocalStorage(STORAGE_KEYS.CUSTOM_CHALLENGES, challenges),
  add: (challenge) => {
    const challenges = customChallengeStorage.get();
    const updated = [...challenges, challenge];
    return customChallengeStorage.set(updated);
  },
  remove: (challengeToRemove) => {
    const challenges = customChallengeStorage.get();
    const updated = challenges.filter(c => c !== challengeToRemove);
    return customChallengeStorage.set(updated);
  }
};

/**
 * 커스텀 플라스틱 아이템 관리
 */
export const customPlasticItemStorage = {
  get: () => getLocalStorage(STORAGE_KEYS.CUSTOM_PLASTIC_ITEMS, []),
  set: (items) => setLocalStorage(STORAGE_KEYS.CUSTOM_PLASTIC_ITEMS, items),
  add: (item) => {
    const items = customPlasticItemStorage.get();
    const updated = [...items, item];
    return customPlasticItemStorage.set(updated);
  },
  remove: (itemToRemove) => {
    const items = customPlasticItemStorage.get();
    const updated = items.filter(item => item.name !== itemToRemove.name);
    return customPlasticItemStorage.set(updated);
  }
};

/**
 * 어항 설정 관리
 */
export const aquariumSettingsStorage = {
  get: () => getLocalStorage(STORAGE_KEYS.AQUARIUM_SETTINGS, {
    tankType: 'basic',
    fishCount: 5,
    isRandomFish: true,
    selectedFish: [],
    selectedDecorations: []
  }),
  set: (settings) => setLocalStorage(STORAGE_KEYS.AQUARIUM_SETTINGS, settings),
  update: (updates) => {
    const current = aquariumSettingsStorage.get();
    const updated = { ...current, ...updates };
    return aquariumSettingsStorage.set(updated);
  }
};

/**
 * 앱 설정 관리
 */
export const appSettingsStorage = {
  get: () => getLocalStorage(STORAGE_KEYS.APP_SETTINGS, {
    isDarkMode: false,
    language: 'ko',
    notifications: true,
    location: null,
    colorScheme: 'default'
  }),
  set: (settings) => setLocalStorage(STORAGE_KEYS.APP_SETTINGS, settings),
  update: (updates) => {
    const current = appSettingsStorage.get();
    const updated = { ...current, ...updates };
    return appSettingsStorage.set(updated);
  }
};

/**
 * 선택된 챌린지 관리
 */
export const selectedChallengeStorage = {
  get: () => getLocalStorage(STORAGE_KEYS.SELECTED_CHALLENGE, '플라스틱 빨대 안쓰기'),
  set: (challenge) => setLocalStorage(STORAGE_KEYS.SELECTED_CHALLENGE, challenge)
};