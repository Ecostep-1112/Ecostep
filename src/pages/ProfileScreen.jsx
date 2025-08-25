import React from 'react';
import { FiChevronRight, FiCamera, FiPlus } from 'react-icons/fi';

const ProfileScreen = ({ isDarkMode, setShowProfile }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowProfile(false)} className="mr-3">
          <FiChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>송일님의 정보</h2>
      </div>
      
      {/* 프로필 사진 섹션 */}
      <div className="flex justify-center mt-6 mb-4">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <FiCamera className="w-8 h-8 text-blue-500" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <FiPlus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      <div className="mx-3 space-y-3">
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>이름</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>송일</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>아이디</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>@songil_eco</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>생년월일</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>2004.12.02</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>이메일 주소</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>callmesongil@kakao.com</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>휴대폰 번호</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>010-5633-3473</p>
        </div>
        
        {/* 계정 탈퇴 */}
        <button className="w-full text-red-500 text-sm py-3 mt-6">
          계정 탈퇴
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;