import React from 'react';
import { ChevronRight, Sun, Moon, Check } from 'lucide-react';
import FishIcons from '../components/FishIcons';
import fishData from '../data/fishData.json';

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
        <h2 className={`text-base font-medium ${textColor}`}>화면 테마</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setIsDarkMode(false)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${!isDarkMode ? 'border-blue-500' : ''}`}
        >
          <div className="flex items-center">
            <Sun className={`w-5 h-5 mr-3 ${!isDarkMode ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${textColor}`}>라이트 모드</span>
          </div>
          {!isDarkMode && <Check className="w-5 h-5 text-blue-500" />}
        </button>
        
        <button 
          onClick={() => setIsDarkMode(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${isDarkMode ? 'border-blue-500' : ''}`}
        >
          <div className="flex items-center">
            <Moon className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-blue-500' : 'text-gray-600'}`} />
            <span className={`text-sm ${textColor}`}>다크 모드</span>
          </div>
          {isDarkMode && <Check className="w-5 h-5 text-blue-500" />}
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
        <h2 className={`text-base font-medium ${textColor}`}>언어</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setLanguage('ko')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${language === 'ko' ? 'border-blue-500' : ''}`}
        >
          <span className={`text-sm ${textColor}`}>한국어</span>
          {language === 'ko' && <Check className="w-5 h-5 text-blue-500" />}
        </button>
        
        <button 
          onClick={() => setLanguage('en')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${language === 'en' ? 'border-blue-500' : ''}`}
        >
          <span className={`text-sm ${textColor}`}>English</span>
          {language === 'en' && <Check className="w-5 h-5 text-blue-500" />}
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
  purchasedFish 
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  const decorations = ['해초', '산호', '성', '돌', '조개', '해마상'];

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowAquariumSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>어항 설정</h2>
      </div>
      
      <div className="mx-3 mt-4">
        <h3 className={`text-sm font-medium mb-3 ${textColor}`}>어항 선택</h3>
        <div className="flex gap-3 mb-6">
          {['실버', '골드', '플래티넘'].map((type) => (
            <button
              key={type}
              className={`flex-1 border ${borderColor} rounded-xl p-3 ${cardBg}`}
            >
              <div className={`w-full aspect-square ${inputBg} rounded-lg mb-2`}></div>
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{type}</p>
            </button>
          ))}
        </div>

        <h3 className={`text-sm font-medium mb-3 ${textColor}`}>물고기 설정</h3>
        <div className={`${inputBg} rounded-lg p-3 mb-3`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>물고기 수: {fishCount}마리</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFishCount(Math.max(1, fishCount - 1))}
                className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center`}
              >-</button>
              <span className={`text-sm font-medium px-3 ${textColor}`}>{fishCount}</span>
              <button 
                onClick={() => setFishCount(Math.min(purchasedFish.length, fishCount + 1))}
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
            <h4 className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>물고기 선택 ({selectedFish.length}/{fishCount})</h4>
            {Object.entries(fishData).map(([rank, fishes]) => {
              const purchasedInRank = fishes.filter(fish => purchasedFish.includes(fish.name));
              if (purchasedInRank.length === 0) return null;
              
              return (
                <div key={rank} className="mb-3">
                  <h5 className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                    {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {purchasedInRank.map((fish) => (
                      <button
                        key={fish.name}
                        onClick={() => {
                          const fishIndex = purchasedFish.indexOf(fish.name);
                          if (selectedFish.includes(fishIndex)) {
                            setSelectedFish(selectedFish.filter(f => f !== fishIndex));
                          } else if (selectedFish.length < fishCount) {
                            setSelectedFish([...selectedFish, fishIndex]);
                          }
                        }}
                        className={`p-2 rounded-lg border ${
                          selectedFish.includes(purchasedFish.indexOf(fish.name)) ? 'border-blue-500 bg-blue-50' : borderColor
                        } ${cardBg}`}
                        disabled={!selectedFish.includes(purchasedFish.indexOf(fish.name)) && selectedFish.length >= fishCount}
                      >
                        <div className="flex justify-center">
                          {(() => {
                            const FishIcon = FishIcons[fish.name.replace(' ', '')];
                            return FishIcon ? <FishIcon size={20} /> : null;
                          })()}
                        </div>
                        <p className={`text-[10px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{fish.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h3 className={`text-sm font-medium mb-3 ${textColor}`}>어항 꾸미기</h3>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {decorations.map((deco, i) => (
            <button
              key={i}
              onClick={() => {
                if (selectedDecorations.includes(i)) {
                  setSelectedDecorations(selectedDecorations.filter(d => d !== i));
                } else {
                  setSelectedDecorations([...selectedDecorations, i]);
                }
              }}
              className={`p-3 rounded-lg border ${
                selectedDecorations.includes(i) ? 'border-blue-500 bg-blue-50' : borderColor
              } ${cardBg}`}
            >
              <div className="text-2xl mb-1">
                {deco === '해초' ? '🌿' : deco === '산호' ? '🪸' : deco === '성' ? '🏛️' : deco === '돌' ? '🪨' : deco === '조개' ? '🐚' : '🌊'}
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{deco}</p>
            </button>
          ))}
        </div>

        <button className="w-full bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium">
          적용하기
        </button>
      </div>
    </div>
  );
};