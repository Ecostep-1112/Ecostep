import React from 'react';
import { Settings, TrendingUp } from 'lucide-react';
import FishIcons from '../components/FishIcons';
import DecorationIcons from '../components/DecorationIcons';
import BasicTank from '../components/tanks/BasicTank';
import SilverTank from '../components/tanks/SilverTank';
import GoldTank from '../components/tanks/GoldTank';
import PlatinumTank from '../components/tanks/PlatinumTank';

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

  // 현재 선택된 어항 컴포넌트
  const CurrentTankComponent = 
    currentTank === 'silver' ? SilverTank :
    currentTank === 'gold' ? GoldTank :
    currentTank === 'platinum' ? PlatinumTank :
    BasicTank;

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 어항 섹션 */}
        <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl mx-3 mt-4 p-2">
          <div className="flex justify-between items-center mb-1">
            <div className="flex-1">
              <h3 
                className="text-white text-sm font-medium cursor-pointer hover:text-blue-100 transition-colors inline-block"
                onClick={() => setShowAquariumSettings(true)}
              >
                {tankName}
              </h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAquariumSettings(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors p-1.5 rounded-lg"
              >
                <Settings className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          {/* 어항 컨테이너 - 정사각형 */}
          <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
            {/* 선택된 어항 표시 - 전체 너비 사용 */}
            <div className="absolute inset-0 animate-tankFadeIn tank-transition">
              <CurrentTankComponent className="w-full h-full" />
            </div>
            
            {/* 물고기들 어항 위에 표시 */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none z-10">
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
                  className="absolute z-5 animate-sway"
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
          </div>
          <div className="mt-2 bg-white/10 rounded-lg p-1.5">
            <div className="flex justify-between items-center">
              <span className="text-white text-xs">수질</span>
              <span className="text-white text-xs font-medium">85%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* 연속 사용 알림 */}
        <div className={`mx-3 mt-4 p-3 ${isDarkMode ? 'bg-gray-800 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl`}>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">🔥 23일 연속 달성!</span>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="mx-3 mt-4">
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