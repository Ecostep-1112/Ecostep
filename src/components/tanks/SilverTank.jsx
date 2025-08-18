import React from 'react';

const SilverTank = ({ className = "", isPreview = false }) => {
  const size = isPreview ? "w-20 h-16" : "w-full h-full";
  
  return (
    <div className={`relative ${size} ${className}`}>
      <svg 
        viewBox="0 0 400 300" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 실버 어항 - 심플한 크롬 테두리 + 은은한 반사 */}
        
        {/* 대각선 조명 효과 */}
        <defs>
          <filter id="silverBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
          </filter>
          <filter id="silverGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 그림자 효과 */}
        <ellipse 
          cx="200" 
          cy="265" 
          rx="155" 
          ry="12" 
          fill="#000000" 
          opacity="0.15"
        />
        
        {/* 물 효과 - 깊이감 있는 그라데이션 */}
        <rect 
          x="45" 
          y="65" 
          width="310" 
          height="185" 
          rx="6"
          fill="url(#waterGradientSilverDeep)"
          opacity="0.6"
        />
        
        {/* 수면 파동 효과 */}
        <ellipse 
          cx="200" 
          cy="68" 
          rx="150" 
          ry="3" 
          fill="url(#waterSurface)"
          opacity="0.4"
          className="animate-wave"
        />
        
        {/* 메인 어항 - 크롬 프레임 */}
        <rect 
          x="45" 
          y="45" 
          width="310" 
          height="205" 
          rx="6"
          fill="none"
          stroke="url(#chromeGradient)"
          strokeWidth="3"
        />
        
        {/* 대각선 조명 - 좌상단에서 우하단 */}
        <path 
          d="M 45 45 L 200 150 L 180 170 L 45 100 Z"
          fill="url(#diagonalLight)"
          opacity="0.3"
          filter="url(#silverBlur)"
        />
        
        {/* 크롬 하이라이트 */}
        <path 
          d="M 48 48 L 48 247 L 58 237 L 58 58 Z"
          fill="url(#chromeShine)"
          opacity="0.7"
        />
        
        {/* 상단 크롬 림 */}
        <rect 
          x="45" 
          y="45" 
          width="310" 
          height="5" 
          rx="2"
          fill="url(#chromeTopRim)"
        />
        
        {/* 미세 기포 애니메이션 */}
        <g>
          <circle cx="100" cy="180" r="1" fill="white" opacity="0.6">
            <animate attributeName="cy" values="180;60;180" dur="8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="200" r="0.8" fill="white" opacity="0.5">
            <animate attributeName="cy" values="200;60;200" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="160" r="1.2" fill="white" opacity="0.7">
            <animate attributeName="cy" values="160;60;160" dur="7s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="140" r="0.6" fill="white" opacity="0.4">
            <animate attributeName="cy" values="140;60;140" dur="9s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* 물속 광선 효과 */}
        <g opacity="0.3">
          <path 
            d="M 80 60 L 75 250"
            stroke="url(#lightRay)"
            strokeWidth="1"
            opacity="0.5"
          />
          <path 
            d="M 200 60 L 195 250"
            stroke="url(#lightRay)"
            strokeWidth="1.5"
            opacity="0.4"
          />
          <path 
            d="M 320 60 L 315 250"
            stroke="url(#lightRay)"
            strokeWidth="1"
            opacity="0.3"
          />
        </g>
        
        {/* 수면 반사광 */}
        <ellipse 
          cx="120" 
          cy="75" 
          rx="35" 
          ry="15" 
          fill="white" 
          opacity="0.25"
          filter="url(#silverBlur)"
        />
        
        {/* 은은한 반짝임 */}
        <g filter="url(#silverGlow)">
          <circle cx="85" cy="55" r="1" fill="white" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="315" cy="60" r="1" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* 그라디언트 정의 */}
        <defs>
          {/* 크롬 그라데이션 */}
          <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0F0F0"/>
            <stop offset="25%" stopColor="#D8D8D8"/>
            <stop offset="50%" stopColor="#C0C0C0"/>
            <stop offset="75%" stopColor="#B0B0B0"/>
            <stop offset="100%" stopColor="#A0A0A0"/>
          </linearGradient>
          
          {/* 상단 림 */}
          <linearGradient id="chromeTopRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="50%" stopColor="#E8E8E8"/>
            <stop offset="100%" stopColor="#C0C0C0"/>
          </linearGradient>
          
          {/* 크롬 빛 반사 */}
          <linearGradient id="chromeShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
            <stop offset="30%" stopColor="#F5F5F5" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0.2"/>
          </linearGradient>
          
          {/* 대각선 조명 */}
          <linearGradient id="diagonalLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#F0F0F0" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0.1"/>
          </linearGradient>
          
          {/* 깊이감 있는 물 */}
          <linearGradient id="waterGradientSilverDeep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B0E0E6" stopOpacity="0.2"/>
            <stop offset="30%" stopColor="#87CEEB" stopOpacity="0.3"/>
            <stop offset="60%" stopColor="#6495ED" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#4682B4" stopOpacity="0.6"/>
          </linearGradient>
          
          {/* 수면 효과 */}
          <linearGradient id="waterSurface" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#E0F7FA" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2"/>
          </linearGradient>
          
          {/* 광선 효과 */}
          <linearGradient id="lightRay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SilverTank;