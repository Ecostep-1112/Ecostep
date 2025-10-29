import React from 'react';
import { ChevronRight, Sun, Moon, Check } from 'lucide-react';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../../components/RankIcons';
import FishIcons from '../../components/FishIcons';
import DecorationIcons from '../../components/DecorationIcons';
import fishData from '../../data/fishData.json';
import BasicTank from '../../components/tanks/BasicTank';
import SilverTank from '../../components/tanks/SilverTank';
import GoldTank from '../../components/tanks/GoldTank';
import PlatinumTank from '../../components/tanks/PlatinumTank';

export const RankThemeSettings = ({ isDarkMode, userRanking, setUserRanking, setShowRankThemeSettings, currentUserRank, showToast }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  const ranks = [
    { id: 'basic', name: '기본', subName: '(다크/화이트)', icon: null, color: isDarkMode ? '#e5e7eb' : '#374151', level: 0 },
    { id: 'bronze', name: '브론즈', subName: '(청록)', icon: BronzeIcon, color: '#06b6d4', level: 1 },
    { id: 'silver', name: '실버', subName: '(민트)', icon: SilverIcon, color: '#14b8a6', level: 2 },
    { id: 'gold', name: '골드', subName: '(황금)', icon: GoldIcon, color: '#facc15', level: 3 },
    { id: 'platinum', name: '플래티넘', subName: '(보라)', icon: PlatinumIcon, color: '#c084fc', level: 4 }
  ];
  
  const currentRankLevel = ranks.find(r => r.id === currentUserRank)?.level || 1;

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowRankThemeSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[17px] font-medium ${textColor}`}>색상</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        {ranks.map((rank) => {
          const RankIcon = rank.icon;
          const isSelected = userRanking === rank.id;
          const isLocked = rank.level > currentRankLevel;
          
          return (
            <button 
              key={rank.id}
              onClick={() => {
                if (isLocked) {
                  const requiredRank = ranks.find(r => r.level === rank.level - 1)?.name;
                  if (showToast) {
                    showToast(`${requiredRank || '이전'} 랭크에서 잠금해제`, 'warning');
                  }
                } else {
                  setUserRanking(rank.id);
                }
              }}
              className={`w-full rounded-xl p-3 flex items-center justify-between transition-all ${isLocked ? 'opacity-50' : ''} relative overflow-hidden`}
              style={isSelected && !isLocked ? { 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: rank.color,
                backgroundColor: `${rank.color}15`
              } : {
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
              }}
            >
              {/* 블러 효과 오버레이 */}
              {isLocked && (
                <div className="absolute inset-0 backdrop-blur-sm bg-black/10 z-10" />
              )}
              
              <div className="flex items-center relative z-0">
                {RankIcon ? (
                  <RankIcon className={`mr-3 ${isLocked ? 'opacity-50' : ''}`} />
                ) : (
                  <div className={`w-[24px] h-[24px] mr-3 rounded-full flex items-center justify-center ${isLocked ? 'opacity-50' : ''}`} 
                    style={{ 
                      backgroundColor: isDarkMode ? '#ffffff' : '#1f2937'
                    }}
                  >
                    <div className="w-[16px] h-[16px] rounded-full" 
                      style={{ 
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        backgroundColor: 'transparent'
                      }} 
                    />
                  </div>
                )}
                <div className="flex items-center">
                  <span
                    className={`text-[15px] ${isLocked ? 'opacity-50' : ''}`}
                    style={{ color: isSelected && !isLocked ? rank.color : isDarkMode ? '#ffffff' : '#1f2937' }}
                  >{rank.name}</span>
                  <span
                    className={`text-[13px] ml-1 ${isLocked ? 'opacity-50' : ''}`}
                    style={{ color: isSelected && !isLocked ? rank.color : isDarkMode ? '#9ca3af' : '#6b7280' }}
                  >{rank.subName}</span>
                </div>
              </div>
              
              <div className="relative z-0">
                {isLocked ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  isSelected && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id={`checkGradient-${rank.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          {rank.id === 'basic' ? (
                            <>
                              <stop offset="0%" stopColor={isDarkMode ? '#9ca3af' : '#6b7280'} />
                              <stop offset="50%" stopColor={isDarkMode ? '#e5e7eb' : '#374151'} />
                              <stop offset="100%" stopColor={isDarkMode ? '#f3f4f6' : '#1f2937'} />
                            </>
                          ) : rank.id === 'bronze' ? (
                            <>
                              <stop offset="0%" stopColor="#06b6d4" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </>
                          ) : rank.id === 'silver' ? (
                            <>
                              <stop offset="0%" stopColor="#14b8a6" />
                              <stop offset="50%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#059669" />
                            </>
                          ) : rank.id === 'gold' ? (
                            <>
                              <stop offset="0%" stopColor="#facc15" />
                              <stop offset="50%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </>
                          ) : (
                            <>
                              <stop offset="0%" stopColor="#c084fc" />
                              <stop offset="50%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#9333ea" />
                            </>
                          )}
                        </linearGradient>
                      </defs>
                      <path 
                        d="M5 13l4 4L19 7" 
                        stroke={`url(#checkGradient-${rank.id})`} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  )
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ThemeSettings = ({ isDarkMode, setIsDarkMode, setShowThemeSettings }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowThemeSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[17px] font-medium ${textColor}`}>화면</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setIsDarkMode(false)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-3 flex items-center justify-between ${!isDarkMode ? 'border-cyan-500' : ''}`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={!isDarkMode ? "#06b6d4" : "#9ca3af"} />
                  <stop offset="50%" stopColor={!isDarkMode ? "#3b82f6" : "#9ca3af"} />
                  <stop offset="100%" stopColor={!isDarkMode ? "#2563eb" : "#9ca3af"} />
                </linearGradient>
                <radialGradient id="sunFillGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="12" cy="12" r="4" fill="url(#sunFillGradient)" />
              <circle cx="12" cy="12" r="4" stroke="url(#sunGradient)" strokeWidth="1.5" fill="none" />
              <path d="M12 1v4M12 19v4M23 12h-4M5 12H1M20.5 3.5l-3 3M6.5 17.5l-3 3M20.5 20.5l-3-3M6.5 6.5l-3-3" stroke="url(#sunGradient)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className={`text-[15px] ${textColor}`}>라이트 모드</span>
          </div>
          {!isDarkMode && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="checkGradientMode" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path 
                d="M5 13l4 4L19 7" 
                stroke="url(#checkGradientMode)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        
        <button 
          onClick={() => setIsDarkMode(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-3 flex items-center justify-between ${isDarkMode ? 'border-cyan-500' : ''}`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDarkMode ? "#06b6d4" : "#9ca3af"} />
                  <stop offset="50%" stopColor={isDarkMode ? "#3b82f6" : "#9ca3af"} />
                  <stop offset="100%" stopColor={isDarkMode ? "#2563eb" : "#9ca3af"} />
                </linearGradient>
              </defs>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="url(#moonGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <span className={`text-[15px] ${textColor}`}>다크 모드</span>
          </div>
          {isDarkMode && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="checkGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path 
                d="M5 13l4 4L19 7" 
                stroke="url(#checkGradientDark)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export const LanguageSettings = ({ isDarkMode, language, setLanguage, setShowLanguageSettings }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowLanguageSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[17px] font-medium ${textColor}`}>언어</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setLanguage('ko')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-3 flex items-center justify-between ${language === 'ko' ? 'border-cyan-500' : ''}`}
        >
          <span className={`text-[15px] ${textColor}`}>한국어</span>
          {language === 'ko' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="checkGradientKo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path 
                d="M5 13l4 4L19 7" 
                stroke="url(#checkGradientKo)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        
        <button 
          onClick={() => setLanguage('en')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-3 flex items-center justify-between ${language === 'en' ? 'border-cyan-500' : ''}`}
        >
          <span className={`text-[15px] ${textColor}`}>English</span>
          {language === 'en' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="checkGradientEn" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path 
                d="M5 13l4 4L19 7" 
                stroke="url(#checkGradientEn)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export const NotificationSettings = ({ isDarkMode, notifications, setNotifications, setShowNotificationSettings }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowNotificationSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[17px] font-medium ${textColor}`}>알림</h2>
      </div>
      
      <div className="mx-3 mt-4">
        <div className={`${cardBg} border ${borderColor} rounded-xl p-3 flex items-center justify-between`}>
          <span className={`text-[15px] ${textColor}`}>알림 받기</span>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full relative transition-all`}
            style={{
              background: notifications 
                ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)'
                : isDarkMode ? '#4b5563' : '#d1d5db'
            }}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export const LocationSettings = ({ isDarkMode, locationSharing, setLocationSharing, setShowLocationSettings }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowLocationSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[17px] font-medium ${textColor}`}>위치</h2>
      </div>
      
      <div className="mx-3 mt-4">
        <div className={`${cardBg} border ${borderColor} rounded-xl p-3 flex items-center justify-between`}>
          <span className={`text-[15px] ${textColor}`}>위치 공유 동의</span>
          <button 
            onClick={() => setLocationSharing(!locationSharing)}
            className={`w-11 h-6 rounded-full relative transition-all`}
            style={{
              background: locationSharing 
                ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)'
                : isDarkMode ? '#4b5563' : '#d1d5db'
            }}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${locationSharing ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export const AquariumSettings = ({ 
  isDarkMode, 
  setShowAquariumSettings, 
  fishCount, 
  setFishCount, 
  isRandomFish, 
  setIsRandomFish, 
  selectedFish, 
  setSelectedFish, 
  selectedDecorations, 
  setSelectedDecorations, 
  purchasedFish,
  currentTank,
  setCurrentTank,
  unlockedTanks,
  tankName,
  setTankName,
  purchasedDecorations,
  fishData,
  decorationsData,
  isRandomDecorations,
  setIsRandomDecorations,
  claimedTanks
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  // decorationsData에서 구매한 장식품만 필터링
  const availableDecorations = Object.values(decorationsData).flat().filter(deco => 
    purchasedDecorations.includes(deco.name)
  );

  return (
    <div className={`flex-1 ${bgColor} overflow-hidden flex flex-col relative`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowAquariumSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[17px] font-medium ${textColor}`}>어항 설정</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide px-3 pb-24">
        <div className="mt-4">
          <h3 className={`text-[15px] font-medium mb-3 ${textColor}`}>어항 선택</h3>
          <div className="flex gap-3 mb-6">
            {['basic', 'silver', 'gold', 'platinum'].map((type) => {
              const isUnlocked = type === 'basic' || claimedTanks.includes(type);
              const isSelected = currentTank === type;
              
              return (
                <button
                  key={type}
                  onClick={() => isUnlocked && setCurrentTank(type)}
                  className={`flex-1 border ${isSelected ? 'border-cyan-500 bg-cyan-50' : borderColor} rounded-xl p-2 ${isUnlocked ? cardBg : 'bg-gray-100 opacity-50'} ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  disabled={!isUnlocked}
                >
                  <div className={`w-full aspect-square rounded-lg mb-1 flex items-center justify-center relative overflow-hidden`}>
                    {type === 'basic' && <BasicTank isPreview={true} />}
                    {type === 'silver' && <SilverTank isPreview={true} />}
                    {type === 'gold' && <GoldTank isPreview={true} />}
                    {type === 'platinum' && <PlatinumTank isPreview={true} />}
                  </div>
                  <p className={`text-[10px] text-center ${isSelected ? 'text-cyan-600 font-medium' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {type === 'basic' ? '기본' : type === 'silver' ? '실버' : type === 'gold' ? '골드' : '플래티넘'}
                  </p>
                  {!isUnlocked && (
                    <p className={`text-[8px] text-center ${isDarkMode ? 'text-red-400' : 'text-red-500'} mt-1`}>
                      랭킹 보상 필요
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* 구분선 */}
          <div className={`border-t ${borderColor} my-6`}></div>

          <h3 className={`text-[15px] font-medium mb-3 ${textColor}`}>물고기</h3>
          <div className={`${inputBg} rounded-lg p-3 mb-3`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[15px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>물고기: {isRandomFish ? fishCount : selectedFish.length}마리</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isRandomFish) {
                      if (fishCount > 0) {
                        setFishCount(fishCount - 1);
                      }
                    } else {
                      if (selectedFish.length > 0) {
                        setSelectedFish(selectedFish.slice(0, -1));
                        setFishCount(Math.max(0, selectedFish.length - 1));
                      }
                    }
                  }}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center ${textColor}`}
                >-</button>
                <span className={`text-[15px] font-medium px-3 ${textColor}`}>{isRandomFish ? fishCount : selectedFish.length}</span>
                <button
                  onClick={() => {
                    if (isRandomFish) {
                      if (fishCount < purchasedFish.length) {
                        setFishCount(fishCount + 1);
                      }
                    } else {
                      if (selectedFish.length < purchasedFish.length) {
                        // 구매한 물고기 중 선택되지 않은 첫 번째 물고기 자동 추가
                        const nextFishIndex = purchasedFish.findIndex((fish, index) => !selectedFish.includes(index));
                        if (nextFishIndex !== -1) {
                          setSelectedFish([...selectedFish, nextFishIndex]);
                          setFishCount(selectedFish.length + 1);
                        }
                      }
                    }
                  }}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center ${textColor}`}
                >+</button>
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  const newIsRandomFish = !isRandomFish;
                  setIsRandomFish(newIsRandomFish);

                  // 랜덤 선택 해제 시 코리도라스만 선택
                  if (!newIsRandomFish) {
                    const coridorasIndex = purchasedFish.indexOf('코리도라스');
                    if (coridorasIndex !== -1) {
                      setSelectedFish([coridorasIndex]);
                      setFishCount(1);
                    } else if (purchasedFish.length > 0) {
                      // 코리도라스가 없으면 첫 번째 물고기 선택
                      setSelectedFish([0]);
                      setFishCount(1);
                    }
                  }
                }}
                className={`flex items-center border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg px-3 py-1.5 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
              >
                <div className={`w-4 h-4 mr-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded flex items-center justify-center`}>
                  {isRandomFish && (
                    <svg className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-[15px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>랜덤 선택</span>
              </button>
            </div>
          </div>

          {!isRandomFish && (
            <div className="mb-6">
              <h4 className={`text-[13px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>물고기 선택 ({selectedFish.length}/{purchasedFish.length})</h4>
              {Object.entries(fishData).map(([rank, fishes]) => {
                const purchasedInRank = fishes.filter(fish => purchasedFish.includes(fish.name));
                if (purchasedInRank.length === 0) return null;
                
                return (
                  <div key={rank} className="mb-3">
                    <h5 className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                      {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
                    </h5>
                    <div className="grid grid-cols-3 gap-2">
                      {purchasedInRank.map((fish) => {
                        const isSelected = selectedFish.includes(purchasedFish.indexOf(fish.name));
                        return (
                          <button
                            key={fish.name}
                            onClick={() => {
                              const fishIndex = purchasedFish.indexOf(fish.name);
                              if (isSelected) {
                                setSelectedFish(selectedFish.filter(f => f !== fishIndex));
                                setFishCount(Math.max(1, selectedFish.length - 1));
                              } else if (selectedFish.length < purchasedFish.length) {
                                setSelectedFish([...selectedFish, fishIndex]);
                                setFishCount(selectedFish.length + 1);
                              }
                            }}
                            className={`rounded-lg border ${
                              isSelected ? 'border-cyan-500 bg-cyan-50' : borderColor
                            } ${cardBg} flex flex-col items-center justify-center h-[85px] p-2`}
                            disabled={!isSelected && selectedFish.length >= purchasedFish.length}
                          >
                            {/* 물고기 아이콘 */}
                            <div className="flex items-center justify-center mb-1">
                              {(() => {
                                const FishIcon = FishIcons[fish.name.replace(' ', '')];
                                return FishIcon ? <FishIcon size={32} /> : null;
                              })()}
                            </div>
                            
                            {/* 물고기 이름 */}
                            <p className={`text-[10px] ${isSelected ? 'text-cyan-600 font-medium' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
                              {fish.name}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* 구분선 */}
          <div className={`border-t ${borderColor} my-6`}></div>

          <h3 className={`text-[15px] font-medium mb-3 ${textColor}`}>장식품</h3>
          <div className={`${inputBg} rounded-lg p-3 mb-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-[15px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>장식품: {selectedDecorations.length}개</span>
              <button
                onClick={() => setSelectedDecorations([])}
                className={`flex items-center border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg px-3 py-1.5 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
              >
                <div className={`w-4 h-4 mr-2 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded flex items-center justify-center`}>
                  {selectedDecorations.length === 0 && (
                    <svg className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-[15px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>장식품 없애기</span>
              </button>
            </div>
          </div>

          {availableDecorations.length > 0 ? (
              <div className="mb-6">
                <h4 className={`text-[13px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>장식품 선택 ({selectedDecorations.length}/{availableDecorations.length})</h4>
                {Object.entries(decorationsData).map(([rank, decorations]) => {
                  const purchasedInRank = decorations.filter(deco => purchasedDecorations.includes(deco.name));
                  if (purchasedInRank.length === 0) return null;
                  
                  return (
                    <div key={rank} className="mb-3">
                      <h5 className={`text-[13px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                        {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
                      </h5>
                      <div className="grid grid-cols-3 gap-2">
                        {purchasedInRank.map((deco) => {
                          const isSelected = selectedDecorations.includes(deco.name);
                          const DecoIcon = DecorationIcons[deco.name];
                          
                          return (
                            <button
                              key={deco.name}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedDecorations(selectedDecorations.filter(d => d !== deco.name));
                                } else if (selectedDecorations.length < availableDecorations.length) {
                                  setSelectedDecorations([...selectedDecorations, deco.name]);
                                }
                              }}
                              className={`rounded-lg border ${
                                isSelected ? 'border-cyan-500 bg-cyan-50' : borderColor
                              } ${cardBg} flex flex-col items-center justify-center h-[85px] p-2`}
                              disabled={!isSelected && selectedDecorations.length >= availableDecorations.length}
                            >
                              {/* 장식품 아이콘 */}
                              <div className="h-[45px] w-full flex items-center justify-center mb-1">
                                {DecoIcon && React.createElement(DecoIcon)}
                              </div>
                              
                              {/* 장식품 이름 */}
                              <p className={`text-[10px] ${isSelected ? 'text-cyan-600 font-medium' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
                                {deco.name}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`${inputBg} rounded-lg p-4 mb-6 text-center`}>
                <p className={`text-[15px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  보상 탭에서 장식품을 구매해주세요
                </p>
              </div>
            )}
        </div>
      </div>
      
      {/* 하단 고정 적용하기 버튼 */}
      <div className={`absolute bottom-0 left-0 right-0 ${bgColor} border-t ${borderColor} p-4`}>
        <button 
          onClick={() => {
            // 설정 저장
            setShowAquariumSettings(false);
          }}
          className={`w-full py-2.5 rounded-lg text-[15px] font-medium text-white transition-all hover:opacity-90`}
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)'
          }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
};