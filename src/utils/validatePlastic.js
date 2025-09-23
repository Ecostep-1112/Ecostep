// Claude API를 사용한 플라스틱 절약량 검증
// 주의: 실제 API 키는 환경 변수로 관리해야 합니다.

export async function validatePlasticChallenge(description) {
  try {
    // 백엔드 서버를 통해 Claude API 호출
    const response = await fetch('http://localhost:5176/api/validate-plastic-challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        challenge: description
      })
    });

    if (!response.ok) {
      throw new Error('API 호출 실패');
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    try {
      const result = JSON.parse(content);
      return {
        valid: result.isPlasticRelated,
        savings: result.estimatedSaving,
        reason: result.reason
      };
    } catch (parseError) {
      // JSON 파싱 실패 시 기본 로직 사용
      return fallbackValidation(description);
    }
  } catch (error) {
    console.error('Claude API 오류:', error);
    // API 오류 시 폴백 로직 사용
    return fallbackValidation(description);
  }
}

// 폴백 검증 로직 (API 없이 작동)
export function fallbackValidation(description) {
  const lowerText = description.toLowerCase();
  
  // 플라스틱 관련 키워드 체크 (확장됨)
  const plasticKeywords = [
    '플라스틱', '비닐', '페트', 'pet', '일회용', '용기', '컵', '빨대', 
    '봉지', '봉투', '포장', '배달', '텀블러', '에코백', '장바구니',
    '병', '보틀', '랩', '지퍼백', '스티로폼', '테이크아웃', '물티슈',
    '용품', '그릇', '수저', '포크', '젓가락', '나이프', '숟가락',
    '접시', '트레이', '캡', '뚜껑', '빨대', '스트로우', '커피',
    '음료', '카페', '마트', '쇼핑', '포장지', '비닐랩', '샴푸',
    '세제', '리필', '용기', '패키지', '포장재', '택배', '박스',
    '버블랩', '에어캡', '완충재', '아이스팩', '보냉', '도시락'
  ];
  
  // 간접적 관련 키워드 (가능성 있음)
  const indirectKeywords = [
    '장보기', '마켓', '시장', '편의점', '구매', '쇼핑',
    '음식', '간식', '커피', '음료', '카페', '식당',
    '배송', '택배', '온라인', '주문', '구입'
  ];
  
  const isDirectlyRelated = plasticKeywords.some(keyword => 
    lowerText.includes(keyword)
  );
  
  const isPossiblyRelated = indirectKeywords.some(keyword => 
    lowerText.includes(keyword)
  );
  
  // 플라스틱과 전혀 무관한 활동
  if (!isDirectlyRelated && !isPossiblyRelated) {
    return {
      valid: true,  // 추가는 허용
      savings: 0,   // 하지만 절약량은 0
      reason: '⚠️ 플라스틱과 관련이 없는 활동으로 보입니다. 플라스틱 절약량에는 포함되지 않습니다.',
      warning: true
    };
  }
  
  // 간접적으로만 관련된 경우
  if (!isDirectlyRelated && isPossiblyRelated) {
    return {
      valid: true,
      savings: 0,
      reason: '💡 플라스틱 절약과 간접적 관련이 있을 수 있습니다. 구체적인 플라스틱 줄이기 방법을 명시해주세요.',
      suggestion: true
    };
  }
  
  // 더 정교한 카테고리별 예상 절약량 계산
  let savings = 10; // 기본값
  let confidence = 'medium'; // 신뢰도
  
  // 복수 키워드 조합으로 더 정확한 예측
  if ((lowerText.includes('배달') || lowerText.includes('포장')) && 
      (lowerText.includes('안') || lowerText.includes('줄') || lowerText.includes('거절'))) {
    savings = 40 + Math.floor(Math.random() * 20); // 40-60g
    confidence = 'high';
  } else if (lowerText.includes('배달') || lowerText.includes('테이크아웃')) {
    savings = 30 + Math.floor(Math.random() * 20); // 30-50g
  } else if ((lowerText.includes('텀블러') || lowerText.includes('개인컵')) && 
             (lowerText.includes('사용') || lowerText.includes('이용'))) {
    savings = 15 + Math.floor(Math.random() * 5); // 15-20g
    confidence = 'high';
  } else if (lowerText.includes('일회용') && lowerText.includes('컵')) {
    savings = 12 + Math.floor(Math.random() * 8); // 12-20g
  } else if ((lowerText.includes('에코백') || lowerText.includes('장바구니')) && 
             (lowerText.includes('사용') || lowerText.includes('이용'))) {
    savings = 15 + Math.floor(Math.random() * 10); // 15-25g
    confidence = 'high';
  } else if (lowerText.includes('비닐') && (lowerText.includes('안') || lowerText.includes('거절'))) {
    savings = 8 + Math.floor(Math.random() * 7); // 8-15g
  } else if (lowerText.includes('빨대') || lowerText.includes('스트로우')) {
    savings = 2 + Math.floor(Math.random() * 2); // 2-4g
  } else if (lowerText.includes('수저') || lowerText.includes('포크') || lowerText.includes('젓가락')) {
    savings = 3 + Math.floor(Math.random() * 3); // 3-6g
  } else if (lowerText.includes('물티슈')) {
    savings = 3 + Math.floor(Math.random() * 5); // 3-8g
  } else if (lowerText.includes('리필') || lowerText.includes('리필스테이션')) {
    savings = 35 + Math.floor(Math.random() * 25); // 35-60g
    confidence = 'high';
  } else if (lowerText.includes('샴푸바') || lowerText.includes('고체')) {
    savings = 25 + Math.floor(Math.random() * 15); // 25-40g
  } else if (lowerText.includes('재사용') || lowerText.includes('다회용')) {
    savings = 10 + Math.floor(Math.random() * 10); // 10-20g
  } else {
    // 구체적이지 않은 경우
    savings = 5 + Math.floor(Math.random() * 10); // 5-15g
    confidence = 'low';
  }
  
  // 최대값 제한
  savings = Math.min(savings, 100);
  
  // 신뢰도에 따른 메시지
  let confidenceMessage = '';
  if (confidence === 'high') {
    confidenceMessage = ' ✅';
  } else if (confidence === 'low') {
    confidenceMessage = ' (예상치)';
  }
  
  return {
    valid: true,
    savings,
    reason: `이 활동으로 하루 약 ${savings}g의 플라스틱을 절약할 수 있습니다${confidenceMessage}`
  };
}