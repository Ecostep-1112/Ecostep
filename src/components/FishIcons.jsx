import React from 'react';

// 물고기 SVG 아이콘 컴포넌트
const FishIcons = {
  // 12위: 코리도라스 - 귀여운 바닥 메기
  코리도라스: ({ size = 40, color = '#8B7355', isMoving = false }) => (
    <svg width={size * 1.1} height={size * 0.8} viewBox="0 0 88 64">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="corydoras-body">
          {/* 둥글둥글한 귀여운 몸통 */}
          <ellipse cx="44" cy="35" rx="25" ry="14" fill={color} />
          <ellipse cx="44" cy="35" rx="23" ry="12" fill="#A0826D" />
          <ellipse cx="44" cy="37" rx="20" ry="10" fill="#C8B88B" opacity="0.8" />

          {/* 귀여운 배 부분 */}
          <ellipse cx="44" cy="40" rx="18" ry="8" fill="#D2B48C" />

          {/* 귀여운 입 */}
          <ellipse cx="22" cy="37" rx="2" ry="1.5" fill="#6B5D54" opacity="0.7" />

          {/* 단순한 점박이 무늬 3개 */}
          <circle cx="44" cy="33" r="3" fill="#6B5D54" opacity="0.5" />
          <circle cx="52" cy="35" r="2.5" fill="#6B5D54" opacity="0.5" />
          <circle cx="36" cy="35" r="2.5" fill="#6B5D54" opacity="0.5" />

          {/* 부드러운 하이라이트 */}
          <ellipse cx="44" cy="30" rx="15" ry="8" fill="#FFFFFF" opacity="0.1" />
        </g>

        {/* 수염 - 개별 움직임, 한 점에서 시작 */}
        <g className={`corydoras-whisker-1 ${isMoving ? 'animate-whisker-1-fast' : 'animate-whisker-1'}`} style={{ transformOrigin: '20px 34px' }}>
          <path d="M 20 34 Q 16 33 12 32" stroke="#5C4033" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        <g className={`corydoras-whisker-2 ${isMoving ? 'animate-whisker-2-fast' : 'animate-whisker-2'}`} style={{ transformOrigin: '20px 34px' }}>
          <path d="M 20 34 Q 16 34 12 34" stroke="#5C4033" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        <g className={`corydoras-whisker-3 ${isMoving ? 'animate-whisker-3-fast' : 'animate-whisker-3'}`} style={{ transformOrigin: '20px 34px' }}>
          <path d="M 20 34 Q 16 35 12 36" stroke="#5C4033" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`corydoras-dorsal-fin ${isMoving ? 'animate-corydoras-fin-fast' : 'animate-corydoras-fin'}`} style={{ transformOrigin: '44px 25px' }}>
          <path d="M 38 25 L 44 18 L 50 25" fill={color} />
          <path d="M 40 25 L 44 20 L 48 25" fill="#6B5D54" opacity="0.7" />
        </g>

        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`corydoras-tail ${isMoving ? 'animate-corydoras-tail-fast' : 'animate-corydoras-tail'}`} style={{ transformOrigin: '68px 35px' }}>
          <path d="M 68 35 Q 82 28 85 35 Q 82 42 68 35" fill={color} />
          <path d="M 66 35 Q 79 30 82 35 Q 79 40 66 35" fill="#A0826D" opacity="0.8" />
        </g>

        {/* 눈 그룹 */}
        <g className="corydoras-eyes">
          <circle cx="28" cy="32" r="4.5" fill="black" />
          <circle cx="28.5" cy="31.5" r="2" fill="white" />
          <circle cx="27.5" cy="33.5" r="0.8" fill="#666" opacity="0.5" />
        </g>
      </g>
    </svg>
  ),

  // 11위: 체리바브 - 통통하고 귀여운 몸에 갈라진 꼬리
  체리바브: ({ size = 40, color = '#DC143C', isMoving = false }) => (
    <svg width={size * 1.1} height={size * 0.9} viewBox="0 0 88 72">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="cherry-barb-body">
          {/* 통통하고 귀여운 몸통 */}
          <ellipse cx="44" cy="36" rx="23" ry="19" fill={color} />
          <ellipse cx="44" cy="36" rx="21" ry="17" fill="#FF6B6B" />
          <ellipse cx="44" cy="36" rx="19" ry="15" fill="#FF8A8A" opacity="0.8" />

          {/* 귀여운 볼록한 배 부분 */}
          <ellipse cx="44" cy="40" rx="17" ry="13" fill="#FFB6C1" />
          <ellipse cx="44" cy="41" rx="14" ry="10" fill="#FFC0CB" opacity="0.8" />

          {/* 귀여운 입 */}
          <ellipse cx="22" cy="37" rx="1.5" ry="1" fill="#8B4513" opacity="0.6" />

          {/* 비늘 반짝임 */}
          <ellipse cx="44" cy="34" rx="6" ry="8" fill="#FF8A80" opacity="0.4" />
          <ellipse cx="52" cy="36" rx="5" ry="7" fill="#FF8A80" opacity="0.4" />
          <circle cx="38" cy="36" r="2" fill="#FFC0CB" opacity="0.5" />
          <circle cx="50" cy="33" r="1.5" fill="#FFC0CB" opacity="0.5" />
        </g>

        {/* 수염 그룹 - 개별 움직임 */}
        <g className={`cherry-barb-whisker-1 ${isMoving ? 'animate-cherry-whisker-1-fast' : 'animate-cherry-whisker-1'}`} style={{ transformOrigin: '24px 38px' }}>
          <path d="M 24 38 Q 20 39 17 40" stroke="#8B0000" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
        <g className={`cherry-barb-whisker-2 ${isMoving ? 'animate-cherry-whisker-2-fast' : 'animate-cherry-whisker-2'}`} style={{ transformOrigin: '24px 38px' }}>
          <path d="M 24 38 Q 20 37 17 36" stroke="#8B0000" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`cherry-barb-dorsal-fin ${isMoving ? 'animate-cherry-fin-fast' : 'animate-cherry-fin'}`} style={{ transformOrigin: '44px 22px' }}>
          <path d="M 32 22 Q 44 15 56 22" fill="#FF1744" />
          <path d="M 34 22 Q 44 17 54 22" fill="#FF4569" opacity="0.8" />
          <circle cx="40" cy="19" r="1" fill="#FF6B6B" opacity="0.6" />
          <circle cx="48" cy="19" r="1" fill="#FF6B6B" opacity="0.6" />
        </g>

        {/* 배지느러미 그룹 - 살짝 흔들림 */}
        <g className={`cherry-barb-ventral-fin ${isMoving ? 'animate-cherry-ventral-fast' : 'animate-cherry-ventral'}`} style={{ transformOrigin: '44px 50px' }}>
          <path d="M 32 50 Q 44 57 56 50" fill="#FF1744" />
          <path d="M 34 50 Q 44 55 54 50" fill="#FF4569" opacity="0.8" />
        </g>

        {/* 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`cherry-barb-pectoral-fin ${isMoving ? 'animate-cherry-pectoral-fast' : 'animate-cherry-pectoral'}`} style={{ transformOrigin: '28px 38px' }}>
          <ellipse cx="28" cy="38" rx="6.5" ry="4" fill="#FF1744" transform="rotate(-20 28 38)" />
          <circle cx="29" cy="37" r="0.8" fill="#FF6B6B" opacity="0.5" />
        </g>

        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`cherry-barb-tail ${isMoving ? 'animate-cherry-tail-fast' : 'animate-cherry-tail'}`} style={{ transformOrigin: '66px 36px' }}>
          {/* 살짝 갈라진 꼬리지느러미 - 체리바브의 특징 */}
          <path d="M 66 36 L 79 25 L 76 36 L 79 47 L 66 36" fill="#FF1744" />
          <path d="M 64 36 L 75 27 L 73 36 L 75 45 L 64 36" fill="#DC143C" opacity="0.8" />
          <path d="M 62 36 L 71 29 L 69 36 L 71 43 L 62 36" fill="#FF6B6B" opacity="0.5" />

          {/* 꼬리 갈라진 부분 강조 - V자 모양 */}
          <path d="M 74 36 L 79 32 L 77 36" stroke="#FF1744" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 74 36 L 79 40 L 77 36" stroke="#FF1744" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* 눈 그룹 */}
        <g className="cherry-barb-eyes">
          <circle cx="26" cy="34" r="3.5" fill="black" />
          <circle cx="26.5" cy="33.5" r="1.5" fill="white" />
          <circle cx="25.5" cy="35" r="0.5" fill="#666" opacity="0.5" />
        </g>
      </g>
    </svg>
  ),

  // 10위: 네온테트라 - 귀여운 작은 물고기와 빛나는 네온 라인
  네온테트라: ({ size = 35, color = '#00CED1', isMoving = false }) => (
    <svg width={size * 1.2} height={size * 0.8} viewBox="0 0 84 56">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="neon-tetra-body">
          {/* 작고 날씬한 유선형 몸통 - 귀여운 느낌 */}
          <ellipse cx="42" cy="28" rx="18" ry="9" fill="#E8E8E8" />
          <ellipse cx="42" cy="28" rx="16" ry="7.5" fill="#F5F5F5" />
          <ellipse cx="42" cy="29" rx="14" ry="6" fill="#FFFFFF" opacity="0.8" />
        
          {/* 귀여운 입 */}
          <ellipse cx="22" cy="28" rx="1.5" ry="1" fill="#FF69B4" opacity="0.6" />
        </g>

        {/* 네온 블루 라인 그룹 - 반짝임 효과 */}
        <g className={`neon-tetra-glow ${isMoving ? 'animate-neon-glow-fast' : 'animate-neon-glow'}`}>
          <path d="M 24 25 Q 33 24 42 24 Q 51 24 60 25" stroke={color} strokeWidth="3.5" fill="none" />
          <path d="M 24 25 Q 33 24 42 24 Q 51 24 60 25" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.9" />
          <path d="M 24 25 Q 33 24 42 24 Q 51 24 60 25" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.7" />

          {/* 빨간 라인 - 더 선명하게 */}
          <path d="M 44 31 Q 50 31 60 31" stroke="#FF1493" strokeWidth="3" fill="none" />
          <path d="M 44 31 Q 50 31 60 31" stroke="#FF69B4" strokeWidth="1.5" fill="none" opacity="0.8" />
        </g>
        
        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`neon-tetra-dorsal-fin ${isMoving ? 'animate-neon-fin-fast' : 'animate-neon-fin'}`} style={{ transformOrigin: '42px 20px' }}>
          <path d="M 36 20 Q 42 16 48 20" fill="rgba(0,206,209,0.3)" stroke="rgba(0,206,209,0.5)" strokeWidth="0.5" />
        </g>

        {/* 배지느러미 그룹 */}
        <g className={`neon-tetra-ventral-fin ${isMoving ? 'animate-neon-fin-fast' : 'animate-neon-fin'}`} style={{ transformOrigin: '42px 36px' }}>
          <path d="M 36 36 Q 42 40 48 36" fill="rgba(0,206,209,0.3)" stroke="rgba(0,206,209,0.5)" strokeWidth="0.5" />
        </g>

        {/* 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`neon-tetra-pectoral-fin ${isMoving ? 'animate-neon-pectoral-fast' : 'animate-neon-pectoral'}`} style={{ transformOrigin: '28px 30px' }}>
          <ellipse cx="28" cy="30" rx="4" ry="2.5" fill="rgba(0,206,209,0.3)" stroke="rgba(0,206,209,0.5)" strokeWidth="0.5" transform="rotate(-20 28 30)" />
        </g>
        
        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`neon-tetra-tail ${isMoving ? 'animate-neon-tail-fast' : 'animate-neon-tail'}`} style={{ transformOrigin: '60px 28px' }}>
          <path d="M 60 28 L 70 22 L 68 28 L 70 34 L 60 28" fill="rgba(0,206,209,0.4)" stroke="rgba(0,206,209,0.6)" strokeWidth="0.5" />
          <path d="M 58 28 L 66 24 L 65 28 L 66 32 L 58 28" fill="rgba(255,255,255,0.6)" />
        </g>
        
        {/* 눈 그룹 */}
        <g className="neon-tetra-eyes">
          <circle cx="26" cy="26" r="3.5" fill="black" />
          <circle cx="26.5" cy="25.5" r="1.5" fill="white" />
          <circle cx="25.5" cy="27" r="0.5" fill="#666" opacity="0.5" />
        </g>

        {/* 네온 발광 효과 */}
        <g className={`neon-tetra-aura ${isMoving ? 'animate-neon-aura-fast' : 'animate-neon-aura'}`}>
          <ellipse cx="42" cy="25" rx="12" ry="2" fill={color} opacity="0.2" />
          <ellipse cx="42" cy="28" rx="16" ry="7.5" fill="none" stroke="#00FFFF" strokeWidth="0.8" opacity="0.4" />
        </g>
      </g>
    </svg>
  ),

  // 9위: 아피스토그라마 - 화려한 시클리드 (더 작고 압축된 체형)
  아피스토그라마: ({ size = 40, color = '#FFD700', isMoving = false }) => (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="apistogramma-body">
          {/* 몸통 - 매우 작고 납작하게 압축 */}
          <ellipse cx="40" cy="20" rx="18" ry="8" fill={color} />
          <ellipse cx="40" cy="20" rx="16" ry="7" fill="#FFA500" />
          {/* 배 부분 - 노란색 */}
          <ellipse cx="40" cy="22" rx="12" ry="4" fill="#FFFF00" opacity="0.8" />

          {/* 체측 무늬 */}
          <circle cx="40" cy="20" r="2" fill="#FF6347" opacity="0.7" />
          <ellipse cx="46" cy="19" rx="1.5" ry="2" fill="#FF4500" opacity="0.6" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`apistogramma-dorsal-fin ${isMoving ? 'animate-apistogramma-dorsal-fast' : 'animate-apistogramma-dorsal'}`} style={{ transformOrigin: '40px 14px' }}>
          <path d="M 26 14 Q 30 10 34 14 T 42 10 T 50 14 T 54 14" fill="#FF8C00" />
        </g>

        {/* 뒷지느러미 그룹 - 상하 움직임 */}
        <g className={`apistogramma-anal-fin ${isMoving ? 'animate-apistogramma-anal-fast' : 'animate-apistogramma-anal'}`} style={{ transformOrigin: '40px 26px' }}>
          <path d="M 26 26 Q 30 30 34 26 T 42 30 T 50 26 T 54 26" fill="#FF8C00" />
        </g>

        {/* 배지느러미 그룹 - 살짝 흔들림 */}
        <g className={`apistogramma-ventral-fins ${isMoving ? 'animate-apistogramma-ventral-fast' : 'animate-apistogramma-ventral'}`} style={{ transformOrigin: '40px 26px' }}>
          <path d="M 34 24 L 33 28 L 35 27 Z" fill="#FFA500" />
          <path d="M 46 24 L 45 28 L 47 27 Z" fill="#FFA500" />
        </g>

        {/* 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`apistogramma-pectoral-fin ${isMoving ? 'animate-apistogramma-pectoral-fast' : 'animate-apistogramma-pectoral'}`} style={{ transformOrigin: '28px 21px' }}>
          <ellipse cx="28" cy="21" rx="4" ry="2" fill="#FFB300" opacity="0.8" transform="rotate(-20 28 21)" />
        </g>

        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`apistogramma-tail ${isMoving ? 'animate-apistogramma-tail-fast' : 'animate-apistogramma-tail'}`} style={{ transformOrigin: '58px 20px' }}>
          <path d="M 58 20 L 65 16 L 64 20 L 65 24 L 58 20" fill="#FF4500" />
        </g>

        {/* 눈 그룹 */}
        <g className="apistogramma-eyes">
          <circle cx="26" cy="18" r="2" fill="black" />
          <circle cx="26.5" cy="17.5" r="0.7" fill="white" />
        </g>
      </g>
    </svg>
  ),

  // 8위: 람 시클리드 - 날씬하고 우아한 몸에 화려한 지느러미
  람시클리드: ({ size = 45, color = '#4169E1', isMoving = false }) => (
    <svg width={size * 1.2} height={size * 1} viewBox="0 0 108 90">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="ramcichlid-body">
          {/* 날씬하고 우아한 몸통 */}
          <ellipse cx="54" cy="45" rx="20" ry="14" fill={color} />
          <ellipse cx="54" cy="45" rx="18" ry="12" fill="#6495ED" />
          <ellipse cx="54" cy="45" rx="16" ry="10" fill="#87CEEB" opacity="0.8" />

          {/* 노란색 배 부분 - 람시클리드의 매력 포인트 */}
          <ellipse cx="54" cy="50" rx="14" ry="8" fill="#FFD700" />
          <ellipse cx="54" cy="51" rx="11" ry="6" fill="#FFA500" opacity="0.9" />
          <ellipse cx="54" cy="52" rx="8" ry="4" fill="#FFFF00" opacity="0.7" />

          {/* 검은 세로줄 */}
          <rect x="52" y="36" width="2.5" height="18" fill="black" opacity="0.6" />

          {/* 빨간 점 */}
          <circle cx="46" cy="45" r="2" fill="#FF0000" opacity="0.8" />

          {/* 파란색 반짝임 */}
          <circle cx="42" cy="38" r="1.5" fill="#00FFFF" opacity="0.5" />
          <circle cx="62" cy="40" r="1.5" fill="#00FFFF" opacity="0.5" />
          <circle cx="58" cy="45" r="1.2" fill="#87CEEB" opacity="0.4" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`ramcichlid-dorsal-fin ${isMoving ? 'animate-ramcichlid-dorsal-fast' : 'animate-ramcichlid-dorsal'}`} style={{ transformOrigin: '54px 28px' }}>
          {/* 화려하고 우아한 등지느러미 - 뒤로 갈수록 높아짐 */}
          <path d="M 30 38 Q 35 18 40 28 Q 45 10 50 22 Q 54 8 58 22 Q 63 10 68 28 Q 73 18 78 38"
                fill="#1E90FF" />
          <path d="M 32 38 Q 37 20 42 30 Q 47 12 52 24 Q 56 12 61 30 Q 66 20 71 38"
                fill="#00BFFF" opacity="0.8" />
          <path d="M 34 38 Q 39 22 44 32 Q 49 14 54 26 Q 59 14 64 32 Q 69 22 74 38"
                fill="#87CEEB" opacity="0.5" />

          {/* 등지느러미 점 무늬 - 귀여움 추가 */}
          <circle cx="42" cy="25" r="1.5" fill="#00FFFF" />
          <circle cx="50" cy="20" r="1.8" fill="#00FFFF" />
          <circle cx="58" cy="18" r="2" fill="#00FFFF" />
          <circle cx="66" cy="25" r="1.5" fill="#00FFFF" />
        </g>

        {/* 뒷지느러미 그룹 - 상하 움직임 */}
        <g className={`ramcichlid-anal-fin ${isMoving ? 'animate-ramcichlid-anal-fast' : 'animate-ramcichlid-anal'}`} style={{ transformOrigin: '54px 62px' }}>
          {/* 우아한 뒷지느러미 */}
          <path d="M 30 52 Q 35 68 40 58 Q 45 72 50 62 Q 54 74 58 62 Q 63 72 68 58 Q 73 68 78 52"
                fill="#1E90FF" />
          <path d="M 32 52 Q 37 66 42 56 Q 47 70 52 60 Q 56 70 61 56 Q 66 66 71 52"
                fill="#00BFFF" opacity="0.8" />
        </g>

        {/* 배지느러미 그룹 - 살짝 흔들림 */}
        <g className={`ramcichlid-ventral-fins ${isMoving ? 'animate-ramcichlid-ventral-fast' : 'animate-ramcichlid-ventral'}`} style={{ transformOrigin: '54px 56px' }}>
          {/* 예쁜 배지느러미 */}
          <path d="M 42 52 L 38 60 L 43 58 Z" fill="#4169E1" opacity="0.8" />
          <path d="M 66 52 L 62 60 L 67 58 Z" fill="#4169E1" opacity="0.8" />
        </g>

        {/* 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`ramcichlid-pectoral-fin ${isMoving ? 'animate-ramcichlid-pectoral-fast' : 'animate-ramcichlid-pectoral'}`} style={{ transformOrigin: '36px 47px' }}>
          <ellipse cx="36" cy="47" rx="6" ry="3" fill="#6495ED" opacity="0.8" transform="rotate(-15 36 47)" />
        </g>

        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`ramcichlid-tail ${isMoving ? 'animate-ramcichlid-tail-fast' : 'animate-ramcichlid-tail'}`} style={{ transformOrigin: '74px 45px' }}>
          {/* 뿠족하게 늘어난 꼬리지느러미 */}
          <path d="M 74 45 L 88 35 L 86 45 L 88 55 L 74 45" fill="#1E90FF" />
          <path d="M 72 45 L 84 37 L 82 45 L 84 53 L 72 45" fill="#6495ED" opacity="0.8" />
          <path d="M 85 40 L 92 36 L 90 40" stroke="#00BFFF" strokeWidth="1" fill="none" />
          <path d="M 85 50 L 92 54 L 90 50" stroke="#00BFFF" strokeWidth="1" fill="none" />
        </g>

        {/* 눈 그룹 */}
        <g className="ramcichlid-eyes">
          {/* 크고 귀여운 눈 */}
          <circle cx="36" cy="42" r="4" fill="#FF1493" />
          <circle cx="36" cy="42" r="3.5" fill="black" />
          <circle cx="36.5" cy="41.5" r="1.5" fill="white" />
          <circle cx="35.5" cy="43" r="0.5" fill="#666" opacity="0.5" />
        </g>
      </g>
    </svg>
  ),

  // 7위: 구피 - 작은 몸 큰 꼬리 (몸통:꼬리 = 1:2.5)
  구피: ({ size = 45, color = '#FF69B4', isMoving = false }) => (
    <svg width={size * 1.45} height={size * 1} viewBox="0 0 117 81">
      <g transform="translate(22, 0)">
        {/* 몸통 그룹 - 고정 */}
        <g className="guppy-body">
          {/* 작은 몸통 */}
          <ellipse cx="20" cy="40" rx="9" ry="6" fill="#87CEEB" />
          <ellipse cx="20" cy="40" rx="7" ry="4.5" fill="#ADD8E6" />
        </g>

        {/* 꼬리 그룹 - 좌우 흔들림 (우아한 움직임) */}
        <g className={`guppy-tail ${isMoving ? 'animate-guppy-tail-fast' : 'animate-guppy-tail'}`} style={{ transformOrigin: '29px 40px' }}>
          {/* 화려한 꼬리 - 몸통의 2.5배 */}
          <path d="M 29 40 Q 60 10 70 40 Q 60 70 29 40" fill={color} />
          <path d="M 31 40 Q 58 13 67 40 Q 58 67 31 40" fill="#FF1493" opacity="0.9" />
          <path d="M 33 40 Q 55 17 63 40 Q 55 63 33 40" fill="#FFB6C1" opacity="0.7" />
          <path d="M 35 40 Q 52 20 60 40 Q 52 60 35 40" fill="#FFC0CB" opacity="0.5" />

          {/* 꼬리 끝의 화려한 장식 */}
          <path d="M 63 40 Q 68 25 70 40 Q 68 55 63 40" fill="#FF00FF" opacity="0.6" />
          <path d="M 60 40 Q 65 20 67 40 Q 65 60 60 40" fill="#8B008B" opacity="0.4" />

          {/* 화려한 꼬리 무늬 */}
          <circle cx="42" cy="32" r="3" fill="#00CED1" />
          <circle cx="50" cy="40" r="3.5" fill="#00CED1" />
          <circle cx="42" cy="48" r="3" fill="#00CED1" />
          <circle cx="48" cy="22" r="2.5" fill="#FFD700" opacity="0.8" />
          <circle cx="48" cy="58" r="2.5" fill="#FFD700" opacity="0.8" />
          <circle cx="55" cy="30" r="2" fill="#FF00FF" opacity="0.6" />
          <circle cx="55" cy="50" r="2" fill="#FF00FF" opacity="0.6" />
          <circle cx="38" cy="40" r="2" fill="#00FF00" opacity="0.5" />
          <circle cx="52" cy="40" r="2" fill="#FFA500" opacity="0.5" />

          {/* 꼬리의 방사형 선 패턴 */}
          <path d="M 35 40 L 60 32 M 35 40 L 60 40 M 35 40 L 60 48" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" />
          <path d="M 35 40 L 58 25 M 35 40 L 58 55" stroke="#FFD700" strokeWidth="0.6" opacity="0.3" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`guppy-dorsal-fin ${isMoving ? 'animate-guppy-fin-fast' : 'animate-guppy-fin'}`} style={{ transformOrigin: '20px 36px' }}>
          <path d="M 16 36 Q 20 33 24 36" fill="#FF69B4" />
        </g>

        {/* 배지느러미 그룹 - 살짝 흔들림 */}
        <g className={`guppy-ventral-fin ${isMoving ? 'animate-guppy-ventral-fast' : 'animate-guppy-ventral'}`} style={{ transformOrigin: '18px 43px' }}>
          <ellipse cx="18" cy="43" rx="2" ry="1.5" fill="#FF69B4" />
        </g>

        {/* 눈 그룹 */}
        <g className="guppy-eyes">
          <circle cx="14" cy="38" r="2.2" fill="black" />
          <circle cx="14.5" cy="37.5" r="0.9" fill="white" />
        </g>
      </g>
    </svg>
  ),

  // 6위: 엔젤피쉬 - 균형잡힌 삼각형 실루엣
  엔젤피쉬: ({ size = 50, color = '#C0C0C0', isMoving = false }) => (
    <svg width={size * 1.15} height={size * 1.05} viewBox="0 0 115 105">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="angelfish-body">
          {/* 균형잡힌 삼각형 실루엣 - 더 자연스러운 비율 */}
          <path d="M 57 18 L 28 52 L 57 87 L 86 52 Z" fill={color} />
          <path d="M 57 22 L 32 52 L 57 83 L 82 52 Z" fill="#E5E5E5" />

          {/* 검은 세로 줄무늬 - 엔젤피쉬 특유의 패턴 */}
          <rect x="40" y="42" width="4" height="22" fill="black" opacity="0.8" />
          <rect x="55" y="38" width="5" height="28" fill="black" opacity="0.8" />
          <rect x="70" y="42" width="4" height="22" fill="black" opacity="0.8" />
          <rect x="82" y="47" width="3" height="12" fill="black" opacity="0.6" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`angelfish-dorsal ${isMoving ? 'animate-angelfish-dorsal-fast' : 'animate-angelfish-dorsal'}`} style={{ transformOrigin: '57px 12px' }}>
          {/* 높고 우아한 등지느러미 */}
          <path d="M 57 12 Q 40 5 50 15 L 57 22 L 64 15 Q 74 5 57 12" fill="#A9A9A9" />
          <path d="M 50 25 L 45 8 L 48 20 M 64 25 L 69 8 L 66 20" stroke="#808080" strokeWidth="1.5" fill="none" />
        </g>

        {/* 뒷지느러미 그룹 - 상하 움직임 */}
        <g className={`angelfish-anal ${isMoving ? 'animate-angelfish-anal-fast' : 'animate-angelfish-anal'}`} style={{ transformOrigin: '57px 93px' }}>
          {/* 우아한 뒷지느러미 */}
          <path d="M 57 93 Q 40 103 50 90 L 57 83 L 64 90 Q 74 103 57 93" fill="#A9A9A9" />
          <path d="M 50 80 L 45 97 L 48 85 M 64 80 L 69 97 L 66 85" stroke="#808080" strokeWidth="1.5" fill="none" />
        </g>

        {/* 배지느러미 그룹 - 실처럼 늘어진 움직임 */}
        <g className={`angelfish-ventral-left ${isMoving ? 'animate-angelfish-ventral-fast' : 'animate-angelfish-ventral'}`} style={{ transformOrigin: '40px 62px' }}>
          {/* 왼쪽 실처럼 길게 늘어진 배지느러미 */}
          <path d="M 42 62 L 39 85 L 41 80" stroke="#A9A9A9" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <g className={`angelfish-ventral-right ${isMoving ? 'animate-angelfish-ventral-fast' : 'animate-angelfish-ventral'}`} style={{ transformOrigin: '74px 62px', animationDelay: '0.3s' }}>
          {/* 오른쪽 실처럼 길게 늘어진 배지느러미 */}
          <path d="M 72 62 L 75 85 L 73 80" stroke="#A9A9A9" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`angelfish-pectoral ${isMoving ? 'animate-angelfish-pectoral-fast' : 'animate-angelfish-pectoral'}`} style={{ transformOrigin: '38px 52px' }}>
          <ellipse cx="38" cy="52" rx="14" ry="5" fill="#A9A9A9" opacity="0.8" transform="rotate(-25 38 52)" />
        </g>

        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`angelfish-tail ${isMoving ? 'animate-angelfish-tail-fast' : 'animate-angelfish-tail'}`} style={{ transformOrigin: '86px 52px' }}>
          <path d="M 86 52 L 103 38 L 98 52 L 103 66 L 86 52" fill="#A9A9A9" />
        </g>

        {/* 눈 그룹 */}
        <g className="angelfish-eyes">
          <circle cx="35" cy="48" r="3.5" fill="black" />
          <circle cx="35.5" cy="47.5" r="1.5" fill="white" />
        </g>
      </g>
    </svg>
  ),

  // 5위: 킬리피쉬 - 길쭉한 몸에 위쪽에 위치한 입
  킬리피쉬: ({ size = 45, color = '#FF4500', isMoving = false }) => (
    <svg width={size * 1.2} height={size * 0.7} viewBox="0 0 108 63">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="killifish-body">
          {/* 길쭉한 몸통 - 킬리피쉬의 특징 */}
          <ellipse cx="54" cy="31" rx="32" ry="13" fill={color} />
          <ellipse cx="54" cy="31" rx="30" ry="11" fill="#FF6347" />
        
        {/* 위쪽에 위치한 입 - 킬리피쉬의 핵심 특징 */}
        <ellipse cx="22" cy="28" rx="3" ry="2" fill="#8B4513" />
        
        {/* 무지개빛 비늘 효과 */}
        <ellipse cx="40" cy="29" rx="10" ry="5" fill="#FFD700" opacity="0.5" />
        <ellipse cx="60" cy="30" rx="10" ry="5" fill="#00CED1" opacity="0.5" />
        
        {/* 노란 점 무늬 */}
        <circle cx="35" cy="31" r="2.5" fill="#FFD700" />
        <circle cx="45" cy="30" r="3" fill="#FFD700" />
        <circle cx="55" cy="31" r="2.5" fill="#FFD700" />
        <circle cx="65" cy="30" r="2" fill="#FFD700" />
        <circle cx="75" cy="31" r="1.8" fill="#FFD700" />
        
          {/* 빨간 점 무늬 */}
          <circle cx="40" cy="34" r="2" fill="#FF0000" opacity="0.8" />
          <circle cx="50" cy="34" r="2" fill="#FF0000" opacity="0.8" />
          <circle cx="60" cy="34" r="2" fill="#FF0000" opacity="0.8" />
          <circle cx="70" cy="34" r="1.8" fill="#FF0000" opacity="0.8" />
        </g>
        
        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`killifish-dorsal-fin ${isMoving ? 'animate-killifish-fin-fast' : 'animate-killifish-fin'}`} style={{ transformOrigin: '80px 19px' }}>
          <path d="M 76 22 Q 80 15 84 22" fill="#FF8C00" />
          <circle cx="80" cy="18" r="1.2" fill="#FFD700" opacity="0.7" />
        </g>
        
        {/* 뒷지느러미 그룹 - 상하 움직임 */}
        <g className={`killifish-anal-fin ${isMoving ? 'animate-killifish-fin-fast' : 'animate-killifish-fin'}`} style={{ transformOrigin: '80px 43px' }}>
          <path d="M 76 40 Q 80 47 84 40" fill="#FF8C00" />
          <circle cx="80" cy="44" r="1.2" fill="#FFD700" opacity="0.7" />
        </g>
        
        {/* 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`killifish-pectoral-fin ${isMoving ? 'animate-killifish-pectoral-fast' : 'animate-killifish-pectoral'}`} style={{ transformOrigin: '32px 35px' }}>
          <ellipse cx="32" cy="35" rx="6" ry="3.5" fill="#FF6347" transform="rotate(-20 32 35)" />
        </g>
        
        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`killifish-tail ${isMoving ? 'animate-killifish-tail-fast' : 'animate-killifish-tail'}`} style={{ transformOrigin: '86px 31px' }}>
          <path d="M 86 31 L 98 21 L 96 31 L 98 41 L 86 31" fill="#FF8C00" />
          <circle cx="92" cy="31" r="1.8" fill="#FFD700" />
        </g>
        
        {/* 눈 그룹 */}
        <g className="killifish-eyes">
          <circle cx="26" cy="29" r="3" fill="black" />
          <circle cx="26.5" cy="28.5" r="1.2" fill="white" />
        </g>
        
        {/* 청록색 라인 */}
        <path d="M 30 28 Q 50 27 70 28" stroke="#00CED1" strokeWidth="1.5" fill="none" opacity="0.7" />
        
        {/* 보라색 반짝임 */}
        <circle cx="43" cy="28" r="1.8" fill="#9370DB" opacity="0.5" />
        <circle cx="58" cy="29" r="1.8" fill="#9370DB" opacity="0.5" />
      </g>
    </svg>
  ),

  // 4위: 베타 - 길고 흐르는 지느러미와 부채꼴 꼬리
  베타: ({ size = 50, color = '#8B008B', isMoving = false }) => (
    <svg width={size * 1.3} height={size * 1.2} viewBox="0 0 130 120">
      <g transform="translate(25, 0)">
        {/* 작은 몸통 - 지느러미가 더 부각되도록 */}
        <ellipse cx="40" cy="60" rx="15" ry="12" fill={color} />
        <ellipse cx="40" cy="60" rx="13" ry="10" fill="#9370DB" />
        <ellipse cx="40" cy="58" rx="10" ry="7" fill="#BA55D3" opacity="0.6" />

        {/* 매우 크고 긴 등지느러미 - 흐르는 듯한 형태 (원래 디자인) */}
        <g className={`beta-dorsal-fin ${isMoving ? 'animate-beta-dorsal-fast' : 'animate-beta-dorsal'}`} style={{ transformOrigin: '40px 30px' }}>
          <path d="M 25 48 Q 20 20 25 30 Q 30 15 35 25 Q 40 10 45 25 Q 50 15 55 30 Q 60 20 55 48"
                fill="#8A2BE2" opacity="0.8" />
          <path d="M 27 48 Q 22 25 28 35 Q 35 18 40 30 Q 45 18 52 35 Q 58 25 53 48"
                fill="#9400D3" opacity="0.6" />
          {/* 등지느러미 레이스 효과 */}
          <path d="M 30 35 L 28 20 L 32 28 M 35 30 L 33 15 L 37 25 M 40 28 L 38 12 L 42 25 M 45 30 L 43 15 L 47 25 M 50 35 L 48 20 L 52 28"
                stroke="#8B008B" strokeWidth="1" fill="none" opacity="0.5" />
        </g>

        {/* 매우 크고 긴 뒷지느러미 - 우아하게 흘러내림 (원래 디자인) */}
        <g className={`beta-anal-fin ${isMoving ? 'animate-beta-anal-fast' : 'animate-beta-anal'}`} style={{ transformOrigin: '40px 90px' }}>
          <path d="M 25 72 Q 20 100 25 90 Q 30 105 35 95 Q 40 110 45 95 Q 50 105 55 90 Q 60 100 55 72"
                fill="#8A2BE2" opacity="0.8" />
          <path d="M 27 72 Q 22 95 28 85 Q 35 102 40 90 Q 45 102 52 85 Q 58 95 53 72"
                fill="#9400D3" opacity="0.6" />
          {/* 뒷지느러미 레이스 효과 */}
          <path d="M 30 85 L 28 100 L 32 92 M 35 90 L 33 105 L 37 95 M 40 92 L 38 108 L 42 95 M 45 90 L 43 105 L 47 95 M 50 85 L 48 100 L 52 92"
                stroke="#8B008B" strokeWidth="1" fill="none" opacity="0.5" />
        </g>

        {/* 거대한 부채꼴 꼬리 - 베타의 상징 */}
        <g className={`beta-tail ${isMoving ? 'animate-beta-tail-fast' : 'animate-beta-tail'}`} style={{ transformOrigin: '55px 60px' }}>
          <path d="M 55 60 Q 90 20 85 60 Q 90 100 55 60" fill="#9400D3" opacity="0.8" />
          <path d="M 53 60 Q 85 25 80 60 Q 85 95 53 60" fill="#8B008B" opacity="0.7" />
          <path d="M 51 60 Q 80 30 75 60 Q 80 90 51 60" fill="#BA55D3" opacity="0.5" />
          {/* 꼬리 레이스 패턴 */}
          <path d="M 60 60 Q 70 40 68 60 Q 70 80 60 60" fill="none" stroke="#E6E6FA" strokeWidth="1" opacity="0.5" />
          <path d="M 65 60 Q 75 35 73 60 Q 75 85 65 60" fill="none" stroke="#E6E6FA" strokeWidth="1" opacity="0.5" />
        </g>

        {/* 길고 우아한 가슴지느러미 */}
        <g className={`beta-pectoral-fin ${isMoving ? 'animate-beta-pectoral-fast' : 'animate-beta-pectoral'}`} style={{ transformOrigin: '30px 64px' }}>
          <ellipse cx="30" cy="64" rx="12" ry="8" fill="#9370DB" opacity="0.8" transform="rotate(-25 30 64)" />
          <path d="M 25 64 Q 20 70 25 68 Q 20 75 28 70" fill="#BA55D3" opacity="0.6" />
        </g>

        {/* 양쪽 배지느러미 - 위아래 각 6개씩 (완벽한 대칭) */}
        {/* 아래쪽 왼쪽 배지느러미 그룹 */}
        <g className={`beta-ventral-left-1 ${isMoving ? 'animate-beta-ventral-left-1-fast' : 'animate-beta-ventral-left-1'}`} style={{ transformOrigin: '38px 68px' }}>
          <path d="M 38 68 Q 33 80 34 84 Q 35 85 36 83" fill="#9400D3" opacity="0.7" />
          <path d="M 38 68 L 34 82" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
        <g className={`beta-ventral-left-2 ${isMoving ? 'animate-beta-ventral-left-2-fast' : 'animate-beta-ventral-left-2'}`} style={{ transformOrigin: '35px 68px' }}>
          <path d="M 35 68 Q 30 83 32 88 Q 34 90 36 86" fill="#9400D3" opacity="0.8" />
          <path d="M 35 68 L 32 86" stroke="#8B008B" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>
        <g className={`beta-ventral-left-3 ${isMoving ? 'animate-beta-ventral-left-3-fast' : 'animate-beta-ventral-left-3'}`} style={{ transformOrigin: '32px 68px' }}>
          <path d="M 32 68 Q 27 80 28 84 Q 29 85 30 83" fill="#9400D3" opacity="0.7" />
          <path d="M 32 68 L 28 82" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>

        {/* 위쪽 왼쪽 배지느러미 그룹 */}
        <g className={`beta-ventral-top-left-1 ${isMoving ? 'animate-beta-ventral-left-1-fast' : 'animate-beta-ventral-left-1'}`} style={{ transformOrigin: '38px 52px' }}>
          <path d="M 38 52 Q 33 40 34 36 Q 35 35 36 37" fill="#9400D3" opacity="0.7" />
          <path d="M 38 52 L 34 38" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
        <g className={`beta-ventral-top-left-2 ${isMoving ? 'animate-beta-ventral-left-2-fast' : 'animate-beta-ventral-left-2'}`} style={{ transformOrigin: '35px 52px' }}>
          <path d="M 35 52 Q 30 37 32 32 Q 34 30 36 34" fill="#9400D3" opacity="0.8" />
          <path d="M 35 52 L 32 34" stroke="#8B008B" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>
        <g className={`beta-ventral-top-left-3 ${isMoving ? 'animate-beta-ventral-left-3-fast' : 'animate-beta-ventral-left-3'}`} style={{ transformOrigin: '32px 52px' }}>
          <path d="M 32 52 Q 27 40 28 36 Q 29 35 30 37" fill="#9400D3" opacity="0.7" />
          <path d="M 32 52 L 28 38" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>

        {/* 아래쪽 오른쪽 배지느러미 그룹 */}
        <g className={`beta-ventral-right-1 ${isMoving ? 'animate-beta-ventral-right-1-fast' : 'animate-beta-ventral-right-1'}`} style={{ transformOrigin: '42px 68px' }}>
          <path d="M 42 68 Q 47 80 46 84 Q 45 85 44 83" fill="#9400D3" opacity="0.7" />
          <path d="M 42 68 L 46 82" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
        <g className={`beta-ventral-right-2 ${isMoving ? 'animate-beta-ventral-right-2-fast' : 'animate-beta-ventral-right-2'}`} style={{ transformOrigin: '45px 68px' }}>
          <path d="M 45 68 Q 50 83 48 88 Q 46 90 44 86" fill="#9400D3" opacity="0.8" />
          <path d="M 45 68 L 48 86" stroke="#8B008B" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>
        <g className={`beta-ventral-right-3 ${isMoving ? 'animate-beta-ventral-right-3-fast' : 'animate-beta-ventral-right-3'}`} style={{ transformOrigin: '48px 68px' }}>
          <path d="M 48 68 Q 53 80 52 84 Q 51 85 50 83" fill="#9400D3" opacity="0.7" />
          <path d="M 48 68 L 52 82" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>

        {/* 위쪽 오른쪽 배지느러미 그룹 */}
        <g className={`beta-ventral-top-right-1 ${isMoving ? 'animate-beta-ventral-right-1-fast' : 'animate-beta-ventral-right-1'}`} style={{ transformOrigin: '42px 52px' }}>
          <path d="M 42 52 Q 47 40 46 36 Q 45 35 44 37" fill="#9400D3" opacity="0.7" />
          <path d="M 42 52 L 46 38" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
        <g className={`beta-ventral-top-right-2 ${isMoving ? 'animate-beta-ventral-right-2-fast' : 'animate-beta-ventral-right-2'}`} style={{ transformOrigin: '45px 52px' }}>
          <path d="M 45 52 Q 50 37 48 32 Q 46 30 44 34" fill="#9400D3" opacity="0.8" />
          <path d="M 45 52 L 48 34" stroke="#8B008B" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>
        <g className={`beta-ventral-top-right-3 ${isMoving ? 'animate-beta-ventral-right-3-fast' : 'animate-beta-ventral-right-3'}`} style={{ transformOrigin: '48px 52px' }}>
          <path d="M 48 52 Q 53 40 52 36 Q 51 35 50 37" fill="#9400D3" opacity="0.7" />
          <path d="M 48 52 L 52 38" stroke="#8B008B" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>

        {/* 눈 */}
        <circle cx="28" cy="57" r="2.5" fill="black" />
        <circle cx="28.5" cy="56.5" r="1" fill="white" />

        {/* 반짝임 효과 */}
        <circle cx="40" cy="57" r="1.5" fill="#E6E6FA" opacity="0.7" />
        <circle cx="45" cy="60" r="1.5" fill="#E6E6FA" opacity="0.7" />
      </g>
    </svg>
  ),

  // 3위: 디스커스 - 플래티넘 랭크의 살아있는 보석
  디스커스: ({ size = 55, color = '#FF8C00', isMoving = false }) => (
    <svg width={size * 1.2} height={size * 1.1} viewBox="0 0 132 121">
      <g>
        {/* 화려한 그라데이션 정의 */}
        <defs>
          <radialGradient id="discusGradient" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="30%" stopColor="#FF6347" />
            <stop offset="60%" stopColor="#FF8C00" />
            <stop offset="90%" stopColor="#DC143C" />
            <stop offset="100%" stopColor="#B22222" />
          </radialGradient>
          <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA500" opacity="0.9" />
            <stop offset="50%" stopColor="#FF6347" opacity="0.7" />
            <stop offset="100%" stopColor="#FF1493" opacity="0.5" />
          </linearGradient>
        </defs>

        {/* 몸통 그룹 - 고정 */}
        <g className="discus-body">
          {/* 하트형에 가까운 원반 몸통 - 위쪽이 살짝 볼록 */}
          <path d="M 66 25 Q 35 25 20 45 Q 15 66 20 87 Q 35 107 66 107 Q 97 107 112 87 Q 117 66 112 45 Q 97 25 66 25"
                fill="url(#discusGradient)" />

          {/* 은은한 줄무늬 패턴 */}
          <path d="M 45 40 Q 45 66 45 92" stroke="#8B0000" strokeWidth="2" opacity="0.3" />
          <path d="M 55 35 Q 55 66 55 97" stroke="#8B0000" strokeWidth="2.5" opacity="0.3" />
          <path d="M 66 30 Q 66 66 66 102" stroke="#8B0000" strokeWidth="3" opacity="0.3" />
          <path d="M 77 35 Q 77 66 77 97" stroke="#8B0000" strokeWidth="2.5" opacity="0.3" />
          <path d="M 87 40 Q 87 66 87 92" stroke="#8B0000" strokeWidth="2" opacity="0.3" />

          {/* 화려한 점무늬 */}
          <circle cx="50" cy="50" r="3" fill="#00CED1" opacity="0.7" />
          <circle cx="70" cy="55" r="3.5" fill="#00BFFF" opacity="0.7" />
          <circle cx="55" cy="70" r="3" fill="#1E90FF" opacity="0.7" />
          <circle cx="75" cy="75" r="2.5" fill="#00CED1" opacity="0.6" />
          <circle cx="60" cy="45" r="2.5" fill="#4169E1" opacity="0.6" />
          <circle cx="80" cy="60" r="2" fill="#00BFFF" opacity="0.5" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`discus-dorsal-fin ${isMoving ? 'animate-discus-fin-fast' : 'animate-discus-fin'}`} style={{ transformOrigin: '66px 18px' }}>
          {/* 몸을 감싸는 우아한 등지느러미 */}
          <path d="M 66 18 Q 30 22 15 42 Q 10 66 15 90 Q 30 110 66 114 Q 102 110 117 90 Q 122 66 117 42 Q 102 22 66 18"
                fill="url(#finGradient)" opacity="0.8" />

          {/* 등지느러미 물결 디테일 */}
          <path d="M 66 20 Q 50 22 35 30 M 66 20 Q 82 22 97 30 M 66 20 Q 45 24 25 35 M 66 20 Q 87 24 107 35"
                stroke="#FFD700" strokeWidth="1" opacity="0.4" />

          {/* 뒷지느러미 물결 디테일 */}
          <path d="M 66 112 Q 50 110 35 102 M 66 112 Q 82 110 97 102 M 66 112 Q 45 108 25 97 M 66 112 Q 87 108 107 97"
                stroke="#FFD700" strokeWidth="1" opacity="0.4" />
        </g>

        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`discus-tail ${isMoving ? 'animate-discus-tail-fast' : 'animate-discus-tail'}`} style={{ transformOrigin: '112px 66px' }}>
          {/* 삼각형 꼬리지느러미 - 디스커스의 필수 요소 */}
          <path d="M 112 66 L 128 48 L 125 66 L 128 84 L 112 66" fill="url(#finGradient)" />
          <path d="M 110 66 L 124 50 L 121 66 L 124 82 L 110 66" fill="#FF6347" opacity="0.7" />
          <path d="M 108 66 L 120 52 L 117 66 L 120 80 L 108 66" fill="#FFD700" opacity="0.5" />
        </g>

        {/* 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`discus-pectoral ${isMoving ? 'animate-discus-pectoral-fast' : 'animate-discus-pectoral'}`} style={{ transformOrigin: '30px 70px' }}>
          {/* 우아한 가슴지느러미 */}
          <ellipse cx="30" cy="70" rx="15" ry="8" fill="url(#finGradient)" opacity="0.8" transform="rotate(-25 30 70)" />
          <path d="M 25 70 Q 22 75 25 73 Q 22 78 28 75" fill="#FF6347" opacity="0.5" />
        </g>

        {/* 눈 그룹 */}
        <g className="discus-eyes">
          {/* 초대형 귀여운 눈 - 1.5배 크게 */}
          <circle cx="40" cy="55" r="9" fill="#8B0000" />
          <circle cx="40" cy="55" r="8.5" fill="black" />
          <circle cx="41" cy="54" r="4" fill="white" />
          <circle cx="39" cy="57" r="1.5" fill="#888" opacity="0.5" />
          <circle cx="42" cy="53" r="1" fill="#FFF" opacity="0.8" />

          {/* 작고 귀여운 입 */}
          <ellipse cx="32" cy="62" rx="2.5" ry="2" fill="#8B4513" opacity="0.7" />
        </g>

        {/* 플래티넘 반짝임 효과 */}
        <ellipse cx="66" cy="60" rx="35" ry="30" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
        <ellipse cx="66" cy="60" rx="30" ry="25" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />

        {/* 미세한 하이라이트 */}
        <ellipse cx="55" cy="45" rx="15" ry="20" fill="#FFFFFF" opacity="0.15" />
        <ellipse cx="75" cy="50" rx="12" ry="15" fill="#FFD700" opacity="0.1" />

        {/* 고급스러운 광택 */}
        <circle cx="50" cy="40" r="2" fill="#FFFFFF" opacity="0.6" />
        <circle cx="70" cy="45" r="1.5" fill="#FFFFFF" opacity="0.5" />
        <circle cx="60" cy="35" r="1" fill="#FFFFFF" opacity="0.7" />
      </g>
    </svg>
  ),

  // 2위: 만다린피쉬 - 통통하고 둥근 귀여운 몸과 초대형 눈
  만다린피쉬: ({ size = 50, color = '#FF4500', isMoving = false }) => (
    <svg width={size * 1.1} height={size * 1} viewBox="0 0 110 100">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="mandarin-body">
          {/* 매우 통통하고 둥근 몸통 - 거의 원형에 가깝게 */}
          <ellipse cx="55" cy="50" rx="30" ry="28" fill="#FF8C00" />
          <ellipse cx="55" cy="50" rx="28" ry="26" fill="#FF7F50" />
          <ellipse cx="55" cy="50" rx="25" ry="23" fill="#FFA07A" opacity="0.8" />
          <ellipse cx="55" cy="50" rx="20" ry="18" fill="#FFCBA4" opacity="0.6" />

          {/* 복잡한 미로 무늬 - 파란색 라인 (통통한 몸에 맞게 조정) */}
          <path d="M 32 48 Q 38 43 44 48 T 55 48 T 66 48 T 78 48"
                fill="none" stroke="#00CED1" strokeWidth="3.5" />
          <path d="M 32 52 Q 38 57 44 52 T 55 52 T 66 52 T 78 52"
                fill="none" stroke="#1E90FF" strokeWidth="3.5" />
          <path d="M 35 45 Q 41 40 47 45 T 57 45 T 67 45 T 75 45"
                fill="none" stroke="#00BFFF" strokeWidth="2.5" />
          <path d="M 35 55 Q 41 60 47 55 T 57 55 T 67 55 T 75 55"
                fill="none" stroke="#4169E1" strokeWidth="2.5" />

          {/* 초록색 무늬 */}
          <circle cx="42" cy="48" r="3.5" fill="#00FF00" opacity="0.6" />
          <circle cx="55" cy="45" r="3.5" fill="#00FF00" opacity="0.6" />
          <circle cx="68" cy="48" r="3.5" fill="#00FF00" opacity="0.6" />

          {/* 주황색 점 */}
          <circle cx="47" cy="50" r="3" fill="#FF4500" />
          <circle cx="55" cy="48" r="3.5" fill="#FF4500" />
          <circle cx="63" cy="50" r="3" fill="#FF6347" />
          <circle cx="51" cy="53" r="2.5" fill="#FF6347" />
          <circle cx="59" cy="53" r="2.5" fill="#FF6347" />

          {/* 보라색 테두리 */}
          <ellipse cx="55" cy="50" rx="27" ry="25" fill="none" stroke="#8A2BE2" strokeWidth="2" opacity="0.7" />

          {/* 귀여운 작은 입 */}
          <ellipse cx="28" cy="51" rx="3" ry="2.5" fill="#8B4513" opacity="0.7" />

          {/* 형광 효과 */}
          <ellipse cx="55" cy="48" rx="22" ry="15" fill="#00FFFF" opacity="0.15" />
          <ellipse cx="50" cy="45" rx="21" ry="18" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`mandarin-dorsal ${isMoving ? 'animate-mandarin-dorsal-fast' : 'animate-mandarin-dorsal'}`} style={{ transformOrigin: '55px 27px' }}>
          {/* 통통한 둥근 등지느러미 */}
          <path d="M 38 32 Q 55 22 72 32" fill="#FF8C00" />
          <path d="M 40 32 Q 55 24 70 32" fill="#FF7F50" opacity="0.8" />
          <circle cx="47" cy="28" r="2" fill="#00CED1" />
          <circle cx="55" cy="25" r="2.5" fill="#00CED1" />
          <circle cx="63" cy="28" r="2" fill="#00CED1" />
        </g>

        {/* 뒷지느러미 그룹 - 상하 움직임 */}
        <g className={`mandarin-anal ${isMoving ? 'animate-mandarin-anal-fast' : 'animate-mandarin-anal'}`} style={{ transformOrigin: '55px 73px' }}>
          {/* 통통한 둥근 뒷지느러미 */}
          <path d="M 38 68 Q 55 78 72 68" fill="#FF8C00" />
          <path d="M 40 68 Q 55 76 70 68" fill="#FF7F50" opacity="0.8" />
        </g>

        {/* 왼쪽 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`mandarin-pectoral-left ${isMoving ? 'animate-mandarin-pectoral-left-fast' : 'animate-mandarin-pectoral-left'}`} style={{ transformOrigin: '35px 53px' }}>
          <ellipse cx="35" cy="53" rx="8" ry="5" fill="#FFA500" opacity="0.8" transform="rotate(-20 35 53)" />
        </g>

        {/* 오른쪽 가슴지느러미 그룹 - 펄럭임 */}
        <g className={`mandarin-pectoral-right ${isMoving ? 'animate-mandarin-pectoral-right-fast' : 'animate-mandarin-pectoral-right'}`} style={{ transformOrigin: '75px 53px' }}>
          <ellipse cx="75" cy="53" rx="8" ry="5" fill="#FFA500" opacity="0.8" transform="rotate(20 75 53)" />
        </g>

        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`mandarin-tail ${isMoving ? 'animate-mandarin-tail-fast' : 'animate-mandarin-tail'}`} style={{ transformOrigin: '85px 50px' }}>
          {/* 통통한 둥근 꼬리지느러미 */}
          <path d="M 85 50 Q 98 37 96 50 Q 98 63 85 50" fill="#FF8C00" />
          <path d="M 83 50 Q 94 39 92 50 Q 94 61 83 50" fill="#FF7F50" opacity="0.8" />
          <circle cx="89" cy="50" r="2.5" fill="#00CED1" />
          <circle cx="87" cy="46" r="2" fill="#00BFFF" opacity="0.7" />
          <circle cx="87" cy="54" r="2" fill="#00BFFF" opacity="0.7" />
        </g>

        {/* 눈 그룹 */}
        <g className="mandarin-eyes">
          {/* 초대형 크고 귀여운 눈 - 통통한 몸에 더 크게 */}
          <circle cx="35" cy="46" r="7.5" fill="black" />
          <circle cx="35" cy="46" r="7" fill="#1a1a1a" />
          <circle cx="35.5" cy="45" r="3.5" fill="white" />
          <circle cx="34" cy="48" r="1.5" fill="#888" opacity="0.5" />
        </g>
      </g>
    </svg>
  ),

  // 1위: 플라티넘 아로와나 - 용의 왕
  아로와나: ({ size = 60, color = '#C0C0C0', isMoving = false }) => (
    <svg width={size * 1.8} height={size * 0.6} viewBox="0 0 216 72">
      <g>
        {/* 몸통 그룹 - 고정 */}
        <g className="arowana-body">
          {/* 매우 긴 용 같은 몸통 - 더 날씬하고 길게 */}
          <ellipse cx="108" cy="36" rx="75" ry="16" fill={color} />
          <ellipse cx="108" cy="36" rx="73" ry="14" fill="#E5E5E5" />
          {/* 플라티넘 메탈릭 광택 */}
          <ellipse cx="90" cy="30" rx="35" ry="10" fill="#F8F8FF" opacity="0.7" />
          <ellipse cx="120" cy="32" rx="30" ry="8" fill="#F8F8FF" opacity="0.5" />
          <ellipse cx="145" cy="34" rx="25" ry="6" fill="#F8F8FF" opacity="0.4" />

          {/* 큰 입 - 아로와나의 특징 */}
          <path d="M 28 36 Q 25 32 28 28 L 38 30 L 38 42 L 28 44 Q 25 40 28 36" fill="#D3D3D3" />
          <path d="M 30 36 L 36 36" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 28 32 Q 32 34 36 32" fill="none" stroke="#808080" strokeWidth="1" />

          {/* 큰 비늘 패턴 - 다이아몬드 (긴 몸에 맞게 더 많이) */}
          <path d="M 50 36 L 53 33 L 56 36 L 53 39 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 60 34 L 63 31 L 66 34 L 63 37 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 70 36 L 73 33 L 76 36 L 73 39 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 80 34 L 83 31 L 86 34 L 83 37 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 90 36 L 93 33 L 96 36 L 93 39 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 100 34 L 103 31 L 106 34 L 103 37 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 110 36 L 113 33 L 116 36 L 113 39 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 120 34 L 123 31 L 126 34 L 123 37 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 130 36 L 133 33 L 136 36 L 133 39 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 140 34 L 143 31 L 146 34 L 143 37 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 150 36 L 153 33 L 156 36 L 153 39 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
          <path d="M 160 34 L 163 31 L 166 34 L 163 37 Z" fill="none" stroke="#A9A9A9" strokeWidth="1.5" />
        </g>


        {/* 등지느러미 그룹 - 상하 움직임 */}
        <g className={`arowana-dorsal ${isMoving ? 'animate-arowana-dorsal-fast' : 'animate-arowana-dorsal'}`} style={{ transformOrigin: '108px 21px' }}>
          <path d="M 55 24 Q 108 18 160 24" fill="#D3D3D3" />
          <circle cx="80" cy="22" r="1" fill="#C0C0C0" />
          <circle cx="108" cy="20" r="1" fill="#C0C0C0" />
          <circle cx="135" cy="22" r="1" fill="#C0C0C0" />
        </g>

        {/* 뒷지느러미 그룹 - 상하 움직임 */}
        <g className={`arowana-anal ${isMoving ? 'animate-arowana-anal-fast' : 'animate-arowana-anal'}`} style={{ transformOrigin: '108px 51px' }}>
          <path d="M 65 48 Q 108 54 150 48" fill="#D3D3D3" />
        </g>

        {/* 배지느러미 그룹 - 살짝 흔들림 */}
        <g className={`arowana-ventral ${isMoving ? 'animate-arowana-ventral-fast' : 'animate-arowana-ventral'}`} style={{ transformOrigin: '108px 44px' }}>
          <ellipse cx="85" cy="44" rx="5" ry="3" fill="#D3D3D3" />
          <ellipse cx="130" cy="44" rx="5" ry="3" fill="#D3D3D3" />
        </g>


        {/* 꼬리지느러미 그룹 - 좌우 흔들림 */}
        <g className={`arowana-tail ${isMoving ? 'animate-arowana-tail-fast' : 'animate-arowana-tail'}`} style={{ transformOrigin: '183px 36px' }}>
          <path d="M 183 36 L 206 20 L 200 36 L 206 52 L 183 36" fill="#D3D3D3" />
          <path d="M 181 36 L 201 22 L 195 36 L 201 50 L 181 36" fill="#C0C0C0" opacity="0.7" />
        </g>

        {/* 눈 그룹 */}
        <g className="arowana-eyes">
          <circle cx="42" cy="32" r="4.5" fill="black" />
          <circle cx="42.5" cy="31.5" r="2" fill="white" />
        </g>

        {/* 금색 광채 */}
        <circle cx="108" cy="36" r="3.5" fill="#FFD700" opacity="0.3" />
        <circle cx="85" cy="34" r="2.5" fill="#FFD700" opacity="0.3" />
        <circle cx="130" cy="34" r="2.5" fill="#FFD700" opacity="0.3" />
      </g>
    </svg>
  )
};

export default FishIcons;