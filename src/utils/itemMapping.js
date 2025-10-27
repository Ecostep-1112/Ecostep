// Supabase item_name → item_id 매핑
// FishIcons와 DecorationIcons는 item_id를 키로 사용합니다

export const fishNameToId = {
  '코리도라스': 'fish_01',
  '체리바브': 'fish_02',
  '네온테트라': 'fish_03',
  '아피스토그라마': 'fish_04',
  '람시클리드': 'fish_05',
  '구피': 'fish_06',
  '엔젤피쉬': 'fish_07',
  '킬리피쉬': 'fish_08',
  '베타': 'fish_09',
  '디스커스': 'fish_10',
  '만다린피쉬': 'fish_11',
  '아로와나': 'fish_12'
};

export const decorationNameToId = {
  '해초': 'decoration_01',
  '용암석': 'decoration_02',
  '작은 동굴': 'decoration_03',
  '산호': 'decoration_04',
  '드리프트 우드': 'decoration_05',
  '조개 껍질': 'decoration_06',
  '그리스 신전': 'decoration_07',
  '보물 상자': 'decoration_08',
  '해적선': 'decoration_09',
  '크리스탈 동굴': 'decoration_10',
  'LED 해파리': 'decoration_11',
  '아틀란티스 유적': 'decoration_12'
};

// 헬퍼 함수
export const getFishId = (name) => fishNameToId[name] || name;
export const getDecorationId = (name) => decorationNameToId[name] || name;
