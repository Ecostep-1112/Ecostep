import React, { useState } from 'react';
import { MessageCircle, Link, UserSearch, ChevronDown } from 'lucide-react';
import SearchFriends from './SearchFriends';

const Community = ({ isDarkMode, onShowFriendsList, onShowGlobalList, showToast, userRanking }) => {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  
  // 나의 랭킹 (1~3위가 아닐 경우를 위한 더미 데이터)
  const myRank = 5;
  const isInTop3 = myRank <= 3;
  
  // 전체 사용자 수와 나의 순위로 상위 퍼센트 계산
  const totalUsers = 1500; // 전체 사용자 수
  const myGlobalRank = 152; // 나의 전체 순위
  const topPercentage = Math.round((myGlobalRank / totalUsers) * 100);
  
  // 친구 목록 데이터
  const friendsList = [
    { rank: 1, name: '일이', score: '27.3kg' },
    { rank: 2, name: '이이', score: '18.7kg' },
    { rank: 3, name: '삼이', score: '15.2kg' },
    { rank: 4, name: '사이', score: '12.1kg' },
    { rank: 5, name: '나', score: '8.5kg' },
    { rank: 6, name: '오이', score: '7.8kg' },
    { rank: 7, name: '육이', score: '6.2kg' },
  ];

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
              const rankColor = friend.rank === 1 ? '#c084fc' : friend.rank === 2 ? '#facc15' : '#14b8a6';
              const isMe = friend.name === '나';
              
              return (
                <div key={friend.rank}>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                        {friend.rank === 1 ? (
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
                        ) : friend.rank === 2 ? (
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
                        ) : friend.rank === 3 ? (
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
                            {friend.rank}
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
                  <span className={`text-xs font-medium ${textColor} relative`} style={{ top: '-1px' }}>{friendsList.find(f => f.name === '나')?.score || '8.5kg'}</span>
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
            {[
              { rank: 1, name: 'PlasticZero', score: '45.2kg' },
              { rank: 2, name: 'EcoMaster', score: '42.1kg' },
              { rank: 3, name: 'GreenWarrior', score: '38.9kg' },
            ].map((user, index) => {
              // 1등: 플래티넘, 2등: 골드, 3등: 실버
              const rankColor = user.rank === 1 ? '#c084fc' : user.rank === 2 ? '#facc15' : '#14b8a6';
              const isMe = false; // 전체 랭킹에는 '나'가 상위 3명에 없다고 가정
              
              return (
                <div key={user.rank}>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                        {user.rank === 1 ? (
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
                        ) : user.rank === 2 ? (
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
                        ) : user.rank === 3 ? (
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
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{user.name}</span>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} relative`} style={{ top: '-1px' }}>{user.score}</span>
                  </div>
                  {index < 2 && <div className={`border-b ${borderColor}`}></div>}
                </div>
              );
            })}
            {/* 나의 랭킹 (전체에서는 상위 %로 표시) */}
            <div className={`border-t ${borderColor}`}></div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center">
                <div className="flex items-center justify-center mr-2" style={{ width: '20px', height: '20px' }}>
                  <div 
                    className={`w-[17.6px] h-[17.6px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  >
                    ···
                  </div>
                </div>
                <span className={`text-sm font-medium ${textColor} relative`} style={{ top: '-1px' }}>나</span>
              </div>
              <span className={`text-xs font-medium ${textColor} relative`} style={{ top: '-1px' }}>
                <span style={{ fontSize: '11px' }}>상위</span> {topPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;