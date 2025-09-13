import React from 'react';

function EarthStructure({ size = 200, angle = 90 }) {
  const earthRadius = size / 2;
  const innerCoreRadius = earthRadius * 0.203;
  const outerCoreRadius = earthRadius * 0.531;
  const mantleRadius = earthRadius * 0.995;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 오른쪽 상단 부채꼴 표시하기 위한 클립 */}
      <defs>
        <clipPath id="quarterClip">
          <path d={`
            M ${earthRadius} ${earthRadius}
            L ${earthRadius} ${earthRadius - (earthRadius - 1)}
            A ${earthRadius - 1} ${earthRadius - 1} 0 0 1 ${earthRadius + (earthRadius - 1) * Math.sin(angle * Math.PI / 180)} ${earthRadius - (earthRadius - 1) * Math.cos(angle * Math.PI / 180)}
            Z
          `} />
        </clipPath>
        {/* 그림자 필터 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        {/* 중앙 점용 강한 그림자 필터 */}
        <filter id="centerGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        {/* 원형 그라데이션 */}
        <radialGradient id="centerGradient">
          <stop offset="0%" stopColor="white" stopOpacity="1"/>
          <stop offset="100%" stopColor="white" stopOpacity="0.8"/>
        </radialGradient>
      </defs>
      
      {/* 전체 외곽 원 */}
      <circle 
        cx={earthRadius} 
        cy={earthRadius} 
        r={earthRadius - 1} 
        fill="none"
        stroke="white"
        strokeWidth="0.8"
        opacity="0.9"
        filter="url(#glow)"
      />
      
      <g clipPath="url(#quarterClip)">
        {/* 외핵 경계 - 오른쪽 상단 1/4만 */}
        <circle 
          cx={earthRadius} 
          cy={earthRadius} 
          r={outerCoreRadius} 
          fill="none"
          stroke="white"
          strokeWidth="0.7"
          opacity="0.85"
        />
        
        {/* 내핵 경계 - 오른쪽 상단 1/4만 */}
        <circle 
          cx={earthRadius} 
          cy={earthRadius} 
          r={innerCoreRadius} 
          fill="none"
          stroke="white"
          strokeWidth="0.7"
          opacity="0.85"
        />
      </g>
      
      {/* 중앙 세로선 - 위쪽만 */}
      <line 
        x1={earthRadius} 
        y1={earthRadius - (earthRadius - 1)} 
        x2={earthRadius} 
        y2={earthRadius} 
        stroke="white"
        strokeWidth="0.7"
        opacity="0.85"
      />
      
      {/* 각도 선 - 108도 */}
      <line 
        x1={earthRadius} 
        y1={earthRadius} 
        x2={earthRadius + (earthRadius - 1) * Math.sin(angle * Math.PI / 180)} 
        y2={earthRadius - (earthRadius - 1) * Math.cos(angle * Math.PI / 180)} 
        stroke="white"
        strokeWidth="0.7"
        opacity="0.85"
      />
      
      {/* 중앙 점 */}
      <circle 
        cx={earthRadius} 
        cy={earthRadius} 
        r="1.5" 
        fill="white"
        opacity="1"
      />
      
    </svg>
  );
}

export default EarthStructure;