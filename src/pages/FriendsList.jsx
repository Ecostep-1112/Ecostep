import React, { useState } from 'react';
import { FiChevronRight, FiSearch } from 'react-icons/fi';

const FriendsList = ({ isDarkMode, onBack, isGlobalRanking = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Extended friends data with scores in kg
  const globalRankingData = [];
  
  // 1-99위까지 생성
  for (let i = 1; i <= 99; i++) {
    let name, score;
    if (i === 1) {
      name = 'PlasticZero';
      score = '45.2kg';
    } else if (i === 2) {
      name = 'EcoMaster';
      score = '42.1kg';
    } else if (i === 3) {
      name = 'GreenWarrior';
      score = '38.9kg';
    } else {
      name = `User${i}`;
      score = `${(50 - i * 0.4).toFixed(1)}kg`;
    }
    globalRankingData.push({ rank: i, name, score });
  }
  
  // 나의 순위 추가 (152위)
  globalRankingData.push({ rank: 152, name: '나', score: '8.5kg' });
  
  // 친구 목록 데이터 생성
  const friendsRankingData = [];
  
  // 친구 목록 최대 99명까지 생성
  const friendNames = ['일이', '이이', '삼이', '사이'];
  const myFriendRank = 5; // 친구 중 나의 순위
  
  for (let i = 1; i <= 99; i++) {
    let name, score;
    if (i < 5) {
      name = friendNames[i - 1];
      score = `${(30 - i * 3).toFixed(1)}kg`;
    } else if (i === myFriendRank) {
      name = '나';
      score = '8.5kg';
    } else {
      name = `친구${i}`;
      score = `${Math.max(1, 30 - i * 0.3).toFixed(1)}kg`;
    }
    friendsRankingData.push({ rank: i, name, score });
  }
  
  const allFriends = isGlobalRanking ? globalRankingData : friendsRankingData;
  
  const filteredFriends = allFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  
  
  return (
    <div className={`h-full flex flex-col ${bgColor}`}>
      {/* Header */}
      <div className={`flex items-center p-4 border-b ${borderColor}`}>
        <button onClick={onBack} className="mr-3">
          <FiChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>{isGlobalRanking ? '전체' : '친구'}</h2>
      </div>
      
      {/* Search Bar */}
      <div className={`px-4 py-3 relative`}>
        <div className={`relative`}>
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          <input
            type="text"
            placeholder={isGlobalRanking ? "검색" : "친구 검색"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${inputBg} rounded-lg text-sm ${textColor} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400`}
          />
        </div>
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent 0%, ${isDarkMode ? '#374151' : '#e5e7eb'} 15%, ${isDarkMode ? '#374151' : '#e5e7eb'} 85%, transparent 100%)`
          }}
        />
      </div>
      
      {/* Friends List */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide px-3 py-4 pb-20`}>
        {filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
            {filteredFriends.map((friend, index) => {
              // 1등: 플래티넘, 2등: 골드, 3등: 실버
              const rankColor = friend.rank === 1 ? '#c084fc' : friend.rank === 2 ? '#facc15' : friend.rank === 3 ? '#14b8a6' : '';
              const isMe = friend.name === '나';
              
              return (
                <div key={friend.rank}>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center">
                      <div 
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 text-[10px] font-medium ${
                          isMe ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                        }`}
                        style={{ 
                          borderColor: isMe ? (isDarkMode ? '#9ca3af' : '#6b7280') : (rankColor || (isDarkMode ? '#4b5563' : '#d1d5db')),
                          color: !isMe && rankColor ? rankColor : undefined
                        }}
                      >
                        {friend.rank > 99 ? '···' : friend.rank}
                      </div>
                      <span className={`text-sm ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{friend.name}</span>
                    </div>
                    <span className={`text-xs ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{friend.score}</span>
                  </div>
                  {index < filteredFriends.length - 1 && <div className={`border-b ${borderColor}`}></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;