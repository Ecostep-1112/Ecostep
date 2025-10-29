import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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

  const getBgColor = () => {
    if (type === 'error') {
      return 'bg-gradient-to-r from-red-500 to-red-600';
    }
    // 항상 청록색 그라데이션 적용
    return 'bg-gradient-to-r from-cyan-500 to-blue-500';
  };
  
  const bgColor = getBgColor();
  const textColor = isDarkMode || type === 'error' ? 'text-white' : 'text-black';

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${bgColor} ${textColor} rounded-xl shadow-2xl pl-4 pr-3 py-2 flex items-center justify-center whitespace-nowrap inline-flex`}>
        <p className="text-[13px] font-normal text-center">{message}</p>
        <button 
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors ml-2 flex items-center justify-center"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Toast;