import React from 'react';

function EarthStructure({ size = 200 }) {
  const earthRadius = size / 2;
  const innerCoreRadius = earthRadius * 0.203;
  const outerCoreRadius = earthRadius * 0.531;
  const mantleRadius = earthRadius * 0.995;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 오른쪽 상단 1/4만 표시하기 위한 클립 */}
      <defs>
        <clipPath id="quarterClip">
          <rect x={earthRadius} y="0" width={earthRadius} height={earthRadius} />
        </clipPath>
      </defs>
      
      {/* 전체 외곽 원 */}
      <circle 
        cx={earthRadius} 
        cy={earthRadius} 
        r={earthRadius - 1} 
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />
      
      <g clipPath="url(#quarterClip)">
        {/* 외핵 경계 - 오른쪽 상단 1/4만 */}
        <circle 
          cx={earthRadius} 
          cy={earthRadius} 
          r={outerCoreRadius} 
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.6"
        />
        
        {/* 내핵 경계 - 오른쪽 상단 1/4만 */}
        <circle 
          cx={earthRadius} 
          cy={earthRadius} 
          r={innerCoreRadius} 
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </g>
      
      {/* 중앙 세로선 - 위쪽만 */}
      <line 
        x1={earthRadius} 
        y1="1" 
        x2={earthRadius} 
        y2={earthRadius} 
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />
      
      {/* 중앙 가로선 - 오른쪽만 */}
      <line 
        x1={earthRadius} 
        y1={earthRadius} 
        x2={size - 1} 
        y2={earthRadius} 
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />
      
    </svg>
  );
}

export default EarthStructure;