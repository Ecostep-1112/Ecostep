import React, { useState, useEffect } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../../components/RankIcons';
import { useData } from '../../services/DataContext';

const FriendsList = ({ isDarkMode, onBack, isGlobalRanking = false, totalPlasticSaved = 0, currentUserId = '', currentUserNickname = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 전역 데이터 컨텍스트에서 데이터 가져오기
  const { allUsers, friendsList: friendsData } = useData();

  // 프로필 데이터 가져오기
  const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
  const currentUserName = profileData.name || '';
  
  // 나의 실제 플라스틱 절약량 반영
  const getDisplayScore = (grams) => {
    if (grams < 1000) {
      return `${Math.round(grams)}g`;
    } else {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
  };

  const myScore = getDisplayScore(totalPlasticSaved);

  // 전체 랭킹 데이터 - 데이터베이스에서 가져온 상위 50명 사용
  let globalRankingDataRaw = allUsers.map(user => ({
    name: user.name,
    id: user.id,
    score: getDisplayScore(user.plasticSaved),
    grams: user.plasticSaved
  }));

  // 현재 사용자가 상위 50명에 없다면 추가
  const currentUserInList = globalRankingDataRaw.find(u => u.id === currentUserId);
  if (!currentUserInList && currentUserId) {
    globalRankingDataRaw.push({
      name: currentUserName || '나',
      id: currentUserId,
      score: myScore,
      grams: totalPlasticSaved
    });
    // 다시 정렬
    globalRankingDataRaw.sort((a, b) => b.grams - a.grams);
  }

  // 정렬 후 순위 부여
  const globalRankingData = globalRankingDataRaw.map((user, index) => ({
    ...user,
    rank: index + 1
  }));

  // 친구 목록 데이터 - 데이터베이스에서 가져온 친구들 사용
  let friendsRankingDataRaw = friendsData.map(friend => ({
    name: friend.name,
    id: friend.id,
    score: getDisplayScore(friend.plasticSaved),
    grams: friend.plasticSaved
  }));

  // 나 자신 추가 (친구 목록에 없는 경우)
  const meInFriends = friendsRankingDataRaw.find(f => f.id === currentUserId);
  if (!meInFriends && currentUserId) {
    friendsRankingDataRaw.push({
      name: currentUserName || '나',
      id: currentUserId,
      score: myScore,
      grams: totalPlasticSaved
    });
    // 다시 정렬
    friendsRankingDataRaw.sort((a, b) => b.grams - a.grams);
  }

  // 정렬 후 순위 부여
  const friendsRankingData = friendsRankingDataRaw.map((friend, index) => ({
    ...friend,
    rank: index + 1
  }));
  
  // 친구 목록에서는 최대 99명 + 나의 순위만 표시
  let displayFriends;
  if (!isGlobalRanking) {
    const myRankInFriends = friendsRankingData.findIndex(f => f.id === currentUserId) + 1;

    if (myRankInFriends <= 99) {
      // 내가 99등 이내면 상위 99명만 표시
      displayFriends = friendsRankingData.slice(0, 99);
    } else {
      // 내가 100등 이상이면 상위 99명 + 나 표시
      const top99 = friendsRankingData.slice(0, 99);
      const myData = friendsRankingData.find(f => f.id === currentUserId);
      displayFriends = [...top99, myData].filter(Boolean);
    }
  } else {
    // 전체 랭킹도 동일하게 처리
    const myRankInGlobal = globalRankingData.findIndex(f => f.id === currentUserId) + 1;

    if (myRankInGlobal <= 99) {
      displayFriends = globalRankingData.slice(0, 99);
    } else {
      const top99 = globalRankingData.slice(0, 99);
      const myData = globalRankingData.find(f => f.id === currentUserId);
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
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-[17px] font-medium ${textColor}`}>{isGlobalRanking ? '전체' : '친구'}</h2>
      </div>
      
      {/* Search Bar */}
      <div className={`px-4 py-3 relative`}>
        <div className={`relative`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          <input
            type="text"
            placeholder={isGlobalRanking ? "검색" : "친구 검색"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${inputBg} rounded-lg text-[15px] ${textColor} placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400`}
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
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-[15px]`}>
              검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
            {filteredFriends.map((friend, index) => {
              // 1등: 플래티넘, 2등: 골드, 3등: 실버
              const rankColor = friend.rank === 1 ? '#c084fc' : friend.rank === 2 ? '#facc15' : friend.rank === 3 ? '#14b8a6' : '';
              const isMe = friend.id === currentUserId;
              
              return (
                <div key={friend.rank}>
                  <div className="flex items-center justify-between" style={{ paddingTop: '0.425rem', paddingBottom: '0.425rem' }}>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center" style={{ 
                        width: '28px',
                        height: friend.rank === 1 ? '28px' : friend.rank === 2 ? '26px' : friend.rank <= 3 ? '24px' : '24px',
                        marginRight: '8px'
                      }}>
                        {friend.rank === 1 ? (
                          <PlatinumIcon size={28} />
                        ) : friend.rank === 2 ? (
                          <GoldIcon size={26} />
                        ) : friend.rank === 3 ? (
                          <SilverIcon size={24} />
                        ) : (
                          <div 
                            className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center text-[12px] font-medium ${
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
                      <div className="flex-1 flex flex-col items-start">
                        <span className={`${friend.rank === 1 ? 'text-sm' : friend.rank === 2 ? 'text-[14px]' : 'text-[13px]'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{friend.name}</span>
                        {friend.id && <span className={`${friend.rank === 1 ? 'text-[12px]' : friend.rank === 2 ? 'text-[12px]' : 'text-[12px]'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${friend.rank === 1 ? '-mt-[1.5px]' : friend.rank === 2 ? '-mt-[3px]' : '-mt-[1px]'}`}>@{isMe ? currentUserNickname : friend.id}</span>}
                      </div>
                    </div>
                    <span className={`${friend.rank === 1 ? 'text-xs' : friend.rank === 2 ? 'text-[12px]' : 'text-[12px]'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{friend.score}</span>
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