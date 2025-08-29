import React from 'react';
import { FiLock } from 'react-icons/fi';
import FishIcons from '../components/FishIcons';
import DecorationIcons from '../components/DecorationIcons';
import SilverTank from '../components/tanks/SilverTank';
import GoldTank from '../components/tanks/GoldTank';
import PlatinumTank from '../components/tanks/PlatinumTank';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../components/RankIcons';

const Rewards = ({ 
  isDarkMode, 
  purchasedFish,
  setPurchasedFish,
  userRanking = 'gold',
  setUserRanking,
  claimedTanks = [],
  setClaimedTanks = () => {},
  purchasedDecorations = ['해초', '산호'],
  setPurchasedDecorations,
  points,
  setPoints,
  showToast,
  setCurrentTank,
  calculateRankProgress,
  calculateRankFromPoints,
  totalEarnedPoints,
  setTotalEarnedPoints,
  spendPoints
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
      { name: '해초', description: '자연스러운 수초', price: 200 },
      { name: '용암석', description: '신비로운 화산석', price: 300 },
      { name: '작은 동굴', description: '아늑한 은신처', price: 400 }
    ],
    silver: [
      { name: '산호', description: '화려한 바다 정원', price: 500 },
      { name: '드리프트 우드', description: '오래된 바다 목재', price: 600 },
      { name: '조개 껍질', description: '바다의 보석함', price: 700 }
    ],
    gold: [
      { name: '그리스 신전', description: '고대 문명의 흔적', price: 900 },
      { name: '보물 상자', description: '해적의 황금 보물', price: 1000 },
      { name: '해적선', description: '전설의 침몰선', price: 1100 }
    ],
    platinum: [
      { name: '크리스탈 동굴', description: '신비한 크리스탈', price: 1400 },
      { name: 'LED 해파리', description: '빛나는 수중 요정', price: 1500 },
      { name: '아틀란티스 유적', description: '잃어버린 문명', price: 1600 }
    ]
  };

  // 랭크별 색상 정의 - 조건부 렌더링을 위한 함수
  const getRankGradient = (rank) => {
    switch(rank) {
      case 'bronze':
        return 'bg-gradient-to-br from-cyan-500 to-blue-600';
      case 'silver':
        return 'bg-gradient-to-br from-cyan-400 to-teal-500';
      case 'gold':
        return 'bg-gradient-to-br from-yellow-300 to-orange-400';
      case 'platinum':
        return 'bg-gradient-to-br from-purple-400 to-indigo-500';
      default:
        return 'bg-gradient-to-br from-yellow-300 to-orange-400';
    }
  };

  // 진행바 색상 - 현재 랭크와 동일한 색상
  const getProgressGradient = (rank) => {
    switch(rank) {
      case 'bronze':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600';
      case 'silver':
        return 'bg-gradient-to-r from-cyan-400 to-teal-500';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-300 to-orange-400';
      case 'platinum':
        return 'bg-gradient-to-r from-purple-400 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-blue-600';
    }
  };

  const rankIcons = {
    bronze: BronzeIcon,
    silver: SilverIcon,
    gold: GoldIcon,
    platinum: PlatinumIcon
  };

  const rankNames = {
    bronze: '브론즈',
    silver: '실버',
    gold: '골드',
    platinum: '플래티넘'
  };

  const rankColors = {
    bronze: '#3b82f6',
    silver: '#06b6d4',
    gold: '#facc15',
    platinum: '#ec4899'
  };

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 현재 랭크 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-6`}>
          <h3 className={`${textColor} text-center text-sm font-medium mb-4`}>현재 랭크</h3>
          
          {/* 랭크 표시 직사각형 */}
          <div className="relative mb-4">
            <div className={`w-full h-20 ${getRankGradient(userRanking)} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
              {/* 별 효과 - 반짝이는 애니메이션 */}
              <div className="absolute inset-0">
                <div className="absolute top-3 left-5 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-8 left-12 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '2s'}}></div>
                <div className="absolute top-5 right-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-4 left-8 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '2.5s'}}></div>
                <div className="absolute top-12 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-6 right-12 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '1.8s'}}></div>
                <div className="absolute top-6 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute bottom-8 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '2.2s'}}></div>
                <div className="absolute top-10 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
                <div className="absolute bottom-3 right-6 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute top-14 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '1.5s'}}></div>
                <div className="absolute top-4 left-2/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
                <div className="absolute bottom-10 right-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '2.8s'}}></div>
                <div className="absolute top-7 right-16 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="absolute bottom-5 left-16 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '2.3s'}}></div>
                {/* 추가 별들 */}
                <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <div className="absolute bottom-7 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '1.7s'}}></div>
                <div className="absolute top-9 right-10 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
                <div className="absolute top-15 left-20 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDuration: '2.1s'}}></div>
                <div className="absolute bottom-2 left-2/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
              </div>
              <span className="text-white font-bold text-xl relative z-10">{rankNames[userRanking]}</span>
              
              {/* 훈장 스타일 랭크 아이콘 - 박스 내부 */}
              <div className="absolute top-1 right-2 z-10">
                <div className="flex flex-col items-center">
                  {/* 리본 */}
                  <div className="relative">
                    <div className="w-1 h-5 rounded-t-sm bg-gradient-to-b from-gray-100 via-white to-gray-200"></div>
                    {/* 리본 끝 V자 모양 */}
                    <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[4px] border-l-transparent border-t-[3px] border-t-gray-300"></div>
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[4px] border-r-transparent border-t-[3px] border-t-gray-300"></div>
                  </div>
                  {/* 메달 */}
                  <div className="relative -mt-1 bg-white/90 rounded-full p-0.5 shadow-md">
                    {React.createElement(rankIcons[userRanking], { size: 20 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 진행바 섹션 */}
          <div className="space-y-2">
            {/* 진행바 */}
            <div className={`w-full h-1.5 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'} rounded-full overflow-hidden shadow-inner`}>
              <div 
                className={`h-full ${getProgressGradient(userRanking)} rounded-full transition-all duration-500`} 
                style={{ width: `${calculateRankProgress ? calculateRankProgress(totalEarnedPoints || 0) : 0}%` }}
              />
            </div>
            
            <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>
              {(() => {
                const progress = calculateRankProgress ? calculateRankProgress(totalEarnedPoints || 0) : 0;
                const nextRank = userRanking === 'bronze' ? '실버' : 
                               userRanking === 'silver' ? '골드' : 
                               userRanking === 'gold' ? '플래티넘' : '최고 등급';
                
                if (userRanking === 'platinum' && progress >= 100) {
                  return '플래티넘 최고 등급 달성!';
                }
                
                // 플래티넘 등급에서는 소수점 1자리까지 표시 (0%나 100%는 제외)
                const remaining = 100 - progress;
                if (userRanking === 'platinum') {
                  // 0% 또는 100% 근처인 경우 정수로 표시
                  if (remaining === 0 || remaining === 100 || remaining % 1 === 0) {
                    return `${nextRank}까지 ${remaining.toFixed(0)}% 남음`;
                  }
                  return `${nextRank}까지 ${remaining.toFixed(1)}% 남음`;
                }
                return `${nextRank}까지 ${remaining.toFixed(0)}% 남음`;
              })()}
            </p>
          </div>
          
          {/* 구분선 - 양 끝이 흐려지는 효과 */}
          <div className="relative h-[1px] my-3">
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                 style={{
                   background: isDarkMode 
                     ? 'linear-gradient(to right, transparent 0%, #4b5563 20%, #4b5563 80%, transparent 100%)'
                     : 'linear-gradient(to right, transparent 0%, #d1d5db 20%, #d1d5db 80%, transparent 100%)'
                 }}
            />
          </div>
          
          {/* 랭크 아이콘 표시 */}
          <div className="flex justify-between text-xs px-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`${userRanking === 'bronze' || userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum' ? '' : 'opacity-20 grayscale'}`}>
                <BronzeIcon size={28} />
              </div>
              <span className={`font-medium ${userRanking === 'bronze' || userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum' ? 'text-blue-500' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')}`}>
                브론즈
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`${userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum' ? '' : 'opacity-20 grayscale'}`}>
                <SilverIcon size={28} />
              </div>
              <span className={`font-medium ${userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum' ? 'text-cyan-500' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')}`}>
                실버
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`${userRanking === 'gold' || userRanking === 'platinum' ? '' : 'opacity-20 grayscale'}`}>
                <GoldIcon size={28} />
              </div>
              <span className={`font-medium ${userRanking === 'gold' || userRanking === 'platinum' ? 'text-yellow-500' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')}`}>
                골드
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`${userRanking === 'platinum' ? '' : 'opacity-20 grayscale'}`}>
                <PlatinumIcon size={28} />
              </div>
              <span className={`font-medium ${userRanking === 'platinum' ? 'text-pink-500' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')}`}>
                플래티넘
              </span>
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
                  setCurrentTank('silver');
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
                  setCurrentTank('gold');
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
                  setCurrentTank('platinum');
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
                  
                  // 새로운 물고기 가격 체계
                  const fishPrices = {
                    bronze: [200, 300, 400],
                    silver: [500, 600, 700],
                    gold: [1000, 1100, 1200],
                    platinum: [1500, 1600, 1700]
                  };
                  const fishPrice = fishPrices[rank][i];
                  
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
                            if (spendPoints) {
                              spendPoints(fishPrice);
                            } else {
                              setPoints(prev => prev - fishPrice);
                            }
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
                            if (spendPoints) {
                              spendPoints(deco.price);
                            } else {
                              setPoints(prev => prev - deco.price);
                            }
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
        
        {/* 테스트용 랭크 변경 */}
        <div className="mx-3 mt-8 mb-4">
          <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
            <h4 className={`text-sm font-medium ${textColor} mb-3 text-center`}>테스트용 랭크 변경</h4>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  setPoints(0); // 브론즈: 0P
                  setTotalEarnedPoints(0); // 누적 포인트도 0P
                  showToast('브론즈 랭크로 변경 (0P)', 'success');
                }}
                className={`py-2 px-3 rounded-lg ${
                  userRanking === 'bronze' 
                    ? 'bg-amber-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors text-xs font-medium`}
              >
                브론즈
              </button>
              <button
                onClick={() => {
                  setPoints(2100); // 실버: 2100P
                  setTotalEarnedPoints(2100); // 누적 포인트도 2100P
                  showToast('실버 랭크로 변경 (2100P)', 'success');
                }}
                className={`py-2 px-3 rounded-lg ${
                  userRanking === 'silver' 
                    ? 'bg-slate-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors text-xs font-medium`}
              >
                실버
              </button>
              <button
                onClick={() => {
                  setPoints(6300); // 골드: 6300P
                  setTotalEarnedPoints(6300); // 누적 포인트도 6300P
                  showToast('골드 랭크로 변경 (6300P)', 'success');
                }}
                className={`py-2 px-3 rounded-lg ${
                  userRanking === 'gold' 
                    ? 'bg-yellow-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors text-xs font-medium`}
              >
                골드
              </button>
              <button
                onClick={() => {
                  setPoints(12600); // 플래티넘: 12600P
                  setTotalEarnedPoints(12600); // 누적 포인트도 12600P
                  showToast('플래티넘 랭크로 변경 (12600P)', 'success');
                }}
                className={`py-2 px-3 rounded-lg ${
                  userRanking === 'platinum' 
                    ? 'bg-purple-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors text-xs font-medium`}
              >
                플래티넘
              </button>
            </div>
          </div>
        </div>

        {/* 테스트용 구매내역 초기화 버튼 */}
        <div className="mx-3 mt-4 mb-6">
          <button
            onClick={() => {
              // 구매 이력만 초기화 (포인트는 유지)
              setPurchasedFish([]);
              setPurchasedDecorations([]);
              setClaimedTanks([]); // 랭킹 보상 초기화
              
              // localStorage에서 구매내역만 초기화
              localStorage.setItem('purchasedFish', JSON.stringify([]));
              localStorage.setItem('purchasedDecorations', JSON.stringify([]));
              localStorage.setItem('claimedTanks', JSON.stringify([])); // 랭킹 보상 초기화
              
              showToast('구매내역 초기화 완료', 'success');
            }}
            className={`w-full py-3 px-4 rounded-xl ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
            } transition-colors flex items-center justify-center gap-2 text-sm font-medium`}
          >
            <span>🔄</span>
            <span>구매내역 초기화</span>
          </button>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center mt-2`}>
            구매 이력만 초기화합니다 (포인트는 유지)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rewards;