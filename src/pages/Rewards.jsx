import React from 'react';
import FishIcons from '../components/FishIcons';

const Rewards = ({ isDarkMode, purchasedFish }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  const fishData = {
    bronze: [
      { name: '코리도라스', description: '바닥 청소 요정' },
      { name: '체리바브', description: '체리 같은 귀요미' },
      { name: '네온테트라', description: '반짝이는 보석' }
    ],
    silver: [
      { name: '아피스토그라마', description: '포켓 드래곤' },
      { name: '람시클리드', description: '온화한 젠틀맨' },
      { name: '구피', description: '꼬리 댄싱퀸' }
    ],
    gold: [
      { name: '엔젤피쉬', description: '수중의 천사' },
      { name: '킬리피쉬', description: '자유로운 모험가' },
      { name: '베타', description: '실크 드레스 퀸' }
    ],
    platinum: [
      { name: '디스커스', description: '수중 황제' },
      { name: '만다린피쉬', description: '네온 아티스트' },
      { name: '아로와나', description: '전설의 용' }
    ]
  };

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 현재 랭크 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-6`}>
          <h3 className={`${textColor} text-center text-sm font-medium mb-4`}>현재 랭크</h3>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">Gold</span>
              </div>
              <span className="absolute -top-2 -right-2 text-2xl">🥇</span>
            </div>
          </div>
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-3`}>플래티넘까지 70% 달성</p>
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-4`}>
            <div className="bg-gradient-to-r from-yellow-400 to-gray-300 h-2 rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
          </div>
          <div className="flex justify-between text-xs px-2">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🥉</span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>브론즈</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🥈</span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>실버</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🥇</span>
              <span className="text-yellow-500">골드</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">👑</span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>플래티넘</span>
            </div>
          </div>
        </div>

        {/* 랭킹 보상 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>랭킹 보상</h3>
          <div className="flex justify-between gap-3">
            <div className={`flex-1 ${cardBg} border ${borderColor} rounded-xl p-3`}>
              <div className={`w-full aspect-square ${inputBg} rounded-lg mb-2 flex items-center justify-center`}>
                <span className="text-2xl">🪙</span>
              </div>
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>실버</p>
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>적용</p>
            </div>
            <div className={`flex-1 ${cardBg} border ${borderColor} rounded-xl p-3`}>
              <div className={`w-full aspect-square ${inputBg} rounded-lg mb-2 flex items-center justify-center`}>
                <span className="text-2xl">🥇</span>
              </div>
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>골드</p>
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>적용</p>
            </div>
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="w-full aspect-square bg-blue-100 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <p className="text-xs text-center text-blue-500">플래티넘</p>
              <p className="text-xs text-center text-blue-400">획득</p>
            </div>
          </div>
        </div>

        <div className="mx-3 mt-6 border-t border-gray-200"></div>

        {/* 물고기 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>물고기</h3>
          
          {Object.entries(fishData).map(([rank, fishes]) => (
            <div key={rank} className="mb-4">
              <h4 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mb-2 capitalize`}>
                {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {fishes.map((fish, i) => {
                  const isPurchased = purchasedFish.includes(fish.name);
                  const isLocked = false; // 플래티넘도 잠금 해제
                  
                  return (
                    <button 
                      key={i} 
                      className={`${isLocked ? 'bg-gray-100 opacity-50' : isPurchased ? 'bg-green-50 border-green-300' : cardBg} border ${isPurchased ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2`}
                      disabled={isLocked || isPurchased}
                    >
                      {/* 물고기 SVG 아이콘 - 더 크게, 중앙 정렬 */}
                      <div className={`h-[42px] w-full flex items-center justify-center ${isLocked ? 'blur-sm' : ''}`}>
                        {(() => {
                          const FishIcon = FishIcons[fish.name.replace(' ', '')];
                          // 특정 물고기는 더 크게 표시
                          const iconSize = ['네온테트라', '아피스토그라마', '킬리피쉬'].includes(fish.name) ? 48 : 36;
                          return FishIcon ? <FishIcon size={iconSize} /> : null;
                        })()}
                      </div>
                      
                      {/* 텍스트 영역 - 중앙 정렬 */}
                      <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                        {/* 물고기 이름 - 더 크게 */}
                        <p className={`text-[11px] leading-tight ${isLocked ? 'text-gray-400' : isPurchased ? 'text-green-600' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center font-medium`}>
                          {fish.name}
                        </p>
                        
                        {/* 설명 - 더 크게 */}
                        <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                          {fish.description}
                        </p>
                      </div>
                      
                      {/* 가격/구매완료 - 하단 고정 */}
                      <div className="h-[20px] flex items-center justify-center w-full">
                        {!isLocked && (
                          <p className={`text-xs ${isPurchased ? 'text-green-500 font-medium' : 'text-blue-500'} text-center`}>
                            {isPurchased ? '구매완료' : `${(rank === 'bronze' ? 100 : rank === 'silver' ? 300 : 500) + i * 100}P`}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-3 mt-4 border-t border-gray-200"></div>

        {/* 어항 장식품 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>어항 장식품</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {['🌿 해초', '🪸 산호', '🏛️ 성'].map((item, i) => (
              <button key={i} className={`${cardBg} border ${borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2`}>
                {/* 아이콘 - 고정 높이 영역 */}
                <div className="h-[42px] w-full flex items-center justify-center">
                  <span className="text-3xl">{item.split(' ')[0]}</span>
                </div>
                
                {/* 텍스트 영역 - 중앙 정렬 */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  <p className={`text-[11px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center font-medium`}>
                    {item.split(' ')[1]}
                  </p>
                </div>
                
                {/* 가격 - 하단 고정 */}
                <div className="h-[20px] flex items-center justify-center w-full">
                  <p className="text-xs text-blue-500 text-center">{50 + i * 30}포인트</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;