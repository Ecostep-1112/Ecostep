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
          x="50" 
          y="70" 
          width="300" 
          height="180" 
          fill="url(#waterGradientBasic)"
          opacity="0.3"
        />
        
        {/* 메인 어항 유리 - 직사각형 */}
        <rect 
          x="50" 
          y="50" 
          width="300" 
          height="200" 
          fill="none"
          stroke="url(#glassGradientBasic)"
          strokeWidth="3"
        />
        
        {/* 유리 반사 효과 - 왼쪽 */}
        <path 
          d="M 53 53 L 53 247 L 65 235 L 65 65 Z"
          fill="url(#glassShineBasic)"
          opacity="0.5"
        />
        
        {/* 유리 반사 효과 - 상단 */}
        <ellipse 
          cx="120" 
          cy="80" 
          rx="40" 
          ry="20" 
          fill="white" 
          opacity="0.2"
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
          <linearGradient id="waterGradientBasic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.2"/>
            <stop offset="50%" stopColor="#5F9FD8" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#4682B4" stopOpacity="0.4"/>
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