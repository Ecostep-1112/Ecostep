import React, { useState, useEffect } from 'react';
import { FiSettings, FiTrendingUp } from 'react-icons/fi';
import FishIcons from '../components/FishIcons';
import DecorationIcons from '../components/DecorationIcons';
import WaterSurface from '../components/WaterSurface';
import BubbleSystem from '../components/BubbleSystem';

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
  fishCount = 0
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const [fishPositions, setFishPositions] = useState([]);
  const [displayFish, setDisplayFish] = useState([]);
  const [displayDecorations, setDisplayDecorations] = useState([]);
  
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
                      {daysWithoutChallenge > 0 && (
                        <span className="text-red-300 ml-1">
                          ({daysWithoutChallenge}일째 미완료)
                        </span>
                      )}
                    </span>
                    <span className={`text-xs font-medium ${
                      waterQuality >= 80 ? 'text-white' : 
                      waterQuality >= 50 ? 'text-yellow-300' : 
                      'text-red-300'
                    }`}>{waterQuality}%</span>
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

        {/* 수질 테스트 슬라이더 (개발용) */}
        <div className={`mx-4 mt-4 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
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

        {/* 연속 사용 알림 */}
        <div className={`mx-4 mt-4 p-3 ${isDarkMode ? 'bg-gray-800 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl`}>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">🔥 23일 연속 달성!</span>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="mx-4 mt-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>플라스틱 절약량</span>
              <FiTrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className={`text-2xl font-bold ${textColor}`}>18.7kg</p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>자동차 3일 운행량, 나무 2그루 효과</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;