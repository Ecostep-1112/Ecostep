import React, { useState, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const NotificationsScreen = ({ isDarkMode, setShowNotifications, notifications, setNotifications }) => {
  const getTimeDisplay = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return '방금 전';
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays === 1) {
      return '1일 전';
    } else if (diffDays < 2) {
      return '어제';
    } else {
      const month = notificationTime.getMonth() + 1;
      const day = notificationTime.getDate();
      return `${month}월 ${day}일`;
    }
  };

  const [expandedItems, setExpandedItems] = useState([]);

  // notifications가 props로 전달되지 않을 경우 기본값 설정
  useEffect(() => {
    if (!notifications || notifications.length === 0) {
      // notifications가 없으면 App.jsx에서 제공하는 것을 사용
    }
  }, [notifications]);

  // 7일 이후의 알림 자동 삭제
  useEffect(() => {
    const filterOldNotifications = () => {
      const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
      setNotifications(prev => 
        prev.filter(notif => new Date(notif.timestamp) > sevenDaysAgo)
      );
    };

    filterOldNotifications();
    const interval = setInterval(filterOldNotifications, 1000 * 60 * 60); // 1시간마다 체크

    return () => clearInterval(interval);
  }, [setNotifications]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  return (
    <div className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} overflow-hidden flex flex-col`}>
      {/* 헤더 */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(false)}
              className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <FiChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h2 className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              알림
            </h2>
          </div>
          
          {notifications.length > 0 && notifications.filter(n => !n.read).length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className={`text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              읽음
            </button>
          )}
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm`}>
              새로운 알림이 없습니다
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map(notification => {
                  return (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 transition-colors cursor-pointer hover:${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                      onClick={() => {
                        handleMarkAsRead(notification.id);
                        toggleExpanded(notification.id);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-green-500' : isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs ml-2 ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {getTimeDisplay(notification.timestamp)}
                            </p>
                          </div>
                          {expandedItems.includes(notification.id) && (
                            <p className={`text-xs mt-1 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 하단 안내 문구 */}
            <div className="px-4 py-2 text-center">
              <p className={`text-[10px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                1주일 이후의 알림은 자동으로 삭제됩니다
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;