import React from 'react';

const GoldTank = ({ className = "", isPreview = false }) => {
  const size = isPreview ? "w-20 h-16" : "w-full h-full";
  
  return (
    <div className={`relative ${size} ${className}`}>
      <svg 
        viewBox="35 42 330 216" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* 골드 어항 - 화려한 황금 장식과 보석 포인트 */}
        
        {/* 필터 정의 */}
        <defs>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="goldShimmer">
            <feTurbulence baseFrequency="0.02" numOctaves="3" result="turbulence"/>
            <feComposite in="turbulence" in2="SourceGraphic" operator="multiply"/>
          </filter>
        </defs>
        
        
        {/* 직사각형 어항 프레임 */}
        <rect 
          x="40" 
          y="45" 
          width="320" 
          height="205"
          fill="none"
          stroke="url(#goldFrameGradient)"
          strokeWidth="4"
        />
        
        {/* 물 효과 - 럭셔리 */}
        <rect 
          x="44" 
          y="49" 
          width="312" 
          height="197"
          fill="url(#luxuryWaterGold)"
          opacity="0.5"
        />
        
        {/* 수면 효과 - 직선 */}
        <rect 
          x="44" 
          y="50" 
          width="312" 
          height="4" 
          fill="url(#goldWaterSurface)"
          opacity="0.6"
          className="animate-wave"
        />
        
        {/* 황금 프레임 - 상단 테두리 */}
        <rect 
          x="40" 
          y="45" 
          width="320" 
          height="7"
          fill="url(#goldLuxuryGradient)"
          filter="url(#goldGlow)"
        />
        
        {/* 보석 장식 - 상단 테두리에 위치 */}
        <g filter="url(#goldGlow)">
          <circle cx="100" cy="48" r="4" fill="url(#rubyGem)"/>
          <circle cx="200" cy="48" r="5" fill="url(#emeraldGem)"/>
          <circle cx="300" cy="48" r="4" fill="url(#sapphireGem)"/>
        </g>
        
        {/* 대각선 조명 효과 */}
        <path 
          d="M 50 50 L 220 180 L 190 210 L 50 120 Z"
          fill="url(#goldDiagonalLight)"
          opacity="0.4"
        />
        
        {/* 황금빛 하이라이트 - 직선 */}
        <rect 
          x="44" 
          y="49" 
          width="25" 
          height="197"
          fill="url(#goldShineEffect)"
          opacity="0.8"
        />
        
        {/* 상단 테두리 장식 패턴 */}
        <g opacity="0.6">
          <rect x="60" y="46" width="10" height="5" fill="url(#goldAccent)"/>
          <rect x="195" y="46" width="10" height="5" fill="url(#goldAccent)"/>
          <rect x="330" y="46" width="10" height="5" fill="url(#goldAccent)"/>
        </g>
        
        {/* 미세 기포 - 황금빛 */}
        <g>
          <circle cx="120" cy="150" r="1.5" fill="url(#goldBubbleGradient)" opacity="0.7">
            <animate attributeName="cy" values="150;60;150" dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="250" cy="180" r="1" fill="url(#goldBubbleGradient)" opacity="0.6">
            <animate attributeName="cy" values="180;60;180" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="120" r="0.8" fill="url(#goldBubbleGradient)" opacity="0.5">
            <animate attributeName="cy" values="120;60;120" dur="8s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* 물속 광선 - 황금빛 */}
        <g opacity="0.4">
          <path d="M 100 60 L 95 250" stroke="url(#goldLightRay)" strokeWidth="1.5"/>
          <path d="M 200 60 L 195 250" stroke="url(#goldLightRay)" strokeWidth="2"/>
          <path d="M 300 60 L 295 250" stroke="url(#goldLightRay)" strokeWidth="1.5"/>
        </g>
        
        {/* 럭셔리 반짝임 효과 */}
        <g filter="url(#goldGlow)">
          <circle cx="80" cy="65" r="1.5" fill="#FFFACD" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="1.5;2;1.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="320" cy="75" r="1.5" fill="#FFFFE0" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="55" r="2" fill="#FFFEF0" opacity="1">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="2;2.5;2" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* 그라디언트 정의 */}
        <defs>
          {/* 황금 프레임 */}
          <linearGradient id="goldFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700"/>
            <stop offset="25%" stopColor="#FFC125"/>
            <stop offset="50%" stopColor="#FFB90F"/>
            <stop offset="75%" stopColor="#FFA500"/>
            <stop offset="100%" stopColor="#FF8C00"/>
          </linearGradient>
          
          {/* 럭셔리 황금 그라데이션 */}
          <linearGradient id="goldLuxuryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFEF0"/>
            <stop offset="20%" stopColor="#FFD700"/>
            <stop offset="50%" stopColor="#FFC125"/>
            <stop offset="80%" stopColor="#FFB90F"/>
            <stop offset="100%" stopColor="#FFA500"/>
          </linearGradient>
          
          {/* 보석 그라데이션 */}
          <radialGradient id="rubyGem">
            <stop offset="0%" stopColor="#FF69B4"/>
            <stop offset="50%" stopColor="#DC143C"/>
            <stop offset="100%" stopColor="#8B0000"/>
          </radialGradient>
          
          <radialGradient id="emeraldGem">
            <stop offset="0%" stopColor="#90EE90"/>
            <stop offset="50%" stopColor="#50C878"/>
            <stop offset="100%" stopColor="#006400"/>
          </radialGradient>
          
          <radialGradient id="sapphireGem">
            <stop offset="0%" stopColor="#87CEEB"/>
            <stop offset="50%" stopColor="#0F52BA"/>
            <stop offset="100%" stopColor="#002FA7"/>
          </radialGradient>
          
          {/* 대각선 조명 */}
          <linearGradient id="goldDiagonalLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFEF0" stopOpacity="0.9"/>
            <stop offset="30%" stopColor="#FFD700" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0.1"/>
          </linearGradient>
          
          {/* 황금빛 반사 */}
          <linearGradient id="goldShineEffect" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFEF0" stopOpacity="1"/>
            <stop offset="20%" stopColor="#FFFACD" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FFC125" stopOpacity="0.3"/>
          </linearGradient>
          
          {/* 황금 액센트 */}
          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFA500" stopOpacity="0.5"/>
            <stop offset="50%" stopColor="#FFFACD" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0.5"/>
          </linearGradient>
          
          {/* 럭셔리 물 */}
          <linearGradient id="luxuryWaterGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.2"/>
            <stop offset="30%" stopColor="#6495ED" stopOpacity="0.3"/>
            <stop offset="60%" stopColor="#4682B4" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#4169E1" stopOpacity="0.5"/>
          </linearGradient>
          
          {/* 수면 효과 */}
          <linearGradient id="goldWaterSurface" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.2"/>
          </linearGradient>
          
          {/* 황금 물방울 */}
          <radialGradient id="goldBubbleGradient">
            <stop offset="0%" stopColor="#FFFEF0" stopOpacity="1"/>
            <stop offset="40%" stopColor="#FFD700" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0.3"/>
          </radialGradient>
          
          {/* 황금 광선 */}
          <linearGradient id="goldLightRay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#FFFACD" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default GoldTank;