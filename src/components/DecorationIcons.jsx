import React from 'react';

const DecorationIcons = {
  // 브론즈 랭크 장식품
  해초: () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 왼쪽 해초 */}
      <path 
        d="M18 50 C18 45, 16 40, 17 35 C18 30, 16 25, 17 20 C18 15, 16 10, 18 5"
        stroke="url(#seaweed1)" 
        strokeWidth="3" 
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M18 50 C18 45, 20 40, 19 35 C18 30, 20 25, 19 20 C18 15, 20 10, 18 5"
        fill="url(#seaweed1Fill)" 
      />
      
      {/* 중앙 해초 */}
      <path 
        d="M30 50 C30 44, 28 38, 30 32 C32 26, 28 20, 30 14 C32 8, 28 4, 30 2"
        stroke="url(#seaweed2)" 
        strokeWidth="4" 
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M30 50 C30 44, 32 38, 30 32 C28 26, 32 20, 30 14 C28 8, 32 4, 30 2"
        fill="url(#seaweed2Fill)" 
      />
      
      {/* 오른쪽 해초 */}
      <path 
        d="M42 50 C42 46, 44 42, 42 38 C40 34, 44 30, 42 26 C40 22, 44 18, 42 14"
        stroke="url(#seaweed3)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M42 50 C42 46, 40 42, 42 38 C44 34, 40 30, 42 26 C44 22, 40 18, 42 14"
        fill="url(#seaweed3Fill)" 
      />
      
      {/* 추가 작은 해초들 */}
      <path 
        d="M12 50 C12 47, 11 44, 12 41 C13 38, 11 35, 12 32"
        stroke="#4caf50" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
      <path 
        d="M48 50 C48 47, 49 44, 48 41 C47 38, 49 35, 48 32"
        stroke="#66bb6a" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
      
      <defs>
        <linearGradient id="seaweed1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2d5016" />
          <stop offset="100%" stopColor="#7cb342" />
        </linearGradient>
        <linearGradient id="seaweed1Fill" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#388e3c" />
          <stop offset="100%" stopColor="#81c784" />
        </linearGradient>
        <linearGradient id="seaweed2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1b5e20" />
          <stop offset="100%" stopColor="#66bb6a" />
        </linearGradient>
        <linearGradient id="seaweed2Fill" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2e7d32" />
          <stop offset="100%" stopColor="#81c784" />
        </linearGradient>
        <linearGradient id="seaweed3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2e7d32" />
          <stop offset="100%" stopColor="#9ccc65" />
        </linearGradient>
        <linearGradient id="seaweed3Fill" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#43a047" />
          <stop offset="100%" stopColor="#aed581" />
        </linearGradient>
      </defs>
    </svg>
  ),
  
  용암석: () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 메인 돌 모양 - 울퉁불퉁한 화산석 */}
      <path 
        d="M12 40 C11 35, 12 30, 15 25 C18 20, 22 17, 28 16 C34 15, 39 17, 43 21 C47 25, 48 30, 47 35 C46 40, 44 43, 40 45 C36 47, 31 47, 26 46 C21 45, 17 43, 15 40 C13 37, 12 40, 12 40"
        fill="url(#lavaRock)" 
      />
      
      {/* 큰 구멍들 */}
      <ellipse cx="20" cy="30" rx="3" ry="4" fill="#1a1a1a"/>
      <ellipse cx="34" cy="28" rx="3.5" ry="3" fill="#0d0d0d"/>
      <ellipse cx="27" cy="37" rx="2.5" ry="3" fill="#1a1a1a"/>
      <ellipse cx="38" cy="35" rx="3" ry="2.5" fill="#0d0d0d"/>
      
      {/* 중간 구멍들 */}
      <circle cx="24" cy="25" r="1.8" fill="#2a2a2a"/>
      <circle cx="31" cy="32" r="2" fill="#1a1a1a"/>
      <circle cx="40" cy="30" r="1.5" fill="#2a2a2a"/>
      
      {/* 작은 구멍들 */}
      <circle cx="17" cy="35" r="1" fill="#333333"/>
      <circle cx="22" cy="40" r="0.8" fill="#333333"/>
      <circle cx="35" cy="23" r="0.7" fill="#333333"/>
      <circle cx="42" cy="38" r="0.9" fill="#333333"/>
      <circle cx="15" cy="28" r="0.6" fill="#333333"/>
      
      {/* 돌 표면 하이라이트 */}
      <ellipse cx="28" cy="20" rx="10" ry="4" fill="url(#lavaHighlight)"/>
      
      {/* 울퉁불퉁한 가장자리 */}
      <path 
        d="M12 40 C13 39, 14 40, 15 39"
        stroke="#4a4a4a" 
        strokeWidth="1"
        fill="none"
      />
      <path 
        d="M43 25 C44 24, 45 25, 46 24"
        stroke="#4a4a4a" 
        strokeWidth="1"
        fill="none"
      />
      
      <defs>
        <linearGradient id="lavaRock" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6a6a6a" />
          <stop offset="25%" stopColor="#5a5a5a" />
          <stop offset="50%" stopColor="#4a4a4a" />
          <stop offset="75%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
        <radialGradient id="lavaHighlight">
          <stop offset="0%" stopColor="#8a8a8a" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#6a6a6a" stopOpacity="0.1"/>
        </radialGradient>
      </defs>
    </svg>
  ),
  
  '작은 동굴': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 동굴 외형 - 더 입체적으로 */}
      <path 
        d="M10 45 C10 38, 11 31, 15 26 C19 21, 24 18, 30 18 C36 18, 41 21, 45 26 C49 31, 50 38, 50 45 L10 45"
        fill="url(#caveOuter)" 
      />
      
      {/* 동굴 중간층 */}
      <path 
        d="M13 45 C13 39, 14 33, 18 29 C22 25, 26 23, 30 23 C34 23, 38 25, 42 29 C46 33, 47 39, 47 45 L13 45"
        fill="url(#caveMiddle)" 
      />
      
      {/* 동굴 입구 */}
      <path 
        d="M18 45 C18 40, 19 35, 23 32 C27 29, 28 28, 30 28 C32 28, 33 29, 37 32 C41 35, 42 40, 42 45 L18 45"
        fill="url(#caveInner)" 
      />
      
      {/* 돌 질감과 디테일 */}
      <circle cx="15" cy="35" r="2" fill="#8d6e63" opacity="0.6"/>
      <circle cx="45" cy="35" r="2" fill="#8d6e63" opacity="0.6"/>
      <circle cx="22" cy="28" r="1.5" fill="#a1887f" opacity="0.5"/>
      <circle cx="38" cy="28" r="1.5" fill="#a1887f" opacity="0.5"/>
      <circle cx="12" cy="42" r="1" fill="#6d4c41" opacity="0.4"/>
      <circle cx="48" cy="42" r="1" fill="#6d4c41" opacity="0.4"/>
      
      {/* 그림자 효과 */}
      <ellipse cx="30" cy="45" rx="12" ry="2" fill="#3e2723" opacity="0.3"/>
      
      <defs>
        <linearGradient id="caveOuter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a1887f" />
          <stop offset="100%" stopColor="#6d4c41" />
        </linearGradient>
        <linearGradient id="caveMiddle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8d6e63" />
          <stop offset="100%" stopColor="#5d4037" />
        </linearGradient>
        <radialGradient id="caveInner">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="70%" stopColor="#2e2e2e" />
          <stop offset="100%" stopColor="#3e2723" />
        </radialGradient>
      </defs>
    </svg>
  ),
  
  // 실버 랭크 장식품
  산호: () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 메인 줄기 */}
      <path 
        d="M30 50 L30 35 M30 35 L25 25 M30 35 L35 25"
        stroke="url(#coralMain)" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* 왼쪽 가지들 - 더 복잡하게 */}
      <path 
        d="M25 25 L20 20 M25 25 L22 18 M20 20 L16 18 M20 20 L18 15"
        stroke="url(#coralBranch1)" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      <path 
        d="M22 18 L19 14 M16 18 L14 15 M18 15 L15 12"
        stroke="url(#coralBranch1)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* 오른쪽 가지들 - 더 복잡하게 */}
      <path 
        d="M35 25 L40 20 M35 25 L38 18 M40 20 L44 18 M40 20 L42 15"
        stroke="url(#coralBranch2)" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      <path 
        d="M38 18 L41 14 M44 18 L46 15 M42 15 L45 12"
        stroke="url(#coralBranch2)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* 중간 가지들 */}
      <path 
        d="M30 35 L27 30 M30 35 L33 30 M27 30 L25 27 M33 30 L35 27"
        stroke="url(#coralSmall)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* 끝 장식 - 더 많이 */}
      <circle cx="16" cy="18" r="2.5" fill="#ff6b6b"/>
      <circle cx="18" cy="15" r="2.5" fill="#ff8787"/>
      <circle cx="22" cy="18" r="2.5" fill="#ff6b6b"/>
      <circle cx="19" cy="14" r="2" fill="#ff9999"/>
      <circle cx="14" cy="15" r="2" fill="#ff7777"/>
      <circle cx="15" cy="12" r="1.5" fill="#ffaaaa"/>
      
      <circle cx="44" cy="18" r="2.5" fill="#ff6b6b"/>
      <circle cx="42" cy="15" r="2.5" fill="#ff8787"/>
      <circle cx="38" cy="18" r="2.5" fill="#ff6b6b"/>
      <circle cx="41" cy="14" r="2" fill="#ff9999"/>
      <circle cx="46" cy="15" r="2" fill="#ff7777"/>
      <circle cx="45" cy="12" r="1.5" fill="#ffaaaa"/>
      
      <circle cx="27" cy="30" r="2" fill="#ff9999"/>
      <circle cx="33" cy="30" r="2" fill="#ff9999"/>
      <circle cx="25" cy="27" r="1.5" fill="#ffaaaa"/>
      <circle cx="35" cy="27" r="1.5" fill="#ffaaaa"/>
      
      <defs>
        <linearGradient id="coralMain" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#c62828" />
          <stop offset="100%" stopColor="#ff5252" />
        </linearGradient>
        <linearGradient id="coralBranch1" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d32f2f" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
        <linearGradient id="coralBranch2" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#d32f2f" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
        <linearGradient id="coralSmall" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#e53935" />
          <stop offset="100%" stopColor="#ff8787" />
        </linearGradient>
      </defs>
    </svg>
  ),
  
  '드리프트 우드': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 메인 나무 줄기 - 자연스러운 유목 형태 */}
      <path 
        d="M8 35 C10 33, 15 32, 22 31 C28 30, 35 30, 40 28 C45 26, 48 23, 49 20 C50 17, 48 14, 44 12 C40 10, 34 9, 28 10 C22 11, 16 13, 12 17 C8 21, 7 26, 8 30 C9 34, 8 35, 8 35"
        fill="url(#driftwood)" 
      />
      
      {/* 나뭇가지 1 */}
      <path 
        d="M40 28 C43 26, 46 23, 48 19 C50 15, 51 12, 51 12"
        stroke="#6d4c41" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* 나뭇가지 2 */}
      <path 
        d="M22 31 C19 29, 15 27, 12 23 C9 19, 8 16, 8 16"
        stroke="#5d4037" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
      
      {/* 나뭇가지 3 */}
      <path 
        d="M30 30 C30 27, 32 24, 35 21"
        stroke="#795548" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* 나이테 패턴 - 나무 단면 */}
      <ellipse cx="28" cy="22" rx="12" ry="6" stroke="#4e342e" strokeWidth="1" fill="none"/>
      <ellipse cx="28" cy="22" rx="10" ry="5" stroke="#5d4037" strokeWidth="0.8" fill="none" opacity="0.8"/>
      <ellipse cx="28" cy="22" rx="8" ry="4" stroke="#5d4037" strokeWidth="0.6" fill="none" opacity="0.6"/>
      <ellipse cx="28" cy="22" rx="6" ry="3" stroke="#5d4037" strokeWidth="0.5" fill="none" opacity="0.5"/>
      <ellipse cx="28" cy="22" rx="4" ry="2" stroke="#5d4037" strokeWidth="0.4" fill="none" opacity="0.4"/>
      <ellipse cx="28" cy="22" rx="2" ry="1" stroke="#5d4037" strokeWidth="0.3" fill="none" opacity="0.3"/>
      
      {/* 나무 질감 - 세로 결 */}
      <line x1="10" y1="18" x2="46" y2="15" stroke="#5d4037" strokeWidth="0.8" opacity="0.5"/>
      <line x1="11" y1="22" x2="45" y2="19" stroke="#5d4037" strokeWidth="0.7" opacity="0.5"/>
      <line x1="10" y1="26" x2="46" y2="23" stroke="#5d4037" strokeWidth="0.6" opacity="0.5"/>
      <line x1="11" y1="30" x2="44" y2="27" stroke="#5d4037" strokeWidth="0.5" opacity="0.5"/>
      <line x1="12" y1="33" x2="40" y2="30" stroke="#5d4037" strokeWidth="0.5" opacity="0.4"/>
      
      {/* 나무 옹이와 균열 */}
      <circle cx="18" cy="24" r="2.5" fill="#4e342e" opacity="0.7"/>
      <circle cx="36" cy="26" r="2" fill="#4e342e" opacity="0.6"/>
      <circle cx="25" cy="28" r="1.5" fill="#4e342e" opacity="0.5"/>
      
      {/* 균열 */}
      <path d="M20 20 L22 23 L21 26" stroke="#3e2723" strokeWidth="0.5" fill="none"/>
      <path d="M38 24 L39 27 L38 29" stroke="#3e2723" strokeWidth="0.5" fill="none"/>
      
      <defs>
        <linearGradient id="driftwood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a1887f" />
          <stop offset="20%" stopColor="#8d6e63" />
          <stop offset="50%" stopColor="#6d4c41" />
          <stop offset="80%" stopColor="#5d4037" />
          <stop offset="100%" stopColor="#4e342e" />
        </linearGradient>
      </defs>
    </svg>
  ),
  
  '조개 껍질': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 소라 껍질 메인 - 더 나선형으로 */}
      <path 
        d="M30 48 C40 48, 46 42, 46 34 C46 26, 42 20, 36 17 C30 14, 24 15, 20 19 C16 23, 15 28, 17 33 C19 38, 22 41, 26 42 C30 43, 33 41, 34 38 C35 35, 34 32, 32 30 C30 28, 28 27, 27 27"
        fill="url(#shellMain)" 
      />
      
      {/* 나선 무늬 - 더 선명하게 */}
      <path 
        d="M30 40 C35 40, 38 37, 38 33 C38 29, 36 26, 33 24 C30 22, 27 22, 25 24 C23 26, 22 28, 23 31 C24 34, 26 35, 28 36 C30 37, 31 36, 32 35 C33 34, 33 33, 32 32"
        stroke="url(#shellSpiral)" 
        strokeWidth="1.2" 
        fill="none"
      />
      <path 
        d="M30 36 C33 36, 35 34, 35 31 C35 28, 33 26, 31 25 C29 24, 27 24, 26 26 C25 28, 25 29, 26 30 C27 31, 28 32, 29 32"
        stroke="url(#shellSpiral2)" 
        strokeWidth="0.8" 
        fill="none"
      />
      
      {/* 하이라이트와 광택 */}
      <ellipse cx="35" cy="28" rx="7" ry="9" fill="url(#shellHighlight)"/>
      <ellipse cx="32" cy="32" rx="4" ry="5" fill="url(#shellHighlight2)"/>
      
      {/* 진주 효과 */}
      <circle cx="33" cy="30" r="2" fill="url(#pearl)"/>
      <circle cx="28" cy="34" r="1.5" fill="url(#pearl2)"/>
      
      {/* 껍질 라인 디테일 */}
      <path d="M20 30 C22 29, 24 29, 26 30" stroke="#ff8a65" strokeWidth="0.5" opacity="0.4"/>
      <path d="M22 34 C24 33, 26 33, 28 34" stroke="#ff8a65" strokeWidth="0.5" opacity="0.4"/>
      <path d="M24 38 C26 37, 28 37, 30 38" stroke="#ff8a65" strokeWidth="0.5" opacity="0.4"/>
      
      <defs>
        <linearGradient id="shellMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffccbc" />
          <stop offset="30%" stopColor="#ffab91" />
          <stop offset="70%" stopColor="#ff8a65" />
          <stop offset="100%" stopColor="#ff7043" />
        </linearGradient>
        <linearGradient id="shellSpiral" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6e40" />
          <stop offset="100%" stopColor="#ff5722" />
        </linearGradient>
        <linearGradient id="shellSpiral2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff5722" />
          <stop offset="100%" stopColor="#e64a19" />
        </linearGradient>
        <radialGradient id="shellHighlight">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="shellHighlight2">
          <stop offset="0%" stopColor="#fff3e0" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="pearl">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#fce4ec" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#f8bbd0" stopOpacity="0.5"/>
        </radialGradient>
        <radialGradient id="pearl2">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#fce4ec" stopOpacity="0.4"/>
        </radialGradient>
      </defs>
    </svg>
  ),
  
  // 골드 랭크 장식품
  '그리스 신전': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 지붕 */}
      <path 
        d="M8 20 L30 8 L52 20 L52 23 L8 23 Z"
        fill="url(#templeRoof)" 
      />
      
      {/* 지붕 디테일 */}
      <path d="M30 8 L30 12" stroke="#e0e0e0" strokeWidth="1"/>
      <path d="M20 14 L40 14" stroke="#e0e0e0" strokeWidth="0.5"/>
      
      {/* 기둥들 - 더 웅장하게 */}
      <rect x="12" y="23" width="5" height="22" fill="url(#pillar1)" rx="0.5"/>
      <rect x="20" y="23" width="5" height="22" fill="url(#pillar2)" rx="0.5"/>
      <rect x="28" y="23" width="5" height="22" fill="url(#pillar3)" rx="0.5"/>
      <rect x="36" y="23" width="5" height="22" fill="url(#pillar4)" rx="0.5"/>
      <rect x="44" y="23" width="5" height="22" fill="url(#pillar5)" rx="0.5"/>
      
      {/* 기둥 상단 장식 */}
      <rect x="11" y="20" width="7" height="3.5" fill="url(#pillarTop)" rx="0.3"/>
      <rect x="19" y="20" width="7" height="3.5" fill="url(#pillarTop)" rx="0.3"/>
      <rect x="27" y="20" width="7" height="3.5" fill="url(#pillarTop)" rx="0.3"/>
      <rect x="35" y="20" width="7" height="3.5" fill="url(#pillarTop)" rx="0.3"/>
      <rect x="43" y="20" width="7" height="3.5" fill="url(#pillarTop)" rx="0.3"/>
      
      {/* 기둥 세로 홈 */}
      <line x1="14" y1="24" x2="14" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="15" y1="24" x2="15" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="22" y1="24" x2="22" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="23" y1="24" x2="23" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="30" y1="24" x2="30" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="31" y1="24" x2="31" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="38" y1="24" x2="38" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="39" y1="24" x2="39" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="46" y1="24" x2="46" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      <line x1="47" y1="24" x2="47" y2="44" stroke="#bdbdbd" strokeWidth="0.5"/>
      
      {/* 바닥 */}
      <rect x="8" y="45" width="44" height="3" fill="url(#templeBase)"/>
      
      {/* 계단 */}
      <rect x="10" y="48" width="40" height="2" fill="#bdbdbd"/>
      <rect x="12" y="50" width="36" height="1.5" fill="#9e9e9e"/>
      <rect x="14" y="51.5" width="32" height="1" fill="#757575"/>
      
      <defs>
        <linearGradient id="templeRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="pillar1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="pillar2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="pillar3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="pillar4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="pillar5" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="pillarTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="templeBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#bdbdbd" />
        </linearGradient>
      </defs>
    </svg>
  ),
  
  '보물 상자': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 상자 뚜껑 (열린 상태) */}
      <g transform="rotate(-20 30 25)">
        <path 
          d="M15 25 C15 22, 17 20, 20 20 L40 20 C43 20, 45 22, 45 25 L45 28 L15 28 Z"
          fill="url(#chestLid)" 
        />
        {/* 뚜껑 장식 */}
        <rect x="15" y="23" width="30" height="1" fill="url(#goldBand)"/>
      </g>
      
      {/* 상자 본체 */}
      <rect x="15" y="28" width="30" height="18" fill="url(#chestBody)" rx="2"/>
      
      {/* 금속 장식 */}
      <rect x="13" y="30" width="34" height="2.5" fill="url(#metalBand1)"/>
      <rect x="13" y="42" width="34" height="2.5" fill="url(#metalBand2)"/>
      
      {/* 자물쇠 */}
      <circle cx="30" cy="37" r="3.5" fill="url(#lock)"/>
      <rect x="28.5" y="37" width="3" height="4" fill="#ffb300"/>
      <circle cx="30" cy="38" r="1" fill="#5d4037"/>
      
      {/* 보물들 - 더 화려하게 */}
      <circle cx="22" cy="31" r="2.5" fill="url(#gold1)"/>
      <circle cx="38" cy="31" r="2.5" fill="url(#gold2)"/>
      <circle cx="25" cy="29" r="2" fill="url(#gold3)"/>
      <circle cx="35" cy="29" r="2" fill="url(#gold4)"/>
      <circle cx="30" cy="28" r="2.5" fill="url(#gold5)"/>
      
      {/* 보석들 */}
      <rect x="27" y="30" width="2" height="2" fill="#e91e63" transform="rotate(45 28 31)"/>
      <rect x="32" y="29" width="2" height="2" fill="#2196f3" transform="rotate(45 33 30)"/>
      <circle cx="20" cy="29" r="1" fill="#4caf50"/>
      <circle cx="40" cy="29" r="1" fill="#9c27b0"/>
      
      {/* 반짝임 효과 */}
      <circle cx="22" cy="31" r="0.5" fill="white">
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="38" cy="31" r="0.5" fill="white">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="30" cy="28" r="0.5" fill="white">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="27" cy="30" r="0.3" fill="white">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="33" cy="29" r="0.3" fill="white">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/>
      </circle>
      
      <defs>
        <linearGradient id="chestLid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8d6e63" />
          <stop offset="100%" stopColor="#6d4c41" />
        </linearGradient>
        <linearGradient id="chestBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6d4c41" />
          <stop offset="100%" stopColor="#5d4037" />
        </linearGradient>
        <linearGradient id="metalBand1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffc107" />
          <stop offset="50%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#ffc107" />
        </linearGradient>
        <linearGradient id="metalBand2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffc107" />
          <stop offset="50%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#ffc107" />
        </linearGradient>
        <linearGradient id="goldBand" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb300" />
          <stop offset="50%" stopColor="#ffd54f" />
          <stop offset="100%" stopColor="#ffb300" />
        </linearGradient>
        <radialGradient id="lock">
          <stop offset="0%" stopColor="#ffd54f" />
          <stop offset="100%" stopColor="#ffc107" />
        </radialGradient>
        <radialGradient id="gold1">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="100%" stopColor="#ffd700" />
        </radialGradient>
        <radialGradient id="gold2">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="100%" stopColor="#ffd700" />
        </radialGradient>
        <radialGradient id="gold3">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#ffc107" />
        </radialGradient>
        <radialGradient id="gold4">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#ffc107" />
        </radialGradient>
        <radialGradient id="gold5">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="100%" stopColor="#ffb300" />
        </radialGradient>
      </defs>
    </svg>
  ),
  
  해적선: () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 배 본체 - 더 디테일하게 */}
      <path 
        d="M8 36 C8 40, 12 42, 20 43 L40 43 C48 42, 52 40, 52 36 L50 32 L48 28 L12 28 L10 32 Z"
        fill="url(#shipHull)" 
      />
      
      {/* 갑판 */}
      <rect x="12" y="26" width="36" height="3" fill="url(#deck)"/>
      
      {/* 메인 돛대 */}
      <rect x="29" y="8" width="2" height="20" fill="#5d4037"/>
      
      {/* 큰 돛 (찢어진 효과) */}
      <path 
        d="M31 10 L44 12 L43 18 L41 20 L43 22 L40 24 L31 25 Z"
        fill="url(#sail1)" 
      />
      <path 
        d="M29 10 L16 12 L17 18 L19 20 L17 22 L20 24 L29 25 Z"
        fill="url(#sail2)" 
      />
      
      {/* 돛 찢어진 부분 */}
      <path d="M38 20 L40 18 L41 20" fill="none" stroke="#bcaaa4" strokeWidth="0.5"/>
      <path d="M22 20 L20 18 L19 20" fill="none" stroke="#bcaaa4" strokeWidth="0.5"/>
      
      {/* 해적 깃발 */}
      <path 
        d="M31 8 L40 9 L40 14 L31 13 Z"
        fill="#000000" 
      />
      {/* 해골 */}
      <circle cx="35" cy="10.5" r="1.2" fill="white"/>
      <circle cx="34.5" cy="10.3" r="0.3" fill="black"/>
      <circle cx="35.5" cy="10.3" r="0.3" fill="black"/>
      <path d="M34 11.5 L36 11.5" stroke="white" strokeWidth="0.5"/>
      <path d="M33.5 12 L36.5 12" stroke="white" strokeWidth="0.5"/>
      
      {/* 대포 구멍 */}
      <ellipse cx="18" cy="35" rx="2" ry="1.5" fill="#1a1a1a"/>
      <ellipse cx="26" cy="35" rx="2" ry="1.5" fill="#1a1a1a"/>
      <ellipse cx="34" cy="35" rx="2" ry="1.5" fill="#1a1a1a"/>
      <ellipse cx="42" cy="35" rx="2" ry="1.5" fill="#1a1a1a"/>
      
      {/* 나무 질감 */}
      <line x1="14" y1="30" x2="46" y2="30" stroke="#6d4c41" strokeWidth="0.5" opacity="0.5"/>
      <line x1="14" y1="33" x2="46" y2="33" stroke="#6d4c41" strokeWidth="0.5" opacity="0.5"/>
      <line x1="14" y1="37" x2="46" y2="37" stroke="#6d4c41" strokeWidth="0.5" opacity="0.5"/>
      <line x1="14" y1="40" x2="46" y2="40" stroke="#6d4c41" strokeWidth="0.5" opacity="0.5"/>
      
      {/* 풍화 효과 */}
      <circle cx="20" cy="31" r="0.5" fill="#3e2723" opacity="0.4"/>
      <circle cx="35" cy="32" r="0.5" fill="#3e2723" opacity="0.4"/>
      <circle cx="42" cy="30" r="0.5" fill="#3e2723" opacity="0.4"/>
      
      {/* 밧줄 */}
      <path d="M29 25 C25 26, 20 27, 15 28" stroke="#8d6e63" strokeWidth="0.8" fill="none"/>
      <path d="M31 25 C35 26, 40 27, 45 28" stroke="#8d6e63" strokeWidth="0.8" fill="none"/>
      
      <defs>
        <linearGradient id="shipHull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6d4c41" />
          <stop offset="50%" stopColor="#5d4037" />
          <stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
        <linearGradient id="deck" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8d6e63" />
          <stop offset="100%" stopColor="#6d4c41" />
        </linearGradient>
        <linearGradient id="sail1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#efebe9" />
          <stop offset="100%" stopColor="#bcaaa4" />
        </linearGradient>
        <linearGradient id="sail2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#efebe9" />
          <stop offset="100%" stopColor="#bcaaa4" />
        </linearGradient>
      </defs>
    </svg>
  ),
  
  // 플래티넘 랭크 장식품 (블러 완전 제거, 100% 선명)
  '크리스탈 동굴': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 동굴 외형 */}
      <path 
        d="M8 45 C8 36, 10 27, 16 22 C22 17, 28 15, 30 15 C32 15, 38 17, 44 22 C50 27, 52 36, 52 45 L8 45"
        fill="url(#crystalCaveOuter)" 
      />
      
      {/* 크리스탈들 - 더 선명하고 다양하게 */}
      <path d="M18 42 L20 28 L22 42 Z" fill="url(#crystal1)"/>
      <path d="M23 44 L26 25 L29 44 Z" fill="url(#crystal2)"/>
      <path d="M30 42 L33 20 L36 42 Z" fill="url(#crystal3)"/>
      <path d="M37 44 L40 30 L43 44 Z" fill="url(#crystal4)"/>
      
      {/* 작은 크리스탈들 */}
      <path d="M15 40 L16 35 L17 40 Z" fill="url(#crystal5)"/>
      <path d="M45 40 L46 35 L47 40 Z" fill="url(#crystal6)"/>
      
      {/* 크리스탈 하이라이트 */}
      <path d="M20 32 L20.5 30 L21 32 Z" fill="white"/>
      <path d="M26 28 L26.5 26 L27 28 Z" fill="white"/>
      <path d="M33 24 L33.5 22 L34 24 Z" fill="white"/>
      <path d="M40 34 L40.5 32 L41 34 Z" fill="white"/>
      
      {/* 반짝임 효과 */}
      <circle cx="20" cy="35" r="1.2" fill="white">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="33" cy="28" r="1.2" fill="white">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="40" cy="37" r="1" fill="white">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="26" cy="32" r="0.8" fill="white">
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      
      {/* 동굴 입구 */}
      <ellipse cx="30" cy="42" rx="10" ry="6" fill="url(#crystalCaveInner)"/>
      
      {/* 추가 디테일 */}
      <circle cx="14" cy="38" r="0.5" fill="#b388ff"/>
      <circle cx="46" cy="38" r="0.5" fill="#b388ff"/>
      <circle cx="30" cy="40" r="0.5" fill="#7c4dff"/>
      
      <defs>
        <linearGradient id="crystalCaveOuter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a148c" />
          <stop offset="50%" stopColor="#6a1b9a" />
          <stop offset="100%" stopColor="#1a237e" />
        </linearGradient>
        <radialGradient id="crystalCaveInner">
          <stop offset="0%" stopColor="#000033" />
          <stop offset="60%" stopColor="#1a237e" />
          <stop offset="100%" stopColor="#311b92" />
        </radialGradient>
        <linearGradient id="crystal1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7c4dff" />
          <stop offset="100%" stopColor="#b388ff" />
        </linearGradient>
        <linearGradient id="crystal2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#536dfe" />
          <stop offset="100%" stopColor="#8c9eff" />
        </linearGradient>
        <linearGradient id="crystal3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#651fff" />
          <stop offset="100%" stopColor="#a255ff" />
        </linearGradient>
        <linearGradient id="crystal4" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#448aff" />
          <stop offset="100%" stopColor="#82b1ff" />
        </linearGradient>
        <linearGradient id="crystal5" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7e57c2" />
          <stop offset="100%" stopColor="#9575cd" />
        </linearGradient>
        <linearGradient id="crystal6" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#5e35b1" />
          <stop offset="100%" stopColor="#7e57c2" />
        </linearGradient>
      </defs>
    </svg>
  ),
  
  'LED 해파리': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 해파리 머리 - 선명하게 */}
      <ellipse cx="30" cy="25" rx="16" ry="13" fill="url(#jellyHead)"/>
      
      {/* 내부 발광 효과 */}
      <ellipse cx="30" cy="25" rx="12" ry="10" fill="url(#jellyGlow)">
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      
      {/* 내부 패턴 */}
      <ellipse cx="30" cy="25" rx="8" ry="6" fill="url(#jellyInner)"/>
      
      {/* 촉수들 - 더 선명하고 많이 */}
      <path 
        d="M18 32 C18 37, 16 42, 18 47 C20 52, 18 54, 18 54"
        stroke="url(#tentacle1)" 
        strokeWidth="2" 
        fill="none"
      >
        <animate attributeName="d" 
          values="M18 32 C18 37, 16 42, 18 47 C20 52, 18 54, 18 54;
                  M18 32 C18 37, 20 42, 18 47 C16 52, 18 54, 18 54;
                  M18 32 C18 37, 16 42, 18 47 C20 52, 18 54, 18 54"
          dur="4s" repeatCount="indefinite"/>
      </path>
      
      <path 
        d="M24 34 C24 39, 22 44, 24 49"
        stroke="url(#tentacle2)" 
        strokeWidth="1.8" 
        fill="none"
      >
        <animate attributeName="d" 
          values="M24 34 C24 39, 22 44, 24 49;
                  M24 34 C24 39, 26 44, 24 49;
                  M24 34 C24 39, 22 44, 24 49"
          dur="3.5s" repeatCount="indefinite"/>
      </path>
      
      <path 
        d="M30 35 C30 40, 32 45, 30 50"
        stroke="url(#tentacle3)" 
        strokeWidth="2" 
        fill="none"
      >
        <animate attributeName="d" 
          values="M30 35 C30 40, 32 45, 30 50;
                  M30 35 C30 40, 28 45, 30 50;
                  M30 35 C30 40, 32 45, 30 50"
          dur="3s" repeatCount="indefinite"/>
      </path>
      
      <path 
        d="M36 34 C36 39, 38 44, 36 49"
        stroke="url(#tentacle4)" 
        strokeWidth="1.8" 
        fill="none"
      >
        <animate attributeName="d" 
          values="M36 34 C36 39, 38 44, 36 49;
                  M36 34 C36 39, 34 44, 36 49;
                  M36 34 C36 39, 38 44, 36 49"
          dur="3.8s" repeatCount="indefinite"/>
      </path>
      
      <path 
        d="M42 32 C42 37, 44 42, 42 47 C40 52, 42 54, 42 54"
        stroke="url(#tentacle5)" 
        strokeWidth="2" 
        fill="none"
      >
        <animate attributeName="d" 
          values="M42 32 C42 37, 44 42, 42 47 C40 52, 42 54, 42 54;
                  M42 32 C42 37, 40 42, 42 47 C44 52, 42 54, 42 54;
                  M42 32 C42 37, 44 42, 42 47 C40 52, 42 54, 42 54"
          dur="4.2s" repeatCount="indefinite"/>
      </path>
      
      {/* 추가 얇은 촉수들 */}
      <path d="M21 33 C21 38, 20 43, 21 48" stroke="#4fc3f7" strokeWidth="1" fill="none"/>
      <path d="M27 35 C27 40, 28 45, 27 50" stroke="#4fc3f7" strokeWidth="1" fill="none"/>
      <path d="M33 35 C33 40, 32 45, 33 50" stroke="#4fc3f7" strokeWidth="1" fill="none"/>
      <path d="M39 33 C39 38, 40 43, 39 48" stroke="#4fc3f7" strokeWidth="1" fill="none"/>
      
      {/* LED 발광 점들 - 더 선명하게 */}
      <circle cx="24" cy="23" r="2" fill="#ffffff">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="36" cy="23" r="2" fill="#ffffff">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="30" cy="28" r="2" fill="#ffffff">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="27" cy="25" r="1.5" fill="#e1f5fe">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="33" cy="25" r="1.5" fill="#e1f5fe">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      
      <defs>
        <radialGradient id="jellyHead">
          <stop offset="0%" stopColor="#e1f5fe"/>
          <stop offset="50%" stopColor="#81d4fa"/>
          <stop offset="100%" stopColor="#4fc3f7"/>
        </radialGradient>
        <radialGradient id="jellyGlow">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="50%" stopColor="#b3e5fc"/>
          <stop offset="100%" stopColor="#81d4fa"/>
        </radialGradient>
        <radialGradient id="jellyInner">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#e1f5fe"/>
        </radialGradient>
        <linearGradient id="tentacle1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4fc3f7"/>
          <stop offset="100%" stopColor="#0288d1"/>
        </linearGradient>
        <linearGradient id="tentacle2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4fc3f7"/>
          <stop offset="100%" stopColor="#0288d1"/>
        </linearGradient>
        <linearGradient id="tentacle3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4fc3f7"/>
          <stop offset="100%" stopColor="#0288d1"/>
        </linearGradient>
        <linearGradient id="tentacle4" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4fc3f7"/>
          <stop offset="100%" stopColor="#0288d1"/>
        </linearGradient>
        <linearGradient id="tentacle5" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4fc3f7"/>
          <stop offset="100%" stopColor="#0288d1"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  
  '아틀란티스 유적': () => (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 메인 건물 - 더 웅장하게 */}
      <path 
        d="M18 45 L18 28 L22 24 L26 21 L30 20 L34 21 L38 24 L42 28 L42 45 Z"
        fill="url(#atlantisMain)" 
      />
      
      {/* 중앙 탑 */}
      <rect x="27" y="15" width="6" height="30" fill="url(#atlantisTower)"/>
      
      {/* 탑 꼭대기 - 피라미드 형태 */}
      <path 
        d="M27 15 L30 8 L33 15 Z"
        fill="url(#atlantisTop)" 
      />
      <circle cx="30" cy="10" r="1.5" fill="#80cbc4"/>
      
      {/* 옆 탑들 */}
      <rect x="15" y="32" width="4" height="13" fill="url(#atlantisSide1)"/>
      <rect x="41" y="32" width="4" height="13" fill="url(#atlantisSide2)"/>
      
      {/* 기둥들 */}
      <rect x="20" y="30" width="2.5" height="15" fill="#4db6ac"/>
      <rect x="24" y="30" width="2.5" height="15" fill="#4db6ac"/>
      <rect x="33.5" y="30" width="2.5" height="15" fill="#4db6ac"/>
      <rect x="37.5" y="30" width="2.5" height="15" fill="#4db6ac"/>
      
      {/* 아치 문 */}
      <path 
        d="M26 45 L26 36 C26 33, 28 31, 30 31 C32 31, 34 33, 34 36 L34 45"
        fill="url(#atlantisDoor)" 
      />
      
      {/* 고대 문양들 - 더 많이 */}
      <circle cx="30" cy="24" r="3.5" stroke="#80cbc4" strokeWidth="0.8" fill="none"/>
      <path d="M27 24 L30 20 L33 24 L30 28 Z" fill="#80cbc4"/>
      
      <circle cx="22" cy="35" r="2" stroke="#4db6ac" strokeWidth="0.5" fill="none"/>
      <circle cx="38" cy="35" r="2" stroke="#4db6ac" strokeWidth="0.5" fill="none"/>
      
      {/* 삼각형 문양 */}
      <path d="M29 17 L30 15.5 L31 17 Z" fill="#26a69a"/>
      <path d="M16 35 L17 33.5 L18 35 Z" fill="#26a69a"/>
      <path d="M42 35 L43 33.5 L44 35 Z" fill="#26a69a"/>
      
      {/* 부서진 부분 디테일 */}
      <path 
        d="M18 45 L20 43 L19 41 L21 40 L18 38"
        fill="#26a69a" 
      />
      <path 
        d="M42 45 L40 44 L41 42 L39 41 L42 39"
        fill="#26a69a" 
      />
      
      {/* 물결 효과 */}
      <path 
        d="M12 47 C18 46, 24 48, 30 47 C36 46, 42 48, 48 47"
        stroke="#4dd0e1" 
        strokeWidth="0.8" 
        fill="none"
      >
        <animate attributeName="d" 
          values="M12 47 C18 46, 24 48, 30 47 C36 46, 42 48, 48 47;
                  M12 47 C18 48, 24 46, 30 47 C36 48, 42 46, 48 47;
                  M12 47 C18 46, 24 48, 30 47 C36 46, 42 48, 48 47"
          dur="3s" repeatCount="indefinite"/>
      </path>
      <path 
        d="M14 49 C20 48, 26 50, 32 49 C38 48, 44 50, 50 49"
        stroke="#29b6f6" 
        strokeWidth="0.6" 
        fill="none"
      >
        <animate attributeName="d" 
          values="M14 49 C20 48, 26 50, 32 49 C38 48, 44 50, 50 49;
                  M14 49 C20 50, 26 48, 32 49 C38 50, 44 48, 50 49;
                  M14 49 C20 48, 26 50, 32 49 C38 48, 44 50, 50 49"
          dur="2.5s" repeatCount="indefinite"/>
      </path>
      
      <defs>
        <linearGradient id="atlantisMain" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00897b" />
          <stop offset="50%" stopColor="#26a69a" />
          <stop offset="100%" stopColor="#4db6ac" />
        </linearGradient>
        <linearGradient id="atlantisTower" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00695c" />
          <stop offset="50%" stopColor="#00897b" />
          <stop offset="100%" stopColor="#26a69a" />
        </linearGradient>
        <linearGradient id="atlantisTop" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#26a69a" />
          <stop offset="100%" stopColor="#80cbc4" />
        </linearGradient>
        <linearGradient id="atlantisSide1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00796b" />
          <stop offset="100%" stopColor="#4db6ac" />
        </linearGradient>
        <linearGradient id="atlantisSide2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00796b" />
          <stop offset="100%" stopColor="#4db6ac" />
        </linearGradient>
        <radialGradient id="atlantisDoor">
          <stop offset="0%" stopColor="#004d40" />
          <stop offset="70%" stopColor="#00251a" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>
    </svg>
  )
};

export default DecorationIcons;