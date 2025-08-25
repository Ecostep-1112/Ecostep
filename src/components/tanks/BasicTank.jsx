import React from 'react';

const BasicTank = ({ className = "", isPreview = false }) => {
  const size = isPreview ? "w-full h-full" : "w-full h-full";
  
  return (
    <div className={`relative ${size} ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 기본 어항 - 심플한 색상만 */}
        
        {/* 물 효과 */}
        <rect 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          fill="url(#waterGradientBasic)"
          opacity="1"
          rx="8"
          ry="8"
        />
        
        {/* 그라디언트 정의 */}
        <defs>
          <filter id="blurFilter">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
          
          <linearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="waterGradientBasic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
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