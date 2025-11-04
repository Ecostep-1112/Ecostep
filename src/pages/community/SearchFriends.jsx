import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SearchFriends = ({ isDarkMode, onBack, userRanking = 'bronze', showToast, currentUserId = '', currentUserName = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [addedFriends, setAddedFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-400';

  // Supabase에서 사용자 목록 불러오기
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_info')
        .select('user_id, name, point_current, points_total');

      if (error) throw error;

      // 기본 프로필 이미지 설정
      const formattedUsers = data.map(user => ({
        id: user.user_id,
        name: user.name,
        profileImage: null,
        plasticSaved: user.points_total || 0
      }));

      setAllUsers(formattedUsers);
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
      // 에러 발생 시 기본 데이터 사용
      setAllUsers([
        { id: 'songil_eco', name: '송일', profileImage: null, plasticSaved: 15500 },
        { id: 'wonhee_nature', name: '원희', profileImage: null, plasticSaved: 27000 },
      ]);
    }
  };

  // Supabase에서 친구 목록 불러오기
  const loadFriends = async () => {
    if (!currentUserId) {
      // localStorage에서 프로필 데이터 확인
      const savedProfileData = localStorage.getItem('profileData');
      if (savedProfileData) {
        try {
          const parsed = JSON.parse(savedProfileData);
          const userId = parsed.userId;
          if (!userId) return;

          const { data, error } = await supabase
            .from('user_friend')
            .select('friend_id')
            .eq('user_id', userId)
            .eq('status', 'accepted');

          if (error) throw error;

          const friendIds = data.map(f => f.friend_id);
          setAddedFriends(friendIds);
        } catch (e) {
          console.error('친구 목록 로드 실패:', e);
        }
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_friend')
        .select('friend_id')
        .eq('user_id', currentUserId)
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
    loadUsers();
    loadFriends();
  }, [currentUserId]);

  // 검색 함수
  const handleSearch = () => {
    setHasSearched(true);
    
    // localStorage에서 프로필 데이터 확인
    const savedProfileData = localStorage.getItem('profileData');
    let savedUserId = '';
    let savedUserName = '';
    
    if (savedProfileData) {
      try {
        const parsed = JSON.parse(savedProfileData);
        savedUserId = parsed.userId || '';
        savedUserName = parsed.name || '';
      } catch (e) {
        console.error('프로필 데이터 파싱 오류:', e);
      }
    }
    
    const userId = currentUserId || savedUserId;
    const userName = currentUserName || savedUserName;
    
    // 디버깅용 로그
    console.log('User ID:', userId);
    console.log('User Name:', userName);
    console.log('Search Term:', searchTerm);
    console.log('All Users:', allUsers);
    
    // 프로필 아이디나 이름이 설정되지 않은 경우
    if (!userId && !userName) {
      if (showToast) {
        showToast('먼저 설정에서 프로필을 등록해주세요', 'warning');
      }
      setSearchResults([]);
      return;
    }
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      let results = [];
      
      // 아이디로 검색하는 경우
      const idResults = allUsers.filter(user => {
        // 정확한 아이디 매치
        return user.id.toLowerCase() === searchLower;
      });
      
      if (idResults.length > 0) {
        results = idResults;
      }
      
      // 이름으로 검색하는 경우 (아이디 검색 결과가 없을 때)
      if (results.length === 0) {
        const nameResults = allUsers.filter(user => {
          // 정확한 이름 매치
          return user.name === searchTerm.trim();
        });
        
        if (nameResults.length > 0) {
          results = nameResults;
        }
      }
      
      // 본인은 검색 결과에서 제외
      if (userId) {
        results = results.filter(user => user.id !== userId);
      }
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddFriend = async (friendId) => {
    // 이미 친구인지 확인
    if (addedFriends.includes(friendId)) {
      if (showToast) {
        showToast('이미 친구입니다!', 'warning');
      }
      return;
    }

    // 현재 사용자 ID 가져오기
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

    if (!userId) {
      if (showToast) {
        showToast('먼저 설정에서 프로필을 등록해주세요', 'warning');
      }
      return;
    }

    try {
      // Supabase에 친구 추가
      const { error } = await supabase
        .from('user_friend')
        .insert({
          user_id: userId,
          friend_id: friendId,
          status: 'accepted',
          accepted_at: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      // 상태 업데이트
      const newAddedFriends = [...addedFriends, friendId];
      setAddedFriends(newAddedFriends);

      if (showToast) {
        showToast('친구가 추가되었습니다!', 'success');
      }
    } catch (error) {
      console.error('친구 추가 실패:', error);
      if (showToast) {
        showToast('친구 추가에 실패했습니다', 'error');
      }
    }
  };

  return (
    <div className={`w-full h-full ${bgColor} overflow-y-auto`}>
      {/* 헤더 */}
      <div className={`flex items-center p-4 border-b ${borderColor}`}>
        <button onClick={onBack} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>아이디</h2>
      </div>

      <div className="p-4 pb-20">
        {/* 검색창 */}
        <div className="flex gap-2 mb-6 items-center">
          <div className="flex-1 relative h-10">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="이름 또는 아이디 검색" 
              className={`w-full h-full bg-transparent ${textColor} ${placeholderColor} rounded-xl pl-4 ${searchTerm ? 'pr-10' : 'pr-4'} text-sm focus:outline-none border ${borderColor}`}
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                  setHasSearched(false);
                }}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={handleSearch}
            className={`bg-transparent ${textColor} w-10 h-10 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity flex items-center justify-center border ${borderColor}`}
          >
            <Search className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
        </div>


        {/* 검색 결과 */}
        {hasSearched && (
          <div className="space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.id} className={`${cardBg} border ${borderColor} rounded-xl p-3 flex items-center`}>
                  <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center mr-3 overflow-hidden`}>
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className={`font-medium text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${textColor}`}>{user.name}</p>
                    <p className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{user.id}</p>
                  </div>
                  <div className="flex items-center">
                    {addedFriends.includes(user.id) ? (
                      <button 
                        onClick={() => handleAddFriend(user.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                        disabled={true}
                      >
                        친구
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAddFriend(user.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors relative ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                        style={{
                          border: '1px solid transparent',
                          backgroundImage: `linear-gradient(${isDarkMode ? '#111827' : '#ffffff'}, ${isDarkMode ? '#111827' : '#ffffff'}), linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)`,
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'padding-box, border-box'
                        }}
                      >
                        <span 
                          style={{
                            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          추가
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="text-sm">찾은 결과 없음</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriends;