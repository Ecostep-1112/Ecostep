import React, { useState, useEffect } from 'react';
import { Settings, TrendingUp } from 'lucide-react';
import FishIcons from '../components/FishIcons';
import DecorationIcons from '../components/DecorationIcons';
import WaterSurface from '../components/WaterSurface';
import BubbleSystem from '../components/BubbleSystem';

const Home = ({ 
  isDarkMode, 
  setShowAquariumSettings, 
  purchasedFish,
  currentTank = 'basic',
  tankName = '나의 어항',
  purchasedDecorations = [],
  decorationsData = {}
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const [fishPositions, setFishPositions] = useState([]);
  
  // 물고기 위치 업데이트 (간단한 시뮬레이션)
  useEffect(() => {
    const positions = purchasedFish.slice(0, 3).map((_, i) => ({
      x: 100 + i * 80,
      y: 100 + Math.sin(i * Math.PI / 3) * 30
    }));
    setFishPositions(positions);
  }, [purchasedFish]);

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 어항 섹션 - 전체 너비, 파란 박스가 직접 어항 역할 */}
        <div className="relative bg-gradient-to-b from-blue-500 to-blue-600 mt-0" style={{ aspectRatio: '1/1' }}>
          {/* 상단 그라데이션 구분선 */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          
          {/* 물 표면 효과 컴포넌트 */}
          <WaterSurface />
          
          {/* 기포 시스템 */}
          <BubbleSystem fishPositions={fishPositions} />
            
          {/* 물고기들 어항 위에 표시 */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none z-[4]">
              {/* 구매한 물고기 중 일부 표시 */}
              {purchasedFish.slice(0, 3).map((fishName, i) => {
                const FishIcon = FishIcons[fishName.replace(' ', '')];
                return FishIcon ? (
                <div 
                  key={i} 
                  className="animate-swim"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${4 + i}s`
                  }}
                >
                  <FishIcon size={45} />
                </div>
              ) : null;
              })}
          </div>
          
          {/* 사용자 보유 장식품 표시 - 어항 안쪽 */}
            {purchasedDecorations.slice(0, 3).map((decoName, i) => {
              const positions = [
                { bottom: '18%', left: '20%' },
                { bottom: '18%', right: '20%' },
                { bottom: '18%', left: '50%', transform: 'translateX(-50%)' }
              ];
              const deco = Object.values(decorationsData).flat().find(d => d.name === decoName);
              if (!deco) return null;
              const DecoIcon = DecorationIcons[deco.icon];
              
              return DecoIcon ? (
                <div 
                  key={i}
                  className="absolute z-[2] animate-sway"
                  style={{
                    ...positions[i],
                    animationDuration: `${3 + i * 0.5}s`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  <DecoIcon size={25} />
                </div>
              ) : null;
            })}
          {/* 수질바 - 하단에 위치, 개선된 디자인 */}
          <div className="absolute bottom-0 left-0 right-0">
            {/* 구분선 */}
            <div className="h-[1px] bg-white/20"></div>
            
            {/* 수질바 컨테이너 */}
            <div className="bg-white/10 backdrop-blur-sm p-2 border-t border-white/30">
              <div className="flex items-stretch gap-2">
                {/* 수질 정보 영역 */}
                <div className="flex-1 px-3 py-1.5 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-xs">수질</span>
                    <span className="text-white text-xs font-medium">85%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div className="bg-white h-1.5 rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                {/* 구분선 */}
                <div className="w-[1px] bg-white/20 self-stretch"></div>
                
                {/* 설정 버튼 */}
                <button 
                  onClick={() => setShowAquariumSettings(true)}
                  className="px-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg flex items-center justify-center"
                >
                  <Settings className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
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
              <TrendingUp className="w-4 h-4 text-green-500" />
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