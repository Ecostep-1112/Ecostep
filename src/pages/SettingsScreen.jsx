import React from 'react';
import { ChevronRight } from 'lucide-react';

const SettingsScreen = ({ 
  isDarkMode, 
  setShowSettings, 
  setShowProfile, 
  setShowLanguageSettings, 
  setShowNotificationSettings, 
  setShowThemeSettings, 
  language, 
  notifications 
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>설정</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        {/* 프로필 섹션 */}
        <button 
          onClick={() => setShowProfile(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center`}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
            송일
          </div>
          <div className="flex-1 text-left">
            <p className={`text-sm font-medium ${textColor}`}>송일님의 정보</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>내 정보</p>
          </div>
          <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        </button>

        <button 
          onClick={() => setShowLanguageSettings(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex justify-between items-center`}
        >
          <span className={`text-sm ${textColor}`}>언어</span>
          <div className="flex items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
              {language === 'ko' ? '한국어' : 'English'}
            </span>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </button>
        
        <button 
          onClick={() => setShowNotificationSettings(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex justify-between items-center`}
        >
          <span className={`text-sm ${textColor}`}>알림</span>
          <div className="flex items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
              {notifications ? '켜짐' : '꺼짐'}
            </span>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </button>
        
        <button 
          onClick={() => setShowThemeSettings(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex justify-between items-center`}
        >
          <span className={`text-sm ${textColor}`}>화면 테마</span>
          <div className="flex items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
              {isDarkMode ? '다크' : '라이트'}
            </span>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;