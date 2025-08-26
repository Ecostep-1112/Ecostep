import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', isVisible, onClose, isDarkMode }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3초 후 자동으로 닫힘
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'error':
      default:
        return 'bg-gradient-to-r from-red-500 to-red-600';
    }
  };
  
  const bgColor = getBgColor();

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${bgColor} text-white rounded-xl shadow-2xl px-4 py-2 flex items-center justify-center whitespace-nowrap inline-flex`}>
        <p className="text-xs font-medium text-center">{message}</p>
        <button 
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors ml-3 flex items-center justify-center"
        >
          <FiX className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Toast;