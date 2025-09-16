import React, { useState, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import FishIcons from '../../components/FishIcons';
import DecorationIcons from '../../components/DecorationIcons';
import WaterSurface from '../../components/WaterSurface';
import BubbleSystem from '../../components/BubbleSystem';

const Home = ({
  isDarkMode,
  setShowAquariumSettings,
  purchasedFish,
  currentTank = 'basic',
  tankName = '수질',
  purchasedDecorations = [],
  decorationsData = {},
  selectedDecorations = [],
  waterQuality = 85,
  daysWithoutChallenge = 0,
  setWaterQuality,
  isRandomFish = false,
  isRandomDecorations = false,
  selectedFish = [],
  fishCount = 0,
  consecutiveDays = 0,
  totalPlasticSaved = 0,
  testPlasticSaved = 0,
  setTestPlasticSaved,
  isActive = true
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const [fishPositions, setFishPositions] = useState([]);
  const [displayFish, setDisplayFish] = useState([]);
  const [displayDecorations, setDisplayDecorations] = useState([]);
  
  // totalPlasticSaved는 g 단위로 저장되어 있음
  // kg으로 변환: 1000g = 1kg
  const plasticSavedInGrams = testPlasticSaved > 0 ? testPlasticSaved : totalPlasticSaved;
  const plasticSavedInKg = (plasticSavedInGrams / 1000).toFixed(2); // g을 kg으로 변환
  
  // 표시용 값: 1kg 미만이면 g으로, 1kg 이상이면 kg으로 표시
  const plasticSavedDisplay = plasticSavedInGrams < 1000 
    ? `${Math.round(plasticSavedInGrams)}g`
    : `${plasticSavedInKg}kg`;
  
  // 플라스틱 1kg = 약 6kg CO2 배출
  // 나무 1그루는 연간 약 12kg CO2 흡수
  // 따라서 플라스틱 2kg 절약 = 12kg CO2 감소 = 나무 1그루의 연간 효과
  const co2Reduced = parseFloat(plasticSavedInKg) * 6; // 플라스틱으로 인한 CO2 감소량 (kg 기준)
  const treesEquivalent = Math.round(co2Reduced / 12); // 나무 그루 수
  
  // 랜덤 선택 로직
  useEffect(() => {
    if (isRandomFish && purchasedFish.length > 0) {
      // 랜덤으로 물고기 선택 - fishCount가 0이면 빈 배열
      if (fishCount === 0) {
        setDisplayFish([]);
      } else {
        const shuffled = [...purchasedFish].sort(() => Math.random() - 0.5);
        const count = Math.min(fishCount, purchasedFish.length);
        setDisplayFish(shuffled.slice(0, count));
      }
    } else if (selectedFish.length > 0) {
      // 선택된 물고기 표시
      setDisplayFish(selectedFish.map(index => purchasedFish[index]).filter(Boolean));
    } else {
      // 선택된 물고기가 없으면 빈 배열
      setDisplayFish([]);
    }
  }, [isRandomFish, purchasedFish, selectedFish, fishCount, isActive]); // isActive 추가로 홈 탭 클릭 시 리렌더링
  
  // 랜덤 장식품 선택 로직
  useEffect(() => {
    const availableDecorations = Object.values(decorationsData).flat()
      .filter(deco => purchasedDecorations.includes(deco.name))
      .map(deco => deco.name);

    if (isRandomDecorations && availableDecorations.length > 0) {
      // 랜덤으로 장식품 선택
      const shuffled = [...availableDecorations].sort(() => Math.random() - 0.5);
      const count = Math.min(selectedDecorations.length || 3, availableDecorations.length);
      setDisplayDecorations(shuffled.slice(0, count));
    } else {
      // 선택된 장식품 표시
      setDisplayDecorations(selectedDecorations);
    }
  }, [isRandomDecorations, selectedDecorations, purchasedDecorations, decorationsData, isActive]); // isActive 추가로 홈 탭 클릭 시 리렌더링
  
  // 물고기 위치 초기화 및 애니메이션
  useEffect(() => {
    // 구역 정의 (3x3 그리드)
    const yZones = [
      { min: 7, max: 25 },   // 상층
      { min: 30, max: 60 },  // 중층
      { min: 65, max: 75 }   // 하층
    ];

    const xZones = [
      { min: 10, max: 35 },  // 좌측
      { min: 38, max: 62 },  // 중앙
      { min: 65, max: 90 }   // 우측
    ];

    // 물고기별 Y축 선호도 정의
    const getPreferredYZone = (fishName) => {
      const rand = Math.random();

      if (fishName === '코리도라스') {
        // 코리도라스: 하층 선호 (60% 하층, 35% 중층, 5% 상층)
        if (rand < 0.6) return 2;  // 하층
        else if (rand < 0.95) return 1;  // 중층
        else return 0;  // 상층
      } else if (fishName === '네온테트라' || fishName === '구피') {
        // 중층 선호로 변경 (15% 상층, 70% 중층, 15% 하층)
        if (rand < 0.15) return 0;  // 상층
        else if (rand < 0.85) return 1;  // 중층
        else return 2;  // 하층
      } else if (fishName === '베타' || fishName === '디스커스' || fishName === '만다린피쉬') {
        // 중층 선호 강화 (10% 상층, 80% 중층, 10% 하층)
        if (rand < 0.1) return 0;  // 상층
        else if (rand < 0.9) return 1;  // 중층
        else return 2;  // 하층
      } else {
        // 나머지: 중층 중심 (15% 상층, 70% 중층, 15% 하층)
        if (rand < 0.15) return 0;  // 상층
        else if (rand < 0.85) return 1;  // 중층
        else return 2;  // 하층
      }
    };

    // 두 위치 간의 거리 계산 함수
    const getDistance = (pos1, pos2) => {
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // 위치가 다른 물고기들과 충돌하는지 확인
    const isPositionValid = (x, y, existingPositions, minDistance = 15) => {
      for (const pos of existingPositions) {
        if (getDistance({ x, y }, pos) < minDistance) {
          return false;
        }
      }
      return true;
    };

    // 이미 사용된 구역 추적
    const usedZones = new Set();
    const finalPositions = [];

    const initialPositions = displayFish.map((fishName, i) => {
      // Y축 구역 선택
      const yZoneIndex = getPreferredYZone(fishName);
      const yZone = yZones[yZoneIndex];

      // X축 구역을 랜덤하게 선택하되, 같은 구역에 3마리 이상 배치 방지
      let xZoneIndex;
      let attempts = 0;
      do {
        xZoneIndex = Math.floor(Math.random() * 3);
        attempts++;
      } while (usedZones.has(`${xZoneIndex}-${yZoneIndex}`) && attempts < 10);

      // 선택된 구역 내에서 랜덤 위치 (충돌 방지)
      const xZone = xZones[xZoneIndex];
      let x, y;
      let positionAttempts = 0;
      const maxPositionAttempts = 50;

      do {
        x = xZone.min + Math.random() * (xZone.max - xZone.min);
        y = yZone.min + Math.random() * (yZone.max - yZone.min);
        positionAttempts++;

        // 너무 많은 시도 시 최소 거리를 줄여가며 재시도
        const adjustedMinDistance = positionAttempts > 30 ? 10 : 15;

        if (isPositionValid(x, y, finalPositions, adjustedMinDistance)) {
          break;
        }
      } while (positionAttempts < maxPositionAttempts);

      // 사용된 구역 기록
      const zoneKey = `${xZoneIndex}-${yZoneIndex}`;
      usedZones.add(zoneKey);

      const position = {
        name: fishName,
        x: x,
        y: y,
        direction: Math.random() > 0.5 ? 1 : -1,  // 랜덤 방향
        speed: fishName === '아피스토그라마' ? 0.5 : (fishName === '네온테트라' || fishName === '킬리피쉬') ? 0.4 : (fishName === '체리바브' || fishName === '람시클리드' || fishName === '만다린피쉬') ? 0.35 : fishName === '디스커스' ? 0.2 : (fishName === '코리도라스' || fishName === '구피' || fishName === '엔젤피쉬' || fishName === '베타' || fishName === '아로와나') ? 0.3 : 0  // 물고기 움직임 속도
      };

      finalPositions.push(position);
      return position;
    });

    setFishPositions(initialPositions);

    // 물고기 애니메이션
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setFishPositions(prevPositions => {
          return prevPositions.map(fish => {
            if (fish.name === '코리도라스' || fish.name === '체리바브' || fish.name === '네온테트라' || fish.name === '아피스토그라마' || fish.name === '람시클리드' || fish.name === '구피' || fish.name === '엔젤피쉬' || fish.name === '킬리피쉬' || fish.name === '베타' || fish.name === '디스커스' || fish.name === '만다린피쉬' || fish.name === '아로와나') {
              let newX = fish.x + (fish.speed * fish.direction);
              let newDirection = fish.direction;

              // 아로와나는 더 큰 여유 공간 필요 (width가 size * 1.8이므로 더 넓음)
              const marginLeft = fish.name === '아로와나' ? 8 : 4;
              const marginRight = fish.name === '아로와나' ? 92 : 96;

              // 벽에 닿으면 방향 전환 (물고기 크기를 고려한 여유 공간)
              if (newX <= marginLeft || newX >= marginRight) {
                newDirection = -newDirection;
                newX = newX <= marginLeft ? marginLeft : marginRight;
              }

              return {
                ...fish,
                x: newX,
                direction: newDirection
              };
            }
            return fish;
          });
        });
      }, 50);  // 50ms마다 업데이트
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [displayFish, isActive]);

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 어항 섹션 - 정사각형, 파란 박스가 직접 어항 역할 */}
        <div className={`relative ${
          currentTank === 'basic' ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600' :
          currentTank === 'silver' ? 'bg-gradient-to-br from-slate-300 via-cyan-400 to-teal-500' :
          currentTank === 'gold' ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400' :
          'bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500'
        }`} style={{ aspectRatio: '1/1' }}>
          {/* 상단 그라데이션 구분선 */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          
          {/* 수질에 따른 흰색 블러 오버레이 - 수질바 제외 */}
          <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
            <div 
              className="absolute inset-0 transition-all duration-1000"
              style={{ 
                backgroundColor: `rgba(255, 255, 255, ${(100 - waterQuality) * 0.002})`,
                backdropFilter: waterQuality < 100 ? `blur(${(100 - waterQuality) * 0.02}px)` : 'none',
                WebkitBackdropFilter: waterQuality < 100 ? `blur(${(100 - waterQuality) * 0.02}px)` : 'none',
                maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 60px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 60px), transparent 100%)'
              }}
            />
          </div>
          
          {/* 물 표면 효과 컴포넌트 */}
          <WaterSurface />
          
          {/* 기포 시스템 */}
          <BubbleSystem fishPositions={fishPositions} />
            
          {/* 물고기 표시 (애니메이션) */}
          <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
            {displayFish.length > 0 && fishPositions.map((fish, i) => {
              const FishIcon = FishIcons[fish.name.replace(' ', '')];
              const isMoving = fish.speed > 0;
              // 물고기가 어항 경계를 벗어나지 않도록 추가 제한
              const clampedX = Math.max(4, Math.min(96, fish.x));
              const clampedY = Math.max(5, Math.min(95, fish.y));
              return FishIcon ? (
                <div
                  key={i}
                  className="absolute transition-all duration-50 ease-linear"
                  style={{
                    left: `${clampedX}%`,
                    top: `${clampedY}%`,
                    transform: `translateX(-50%) translateY(-50%) scaleX(${-fish.direction})`,
                  }}
                >
                  <FishIcon size={35} isMoving={isMoving} />
                </div>
              ) : null;
            })}
          </div>
          
          {/* 사용자가 선택한 장식품 표시 - 어항 안쪽 */}
            {displayDecorations.length > 0 && displayDecorations.map((decoName, i) => {
              const positions = [
                { bottom: '18%', left: '20%' },
                { bottom: '18%', right: '20%' },
                { bottom: '18%', left: '50%', transform: 'translateX(-50%)' },
                { bottom: '18%', left: '35%' },
                { bottom: '18%', right: '35%' },
                { bottom: '25%', left: '25%' },
                { bottom: '25%', right: '25%' },
                { bottom: '25%', left: '50%', transform: 'translateX(-50%)' },
                { bottom: '32%', left: '30%' },
                { bottom: '32%', right: '30%' },
                { bottom: '32%', left: '50%', transform: 'translateX(-50%)' },
                { bottom: '39%', left: '35%' },
                { bottom: '39%', right: '35%' }
              ];
              const position = positions[i] || { bottom: `${18 + (i % 3) * 7}%`, left: `${20 + (i % 3) * 30}%` };
              const DecoIcon = DecorationIcons[decoName];
              
              return DecoIcon ? (
                <div 
                  key={i}
                  className="absolute z-[2] animate-sway"
                  style={{
                    ...position,
                    animationDuration: `${3 + i * 0.5}s`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  <DecoIcon size={25} />
                </div>
              ) : null;
            })}
          {/* 수질바 - 하단에 위치, 개선된 디자인 */}
          <div className="absolute bottom-0 left-0 right-0 z-[20]">
            {/* 구분선 */}
            <div className="h-[1px] bg-white/20"></div>
            
            {/* 수질바 컨테이너 */}
            <div className="bg-white/10 backdrop-blur-sm p-2 border-t border-white/30">
              <div className="flex items-stretch gap-2">
                {/* 수질 정보 영역 */}
                <div className="flex-1 px-3 py-1.5 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs">
                      {tankName}
                    </span>
                    <span className="text-xs font-medium text-white">{waterQuality}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${
                      waterQuality >= 80 ? 'bg-white' : 
                      waterQuality >= 50 ? 'bg-yellow-400' : 
                      'bg-red-400'
                    }`} style={{ width: `${waterQuality}%` }}></div>
                  </div>
                </div>
                
                {/* 구분선 */}
                <div className="w-[1px] bg-white/20 self-stretch"></div>
                
                {/* 설정 버튼 */}
                <button 
                  onClick={() => setShowAquariumSettings(true)}
                  className="px-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg flex items-center justify-center"
                >
                  <FiSettings className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 연속 사용 알림 */}
        <div className={`mx-4 mt-4 p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
          <div className="flex items-center justify-center gap-2">
            {/* 왼쪽 불꽃 SVG 아이콘 */}
            <svg 
              width="16" 
              height="20" 
              viewBox="0 0 16 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="animate-pulse"
              style={{ animationDuration: '2s' }}
            >
              <path 
                d="M8 20c4.418 0 8-3.582 8-8 0-1.5-.5-3-1.5-4.5L13 6c-1-2-2-4-2-6-1.5 2-2.5 3.5-3 5-.5-1-1.5-2.5-2-4-1 3-3 5-3 9 0 4.418 3.582 8 8 8z" 
                fill="url(#flame-gradient-left)"
              />
              <defs>
                <linearGradient id="flame-gradient-left" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
            
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              챌린지 {consecutiveDays.toString().padStart(2, '0')}일 연속 달성!
            </span>
            
            {/* 오른쪽 불꽃 SVG 아이콘 */}
            <svg 
              width="16" 
              height="20" 
              viewBox="0 0 16 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="animate-pulse"
              style={{ animationDuration: '2s', animationDelay: '1s' }}
            >
              <path 
                d="M8 20c4.418 0 8-3.582 8-8 0-1.5-.5-3-1.5-4.5L13 6c-1-2-2-4-2-6-1.5 2-2.5 3.5-3 5-.5-1-1.5-2.5-2-4-1 3-3 5-3 9 0 4.418 3.582 8 8 8z" 
                fill="url(#flame-gradient-right)"
              />
              <defs>
                <linearGradient id="flame-gradient-right" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="mx-4 mt-4 mb-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6`}>
            <div className="flex flex-col items-center">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mb-3`}>플라스틱 절약량</span>
              
              {/* 초록색 그라데이션 원 - 입체감 강화 */}
              <div className="relative w-28 h-28 mb-3">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full shadow-2xl"></div>
                <div className="absolute inset-[2px] bg-gradient-to-br from-green-400/30 via-emerald-500/20 to-green-600/10 rounded-full"></div>
                <div className="absolute top-2 left-2 w-8 h-8 bg-white/30 rounded-full blur-xl"></div>
                <div className="absolute bottom-2 right-2 w-16 h-16 bg-green-700/30 rounded-full blur-2xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{plasticSavedDisplay}</p>
                </div>
              </div>
              
              {treesEquivalent > 0 && (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs text-center`}>
                  나무 {treesEquivalent}그루가 1년간 흡수하는 CO₂ 양
                </p>
              )}
              
              {/* 그라데이션 구분선 */}
              <div className={`w-full mt-3 h-[1px] bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-600' : 'via-gray-300'} to-transparent`}></div>
              
              {/* SVG 나무들 */}
              <div className="mt-4 w-full">
                <div className="flex flex-col items-center gap-2">
                  {/* 나무를 7개씩 줄로 분할 */}
                  {Array.from({ length: Math.ceil(treesEquivalent / 7) }, (_, rowIndex) => {
                    const startIdx = rowIndex * 7;
                    const endIdx = Math.min(startIdx + 7, treesEquivalent);
                    const treesInRow = endIdx - startIdx;
                    
                    return (
                      <div key={rowIndex} className="flex justify-center gap-2">
                        {Array.from({ length: treesInRow }, (_, i) => {
                          const treeIndex = startIdx + i;
                          return (
                            <svg
                              key={treeIndex}
                              width="30"
                              height="35"
                              viewBox="0 0 30 35"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="animate-pulse"
                              style={{ 
                                animationDuration: '3s',
                                animationDelay: `${treeIndex * 0.2}s` 
                              }}
                            >
                              {/* 그림자 */}
                              <ellipse cx="15" cy="32" rx="8" ry="2" fill="#000" opacity="0.1"/>
                              
                              {/* 나무 줄기 - 나뭇잎 뒤로 이동 */}
                              <rect x="13" y="14" width="4" height="17" fill="#92400e" rx="1"/>
                              
                              {/* 나무 잎 부분 - 줄기 앞으로 */}
                              <circle cx="15" cy="10" r="8" fill="#22c55e" opacity="0.9"/>
                              <circle cx="10" cy="13" r="6" fill="#16a34a" opacity="0.8"/>
                              <circle cx="20" cy="13" r="6" fill="#16a34a" opacity="0.8"/>
                              <circle cx="15" cy="15" r="7" fill="#10b981" opacity="0.9"/>
                            </svg>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                
                {/* 나무가 없을 때 메시지 */}
                {treesEquivalent === 0 && (
                  <p className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                    챌린지를 완료하면 나무가 자랍니다 🌱
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 플라스틱 절약량 테스트 슬라이더 (개발용) */}
        <div className={`mx-4 mt-4 mb-4 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>
              테스트용 플라스틱 절약량 조절
            </span>
            <span className={`text-xs font-bold ${
              parseFloat(testPlasticSaved) >= 15000 ? 'text-green-500' : 
              parseFloat(testPlasticSaved) >= 7000 ? 'text-blue-500' : 
              parseFloat(testPlasticSaved) >= 3500 ? 'text-yellow-500' : 
              'text-gray-500'
            }`}>
              {testPlasticSaved < 1000 ? `${testPlasticSaved}g` : `${(testPlasticSaved/1000).toFixed(1)}kg`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="500"
            value={testPlasticSaved}
            onChange={(e) => {
              setTestPlasticSaved && setTestPlasticSaved(parseInt(e.target.value));
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                ${
                  parseFloat(testPlasticSaved) >= 15000 ? '#22c55e' : 
                  parseFloat(testPlasticSaved) >= 7000 ? '#3B82F6' : 
                  parseFloat(testPlasticSaved) >= 3500 ? '#EAB308' : 
                  '#9CA3AF'
                } 0%, 
                ${
                  parseFloat(testPlasticSaved) >= 15000 ? '#22c55e' : 
                  parseFloat(testPlasticSaved) >= 7000 ? '#3B82F6' : 
                  parseFloat(testPlasticSaved) >= 3500 ? '#EAB308' : 
                  '#9CA3AF'
                } ${(parseFloat(testPlasticSaved) / 50000) * 100}%, 
                #E5E7EB ${(parseFloat(testPlasticSaved) / 50000) * 100}%, 
                #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between mt-1">
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>0g</span>
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>25kg</span>
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>50kg</span>
          </div>
          <div className="mt-2 text-center">
            <span className={`text-[11px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              CO₂ {co2Reduced.toFixed(1)}kg 감소 = 나무 {treesEquivalent}그루의 연간 효과
            </span>
          </div>
        </div>
        
        {/* 수질 테스트 슬라이더 (개발용) */}
        <div className={`mx-4 mt-4 mb-4 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>
              테스트용 수질 조절
            </span>
            <span className={`text-xs font-bold ${
              waterQuality >= 80 ? 'text-blue-500' : 
              waterQuality >= 50 ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {waterQuality}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={waterQuality}
            onChange={(e) => setWaterQuality && setWaterQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                ${waterQuality >= 80 ? '#3B82F6' : waterQuality >= 50 ? '#EAB308' : '#EF4444'} 0%, 
                ${waterQuality >= 80 ? '#3B82F6' : waterQuality >= 50 ? '#EAB308' : '#EF4444'} ${waterQuality}%, 
                #E5E7EB ${waterQuality}%, 
                #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between mt-1">
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>0% (탁함)</span>
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>50%</span>
            <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>100% (맑음)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;