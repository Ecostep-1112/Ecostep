import React, { useState, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const NotificationsScreen = ({ isDarkMode, setShowNotifications, notifications, setNotifications, points, setPoints, earnPoints, rankTheme }) => {
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
                  const isRewardNotification = notification.isReward && !notification.claimed;
                  
                  return (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 transition-colors ${
                        isRewardNotification ? '' : 'cursor-pointer'
                      } hover:${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                      onClick={() => {
                        if (!isRewardNotification) {
                          handleMarkAsRead(notification.id);
                          toggleExpanded(notification.id);
                        }
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
                          {(expandedItems.includes(notification.id) || isRewardNotification) && (
                            <div>
                              <p className={`text-xs mt-1 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              {isRewardNotification && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (setPoints) {
                                      if (earnPoints) {
                                        earnPoints(notification.pointsAmount);
                                      } else {
                                        setPoints(prev => prev + notification.pointsAmount);
                                      }
                                    }
                                    setNotifications(prev => 
                                      prev.map(n => 
                                        n.id === notification.id 
                                          ? { ...n, claimed: true, read: true }
                                          : n
                                      )
                                    );
                                  }}
                                  className={`mt-2 px-3 py-1.5 text-xs font-medium rounded-lg ${
                                    rankTheme === 'basic' 
                                      ? isDarkMode ? 'bg-gray-300 hover:bg-gray-400 text-black' : 'bg-gray-800 hover:bg-gray-900 text-white'
                                      : rankTheme === 'bronze' 
                                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                                      : rankTheme === 'silver' 
                                      ? 'bg-gradient-to-r from-slate-300 via-cyan-500 to-teal-500 hover:from-slate-400 hover:via-cyan-600 hover:to-teal-600 text-white'
                                      : rankTheme === 'gold' 
                                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-gray-800'
                                      : rankTheme === 'platinum' 
                                      ? 'bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white'
                                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                                  } transition-all shadow-lg hover:shadow-xl`}
                                >
                                  {notification.pointsAmount}P 수령하기
                                </button>
                              )}
                            </div>
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