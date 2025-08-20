import React from 'react';

const BasicTank = ({ className = "", isPreview = false }) => {
  const size = isPreview ? "w-20 h-16" : "w-full h-full";
  
  return (
    <div className={`relative ${size} ${className}`}>
      <svg 
        viewBox="45 45 310 210" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* 기본 어항 - 투명한 유리 어항 */}
        
        {/* 물 효과 */}
        <rect 
          x="51" 
          y="70" 
          width="298" 
          height="179" 
          fill="url(#waterGradientBasic)"
          opacity="0.6"
          rx="14"
          ry="14"
        />
        
        {/* 메인 어항 유리 - 직사각형 */}
        <rect 
          x="50" 
          y="50" 
          width="300" 
          height="200" 
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          rx="15"
          ry="15"
        />
        
        {/* 유리 반사 효과 - 왼쪽 */}
        <path 
          d="M 55 65 L 55 235 L 62 228 L 62 72 Z"
          fill="url(#glassShineBasic)"
          opacity="0.3"
        />
        
        {/* 유리 반사 효과 - 상단 */}
        <ellipse 
          cx="120" 
          cy="75" 
          rx="35" 
          ry="15" 
          fill="white" 
          opacity="0.15"
          filter="url(#blurFilter)"
        />
        
        {/* 내부 광택 효과 */}
        <rect 
          x="51" 
          y="51" 
          width="298" 
          height="198" 
          fill="none"
          stroke="url(#innerGlow)"
          strokeWidth="0.5"
          rx="14"
          ry="14"
          opacity="0.5"
        />
        
        {/* 물방울 효과 */}
        <circle cx="100" cy="120" r="3" fill="white" opacity="0.4">
          <animate attributeName="cy" values="120;60;120" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.2;0.4" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="150" r="2" fill="white" opacity="0.3">
          <animate attributeName="cy" values="150;60;150" dur="5s" repeatCount="indefinite" />
        </circle>
        
        {/* 그라디언트 정의 */}
        <defs>
          <filter id="blurFilter">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
          
          <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="waterGradientBasic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#20B2AA" stopOpacity="0.7"/>
          </linearGradient>
          
          <linearGradient id="glassGradientBasic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8F4F8"/>
            <stop offset="50%" stopColor="#D1E7F0"/>
            <stop offset="100%" stopColor="#B8D8E8"/>
          </linearGradient>
          
          <linearGradient id="glassShineBasic" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BasicTank;