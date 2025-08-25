import React from 'react';
import { FiLock } from 'react-icons/fi';
import FishIcons from '../components/FishIcons';
import DecorationIcons from '../components/DecorationIcons';
import SilverTank from '../components/tanks/SilverTank';
import GoldTank from '../components/tanks/GoldTank';
import PlatinumTank from '../components/tanks/PlatinumTank';

const Rewards = ({ 
  isDarkMode, 
  purchasedFish,
  setPurchasedFish,
  userRanking = 'gold',
  claimedTanks = [],
  setClaimedTanks = () => {},
  purchasedDecorations = ['해초', '산호'],
  setPurchasedDecorations,
  points,
  setPoints,
  showToast
}) => {
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

  const decorationsData = {
    bronze: [
      { name: '해초', description: '자연스러운 수초', price: 100 },
      { name: '용암석', description: '신비로운 화산석', price: 150 },
      { name: '작은동굴', description: '아늑한 은신처', price: 200 }
    ],
    silver: [
      { name: '산호', description: '화려한 바다 정원', price: 250 },
      { name: '드리프트우드', description: '오래된 바다 목재', price: 300 },
      { name: '조개껍질', description: '바다의 보석함', price: 350 }
    ],
    gold: [
      { name: '그리스신전', description: '고대 문명의 흔적', price: 400 },
      { name: '보물상자', description: '해적의 황금 보물', price: 450 },
      { name: '해적선', description: '전설의 침몰선', price: 500 }
    ],
    platinum: [
      { name: '크리스탈동굴', description: '신비한 크리스탈', price: 600 },
      { name: 'LED해파리', description: '빛나는 수중 요정', price: 700 },
      { name: '아틀란티스유적', description: '잃어버린 문명', price: 800 }
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

        {/* 랭킹 보상 - 어항 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>랭킹 보상</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {/* 실버 어항 */}
            <button
              onClick={() => {
                const canClaim = userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum';
                if (!canClaim) {
                  showToast('실버 랭크에서 잠금 해제', 'error');
                } else if (!claimedTanks.includes('silver')) {
                  setClaimedTanks([...claimedTanks, 'silver']);
                  showToast('실버 어항 수령 완료', 'success');
                }
              }}
              disabled={claimedTanks.includes('silver')}
              className={`${claimedTanks.includes('silver') ? 'bg-green-50 border-green-300' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? `${cardBg} hover:bg-blue-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('silver') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
            >
              {/* 블러 효과를 받을 컨테이너 */}
              <div className={`w-full h-full flex flex-col items-center justify-between ${(userRanking !== 'silver' && userRanking !== 'gold' && userRanking !== 'platinum') ? 'filter blur-[1px]' : ''}`}>
                <div className={`w-[70px] h-[45px] flex items-center justify-center relative mx-auto`}>
                  <SilverTank isPreview={true} />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                  <p className={`text-[11px] leading-tight ${claimedTanks.includes('silver') ? 'text-green-700' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'} text-center font-medium`}>
                    실버 어항
                  </p>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                    실버 랭킹 보상
                  </p>
                </div>
                
                <div className="h-[20px] flex items-center justify-center w-full">
                  <p className={`text-xs ${claimedTanks.includes('silver') ? 'text-green-500 font-medium' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center`}>
                    {claimedTanks.includes('silver') ? '수령 완료' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? '수령 가능' : '실버 도달'}
                  </p>
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'silver' && userRanking !== 'gold' && userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiLock className="w-5 h-5 text-gray-600 opacity-80" />
                  </div>
                </>
              )}
            </button>
            
            {/* 골드 어항 */}
            <button
              onClick={() => {
                const canClaim = userRanking === 'gold' || userRanking === 'platinum';
                if (!canClaim) {
                  showToast('골드 랭크에서 잠금 해제', 'error');
                } else if (!claimedTanks.includes('gold')) {
                  setClaimedTanks([...claimedTanks, 'gold']);
                  showToast('골드 어항 수령 완료', 'success');
                }
              }}
              disabled={claimedTanks.includes('gold')}
              className={`${claimedTanks.includes('gold') ? 'bg-green-50 border-green-300' : (userRanking === 'gold' || userRanking === 'platinum') ? `${cardBg} hover:bg-blue-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('gold') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
            >
              {/* 블러 효과를 받을 컨테이너 */}
              <div className={`w-full h-full flex flex-col items-center justify-between ${(userRanking !== 'gold' && userRanking !== 'platinum') ? 'filter blur-[1px]' : ''}`}>
                <div className={`w-[70px] h-[45px] flex items-center justify-center relative mx-auto`}>
                  <GoldTank isPreview={true} />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                  <p className={`text-[11px] leading-tight ${claimedTanks.includes('gold') ? 'text-green-700' : (userRanking === 'gold' || userRanking === 'platinum') ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'} text-center font-medium`}>
                    골드 어항
                  </p>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                    골드 랭킹 보상
                  </p>
                </div>
                
                <div className="h-[20px] flex items-center justify-center w-full">
                  <p className={`text-xs ${claimedTanks.includes('gold') ? 'text-green-500 font-medium' : (userRanking === 'gold' || userRanking === 'platinum') ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center`}>
                    {claimedTanks.includes('gold') ? '수령 완료' : (userRanking === 'gold' || userRanking === 'platinum') ? '수령 가능' : '골드 도달'}
                  </p>
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'gold' && userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiLock className="w-5 h-5 text-gray-600 opacity-80" />
                  </div>
                </>
              )}
            </button>
            
            {/* 플래티넘 어항 */}
            <button
              onClick={() => {
                const canClaim = userRanking === 'platinum';
                if (!canClaim) {
                  showToast('플래티넘 랭크에서 잠금 해제', 'error');
                } else if (!claimedTanks.includes('platinum')) {
                  setClaimedTanks([...claimedTanks, 'platinum']);
                  showToast('플래티넘 어항 수령 완료', 'success');
                }
              }}
              disabled={claimedTanks.includes('platinum')}
              className={`${claimedTanks.includes('platinum') ? 'bg-green-50 border-green-300' : userRanking === 'platinum' ? `${cardBg} hover:bg-blue-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('platinum') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
            >
              {/* 블러 효과를 받을 컨테이너 */}
              <div className={`w-full h-full flex flex-col items-center justify-between ${userRanking !== 'platinum' ? 'filter blur-[1px]' : ''}`}>
                <div className={`w-[70px] h-[45px] flex items-center justify-center relative mx-auto`}>
                  <PlatinumTank isPreview={true} />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                  <p className={`text-[11px] leading-tight ${claimedTanks.includes('platinum') ? 'text-green-700' : userRanking === 'platinum' ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'} text-center font-medium`}>
                    플래티넘 어항
                  </p>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                    플래티넘 랭킹 보상
                  </p>
                </div>
                
                <div className="h-[20px] flex items-center justify-center w-full">
                  <p className={`text-xs ${claimedTanks.includes('platinum') ? 'text-green-500 font-medium' : userRanking === 'platinum' ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center`}>
                    {claimedTanks.includes('platinum') ? '수령 완료' : userRanking === 'platinum' ? '수령 가능' : '플래티넘 도달'}
                  </p>
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiLock className="w-5 h-5 text-gray-600 opacity-80" />
                  </div>
                </>
              )}
            </button>
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
                  // 랭크별 잠금 확인
                  const rankOrder = ['bronze', 'silver', 'gold', 'platinum'];
                  const userRankIndex = rankOrder.indexOf(userRanking);
                  const itemRankIndex = rankOrder.indexOf(rank);
                  const isLocked = itemRankIndex > userRankIndex;
                  
                  const fishPrice = (rank === 'bronze' ? 100 : rank === 'silver' ? 300 : rank === 'gold' ? 500 : 700) + i * 100;
                  
                  return (
                    <button 
                      key={i} 
                      className={`${isLocked ? 'bg-gray-100 cursor-not-allowed' : isPurchased ? 'bg-green-50 border-green-300' : cardBg} border ${isPurchased ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-all ${!isLocked && !isPurchased ? 'hover:scale-105' : ''} overflow-hidden`}
                      disabled={isPurchased && !isLocked}
                      onClick={() => {
                        if (isLocked) {
                          // 잠금 상태 알림
                          const rankName = rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘';
                          showToast(`${rankName} 랭크에서 잠금 해제`, 'error');
                        } else if (!isPurchased) {
                          // 포인트가 충분한지 확인
                          if (points >= fishPrice) {
                            // 포인트 차감
                            setPoints(prev => prev - fishPrice);
                            // 물고기 추가
                            setPurchasedFish(prev => [...prev, fish.name]);
                            // 성공 알림
                            showToast(`${fish.name} 구매 완료`, 'success');
                          } else {
                            // 실패 알림
                            showToast(`포인트 부족 (${fishPrice}P 필요)`, 'error');
                          }
                        }
                      }}
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
                            {isPurchased ? '구매완료' : `${fishPrice}P`}
                          </p>
                        )}
                      </div>
                      
                      {/* 잠금 오버레이와 자물쇠 */}
                      {isLocked && (
                        <>
                          <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FiLock className="w-5 h-5 text-gray-600 opacity-80" />
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-3 mt-4 border-t border-gray-200"></div>

        {/* 장식품 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>장식품</h3>
          
          {Object.entries(decorationsData).map(([rank, decorations]) => (
            <div key={rank} className="mb-4">
              <h4 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mb-2 capitalize`}>
                {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {decorations.map((deco, i) => {
                  const isPurchased = purchasedDecorations.includes(deco.name);
                  // 랭크별 잠금 확인
                  const rankOrder = ['bronze', 'silver', 'gold', 'platinum'];
                  const userRankIndex = rankOrder.indexOf(userRanking);
                  const itemRankIndex = rankOrder.indexOf(rank);
                  const isLocked = itemRankIndex > userRankIndex;
                  
                  return (
                    <button 
                      key={i} 
                      className={`${
                        isLocked 
                          ? 'bg-gray-100 cursor-not-allowed'
                          : isPurchased 
                            ? 'bg-green-50 border-green-300' 
                            : cardBg
                      } border ${isPurchased ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-all ${!isLocked && !isPurchased ? 'hover:scale-105' : ''} overflow-hidden`}
                      disabled={isPurchased && !isLocked}
                      onClick={() => {
                        if (isLocked) {
                          // 잠금 상태 알림
                          const rankName = rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘';
                          showToast(`${rankName} 랭크에서 잠금 해제`, 'error');
                        } else if (!isPurchased) {
                          // 포인트가 충분한지 확인
                          if (points >= deco.price) {
                            // 포인트 차감
                            setPoints(prev => prev - deco.price);
                            // 장식품 추가
                            setPurchasedDecorations(prev => [...prev, deco.name]);
                            // 성공 알림
                            showToast(`${deco.name} 구매 완료`, 'success');
                          } else {
                            // 실패 알림
                            showToast(`포인트 부족 (${deco.price}P 필요)`, 'error');
                          }
                        }
                      }}
                    >
                      {/* 블러 효과를 받을 컨테이너 */}
                      <div className={`w-full h-full flex flex-col items-center justify-between ${isLocked ? 'filter blur-[1px]' : ''}`}>
                        {/* 아이콘 - 고정 높이 영역 */}
                        <div className="h-[42px] w-full flex items-center justify-center">
                          <div className="w-9 h-9">
                            {DecorationIcons[deco.name] && React.createElement(DecorationIcons[deco.name])}
                          </div>
                        </div>
                        
                        {/* 텍스트 영역 - 중앙 정렬 */}
                        <div className="flex-1 flex flex-col items-center justify-center w-full">
                          <p className={`text-[11px] ${
                            isLocked 
                              ? 'text-gray-500'
                              : isPurchased 
                                ? 'text-green-600' 
                                : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } text-center font-medium`}>
                            {deco.name}
                          </p>
                        </div>
                        
                        {/* 가격 - 하단 고정 */}
                        <div className="h-[20px] flex items-center justify-center w-full">
                          {!isLocked && (
                            <p className={`text-xs ${isPurchased ? 'text-green-500 font-medium' : 'text-blue-500'} text-center`}>
                              {isPurchased ? '구매완료' : `${deco.price}P`}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* 잠금 오버레이와 자물쇠 */}
                      {isLocked && (
                        <>
                          <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FiLock className="w-5 h-5 text-gray-600 opacity-80" />
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* 테스트용 초기화 버튼 */}
        <div className="mx-3 mt-8 mb-6">
          <button
            onClick={() => {
              // 구매 이력 완전 초기화 (아무것도 구매하지 않은 상태)
              setPurchasedFish([]);
              setPurchasedDecorations([]);
              setClaimedTanks([]); // 랭킹 보상 초기화
              setPoints(10000);
              
              // localStorage 초기화
              localStorage.setItem('purchasedFish', JSON.stringify([]));
              localStorage.setItem('purchasedDecorations', JSON.stringify([]));
              localStorage.setItem('claimedTanks', JSON.stringify([])); // 랭킹 보상 초기화
              localStorage.setItem('userPoints', '10000');
              
              showToast('테스트 데이터 초기화 완료', 'success');
            }}
            className={`w-full py-3 px-4 rounded-xl ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
            } transition-colors flex items-center justify-center gap-2 text-sm font-medium`}
          >
            <span>🔄</span>
            <span>테스트용 초기화</span>
          </button>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center mt-2`}>
            구매 이력과 포인트를 초기 상태로 되돌립니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rewards;