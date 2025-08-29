// Claude API 서비스
// 실제 운영 환경에서는 백엔드 서버를 통해 API를 호출해야 합니다
// 프론트엔드에서 직접 API 키를 사용하는 것은 보안상 권장되지 않습니다

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || 'your-api-key-here';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export const generateEnvironmentalTip = async () => {
  try {
    // 백엔드 서버를 통해 Claude API 호출
    const response = await fetch('http://localhost:5176/api/environmental-tip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const tipData = await response.json();
    
    return tipData;
  } catch (error) {
    console.error('환경 팁 로드 실패 - Mock 데이터 사용:', error);
    // 백엔드 서버가 실행되지 않은 경우 Mock 데이터 사용
    return generateMockTip();
  }
};

// Mock 데이터 생성 함수 (개발/에러 시 사용)
const generateMockTip = () => {
  const tips = [
    {
      title: '밀랍 랩 사용하기',
      preview: '일회용 비닐랩 대신 재사용 가능한 밀랍 랩을 사용해보세요',
      content: '밀랍 랩은 천연 밀랍과 면 천으로 만든 친환경 식품 포장재입니다. 비닐랩과 달리 1년 이상 재사용이 가능하며, 사용 후에는 100% 생분해됩니다. 야채, 과일, 남은 음식을 싸거나 그릇을 덮을 때 사용하세요. 손의 온기로 살짝 눌러주면 밀착되어 신선도를 유지할 수 있습니다.',
      category: '제로웨이스트'
    },
    {
      title: '메쉬백으로 장보기',
      preview: '과일과 채소 구매 시 메쉬백을 활용해 비닐봉지를 줄여보세요',
      content: '재사용 가능한 메쉬백은 과일과 채소를 담기에 완벽합니다. 통기성이 좋아 신선도 유지에도 도움이 되고, 가벼워서 휴대하기도 편합니다. 마트에서 제공하는 비닐봉지 대신 메쉬백을 사용하면 연간 수백 개의 비닐 사용을 줄일 수 있습니다. 사용 후에는 세탁기에 넣어 간단히 세척할 수 있어요.',
      category: '생활 습관'
    },
    {
      title: '커피 찌꺼기 활용법',
      preview: '버려지는 커피 찌꺼기를 천연 탈취제로 재활용해보세요',
      content: '커피를 내리고 남은 찌꺼기는 훌륭한 천연 탈취제입니다. 잘 말린 후 망사 주머니에 넣어 신발장, 냉장고, 차량에 두면 냄새를 흡수합니다. 또한 하수구에 뿌리면 기름때 제거에 효과적이고, 화분에 뿌리면 천연 비료가 됩니다. 일주일에 한 번씩 교체하면 효과적으로 사용할 수 있습니다.',
      category: '재활용 팁'
    },
    {
      title: '대기전력 차단하기',
      preview: '멀티탭 스위치로 대기전력을 차단해 전기를 절약하세요',
      content: '가전제품의 대기전력은 전체 전력 사용량의 10%를 차지합니다. 스위치가 있는 멀티탭을 사용하면 사용하지 않는 가전제품의 전원을 쉽게 차단할 수 있습니다. TV, 컴퓨터, 충전기 등을 사용하지 않을 때는 멀티탭 스위치를 꺼두세요. 월 전기료를 5-10% 절감할 수 있습니다.',
      category: '에너지 절약'
    },
    {
      title: '천연 수세미 사용',
      preview: '플라스틱 수세미 대신 천연 수세미를 사용해보세요',
      content: '수세미 열매로 만든 천연 수세미는 플라스틱 수세미와 달리 미세플라스틱을 배출하지 않습니다. 설거지할 때 세제 사용량도 줄일 수 있고, 사용 후에는 퇴비로 만들 수 있어 100% 자연 순환됩니다. 3-4개월마다 교체하면 위생적으로 사용할 수 있으며, 삶아서 소독하면 더 오래 사용할 수 있습니다.',
      category: '제로웨이스트'
    }
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return {
    id: Date.now(),
    ...randomTip
  };
};

export default generateEnvironmentalTip;