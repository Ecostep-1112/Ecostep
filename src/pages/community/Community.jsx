import React, { useState, useEffect } from 'react';
import { MessageCircle, Link, UserSearch, ChevronDown } from 'lucide-react';
import SearchFriends from './SearchFriends';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../../components/RankIcons';
import { supabase } from '../../lib/supabase';

const Community = ({ isDarkMode, onShowFriendsList, onShowGlobalList, showToast, userRanking, totalPlasticSaved = 0, currentUserId = '', currentUserName = '', currentUserNickname = '' }) => {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [addedFriends, setAddedFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

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

  // 전체 랭킹 데이터 생성 - 실제 DB 데이터 사용
  let globalRankingDataRaw = [];
  let currentUserFound = false;

  // 실제 DB에서 가져온 사용자들 추가
  allUsers.forEach(user => {
    if (user.id === currentUserId) {
      // 현재 사용자는 props의 totalPlasticSaved 사용
      globalRankingDataRaw.push({
        name: '나',
        id: currentUserId,
        score: myScore,
        grams: totalPlasticSaved
      });
      currentUserFound = true;
    } else {
      // 다른 사용자는 DB 데이터 사용
      globalRankingDataRaw.push({
        name: user.name,
        id: user.id,
        score: getDisplayScore(user.plasticSaved),
        grams: user.plasticSaved
      });
    }
  });

  // DB에 현재 사용자가 없으면 추가
  if (!currentUserFound) {
    globalRankingDataRaw.push({
      name: '나',
      id: currentUserId,
      score: myScore,
      grams: totalPlasticSaved
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

  // Supabase에서 사용자 목록 불러오기
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_info')
        .select('user_id, name, points_total');

      if (error) throw error;

      const formattedUsers = data.map(user => ({
        id: user.user_id,
        name: user.name,
        profileImage: null,
        plasticSaved: user.points_total || 0
      }));

      setAllUsers(formattedUsers);
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
      setAllUsers([]);
    }
  };

  // Supabase에서 친구 목록 불러오기
  const loadFriends = async () => {
    let userId = currentUserId;
    if (!userId) {
      const savedProfileData = localStorage.getItem('profileData');
      if (savedProfileData) {
        try {
          const parsed = JSON.parse(savedProfileData);
          userId = parsed.userId;
        } catch (e) {
          console.error('프로필 데이터 파싱 오류:', e);
        }
      }
    }

    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_friend')
        .select('friend_id')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (error) throw error;

      const friendIds = data.map(f => f.friend_id);
      setAddedFriends(friendIds);
    } catch (error) {
      console.error('친구 목록 로드 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (!showSearchPage) {
      loadUsers();
      loadFriends();
    }
  }, [currentUserId, showSearchPage]);

  // 친구 목록 데이터 생성 - 실제 추가된 친구들 사용
  let friendsListRaw = [];
  let currentUserInFriends = false;

  // 추가된 친구들의 데이터 가져오기
  addedFriends.forEach(friendId => {
    const friend = allUsers.find(u => u.id === friendId);
    if (friend) {
      if (friend.id === currentUserId) {
        // 현재 사용자는 props의 totalPlasticSaved 사용
        friendsListRaw.push({
          name: '나',
          id: currentUserId,
          score: myScore,
          grams: totalPlasticSaved
        });
        currentUserInFriends = true;
      } else {
        friendsListRaw.push({
          name: friend.name,
          id: friend.id,
          score: getDisplayScore(friend.plasticSaved),
          grams: friend.plasticSaved
        });
      }
    }
  });

  // 친구 목록에 나 자신이 없으면 추가
  if (!currentUserInFriends) {
    friendsListRaw.push({
      name: '나',
      id: currentUserId,
      score: myScore,
      grams: totalPlasticSaved
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

  // Initialize Kakao SDK when component mounts
  useEffect(() => {
    const initKakao = () => {
      const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

      if (!kakaoApiKey || kakaoApiKey === 'your-kakao-api-key-here') {
        console.warn('Kakao API key not configured');
        return;
      }

      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(kakaoApiKey);
            console.log('Kakao SDK initialized successfully');
          } catch (error) {
            console.error('Failed to initialize Kakao SDK:', error);
          }
        } else {
          console.log('Kakao SDK already initialized');
        }
      } else {
        console.warn('Kakao SDK not loaded yet, retrying...');
        // SDK가 아직 로드되지 않았다면 1초 후 재시도
        setTimeout(initKakao, 1000);
      }
    };

    initKakao();
  }, []);

  if (showSearchPage) {
    return <SearchFriends isDarkMode={isDarkMode} onBack={() => setShowSearchPage(false)} userRanking={userRanking} showToast={showToast} currentUserId={currentUserId} currentUserName={currentUserName} />;
  }

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 친구 초대 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3 text-center`}>초대</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                try {
                  // KakaoTalk share with SDK if initialized
                  const inviteCode = 'ECO' + Math.random().toString(36).substr(2, 6).toUpperCase();
                  const inviteLink = `https://ecostep.app/invite?code=${inviteCode}`;

                  if (window.Kakao && window.Kakao.isInitialized()) {
                    window.Kakao.Share.sendDefault({
                      objectType: 'feed',
                      content: {
                        title: 'EcoStep',
                        description: 'Small Steps, Big Change. Why Not?',
                        imageUrl: 'https://via.placeholder.com/300x200?text=EcoStep',
                        link: {
                          mobileWebUrl: inviteLink,
                          webUrl: inviteLink,
                        },
                      },
                      buttons: [
                        {
                          title: '앱 시작하기',
                          link: {
                            mobileWebUrl: inviteLink,
                            webUrl: inviteLink,
                          },
                        },
                      ],
                    });
                    console.log('Kakao share sent successfully');
                  } else {
                    console.warn('Kakao SDK not initialized, using fallback');
                    // Fallback: Copy link and show toast
                    navigator.clipboard.writeText(inviteLink).then(() => {
                      if (showToast) {
                        showToast('카카오톡 SDK를 불러올 수 없어 링크가 복사되었습니다. 카카오톡에서 직접 공유해주세요.', 'info');
                      }
                    }).catch(() => {
                      if (showToast) {
                        showToast('카카오톡 공유 기능을 사용할 수 없습니다.', 'error');
                      }
                    });
                  }
                } catch (error) {
                  console.error('Kakao share error:', error);
                  if (showToast) {
                    showToast('카카오톡 공유 중 오류가 발생했습니다.', 'error');
                  }
                }
              }}
              className={`flex-1 relative overflow-hidden py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-all transform hover:scale-[1.02]`}
              style={{
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px -12px rgba(0,0,0,0.5)'
                  : '0 8px 24px -4px rgba(0,0,0,0.15)',
                color: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)'
              }}
            >
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
              className={`flex-1 relative overflow-hidden py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-all transform hover:scale-[1.02]`}
              style={{
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px -12px rgba(0,0,0,0.5)'
                  : '0 8px 24px -4px rgba(0,0,0,0.15)',
                color: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)'
              }}
            >
              <Link className="w-4 h-4 mr-1.5" />
              링크
            </button>
            <button 
              onClick={() => setShowSearchPage(true)}
              className={`flex-1 relative overflow-hidden py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-all transform hover:scale-[1.02]`}
              style={{
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px -12px rgba(0,0,0,0.5)'
                  : '0 8px 24px -4px rgba(0,0,0,0.15)',
                color: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)'
              }}
            >
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
              onClick={onShowFriendsList} 
              className={`text-xs ${textColor} hover:opacity-70 transition-opacity flex items-center gap-0.5`}
            >
              더보기
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div>
            {friendsList.slice(0, 3).map((friend, index) => {
              // 화면 표시 순위 (1, 2, 3)
              const displayRank = index + 1;
              const isMe = friend.name === '나';
              
              return (
                <div key={friend.rank}>
                  <div className="flex items-center justify-between" style={{ paddingTop: '0.425rem', paddingBottom: '0.425rem' }}>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center" style={{ 
                        width: '28px',
                        height: displayRank === 1 ? '28px' : displayRank === 2 ? '26px' : '24px',
                        marginRight: '8px'
                      }}>
                        {displayRank === 1 ? (
                          <PlatinumIcon size={28} />
                        ) : displayRank === 2 ? (
                          <GoldIcon size={26} />
                        ) : displayRank === 3 ? (
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
                            {friend.rank}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col items-start">
                        <span className={`${displayRank === 1 ? 'text-sm' : displayRank === 2 ? 'text-[13px]' : 'text-xs'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{friend.name}</span>
                        {friend.id && <span className={`${displayRank === 1 ? 'text-[10px]' : displayRank === 2 ? 'text-[9px]' : 'text-[8px]'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${displayRank === 1 ? '-mt-[1.5px]' : displayRank === 2 ? '-mt-[3px]' : '-mt-[1px]'}`}>@{friend.id}</span>}
                      </div>
                    </div>
                    <span className={`${displayRank === 1 ? 'text-xs' : displayRank === 2 ? 'text-[11px]' : 'text-[10px]'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{friend.score}</span>
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
                    <div className="flex items-center justify-center" style={{ 
                      width: '28px',
                      height: '24px',
                      marginRight: '8px'
                    }}>
                      <div 
                        className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {myRank}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <span className={`text-xs font-medium ${textColor}`}>나</span>
                      {currentUserId && <span className={`text-[8px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} -mt-[1px]`}>@{currentUserId}</span>}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium ${textColor}`}>{myScore}</span>
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
              onClick={onShowGlobalList} 
              className={`text-xs ${textColor} hover:opacity-70 transition-opacity flex items-center gap-0.5`}
            >
              더보기
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div>
            {globalRankingDataRaw.slice(0, 3).map((user, index) => {
              // 1등: 플래티넘, 2등: 골드, 3등: 실버
              const actualRank = index + 1; // 실제 순위
              const rankColor = actualRank === 1 ? '#ec4899' : actualRank === 2 ? '#fcd34d' : '#06b6d4';
              const isMe = user.name === '나';
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between" style={{ paddingTop: '0.425rem', paddingBottom: '0.425rem' }}>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center" style={{ 
                        width: '28px',
                        height: actualRank === 1 ? '28px' : actualRank === 2 ? '26px' : '24px',
                        marginRight: '8px'
                      }}>
                        {actualRank === 1 ? (
                          <PlatinumIcon size={28} />
                        ) : actualRank === 2 ? (
                          <GoldIcon size={26} />
                        ) : actualRank === 3 ? (
                          <SilverIcon size={24} />
                        ) : (
                          <div 
                            className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            style={{ 
                              borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
                            }}
                          >
                            {actualRank}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col items-start">
                        <span className={`${actualRank === 1 ? 'text-sm' : actualRank === 2 ? 'text-[13px]' : 'text-xs'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.name}</span>
                        {user.id && <span className={`${actualRank === 1 ? 'text-[10px]' : actualRank === 2 ? 'text-[9px]' : 'text-[8px]'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${actualRank === 1 ? '-mt-[1.5px]' : actualRank === 2 ? '-mt-[3px]' : '-mt-[1px]'}`}>@{user.id}</span>}
                      </div>
                    </div>
                    <span className={`${actualRank === 1 ? 'text-xs' : actualRank === 2 ? 'text-[11px]' : 'text-[10px]'} ${isMe ? `font-medium ${textColor}` : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.score}</span>
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
                    <div className="flex items-center justify-center" style={{ 
                      width: '28px',
                      height: '24px',
                      marginRight: '8px'
                    }}>
                      <div 
                        className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {myGlobalRank <= 99 ? myGlobalRank : '···'}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <span className={`text-xs font-medium ${textColor}`}>나</span>
                      {currentUserId && <span className={`text-[8px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} -mt-[1px]`}>@{currentUserId}</span>}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium ${textColor}`}>
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