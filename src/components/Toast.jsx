import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', isVisible, onClose, isDarkMode, rankTheme }) => {
  useEffect(() => {
    if (isVisible) {
      // 메시지 길이에 따라 표시 시간 조절 (2초 ~ 3초)
      const messageLength = message?.length || 0;
      const duration = messageLength <= 10 ? 2000 : Math.min(2000 + (messageLength - 10) * 50, 3000);
      
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, message]);

  if (!isVisible) return null;

  const getRankColors = () => {
    switch(rankTheme) {
      case 'bronze':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500';
      case 'silver':
        return 'bg-gradient-to-r from-slate-300 via-cyan-500 to-teal-500';
      case 'gold':
        return 'bg-gradient-to-r from-amber-300 to-yellow-400';
      case 'platinum':
        return 'bg-gradient-to-r from-purple-400 to-pink-500';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-blue-500';
    }
  };

  const getBgColor = () => {
    if (type === 'error') {
      return 'bg-gradient-to-r from-red-500 to-red-600';
    }
    return getRankColors();
  };
  
  const bgColor = getBgColor();
  const textColor = isDarkMode || type === 'error' ? 'text-white' : 'text-black';

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${bgColor} ${textColor} rounded-xl shadow-2xl pl-4 pr-3 py-2 flex items-center justify-center whitespace-nowrap inline-flex`}>
        <p className="text-xs font-medium text-center">{message}</p>
        <button 
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors ml-2 flex items-center justify-center"
        >
          <FiX className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Toast;