import React from 'react';
import { FiSearch } from 'react-icons/fi';

const Community = ({ isDarkMode }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 친구 초대 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-2`}>커뮤니티</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-3`}>친구들과 함께 지구를 지켜요!</p>
          <div className="flex gap-2 mb-3">
            <button className="flex-1 bg-yellow-400 text-black py-2 rounded-lg text-sm font-medium">
              카톡으로 초대
            </button>
            <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium">
              링크 복사
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

        {/* 친구 랭킹 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3`}>내 친구 랭킹 TOP 3</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-3">🥇</span>
                <div className={`w-8 h-8 ${inputBg} rounded-full flex items-center justify-center text-xs font-medium mr-3`}>O</div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>OceanGuardian</span>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>27.3kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-3">🥈</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3 ring-2 ring-blue-300">나</div>
                <span className={`text-sm font-medium ${textColor}`}>나 (EcoWarrior)</span>
              </div>
              <span className={`text-sm font-medium ${textColor}`}>18.7kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-3">🥉</span>
                <div className={`w-8 h-8 ${inputBg} rounded-full flex items-center justify-center text-xs font-medium mr-3`}>G</div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>GreenHero</span>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>15.2kg</span>
            </div>
          </div>
          <button className="text-blue-500 text-xs mt-3">더보기 →</button>
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