import React, { useState } from 'react';
import { MessageCircle, Link, UserSearch, ChevronDown } from 'lucide-react';
import SearchFriends from './SearchFriends';

const Community = ({ isDarkMode, onShowFriendsList, showToast, userRanking }) => {
  const [showSearchPage, setShowSearchPage] = useState(false);
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  
  // 나의 랭킹 (1~3위가 아닐 경우를 위한 더미 데이터)
  const myRank = 5;
  const isInTop3 = myRank <= 3;
  
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
                      <div 
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 text-[10px] font-medium ${
                          isMe ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                        }`}
                        style={{ 
                          borderColor: isMe ? (isDarkMode ? '#9ca3af' : '#6b7280') : rankColor,
                          color: !isMe && rankColor
                        }}
                      >
                        {friend.rank}
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
                    <div 
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 text-[10px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                    >
                      {myRank}
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
          <h3 className={`${textColor} text-sm font-medium mb-3`}>전체 랭킹</h3>
          <div className="space-y-2">
            {[
              { rank: 1, name: 'PlasticZero', score: '45.2kg' },
              { rank: 2, name: 'EcoMaster', score: '42.1kg' },
              { rank: 3, name: 'GreenWarrior', score: '38.9kg' },
            ].map((team) => (
              <div key={team.rank} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                    {team.rank}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{team.name}</span>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{team.score}</span>
              </div>
            ))}
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pt-2 mt-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-6 h-6 ${inputBg} rounded-full flex items-center justify-center text-xs mr-3`}>나</div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>나</span>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>상위 12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;