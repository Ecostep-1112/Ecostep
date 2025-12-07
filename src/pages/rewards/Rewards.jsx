import React, { useState, useEffect, memo } from 'react';
import { Lock } from 'lucide-react';
import FishIcons from '../../components/FishIcons';
import DecorationIcons from '../../components/DecorationIcons';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../../components/RankIcons';
import SilverTank from '../../components/tanks/SilverTank';
import GoldTank from '../../components/tanks/GoldTank';
import PlatinumTank from '../../components/tanks/PlatinumTank';
import { purchaseItem } from '../../lib/database';
import { supabase } from '../../lib/supabase';
import { useData } from '../../services/DataContext';

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
  spendPoints,
  isActive = true
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  // DataContext에서 상점 데이터 가져오기
  const { fishData, decorationsData, refreshStoreData, purchasedFish: contextPurchasedFish, purchasedDecorations: contextPurchasedDecorations } = useData();

  // 상점 데이터와 구매 목록 동기화
  useEffect(() => {
    const loadData = async () => {
      // fishData가 비어있으면 상점 데이터 로드 (구매 목록은 App.jsx의 preloadAllData에서 로드됨)
      if (Object.values(fishData).every(arr => arr.length === 0)) {
        await refreshStoreData();
      }
    };
    loadData();
  }, []);

  // DataContext의 구매 목록과 props의 구매 목록 동기화 체크
  useEffect(() => {
    if (contextPurchasedFish.length > 0 && purchasedFish.length === 0) {
    }
  }, [contextPurchasedFish, purchasedFish]);

  // 랭크별 색상 정의 - 조건부 렌더링을 위한 함수
  const getRankGradient = (rank) => {
    switch(rank) {
      case 'bronze':
        return 'bg-gradient-to-br from-cyan-500 to-blue-600';
      case 'silver':
        return 'bg-gradient-to-br from-cyan-400 to-teal-500';
      case 'gold':
        return 'bg-gradient-to-br from-yellow-200 to-yellow-400';
      case 'platinum':
        return 'bg-gradient-to-br from-purple-400 to-indigo-500';
      default:
        return 'bg-gradient-to-br from-yellow-200 to-yellow-400';
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
        return 'bg-gradient-to-r from-yellow-200 to-yellow-400';
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
    gold: '#fcd34d',
    platinum: '#ec4899'
  };

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 현재 랭크 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-6`}>
          <h3 className={`text-center text-sm font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>현재 랭크</h3>
          
          {/* 랭크 표시 직사각형 */}
          <div className="relative mb-4">
            <div className={`w-full h-20 ${getRankGradient(userRanking)} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
              {/* 별 효과 - 반짝이는 애니메이션 (최적화) */}
              <div className="absolute inset-0">
                {/* 애니메이션 별들 - 5개만 - isActive일 때만 애니메이션 */}
                <div className={`absolute top-3 left-5 w-0.5 h-0.5 bg-white rounded-full ${isActive ? 'animate-pulse' : ''}`}></div>
                <div className={`absolute top-5 right-8 w-1 h-1 bg-white rounded-full ${isActive ? 'animate-pulse' : ''}`} style={{animationDelay: isActive ? '0.5s' : '0s'}}></div>
                <div className={`absolute top-6 left-1/3 w-0.5 h-0.5 bg-white rounded-full ${isActive ? 'animate-pulse' : ''}`} style={{animationDelay: isActive ? '0.3s' : '0s'}}></div>
                <div className={`absolute bottom-3 right-6 w-1 h-1 bg-white rounded-full ${isActive ? 'animate-pulse' : ''}`} style={{animationDelay: isActive ? '0.2s' : '0s'}}></div>
                <div className={`absolute top-4 left-2/3 w-0.5 h-0.5 bg-white rounded-full ${isActive ? 'animate-pulse' : ''}`} style={{animationDelay: isActive ? '0.8s' : '0s'}}></div>

                {/* 정적 별들 - 나머지 */}
                <div className="absolute top-8 left-12 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
                <div className="absolute bottom-4 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
                <div className="absolute top-12 left-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute bottom-6 right-12 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
                <div className="absolute bottom-8 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
                <div className="absolute top-10 right-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-14 right-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
                <div className="absolute bottom-10 right-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
                <div className="absolute top-7 right-16 w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
                <div className="absolute bottom-5 left-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
                <div className="absolute bottom-7 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
                <div className="absolute top-9 right-10 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-15 left-20 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
                <div className="absolute bottom-2 left-2/3 w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
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
              {userRanking === 'bronze' || userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum' ? (
                <span className="font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  브론즈
                </span>
              ) : (
                <span className={`font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  브론즈
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`${userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum' ? '' : 'opacity-20 grayscale'}`}>
                <SilverIcon size={28} />
              </div>
              {userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum' ? (
                <span className="font-medium bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 bg-clip-text text-transparent">
                  실버
                </span>
              ) : (
                <span className={`font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  실버
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`${userRanking === 'gold' || userRanking === 'platinum' ? '' : 'opacity-20 grayscale'}`}>
                <GoldIcon size={28} />
              </div>
              {userRanking === 'gold' || userRanking === 'platinum' ? (
                <span className="font-medium bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  골드
                </span>
              ) : (
                <span className={`font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  골드
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`${userRanking === 'platinum' ? '' : 'opacity-20 grayscale'}`}>
                <PlatinumIcon size={28} />
              </div>
              {userRanking === 'platinum' ? (
                <span className="font-medium bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  플래티넘
                </span>
              ) : (
                <span className={`font-medium ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  플래티넘
                </span>
              )}
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
              className={`${claimedTanks.includes('silver') ? 'bg-green-50 border-green-300' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? `${cardBg} hover:bg-cyan-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('silver') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
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
                  {claimedTanks.includes('silver') ? (
                    <p className="text-xs text-green-500 font-medium text-center">수령 완료</p>
                  ) : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? (
                    <p className="text-xs font-medium text-center bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">수령 가능</p>
                  ) : (
                    <p className="text-xs text-gray-400 text-center">실버 도달</p>
                  )}
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'silver' && userRanking !== 'gold' && userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600 opacity-80" />
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
              className={`${claimedTanks.includes('gold') ? 'bg-green-50 border-green-300' : (userRanking === 'gold' || userRanking === 'platinum') ? `${cardBg} hover:bg-cyan-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('gold') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
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
                  {claimedTanks.includes('gold') ? (
                    <p className="text-xs text-green-500 font-medium text-center">수령 완료</p>
                  ) : (userRanking === 'gold' || userRanking === 'platinum') ? (
                    <p className="text-xs font-medium text-center bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">수령 가능</p>
                  ) : (
                    <p className="text-xs text-gray-400 text-center">골드 도달</p>
                  )}
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'gold' && userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600 opacity-80" />
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
              className={`${claimedTanks.includes('platinum') ? 'bg-green-50 border-green-300' : userRanking === 'platinum' ? `${cardBg} hover:bg-cyan-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('platinum') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
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
                  {claimedTanks.includes('platinum') ? (
                    <p className="text-xs text-green-500 font-medium text-center">수령 완료</p>
                  ) : userRanking === 'platinum' ? (
                    <p className="text-xs font-medium text-center bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">수령 가능</p>
                  ) : (
                    <p className="text-xs text-gray-400 text-center">플래티넘 도닼</p>
                  )}
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600 opacity-80" />
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
                      onClick={async () => {
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

                            // Supabase에 저장 (item_id 사용)
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                              const { error } = await purchaseItem(user.id, fish.id || fish.name);
                              if (error) {
                                console.error('구매 저장 실패:', error);
                              }
                            }

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
                        {!isLocked && (() => {
                          const FishIcon = FishIcons[fish.name];  // item_name으로 직접 접근
                          // 특정 물고기는 더 크게 표시 (item_name 기준)
                          const iconSize = ['네온테트라', '아피스토그라마', '킬리피쉬'].includes(fish.name) ? 48 : 36;
                          return FishIcon ? <FishIcon size={iconSize} isMoving={true} /> : null;
                        })()}
                      </div>
                      
                      {/* 텍스트 영역 - 중앙 정렬 */}
                      <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                        {/* 물고기 이름 - 더 크게 */}
                        <p className={`text-[11px] leading-tight ${isLocked ? 'text-gray-400' : isPurchased ? 'text-green-600' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center font-medium`}>
                          {fish.name}
                        </p>
                      </div>
                      
                      {/* 가격/구매완료 - 하단 고정 */}
                      <div className="h-[20px] flex items-center justify-center w-full">
                        {!isLocked && (
                          isPurchased ? (
                            <p className="text-xs text-green-500 font-medium text-center">
                              구매완료
                            </p>
                          ) : (
                            <p className="text-xs font-medium text-center bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                              {fishPrice}P
                            </p>
                          )
                        )}
                      </div>
                      
                      {/* 잠금 오버레이와 자물쇠 */}
                      {isLocked && (
                        <>
                          <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-gray-600 opacity-80" />
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
                      onClick={async () => {
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

                            // Supabase에 저장 (item_id 사용)
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                              const { error } = await purchaseItem(user.id, deco.id || deco.name);
                              if (error) {
                                console.error('구매 저장 실패:', error);
                              }
                            }

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
                        <div className="h-[45px] w-full flex items-center justify-center">
                          {!isLocked && DecorationIcons[deco.name] && React.createElement(DecorationIcons[deco.name])}
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
                            isPurchased ? (
                              <p className="text-xs text-green-500 font-medium text-center">
                                구매완료
                              </p>
                            ) : (
                              <p className="text-xs font-medium text-center bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                {deco.price}P
                              </p>
                            )
                          )}
                        </div>
                      </div>
                      
                      {/* 잠금 오버레이와 자물쇠 */}
                      {isLocked && (
                        <>
                          <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-gray-600 opacity-80" />
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
      </div>
    </div>
  );
};

export default memo(Rewards);