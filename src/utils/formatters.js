// 무게 단위를 자동으로 변환하는 함수
export const formatWeight = (grams) => {
  if (grams === 0) return '0g';
  
  // 1000g 이상이면 kg로 표시
  if (grams >= 1000) {
    const kg = grams / 1000;
    // 소수점 1자리까지 표시, 정수면 정수로 표시
    if (kg === Math.floor(kg)) {
      return `${kg}kg`;
    }
    return `${kg.toFixed(1)}kg`;
  }
  
  // 1000g 미만이면 g로 표시
  return `${grams}g`;
};

// 숫자만 추출하는 함수 (단위 제거)
export const parseWeight = (weightStr) => {
  if (typeof weightStr === 'number') return weightStr;
  
  const match = weightStr.match(/(\d+\.?\d*)/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  
  // kg 단위인 경우 g로 변환
  if (weightStr.includes('kg')) {
    return value * 1000;
  }
  
  return value;
};