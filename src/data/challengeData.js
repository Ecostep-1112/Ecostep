// 챌린지별 일일 플라스틱 절약량 데이터 (단위: g)
export const challengeSavings = {
  '텀블러 사용하기': 15,
  '일회용 컵 안쓰기': 15,
  '플라스틱 빨대 안 쓰기': 2,
  '에코백 사용하기': 20,
  '장바구니 사용하기': 20,
  '비닐봉지 안쓰기': 10,
  '물티슈 줄이기': 5,
  '배달음식 줄이기': 50,
  '기타 (직접 입력)': 0  // API로 계산
};

// 플라스틱 관련 키워드
export const plasticKeywords = [
  '플라스틱', '비닐', '페트', 'PET', '일회용', '용기', '컵', '빨대', '봉지', '봉투',
  '포장', '포장재', '용품', '그릇', '수저', '포크', '나이프', '젓가락',
  '병', '보틀', '텀블러', '에코백', '장바구니', '배달', '포장지',
  '랩', '비닐랩', '지퍼백', '지퍼팩', '팩', '트레이', '스티로폼',
  '테이크아웃', '배달용기', '음료', '커피', '카페', '마트', '쇼핑',
  '물티슈', '티슈', '휴지'
];

// 챌린지가 플라스틱 관련인지 검증
export const isPlasticRelated = (text) => {
  if (!text || text.length < 5) return false;
  
  const lowerText = text.toLowerCase();
  return plasticKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
};

// 카테고리별 예상 절약량 계산
export const estimateSavings = (text) => {
  const lowerText = text.toLowerCase();
  
  // 카테고리별 매칭
  if (lowerText.includes('배달') || lowerText.includes('포장')) {
    return 30 + Math.floor(Math.random() * 20); // 30-50g
  }
  if (lowerText.includes('컵') || lowerText.includes('텀블러') || lowerText.includes('커피')) {
    return 10 + Math.floor(Math.random() * 10); // 10-20g
  }
  if (lowerText.includes('봉지') || lowerText.includes('에코백') || lowerText.includes('장바구니')) {
    return 15 + Math.floor(Math.random() * 10); // 15-25g
  }
  if (lowerText.includes('빨대') || lowerText.includes('수저')) {
    return 2 + Math.floor(Math.random() * 3); // 2-5g
  }
  if (lowerText.includes('물티슈') || lowerText.includes('티슈')) {
    return 3 + Math.floor(Math.random() * 5); // 3-8g
  }
  
  // 기본값: 5-15g
  return 5 + Math.floor(Math.random() * 10);
};