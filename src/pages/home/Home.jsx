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
  setTestPlasticSaved
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
      // 랜덤으로 물고기 선택
      const shuffled = [...purchasedFish].sort(() => Math.random() - 0.5);
      const count = Math.min(fishCount || 3, purchasedFish.length);
      setDisplayFish(shuffled.slice(0, count));
    } else if (selectedFish.length > 0) {
      // 선택된 물고기 표시
      setDisplayFish(selectedFish.map(index => purchasedFish[index]).filter(Boolean));
    } else {
      // 기본값: 처음 3마리
      setDisplayFish(purchasedFish.slice(0, 3));
    }
  }, [isRandomFish, purchasedFish, selectedFish, fishCount]);
  
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
  }, [isRandomDecorations, selectedDecorations, purchasedDecorations, decorationsData]);
  
  // 물고기 위치 업데이트 (정적 위치)
  useEffect(() => {
    const positions = displayFish.map((fishName, i) => ({
      name: fishName,
      x: 25 + i * 25,  // 균등하게 배치
      y: fishName === '코리도라스' ? 65 : 45,  // 코리도라스는 바닥, 나머지는 중간
      direction: 1
    }));
    setFishPositions(positions);
  }, [displayFish]);

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
            
          {/* 물고기 표시 (정적) */}
          <div className="absolute inset-0 pointer-events-none z-[4]">
            {fishPositions.map((fish, i) => {
              const FishIcon = FishIcons[fish.name.replace(' ', '')];
              return FishIcon ? (
                <div 
                  key={i} 
                  className="absolute"
                  style={{
                    left: `${fish.x}%`,
                    top: `${fish.y}%`,
                    transform: `translateX(-50%) translateY(-50%)`,
                  }}
                >
                  <FishIcon size={35} />
                </div>
              ) : null;
            })}
          </div>
          
          {/* 사용자가 선택한 장식품 표시 - 어항 안쪽 */}
            {displayDecorations.map((decoName, i) => {
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
                    챌린지를 완료하면 나무가 자랍니다
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