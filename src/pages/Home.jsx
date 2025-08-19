import React from 'react';
import { Settings, TrendingUp } from 'lucide-react';
import FishIcons from '../components/FishIcons';

const Home = ({ isDarkMode, setShowAquariumSettings, purchasedFish }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 어항 섹션 */}
        <div className="bg-blue-500 rounded-2xl mx-3 mt-4 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white text-sm font-medium">나의 어항</h3>
            <button onClick={() => setShowAquariumSettings(true)}>
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="bg-blue-100 rounded-xl h-48 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              {/* 구매한 물고기 중 일부 표시 */}
              {purchasedFish.slice(0, 3).map((fishName, i) => {
                const FishIcon = FishIcons[fishName.replace(' ', '')];
                return FishIcon ? (
                  <div key={i} className="animate-pulse" style={{animationDelay: `${i * 0.3}s`}}>
                    <FishIcon size={40} />
                  </div>
                ) : null;
              })}
            </div>
            <div className="absolute bottom-0 left-4">🌿</div>
            <div className="absolute bottom-0 right-4">🪸</div>
          </div>
          <div className="mt-3 bg-white/10 rounded-lg p-2">
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