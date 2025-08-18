// Claude API 서비스
// 실제 구현 시에는 백엔드 서버를 통해 API 키를 안전하게 관리해야 합니다

const CLAUDE_API_ENDPOINT = '/api/claude'; // 백엔드 엔드포인트

export const generateEnvironmentalTip = async () => {
  try {
    // 백엔드 서버로 요청 (실제 구현 시)
    const response = await fetch(CLAUDE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `일상에서 쉽게 실천할 수 있는 환경 보호 팁을 하나 생성해주세요.
        형식:
        - 제목: 15자 이내의 간단한 제목
        - 미리보기: 30자 이내의 짧은 설명
        - 내용: 100자 이내의 자세한 설명과 실천 방법
        - 카테고리: 재활용 팁, 생활 습관, 에너지 절약 중 하나
        
        JSON 형식으로 응답해주세요.`
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('환경 팁 생성 실패:', error);
    
    // 오류 시 기본 팁 반환
    return generateRandomTip();
  }
};

// 백엔드 없이 테스트용 랜덤 팁 생성
export const generateRandomTip = () => {
  const tips = [
    {
      title: '에코백 활용하기',
      preview: '장보러 갈 때 에코백을 사용하면 비닐봉지 사용을 줄일 수 있어요',
      content: '에코백 하나로 연간 약 200개의 비닐봉지를 절약할 수 있습니다. 작게 접어지는 에코백을 가방에 항상 넣어두면 갑작스런 쇼핑에도 대비할 수 있어요. 천연 소재 에코백은 세탁도 가능해 위생적이고, 다양한 디자인으로 패션 아이템으로도 활용 가능합니다.',
      category: '생활 습관'
    },
    {
      title: '양치컵 사용하기',
      preview: '양치할 때 물을 받아 사용하면 하루 12리터의 물을 절약할 수 있어요',
      content: '수도꼭지를 틀어놓고 양치하면 분당 6리터의 물이 낭비됩니다. 컵을 사용하면 0.5리터로 충분해요. 4인 가족이 실천하면 연간 17,520리터의 물을 절약할 수 있습니다. 이는 성인 한 명이 1년간 마실 수 있는 물의 양과 같습니다.',
      category: '에너지 절약'
    },
    {
      title: '전자영수증 받기',
      preview: '종이 영수증 대신 전자영수증을 받으면 숲을 보호할 수 있어요',
      content: '한국에서만 연간 140억 장의 종이 영수증이 발행되며, 이는 나무 20만 그루에 해당합니다. 전자영수증은 관리도 편하고 분실 위험도 없어요. 대부분의 카드사와 매장에서 전자영수증 서비스를 제공하니 적극 활용해보세요.',
      category: '재활용 팁'
    },
    {
      title: '냉장고 정리하기',
      preview: '냉장고를 70% 정도만 채우면 전기를 절약할 수 있어요',
      content: '냉장고를 꽉 채우면 냉기 순환이 어려워 전력 소비가 증가합니다. 적정 용량은 70% 정도예요. 투명 용기를 사용해 내용물을 쉽게 확인하고, 유통기한을 적어두면 음식물 쓰레기도 줄일 수 있습니다. 정기적인 정리로 전기료도 절약하세요.',
      category: '에너지 절약'
    },
    {
      title: '리필 스테이션 이용',
      preview: '세제나 샴푸를 리필 스테이션에서 구매하면 플라스틱을 줄일 수 있어요',
      content: '리필 스테이션에서는 용기를 가져가 필요한 만큼만 구매할 수 있습니다. 일반 제품보다 20-30% 저렴하고, 플라스틱 용기 쓰레기를 90% 줄일 수 있어요. 전국에 200개 이상의 리필 스테이션이 있으니 가까운 곳을 찾아보세요.',
      category: '재활용 팁'
    }
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return {
    id: Date.now(),
    ...randomTip
  };
};