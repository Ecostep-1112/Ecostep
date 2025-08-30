import React, { useState, useEffect } from 'react';
import { MessageCircle, Link, UserSearch, ChevronDown } from 'lucide-react';
import SearchFriends from './SearchFriends';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../components/RankIcons';

const Community = ({ isDarkMode, onShowFriendsList, showToast, userRanking, totalPlasticSaved = 0, currentUserId = '', currentUserName = '' }) => {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  
  // 나의 실제 플라스틱 절약량 (g 단위를 kg 또는 g으로 표시)
  const getDisplayScore = (grams) => {
    if (grams < 1000) {
      return `${Math.round(grams)}g`;
    } else {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
  };
  
  const myScore = getDisplayScore(totalPlasticSaved);
  
  // 전체 랭킹 데이터 생성 (FriendsList와 동일한 로직)
  let globalRankingDataRaw = [
    { name: 'PlasticZero', score: '45.2kg', grams: 45200 },
    { name: 'EcoMaster', score: '42.1kg', grams: 42100 },
    { name: 'GreenWarrior', score: '38.9kg', grams: 38900 },
    { name: '나', score: myScore, grams: totalPlasticSaved },
  ];
  
  // 더 많은 사용자 추가 (전체 200명)
  for (let i = 4; i <= 200; i++) {
    const grams = Math.max(500, 50000 - i * 200);
    globalRankingDataRaw.push({
      name: `User${i}`,
      score: getDisplayScore(grams),
      grams: grams
    });
  }
  
  // 플라스틱 절약량으로 정렬
  globalRankingDataRaw.sort((a, b) => b.grams - a.grams);
  
  // 나의 전체 순위 찾기
  const myGlobalRank = globalRankingDataRaw.findIndex(u => u.name === '나') + 1;
  const totalUsers = globalRankingDataRaw.length;
  const topPercentage = Math.round((myGlobalRank / totalUsers) * 100);
  
  // kg로 변환하는 함수 (정렬을 위해 숫자로 반환)
  const parseScoreToGrams = (score) => {
    if (typeof score === 'string') {
      if (score.includes('kg')) {
        return parseFloat(score) * 1000;
      } else if (score.includes('g')) {
        return parseFloat(score);
      }
    }
    return 0;
  };
  
  // localStorage에서 추가된 친구 목록 가져오기
  const addedFriends = JSON.parse(localStorage.getItem('addedFriends') || '[]');
  
  // 전체 사용자 데이터베이스 (SearchFriends와 동일)
  const getAllUsers = () => {
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
          profileImage: null, 
          plasticSaved: totalPlasticSaved || 15500 
        });
      }
    }
    
    return baseUsers;
  };
  
  const allUsers = getAllUsers();
  
  // 친구 목록 데이터 생성 - 실제 추가된 친구들 사용
  let friendsListRaw = [];
  
  // 추가된 친구들의 데이터 가져오기
  addedFriends.forEach(friendId => {
    const friend = allUsers.find(u => u.id === friendId);
    if (friend) {
      friendsListRaw.push({
        name: friend.name,
        score: getDisplayScore(friend.plasticSaved),
        grams: friend.plasticSaved
      });
    }
  });
  
  // 나 자신 추가
  friendsListRaw.push({
    name: '나',
    score: myScore,
    grams: totalPlasticSaved
  });
  
  // 친구가 없거나 적을 경우 기본 친구 데이터 추가
  if (friendsListRaw.length < 5) {
    const defaultFriends = [
      { name: '일이', score: '27.0kg', grams: 27000 },
      { name: '이이', score: '24.0kg', grams: 24000 },
      { name: '삼이', score: '21.0kg', grams: 21000 },
      { name: '사이', score: '18.0kg', grams: 18000 },
    ];
    
    defaultFriends.forEach(friend => {
      // 중복 체크
      if (!friendsListRaw.some(f => f.name === friend.name)) {
        friendsListRaw.push(friend);
      }
    });
  }
  
  // 점수로 정렬 (내림차순) - 플라스틱 절약량이 많을수록 상위
  friendsListRaw.sort((a, b) => {
    // grams 값으로 비교 (큰 값이 먼저 오도록)
    return b.grams - a.grams;
  });
  
  // 랭킹 부여
  const friendsList = friendsListRaw.map((friend, index) => ({
    ...friend,
    rank: index + 1
  }));
  
  // 나의 친구 중 랭킹 찾기
  const myRank = friendsList.findIndex(f => f.name === '나') + 1;
  const isInTop3 = myRank <= 3;

  if (showSearchPage) {
    return <SearchFriends isDarkMode={isDarkMode} onBack={() => setShowSearchPage(false)} userRanking={userRanking} showToast={showToast} currentUserId={currentUserId} currentUserName={currentUserName} />;
  }

  // Initialize Kakao SDK when component mounts
  useEffect(() => {
    const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;
    if (window.Kakao && !window.Kakao.isInitialized() && kakaoApiKey && kakaoApiKey !== 'your-kakao-api-key-here') {
      window.Kakao.init(kakaoApiKey);
      console.log('Kakao SDK initialized');
    }
  }, []);

  // 카카오톡 공유 함수
  const shareToKakao = () => {
    // Generate unique invite code
    const inviteCode = 'ECO' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const inviteLink = `https://ecostep.app/invite?code=${inviteCode}`;

    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '🌍 Ecostep - 함께 지구를 지켜요!',
          description: '플라스틱 사용량을 줄이고 귀여운 물고기를 키워보세요! 친구와 함께 환경 보호에 동참해요.',
          imageUrl: 'https://ecostep.app/share-image.png', // 실제 이미지 URL로 교체 필요
          link: {
            mobileWebUrl: inviteLink,
            webUrl: inviteLink,
          },
        },
        social: {
          likeCount: 286,
          commentCount: 45,
          sharedCount: 845,
        },
        buttons: [
          {
            title: '앱에서 시작하기',
            link: {
              mobileWebUrl: inviteLink,
              webUrl: inviteLink,
            },
          },
        ],
      });
    } else {
      // Fallback: 카카오 SDK가 초기화되지 않았을 때
      alert('카카오톡 공유를 위해 카카오 API 키를 설정해주세요.\n.env.local 파일에 VITE_KAKAO_API_KEY를 추가하고\nhttps://developers.kakao.com 에서 앱을 등록하세요.');
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 친구 초대 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3 text-center`}>초대</h3>
          <div className="flex gap-2">
            <button 
              onClick={shareToKakao}
              className={`flex-1 relative bg-transparent ${textColor} hover:bg-gray-50 hover:bg-opacity-10 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors overflow-hidden`}
            >
              <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute left-0 top-0 bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <MessageCircle className="w-4 h-4 mr-1.5" />
              카톡
            </button>
            <button 
              onClick={() => {
                // Generate unique invite code
                const inviteCode = 'ECO' + Math.random().toString(36).substr(2, 6).toUpperCase();
                const inviteLink = `https://ecostep.app/invite?code=${inviteCode}`;
                
                // Copy to clipboard
                navigator.clipboard.writeText(inviteLink).then(() => {
                  if (showToast) {
                    showToast('링크가 복사되었습니다', 'success');
                  }
                }).catch(() => {
                  // Fallback for older browsers
                  const textArea = document.createElement('textarea');
                  textArea.value = inviteLink;
                  document.body.appendChild(textArea);
                  textArea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textArea);
                  if (showToast) {
                    showToast('링크가 복사되었습니다', 'success');
                  }
                });
              }}
              className={`flex-1 relative bg-transparent ${textColor} hover:bg-gray-50 hover:bg-opacity-10 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors overflow-hidden`}
            >
              <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute left-0 top-0 bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <Link className="w-4 h-4 mr-1.5" />
              링크
            </button>
            <button 
              onClick={() => setShowSearchPage(true)}
              className={`flex-1 relative bg-transparent ${textColor} hover:bg-gray-50 hover:bg-opacity-10 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors overflow-hidden`}
            >
              <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute left-0 top-0 bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-px"
                style={{
                  background: `linear-gradient(to bottom, transparent 10%, ${isDarkMode ? '#374151' : '#e5e7eb'} 30%, ${isDarkMode ? '#374151' : '#e5e7eb'} 70%, transparent 90%)`
                }}
              />
              <UserSearch className="w-4 h-4 mr-1.5" />
              아이디
            </button>
          </div>
        </div>

        {/* 친구 랭킹 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${textColor} text-sm font-medium`}>친구</h3>
            <button 
              onClick={() => onShowFriendsList('friends')} 
              className={`text-xs ${textColor} hover:opacity-70 transition-opacity flex items-center gap-0.5`}
            >
              더보기
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div>
            {friendsList.slice(0, 3).map((friend, index) => {
              // 1등: 플래티넘, 2등: 골드, 3등: 실버
              const displayRank = index + 1; // 화면에 표시할 순위 (1, 2, 3)
              const rankColor = displayRank === 1 ? '#ec4899' : displayRank === 2 ? '#facc15' : '#06b6d4';
              const isMe = friend.name === '나';
              
              return (
                <div key={friend.rank}>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                        {displayRank === 1 ? (
                          <PlatinumIcon size={20} />
                        ) : displayRank === 2 ? (
                          <GoldIcon size={20} />
                        ) : displayRank === 3 ? (
                          <SilverIcon size={20} />
                        ) : (
                          <div 
                            className={`w-[17.6px] h-[17.6px] rounded-full border flex items-center justify-center text-[11px] font-medium ${
                              isMe ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                            }`}
                            style={{ 
                              borderColor: isMe ? (isDarkMode ? '#9ca3af' : '#6b7280') : (isDarkMode ? '#4b5563' : '#d1d5db')
                            }}
                          >
                            {displayRank}
                          </div>
                        )}
                      </div>
                      <span className={`text-sm ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{friend.name}</span>
                    </div>
                    <span className={`text-xs ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{friend.score}</span>
                  </div>
                  {index < 2 && <div className={`border-b ${borderColor}`}></div>}
                </div>
              );
            })}
            {!isInTop3 && (
              <>
                <div className={`border-t ${borderColor}`}></div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                      <div 
                        className={`w-[17.6px] h-[17.6px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {myRank}
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${textColor} relative`} style={{ top: '-1px' }}>나</span>
                  </div>
                  <span className={`text-xs font-medium ${textColor} relative`} style={{ top: '-1px' }}>{myScore}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 전체 랭킹 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${textColor} text-sm font-medium`}>전체</h3>
            <button 
              onClick={() => onShowFriendsList('global')} 
              className={`text-xs ${textColor} hover:opacity-70 transition-opacity flex items-center gap-0.5`}
            >
              더보기
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div>
            {globalRankingDataRaw.slice(0, 3).map((user, index) => {
              // 1등: 플래티넘, 2등: 골드, 3등: 실버
              const displayRank = index + 1;
              const rankColor = displayRank === 1 ? '#ec4899' : displayRank === 2 ? '#facc15' : '#06b6d4';
              const isMe = user.name === '나';
              
              return (
                <div key={user.rank}>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                        {displayRank === 1 ? (
                          <PlatinumIcon size={20} />
                        ) : displayRank === 2 ? (
                          <GoldIcon size={20} />
                        ) : displayRank === 3 ? (
                          <SilverIcon size={20} />
                        ) : (
                          <div 
                            className={`w-[17px] h-[17px] rounded-full border flex items-center justify-center text-[10px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            style={{ 
                              borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
                            }}
                          >
                            {user.rank}
                          </div>
                        )}
                      </div>
                      <span className={`text-sm ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{user.name}</span>
                    </div>
                    <span className={`text-xs ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{user.score}</span>
                  </div>
                  {index < 2 && <div className={`border-b ${borderColor}`}></div>}
                </div>
              );
            })}
            {/* 나의 랭킹 (1~3등이 아닐 때만 표시) */}
            {myGlobalRank > 3 && (
              <>
                <div className={`border-t ${borderColor}`}></div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                      <div 
                        className={`w-[17.6px] h-[17.6px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {myGlobalRank <= 99 ? myGlobalRank : '···'}
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${textColor} relative`} style={{ top: '-1px' }}>나</span>
                  </div>
                  <span className={`text-xs font-medium ${textColor} relative`} style={{ top: '-1px' }}>
                    상위 {topPercentage}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;