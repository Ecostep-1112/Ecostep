// 앱에서 기본 제공하는 데일리 챌린지 목록
// 이 목록은 앱 업데이트를 통해 관리되며, 유저는 이 외에 커스텀 챌린지를 추가할 수 있습니다.
export const defaultDailyChallenges = [
  {
    id: 1,
    title: '텀블러 사용하기',
    description: '일회용 컵 대신 개인 텀블러 사용',
    category: '일회용품 줄이기',
    estimatedSavings: 15, // g 단위
  },
  {
    id: 2,
    title: '에코백 사용하기',
    description: '비닐봉지 대신 에코백으로 장보기',
    category: '일회용품 줄이기',
    estimatedSavings: 20,
  },
  {
    id: 3,
    title: '플라스틱 빨대 안쓰기',
    description: '음료 주문 시 플라스틱 빨대 거부',
    category: '일회용품 줄이기',
    estimatedSavings: 2,
  },
  {
    id: 4,
    title: '비닐봉지 안쓰기',
    description: '마트나 편의점에서 비닐봉지 거부',
    category: '일회용품 줄이기',
    estimatedSavings: 10,
  },
  {
    id: 5,
    title: '물티슈 줄이기',
    description: '물티슈 대신 손수건이나 천 행주 사용',
    category: '일회용품 줄이기',
    estimatedSavings: 5,
  },
  {
    id: 6,
    title: '배달음식 줄이기',
    description: '배달음식 주문 횟수 줄이기',
    category: '일회용품 줄이기',
    estimatedSavings: 50,
  },
  {
    id: 7,
    title: '일회용 수저 거부하기',
    description: '배달 시 일회용 수저/포크 거부',
    category: '일회용품 줄이기',
    estimatedSavings: 5,
  },
  {
    id: 8,
    title: '리필 제품 구매하기',
    description: '세제, 샴푸 등 리필 제품 구매',
    category: '제로웨이스트',
    estimatedSavings: 30,
  },
  {
    id: 9,
    title: '재활용 분리수거',
    description: '플라스틱 제품 올바르게 분리수거',
    category: '재활용',
    estimatedSavings: 0,
  },
  {
    id: 10,
    title: '포장 줄이기',
    description: '과대 포장 제품 피하기',
    category: '일회용품 줄이기',
    estimatedSavings: 20,
  },
];

// 앱에서 기본 제공하는 제로 챌린지 플라스틱 아이템 목록
// 이 목록은 앱 업데이트를 통해 관리되며, 유저는 이 외에 커스텀 아이템을 추가할 수 있습니다.
export const defaultZeroItems = [
  {
    id: 1,
    name: '플라스틱병',
    category: 'bottle',
    estimatedWeight: 20, // g 단위
    description: '음료수병, 물병 등',
  },
  {
    id: 2,
    name: '페트병',
    category: 'bottle',
    estimatedWeight: 20,
    description: '500ml 기준',
  },
  {
    id: 3,
    name: '일회용 컵',
    category: 'cup',
    estimatedWeight: 15,
    description: '플라스틱 음료 컵',
  },
  {
    id: 4,
    name: '커피컵',
    category: 'cup',
    estimatedWeight: 15,
    description: '테이크아웃 커피컵',
  },
  {
    id: 5,
    name: '비닐봉지',
    category: 'bag',
    estimatedWeight: 5,
    description: '마트 비닐봉지',
  },
  {
    id: 6,
    name: '쇼핑백',
    category: 'bag',
    estimatedWeight: 10,
    description: '플라스틱 쇼핑백',
  },
  {
    id: 7,
    name: '플라스틱 용기',
    category: 'container',
    estimatedWeight: 30,
    description: '배달 음식 용기',
  },
  {
    id: 8,
    name: '도시락 용기',
    category: 'container',
    estimatedWeight: 35,
    description: '일회용 도시락 용기',
  },
  {
    id: 9,
    name: '플라스틱 빨대',
    category: 'straw',
    estimatedWeight: 1,
    description: '일회용 플라스틱 빨대',
  },
  {
    id: 10,
    name: '일회용 포크',
    category: 'utensil',
    estimatedWeight: 3,
    description: '일회용 플라스틱 포크',
  },
  {
    id: 11,
    name: '일회용 숟가락',
    category: 'utensil',
    estimatedWeight: 4,
    description: '일회용 플라스틱 숟가락',
  },
  {
    id: 12,
    name: '일회용 젓가락',
    category: 'utensil',
    estimatedWeight: 3,
    description: '일회용 플라스틱 젓가락',
  },
  {
    id: 13,
    name: '비닐 랩',
    category: 'packaging',
    estimatedWeight: 2,
    description: '식품 포장용 비닐 랩',
  },
  {
    id: 14,
    name: '지퍼백',
    category: 'packaging',
    estimatedWeight: 5,
    description: '플라스틱 지퍼백',
  },
  {
    id: 15,
    name: '스티로폼',
    category: 'packaging',
    estimatedWeight: 10,
    description: '포장용 스티로폼',
  },
];
