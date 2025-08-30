import React, { useState } from 'react';
import { ArrowLeft, Search, Medal, TrendingUp, TrendingDown, Minus, Globe, Users } from 'lucide-react';
import friendsRanking from '../data/friendsRanking.json';
import globalRanking from '../data/globalRanking.json';

const RankingList = ({ isDarkMode, onBack, initialTab = 'friends' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  
  const getRankBadge = (rank) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };
  
  const getTrendIcon = (streak) => {
    if (streak > 30) {
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    } else if (streak > 10) {
      return <Minus className="w-3 h-3 text-yellow-500" />;
    }
    return <TrendingDown className="w-3 h-3 text-gray-400" />;
  };

  // Filter data based on search
  const filteredFriends = friendsRanking.friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlobal = globalRanking.global.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = activeTab === 'friends' ? filteredFriends : filteredGlobal;
  const originalData = activeTab === 'friends' ? friendsRanking.friends : globalRanking.global;
  
  return (
    <div className={`h-full flex flex-col ${bgColor}`}>
      {/* Header */}
      <div className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-3`}
          >
            <ArrowLeft className={`w-5 h-5 ${textColor}`} />
          </button>
          <h2 className={`text-lg font-semibold ${textColor}`}>랭킹</h2>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className={`${cardBg} border-b ${borderColor} px-4 py-2`}>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'friends'
                ? 'bg-blue-500 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            <Users className="w-4 h-4" />
            내 친구 랭킹
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'global'
                ? 'bg-blue-500 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            <Globe className="w-4 h-4" />
            전체 랭킹
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className={`${cardBg} border-b ${borderColor} px-4 py-3`}>
        <div className={`relative`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder={activeTab === 'friends' ? "친구 검색..." : "사용자 검색..."}
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
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {activeTab === 'friends' ? '전체 친구' : '전체 참가자'}
            </p>
            <p className={`text-lg font-bold ${textColor}`}>
              {originalData.length}{activeTab === 'friends' ? '명' : '명'}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>평균 절감량</p>
            <p className={`text-lg font-bold text-green-500`}>
              {activeTab === 'friends' 
                ? `${(friendsRanking.friends.reduce((sum, f) => sum + f.plasticReduced, 0) / friendsRanking.friends.length / 1000).toFixed(1)}kg`
                : `${(globalRanking.global.reduce((sum, u) => sum + u.plasticReduced, 0) / globalRanking.global.length / 1000).toFixed(1)}kg`
              }
            </p>
          </div>
          <div className="text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>내 순위</p>
            <p className={`text-lg font-bold text-blue-500`}>
              {activeTab === 'friends' ? '4위' : '상위 15%'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Ranking List */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide`}>
        {currentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((item) => (
              <div
                key={item.id}
                className={`${cardBg} px-4 py-3 flex items-center justify-between hover:bg-opacity-50 transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  {/* Rank */}
                  <div className="w-10 text-center">
                    <span className={`font-bold ${item.rank <= 3 ? 'text-lg' : 'text-sm'} ${
                      item.rank <= 3 ? 'text-yellow-500' : textColor
                    }`}>
                      {getRankBadge(item.rank)}
                    </span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="text-2xl">
                    {activeTab === 'friends' ? item.avatar : item.badge}
                  </div>
                  
                  {/* Name and Info */}
                  <div>
                    <p className={`text-sm font-medium ${textColor}`}>{item.name}</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Lv.{item.level}
                      </p>
                      {activeTab === 'friends' ? (
                        <p className={`text-xs ${item.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                          {item.status === 'online' ? '● 온라인' : '○ 오프라인'}
                        </p>
                      ) : (
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center space-x-4">
                  {/* Streak/Trend */}
                  {activeTab === 'friends' && (
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(item.streak)}
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.streak}일
                      </span>
                    </div>
                  )}
                  
                  {/* Points and Plastic */}
                  <div className="text-right">
                    <p className={`text-sm font-bold ${textColor}`}>
                      {item.points.toLocaleString()}P
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {(item.plasticReduced / 1000).toFixed(1)}kg
                    </p>
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

export default RankingList;