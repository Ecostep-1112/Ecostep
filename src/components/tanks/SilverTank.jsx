import React from 'react';

const SilverTank = ({ className = "", isPreview = false }) => {
  const size = isPreview ? "w-full h-full" : "w-full h-full";
  
  return (
    <div className={`relative ${size} ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 실버 어항 - 심플한 색상만 */}
        
        {/* 그라디언트 정의 */}
        <defs>
          <linearGradient id="silverWaterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        
        {/* 물 효과 */}
        <rect 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          fill="url(#silverWaterGradient)"
          opacity="1"
          rx="8"
          ry="8"
        />
      </svg>
    </div>
  );
};

export default SilverTank;