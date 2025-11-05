// Claude API를 사용한 플라스틱 아이템 무게 추천
// 주의: 실제 API 키는 환경 변수로 관리해야 합니다.
import { CapacitorHttp } from '@capacitor/core';

export async function validatePlasticItem(itemName) {
  try {
    // 1단계: 플라스틱 분류 확인
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5176';
    const classificationResponse = await CapacitorHttp.post({
      url: `${API_URL}/api/classify-plastic-item`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        itemName: itemName
      }
    });

    const classificationData = classificationResponse.data;

    // 플라스틱이 아닌 경우 0g 반환
    if (!classificationData.isPlastic) {
      return {
        weight: 0,
        confidence: 'high',
        description: '플라스틱이 아닌 제품으로 플라스틱 절약량에 포함되지 않습니다.'
      };
    }

    // 2단계: 카테고리별 무게 계산
    const weight = calculateWeightByCategory(classificationData.category, itemName);

    return {
      weight: weight,
      confidence: classificationData.confidence,
      description: `${itemName} (${getCategoryName(classificationData.category)}) - 예상 무게 ${weight}g`
    };

  } catch (error) {
    console.error('Claude API 오류:', error);
    // API 오류 시 폴백 로직 사용
    return fallbackEstimation(itemName);
  }
}

// 카테고리별 무게 계산 함수
function calculateWeightByCategory(category, itemName) {
  const lowerName = itemName.toLowerCase();

  switch (category) {
    case 'bottle':
      if (lowerName.includes('대') || lowerName.includes('2l')) return 50;
      if (lowerName.includes('1.5l')) return 45;
      if (lowerName.includes('소') || lowerName.includes('350ml')) return 15;
      return 25; // 기본 500ml

    case 'cup':
      if (lowerName.includes('대') || lowerName.includes('벤티')) return 15;
      if (lowerName.includes('소') || lowerName.includes('톨')) return 8;
      return 10; // 중형

    case 'bag':
      if (lowerName.includes('대') || lowerName.includes('마트')) return 7;
      if (lowerName.includes('소') || lowerName.includes('편의점')) return 3;
      return 5; // 중형

    case 'container':
      if (lowerName.includes('도시락')) return 40;
      if (lowerName.includes('반찬')) return 15;
      if (lowerName.includes('대형')) return 50;
      return 35; // 일반

    case 'straw':
      return 1;

    case 'utensil':
      if (lowerName.includes('세트')) return 3;
      return 2; // 개별

    case 'packaging':
      if (lowerName.includes('택배')) return 30;
      if (lowerName.includes('과일') || lowerName.includes('야채')) return 5;
      return 15; // 일반

    case 'other':
    default:
      return 10; // 기본값
  }
}

// 카테고리 한글명 반환
function getCategoryName(category) {
  const categoryNames = {
    'bottle': '병/보틀',
    'cup': '컵',
    'bag': '봉지/봉투',
    'container': '용기',
    'straw': '빨대',
    'utensil': '수저류',
    'packaging': '포장재',
    'other': '기타'
  };

  return categoryNames[category] || '미분류';
}

// 폴백 무게 추정 로직 (API 없이 작동)
export function fallbackEstimation(itemName) {
  const lowerName = itemName.toLowerCase();
  
  // 카테고리별 기본 무게 추정
  let weight = 10; // 기본값
  let confidence = 'low';
  let description = '예상치';
  
  // 음료 관련
  if (lowerName.includes('병') || lowerName.includes('보틀') || lowerName.includes('bottle')) {
    if (lowerName.includes('대') || lowerName.includes('큰') || lowerName.includes('large') || 
        lowerName.includes('2l') || lowerName.includes('2리터')) {
      weight = 50;
      description = '2L 기준';
    } else if (lowerName.includes('1.5l') || lowerName.includes('1.5리터')) {
      weight = 45;
      description = '1.5L 기준';
    } else if (lowerName.includes('소') || lowerName.includes('작은') || lowerName.includes('small')) {
      weight = 15;
      description = '350ml 기준';
    } else {
      weight = 25;
      description = '500ml 기준';
    }
    confidence = 'high';
  }
  // 컵 관련
  else if (lowerName.includes('컵') || lowerName.includes('cup')) {
    if (lowerName.includes('대') || lowerName.includes('벤티') || lowerName.includes('large')) {
      weight = 15;
      description = '대형 컵';
    } else if (lowerName.includes('소') || lowerName.includes('톨') || lowerName.includes('small')) {
      weight = 8;
      description = '소형 컵';
    } else {
      weight = 10;
      description = '중형 컵';
    }
    confidence = 'high';
  }
  // 용기 관련
  else if (lowerName.includes('용기') || lowerName.includes('통') || lowerName.includes('container')) {
    if (lowerName.includes('도시락') || lowerName.includes('lunch')) {
      weight = 40;
      description = '도시락 용기';
      confidence = 'high';
    } else if (lowerName.includes('반찬')) {
      weight = 15;
      description = '반찬 용기';
      confidence = 'medium';
    } else if (lowerName.includes('대형') || lowerName.includes('큰')) {
      weight = 50;
      description = '대형 용기';
    } else {
      weight = 35;
      description = '일반 용기';
    }
  }
  // 봉투/봉지 관련
  else if (lowerName.includes('봉투') || lowerName.includes('봉지') || lowerName.includes('bag')) {
    if (lowerName.includes('대') || lowerName.includes('마트') || lowerName.includes('large')) {
      weight = 7;
      description = '대형 봉투';
      confidence = 'high';
    } else if (lowerName.includes('소') || lowerName.includes('편의점')) {
      weight = 3;
      description = '소형 봉투';
      confidence = 'high';
    } else {
      weight = 5;
      description = '중형 봉투';
    }
  }
  // 빨대 관련
  else if (lowerName.includes('빨대') || lowerName.includes('스트로우') || lowerName.includes('straw')) {
    weight = 1;
    description = '일반 빨대';
    confidence = 'high';
  }
  // 수저 관련
  else if (lowerName.includes('수저') || lowerName.includes('포크') || lowerName.includes('숟가락') || 
           lowerName.includes('젓가락') || lowerName.includes('spoon') || lowerName.includes('fork')) {
    if (lowerName.includes('세트')) {
      weight = 3;
      description = '수저 세트';
    } else {
      weight = 2;
      description = '개별 수저';
    }
    confidence = 'high';
  }
  // 접시 관련
  else if (lowerName.includes('접시') || lowerName.includes('그릇') || lowerName.includes('plate')) {
    if (lowerName.includes('대')) {
      weight = 12;
      description = '대형 접시';
    } else if (lowerName.includes('소')) {
      weight = 6;
      description = '소형 접시';
    } else {
      weight = 8;
      description = '중형 접시';
    }
    confidence = 'medium';
  }
  // 포장 관련
  else if (lowerName.includes('포장') || lowerName.includes('패키지') || lowerName.includes('package')) {
    if (lowerName.includes('택배') || lowerName.includes('배송')) {
      weight = 30;
      description = '택배 포장재';
    } else if (lowerName.includes('과일') || lowerName.includes('야채')) {
      weight = 5;
      description = '식품 포장';
    } else {
      weight = 15;
      description = '일반 포장';
    }
  }
  // 트레이 관련
  else if (lowerName.includes('트레이') || lowerName.includes('tray')) {
    weight = 12;
    description = '식품 트레이';
    confidence = 'medium';
  }
  // 랩 관련
  else if (lowerName.includes('랩') || lowerName.includes('wrap')) {
    weight = 2;
    description = '일회용 랩';
    confidence = 'medium';
  }
  // 화장품 관련
  else if (lowerName.includes('화장품') || lowerName.includes('샴푸') || lowerName.includes('린스') || 
           lowerName.includes('로션')) {
    if (lowerName.includes('대용량')) {
      weight = 40;
      description = '대용량';
    } else if (lowerName.includes('샘플') || lowerName.includes('미니')) {
      weight = 5;
      description = '샘플/미니';
    } else {
      weight = 20;
      description = '일반 용량';
    }
  }
  // 기타 제품들
  else {
    // 숫자가 포함된 경우 크기 힌트로 사용
    if (lowerName.includes('대') || lowerName.includes('큰') || lowerName.includes('large')) {
      weight = 30;
      description = '대형 제품';
    } else if (lowerName.includes('소') || lowerName.includes('작은') || lowerName.includes('small')) {
      weight = 8;
      description = '소형 제품';
    } else {
      weight = 15;
      description = '중형 제품';
    }
  }
  
  // 최대값 제한
  weight = Math.min(weight, 500);
  
  return {
    weight,
    confidence,
    description
  };
}