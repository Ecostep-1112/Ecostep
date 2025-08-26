import React from 'react';

const WaterSurface = () => {
  return (
    <>
      {/* 물 표면 경계선 - 자연스러운 물결 효과 */}
      <div 
        className="absolute left-0 right-0 z-[6] pointer-events-none"
        style={{
          top: '0px', // 어항 컨테이너 최상단 (헤더는 어항 밖에 있음)
          height: '4px'
        }}
      >
        <svg 
          className="w-full h-full"
          viewBox="0 0 400 4"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="50%" stopColor="rgba(147,197,253,0.7)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0.5)" />
            </linearGradient>
          </defs>
          
          {/* 주 물결선 */}
          <path
            className="water-wave-line"
            d="M0,2 Q50,1 100,2 T200,2 T300,2 T400,2"
            stroke="url(#waveGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="1"
          />
          
          {/* 보조 물결선 - 더 부드럽게 */}
          <path
            className="water-wave-line-secondary"
            d="M0,2 Q25,2.5 50,2 T100,2 T150,2 T200,2 T250,2 T300,2 T350,2 T400,2"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.8"
            fill="none"
            opacity="0.8"
          />
          
          {/* 물 표면 아래 채움 효과 */}
          <path
            d="M0,2 Q50,1 100,2 T200,2 T300,2 T400,2 L400,4 L0,4 Z"
            fill="rgba(147,197,253,0.15)"
            opacity="0.6"
            className="water-surface-fill"
          />
        </svg>
      </div>
      
      {/* 물 표면 물결 효과 - 더 강하게 */}
      <div 
        className="absolute left-0 right-0 z-[5] pointer-events-none"
        style={{
          top: '2px', // 물 표면 바로 아래
          height: '20px',
          background: `
            linear-gradient(
              180deg,
              rgba(255,255,255,0.15) 0%,
              rgba(147,197,253,0.2) 30%,
              rgba(96,165,250,0.15) 60%,
              transparent 100%
            )
          `,
          animation: 'waterSurfaceWave 2s ease-in-out infinite'
        }}
      />

      {/* 물 흐름 효과 - 전체 영역 */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          top: '4px' // 물 표면 바로 아래부터 시작
        }}
      >
        {/* 물결 패턴 1 */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 50px,
                rgba(255,255,255,0.03) 50px,
                rgba(255,255,255,0.03) 51px
              )
            `,
            animation: 'waterFlow 8s linear infinite',
            transform: 'translateY(0)'
          }}
        />
        
        {/* 물결 패턴 2 - 교차 */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 80px,
                rgba(147,197,253,0.04) 80px,
                rgba(147,197,253,0.04) 81px
              )
            `,
            animation: 'waterFlow 12s linear infinite reverse',
            animationDelay: '2s'
          }}
        />

        {/* 깊이감 그라데이션 */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(96,165,250,0.1) 0%,
                rgba(59,130,246,0.15) 30%,
                rgba(37,99,235,0.2) 60%,
                rgba(30,64,175,0.25) 100%
              )
            `,
            animation: 'waterDepthPulse 5s ease-in-out infinite'
          }}
        />

        {/* 물 속 빛 반사 효과 */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at 30% 20%,
                rgba(255,255,255,0.1) 0%,
                transparent 40%
              ),
              radial-gradient(
                ellipse at 70% 40%,
                rgba(255,255,255,0.08) 0%,
                transparent 35%
              ),
              radial-gradient(
                ellipse at 50% 60%,
                rgba(147,197,253,0.1) 0%,
                transparent 45%
              )
            `,
            animation: 'lightReflection 6s ease-in-out infinite'
          }}
        />
      </div>

      {/* 수질바 위 경계 효과 */}
      <div 
        className="absolute left-0 right-0 z-[3] pointer-events-none"
        style={{
          bottom: '50px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(30,64,175,0.3), transparent)',
          animation: 'waterLineShimmer 4s ease-in-out infinite reverse'
        }}
      />
    </>
  );
};

export default WaterSurface;