import React from 'react';

const PlatinumTank = ({ className = "", isPreview = false }) => {
  const size = isPreview ? "w-20 h-16" : "w-full h-full";
  
  return (
    <div className={`relative ${size} ${className}`}>
      <svg 
        viewBox="0 0 400 300" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 플래티넘 어항 - 프리미엄 홀로그램 효과 */}
        
        {/* 그림자 효과 */}
        <ellipse 
          cx="200" 
          cy="268" 
          rx="170" 
          ry="20" 
          fill="url(#platinumShadow)" 
          opacity="0.3"
        />
        
        {/* 메인 어항 - 다이아몬드 컷 형태 */}
        <path 
          d="M 35 60 L 365 60 L 355 250 L 45 250 Z"
          fill="none"
          stroke="url(#platinumMainGradient)"
          strokeWidth="6"
        />
        
        {/* 물 효과 - 홀로그램 */}
        <path 
          d="M 42 70 L 358 70 L 348 245 L 48 245 Z"
          fill="url(#hologramWater)"
          opacity="0.45"
        />
        
        {/* 상단 프리미엄 프레임 */}
        <rect 
          x="35" 
          y="50" 
          width="330" 
          height="15" 
          rx="3"
          fill="url(#platinumTopFrame)"
        />
        
        {/* 홀로그램 반사 효과 - 무지개빛 */}
        <path 
          d="M 38 63 L 38 247 L 75 230 L 75 75 Z"
          fill="url(#hologramReflection)"
          opacity="0.7"
        />
        
        {/* 프리즘 효과 라인들 */}
        <g opacity="0.5">
          <line x1="100" y1="60" x2="95" y2="250" stroke="url(#prismLine1)" strokeWidth="2"/>
          <line x1="200" y1="60" x2="195" y2="250" stroke="url(#prismLine2)" strokeWidth="2"/>
          <line x1="300" y1="60" x2="295" y2="250" stroke="url(#prismLine3)" strokeWidth="2"/>
        </g>
        
        {/* 다이아몬드 반짝임 */}
        <g>
          <polygon points="150,80 155,85 150,90 145,85" fill="url(#diamondSparkle)" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
          </polygon>
          <polygon points="250,70 255,75 250,80 245,75" fill="url(#diamondSparkle)" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite" />
          </polygon>
        </g>
        
        {/* 홀로그램 하이라이트 */}
        <ellipse 
          cx="130" 
          cy="90" 
          rx="70" 
          ry="35" 
          fill="url(#hologramHighlight)" 
          opacity="0.6"
        />
        
        {/* 플래티넘 장식 패턴 */}
        <g>
          <path 
            d="M 35 65 L 365 65"
            stroke="url(#platinumAccent)" 
            strokeWidth="3"
            opacity="0.5"
          />
          <circle cx="80" cy="60" r="4" fill="url(#platinumOrnament)" opacity="0.9"/>
          <circle cx="200" cy="58" r="4" fill="url(#platinumOrnament)" opacity="0.9"/>
          <circle cx="320" cy="60" r="4" fill="url(#platinumOrnament)" opacity="0.9"/>
        </g>
        
        {/* 홀로그램 물방울 */}
        <circle cx="140" cy="160" r="6" fill="url(#hologramBubble)" opacity="0.7">
          <animate attributeName="cy" values="160;75;160" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="260" cy="200" r="5" fill="url(#hologramBubble)" opacity="0.6">
          <animate attributeName="cy" values="200;75;200" dur="5s" repeatCount="indefinite" />
        </circle>
        
        {/* 프리미엄 반짝임 효과 */}
        <g>
          <circle cx="70" cy="75" r="2" fill="white" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="fill" values="white;#E0E0FF;#FFE0F0;white" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="330" cy="85" r="2" fill="white" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="fill" values="white;#FFE0E0;#E0FFE0;white" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="68" r="2.5" fill="white" opacity="1">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="fill" values="white;#F0E0FF;#E0F0FF;white" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* 그라디언트 정의 */}
        <defs>
          {/* 메인 플래티넘 그라데이션 */}
          <linearGradient id="platinumMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5E4E2"/>
            <stop offset="20%" stopColor="#BCC6CC"/>
            <stop offset="40%" stopColor="#98989A"/>
            <stop offset="60%" stopColor="#D4D4DC"/>
            <stop offset="80%" stopColor="#E5E4E2"/>
            <stop offset="100%" stopColor="#FAFAFA"/>
          </linearGradient>
          
          {/* 상단 프레임 */}
          <linearGradient id="platinumTopFrame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAFAFA"/>
            <stop offset="30%" stopColor="#E5E4E2"/>
            <stop offset="60%" stopColor="#D4D4DC"/>
            <stop offset="100%" stopColor="#BCC6CC"/>
          </linearGradient>
          
          {/* 홀로그램 반사 */}
          <linearGradient id="hologramReflection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.3"/>
            <stop offset="20%" stopColor="#00FFFF" stopOpacity="0.4"/>
            <stop offset="40%" stopColor="#FFFF00" stopOpacity="0.3"/>
            <stop offset="60%" stopColor="#00FF00" stopOpacity="0.4"/>
            <stop offset="80%" stopColor="#FF00FF" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#0000FF" stopOpacity="0.2"/>
          </linearGradient>
          
          {/* 홀로그램 물 */}
          <linearGradient id="hologramWater" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.4"/>
            <stop offset="25%" stopColor="#E0E7FF" stopOpacity="0.5"/>
            <stop offset="50%" stopColor="#F0E6FF" stopOpacity="0.4"/>
            <stop offset="75%" stopColor="#E6F7FF" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#E8F5E8" stopOpacity="0.4"/>
          </linearGradient>
          
          {/* 프리즘 라인들 */}
          <linearGradient id="prismLine1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="prismLine2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="prismLine3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFF00" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FFFF00" stopOpacity="0.1"/>
          </linearGradient>
          
          {/* 다이아몬드 반짝임 */}
          <radialGradient id="diamondSparkle">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1"/>
            <stop offset="50%" stopColor="#E0E7FF" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.3"/>
          </radialGradient>
          
          {/* 홀로그램 하이라이트 */}
          <radialGradient id="hologramHighlight">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
            <stop offset="20%" stopColor="#F0E6FF" stopOpacity="0.6"/>
            <stop offset="40%" stopColor="#E6F7FF" stopOpacity="0.4"/>
            <stop offset="60%" stopColor="#FFE6F0" stopOpacity="0.3"/>
            <stop offset="80%" stopColor="#E6FFE6" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#FFE6E6" stopOpacity="0.1"/>
          </radialGradient>
          
          {/* 플래티넘 장식 */}
          <radialGradient id="platinumOrnament">
            <stop offset="0%" stopColor="#FAFAFA"/>
            <stop offset="50%" stopColor="#E5E4E2"/>
            <stop offset="100%" stopColor="#BCC6CC"/>
          </radialGradient>
          
          {/* 액센트 라인 */}
          <linearGradient id="platinumAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BCC6CC" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#FAFAFA" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#BCC6CC" stopOpacity="0.3"/>
          </linearGradient>
          
          {/* 홀로그램 물방울 */}
          <radialGradient id="hologramBubble">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1"/>
            <stop offset="30%" stopColor="#E0E7FF" stopOpacity="0.7"/>
            <stop offset="60%" stopColor="#FFE0F0" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#E0FFE0" stopOpacity="0.2"/>
          </radialGradient>
          
          {/* 그림자 */}
          <radialGradient id="platinumShadow">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default PlatinumTank;