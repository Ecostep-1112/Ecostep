import React from 'react';

// 물고기 SVG 아이콘 컴포넌트
const FishIcons = {
  // 12위: 코리도라스 - 바닥 메기
  코리도라스: ({ size = 40, color = '#8B7355' }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 80 48">
      <g>
        {/* 몸통 - 납작한 바닥형 */}
        <ellipse cx="40" cy="28" rx="24" ry="12" fill={color} />
        <ellipse cx="40" cy="26" rx="22" ry="10" fill="#A0826D" />
        {/* 배 부분 - 더 밝게 */}
        <ellipse cx="40" cy="30" rx="18" ry="6" fill="#D2B48C" opacity="0.7" />
        {/* 수염 - 6개 */}
        <path d="M 16 30 Q 10 32 8 34" stroke="#5C4033" strokeWidth="1.5" fill="none" />
        <path d="M 16 30 Q 10 30 8 30" stroke="#5C4033" strokeWidth="1.5" fill="none" />
        <path d="M 16 30 Q 10 28 8 26" stroke="#5C4033" strokeWidth="1.5" fill="none" />
        {/* 등지느러미 - 뾰족한 형태 */}
        <path d="M 32 18 L 35 10 L 40 15 L 45 10 L 48 18" fill={color} />
        {/* 가슴지느러미 - 바닥에 닿는 형태 */}
        <ellipse cx="25" cy="32" rx="6" ry="3" fill="#8B7355" transform="rotate(-30 25 32)" />
        <ellipse cx="55" cy="32" rx="6" ry="3" fill="#8B7355" transform="rotate(30 55 32)" />
        {/* 꼬리지느러미 */}
        <path d="M 64 28 L 74 20 L 72 28 L 74 36 L 64 28" fill={color} />
        {/* 눈 */}
        <circle cx="24" cy="25" r="3" fill="black" />
        <circle cx="24.5" cy="24.5" r="1.2" fill="white" />
        {/* 점박이 무늬 */}
        <circle cx="35" cy="26" r="2.5" fill="#6B5D54" opacity="0.7" />
        <circle cx="42" cy="27" r="3" fill="#6B5D54" opacity="0.7" />
        <circle cx="50" cy="26" r="2.5" fill="#6B5D54" opacity="0.7" />
        <circle cx="38" cy="30" r="2" fill="#6B5D54" opacity="0.7" />
        <circle cx="46" cy="30" r="2" fill="#6B5D54" opacity="0.7" />
      </g>
    </svg>
  ),

  // 11위: 체리바브 - 붉은색 잉어과
  체리바브: ({ size = 40, color = '#DC143C' }) => (
    <svg width={size} height={size * 0.8} viewBox="0 0 70 56">
      <g>
        {/* 몸통 - 통통한 체형 */}
        <ellipse cx="35" cy="28" rx="20" ry="16" fill={color} />
        <ellipse cx="35" cy="28" rx="18" ry="14" fill="#FF6B6B" />
        {/* 배 부분 */}
        <ellipse cx="35" cy="32" rx="14" ry="10" fill="#FFB6C1" opacity="0.8" />
        {/* 수염 - 작은 수염 2개 */}
        <line x1="18" y1="30" x2="14" y2="31" stroke="#8B0000" strokeWidth="1" />
        <line x1="18" y1="30" x2="14" y2="29" stroke="#8B0000" strokeWidth="1" />
        {/* 등지느러미 */}
        <path d="M 28 16 Q 35 10 42 16" fill="#FF1744" />
        {/* 배지느러미 */}
        <path d="M 28 40 Q 35 46 42 40" fill="#FF1744" />
        {/* 가슴지느러미 */}
        <ellipse cx="22" cy="30" rx="5" ry="3" fill="#FF1744" transform="rotate(-20 22 30)" />
        {/* 꼬리지느러미 - 갈라진 형태 */}
        <path d="M 55 28 L 65 20 L 62 28 L 65 36 L 55 28" fill="#FF1744" />
        {/* 눈 */}
        <circle cx="20" cy="26" r="3" fill="black" />
        <circle cx="20.5" cy="25.5" r="1.2" fill="white" />
        {/* 비늘 반짝임 */}
        <ellipse cx="35" cy="26" rx="4" ry="6" fill="#FF8A80" opacity="0.4" />
        <ellipse cx="42" cy="28" rx="3" ry="5" fill="#FF8A80" opacity="0.4" />
      </g>
    </svg>
  ),

  // 10위: 네온테트라 - 작고 반짝이는
  네온테트라: ({ size = 35, color = '#00CED1' }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 70 42">
      <g>
        {/* 몸통 - 유선형 */}
        <ellipse cx="35" cy="21" rx="18" ry="10" fill="#C0C0C0" />
        <ellipse cx="35" cy="21" rx="16" ry="8" fill="#DCDCDC" />
        {/* 네온 블루 라인 - 더 밝게 */}
        <path d="M 18 18 Q 25 17 32 17 T 46 18" stroke={color} strokeWidth="4" fill="none" />
        <path d="M 18 18 Q 25 17 32 17 T 46 18" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.8" />
        {/* 빨간 라인 - 꼬리쪽 */}
        <path d="M 32 24 Q 38 24 46 24" stroke="#FF0000" strokeWidth="3" fill="none" />
        <path d="M 32 24 Q 38 24 46 24" stroke="#FF6347" strokeWidth="1.5" fill="none" opacity="0.8" />
        {/* 투명한 지느러미 */}
        <path d="M 28 13 Q 35 9 42 13" fill="rgba(255,255,255,0.4)" />
        <path d="M 28 29 Q 35 33 42 29" fill="rgba(255,255,255,0.4)" />
        {/* 가슴지느러미 */}
        <ellipse cx="22" cy="23" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
        {/* 꼬리지느러미 */}
        <path d="M 53 21 L 61 15 L 60 21 L 61 27 L 53 21" fill="rgba(255,255,255,0.5)" />
        {/* 눈 - 크고 선명 */}
        <circle cx="20" cy="19" r="2.5" fill="black" />
        <circle cx="20.5" cy="18.5" r="1" fill="white" />
        {/* 네온 효과 */}
        <ellipse cx="35" cy="18" rx="12" ry="2" fill={color} opacity="0.2" />
      </g>
    </svg>
  ),

  // 9위: 아피스토그라마 - 화려한 시클리드 (더 작고 압축된 체형)
  아피스토그라마: ({ size = 40, color = '#FFD700' }) => (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40">
      <g>
        {/* 몸통 - 매우 작고 납작하게 압축 */}
        <ellipse cx="40" cy="20" rx="18" ry="8" fill={color} />
        <ellipse cx="40" cy="20" rx="16" ry="7" fill="#FFA500" />
        {/* 배 부분 - 노란색 */}
        <ellipse cx="40" cy="22" rx="12" ry="4" fill="#FFFF00" opacity="0.8" />
        {/* 짧은 등지느러미 */}
        <path d="M 26 14 Q 30 10 34 14 T 42 10 T 50 14 T 54 14" fill="#FF8C00" />
        {/* 짧은 뒷지느러미 */}
        <path d="M 26 26 Q 30 30 34 26 T 42 30 T 50 26 T 54 26" fill="#FF8C00" />
        {/* 배지느러미 - 작게 */}
        <path d="M 34 24 L 33 28 L 35 27 Z" fill="#FFA500" />
        <path d="M 46 24 L 45 28 L 47 27 Z" fill="#FFA500" />
        {/* 작은 꼬리지느러미 */}
        <path d="M 58 20 L 65 16 L 64 20 L 65 24 L 58 20" fill="#FF4500" />
        {/* 가슴지느러미 */}
        <ellipse cx="28" cy="21" rx="4" ry="2" fill="#FFB300" opacity="0.8" transform="rotate(-20 28 21)" />
        {/* 눈 */}
        <circle cx="26" cy="18" r="2" fill="black" />
        <circle cx="26.5" cy="17.5" r="0.7" fill="white" />
        {/* 체측 무늬 */}
        <circle cx="40" cy="20" r="2" fill="#FF6347" opacity="0.7" />
        <ellipse cx="46" cy="19" rx="1.5" ry="2" fill="#FF4500" opacity="0.6" />
      </g>
    </svg>
  ),

  // 8위: 람 시클리드 - 둥근 원반형 (노란색 배 더욱 강조, 가로 방향)
  람시클리드: ({ size = 45, color = '#4169E1' }) => (
    <svg width={size * 1.1} height={size * 0.8} viewBox="0 0 88 64">
      <g>
        {/* 원반형 몸통 - 가로로 배치 */}
        <ellipse cx="40" cy="32" rx="26" ry="22" fill={color} />
        <ellipse cx="40" cy="32" rx="24" ry="20" fill="#6495ED" />
        {/* 노란색 배 부분 */}
        <ellipse cx="40" cy="38" rx="20" ry="14" fill="#FFD700" />
        <ellipse cx="40" cy="40" rx="16" ry="10" fill="#FFA500" opacity="0.9" />
        {/* 높은 등지느러미 */}
        <path d="M 20 14 Q 30 6 40 10 T 60 14" fill="#1E90FF" />
        <circle cx="30" cy="10" r="1.5" fill="#00BFFF" />
        <circle cx="40" cy="8" r="1.5" fill="#00BFFF" />
        <circle cx="50" cy="10" r="1.5" fill="#00BFFF" />
        {/* 긴 뒷지느러미 */}
        <path d="M 20 50 Q 30 58 40 54 T 60 50" fill="#1E90FF" />
        {/* 배지느러미 */}
        <path d="M 32 44 L 28 54 L 34 52 Z" fill="#4169E1" />
        <path d="M 48 44 L 44 54 L 50 52 Z" fill="#4169E1" />
        {/* 둥근 꼬리지느러미 */}
        <ellipse cx="66" cy="32" rx="10" ry="14" fill="#1E90FF" />
        {/* 가슴지느러미 */}
        <ellipse cx="24" cy="34" rx="7" ry="4" fill="#6495ED" transform="rotate(-15 24 34)" />
        {/* 눈 */}
        <circle cx="22" cy="28" r="3.5" fill="#FF0000" />
        <circle cx="22" cy="28" r="3" fill="black" />
        <circle cx="22.5" cy="27.5" r="1.2" fill="white" />
        {/* 검은 세로줄 */}
        <rect x="38" y="22" width="3" height="20" fill="black" opacity="0.7" />
        {/* 빨간 점 */}
        <circle cx="34" cy="32" r="2.5" fill="#FF0000" opacity="0.9" />
        {/* 파란색 반짝임 */}
        <circle cx="28" cy="24" r="1.5" fill="#00BFFF" opacity="0.6" />
        <circle cx="46" cy="26" r="1.5" fill="#00BFFF" opacity="0.6" />
      </g>
    </svg>
  ),

  // 7위: 구피 - 작은 몸 큰 꼬리 (몸통:꼬리 = 1:2.5)
  구피: ({ size = 45, color = '#FF69B4' }) => (
    <svg width={size * 1.3} height={size * 0.8} viewBox="0 0 117 72">
      <g>
        {/* 아주 작은 몸통 */}
        <ellipse cx="20" cy="36" rx="8" ry="5" fill="#87CEEB" />
        <ellipse cx="20" cy="36" rx="6" ry="3.5" fill="#ADD8E6" />
        {/* 거대한 꼬리 - 몸통의 2.5배 */}
        <path d="M 28 36 Q 65 5 75 36 Q 65 67 28 36" fill={color} />
        <path d="M 30 36 Q 63 10 70 36 Q 63 62 30 36" fill="#FF1493" opacity="0.8" />
        <path d="M 32 36 Q 60 15 65 36 Q 60 57 32 36" fill="#FFB6C1" opacity="0.6" />
        {/* 꼬리 무늬 */}
        <circle cx="45" cy="28" r="3" fill="#00CED1" />
        <circle cx="55" cy="36" r="3.5" fill="#00CED1" />
        <circle cx="45" cy="44" r="3" fill="#00CED1" />
        <circle cx="50" cy="20" r="2.5" fill="#FFD700" opacity="0.7" />
        <circle cx="50" cy="52" r="2.5" fill="#FFD700" opacity="0.7" />
        <circle cx="60" cy="30" r="2" fill="#FF00FF" opacity="0.5" />
        <circle cx="60" cy="42" r="2" fill="#FF00FF" opacity="0.5" />
        {/* 작은 지느러미 */}
        <path d="M 16 32 Q 20 29 24 32" fill="#FF69B4" />
        <ellipse cx="18" cy="39" rx="1.5" ry="1" fill="#FF69B4" />
        {/* 눈 */}
        <circle cx="14" cy="34" r="1.8" fill="black" />
        <circle cx="14.5" cy="33.5" r="0.7" fill="white" />
      </g>
    </svg>
  ),

  // 6위: 엔젤피쉬 - 극단적인 다이아몬드 체형 (가로 방향)
  엔젤피쉬: ({ size = 50, color = '#C0C0C0' }) => (
    <svg width={size * 1.2} height={size * 0.8} viewBox="0 0 96 64">
      <g transform="rotate(90 32 32) translate(-16 16)">
        {/* 극도로 날카로운 다이아몬드 형태 */}
        <path d="M 32 8 L 12 32 L 32 56 L 52 32 Z" fill={color} />
        <path d="M 32 10 L 14 32 L 32 54 L 50 32 Z" fill="#E5E5E5" />
        {/* 높은 등지느러미 */}
        <path d="M 20 15 Q 32 5 44 15" fill="#A9A9A9" />
        {/* 낮은 배지느러미 */}
        <path d="M 20 49 Q 32 59 44 49" fill="#A9A9A9" />
        {/* 늘어진 배지느러미 */}
        <path d="M 24 40 L 20 52 L 26 50 Z" fill="#A9A9A9" />
        <path d="M 40 40 L 44 52 L 38 50 Z" fill="#A9A9A9" />
        {/* 가슴지느러미 */}
        <ellipse cx="20" cy="32" rx="8" ry="3" fill="#A9A9A9" opacity="0.8" transform="rotate(-30 20 32)" />
        {/* 꼬리지느러미 */}
        <path d="M 52 32 L 60 24 L 58 32 L 60 40 L 52 32" fill="#A9A9A9" />
        {/* 검은 줄무늬 */}
        <rect x="22" y="26" width="2" height="12" fill="black" opacity="0.8" />
        <rect x="30" y="24" width="2" height="16" fill="black" opacity="0.8" />
        <rect x="38" y="26" width="2" height="12" fill="black" opacity="0.8" />
        <rect x="44" y="29" width="1.5" height="6" fill="black" opacity="0.8" />
        {/* 눈 */}
        <circle cx="18" cy="30" r="2.5" fill="black" />
        <circle cx="18.5" cy="29.5" r="1" fill="white" />
      </g>
    </svg>
  ),

  // 5위: 킬리피쉬 - 길쭉하고 화려한 (등지느러미 매우 뒤쪽)
  킬리피쉬: ({ size = 45, color = '#FF4500' }) => (
    <svg width={size} height={size * 0.6} viewBox="0 0 90 54">
      <g>
        {/* 길쭉한 몸통 */}
        <ellipse cx="45" cy="27" rx="28" ry="12" fill={color} />
        <ellipse cx="45" cy="27" rx="26" ry="10" fill="#FF6347" />
        {/* 무지개빛 비늘 효과 */}
        <ellipse cx="35" cy="25" rx="8" ry="4" fill="#FFD700" opacity="0.5" />
        <ellipse cx="50" cy="26" rx="8" ry="4" fill="#00CED1" opacity="0.5" />
        {/* 노란 점 무늬 */}
        <circle cx="30" cy="27" r="2.5" fill="#FFD700" />
        <circle cx="40" cy="26" r="3" fill="#FFD700" />
        <circle cx="50" cy="27" r="2.5" fill="#FFD700" />
        <circle cx="60" cy="26" r="2" fill="#FFD700" />
        {/* 빨간 점 무늬 */}
        <circle cx="35" cy="29" r="2" fill="#FF0000" opacity="0.8" />
        <circle cx="45" cy="29" r="2" fill="#FF0000" opacity="0.8" />
        <circle cx="55" cy="29" r="2" fill="#FF0000" opacity="0.8" />
        {/* 등지느러미 - 매우 뒤쪽 (4/5 지점) */}
        <path d="M 65 19 Q 68 13 72 19" fill="#FF8C00" />
        <circle cx="68" cy="16" r="1" fill="#FFD700" opacity="0.7" />
        {/* 뒷지느러미 - 매우 뒤쪽 */}
        <path d="M 65 35 Q 68 41 72 35" fill="#FF8C00" />
        <circle cx="68" cy="38" r="1" fill="#FFD700" opacity="0.7" />
        {/* 가슴지느러미 */}
        <ellipse cx="28" cy="30" rx="5" ry="3" fill="#FF6347" transform="rotate(-20 28 30)" />
        {/* 꼬리지느러미 */}
        <path d="M 73 27 L 84 18 L 82 27 L 84 36 L 73 27" fill="#FF8C00" />
        <circle cx="78" cy="27" r="1.5" fill="#FFD700" />
        {/* 눈 */}
        <circle cx="22" cy="25" r="3" fill="black" />
        <circle cx="22.5" cy="24.5" r="1.2" fill="white" />
        {/* 청록색 라인 */}
        <path d="M 25 24 Q 45 23 65 24" stroke="#00CED1" strokeWidth="1" fill="none" opacity="0.7" />
        {/* 보라색 반짝임 */}
        <circle cx="38" cy="24" r="1.5" fill="#9370DB" opacity="0.5" />
        <circle cx="52" cy="25" r="1.5" fill="#9370DB" opacity="0.5" />
      </g>
    </svg>
  ),

  // 4위: 베타 - 화려한 지느러미
  베타: ({ size = 50, color = '#8B008B' }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g>
        {/* 몸통 */}
        <ellipse cx="45" cy="50" rx="18" ry="14" fill={color} />
        <ellipse cx="45" cy="50" rx="16" ry="12" fill="#9370DB" />
        {/* 몸통 그라데이션 */}
        <ellipse cx="45" cy="48" rx="12" ry="8" fill="#BA55D3" opacity="0.6" />
        {/* 화려한 긴 등지느러미 - 크라운테일 */}
        <path d="M 30 38 Q 25 20 30 28 T 40 20 T 50 28 T 60 38" fill="#8A2BE2" opacity="0.9" />
        <path d="M 32 38 L 30 25 L 35 30 L 38 22 L 42 30 L 45 20 L 48 30 L 52 22 L 55 30 L 58 25 L 60 38" 
              fill="#9400D3" opacity="0.7" />
        {/* 화려한 긴 뒷지느러미 */}
        <path d="M 30 62 Q 25 80 30 72 T 40 80 T 50 72 T 60 62" fill="#8A2BE2" opacity="0.9" />
        <path d="M 32 62 L 30 75 L 35 70 L 38 78 L 42 70 L 45 80 L 48 70 L 52 78 L 55 70 L 58 75 L 60 62" 
              fill="#9400D3" opacity="0.7" />
        {/* 화려한 꼬리 - 하프문 */}
        <path d="M 63 50 Q 80 25 75 50 Q 80 75 63 50" fill="#9400D3" opacity="0.9" />
        <path d="M 61 50 Q 75 30 70 50 Q 75 70 61 50" fill="#8B008B" opacity="0.8" />
        <path d="M 59 50 Q 70 35 65 50 Q 70 65 59 50" fill="#BA55D3" opacity="0.6" />
        {/* 가슴지느러미 - 크고 화려 */}
        <ellipse cx="35" cy="54" rx="10" ry="6" fill="#9370DB" opacity="0.9" transform="rotate(-20 35 54)" />
        {/* 눈 */}
        <circle cx="30" cy="47" r="3" fill="black" />
        <circle cx="30.5" cy="46.5" r="1.2" fill="white" />
        {/* 반짝임 효과 */}
        <circle cx="45" cy="47" r="2" fill="#E6E6FA" opacity="0.7" />
        <circle cx="52" cy="50" r="2" fill="#E6E6FA" opacity="0.7" />
        {/* 비늘 광택 */}
        <ellipse cx="48" cy="48" rx="6" ry="8" fill="#DDA0DD" opacity="0.4" />
      </g>
    </svg>
  ),

  // 3위: 디스커스 - 원반형 왕
  디스커스: ({ size = 55, color = '#FF8C00' }) => (
    <svg width={size} height={size} viewBox="0 0 110 110">
      <g>
        {/* 완벽한 원반형 몸통 */}
        <circle cx="55" cy="55" r="35" fill={color} />
        <circle cx="55" cy="55" r="33" fill="#FFA500" />
        {/* 그라데이션 효과 */}
        <circle cx="55" cy="55" r="28" fill="#FFB347" opacity="0.7" />
        <circle cx="55" cy="55" r="20" fill="#FFDAB9" opacity="0.5" />
        {/* 세로 줄무늬 9개 */}
        <rect x="35" y="30" width="3" height="50" fill="#8B4513" opacity="0.7" />
        <rect x="42" y="25" width="3" height="60" fill="#8B4513" opacity="0.7" />
        <rect x="49" y="20" width="3" height="70" fill="#8B4513" opacity="0.7" />
        <rect x="56" y="20" width="3" height="70" fill="#8B4513" opacity="0.7" />
        <rect x="63" y="25" width="3" height="60" fill="#8B4513" opacity="0.7" />
        <rect x="70" y="30" width="3" height="50" fill="#8B4513" opacity="0.7" />
        <rect x="77" y="35" width="2" height="40" fill="#8B4513" opacity="0.6" />
        <rect x="82" y="40" width="2" height="30" fill="#8B4513" opacity="0.5" />
        {/* 등지느러미 */}
        <path d="M 55 20 Q 40 5 70 5 Q 70 20 55 20" fill="#FF6347" />
        <circle cx="50" cy="12" r="1.5" fill="#FFD700" />
        <circle cx="60" cy="12" r="1.5" fill="#FFD700" />
        {/* 뒷지느러미 */}
        <path d="M 55 90 Q 40 105 70 105 Q 70 90 55 90" fill="#FF6347" />
        <circle cx="50" cy="98" r="1.5" fill="#FFD700" />
        <circle cx="60" cy="98" r="1.5" fill="#FFD700" />
        {/* 꼬리지느러미 */}
        <ellipse cx="90" cy="55" rx="10" ry="18" fill="#FF6347" />
        <ellipse cx="88" cy="55" rx="7" ry="14" fill="#FF8C00" opacity="0.8" />
        {/* 가슴지느러미 */}
        <ellipse cx="30" cy="60" rx="12" ry="7" fill="#FFA500" opacity="0.9" transform="rotate(-20 30 60)" />
        {/* 눈 - 빨간 테두리 */}
        <circle cx="38" cy="50" r="4" fill="#DC143C" />
        <circle cx="38" cy="50" r="3.5" fill="black" />
        <circle cx="38.5" cy="49.5" r="1.3" fill="white" />
        {/* 청록색 반점 */}
        <circle cx="55" cy="45" r="2" fill="#00CED1" opacity="0.7" />
        <circle cx="60" cy="55" r="2" fill="#00CED1" opacity="0.7" />
        <circle cx="55" cy="65" r="2" fill="#00CED1" opacity="0.7" />
      </g>
    </svg>
  ),

  // 2위: 만다린피쉬 - 극도로 화려한
  만다린피쉬: ({ size = 50, color = '#FF4500' }) => (
    <svg width={size} height={size * 0.8} viewBox="0 0 100 80">
      <g>
        {/* 몸통 - 둥근 형태 */}
        <ellipse cx="50" cy="40" rx="28" ry="18" fill="#FF8C00" />
        <ellipse cx="50" cy="40" rx="26" ry="16" fill="#FF7F50" />
        {/* 복잡한 미로 무늬 - 파란색 라인 */}
        <path d="M 25 38 Q 30 33 35 38 T 45 38 T 55 38 T 65 38 T 75 38" 
              fill="none" stroke="#00CED1" strokeWidth="3" />
        <path d="M 25 42 Q 30 47 35 42 T 45 42 T 55 42 T 65 42 T 75 42" 
              fill="none" stroke="#1E90FF" strokeWidth="3" />
        <path d="M 30 35 Q 35 30 40 35 T 50 35 T 60 35 T 70 35" 
              fill="none" stroke="#00BFFF" strokeWidth="2" />
        <path d="M 30 45 Q 35 50 40 45 T 50 45 T 60 45 T 70 45" 
              fill="none" stroke="#4169E1" strokeWidth="2" />
        {/* 초록색 무늬 */}
        <circle cx="35" cy="38" r="3" fill="#00FF00" opacity="0.6" />
        <circle cx="50" cy="35" r="3" fill="#00FF00" opacity="0.6" />
        <circle cx="65" cy="38" r="3" fill="#00FF00" opacity="0.6" />
        {/* 주황색 점 */}
        <circle cx="40" cy="40" r="2.5" fill="#FF4500" />
        <circle cx="50" cy="38" r="3" fill="#FF4500" />
        <circle cx="60" cy="40" r="2.5" fill="#FF4500" />
        <circle cx="45" cy="43" r="2" fill="#FF6347" />
        <circle cx="55" cy="43" r="2" fill="#FF6347" />
        {/* 보라색 테두리 */}
        <ellipse cx="50" cy="40" rx="26" ry="16" fill="none" stroke="#8A2BE2" strokeWidth="1" opacity="0.7" />
        {/* 등지느러미 - 큰 부채꼴 */}
        <path d="M 35 28 Q 50 18 65 28" fill="#FF8C00" />
        <circle cx="45" cy="24" r="1.5" fill="#00CED1" />
        <circle cx="50" cy="22" r="1.5" fill="#00CED1" />
        <circle cx="55" cy="24" r="1.5" fill="#00CED1" />
        {/* 뒷지느러미 */}
        <path d="M 35 52 Q 50 62 65 52" fill="#FF8C00" />
        {/* 가슴지느러미 - 투명 */}
        <ellipse cx="32" cy="43" rx="7" ry="5" fill="#FFA500" opacity="0.7" transform="rotate(-20 32 43)" />
        {/* 꼬리지느러미 - 둥근 부채꼴 */}
        <path d="M 78 40 Q 90 30 88 40 Q 90 50 78 40" fill="#FF8C00" />
        <circle cx="83" cy="40" r="2" fill="#00CED1" />
        {/* 큰 눈 */}
        <circle cx="30" cy="37" r="4" fill="black" />
        <circle cx="30.5" cy="36.5" r="1.5" fill="white" />
        {/* 형광 효과 */}
        <ellipse cx="50" cy="38" rx="20" ry="10" fill="#00FFFF" opacity="0.15" />
      </g>
    </svg>
  ),

  // 1위: 플라티넘 아로와나 - 용의 왕
  플라티넘아로와나: ({ size = 60, color = '#C0C0C0' }) => (
    <svg width={size * 1.5} height={size * 0.7} viewBox="0 0 180 84">
      <g>
        {/* 긴 용 같은 몸통 */}
        <ellipse cx="90" cy="42" rx="60" ry="20" fill={color} />
        <ellipse cx="90" cy="42" rx="58" ry="18" fill="#E5E5E5" />
        {/* 플라티넘 메탈릭 광택 */}
        <ellipse cx="75" cy="36" rx="30" ry="12" fill="#F8F8FF" opacity="0.7" />
        <ellipse cx="100" cy="38" rx="25" ry="10" fill="#F8F8FF" opacity="0.5" />
        <ellipse cx="120" cy="40" rx="20" ry="8" fill="#F8F8FF" opacity="0.4" />
        {/* 큰 비늘 패턴 - 다이아몬드 */}
        <path d="M 45 42 L 48 39 L 51 42 L 48 45 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 55 40 L 58 37 L 61 40 L 58 43 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 65 42 L 68 39 L 71 42 L 68 45 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 75 40 L 78 37 L 81 40 L 78 43 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 85 42 L 88 39 L 91 42 L 88 45 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 95 40 L 98 37 L 101 40 L 98 43 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 105 42 L 108 39 L 111 42 L 108 45 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 115 40 L 118 37 L 121 40 L 118 43 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        <path d="M 125 42 L 128 39 L 131 42 L 128 45 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        {/* 수염 - 2개 */}
        <path d="M 30 46 Q 22 48 18 50" stroke="#808080" strokeWidth="2" fill="none" />
        <path d="M 30 46 Q 22 44 18 42" stroke="#808080" strokeWidth="2" fill="none" />
        {/* 등지느러미 - 길고 낮음 */}
        <path d="M 50 28 Q 90 22 130 28" fill="#D3D3D3" />
        <circle cx="70" cy="26" r="1" fill="#C0C0C0" />
        <circle cx="90" cy="24" r="1" fill="#C0C0C0" />
        <circle cx="110" cy="26" r="1" fill="#C0C0C0" />
        {/* 뒷지느러미 - 길고 낮음 */}
        <path d="M 60 56 Q 90 62 120 56" fill="#D3D3D3" />
        {/* 배지느러미 */}
        <ellipse cx="70" cy="52" rx="5" ry="3" fill="#D3D3D3" />
        <ellipse cx="110" cy="52" rx="5" ry="3" fill="#D3D3D3" />
        {/* 가슴지느러미 - 크고 강력 */}
        <ellipse cx="50" cy="48" rx="12" ry="6" fill="#D3D3D3" transform="rotate(-20 50 48)" />
        {/* 꼬리지느러미 - 강력한 추진력 */}
        <path d="M 150 42 L 170 28 L 165 42 L 170 56 L 150 42" fill="#D3D3D3" />
        <path d="M 148 42 L 165 30 L 160 42 L 165 54 L 148 42" fill="#C0C0C0" opacity="0.7" />
        {/* 눈 - 위를 향함 */}
        <circle cx="38" cy="38" r="4" fill="black" />
        <circle cx="38.5" cy="37.5" r="1.5" fill="white" />
        {/* 금색 광채 */}
        <circle cx="90" cy="42" r="3" fill="#FFD700" opacity="0.3" />
        <circle cx="70" cy="40" r="2" fill="#FFD700" opacity="0.3" />
        <circle cx="110" cy="40" r="2" fill="#FFD700" opacity="0.3" />
      </g>
    </svg>
  )
};

export default FishIcons;