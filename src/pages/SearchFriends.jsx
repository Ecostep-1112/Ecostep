import React, { useState } from 'react';
import { FiSearch, FiChevronRight, FiX } from 'react-icons/fi';

const SearchFriends = ({ isDarkMode, onBack, userRanking = 'bronze', showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-400';

  // 나의 아이디
  const myId = 'songil_eco';

  // 검색 함수
  const handleSearch = () => {
    setHasSearched(true);
    if (searchTerm.trim()) {
      // 여기서는 예시 데이터를 사용합니다. 실제로는 API 호출이 필요합니다.
      const mockResults = [
        { id: 'songil_eco', name: '송일', profileImage: null },
        { id: 'minsu_123', name: '김민수', profileImage: null },
        { id: 'jieun_green', name: '이지은', profileImage: null },
        { id: 'seojun_earth', name: '박서준', profileImage: null },
      ].filter(user => 
        user.id.toLowerCase() === searchTerm.toLowerCase() || 
        user.name === searchTerm
      );
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddFriend = (userId) => {
    // 친구 추가 로직
    console.log('친구 추가:', userId);
    if (showToast) {
      showToast('친구 요청을 보냈습니다!', 'success');
    }
  };

  return (
    <div className={`w-full h-full ${bgColor} overflow-y-auto`}>
      {/* 헤더 */}
      <div className={`flex items-center p-4 border-b ${borderColor}`}>
        <button onClick={onBack} className="mr-3">
          <FiChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
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
              placeholder="아이디 검색" 
              className={`w-full h-full bg-transparent ${textColor} ${placeholderColor} rounded-lg pl-10 ${searchTerm ? 'pr-10' : 'pr-4'} text-sm focus:outline-none`}
            />
            <FiSearch className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                  setHasSearched(false);
                }}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
            {/* 그라데이션 테두리 */}
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
          </div>
          <button 
            onClick={handleSearch}
            className={`relative bg-transparent ${textColor} w-10 h-10 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity overflow-hidden flex items-center justify-center`}
          >
            <FiSearch className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            {/* 그라데이션 테두리 */}
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
          </button>
        </div>


        {/* 검색 결과 */}
        {hasSearched && (
          <div className="space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.id} className="relative">
                  <div className={`bg-transparent rounded-lg p-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      {/* 프로필 이미지 */}
                      <div className={`w-10 h-10 rounded-full ${inputBg} flex items-center justify-center`}>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.name[0]}
                          </span>
                        )}
                      </div>
                      {/* 아이디와 이름 */}
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.id}</p>
                        <p className={`text-sm ${textColor}`}>{user.name}</p>
                      </div>
                    </div>
                    {/* 추가하기 버튼 */}
                    <button 
                      onClick={() => handleAddFriend(user.id)}
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors border bg-transparent ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      style={{
                        borderColor: userRanking === 'bronze' ? '#06b6d4' : 
                                    userRanking === 'silver' ? '#14b8a6' : 
                                    userRanking === 'gold' ? '#facc15' : 
                                    userRanking === 'platinum' ? '#c084fc' : 
                                    userRanking === 'basic' ? (isDarkMode ? '#e5e7eb' : '#374151') :
                                    isDarkMode ? '#e5e7eb' : '#374151'
                      }}
                    >
                      추가하기
                    </button>
                  </div>
                  {/* 그라데이션 테두리 */}
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