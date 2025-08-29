import React from 'react';

// 브론즈 랭크 아이콘 - 새싹과 나뭇잎 디자인
export const BronzeIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <filter id="bronzeShadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
    </defs>
    
    {/* 외곽 원 */}
    <circle 
      cx="50" 
      cy="50" 
      r="45" 
      fill="url(#bronzeGradient)"
      filter="url(#bronzeShadow)"
    />
    
    {/* 내부 장식 링 */}
    <circle 
      cx="50" 
      cy="50" 
      r="38" 
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      opacity="0.6"
    />
    
    {/* 새싹 줄기 */}
    <rect 
      x="48" 
      y="55" 
      width="4" 
      height="20"
      fill="#ffffff"
      rx="2"
    />
    
    {/* 왼쪽 잎 */}
    <ellipse 
      cx="40" 
      cy="45" 
      rx="12" 
      ry="8"
      fill="#ffffff"
      transform="rotate(-30 40 45)"
    />
    
    {/* 오른쪽 잎 */}
    <ellipse 
      cx="60" 
      cy="45" 
      rx="12" 
      ry="8"
      fill="#ffffff"
      transform="rotate(30 60 45)"
    />
    
    {/* 중앙 새싹 */}
    <ellipse 
      cx="50" 
      cy="35" 
      rx="8" 
      ry="12"
      fill="#ffffff"
    />
    
    {/* 하이라이트 */}
    <ellipse 
      cx="48" 
      cy="35" 
      rx="3" 
      ry="5"
      fill="white"
      opacity="0.6"
    />
  </svg>
);

// 실버 랭크 아이콘 - 별과 달 디자인
export const SilverIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#14b8a6" />
      </linearGradient>
      <filter id="silverShadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
    </defs>
    
    {/* 외곽 원 */}
    <circle 
      cx="50" 
      cy="50" 
      r="45" 
      fill="url(#silverGradient)"
      filter="url(#silverShadow)"
    />
    
    {/* 내부 장식 링 */}
    <circle 
      cx="50" 
      cy="50" 
      r="38" 
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      opacity="0.7"
    />
    
    {/* 초승달 */}
    <path 
      d="M 40 30 C 30 30, 25 40, 25 50 C 25 60, 30 70, 40 70 C 35 65, 32 58, 32 50 C 32 42, 35 35, 40 30"
      fill="#e0f2fe"
    />
    
    {/* 초승달 하이라이트 */}
    <ellipse 
      cx="35" 
      cy="45" 
      rx="3" 
      ry="8"
      fill="white"
      opacity="0.4"
    />
    
    {/* 큰 별 */}
    <path 
      d="M 60 40 L 63 47 L 70 47 L 64 52 L 67 59 L 60 54 L 53 59 L 56 52 L 50 47 L 57 47 Z"
      fill="#bae6fd"
    />
    
    {/* 작은 별들 */}
    <path 
      d="M 70 30 L 71 33 L 74 33 L 71.5 35 L 72.5 38 L 70 36 L 67.5 38 L 68.5 35 L 66 33 L 69 33 Z"
      fill="#e0f2fe"
      opacity="0.8"
    />
    
    <path 
      d="M 55 65 L 56 67 L 58 67 L 56.5 68.5 L 57 70.5 L 55 69 L 53 70.5 L 53.5 68.5 L 52 67 L 54 67 Z"
      fill="#e0f2fe"
      opacity="0.7"
    />
    
    <path 
      d="M 75 55 L 76 57 L 78 57 L 76.5 58.5 L 77 60.5 L 75 59 L 73 60.5 L 73.5 58.5 L 72 57 L 74 57 Z"
      fill="#e0f2fe"
      opacity="0.6"
    />
  </svg>
);

// 골드 랭크 아이콘 - 태양과 빛 디자인
export const GoldIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
      <filter id="goldShadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
    </defs>
    
    {/* 외곽 원 */}
    <circle 
      cx="50" 
      cy="50" 
      r="45" 
      fill="url(#goldGradient)"
      filter="url(#goldShadow)"
    />
    
    {/* 내부 장식 링 */}
    <circle 
      cx="50" 
      cy="50" 
      r="38" 
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      opacity="0.8"
    />
    
    {/* 태양 중심 */}
    <circle 
      cx="50" 
      cy="50" 
      r="15" 
      fill="#fef3c7"
    />
    
    {/* 태양 광선들 - 8방향 */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <rect
        key={i}
        x="48"
        y="25"
        width="4"
        height="12"
        fill="#fef3c7"
        rx="2"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    
    {/* 태양 중심 하이라이트 */}
    <circle 
      cx="47" 
      cy="47" 
      r="6" 
      fill="white"
      opacity="0.4"
    />
    
    {/* 작은 빛 입자들 */}
    <circle cx="25" cy="30" r="1.5" fill="#fef3c7" opacity="0.6" />
    <circle cx="75" cy="30" r="1.5" fill="#fef3c7" opacity="0.6" />
    <circle cx="25" cy="70" r="1.5" fill="#fef3c7" opacity="0.6" />
    <circle cx="75" cy="70" r="1.5" fill="#fef3c7" opacity="0.6" />
  </svg>
);

// 플래티넘 랭크 아이콘 - 다이아몬드 모양의 프리미엄 디자인
export const PlatinumIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="platinumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <filter id="platinumShadow">
        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.4"/>
      </filter>
      <filter id="platinumGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* 외곽 원 */}
    <circle 
      cx="50" 
      cy="50" 
      r="45" 
      fill="url(#platinumGradient)"
      filter="url(#platinumShadow)"
    />
    
    {/* 내부 장식 링 - 이중 */}
    <circle 
      cx="50" 
      cy="50" 
      r="40" 
      fill="none"
      stroke="#ffffff"
      strokeWidth="1"
      opacity="0.8"
    />
    <circle 
      cx="50" 
      cy="50" 
      r="36" 
      fill="none"
      stroke="#ffffff"
      strokeWidth="1"
      opacity="0.6"
    />
    
    {/* 다이아몬드 */}
    <g filter="url(#platinumGlow)">
      {/* 다이아몬드 상단 */}
      <path 
        d="M50 25 L35 40 L65 40 Z"
        fill="#f3e8ff"
        stroke="#e9d5ff"
        strokeWidth="1"
      />
      
      {/* 다이아몬드 하단 */}
      <path 
        d="M35 40 L50 70 L65 40 Z"
        fill="#ede9fe"
        stroke="#e9d5ff"
        strokeWidth="1"
      />
      
      {/* 다이아몬드 면 분할선 */}
      <line x1="50" y1="25" x2="35" y2="40" stroke="#c084fc" strokeWidth="0.5" opacity="0.5" />
      <line x1="50" y1="25" x2="65" y2="40" stroke="#c084fc" strokeWidth="0.5" opacity="0.5" />
      <line x1="50" y1="25" x2="50" y2="40" stroke="#c084fc" strokeWidth="0.5" opacity="0.5" />
      <line x1="35" y1="40" x2="50" y2="70" stroke="#c084fc" strokeWidth="0.5" opacity="0.5" />
      <line x1="65" y1="40" x2="50" y2="70" stroke="#c084fc" strokeWidth="0.5" opacity="0.5" />
      
      {/* 빛 반사 효과 */}
      <ellipse 
        cx="48" 
        cy="35" 
        rx="8" 
        ry="4"
        fill="white"
        opacity="0.4"
      />
    </g>
    
    {/* 별 장식 */}
    <g opacity="0.7">
      <circle cx="25" cy="25" r="1.5" fill="#fef3c7" />
      <circle cx="75" cy="25" r="1.5" fill="#fef3c7" />
      <circle cx="25" cy="75" r="1.5" fill="#fef3c7" />
      <circle cx="75" cy="75" r="1.5" fill="#fef3c7" />
    </g>
  </svg>
);

const RankIcons = {
  bronze: BronzeIcon,
  silver: SilverIcon,
  gold: GoldIcon,
  platinum: PlatinumIcon
};

export default RankIcons;