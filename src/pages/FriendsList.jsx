import React, { useState } from 'react';
import { ArrowLeft, Search, Medal, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const FriendsList = ({ isDarkMode, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Extended friends data
  const allFriends = [
    { rank: 1, name: '김민수', plastic: 320, weeklyChange: 15, trend: 'up', level: 'Gold' },
    { rank: 2, name: '이서연', plastic: 280, weeklyChange: -20, trend: 'down', level: 'Gold' },
    { rank: 3, name: '박지훈', plastic: 250, weeklyChange: 0, trend: 'same', level: 'Silver' },
    { rank: 4, name: '최유진', plastic: 230, weeklyChange: 10, trend: 'up', level: 'Silver' },
    { rank: 5, name: '정하늘', plastic: 220, weeklyChange: -5, trend: 'down', level: 'Silver' },
    { rank: 6, name: '강민지', plastic: 215, weeklyChange: 8, trend: 'up', level: 'Silver' },
    { rank: 7, name: '윤서준', plastic: 200, weeklyChange: -12, trend: 'down', level: 'Bronze' },
    { rank: 8, name: '임채원', plastic: 195, weeklyChange: 0, trend: 'same', level: 'Bronze' },
    { rank: 9, name: '송민호', plastic: 180, weeklyChange: 5, trend: 'up', level: 'Bronze' },
    { rank: 10, name: '한지우', plastic: 175, weeklyChange: -8, trend: 'down', level: 'Bronze' },
    { rank: 11, name: '오현우', plastic: 170, weeklyChange: 3, trend: 'up', level: 'Bronze' },
    { rank: 12, name: '남도현', plastic: 165, weeklyChange: -10, trend: 'down', level: 'Bronze' },
    { rank: 13, name: '문서영', plastic: 160, weeklyChange: 0, trend: 'same', level: 'Bronze' },
    { rank: 14, name: '배준서', plastic: 155, weeklyChange: 7, trend: 'up', level: 'Bronze' },
    { rank: 15, name: '류하은', plastic: 150, weeklyChange: -3, trend: 'down', level: 'Bronze' },
    { rank: 16, name: '신재원', plastic: 145, weeklyChange: 2, trend: 'up', level: 'Bronze' },
    { rank: 17, name: '우성민', plastic: 140, weeklyChange: -15, trend: 'down', level: 'Bronze' },
    { rank: 18, name: '조예린', plastic: 135, weeklyChange: 0, trend: 'same', level: 'Bronze' },
    { rank: 19, name: '허진아', plastic: 130, weeklyChange: 4, trend: 'up', level: 'Bronze' },
    { rank: 20, name: '구본승', plastic: 125, weeklyChange: -6, trend: 'down', level: 'Bronze' }
  ];
  
  const filteredFriends = allFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  
  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };
  
  const getLevelColor = (level) => {
    switch(level) {
      case 'Gold': return 'text-yellow-500';
      case 'Silver': return 'text-gray-400';
      case 'Bronze': return 'text-orange-600';
      default: return 'text-gray-500';
    }
  };
  
  const getTrendIcon = (trend, change) => {
    if (trend === 'up') {
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="w-3 h-3 text-red-500" />;
    }
    return <Minus className="w-3 h-3 text-gray-400" />;
  };
  
  return (
    <div className={`h-full flex flex-col ${bgColor}`}>
      {/* Header */}
      <div className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center`}>
        <button
          onClick={onBack}
          className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-3`}
        >
          <ArrowLeft className={`w-5 h-5 ${textColor}`} />
        </button>
        <h2 className={`text-lg font-semibold ${textColor}`}>친구 랭킹</h2>
      </div>
      
      {/* Search Bar */}
      <div className={`${cardBg} border-b ${borderColor} px-4 py-3`}>
        <div className={`relative`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="친구 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${inputBg} rounded-lg text-sm ${textColor} placeholder-gray-400`}
          />
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className={`${cardBg} border-b ${borderColor} px-4 py-3`}>
        <div className="flex justify-around">
          <div className="text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>전체 친구</p>
            <p className={`text-lg font-bold ${textColor}`}>{allFriends.length}명</p>
          </div>
          <div className="text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>평균 절감량</p>
            <p className={`text-lg font-bold text-green-500`}>
              {Math.round(allFriends.reduce((sum, f) => sum + f.plastic, 0) / allFriends.length)}g
            </p>
          </div>
          <div className="text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>내 순위</p>
            <p className={`text-lg font-bold text-blue-500`}>4위</p>
          </div>
        </div>
      </div>
      
      {/* Friends List */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide`}>
        {filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFriends.map((friend) => (
              <div
                key={friend.rank}
                className={`${cardBg} px-4 py-3 flex items-center justify-between hover:bg-opacity-50 transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  {/* Rank */}
                  <div className="w-8 text-center">
                    <span className={`font-bold ${friend.rank <= 3 ? 'text-lg' : 'text-sm'} ${textColor}`}>
                      {getRankBadge(friend.rank)}
                    </span>
                  </div>
                  
                  {/* Profile */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {friend.name[0]}
                    </span>
                  </div>
                  
                  {/* Name and Level */}
                  <div>
                    <p className={`text-sm font-medium ${textColor}`}>{friend.name}</p>
                    <p className={`text-xs ${getLevelColor(friend.level)}`}>
                      <Medal className="w-3 h-3 inline mr-1" />
                      {friend.level}
                    </p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center space-x-4">
                  {/* Weekly Change */}
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(friend.trend, friend.weeklyChange)}
                    <span className={`text-xs ${
                      friend.trend === 'up' ? 'text-green-500' : 
                      friend.trend === 'down' ? 'text-red-500' : 
                      'text-gray-400'
                    }`}>
                      {friend.weeklyChange > 0 ? '+' : ''}{friend.weeklyChange}g
                    </span>
                  </div>
                  
                  {/* Total Plastic */}
                  <div className="text-right">
                    <p className={`text-sm font-bold ${textColor}`}>{friend.plastic}g</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>절감량</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;