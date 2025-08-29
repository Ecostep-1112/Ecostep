import React, { useState } from 'react';
import { FiChevronRight, FiSearch } from 'react-icons/fi';

const FriendsList = ({ isDarkMode, onBack, isGlobalRanking = false, totalPlasticSaved = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 나의 실제 플라스틱 절약량 반영
  const getDisplayScore = (grams) => {
    if (grams < 1000) {
      return `${Math.round(grams)}g`;
    } else {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
  };
  
  const myScore = getDisplayScore(totalPlasticSaved);
  
  // 전체 랭킹 데이터 생성 (플라스틱 절약량 포함)
  let globalRankingDataRaw = [
    { name: 'PlasticZero', score: '45.2kg', grams: 45200 },
    { name: 'EcoMaster', score: '42.1kg', grams: 42100 },
    { name: 'GreenWarrior', score: '38.9kg', grams: 38900 },
    { name: '나', score: myScore, grams: totalPlasticSaved },
  ];
  
  // 더 많은 사용자 추가
  for (let i = 4; i <= 200; i++) {
    const grams = Math.max(500, 50000 - i * 200); // 50kg부터 점진적으로 감소
    globalRankingDataRaw.push({
      name: `User${i}`,
      score: getDisplayScore(grams),
      grams: grams
    });
  }
  
  // 플라스틱 절약량으로 정렬 (내림차순)
  globalRankingDataRaw.sort((a, b) => b.grams - a.grams);
  
  // 정렬 후 순위 부여
  const globalRankingData = globalRankingDataRaw.map((user, index) => ({
    ...user,
    rank: index + 1
  }));
  
  // 친구 목록 데이터 생성 (정렬을 위해 grams 값 포함)
  let friendsRankingDataRaw = [
    { name: '일이', score: '27.0kg', grams: 27000 },
    { name: '이이', score: '24.0kg', grams: 24000 },
    { name: '삼이', score: '21.0kg', grams: 21000 },
    { name: '사이', score: '18.0kg', grams: 18000 },
    { name: '나', score: myScore, grams: totalPlasticSaved },
  ];
  
  // 더미 친구 데이터 추가 (친구6 ~ 친구20) - 고정된 값으로
  const additionalFriends = [
    { name: '친구6', grams: 28200 },
    { name: '친구7', grams: 27900 },
    { name: '친구8', grams: 27600 },
    { name: '친구9', grams: 27300 },
    { name: '친구10', grams: 27000 },
    { name: '친구11', grams: 26700 },
    { name: '친구12', grams: 26400 },
    { name: '친구13', grams: 26100 },
    { name: '친구14', grams: 25800 },
    { name: '친구15', grams: 25500 },
    { name: '친구16', grams: 25200 },
    { name: '친구17', grams: 24900 },
    { name: '친구18', grams: 24600 },
    { name: '친구19', grams: 15000 },
    { name: '친구20', grams: 12000 },
  ];
  
  additionalFriends.forEach(friend => {
    friendsRankingDataRaw.push({
      name: friend.name,
      score: getDisplayScore(friend.grams),
      grams: friend.grams
    });
  });
  
  // 플라스틱 절약량으로 정렬 (내림차순)
  friendsRankingDataRaw.sort((a, b) => b.grams - a.grams);
  
  // 정렬 후 순위 부여
  const friendsRankingData = friendsRankingDataRaw.map((friend, index) => ({
    ...friend,
    rank: index + 1
  }));
  
  // 친구 목록에서는 최대 99명 + 나의 순위만 표시
  let displayFriends;
  if (!isGlobalRanking) {
    const myRankInFriends = friendsRankingData.findIndex(f => f.name === '나') + 1;
    
    if (myRankInFriends <= 99) {
      // 내가 99등 이내면 상위 99명만 표시
      displayFriends = friendsRankingData.slice(0, 99);
    } else {
      // 내가 100등 이상이면 상위 99명 + 나 표시
      const top99 = friendsRankingData.slice(0, 99);
      const myData = friendsRankingData.find(f => f.name === '나');
      displayFriends = [...top99, myData].filter(Boolean);
    }
  } else {
    // 전체 랭킹도 동일하게 처리
    const myRankInGlobal = globalRankingData.findIndex(f => f.name === '나') + 1;
    
    if (myRankInGlobal <= 99) {
      displayFriends = globalRankingData.slice(0, 99);
    } else {
      const top99 = globalRankingData.slice(0, 99);
      const myData = globalRankingData.find(f => f.name === '나');
      displayFriends = [...top99, myData].filter(Boolean);
    }
  }
  
  const filteredFriends = displayFriends.filter(friend =>
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
                      <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                        {friend.rank === 1 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="platinumGradient-list" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e9d5ff" />
                                <stop offset="30%" stopColor="#c084fc" />
                                <stop offset="60%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#platinumGradient-list)"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.8"/>
                            <circle cx="50" cy="50" r="36" fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.6"/>
                            <path d="M50 25 L35 40 L65 40 Z" fill="#f3e8ff" stroke="#e9d5ff" strokeWidth="1"/>
                            <path d="M35 40 L50 70 L65 40 Z" fill="#ede9fe" stroke="#e9d5ff" strokeWidth="1"/>
                            <ellipse cx="48" cy="35" rx="8" ry="4" fill="white" opacity="0.4"/>
                          </svg>
                        ) : friend.rank === 2 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="goldGradient-list" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fde047" />
                                <stop offset="50%" stopColor="#facc15" />
                                <stop offset="100%" stopColor="#f59e0b" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#goldGradient-list)"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.8"/>
                            <circle cx="50" cy="50" r="15" fill="#fef3c7"/>
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                              <rect key={i} x="48" y="25" width="4" height="12" fill="#fef3c7" rx="2" transform={`rotate(${angle} 50 50)`}/>
                            ))}
                            <circle cx="47" cy="47" r="6" fill="white" opacity="0.4"/>
                          </svg>
                        ) : friend.rank === 3 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="silverGradient-list" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e2e8f0" />
                                <stop offset="50%" stopColor="#94a3b8" />
                                <stop offset="100%" stopColor="#64748b" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#silverGradient-list)"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.7"/>
                            <path d="M 40 30 C 30 30, 25 40, 25 50 C 25 60, 30 70, 40 70 C 35 65, 32 58, 32 50 C 32 42, 35 35, 40 30" fill="#e0f2fe"/>
                            <path d="M 60 40 L 63 47 L 70 47 L 64 52 L 67 59 L 60 54 L 53 59 L 56 52 L 50 47 L 57 47 Z" fill="#bae6fd"/>
                          </svg>
                        ) : (
                          <div 
                            className={`w-[17.6px] h-[17.6px] rounded-full border flex items-center justify-center text-[11px] font-medium ${
                              isMe ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                            }`}
                            style={{ 
                              borderColor: isMe ? (isDarkMode ? '#9ca3af' : '#6b7280') : (isDarkMode ? '#4b5563' : '#d1d5db')
                            }}
                          >
                            {friend.rank > 99 ? '···' : friend.rank}
                          </div>
                        )}
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