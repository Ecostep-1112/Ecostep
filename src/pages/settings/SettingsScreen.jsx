import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const SettingsScreen = ({ 
  isDarkMode, 
  setShowSettings, 
  setShowProfile, 
  setShowLanguageSettings, 
  setShowNotificationSettings, 
  setShowLocationSettings,
  setShowThemeSettings,
  setShowRankThemeSettings,
  userRanking, 
  language, 
  notifications,
  locationSharing,
  userProfile,
  onLogout
}) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  
  // 프로필 이미지는 userProfile에서 가져옴 (DB에서 로드됨)
  const profileImage = userProfile?.profileImage || null;

  return (
    <div className={`flex-1 ${bgColor} relative flex flex-col`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[18px] font-medium ${textColor}`}>설정</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="mx-3 mt-4 space-y-4 pb-24">
          {/* 프로필 섹션 */}
          <button 
            onClick={() => setShowProfile(true)}
            className={`w-full ${cardBg} border ${borderColor} rounded-xl p-3 flex items-center`}
          >
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center mr-3 overflow-hidden`}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className={`font-medium text-[15px] ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                  {userProfile?.userId?.charAt(0)?.toUpperCase() || userProfile?.name?.charAt(0) || 'E'}
                </span>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className={`text-[16px] font-medium ${textColor}`}>{userProfile?.name || 'Eco User'}</p>
              {userProfile?.userId && (
                <p className={`text-[12px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{userProfile.userId}</p>
              )}
            </div>
            <div className="flex items-center">
              <span className={`text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                내 정보
              </span>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
          </button>

          {/* 설정 섹션 - 하나의 박스로 통합 */}
          <div className={`${cardBg} border ${borderColor} rounded-xl overflow-hidden`}>
            <button
              onClick={() => setShowLanguageSettings(true)}
              className={`w-full p-3 flex justify-between items-center`}
            >
              <span className={`text-[16px] ${textColor}`}>언어</span>
              <div className="flex items-center">
                <span className={`text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                  {language === 'ko' ? '한국어' : 'English'}
                </span>
                <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
            </button>

            <div className={`border-t ${borderColor} mx-4`}></div>

            <button
              onClick={() => setShowNotificationSettings(true)}
              className={`w-full p-3 flex justify-between items-center`}
            >
              <span className={`text-[16px] ${textColor}`}>알림</span>
              <div className="flex items-center">
                <span className={`text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                  {notifications ? '켜짐' : '꺼짐'}
                </span>
                <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
            </button>

            <div className={`border-t ${borderColor} mx-4`}></div>

            <button
              onClick={() => setShowLocationSettings(true)}
              className={`w-full p-3 flex justify-between items-center`}
            >
              <span className={`text-[16px] ${textColor}`}>위치</span>
              <div className="flex items-center">
                <span className={`text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                  {locationSharing ? '켜짐' : '꺼짐'}
                </span>
                <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
            </button>

            <div className={`border-t ${borderColor} mx-4`}></div>

            <button
              onClick={() => setShowThemeSettings(true)}
              className={`w-full p-3 flex justify-between items-center`}
            >
              <span className={`text-[16px] ${textColor}`}>화면</span>
              <div className="flex items-center">
                <span className={`text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                  {isDarkMode ? '다크' : '라이트'}
                </span>
                <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
            </button>

            <div className={`border-t ${borderColor} mx-4`}></div>

            <button
              onClick={() => setShowRankThemeSettings(true)}
              className={`w-full p-3 flex justify-between items-center`}
            >
              <span className={`text-[16px] ${textColor}`}>색상</span>
              <div className="flex items-center">
                <span className={`text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>
                  {userRanking === 'basic' ? '기본' :
                   userRanking === 'bronze' ? '브론즈' :
                   userRanking === 'silver' ? '실버' :
                   userRanking === 'gold' ? '골드' :
                   '플래티넘'}
                </span>
                <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 로그아웃 버튼 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <button
          onClick={onLogout}
          className={`w-full py-2.5 text-[16px] font-medium text-red-500 rounded-lg border border-red-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-red-50 transition-colors`}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;