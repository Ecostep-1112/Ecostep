import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MessageCircle, Link, Check } from 'lucide-react';
import friendsRanking from '../data/friendsRanking.json';
import globalRanking from '../data/globalRanking.json';

const Community = ({ isDarkMode, onShowFriendsList }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeRankingTab, setActiveRankingTab] = useState('friends'); // 'friends' or 'global'
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

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
          <h3 className={`${textColor} text-sm font-medium mb-2`}>커뮤니티</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-3`}>친구들과 함께 지구를 지켜요!</p>
          <div className="flex gap-2 mb-3">
            <button 
              onClick={shareToKakao}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              카톡으로 초대
            </button>
            <button 
              onClick={() => {
                // Generate unique invite code
                const inviteCode = 'ECO' + Math.random().toString(36).substr(2, 6).toUpperCase();
                const inviteLink = `https://ecostep.app/invite?code=${inviteCode}`;
                
                // Copy to clipboard
                navigator.clipboard.writeText(inviteLink).then(() => {
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }).catch(() => {
                  // Fallback for older browsers
                  const textArea = document.createElement('textarea');
                  textArea.value = inviteLink;
                  document.body.appendChild(textArea);
                  textArea.select();
                  document.execCommand('copy');
                  document.body.removeChild(textArea);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                });
              }}
              className={`flex-1 ${
                linkCopied ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
              } text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors`}
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  복사 완료!
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-1" />
                  링크 복사
                </>
              )}
            </button>
          </div>
          {/* 친구 검색 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="아이디로 친구 검색" 
                className={`w-full border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg pl-10 pr-3 py-2 text-sm`}
              />
              <FiSearch className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">검색</button>
          </div>
        </div>

        {/* 랭킹 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          {/* 탭 버튼 */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveRankingTab('friends')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                activeRankingTab === 'friends'
                  ? 'bg-blue-500 text-white'
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
              }`}
            >
              내 친구 랭킹
            </button>
            <button
              onClick={() => setActiveRankingTab('global')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                activeRankingTab === 'global'
                  ? 'bg-blue-500 text-white'
                  : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
              }`}
            >
              전체 랭킹
            </button>
          </div>

          {/* 친구 랭킹 */}
          {activeRankingTab === 'friends' && (
            <>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>내 친구 TOP 5</h3>
              <div className="space-y-2">
                {friendsRanking.friends.slice(0, 5).map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium w-8 ${friend.rank <= 3 ? 'text-yellow-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {friend.rank <= 3 ? ["🥇", "🥈", "🥉"][friend.rank - 1] : `#${friend.rank}`}
                      </span>
                      <span className="text-lg mr-2">{friend.avatar}</span>
                      <div className="flex-1">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{friend.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Lv.{friend.level} · {friend.streak}일 연속</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{friend.points.toLocaleString()}P</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{(friend.plasticReduced / 1000).toFixed(1)}kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 전체 랭킹 */}
          {activeRankingTab === 'global' && (
            <>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>전체 TOP 5</h3>
              <div className="space-y-2">
                {globalRanking.global.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium w-8 ${user.rank <= 3 ? 'text-yellow-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.rank <= 3 ? ["🏆", "🥈", "🥉"][user.rank - 1] : `#${user.rank}`}
                      </span>
                      <span className="text-lg mr-2">{user.badge}</span>
                      <div className="flex-1">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.name}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Lv.{user.level} · {user.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.points.toLocaleString()}P</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{(user.plasticReduced / 1000).toFixed(1)}kg</p>
                    </div>
                  </div>
                ))}
                <div className={`border-t ${borderColor} pt-2 mt-2`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>내 순위</span>
                    <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>상위 15%</span>
                  </div>
                </div>
              </div>
            </>
          )}


          <button 
            onClick={() => onShowFriendsList(activeRankingTab === 'friends' ? 'friends' : 'global')}
            className="w-full mt-3 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
          >
            더보기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;