import React, { useState } from 'react';
import { FiChevronRight, FiSearch } from 'react-icons/fi';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../../components/RankIcons';

const FriendsList = ({ isDarkMode, onBack, isGlobalRanking = false, totalPlasticSaved = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // localStorage에서 추가된 친구 목록 가져오기
  const addedFriends = JSON.parse(localStorage.getItem('addedFriends') || '[]');
  
  // 프로필 데이터 가져오기
  const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
  const currentUserId = profileData.userId || '';
  const currentUserName = profileData.name || '';
  
  // 전체 사용자 데이터베이스 (SearchFriends와 동일)
  const getAllUsers = () => {
    // localStorage에서 프로필 이미지 가져오기
    const profileImage = localStorage.getItem('profileImage');
    
    const baseUsers = [
      { id: 'songil_eco', name: '송일', profileImage: null, plasticSaved: 15500 },
      { id: 'wonhee_nature', name: '원희', profileImage: null, plasticSaved: 27000 },
    ];
    
    // 현재 사용자가 프로필에 등록되어 있으면 데이터베이스에 추가
    if (currentUserId && currentUserName) {
      // 이미 존재하는 사용자인지 확인
      const existingUser = baseUsers.find(u => u.id === currentUserId);
      if (!existingUser) {
        baseUsers.unshift({ 
          id: currentUserId, 
          name: currentUserName, 
          profileImage: profileImage, 
          plasticSaved: totalPlasticSaved || 15500 
        });
      }
    }
    
    return baseUsers;
  };
  
  const allUsers = getAllUsers();
  
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
    { name: 'PlasticZero', id: 'plastic_zero', score: '45.2kg', grams: 45200 },
    { name: 'EcoMaster', id: 'eco_master', score: '42.1kg', grams: 42100 },
    { name: 'GreenWarrior', id: 'green_warrior', score: '38.9kg', grams: 38900 },
    { name: '나', id: currentUserId, score: myScore, grams: totalPlasticSaved },
  ];
  
  // 더 많은 사용자 추가
  for (let i = 4; i <= 200; i++) {
    const grams = Math.max(500, 50000 - i * 200); // 50kg부터 점진적으로 감소
    globalRankingDataRaw.push({
      name: `User${i}`,
      id: `user_${i}`,
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
  
  // 친구 목록 데이터 생성 - 실제 추가된 친구들 사용
  let friendsRankingDataRaw = [];
  
  // 추가된 친구들의 데이터 가져오기
  addedFriends.forEach(friendId => {
    const friend = allUsers.find(u => u.id === friendId);
    if (friend) {
      friendsRankingDataRaw.push({
        name: friend.name,
        id: friend.id,
        score: getDisplayScore(friend.plasticSaved),
        grams: friend.plasticSaved
      });
    }
  });
  
  // 나 자신 추가
  friendsRankingDataRaw.push({
    name: '나',
    id: currentUserId,
    score: myScore,
    grams: totalPlasticSaved
  });
  
  // 친구가 없거나 적을 경우 기본 친구 데이터 추가
  if (friendsRankingDataRaw.length < 10) {
    const defaultFriends = [
      { name: '일이', id: 'eco_friend1', score: '27.0kg', grams: 27000 },
      { name: '이이', id: 'eco_friend2', score: '24.0kg', grams: 24000 },
      { name: '삼이', id: 'eco_friend3', score: '21.0kg', grams: 21000 },
      { name: '사이', id: 'eco_friend4', score: '18.0kg', grams: 18000 },
    ];
    
    defaultFriends.forEach(friend => {
      // 중복 체크
      if (!friendsRankingDataRaw.some(f => f.name === friend.name)) {
        friendsRankingDataRaw.push(friend);
      }
    });
  }
  
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
                            className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center text-[11px] font-medium ${
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
                        <span className={`${friend.rank === 1 ? 'text-sm' : friend.rank === 2 ? 'text-[13px]' : 'text-xs'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{friend.name}</span>
                        {friend.id && <span className={`${friend.rank === 1 ? 'text-[10px]' : friend.rank === 2 ? 'text-[9px]' : 'text-[8px]'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${friend.rank === 1 ? '-mt-[1.5px]' : friend.rank === 2 ? '-mt-[3px]' : '-mt-[1px]'}`}>@{friend.id}</span>}
                      </div>
                    </div>
                    <span className={`${friend.rank === 1 ? 'text-xs' : friend.rank === 2 ? 'text-[11px]' : 'text-[10px]'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{friend.score}</span>
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