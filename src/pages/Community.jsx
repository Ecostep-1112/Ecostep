import React, { useState } from 'react';
import { MessageCircle, Link, UserSearch, ChevronDown } from 'lucide-react';
import SearchFriends from './SearchFriends';

const Community = ({ isDarkMode, onShowFriendsList, onShowGlobalList, showToast, userRanking, totalPlasticSaved = 0 }) => {
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
  
  // 친구 목록 데이터 (나의 실제 데이터 반영) - FriendsList와 동일하게
  let friendsListRaw = [
    { name: '일이', score: '27.0kg', grams: 27000 },
    { name: '이이', score: '24.0kg', grams: 24000 },
    { name: '삼이', score: '21.0kg', grams: 21000 },
    { name: '사이', score: '18.0kg', grams: 18000 },
    { name: '나', score: myScore, grams: totalPlasticSaved },
    { name: '친구6', score: '28.2kg', grams: 28200 },
    { name: '친구7', score: '27.9kg', grams: 27900 },
    { name: '친구8', score: '27.6kg', grams: 27600 },
    { name: '친구9', score: '27.3kg', grams: 27300 },
    { name: '친구10', score: '27.0kg', grams: 27000 },
    { name: '친구11', score: '26.7kg', grams: 26700 },
    { name: '친구12', score: '26.4kg', grams: 26400 },
    { name: '친구13', score: '26.1kg', grams: 26100 },
    { name: '친구14', score: '25.8kg', grams: 25800 },
    { name: '친구15', score: '25.5kg', grams: 25500 },
    { name: '친구16', score: '25.2kg', grams: 25200 },
    { name: '친구17', score: '24.9kg', grams: 24900 },
    { name: '친구18', score: '24.6kg', grams: 24600 },
    { name: '친구19', score: '15.0kg', grams: 15000 },
    { name: '친구20', score: '12.0kg', grams: 12000 },
  ];
  
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
    return <SearchFriends isDarkMode={isDarkMode} onBack={() => setShowSearchPage(false)} userRanking={userRanking} showToast={showToast} />;
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
                // KakaoTalk share
                if (window.Kakao) {
                  window.Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                      title: 'Ecostep - 함께 지구를 지켜요!',
                      description: '플라스틱 사용량을 줄이고 물고기를 키워보세요! 함께 환경을 보호해요.',
                      imageUrl: 'https://ecostep.app/share-image.png',
                      link: {
                        mobileWebUrl: 'https://ecostep.app/invite?code=ABC123',
                        webUrl: 'https://ecostep.app/invite?code=ABC123',
                      },
                    },
                    buttons: [
                      {
                        title: '앱 시작하기',
                        link: {
                          mobileWebUrl: 'https://ecostep.app/invite?code=ABC123',
                          webUrl: 'https://ecostep.app/invite?code=ABC123',
                        },
                      },
                    ],
                  });
                } else {
                  // Fallback: open KakaoTalk app or web
                  const message = encodeURIComponent('Ecostep 앱에서 함께 환경을 보호해요! https://ecostep.app/invite?code=ABC123');
                  window.open(`kakaotalk://msg/text/${message}`, '_blank');
                  
                  // If KakaoTalk app doesn't open, try web version
                  setTimeout(() => {
                    window.open(`https://talk.kakao.com`, '_blank');
                  }, 1000);
                }
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
              onClick={onShowFriendsList} 
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
              const rankColor = displayRank === 1 ? '#c084fc' : displayRank === 2 ? '#facc15' : '#14b8a6';
              const isMe = friend.name === '나';
              
              return (
                <div key={friend.rank}>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                        {displayRank === 1 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="platinumGradient-comm-f" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e9d5ff" />
                                <stop offset="30%" stopColor="#c084fc" />
                                <stop offset="60%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#platinumGradient-comm-f)"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.8"/>
                            <circle cx="50" cy="50" r="36" fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.6"/>
                            <path d="M50 25 L35 40 L65 40 Z" fill="#f3e8ff" stroke="#e9d5ff" strokeWidth="1"/>
                            <path d="M35 40 L50 70 L65 40 Z" fill="#ede9fe" stroke="#e9d5ff" strokeWidth="1"/>
                            <ellipse cx="48" cy="35" rx="8" ry="4" fill="white" opacity="0.4"/>
                          </svg>
                        ) : displayRank === 2 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="goldGradient-comm-f" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fde047" />
                                <stop offset="50%" stopColor="#facc15" />
                                <stop offset="100%" stopColor="#f59e0b" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#goldGradient-comm-f)"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.8"/>
                            <circle cx="50" cy="50" r="15" fill="#fef3c7"/>
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                              <rect key={i} x="48" y="25" width="4" height="12" fill="#fef3c7" rx="2" transform={`rotate(${angle} 50 50)`}/>
                            ))}
                            <circle cx="47" cy="47" r="6" fill="white" opacity="0.4"/>
                          </svg>
                        ) : displayRank === 3 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="silverGradient-comm-f" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e2e8f0" />
                                <stop offset="50%" stopColor="#94a3b8" />
                                <stop offset="100%" stopColor="#64748b" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#silverGradient-comm-f)"/>
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
              const displayRank = index + 1;
              const rankColor = displayRank === 1 ? '#c084fc' : displayRank === 2 ? '#facc15' : '#14b8a6';
              const isMe = user.name === '나';
              
              return (
                <div key={user.rank}>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                        {displayRank === 1 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="platinumGradient-comm-g" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e9d5ff" />
                                <stop offset="30%" stopColor="#c084fc" />
                                <stop offset="60%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#platinumGradient-comm-g)"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.8"/>
                            <circle cx="50" cy="50" r="36" fill="none" stroke="#e9d5ff" strokeWidth="1" opacity="0.6"/>
                            <path d="M50 25 L35 40 L65 40 Z" fill="#f3e8ff" stroke="#e9d5ff" strokeWidth="1"/>
                            <path d="M35 40 L50 70 L65 40 Z" fill="#ede9fe" stroke="#e9d5ff" strokeWidth="1"/>
                            <ellipse cx="48" cy="35" rx="8" ry="4" fill="white" opacity="0.4"/>
                          </svg>
                        ) : displayRank === 2 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="goldGradient-comm-g" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fde047" />
                                <stop offset="50%" stopColor="#facc15" />
                                <stop offset="100%" stopColor="#f59e0b" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#goldGradient-comm-g)"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.8"/>
                            <circle cx="50" cy="50" r="15" fill="#fef3c7"/>
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                              <rect key={i} x="48" y="25" width="4" height="12" fill="#fef3c7" rx="2" transform={`rotate(${angle} 50 50)`}/>
                            ))}
                            <circle cx="47" cy="47" r="6" fill="white" opacity="0.4"/>
                          </svg>
                        ) : displayRank === 3 ? (
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                            <defs>
                              <linearGradient id="silverGradient-comm-g" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e2e8f0" />
                                <stop offset="50%" stopColor="#94a3b8" />
                                <stop offset="100%" stopColor="#64748b" />
                              </linearGradient>
                            </defs>
                            <circle cx="50" cy="50" r="45" fill="url(#silverGradient-comm-g)"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.7"/>
                            <path d="M 40 30 C 30 30, 25 40, 25 50 C 25 60, 30 70, 40 70 C 35 65, 32 58, 32 50 C 32 42, 35 35, 40 30" fill="#e0f2fe"/>
                            <path d="M 60 40 L 63 47 L 70 47 L 64 52 L 67 59 L 60 54 L 53 59 L 56 52 L 50 47 L 57 47 Z" fill="#bae6fd"/>
                          </svg>
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