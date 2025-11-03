// Claude API 서비스
// 실제 운영 환경에서는 백엔드 서버를 통해 API를 호출해야 합니다
// 프론트엔드에서 직접 API 키를 사용하는 것은 보안상 권장되지 않습니다

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || 'your-api-key-here';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export const generateEnvironmentalTip = async (category = null) => {
  try {
    // 오늘 날짜를 기준으로 캐시 키 생성
    const today = new Date().toDateString(); // "Mon Jan 20 2025"
    const cacheKey = `env-tip-${today}-${category || '랜덤'}`;

    // 캐시 확인
    const cachedTip = localStorage.getItem(cacheKey);
    if (cachedTip) {
      console.log('캐시에서 팁 로드:', category);
      return JSON.parse(cachedTip);
    }

    console.log('새로운 팁 생성 중:', category);

    // 백엔드 서버를 통해 Claude API 호출
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5176';
    const response = await fetch(`${API_URL}/api/environmental-tip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: category || '랜덤'
      })
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const tipData = await response.json();

    // 캐시에 저장
    localStorage.setItem(cacheKey, JSON.stringify(tipData));

    return tipData;
  } catch (error) {
    console.error('환경 팁 로드 실패:', error);
    // 백엔드 서버 오류 시 기본 메시지 반환
    return {
      id: Date.now(),
      title: '환경 보호 실천하기',
      preview: '작은 실천이 큰 변화를 만듭니다',
      content: '일회용품 사용을 줄이고, 재활용을 생활화하며, 에너지를 절약하는 것부터 시작해보세요. 매일 작은 노력이 모여 지구를 지킬 수 있습니다.',
      category: category || '생활 습관'
    };
  }
};

export default generateEnvironmentalTip;