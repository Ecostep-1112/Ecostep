import React, { useState } from 'react';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { UserPlus } from 'lucide-react';

const SearchFriends = ({ isDarkMode, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-400';

  // 나의 아이디 (예시)
  const myId = '12345';

  // 검색 함수
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setHasSearched(true);
      // 여기서는 예시 데이터를 사용합니다. 실제로는 API 호출이 필요합니다.
      const mockResults = [
        { id: '23456', name: '김민수', profileImage: null },
        { id: '34567', name: '이지은', profileImage: null },
        { id: '45678', name: '박서준', profileImage: null },
      ].filter(user => 
        user.id.includes(searchTerm) || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(mockResults);
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
    alert('친구 요청을 보냈습니다!');
  };

  return (
    <div className={`fixed inset-0 z-50 ${bgColor}`}>
      {/* 헤더 */}
      <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
        <button onClick={onBack} className={`p-2 ${textColor}`}>
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h2 className={`text-lg font-semibold ${textColor}`}>아이디 검색</h2>
        <div className="w-9"></div>
      </div>

      <div className="p-4">
        {/* 검색창 */}
        <div className="relative mb-6">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="아이디 검색" 
            className={`w-full border ${borderColor} ${inputBg} ${textColor} ${placeholderColor} rounded-lg pl-10 pr-20 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <FiSearch className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <button 
            onClick={handleSearch}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-md text-sm ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} hover:opacity-80 transition-opacity`}
          >
            검색
          </button>
        </div>

        {/* 나의 아이디 */}
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4 mb-6`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>나의 아이디</span>
            <span className={`text-lg font-semibold ${textColor}`}>{myId}</span>
          </div>
        </div>

        {/* 검색 결과 */}
        {hasSearched && (
          <div className="space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user.id} className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* 프로필 이미지 */}
                      <div className={`w-12 h-12 rounded-full ${inputBg} flex items-center justify-center`}>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.name[0]}
                          </span>
                        )}
                      </div>
                      {/* 이름과 아이디 */}
                      <div>
                        <p className={`font-medium ${textColor}`}>{user.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {user.id}</p>
                      </div>
                    </div>
                    {/* 추가하기 버튼 */}
                    <button 
                      onClick={() => handleAddFriend(user.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 border ${borderColor} ${isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'} transition-colors`}
                    >
                      <UserPlus className="w-4 h-4" />
                      추가하기
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="text-sm">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriends;