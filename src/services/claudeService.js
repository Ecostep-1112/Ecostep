// Claude API 서비스
// 백엔드 서버를 통해 API를 호출합니다 (보안)
import { CapacitorHttp } from '@capacitor/core';

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
    const response = await CapacitorHttp.post({
      url: `${API_URL}/api/environmental-tip`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        category: category === '랜덤' ? null : category,
        language: language
      }
    });

    const tipData = response.data;

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
    console.error('환경 팁 로드 실패 - Mock 데이터 사용:', error);
    // 백엔드 서버가 실행되지 않은 경우 Mock 데이터 사용
    return generateMockTip(category, null);
  }
};

// Mock 데이터 생성 함수 (개발/에러 시 사용)
const generateMockTip = (category = null, index = null) => {
  const tips = [
    // 제로웨이스트 카테고리
    {
      title: '밀랍 랩 사용하기',
      preview: '일회용 비닐랩 대신 재사용 가능한 밀랍 랩을 사용해보세요',
      content: '밀랍 랩은 천연 밀랍과 면 천으로 만든 친환경 식품 포장재입니다. 비닐랩과 달리 1년 이상 재사용이 가능하며, 사용 후에는 100% 생분해됩니다. 야채, 과일, 남은 음식을 싸거나 그릇을 덮을 때 사용하세요. 손의 온기로 살짝 눌러주면 밀착되어 신선도를 유지할 수 있습니다.',
      category: '제로웨이스트'
    },
    {
      title: '천연 수세미 사용',
      preview: '플라스틱 수세미 대신 천연 수세미를 사용해보세요',
      content: '수세미 열매로 만든 천연 수세미는 플라스틱 수세미와 달리 미세플라스틱을 배출하지 않습니다. 설거지할 때 세제 사용량도 줄일 수 있고, 사용 후에는 퇴비로 만들 수 있어 100% 자연 순환됩니다. 3-4개월마다 교체하면 위생적으로 사용할 수 있으며, 삶아서 소독하면 더 오래 사용할 수 있습니다.',
      category: '제로웨이스트'
    },
    {
      title: '고체 샴푸바 사용',
      preview: '플라스틱 용기 대신 고체 샴푸바로 전환해보세요',
      content: '고체 샴푸바는 플라스틱 용기가 필요 없고, 한 개로 액체 샴푸 2-3병 분량을 사용할 수 있습니다. 여행 시 액체 제한도 받지 않아 편리합니다. 천연 성분으로 만들어져 두피에도 좋고, 사용 후 종이 포장만 남아 쓰레기도 줄일 수 있습니다.',
      category: '제로웨이스트'
    },
    {
      title: '스테인리스 빨대 사용',
      preview: '일회용 플라스틱 빨대 대신 재사용 가능한 스테인리스 빨대를',
      content: '스테인리스 빨대는 반영구적으로 사용 가능하며, 전용 솔로 깨끗하게 세척할 수 있습니다. 휴대용 파우치와 함께 가지고 다니면 카페나 식당에서도 사용할 수 있습니다. 실리콘 팁을 씌우면 아이들도 안전하게 사용할 수 있습니다.',
      category: '제로웨이스트'
    },
    
    // 생활 습관 카테고리
    {
      title: '메쉬백으로 장보기',
      preview: '과일과 채소 구매 시 메쉬백을 활용해 비닐봉지를 줄여보세요',
      content: '재사용 가능한 메쉬백은 과일과 채소를 담기에 완벽합니다. 통기성이 좋아 신선도 유지에도 도움이 되고, 가벼워서 휴대하기도 편합니다. 마트에서 제공하는 비닐봉지 대신 메쉬백을 사용하면 연간 수백 개의 비닐 사용을 줄일 수 있습니다. 사용 후에는 세탁기에 넣어 간단히 세척할 수 있어요.',
      category: '생활 습관'
    },
    {
      title: '텀블러 사용 습관화',
      preview: '일회용 컵 대신 텀블러를 사용하는 습관을 만들어보세요',
      content: '매일 사용하는 일회용 컵을 텀블러로 바꾸면 연간 300개 이상의 일회용 컵을 줄일 수 있습니다. 많은 카페에서 텀블러 할인을 제공하므로 경제적이기도 합니다. 보온보냉 기능이 있는 텀블러는 음료를 더 오래 맛있게 즐길 수 있게 해줍니다.',
      category: '생활 습관'
    },
    {
      title: '장바구니 항상 휴대',
      preview: '접이식 장바구니를 가방에 넣고 다니는 습관을 들여보세요',
      content: '작게 접히는 장바구니를 항상 가방에 넣고 다니면 갑작스러운 쇼핑에도 비닐봉지를 받지 않을 수 있습니다. 방수 소재 장바구니는 세척이 쉽고 위생적입니다. 예쁜 디자인의 장바구니는 패션 아이템으로도 활용할 수 있습니다.',
      category: '생활 습관'
    },
    {
      title: '손수건 사용하기',
      preview: '휴지 대신 손수건을 사용하는 습관을 길러보세요',
      content: '손수건 한 장으로 하루에 사용하는 휴지의 양을 크게 줄일 수 있습니다. 면 손수건은 흡수력이 좋고 세탁하면 계속 사용할 수 있어 경제적입니다. 여러 장을 준비해두고 매일 깨끗한 것으로 교체하면 위생적으로 사용할 수 있습니다.',
      category: '생활 습관'
    },
    
    // 재활용 팁 카테고리
    {
      title: '커피 찌꺼기 활용법',
      preview: '버려지는 커피 찌꺼기를 천연 탈취제로 재활용해보세요',
      content: '커피를 내리고 남은 찌꺼기는 훌륭한 천연 탈취제입니다. 잘 말린 후 망사 주머니에 넣어 신발장, 냉장고, 차량에 두면 냄새를 흡수합니다. 또한 하수구에 뿌리면 기름때 제거에 효과적이고, 화분에 뿌리면 천연 비료가 됩니다. 일주일에 한 번씩 교체하면 효과적으로 사용할 수 있습니다.',
      category: '재활용 팁'
    },
    {
      title: '페트병 올바른 분리배출',
      preview: '페트병을 올바르게 분리배출하는 방법을 알아보세요',
      content: '페트병은 라벨을 제거하고 내용물을 비운 후 깨끗이 헹궈야 합니다. 뚜껑은 따로 분리하고, 몸체는 발로 밟아 압축하면 부피를 줄일 수 있습니다. 투명 페트병은 별도 분리배출하면 고품질 재활용이 가능합니다.',
      category: '재활용 팁'
    },
    {
      title: '우유팩 재활용 방법',
      preview: '우유팩을 제대로 재활용하는 방법을 실천해보세요',
      content: '우유팩은 일반 종이와 다르게 별도로 분리배출해야 합니다. 내용물을 비우고 깨끗이 헹군 후 펼쳐서 말려주세요. 여러 개를 모아 묶어서 배출하면 수거가 용이합니다. 우유팩은 고급 화장지의 원료가 되므로 깨끗하게 배출하는 것이 중요합니다.',
      category: '재활용 팁'
    },
    {
      title: '유리병 재활용 팁',
      preview: '유리병을 효과적으로 재활용하는 방법을 알아보세요',
      content: '유리병은 색상별로 분리하면 재활용 품질이 높아집니다. 라벨과 뚜껑을 제거하고 내용물을 깨끗이 씻어내세요. 깨진 유리는 신문지에 싸서 "깨진 유리"라고 표시하여 안전하게 배출합니다. 보증금 대상 병은 마트에서 환불받을 수 있습니다.',
      category: '재활용 팁'
    },
    
    // 에너지 절약 카테고리
    {
      title: '대기전력 차단하기',
      preview: '멀티탭 스위치로 대기전력을 차단해 전기를 절약하세요',
      content: '가전제품의 대기전력은 전체 전력 사용량의 10%를 차지합니다. 스위치가 있는 멀티탭을 사용하면 사용하지 않는 가전제품의 전원을 쉽게 차단할 수 있습니다. TV, 컴퓨터, 충전기 등을 사용하지 않을 때는 멀티탭 스위치를 꺼두세요. 월 전기료를 5-10% 절감할 수 있습니다.',
      category: '에너지 절약'
    },
    {
      title: 'LED 전구로 교체',
      preview: '백열전구를 LED로 교체하여 전기를 절약해보세요',
      content: 'LED 전구는 백열전구보다 85% 적은 전력을 사용하며, 수명도 25배 이상 깁니다. 초기 비용은 높지만 장기적으로 전기료와 교체 비용을 크게 절약할 수 있습니다. 색온도를 선택할 수 있어 공간에 맞는 조명 연출도 가능합니다.',
      category: '에너지 절약'
    },
    {
      title: '에어컨 적정 온도 유지',
      preview: '여름철 에어컨 온도를 26도로 유지하여 에너지를 절약하세요',
      content: '에어컨 설정 온도를 1도 높이면 전력 소비를 7% 줄일 수 있습니다. 26-28도를 유지하고 선풍기를 함께 사용하면 체감 온도를 낮출 수 있습니다. 필터를 정기적으로 청소하면 냉방 효율이 높아져 전기를 절약할 수 있습니다.',
      category: '에너지 절약'
    },
    {
      title: '세탁기 찬물 세탁',
      preview: '찬물 세탁으로 에너지를 절약하고 옷감도 보호하세요',
      content: '세탁기 에너지의 90%는 물을 데우는 데 사용됩니다. 대부분의 세탁물은 찬물로도 충분히 깨끗해집니다. 찬물 전용 세제를 사용하면 세탁력을 높일 수 있고, 옷감 손상도 줄일 수 있어 옷을 더 오래 입을 수 있습니다.',
      category: '에너지 절약'
    }
  ];

  // 카테고리가 지정된 경우 해당 카테고리의 팁만 필터링
  let filteredTips = tips;
  if (category && category !== '랜덤') {
    filteredTips = tips.filter(tip => tip.category === category);
    // 해당 카테고리에 팁이 없으면 전체 팁 사용
    if (filteredTips.length === 0) {
      filteredTips = tips;
    }
  }
  
  let selectedTip;
  let currentIndex = 0;
  
  // 인덱스가 지정된 경우 순차적으로 선택, 아니면 랜덤
  if (index !== null && category !== '랜덤' && category !== null) {
    // 인덱스가 배열 길이를 초과하면 처음으로 순환
    currentIndex = index % filteredTips.length;
    selectedTip = filteredTips[currentIndex];
  } else {
    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * filteredTips.length);
    selectedTip = filteredTips[randomIndex];
    currentIndex = randomIndex;
  }
  
  return {
    id: Date.now(),
    ...selectedTip,
    currentIndex: currentIndex
  };
};

export default generateEnvironmentalTip;