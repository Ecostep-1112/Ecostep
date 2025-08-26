import React from 'react';
import { FiChevronRight, FiSun, FiMoon, FiCheck } from 'react-icons/fi';
import FishIcons from '../components/FishIcons';
import DecorationIcons from '../components/DecorationIcons';
import fishData from '../data/fishData.json';
import BasicTank from '../components/tanks/BasicTank';
import SilverTank from '../components/tanks/SilverTank';
import GoldTank from '../components/tanks/GoldTank';
import PlatinumTank from '../components/tanks/PlatinumTank';

export const ThemeSettings = ({ isDarkMode, setIsDarkMode, setShowThemeSettings }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowThemeSettings(false)} className="mr-3">
          <FiChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>화면 테마</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setIsDarkMode(false)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${!isDarkMode ? 'border-blue-500' : ''}`}
        >
          <div className="flex items-center">
            <FiSun className={`w-5 h-5 mr-3 ${!isDarkMode ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${textColor}`}>라이트 모드</span>
          </div>
          {!isDarkMode && <FiCheck className="w-5 h-5 text-blue-500" />}
        </button>
        
        <button 
          onClick={() => setIsDarkMode(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${isDarkMode ? 'border-blue-500' : ''}`}
        >
          <div className="flex items-center">
            <FiMoon className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-blue-500' : 'text-gray-600'}`} />
            <span className={`text-sm ${textColor}`}>다크 모드</span>
          </div>
          {isDarkMode && <FiCheck className="w-5 h-5 text-blue-500" />}
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
          <FiChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>언어</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setLanguage('ko')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${language === 'ko' ? 'border-blue-500' : ''}`}
        >
          <span className={`text-sm ${textColor}`}>한국어</span>
          {language === 'ko' && <FiCheck className="w-5 h-5 text-blue-500" />}
        </button>
        
        <button 
          onClick={() => setLanguage('en')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${language === 'en' ? 'border-blue-500' : ''}`}
        >
          <span className={`text-sm ${textColor}`}>English</span>
          {language === 'en' && <FiCheck className="w-5 h-5 text-blue-500" />}
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
          <FiChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>알림</h2>
      </div>
      
      <div className="mx-3 mt-4">
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between`}>
          <span className={`text-sm ${textColor}`}>알림 받기</span>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full ${notifications ? 'bg-blue-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} relative transition-colors`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
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
  setIsRandomDecorations
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
          <FiChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>어항 설정</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-hide px-3 pb-24">
        <div className="mt-4">
          <h3 className={`text-sm font-medium mb-3 ${textColor}`}>어항 선택</h3>
          <div className="flex gap-3 mb-6">
            {['basic', 'silver', 'gold', 'platinum'].map((type) => {
              const isUnlocked = unlockedTanks.includes(type);
              const isSelected = currentTank === type;
              
              return (
                <button
                  key={type}
                  onClick={() => isUnlocked && setCurrentTank(type)}
                  className={`flex-1 border ${isSelected ? 'border-blue-500 bg-blue-50' : borderColor} rounded-xl p-2 ${isUnlocked ? cardBg : 'bg-gray-100 opacity-50'} ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  disabled={!isUnlocked}
                >
                  <div className={`w-full aspect-square rounded-lg mb-1 flex items-center justify-center relative overflow-hidden`}>
                    {type === 'basic' && <BasicTank isPreview={true} />}
                    {type === 'silver' && <SilverTank isPreview={true} />}
                    {type === 'gold' && <GoldTank isPreview={true} />}
                    {type === 'platinum' && <PlatinumTank isPreview={true} />}
                  </div>
                  <p className={`text-[10px] text-center ${isSelected ? 'text-blue-600 font-medium' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {type === 'basic' ? '기본' : type === 'silver' ? '실버' : type === 'gold' ? '골드' : '플래티넘'}
                  </p>
                </button>
              );
            })}
          </div>
          
          {/* 구분선 */}
          <div className={`border-t ${borderColor} my-6`}></div>

          <h3 className={`text-sm font-medium mb-3 ${textColor}`}>물고기</h3>
          <div className={`${inputBg} rounded-lg p-3 mb-3`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>물고기: {selectedFish.length}마리</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (selectedFish.length > 0) {
                      setSelectedFish(selectedFish.slice(0, -1));
                      setFishCount(Math.max(1, selectedFish.length - 1));
                    }
                  }}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center`}
                >-</button>
                <span className={`text-sm font-medium px-3 ${textColor}`}>{selectedFish.length}</span>
                <button 
                  onClick={() => {
                    if (selectedFish.length < purchasedFish.length) {
                      // 구매한 물고기 중 선택되지 않은 첫 번째 물고기 자동 추가
                      const nextFishIndex = purchasedFish.findIndex((fish, index) => !selectedFish.includes(index));
                      if (nextFishIndex !== -1) {
                        setSelectedFish([...selectedFish, nextFishIndex]);
                        setFishCount(selectedFish.length + 1);
                      }
                    }
                  }}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center`}
                >+</button>
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={isRandomFish}
                onChange={() => setIsRandomFish(!isRandomFish)}
                className="mr-2"
              />
              <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>랜덤 선택</label>
            </div>
          </div>

          {!isRandomFish && (
            <div className="mb-6">
              <h4 className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>물고기 선택 ({selectedFish.length}/{purchasedFish.length})</h4>
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
                              isSelected ? 'border-blue-500 bg-blue-50' : borderColor
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
                            <p className={`text-[10px] ${isSelected ? 'text-blue-600 font-medium' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
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

          <h3 className={`text-sm font-medium mb-3 ${textColor}`}>장식품</h3>
          <div className={`${inputBg} rounded-lg p-3 mb-3`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>장식품: {selectedDecorations.length}개</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (selectedDecorations.length > 0) {
                      setSelectedDecorations(selectedDecorations.slice(0, -1));
                    }
                  }}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center`}
                >-</button>
                <span className={`text-sm font-medium px-3 ${textColor}`}>{selectedDecorations.length}</span>
                <button 
                  onClick={() => {
                    if (selectedDecorations.length < availableDecorations.length) {
                      const nextDeco = availableDecorations.find(d => !selectedDecorations.includes(d.name));
                      if (nextDeco) setSelectedDecorations([...selectedDecorations, nextDeco.name]);
                    }
                  }}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center`}
                >+</button>
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={isRandomDecorations}
                onChange={() => setIsRandomDecorations(!isRandomDecorations)}
                className="mr-2"
              />
              <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>랜덤 선택</label>
            </div>
          </div>
          
          {!isRandomDecorations && (
            availableDecorations.length > 0 ? (
              <div className="mb-6">
                <h4 className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>장식품 선택 ({selectedDecorations.length}/{availableDecorations.length})</h4>
                {Object.entries(decorationsData).map(([rank, decorations]) => {
                  const purchasedInRank = decorations.filter(deco => purchasedDecorations.includes(deco.name));
                  if (purchasedInRank.length === 0) return null;
                  
                  return (
                    <div key={rank} className="mb-3">
                      <h5 className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
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
                                isSelected ? 'border-blue-500 bg-blue-50' : borderColor
                              } ${cardBg} flex flex-col items-center justify-center h-[85px] p-2`}
                              disabled={!isSelected && selectedDecorations.length >= availableDecorations.length}
                            >
                              {/* 장식품 아이콘 */}
                              <div className="flex items-center justify-center mb-1">
                                <div className="w-9 h-9">
                                  {DecoIcon && React.createElement(DecoIcon)}
                                </div>
                              </div>
                              
                              {/* 장식품 이름 */}
                              <p className={`text-[10px] ${isSelected ? 'text-blue-600 font-medium' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
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
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  보상 탭에서 장식품을 구매해주세요
                </p>
              </div>
            )
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
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-medium"
        >
          적용하기
        </button>
      </div>
    </div>
  );
};