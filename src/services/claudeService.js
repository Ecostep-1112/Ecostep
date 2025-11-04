// Claude API 서비스
// 백엔드 서버를 통해 API를 호출합니다 (보안)

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// 오늘의 팁이 이미 생성되었는지 확인
export const isTipGeneratedToday = () => {
  const lastGeneratedDate = localStorage.getItem('lastTipGeneratedDate');
  const todayDate = getTodayDateString();
  return lastGeneratedDate === todayDate;
};

// 오늘의 환경 팁 생성 및 저장
export const generateDailyTip = async () => {
  try {
    const todayDate = getTodayDateString();

    // 이미 오늘 생성했으면 스킵
    if (isTipGeneratedToday()) {
      console.log('오늘의 팁이 이미 생성되어 있습니다.');
      return;
    }

    console.log('오늘의 새로운 팁 생성 중...');

    // 저장된 카테고리 또는 기본값 사용
    const category = localStorage.getItem('tipCategory') || '랜덤';

    // 저장된 언어 설정 가져오기 (기본값: 한국어)
    const appSettings = JSON.parse(localStorage.getItem('app-settings') || '{}');
    const language = appSettings.language || '한국어';

    // 백엔드 서버를 통해 Claude API 호출
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5176';
    const response = await fetch(`${API_URL}/api/environmental-tip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: category === '랜덤' ? null : category,
        language: language
      })
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const tipData = await response.json();

    // localStorage에 저장
    localStorage.setItem('currentDailyTip', JSON.stringify(tipData));
    localStorage.setItem('lastTipGeneratedDate', todayDate);

    console.log('오늘의 팁 생성 완료:', tipData.title);
  } catch (error) {
    console.error('일일 팁 생성 실패:', error);
    // 실패해도 기본 팁 저장
    const fallbackTip = {
      id: Date.now(),
      title: '환경 보호 실천하기',
      preview: '작은 실천이 큰 변화를 만듭니다',
      content: '일회용품 사용을 줄이고, 재활용을 생활화하며, 에너지를 절약하는 것부터 시작해보세요. 매일 작은 노력이 모여 지구를 지킬 수 있습니다.',
      category: '생활 습관'
    };
    localStorage.setItem('currentDailyTip', JSON.stringify(fallbackTip));
    localStorage.setItem('lastTipGeneratedDate', getTodayDateString());
  }
};

// 오늘의 팁 가져오기
export const getTodayTip = () => {
  try {
    const tipStr = localStorage.getItem('currentDailyTip');
    if (!tipStr) {
      // 팁이 없으면 기본값 반환
      return {
        id: Date.now(),
        title: '환경 보호 실천하기',
        preview: '작은 실천이 큰 변화를 만듭니다',
        content: '일회용품 사용을 줄이고, 재활용을 생활화하며, 에너지를 절약하는 것부터 시작해보세요. 매일 작은 노력이 모여 지구를 지킬 수 있습니다.',
        category: '생활 습관'
      };
    }
    return JSON.parse(tipStr);
  } catch (error) {
    console.error('팁 로드 실패:', error);
    return {
      id: Date.now(),
      title: '환경 보호 실천하기',
      preview: '작은 실천이 큰 변화를 만듭니다',
      content: '일회용품 사용을 줄이고, 재활용을 생활화하며, 에너지를 절약하는 것부터 시작해보세요. 매일 작은 노력이 모여 지구를 지킬 수 있습니다.',
      category: '생활 습관'
    };
  }
};

// 기존 함수 (하위 호환성)
export const generateEnvironmentalTip = async (category = null) => {
  // 새로운 시스템으로 전환
  await generateDailyTip();
  return getTodayTip();
};

export default generateEnvironmentalTip;