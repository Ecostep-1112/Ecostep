import React from 'react';

const DecorationIcons = {
  // 브론즈 랭크 장식품
  해초: ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="seaweed-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.3"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="seaweed1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1b5e20" />
          <stop offset="35%" stopColor="#2e7d32" />
          <stop offset="70%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#81c784" />
        </linearGradient>
        <linearGradient id="seaweed2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1b5e20" />
          <stop offset="30%" stopColor="#388e3c" />
          <stop offset="65%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#81c784" />
        </linearGradient>
        <linearGradient id="seaweed3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2e7d32" />
          <stop offset="40%" stopColor="#43a047" />
          <stop offset="75%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#9ccc65" />
        </linearGradient>
        <linearGradient id="seaweed4" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2e7d32" />
          <stop offset="50%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#a5d6a7" />
        </linearGradient>
        <radialGradient id="seaweedHighlight">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g filter="url(#seaweed-shadow)">
        {/* 왼쪽 해초 - 더 자연스러운 곡선 */}
        <path
          d="M16 50 C16 46, 14 42, 15 38 C16 34, 14 30, 15 26 C16 22, 14 18, 15 14 C16 10, 14 6, 16 3"
          stroke="url(#seaweed1)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        {/* 왼쪽 해초 하이라이트 */}
        <path
          d="M16.5 48 C16.5 44, 15 40, 15.5 36 C16 32, 15 28, 15.5 24 C16 20, 15 16, 15.5 12"
          stroke="url(#seaweedHighlight)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 중앙 왼쪽 해초 */}
        <path
          d="M24 50 C24 45, 22 40, 24 35 C26 30, 22 25, 24 20 C26 15, 22 10, 24 5 C26 3, 24 1, 25 0"
          stroke="url(#seaweed2)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        {/* 중앙 왼쪽 해초 하이라이트 */}
        <path
          d="M25 48 C25 43, 24 38, 25 33 C26 28, 24 23, 25 18 C26 13, 24 8, 25 5"
          stroke="url(#seaweedHighlight)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* 중앙 오른쪽 해초 */}
        <path
          d="M36 50 C36 45, 38 40, 36 35 C34 30, 38 25, 36 20 C34 15, 38 10, 36 5 C34 3, 36 1, 35 0"
          stroke="url(#seaweed2)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        {/* 중앙 오른쪽 해초 하이라이트 */}
        <path
          d="M35 48 C35 43, 36 38, 35 33 C34 28, 36 23, 35 18 C34 13, 36 8, 35 5"
          stroke="url(#seaweedHighlight)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* 오른쪽 해초 */}
        <path
          d="M44 50 C44 46, 46 42, 45 38 C44 34, 46 30, 45 26 C44 22, 46 18, 45 14 C44 10, 46 6, 44 3"
          stroke="url(#seaweed3)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        {/* 오른쪽 해초 하이라이트 */}
        <path
          d="M43.5 48 C43.5 44, 45 40, 44.5 36 C44 32, 45 28, 44.5 24 C44 20, 45 16, 44.5 12"
          stroke="url(#seaweedHighlight)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 작은 해초들 - 더 다양하게 */}
        <path
          d="M10 50 C10 47, 9 44, 10 41 C11 38, 9 35, 10 32 C11 29, 9 26, 10 24"
          stroke="url(#seaweed4)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M50 50 C50 47, 51 44, 50 41 C49 38, 51 35, 50 32 C49 29, 51 26, 50 24"
          stroke="url(#seaweed4)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* 미세한 잎사귀 디테일 */}
        <path d="M24 40 Q 21 39, 22 38" stroke="#81c784" strokeWidth="0.8" fill="none" opacity="0.6"/>
        <path d="M24 28 Q 27 27, 26 26" stroke="#81c784" strokeWidth="0.8" fill="none" opacity="0.6"/>
        <path d="M36 40 Q 39 39, 38 38" stroke="#81c784" strokeWidth="0.8" fill="none" opacity="0.6"/>
        <path d="M36 28 Q 33 27, 34 26" stroke="#81c784" strokeWidth="0.8" fill="none" opacity="0.6"/>
      </g>
    </svg>
  ),

  용암석: ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="lava-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.35"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="lavaRock" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a7a7a" />
          <stop offset="20%" stopColor="#6a6a6a" />
          <stop offset="40%" stopColor="#5a5a5a" />
          <stop offset="60%" stopColor="#4a4a4a" />
          <stop offset="80%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
        <linearGradient id="lavaRockSide" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="50%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
        <radialGradient id="lavaHighlight">
          <stop offset="0%" stopColor="#9a9a9a" stopOpacity="0.5"/>
          <stop offset="50%" stopColor="#7a7a7a" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#6a6a6a" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="lavaHoleDepth1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="60%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </radialGradient>
        <radialGradient id="lavaHoleDepth2">
          <stop offset="0%" stopColor="#050505" />
          <stop offset="70%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>
      </defs>
      <g filter="url(#lava-shadow)">
        {/* 메인 돌 모양 - 더 입체적으로 */}
        <path
          d="M12 40 C11 35, 12 30, 15 25 C18 20, 22 17, 28 16 C34 15, 39 17, 43 21 C47 25, 48 30, 47 35 C46 40, 44 43, 40 45 C36 47, 31 47, 26 46 C21 45, 17 43, 15 40 C13 37, 12 40, 12 40"
          fill="url(#lavaRock)"
        />

        {/* 측면 어두운 부분 - 입체감 */}
        <path
          d="M40 45 C36 47, 31 47, 26 46 C21 45, 17 43, 15 40 C13 37, 12 40, 12 40 C12 41, 13 42, 15 43 C17 44, 21 46, 26 47 C31 48, 36 48, 40 46 C42 45, 41 45, 40 45"
          fill="url(#lavaRockSide)"
          opacity="0.7"
        />

        {/* 큰 구멍들 - 더 깊이감 있게 */}
        <ellipse cx="20" cy="30" rx="3.5" ry="4.5" fill="url(#lavaHoleDepth1)"/>
        <ellipse cx="20" cy="30.5" rx="2.5" ry="3" fill="#0a0a0a"/>

        <ellipse cx="34" cy="28" rx="4" ry="3.5" fill="url(#lavaHoleDepth2)"/>
        <ellipse cx="34" cy="28.5" rx="3" ry="2.5" fill="#050505"/>

        <ellipse cx="27" cy="37" rx="3" ry="3.5" fill="url(#lavaHoleDepth1)"/>
        <ellipse cx="27" cy="37.5" rx="2" ry="2.5" fill="#0a0a0a"/>

        <ellipse cx="38" cy="35" rx="3.5" ry="3" fill="url(#lavaHoleDepth2)"/>
        <ellipse cx="38" cy="35.5" rx="2.5" ry="2" fill="#050505"/>

        {/* 중간 구멍들 */}
        <circle cx="24" cy="25" r="2" fill="url(#lavaHoleDepth1)"/>
        <circle cx="24" cy="25.5" r="1.3" fill="#1a1a1a"/>

        <circle cx="31" cy="32" r="2.3" fill="url(#lavaHoleDepth2)"/>
        <circle cx="31" cy="32.5" r="1.5" fill="#0d0d0d"/>

        <circle cx="40" cy="30" r="1.8" fill="url(#lavaHoleDepth1)"/>
        <circle cx="40" cy="30.5" r="1.2" fill="#1a1a1a"/>

        {/* 작은 구멍들 */}
        <circle cx="17" cy="35" r="1.2" fill="#2a2a2a"/>
        <circle cx="17" cy="35.3" r="0.7" fill="#1a1a1a"/>

        <circle cx="22" cy="40" r="1" fill="#2a2a2a"/>
        <circle cx="22" cy="40.2" r="0.6" fill="#1a1a1a"/>

        <circle cx="35" cy="23" r="0.9" fill="#333333"/>
        <circle cx="35" cy="23.2" r="0.5" fill="#1a1a1a"/>

        <circle cx="42" cy="38" r="1.1" fill="#2a2a2a"/>
        <circle cx="42" cy="38.2" r="0.6" fill="#1a1a1a"/>

        <circle cx="15" cy="28" r="0.8" fill="#333333"/>

        <circle cx="30" cy="22" r="0.7" fill="#333333"/>
        <circle cx="44" cy="32" r="0.8" fill="#333333"/>
        <circle cx="19" cy="38" r="0.6" fill="#333333"/>

        {/* 표면 하이라이트 - 더 강하게 */}
        <ellipse cx="28" cy="20" rx="12" ry="5" fill="url(#lavaHighlight)"/>
        <ellipse cx="32" cy="24" rx="8" ry="4" fill="url(#lavaHighlight)" opacity="0.6"/>

        {/* 울퉁불퉁한 질감 디테일 */}
        <path
          d="M12 40 C13 39, 14 40, 15 39 C16 38, 17 39, 18 38"
          stroke="#5a5a5a"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M43 25 C44 24, 45 25, 46 24 C47 23, 48 24, 49 23"
          stroke="#5a5a5a"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M16 30 C17 29, 18 30, 19 29"
          stroke="#6a6a6a"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M40 40 C41 39, 42 40, 43 39"
          stroke="#6a6a6a"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
      </g>
    </svg>
  ),

  '작은 동굴': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cave-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.35"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="caveOuter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bcaaa4" />
          <stop offset="30%" stopColor="#a1887f" />
          <stop offset="70%" stopColor="#8d6e63" />
          <stop offset="100%" stopColor="#6d4c41" />
        </linearGradient>
        <linearGradient id="caveMiddle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a1887f" />
          <stop offset="40%" stopColor="#8d6e63" />
          <stop offset="80%" stopColor="#6d4c41" />
          <stop offset="100%" stopColor="#5d4037" />
        </linearGradient>
        <linearGradient id="caveInnerLayer" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5d4037" />
          <stop offset="50%" stopColor="#4e342e" />
          <stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
        <radialGradient id="caveInner">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="40%" stopColor="#1a1a1a" />
          <stop offset="80%" stopColor="#2e2e2e" />
          <stop offset="100%" stopColor="#3e2723" />
        </radialGradient>
        <radialGradient id="caveHighlight">
          <stop offset="0%" stopColor="#d7ccc8" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#bcaaa4" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g filter="url(#cave-shadow)">
        {/* 동굴 외형 - 가장 바깥층 */}
        <path
          d="M10 45 C10 38, 11 31, 15 26 C19 21, 24 18, 30 18 C36 18, 41 21, 45 26 C49 31, 50 38, 50 45 L10 45"
          fill="url(#caveOuter)"
        />

        {/* 동굴 중간층 - 3단계 레이어 */}
        <path
          d="M13 45 C13 39, 14 33, 18 29 C22 25, 26 23, 30 23 C34 23, 38 25, 42 29 C46 33, 47 39, 47 45 L13 45"
          fill="url(#caveMiddle)"
        />

        {/* 동굴 내부층 */}
        <path
          d="M16 45 C16 40.5, 17 36, 21 32.5 C25 29, 27.5 27.5, 30 27.5 C32.5 27.5, 35 29, 39 32.5 C43 36, 44 40.5, 44 45 L16 45"
          fill="url(#caveInnerLayer)"
        />

        {/* 동굴 입구 - 더 깊게 */}
        <path
          d="M19 45 C19 41, 20 37, 24 34 C27.5 31, 29 30, 30 30 C31 30, 32.5 31, 36 34 C40 37, 41 41, 41 45 L19 45"
          fill="url(#caveInner)"
        />

        {/* 바위 표면 하이라이트 */}
        <ellipse cx="30" cy="22" rx="10" ry="4" fill="url(#caveHighlight)"/>
        <ellipse cx="20" cy="30" rx="4" ry="6" fill="url(#caveHighlight)" opacity="0.6"/>
        <ellipse cx="40" cy="30" rx="4" ry="6" fill="url(#caveHighlight)" opacity="0.6"/>

        {/* 돌 질감 디테일 - 더 사실적으로 */}
        <circle cx="15" cy="35" r="2.5" fill="#8d6e63" opacity="0.7"/>
        <circle cx="15.5" cy="34.5" r="1" fill="#a1887f" opacity="0.5"/>

        <circle cx="45" cy="35" r="2.5" fill="#8d6e63" opacity="0.7"/>
        <circle cx="45.5" cy="34.5" r="1" fill="#a1887f" opacity="0.5"/>

        <circle cx="22" cy="28" r="2" fill="#a1887f" opacity="0.6"/>
        <circle cx="22.5" cy="27.5" r="0.8" fill="#bcaaa4" opacity="0.4"/>

        <circle cx="38" cy="28" r="2" fill="#a1887f" opacity="0.6"/>
        <circle cx="38.5" cy="27.5" r="0.8" fill="#bcaaa4" opacity="0.4"/>

        <circle cx="12" cy="42" r="1.5" fill="#6d4c41" opacity="0.5"/>
        <circle cx="48" cy="42" r="1.5" fill="#6d4c41" opacity="0.5"/>

        {/* 추가 작은 돌들 */}
        <circle cx="27" cy="23" r="1.2" fill="#8d6e63" opacity="0.5"/>
        <circle cx="33" cy="23" r="1.2" fill="#8d6e63" opacity="0.5"/>
        <circle cx="18" cy="38" r="1" fill="#6d4c41" opacity="0.4"/>
        <circle cx="42" cy="38" r="1" fill="#6d4c41" opacity="0.4"/>

        {/* 균열 디테일 */}
        <path
          d="M14 30 Q 15 32, 14 34"
          stroke="#5d4037"
          strokeWidth="0.6"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M46 30 Q 45 32, 46 34"
          stroke="#5d4037"
          strokeWidth="0.6"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M25 25 Q 26 27, 25 29"
          stroke="#6d4c41"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M35 25 Q 34 27, 35 29"
          stroke="#6d4c41"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />

        {/* 바닥 그림자 효과 - 더 강하게 */}
        <ellipse cx="30" cy="45" rx="14" ry="2.5" fill="#3e2723" opacity="0.4"/>
        <ellipse cx="30" cy="45" rx="10" ry="1.5" fill="#2e2e2e" opacity="0.5"/>
      </g>
    </svg>
  ),

  // 실버 랭크 장식품
  산호: ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="coral-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8"/>
          <feOffset dx="2" dy="2.5" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.35"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="coralMain" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#b71c1c" />
          <stop offset="20%" stopColor="#c62828" />
          <stop offset="40%" stopColor="#d32f2f" />
          <stop offset="70%" stopColor="#ff5252" />
          <stop offset="85%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#ff8787" />
        </linearGradient>
        <linearGradient id="coralBranch1" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c62828" />
          <stop offset="25%" stopColor="#d32f2f" />
          <stop offset="50%" stopColor="#e53935" />
          <stop offset="75%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#ff8787" />
        </linearGradient>
        <linearGradient id="coralBranch2" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#c62828" />
          <stop offset="25%" stopColor="#d32f2f" />
          <stop offset="50%" stopColor="#e53935" />
          <stop offset="75%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#ff8787" />
        </linearGradient>
        <linearGradient id="coralSmall" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#d32f2f" />
          <stop offset="35%" stopColor="#e53935" />
          <stop offset="70%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#ff9999" />
        </linearGradient>
        <linearGradient id="coralTiny" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#e53935" />
          <stop offset="50%" stopColor="#ff8787" />
          <stop offset="100%" stopColor="#ffaaaa" />
        </linearGradient>
        <radialGradient id="coralGlow">
          <stop offset="0%" stopColor="#ffcccc" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#ff9999" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="coralPolyp1">
          <stop offset="0%" stopColor="#ffb3b3" />
          <stop offset="50%" stopColor="#ff8787" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </radialGradient>
        <radialGradient id="coralPolyp2">
          <stop offset="0%" stopColor="#ffcccc" />
          <stop offset="50%" stopColor="#ff9999" />
          <stop offset="100%" stopColor="#ff7777" />
        </radialGradient>
      </defs>
      <g filter="url(#coral-shadow)">
        {/* 메인 줄기 - 더 굵고 입체적으로 */}
        <path
          d="M30 50 L30 35"
          stroke="url(#coralMain)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* 메인 줄기 하이라이트 - 정확히 가운데 */}
        <path
          d="M30 48 L30 37"
          stroke="#ff9999"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* 메인 가지 - 왼쪽 */}
        <path
          d="M30 35 L25 25"
          stroke="url(#coralMain)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M30 34 L26 27"
          stroke="#ff8787"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* 메인 가지 - 오른쪽 */}
        <path
          d="M30 35 L35 25"
          stroke="url(#coralMain)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M30 34 L34 27"
          stroke="#ff8787"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* 왼쪽 가지들 - 1차 */}
        <path
          d="M25 25 L20 20"
          stroke="url(#coralBranch1)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M25 25 L22 18"
          stroke="url(#coralBranch1)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* 왼쪽 가지들 - 2차 */}
        <path
          d="M20 20 L16 18 M20 20 L18 15 M20 20 L17 22"
          stroke="url(#coralSmall)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M22 18 L19 14 M22 18 L20 16"
          stroke="url(#coralSmall)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 왼쪽 가지들 - 3차 (잔가지) */}
        <path
          d="M16 18 L14 16 M16 18 L14 19 M18 15 L16 13 M18 15 L15 14"
          stroke="url(#coralTiny)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M19 14 L17 12 M19 14 L18 11"
          stroke="url(#coralTiny)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 오른쪽 가지들 - 1차 */}
        <path
          d="M35 25 L40 20"
          stroke="url(#coralBranch2)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M35 25 L38 18"
          stroke="url(#coralBranch2)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* 오른쪽 가지들 - 2차 */}
        <path
          d="M40 20 L44 18 M40 20 L42 15 M40 20 L43 22"
          stroke="url(#coralSmall)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M38 18 L41 14 M38 18 L40 16"
          stroke="url(#coralSmall)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 오른쪽 가지들 - 3차 (잔가지) */}
        <path
          d="M44 18 L46 16 M44 18 L46 19 M42 15 L44 13 M42 15 L45 14"
          stroke="url(#coralTiny)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M41 14 L43 12 M41 14 L42 11"
          stroke="url(#coralTiny)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* 중간 가지들 */}
        <path
          d="M30 35 L27 30 M30 35 L33 30"
          stroke="url(#coralSmall)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M27 30 L25 27 M27 30 L24 29"
          stroke="url(#coralTiny)"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M33 30 L35 27 M33 30 L36 29"
          stroke="url(#coralTiny)"
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        {/* 산호 폴립(polyps) - 왼쪽 끝단들 */}
        <circle cx="16" cy="18" r="3" fill="url(#coralPolyp1)"/>
        <circle cx="16.5" cy="17.5" r="1" fill="#ffcccc" opacity="0.7"/>

        <circle cx="18" cy="15" r="2.8" fill="url(#coralPolyp2)"/>
        <circle cx="18.5" cy="14.5" r="0.9" fill="#ffe0e0" opacity="0.7"/>

        <circle cx="14" cy="16" r="2.5" fill="url(#coralPolyp1)"/>
        <circle cx="14.5" cy="15.5" r="0.8" fill="#ffd5d5" opacity="0.6"/>

        <circle cx="14" cy="19" r="2.3" fill="url(#coralPolyp2)"/>
        <circle cx="14.5" cy="18.6" r="0.7" fill="#ffe0e0" opacity="0.6"/>

        <circle cx="19" cy="14" r="2.6" fill="url(#coralPolyp1)"/>
        <circle cx="19.5" cy="13.5" r="0.8" fill="#ffcccc" opacity="0.7"/>

        <circle cx="17" cy="12" r="2.2" fill="url(#coralPolyp2)"/>
        <circle cx="17.5" cy="11.6" r="0.7" fill="#ffe0e0" opacity="0.6"/>

        <circle cx="18" cy="11" r="1.8" fill="url(#coralPolyp1)"/>
        <circle cx="18.4" cy="10.7" r="0.6" fill="#ffd5d5" opacity="0.5"/>

        <circle cx="16" cy="13" r="2" fill="url(#coralPolyp2)"/>

        {/* 산호 폴립 - 오른쪽 끝단들 */}
        <circle cx="44" cy="18" r="3" fill="url(#coralPolyp1)"/>
        <circle cx="43.5" cy="17.5" r="1" fill="#ffcccc" opacity="0.7"/>

        <circle cx="42" cy="15" r="2.8" fill="url(#coralPolyp2)"/>
        <circle cx="41.5" cy="14.5" r="0.9" fill="#ffe0e0" opacity="0.7"/>

        <circle cx="46" cy="16" r="2.5" fill="url(#coralPolyp1)"/>
        <circle cx="45.5" cy="15.5" r="0.8" fill="#ffd5d5" opacity="0.6"/>

        <circle cx="46" cy="19" r="2.3" fill="url(#coralPolyp2)"/>
        <circle cx="45.5" cy="18.6" r="0.7" fill="#ffe0e0" opacity="0.6"/>

        <circle cx="41" cy="14" r="2.6" fill="url(#coralPolyp1)"/>
        <circle cx="40.5" cy="13.5" r="0.8" fill="#ffcccc" opacity="0.7"/>

        <circle cx="43" cy="12" r="2.2" fill="url(#coralPolyp2)"/>
        <circle cx="42.5" cy="11.6" r="0.7" fill="#ffe0e0" opacity="0.6"/>

        <circle cx="42" cy="11" r="1.8" fill="url(#coralPolyp1)"/>
        <circle cx="41.6" cy="10.7" r="0.6" fill="#ffd5d5" opacity="0.5"/>

        <circle cx="44" cy="13" r="2" fill="url(#coralPolyp2)"/>

        {/* 중간 폴립들 */}
        <circle cx="27" cy="30" r="2.5" fill="url(#coralPolyp1)"/>
        <circle cx="27.5" cy="29.6" r="0.8" fill="#ffcccc" opacity="0.6"/>

        <circle cx="33" cy="30" r="2.5" fill="url(#coralPolyp1)"/>
        <circle cx="32.5" cy="29.6" r="0.8" fill="#ffcccc" opacity="0.6"/>

        <circle cx="25" cy="27" r="2" fill="url(#coralPolyp2)"/>
        <circle cx="25.5" cy="26.7" r="0.6" fill="#ffe0e0" opacity="0.5"/>

        <circle cx="35" cy="27" r="2" fill="url(#coralPolyp2)"/>
        <circle cx="34.5" cy="26.7" r="0.6" fill="#ffe0e0" opacity="0.5"/>

        <circle cx="24" cy="29" r="1.7" fill="url(#coralPolyp1)"/>
        <circle cx="36" cy="29" r="1.7" fill="url(#coralPolyp1)"/>

        {/* 산호 표면 질감 - 작은 돌기들 */}
        <circle cx="30" cy="42" r="1.2" fill="#ff9999" opacity="0.5"/>
        <circle cx="28" cy="40" r="1" fill="#ff9999" opacity="0.5"/>
        <circle cx="32" cy="40" r="1" fill="#ff9999" opacity="0.5"/>
        <circle cx="29" cy="38" r="0.9" fill="#ffaaaa" opacity="0.4"/>
        <circle cx="31" cy="38" r="0.9" fill="#ffaaaa" opacity="0.4"/>

        <circle cx="26" cy="28" r="0.8" fill="#ffaaaa" opacity="0.4"/>
        <circle cx="34" cy="28" r="0.8" fill="#ffaaaa" opacity="0.4"/>
        <circle cx="23" cy="22" r="0.7" fill="#ffb3b3" opacity="0.3"/>
        <circle cx="37" cy="22" r="0.7" fill="#ffb3b3" opacity="0.3"/>

        {/* 미세한 발광 효과 */}
        <ellipse cx="30" cy="25" rx="8" ry="10" fill="url(#coralGlow)"/>
        <ellipse cx="22" cy="18" rx="5" ry="6" fill="url(#coralGlow)" opacity="0.7"/>
        <ellipse cx="38" cy="18" rx="5" ry="6" fill="url(#coralGlow)" opacity="0.7"/>
      </g>
    </svg>
  ),

  '드리프트 우드': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="driftwood-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8"/>
          <feOffset dx="2" dy="2.5" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.35"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="driftwood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bcaaa4" />
          <stop offset="15%" stopColor="#a1887f" />
          <stop offset="30%" stopColor="#8d6e63" />
          <stop offset="50%" stopColor="#6d4c41" />
          <stop offset="70%" stopColor="#5d4037" />
          <stop offset="85%" stopColor="#4e342e" />
          <stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
        <linearGradient id="driftwoodSide" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6d4c41" />
          <stop offset="50%" stopColor="#5d4037" />
          <stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
        <linearGradient id="driftwoodBranch1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8d6e63" />
          <stop offset="35%" stopColor="#6d4c41" />
          <stop offset="70%" stopColor="#5d4037" />
          <stop offset="100%" stopColor="#4e342e" />
        </linearGradient>
        <linearGradient id="driftwoodBranch2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8d6e63" />
          <stop offset="35%" stopColor="#6d4c41" />
          <stop offset="70%" stopColor="#5d4037" />
          <stop offset="100%" stopColor="#4e342e" />
        </linearGradient>
        <linearGradient id="driftwoodBranch3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a1887f" />
          <stop offset="50%" stopColor="#795548" />
          <stop offset="100%" stopColor="#6d4c41" />
        </linearGradient>
        <radialGradient id="woodKnot1">
          <stop offset="0%" stopColor="#3e2723" />
          <stop offset="50%" stopColor="#4e342e" />
          <stop offset="100%" stopColor="#5d4037" />
        </radialGradient>
        <radialGradient id="woodKnot2">
          <stop offset="0%" stopColor="#3e2723" />
          <stop offset="70%" stopColor="#5d4037" />
          <stop offset="100%" stopColor="#6d4c41" />
        </radialGradient>
        <radialGradient id="woodHighlight">
          <stop offset="0%" stopColor="#d7ccc8" stopOpacity="0.5"/>
          <stop offset="50%" stopColor="#bcaaa4" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#a1887f" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="moss" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#558b2f" />
          <stop offset="50%" stopColor="#689f38" />
          <stop offset="100%" stopColor="#7cb342" />
        </linearGradient>
      </defs>
      <g filter="url(#driftwood-shadow)" transform="translate(0, 7)">
        {/* 메인 나무 줄기 - 더 입체적으로 */}
        <path
          d="M8 35 C10 33, 15 32, 22 31 C28 30, 35 30, 40 28 C45 26, 48 23, 49 20 C50 17, 48 14, 44 12 C40 10, 34 9, 28 10 C22 11, 16 13, 12 17 C8 21, 7 26, 8 30 C9 34, 8 35, 8 35"
          fill="url(#driftwood)"
        />

        {/* 측면 어두운 부분 - 3D 입체감 */}
        <path
          d="M8 35 C10 33, 15 32, 22 31 C18 32, 14 33, 11 34 C9 34.5, 8 35, 8 35 Z"
          fill="url(#driftwoodSide)"
          opacity="0.6"
        />
        <path
          d="M40 28 C45 26, 48 23, 49 20 C48 22, 46 25, 42 27 C41 27.5, 40 28, 40 28 Z"
          fill="#3e2723"
          opacity="0.4"
        />

        {/* 나뭇가지 1 - 더 자연스럽게 */}
        <path
          d="M40 28 C43 26, 46 23, 48 19 C50 15, 51 12, 51 12"
          stroke="url(#driftwoodBranch1)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* 가지 하이라이트 */}
        <path
          d="M40.5 27.5 C42 26, 44 24, 46 21"
          stroke="#a1887f"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* 나뭇가지 2 */}
        <path
          d="M22 31 C19 29, 15 27, 12 23 C9 19, 8 16, 8 16"
          stroke="url(#driftwoodBranch2)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* 가지 하이라이트 */}
        <path
          d="M21.5 30.5 C20 29, 18 27, 16 25"
          stroke="#a1887f"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* 나뭇가지 3 */}
        <path
          d="M30 30 C30 27, 32 24, 35 21"
          stroke="url(#driftwoodBranch3)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* 가지 하이라이트 */}
        <path
          d="M30.5 29 C30.5 27, 31.5 25, 33 23"
          stroke="#bcaaa4"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* 나이테 패턴 - 나무 단면 더 입체적으로 */}
        <ellipse cx="28" cy="22" rx="12.5" ry="6.5" stroke="#3e2723" strokeWidth="1.2" fill="none"/>
        <ellipse cx="28" cy="22" rx="11" ry="5.5" stroke="#4e342e" strokeWidth="1" fill="none" opacity="0.9"/>
        <ellipse cx="28" cy="22" rx="9.5" ry="4.8" stroke="#5d4037" strokeWidth="0.9" fill="none" opacity="0.8"/>
        <ellipse cx="28" cy="22" rx="8" ry="4" stroke="#5d4037" strokeWidth="0.8" fill="none" opacity="0.7"/>
        <ellipse cx="28" cy="22" rx="6.5" ry="3.3" stroke="#6d4c41" strokeWidth="0.7" fill="none" opacity="0.6"/>
        <ellipse cx="28" cy="22" rx="5" ry="2.5" stroke="#6d4c41" strokeWidth="0.6" fill="none" opacity="0.5"/>
        <ellipse cx="28" cy="22" rx="3.5" ry="1.8" stroke="#795548" strokeWidth="0.5" fill="none" opacity="0.4"/>
        <ellipse cx="28" cy="22" rx="2" ry="1" stroke="#8d6e63" strokeWidth="0.4" fill="none" opacity="0.3"/>

        {/* 나무 질감 - 세로 결 더 디테일하게 */}
        <line x1="10" y1="18" x2="46" y2="15" stroke="#4e342e" strokeWidth="1" opacity="0.6"/>
        <line x1="10" y1="19" x2="46" y2="16" stroke="#5d4037" strokeWidth="0.7" opacity="0.4"/>
        <line x1="11" y1="22" x2="45" y2="19" stroke="#5d4037" strokeWidth="0.9" opacity="0.6"/>
        <line x1="11" y1="23" x2="45" y2="20" stroke="#6d4c41" strokeWidth="0.6" opacity="0.4"/>
        <line x1="10" y1="26" x2="46" y2="23" stroke="#5d4037" strokeWidth="0.8" opacity="0.5"/>
        <line x1="10" y1="27" x2="46" y2="24" stroke="#6d4c41" strokeWidth="0.5" opacity="0.4"/>
        <line x1="11" y1="30" x2="44" y2="27" stroke="#5d4037" strokeWidth="0.7" opacity="0.5"/>
        <line x1="11" y1="31" x2="44" y2="28" stroke="#6d4c41" strokeWidth="0.5" opacity="0.4"/>
        <line x1="12" y1="33" x2="40" y2="30" stroke="#5d4037" strokeWidth="0.6" opacity="0.5"/>

        {/* 나무 옹이 - 더 입체적으로 */}
        <ellipse cx="18" cy="24" rx="3" ry="2.8" fill="url(#woodKnot1)"/>
        <ellipse cx="18.5" cy="23.5" rx="2" ry="1.8" fill="#3e2723" opacity="0.8"/>
        <ellipse cx="19" cy="23.2" rx="1" ry="0.9" fill="#2e1a16" opacity="0.6"/>

        <ellipse cx="36" cy="26" rx="2.5" ry="2.2" fill="url(#woodKnot2)"/>
        <ellipse cx="36.5" cy="25.6" rx="1.6" ry="1.4" fill="#3e2723" opacity="0.7"/>
        <ellipse cx="37" cy="25.3" rx="0.8" ry="0.7" fill="#2e1a16" opacity="0.5"/>

        <ellipse cx="25" cy="28" rx="2" ry="1.8" fill="url(#woodKnot1)"/>
        <ellipse cx="25.5" cy="27.6" rx="1.2" ry="1.1" fill="#3e2723" opacity="0.7"/>

        <circle cx="44" cy="17" r="1.8" fill="url(#woodKnot2)"/>
        <circle cx="44.3" cy="16.8" r="1" fill="#3e2723" opacity="0.6"/>

        <circle cx="14" cy="21" r="1.5" fill="url(#woodKnot1)"/>
        <circle cx="14.3" cy="20.8" r="0.8" fill="#3e2723" opacity="0.6"/>

        {/* 균열 - 더 깊고 사실적으로 */}
        <path d="M20 20 L21 21.5 L22 23 L21.5 24.5 L21 26" stroke="#2e1a16" strokeWidth="1" fill="none" opacity="0.7"/>
        <path d="M20.3 20.3 L21 21.5 L21.8 23 L21.5 24.3 L21.2 25.5" stroke="#3e2723" strokeWidth="0.6" fill="none" opacity="0.5"/>

        <path d="M38 24 L38.5 25.5 L39 27 L38.8 28 L38.5 29" stroke="#2e1a16" strokeWidth="0.9" fill="none" opacity="0.7"/>
        <path d="M38.2 24.2 L38.5 25.5 L38.8 27 L38.7 28 L38.4 28.7" stroke="#3e2723" strokeWidth="0.5" fill="none" opacity="0.5"/>

        <path d="M32 14 Q 33 16, 32.5 18" stroke="#3e2723" strokeWidth="0.7" fill="none" opacity="0.6"/>
        <path d="M12 32 Q 13 33, 12.5 34" stroke="#3e2723" strokeWidth="0.6" fill="none" opacity="0.6"/>

        {/* 하이라이트 - 마모된 부분 */}
        <ellipse cx="28" cy="15" rx="10" ry="4" fill="url(#woodHighlight)"/>
        <ellipse cx="42" cy="21" rx="5" ry="3" fill="url(#woodHighlight)" opacity="0.6"/>
        <ellipse cx="16" cy="29" rx="4" ry="2.5" fill="url(#woodHighlight)" opacity="0.5"/>

        {/* 이끼와 풍화 효과 */}
        <ellipse cx="10" cy="31" rx="2.5" ry="2" fill="url(#moss)" opacity="0.6"/>
        <ellipse cx="11" cy="32" rx="1.8" ry="1.5" fill="#558b2f" opacity="0.4"/>

        <ellipse cx="46" cy="19" rx="2" ry="1.6" fill="url(#moss)" opacity="0.5"/>
        <ellipse cx="46.5" cy="19.5" rx="1.4" ry="1.1" fill="#558b2f" opacity="0.4"/>

        <circle cx="24" cy="13" r="1.2" fill="#558b2f" opacity="0.5"/>
        <circle cx="34" cy="12" r="1" fill="#689f38" opacity="0.4"/>

        {/* 작은 홈들 */}
        <circle cx="15" cy="27" r="0.8" fill="#4e342e" opacity="0.5"/>
        <circle cx="40" cy="24" r="0.7" fill="#4e342e" opacity="0.5"/>
        <circle cx="30" cy="32" r="0.6" fill="#4e342e" opacity="0.4"/>
        <circle cx="22" cy="18" r="0.6" fill="#4e342e" opacity="0.4"/>
      </g>
    </svg>
  ),

  '조개 껍질': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shell-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8"/>
          <feOffset dx="2" dy="2.5" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.35"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="shellMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe0d0" />
          <stop offset="15%" stopColor="#ffccbc" />
          <stop offset="30%" stopColor="#ffab91" />
          <stop offset="50%" stopColor="#ff8a65" />
          <stop offset="75%" stopColor="#ff7043" />
          <stop offset="100%" stopColor="#ff5722" />
        </linearGradient>
        <linearGradient id="shellLayer2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffccbc" />
          <stop offset="40%" stopColor="#ffab91" />
          <stop offset="75%" stopColor="#ff8a65" />
          <stop offset="100%" stopColor="#ff7043" />
        </linearGradient>
        <linearGradient id="shellLayer3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffab91" />
          <stop offset="50%" stopColor="#ff8a65" />
          <stop offset="100%" stopColor="#ff6e40" />
        </linearGradient>
        <linearGradient id="shellSpiral" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7043" />
          <stop offset="50%" stopColor="#ff6e40" />
          <stop offset="100%" stopColor="#ff5722" />
        </linearGradient>
        <linearGradient id="shellSpiral2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6e40" />
          <stop offset="50%" stopColor="#ff5722" />
          <stop offset="100%" stopColor="#e64a19" />
        </linearGradient>
        <linearGradient id="shellSpiral3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff5722" />
          <stop offset="50%" stopColor="#e64a19" />
          <stop offset="100%" stopColor="#d84315" />
        </linearGradient>
        <radialGradient id="shellHighlight">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7"/>
          <stop offset="50%" stopColor="#fff3e0" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="shellHighlight2">
          <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#ffe0b2" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="shellHighlight3">
          <stop offset="0%" stopColor="#ffe0d0" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#ffccbc" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="nacre">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="30%" stopColor="#fce4ec" stopOpacity="0.7"/>
          <stop offset="60%" stopColor="#f8bbd0" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#f48fb1" stopOpacity="0.3"/>
        </radialGradient>
        <radialGradient id="pearl1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fff3e0" />
          <stop offset="70%" stopColor="#fce4ec" />
          <stop offset="100%" stopColor="#f8bbd0" />
        </radialGradient>
        <radialGradient id="pearl2">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fce4ec" />
          <stop offset="100%" stopColor="#f48fb1" />
        </radialGradient>
        <radialGradient id="pearl3">
          <stop offset="0%" stopColor="#fff8f0" />
          <stop offset="60%" stopColor="#ffe0e0" />
          <stop offset="100%" stopColor="#ffc1cc" />
        </radialGradient>
        <radialGradient id="shellDepth">
          <stop offset="0%" stopColor="#d84315" />
          <stop offset="50%" stopColor="#bf360c" />
          <stop offset="100%" stopColor="#3e2723" />
        </radialGradient>
      </defs>
      <g filter="url(#shell-shadow)">
        {/* 소라 껍질 외부층 - 가장 큰 레이어 */}
        <path
          d="M30 48 C40 48, 46 42, 46 34 C46 26, 42 20, 36 17 C30 14, 24 15, 20 19 C16 23, 15 28, 17 33 C19 38, 22 41, 26 42 C30 43, 33 41, 34 38 C35 35, 34 32, 32 30 C30 28, 28 27, 27 27"
          fill="url(#shellMain)"
        />

        {/* 껍질 중간층 */}
        <path
          d="M30 46 C39 46, 44 40.5, 44 33.5 C44 26.5, 40.5 21, 35.5 18.5 C30.5 16, 25 17, 21.5 20.5 C18 24, 17 28.5, 18.5 32.5 C20 37, 23 40, 26.5 41 C30 42, 32.5 40, 33.5 37.5 C34.5 35, 33.5 32.5, 31.5 31 C29.5 29.5, 28 29, 27.5 29"
          fill="url(#shellLayer2)"
        />

        {/* 껍질 내부층 */}
        <path
          d="M30 44 C37.5 44, 42 39, 42 33 C42 27, 39 22, 35 20 C31 18, 26 19, 23 22 C20 25, 19 29, 20 32.5 C21.5 36, 24 38.5, 27 39.5 C30 40.5, 32 39, 33 37 C34 35, 33 32.5, 31.5 31.5 C30 30.5, 28.5 30.5, 28 30.5"
          fill="url(#shellLayer3)"
        />

        {/* 나선 외곽 라인들 - 성장선 */}
        <path
          d="M30 46 C38 46, 43 41, 43 34 C43 27, 40 22, 36 19"
          stroke="#d84315"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M30 44 C37 44, 41 39.5, 41 33.5 C41 27.5, 38.5 23, 35.5 20.5"
          stroke="#e64a19"
          strokeWidth="0.7"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M30 42 C36 42, 39.5 38, 39.5 33 C39.5 28, 37 24, 34.5 22"
          stroke="#ff6e40"
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
        />

        {/* 나선 무늬 - 1차 (가장 바깥) */}
        <path
          d="M30 40 C35 40, 38 37, 38 33 C38 29, 36 26, 33 24 C30 22, 27 22, 25 24 C23 26, 22 28, 23 31 C24 34, 26 35, 28 36 C30 37, 31 36, 32 35 C33 34, 33 33, 32 32"
          stroke="url(#shellSpiral)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* 나선 하이라이트 */}
        <path
          d="M30.5 39 C34 39, 37 36.5, 37 33 C37 29.5, 35 27, 33 25"
          stroke="#ffab91"
          strokeWidth="0.7"
          fill="none"
          opacity="0.5"
        />

        {/* 나선 무늬 - 2차 */}
        <path
          d="M30 36 C33 36, 35 34, 35 31 C35 28, 33 26, 31 25 C29 24, 27 24, 26 26 C25 28, 25 29, 26 30 C27 31, 28 32, 29 32"
          stroke="url(#shellSpiral2)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* 나선 무늬 - 3차 (중심부) */}
        <path
          d="M30 33 C31.5 33, 33 32, 33 30.5 C33 29, 32 28, 31 27.5 C30 27, 29 27.5, 28.5 28 C28 28.5, 28 29, 28.5 29.5 C29 30, 29.5 30, 29.7 30"
          stroke="url(#shellSpiral3)"
          strokeWidth="1"
          fill="none"
        />

        {/* 나선 중심 깊이감 */}
        <circle cx="29.5" cy="29.5" r="2" fill="url(#shellDepth)"/>
        <circle cx="29.5" cy="29.5" r="1.3" fill="#3e2723" opacity="0.7"/>

        {/* 자개(nacre) 진주층 효과 */}
        <ellipse cx="32" cy="32" rx="5" ry="6" fill="url(#nacre)" opacity="0.6"/>
        <ellipse cx="28" cy="36" rx="4" ry="5" fill="url(#nacre)" opacity="0.5"/>

        {/* 하이라이트와 광택 - 더 풍부하게 */}
        <ellipse cx="35" cy="28" rx="8" ry="10" fill="url(#shellHighlight)"/>
        <ellipse cx="32" cy="32" rx="5" ry="6.5" fill="url(#shellHighlight2)"/>
        <ellipse cx="38" cy="30" rx="4" ry="5" fill="url(#shellHighlight3)"/>

        {/* 진주 효과 - 더 풍부하게 */}
        <circle cx="33" cy="30" r="2.5" fill="url(#pearl1)"/>
        <circle cx="33.5" cy="29.5" r="1" fill="white" opacity="0.8"/>

        <circle cx="28" cy="34" r="2" fill="url(#pearl2)"/>
        <circle cx="28.5" cy="33.5" r="0.8" fill="white" opacity="0.7"/>

        <circle cx="35" cy="33" r="1.8" fill="url(#pearl3)"/>
        <circle cx="35.4" cy="32.7" r="0.7" fill="white" opacity="0.6"/>

        <circle cx="31" cy="36" r="1.5" fill="url(#pearl1)"/>
        <circle cx="31.3" cy="35.8" r="0.6" fill="white" opacity="0.6"/>

        {/* 작은 진주 반짝임들 */}
        <circle cx="36" cy="35" r="1.2" fill="url(#pearl2)" opacity="0.7"/>
        <circle cx="26" cy="31" r="1" fill="url(#pearl3)" opacity="0.6"/>
        <circle cx="29" cy="38" r="0.9" fill="url(#pearl1)" opacity="0.6"/>

        {/* 껍질 성장선 디테일 */}
        <path d="M20 30 C22 29, 24 29, 26 30" stroke="#ff8a65" strokeWidth="0.6" opacity="0.5"/>
        <path d="M21 32 C23 31.2, 25 31.2, 27 32" stroke="#ff8a65" strokeWidth="0.6" opacity="0.5"/>
        <path d="M22 34 C24 33, 26 33, 28 34" stroke="#ff8a65" strokeWidth="0.6" opacity="0.5"/>
        <path d="M23 36 C25 35.2, 27 35.2, 29 36" stroke="#ff8a65" strokeWidth="0.6" opacity="0.5"/>
        <path d="M24 38 C26 37, 28 37, 30 38" stroke="#ff8a65" strokeWidth="0.6" opacity="0.5"/>
        <path d="M25 40 C27 39.2, 29 39.2, 31 40" stroke="#ff7043" strokeWidth="0.6" opacity="0.4"/>

        {/* 껍질 홈 디테일 */}
        <path d="M34 24 C35 25, 36 26, 37 28" stroke="#e64a19" strokeWidth="0.5" opacity="0.4"/>
        <path d="M36 26 C37 27.5, 38 29, 39 31" stroke="#e64a19" strokeWidth="0.5" opacity="0.4"/>
        <path d="M38 29 C39 30.5, 40 32.5, 40.5 34.5" stroke="#e64a19" strokeWidth="0.5" opacity="0.4"/>

        {/* 미세한 질감 포인트들 */}
        <circle cx="34" cy="38" r="0.5" fill="#ff7043" opacity="0.4"/>
        <circle cx="38" cy="36" r="0.5" fill="#ff7043" opacity="0.4"/>
        <circle cx="40" cy="32" r="0.5" fill="#ff6e40" opacity="0.4"/>
        <circle cx="24" cy="26" r="0.5" fill="#ffab91" opacity="0.4"/>
        <circle cx="22" cy="28" r="0.5" fill="#ffab91" opacity="0.4"/>
      </g>
    </svg>
  ),

  // 골드 랭크 장식품
  '그리스 신전': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="temple-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8"/>
          <feOffset dx="2" dy="2.5" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.35"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="templeRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="15%" stopColor="#f9f9f9" />
          <stop offset="40%" stopColor="#f5f5f5" />
          <stop offset="70%" stopColor="#eeeeee" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="templeRoofTile" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="50%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#d5d5d5" />
        </linearGradient>
        <linearGradient id="pillarMarble" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="20%" stopColor="#e8e8e8" />
          <stop offset="40%" stopColor="#fafafa" />
          <stop offset="60%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="pillarCapital" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fafafa" />
          <stop offset="70%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        <linearGradient id="templeBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="30%" stopColor="#e0e0e0" />
          <stop offset="70%" stopColor="#d0d0d0" />
          <stop offset="100%" stopColor="#bdbdbd" />
        </linearGradient>
        <linearGradient id="templeFrieze" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="50%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#e8e8e8" />
        </linearGradient>
        <radialGradient id="marbleHighlight">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="columnGlow">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g filter="url(#temple-shadow)" transform="scale(0.9) translate(3, 3)">
        {/* 페디먼트 (삼각형 지붕) - 더 입체적으로 */}
        <path
          d="M8 20 L30 8 L52 20 L52 23 L8 23 Z"
          fill="url(#templeRoof)"
        />

        {/* 지붕 측면 그림자 */}
        <path
          d="M8 20 L30 8 L30 11 L8 23 Z"
          fill="#d0d0d0"
          opacity="0.3"
        />
        <path
          d="M52 20 L30 8 L30 11 L52 23 Z"
          fill="#e8e8e8"
          opacity="0.2"
        />

        {/* 지붕 장식 디테일 - 아크로테리온 (꼭대기 장식) */}
        <circle cx="30" cy="8" r="1.5" fill="#f5f5f5"/>
        <path d="M30 6.5 L28.5 8 L31.5 8 Z" fill="#fafafa"/>
        <circle cx="8" cy="20" r="1.2" fill="#e8e8e8"/>
        <circle cx="52" cy="20" r="1.2" fill="#e8e8e8"/>

        {/* 페디먼트 조각 장식 (프리즈) */}
        <path d="M15 18 L17 16 L19 18" stroke="#d0d0d0" strokeWidth="0.8" fill="none"/>
        <path d="M23 15 L25 13 L27 15" stroke="#d0d0d0" strokeWidth="0.8" fill="none"/>
        <path d="M33 15 L35 13 L37 15" stroke="#d0d0d0" strokeWidth="0.8" fill="none"/>
        <path d="M41 18 L43 16 L45 18" stroke="#d0d0d0" strokeWidth="0.8" fill="none"/>

        {/* 중앙 조각상 실루엣 */}
        <ellipse cx="30" cy="16" rx="2" ry="3" fill="#d5d5d5" opacity="0.5"/>

        {/* 엔타블러처 (기둥 상단 구조물) */}
        <rect x="8" y="20" width="44" height="1.5" fill="url(#templeFrieze)"/>

        {/* 트리글리프 패턴 (프리즈 장식) */}
        <rect x="10" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="11.5" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="20" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="21.5" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="30" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="31.5" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="40" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="41.5" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>
        <rect x="48" y="20.2" width="1" height="1" fill="#d0d0d0" opacity="0.6"/>

        {/* 기둥 주두 (Capital) - 이오닉 양식 */}
        <rect x="11" y="19.5" width="7" height="2" fill="url(#pillarCapital)" rx="0.3"/>
        <ellipse cx="14.5" cy="19.5" rx="2" ry="0.8" fill="#f5f5f5"/>
        <circle cx="13" cy="19.5" r="0.5" fill="#e0e0e0"/>
        <circle cx="16" cy="19.5" r="0.5" fill="#e0e0e0"/>

        <rect x="19" y="19.5" width="7" height="2" fill="url(#pillarCapital)" rx="0.3"/>
        <ellipse cx="22.5" cy="19.5" rx="2" ry="0.8" fill="#f5f5f5"/>
        <circle cx="21" cy="19.5" r="0.5" fill="#e0e0e0"/>
        <circle cx="24" cy="19.5" r="0.5" fill="#e0e0e0"/>

        <rect x="27" y="19.5" width="7" height="2" fill="url(#pillarCapital)" rx="0.3"/>
        <ellipse cx="30.5" cy="19.5" rx="2" ry="0.8" fill="#f5f5f5"/>
        <circle cx="29" cy="19.5" r="0.5" fill="#e0e0e0"/>
        <circle cx="32" cy="19.5" r="0.5" fill="#e0e0e0"/>

        <rect x="35" y="19.5" width="7" height="2" fill="url(#pillarCapital)" rx="0.3"/>
        <ellipse cx="38.5" cy="19.5" rx="2" ry="0.8" fill="#f5f5f5"/>
        <circle cx="37" cy="19.5" r="0.5" fill="#e0e0e0"/>
        <circle cx="40" cy="19.5" r="0.5" fill="#e0e0e0"/>

        <rect x="43" y="19.5" width="7" height="2" fill="url(#pillarCapital)" rx="0.3"/>
        <ellipse cx="46.5" cy="19.5" rx="2" ry="0.8" fill="#f5f5f5"/>
        <circle cx="45" cy="19.5" r="0.5" fill="#e0e0e0"/>
        <circle cx="48" cy="19.5" r="0.5" fill="#e0e0e0"/>

        {/* 기둥들 - 대리석 질감 */}
        <rect x="12" y="21.5" width="5" height="23.5" fill="url(#pillarMarble)" rx="0.5"/>
        <rect x="20" y="21.5" width="5" height="23.5" fill="url(#pillarMarble)" rx="0.5"/>
        <rect x="28" y="21.5" width="5" height="23.5" fill="url(#pillarMarble)" rx="0.5"/>
        <rect x="36" y="21.5" width="5" height="23.5" fill="url(#pillarMarble)" rx="0.5"/>
        <rect x="44" y="21.5" width="5" height="23.5" fill="url(#pillarMarble)" rx="0.5"/>

        {/* 기둥 플루팅 (세로 홈) - 더 정교하게 */}
        <line x1="13" y1="22" x2="13" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>
        <line x1="14.5" y1="22" x2="14.5" y2="44.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.5"/>
        <line x1="16" y1="22" x2="16" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>

        <line x1="21" y1="22" x2="21" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>
        <line x1="22.5" y1="22" x2="22.5" y2="44.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.5"/>
        <line x1="24" y1="22" x2="24" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>

        <line x1="29" y1="22" x2="29" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>
        <line x1="30.5" y1="22" x2="30.5" y2="44.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.5"/>
        <line x1="32" y1="22" x2="32" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>

        <line x1="37" y1="22" x2="37" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>
        <line x1="38.5" y1="22" x2="38.5" y2="44.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.5"/>
        <line x1="40" y1="22" x2="40" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>

        <line x1="45" y1="22" x2="45" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>
        <line x1="46.5" y1="22" x2="46.5" y2="44.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.5"/>
        <line x1="48" y1="22" x2="48" y2="44.5" stroke="#c8c8c8" strokeWidth="0.6" opacity="0.7"/>

        {/* 기둥 하이라이트 - 햇빛 효과 */}
        <ellipse cx="14.5" cy="30" rx="2" ry="8" fill="url(#marbleHighlight)"/>
        <ellipse cx="22.5" cy="30" rx="2" ry="8" fill="url(#marbleHighlight)"/>
        <ellipse cx="30.5" cy="30" rx="2" ry="8" fill="url(#marbleHighlight)"/>
        <ellipse cx="38.5" cy="30" rx="2" ry="8" fill="url(#marbleHighlight)"/>
        <ellipse cx="46.5" cy="30" rx="2" ry="8" fill="url(#marbleHighlight)"/>

        {/* 크레피도마 (기단) - 3단 계단 */}
        <rect x="8" y="45" width="44" height="2.5" fill="url(#templeBase)"/>
        <rect x="8" y="45" width="44" height="0.3" fill="#f0f0f0" opacity="0.6"/>

        {/* 대리석 균열 및 풍화 효과 */}
        <path d="M12 35 L13 37" stroke="#d0d0d0" strokeWidth="0.3" opacity="0.4"/>
        <path d="M22 28 L23 31" stroke="#d0d0d0" strokeWidth="0.3" opacity="0.4"/>
        <path d="M38 33 L39 36" stroke="#d0d0d0" strokeWidth="0.3" opacity="0.4"/>
        <circle cx="17" cy="40" r="0.4" fill="#d0d0d0" opacity="0.3"/>
        <circle cx="32" cy="38" r="0.4" fill="#d0d0d0" opacity="0.3"/>
        <circle cx="45" cy="42" r="0.4" fill="#d0d0d0" opacity="0.3"/>

        {/* 계단 - 더 입체적으로 */}
        <rect x="10" y="47.5" width="40" height="2" fill="#d0d0d0"/>
        <rect x="10" y="47.5" width="40" height="0.3" fill="#e8e8e8"/>
        <rect x="12" y="49.5" width="36" height="1.5" fill="#b8b8b8"/>
        <rect x="12" y="49.5" width="36" height="0.2" fill="#d0d0d0"/>
        <rect x="14" y="51" width="32" height="1.2" fill="#9e9e9e"/>
        <rect x="14" y="51" width="32" height="0.2" fill="#b8b8b8"/>

        {/* 계단 측면 그림자 */}
        <rect x="10" y="48.8" width="1" height="0.7" fill="#a0a0a0" opacity="0.5"/>
        <rect x="12" y="50.3" width="1" height="0.7" fill="#909090" opacity="0.5"/>
        <rect x="14" y="51.8" width="1" height="0.4" fill="#808080" opacity="0.5"/>
      </g>
    </svg>
  ),

  '보물 상자': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="chest-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8"/>
          <feOffset dx="2" dy="2.5" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.35"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="chestLid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a1887f" />
          <stop offset="20%" stopColor="#8d6e63" />
          <stop offset="50%" stopColor="#795548" />
          <stop offset="80%" stopColor="#6d4c41" />
          <stop offset="100%" stopColor="#5d4037" />
        </linearGradient>
        <linearGradient id="chestBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#795548" />
          <stop offset="25%" stopColor="#6d4c41" />
          <stop offset="60%" stopColor="#5d4037" />
          <stop offset="85%" stopColor="#4e342e" />
          <stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
        <linearGradient id="chestBodySide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5d4037" />
          <stop offset="50%" stopColor="#6d4c41" />
          <stop offset="100%" stopColor="#5d4037" />
        </linearGradient>
        <linearGradient id="metalBandGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c6a200" />
          <stop offset="15%" stopColor="#f9a825" />
          <stop offset="30%" stopColor="#ffc107" />
          <stop offset="50%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#ffd54f" />
          <stop offset="85%" stopColor="#ffc107" />
          <stop offset="100%" stopColor="#c6a200" />
        </linearGradient>
        <linearGradient id="goldBandLuxury" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f57f17" />
          <stop offset="20%" stopColor="#ffb300" />
          <stop offset="40%" stopColor="#ffd54f" />
          <stop offset="60%" stopColor="#fff59d" />
          <stop offset="80%" stopColor="#ffd54f" />
          <stop offset="100%" stopColor="#f57f17" />
        </linearGradient>
        <radialGradient id="lockGolden">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="30%" stopColor="#fff9c4" />
          <stop offset="60%" stopColor="#ffd54f" />
          <stop offset="100%" stopColor="#ffc107" />
        </radialGradient>
        <radialGradient id="goldCoin1">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="20%" stopColor="#fff9c4" />
          <stop offset="50%" stopColor="#ffeb3b" />
          <stop offset="80%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#f9a825" />
        </radialGradient>
        <radialGradient id="goldCoin2">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="40%" stopColor="#ffeb3b" />
          <stop offset="80%" stopColor="#ffc107" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
        <radialGradient id="goldCoin3">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="30%" stopColor="#fff59d" />
          <stop offset="70%" stopColor="#ffd54f" />
          <stop offset="100%" stopColor="#ffb300" />
        </radialGradient>
        <radialGradient id="gemRuby">
          <stop offset="0%" stopColor="#ff80ab" />
          <stop offset="40%" stopColor="#f50057" />
          <stop offset="80%" stopColor="#c51162" />
          <stop offset="100%" stopColor="#880e4f" />
        </radialGradient>
        <radialGradient id="gemSapphire">
          <stop offset="0%" stopColor="#82b1ff" />
          <stop offset="40%" stopColor="#2979ff" />
          <stop offset="80%" stopColor="#2962ff" />
          <stop offset="100%" stopColor="#0d47a1" />
        </radialGradient>
        <radialGradient id="gemEmerald">
          <stop offset="0%" stopColor="#69f0ae" />
          <stop offset="40%" stopColor="#00e676" />
          <stop offset="80%" stopColor="#00c853" />
          <stop offset="100%" stopColor="#1b5e20" />
        </radialGradient>
        <radialGradient id="gemAmethyst">
          <stop offset="0%" stopColor="#ea80fc" />
          <stop offset="40%" stopColor="#d500f9" />
          <stop offset="80%" stopColor="#aa00ff" />
          <stop offset="100%" stopColor="#4a148c" />
        </radialGradient>
        <radialGradient id="treasureGlow">
          <stop offset="0%" stopColor="#fffde7" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#ffeb3b" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#ffc107" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="gemSparkle">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g filter="url(#chest-shadow)" transform="scale(1.1) translate(-3, -3)">
        {/* 상자 뚜껑 (열린 상태) - 더 입체적으로 */}
        <g transform="rotate(-20 30 25)">
          <path
            d="M15 25 C15 22, 17 20, 20 20 L40 20 C43 20, 45 22, 45 25 L45 28 L15 28 Z"
            fill="url(#chestLid)"
          />
          {/* 뚜껑 측면 그림자 */}
          <path
            d="M15 25 L15 28 L17 28 L17 25 C17 23, 18 21, 20 21"
            fill="#4e342e"
            opacity="0.5"
          />
          {/* 뚜껑 금속 장식 - 더 화려하게 */}
          <rect x="15" y="23" width="30" height="1.5" fill="url(#goldBandLuxury)"/>
          <rect x="15" y="23" width="30" height="0.3" fill="#fff9c4" opacity="0.6"/>
          {/* 뚜껑 장식 무늬 */}
          <circle cx="22" cy="23.7" r="0.5" fill="#f9a825" opacity="0.7"/>
          <circle cx="30" cy="23.7" r="0.5" fill="#f9a825" opacity="0.7"/>
          <circle cx="38" cy="23.7" r="0.5" fill="#f9a825" opacity="0.7"/>
          {/* 나무 결 */}
          <path d="M20 22 Q 25 21.5, 30 22 Q 35 22.5, 40 22" stroke="#6d4c41" strokeWidth="0.3" fill="none" opacity="0.4"/>
          <path d="M18 24 Q 23 23.5, 28 24 Q 33 24.5, 38 24" stroke="#6d4c41" strokeWidth="0.3" fill="none" opacity="0.4"/>
        </g>

        {/* 상자 본체 - 입체감 강화 */}
        <rect x="15" y="28" width="30" height="18" fill="url(#chestBody)" rx="2"/>
        {/* 상자 측면 하이라이트 */}
        <rect x="15.5" y="28.5" width="2" height="17" fill="url(#chestBodySide)" opacity="0.3"/>
        <rect x="42.5" y="28.5" width="2" height="17" fill="#3e2723" opacity="0.4"/>

        {/* 나무 결 디테일 */}
        <line x1="17" y1="30" x2="43" y2="30" stroke="#5d4037" strokeWidth="0.4" opacity="0.3"/>
        <line x1="17" y1="33" x2="43" y2="33" stroke="#5d4037" strokeWidth="0.4" opacity="0.3"/>
        <line x1="17" y1="36" x2="43" y2="36" stroke="#5d4037" strokeWidth="0.4" opacity="0.3"/>
        <line x1="17" y1="39" x2="43" y2="39" stroke="#5d4037" strokeWidth="0.4" opacity="0.3"/>
        <line x1="17" y1="42" x2="43" y2="42" stroke="#5d4037" strokeWidth="0.4" opacity="0.3"/>
        <path d="M19 31 Q 22 30.8, 25 31 Q 28 31.2, 31 31" stroke="#6d4c41" strokeWidth="0.3" fill="none" opacity="0.3"/>
        <path d="M35 34 Q 38 33.8, 41 34" stroke="#6d4c41" strokeWidth="0.3" fill="none" opacity="0.3"/>
        <circle cx="20" cy="35" r="0.4" fill="#4e342e" opacity="0.3"/>
        <circle cx="40" cy="40" r="0.4" fill="#4e342e" opacity="0.3"/>

        {/* 금속 장식 밴드 - 더욱 화려하게 */}
        <rect x="13" y="30" width="34" height="2.8" fill="url(#metalBandGold)"/>
        <rect x="13" y="30" width="34" height="0.5" fill="#fff9c4" opacity="0.5"/>
        <rect x="13" y="42" width="34" height="2.8" fill="url(#metalBandGold)"/>
        <rect x="13" y="42" width="34" height="0.5" fill="#fff9c4" opacity="0.5"/>

        {/* 금속 밴드 장식 무늬 - 엠보싱 효과 */}
        <circle cx="16" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="20" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="24" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="28" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="32" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="36" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="40" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="44" cy="31.4" r="0.6" fill="#c6a200" opacity="0.5"/>

        <circle cx="16" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="20" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="24" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="28" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="32" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="36" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="40" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>
        <circle cx="44" cy="43.4" r="0.6" fill="#c6a200" opacity="0.5"/>

        {/* 자물쇠 - 정교하게 */}
        <circle cx="30" cy="37" r="4" fill="url(#lockGolden)"/>
        <circle cx="30" cy="37" r="4" fill="none" stroke="#f9a825" strokeWidth="0.5"/>
        <circle cx="30" cy="36.5" r="1.5" fill="#fff9c4" opacity="0.5"/>
        {/* 자물쇠 구멍 */}
        <rect x="28.5" y="37" width="3" height="4.5" fill="#c6a200" rx="0.3"/>
        <rect x="29" y="37.5" width="2" height="3.5" fill="#f57f17"/>
        <circle cx="30" cy="38.5" r="1.2" fill="#4e342e"/>
        <circle cx="30" cy="38.5" r="0.7" fill="#3e2723"/>
        {/* 자물쇠 장식 */}
        <circle cx="27.5" cy="35.5" r="0.4" fill="#f9a825"/>
        <circle cx="32.5" cy="35.5" r="0.4" fill="#f9a825"/>
        <path d="M28 34.5 L32 34.5" stroke="#c6a200" strokeWidth="0.5"/>

        {/* 보물 발광 효과 - 전체 */}
        <ellipse cx="30" cy="30" rx="16" ry="8" fill="url(#treasureGlow)"/>

        {/* 금화들 - 더 다양하게 */}
        <circle cx="22" cy="31" r="2.8" fill="url(#goldCoin1)"/>
        <circle cx="22.5" cy="30.5" r="1.2" fill="#fffde7" opacity="0.6"/>
        <circle cx="22" cy="31" r="2.2" fill="none" stroke="#f9a825" strokeWidth="0.3"/>
        <circle cx="22" cy="31" r="1.8" fill="none" stroke="#c6a200" strokeWidth="0.2"/>

        <circle cx="38" cy="31" r="2.8" fill="url(#goldCoin2)"/>
        <circle cx="38.5" cy="30.5" r="1.2" fill="#fff9c4" opacity="0.6"/>
        <circle cx="38" cy="31" r="2.2" fill="none" stroke="#f57f17" strokeWidth="0.3"/>
        <circle cx="38" cy="31" r="1.8" fill="none" stroke="#c6a200" strokeWidth="0.2"/>

        <circle cx="25" cy="29" r="2.3" fill="url(#goldCoin3)"/>
        <circle cx="25.4" cy="28.7" r="1" fill="#fffde7" opacity="0.5"/>
        <circle cx="25" cy="29" r="1.8" fill="none" stroke="#ffb300" strokeWidth="0.2"/>

        <circle cx="35" cy="29" r="2.3" fill="url(#goldCoin1)"/>
        <circle cx="35.4" cy="28.7" r="1" fill="#fff9c4" opacity="0.5"/>
        <circle cx="35" cy="29" r="1.8" fill="none" stroke="#f9a825" strokeWidth="0.2"/>

        <circle cx="30" cy="28" r="2.8" fill="url(#goldCoin3)"/>
        <circle cx="30.5" cy="27.5" r="1.2" fill="#fffde7" opacity="0.6"/>
        <circle cx="30" cy="28" r="2.2" fill="none" stroke="#ffc107" strokeWidth="0.3"/>
        <circle cx="30" cy="28" r="1.8" fill="none" stroke="#f57f17" strokeWidth="0.2"/>

        {/* 추가 작은 금화들 */}
        <circle cx="19" cy="30" r="1.5" fill="url(#goldCoin2)"/>
        <circle cx="19.3" cy="29.8" r="0.6" fill="#fff9c4" opacity="0.5"/>

        <circle cx="41" cy="30" r="1.5" fill="url(#goldCoin1)"/>
        <circle cx="41.3" cy="29.8" r="0.6" fill="#fffde7" opacity="0.5"/>

        <circle cx="27" cy="31" r="1.3" fill="url(#goldCoin3)"/>
        <circle cx="33" cy="31" r="1.3" fill="url(#goldCoin2)"/>

        {/* 보석들 - 더 정교하게 */}
        {/* 루비 */}
        <rect x="27" y="30" width="2.5" height="2.5" fill="url(#gemRuby)" transform="rotate(45 28.25 31.25)" rx="0.3"/>
        <polygon points="28.25,30.5 29,31.25 28.25,32 27.5,31.25" fill="#ff80ab" opacity="0.6"/>
        <circle cx="28.25" cy="31.25" r="0.4" fill="url(#gemSparkle)"/>

        {/* 사파이어 */}
        <rect x="32" y="29" width="2.5" height="2.5" fill="url(#gemSapphire)" transform="rotate(45 33.25 30.25)" rx="0.3"/>
        <polygon points="33.25,29.5 34,30.25 33.25,31 32.5,30.25" fill="#82b1ff" opacity="0.6"/>
        <circle cx="33.25" cy="30.25" r="0.4" fill="url(#gemSparkle)"/>

        {/* 에메랄드 */}
        <circle cx="20" cy="29" r="1.3" fill="url(#gemEmerald)"/>
        <circle cx="20.3" cy="28.7" r="0.5" fill="#69f0ae" opacity="0.6"/>
        <circle cx="20" cy="29" r="0.3" fill="url(#gemSparkle)"/>

        {/* 자수정 */}
        <circle cx="40" cy="29" r="1.3" fill="url(#gemAmethyst)"/>
        <circle cx="40.3" cy="28.7" r="0.5" fill="#ea80fc" opacity="0.6"/>
        <circle cx="40" cy="29" r="0.3" fill="url(#gemSparkle)"/>

        {/* 추가 보석들 */}
        <circle cx="24" cy="31.5" r="0.8" fill="url(#gemSapphire)"/>
        <circle cx="24.2" cy="31.3" r="0.3" fill="#82b1ff" opacity="0.7"/>

        <circle cx="36" cy="31.5" r="0.8" fill="url(#gemEmerald)"/>
        <circle cx="36.2" cy="31.3" r="0.3" fill="#69f0ae" opacity="0.7"/>

        <circle cx="30" cy="30.5" r="0.7" fill="url(#gemRuby)"/>
        <circle cx="30.2" cy="30.3" r="0.2" fill="#ff80ab" opacity="0.7"/>

        {/* 반짝임 효과 - 더 많고 다양하게 */}
        <circle cx="22" cy="31" r="0.6" fill="white">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="38" cy="31" r="0.6" fill="white">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="30" cy="28" r="0.6" fill="white">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="28" cy="31" r="0.4" fill="white">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="33" cy="30" r="0.4" fill="white">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/>
        </circle>
        <circle cx="25" cy="29" r="0.4" fill="white">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="35" cy="29" r="0.4" fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="20" cy="29" r="0.3" fill="white">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="29" r="0.3" fill="white">
          <animate attributeName="opacity" values="1;0.6;1" dur="1.7s" repeatCount="indefinite"/>
        </circle>
        <circle cx="19" cy="30" r="0.3" fill="white">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="41" cy="30" r="0.3" fill="white">
          <animate attributeName="opacity" values="1;0.5;1" dur="1.9s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  ),

  해적선: ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ship-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.3"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.28"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
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
      <g filter="url(#ship-shadow)">
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
      </g>
    </svg>
  ),

  // 플래티넘 랭크 장식품 (블러 완전 제거, 100% 선명)
  '크리스탈 동굴': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="crystal-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.3"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.28"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
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
      <g filter="url(#crystal-shadow)">
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
      </g>
    </svg>
  ),

  'LED 해파리': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="jellyfish-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.3"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.28"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
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
      <g filter="url(#jellyfish-shadow)">
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
      </g>
    </svg>
  ),

  '아틀란티스 유적': ({ size = 35 }) => (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="atlantis-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.3"/>
          <feOffset dx="2" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.28"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
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
      <g filter="url(#atlantis-shadow)">
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
      </g>
    </svg>
  )
};

export default DecorationIcons;