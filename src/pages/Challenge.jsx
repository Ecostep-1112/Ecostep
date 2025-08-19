import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

const Challenge = ({ 
  isDarkMode,
  activeSubTab,
  setActiveSubTab,
  challengeDay,
  plasticGoal,
  setPlasticGoal,
  currentPlastic,
  selectedChallenge,
  setSelectedChallenge,
  showChallengeSelect,
  setShowChallengeSelect,
  customChallenges,
  setCustomChallenges,
  customPlasticItems,
  setCustomPlasticItems
}) => {
  const [customChallenge, setCustomChallenge] = useState('');
  const [showCustomChallenge, setShowCustomChallenge] = useState(false);
  const [customPlasticItem, setCustomPlasticItem] = useState('');
  const [customPlasticWeight, setCustomPlasticWeight] = useState(10);
  const [showCustomPlastic, setShowCustomPlastic] = useState(false);
  const [showAllPastChallenges, setShowAllPastChallenges] = useState(false);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  const challenges = [
    '플라스틱 빨대 안쓰기',
    '텀블러 사용하기',
    '장바구니 사용하기',
    '일회용품 거절하기',
    '플라스틱 포장 줄이기',
    ...customChallenges,
    '기타 (직접 입력)'
  ];

  const plasticItems = [
    { name: '플라스틱병', weight: 20 },
    { name: '음식용기', weight: 30 },
    { name: '컵', weight: 15 },
    { name: '비닐봉지', weight: 5 },
    ...customPlasticItems,
    { name: '기타 (직접 입력)', weight: 0 }
  ];

  const pastChallenges = [
    { name: '비닐봉지 안쓰기', progress: 100, completed: true },
    { name: '플라스틱 도시락 줄이기', progress: 85, completed: false },
    { name: '일회용 컵 안쓰기', progress: 100, completed: true },
    { name: '빨대 사용 줄이기', progress: 70, completed: false },
    { name: '플라스틱 포장 거절', progress: 90, completed: false },
    { name: '에코백 사용하기', progress: 100, completed: true }
  ];

  const weeklyData = [
    { day: '월', usage: 45 },
    { day: '화', usage: 30 },
    { day: '수', usage: 50 },
    { day: '목', usage: 20 },
    { day: '금', usage: 35 },
    { day: '토', usage: 40 },
    { day: '일', usage: 25 }
  ];

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 서브탭 */}
        <div className={`flex mx-2 mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-1`}>
          <button
            onClick={() => setActiveSubTab('habit')}
            className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
              activeSubTab === 'habit' ? 'bg-blue-500 text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            습관 챌린지
          </button>
          <button
            onClick={() => setActiveSubTab('tracking')}
            className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
              activeSubTab === 'tracking' ? 'bg-blue-500 text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            플라스틱 추적
          </button>
        </div>

        {activeSubTab === 'habit' ? (
          <div className="mx-3 mt-4 space-y-4">
            {/* 현재 챌린지 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`${textColor} text-sm font-medium`}>현재 챌린지</h3>
                <span className="bg-blue-100 text-blue-500 px-2 py-1 rounded text-xs">Weekly</span>
              </div>
              
              {!showCustomChallenge ? (
                <button
                  onClick={() => setShowChallengeSelect(!showChallengeSelect)}
                  className={`w-full ${inputBg} rounded-lg p-2 mb-3 flex justify-between items-center`}
                >
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedChallenge}</span>
                  <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              ) : (
                <div className="mb-3">
                  <input
                    type="text"
                    value={customChallenge}
                    onChange={(e) => setCustomChallenge(e.target.value)}
                    placeholder="챌린지 이름 입력"
                    className={`w-full ${inputBg} rounded-lg p-2 text-sm ${textColor} mb-2`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (customChallenge) {
                          setCustomChallenges([...customChallenges, customChallenge]);
                          setSelectedChallenge(customChallenge);
                          setCustomChallenge('');
                          setShowCustomChallenge(false);
                        }
                      }}
                      className="flex-1 bg-blue-500 text-white py-1 rounded text-sm"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomChallenge(false);
                        setCustomChallenge('');
                      }}
                      className={`flex-1 ${inputBg} ${textColor} py-1 rounded text-sm`}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
              
              {showChallengeSelect && (
                <div className={`${inputBg} rounded-lg p-2 mb-3`}>
                  {challenges.map((challenge) => (
                    <button
                      key={challenge}
                      onClick={() => {
                        if (challenge === '기타 (직접 입력)') {
                          setShowCustomChallenge(true);
                          setShowChallengeSelect(false);
                        } else {
                          setSelectedChallenge(challenge);
                          setShowChallengeSelect(false);
                        }
                      }}
                      className={`w-full text-left p-2 text-sm hover:bg-gray-${isDarkMode ? '700' : '100'} rounded ${textColor}`}
                    >
                      {challenge}
                    </button>
                  ))}
                </div>
              )}

              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-3`}>4일차 / 7일</p>
              
              <div className="flex justify-between mb-3">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className="flex flex-col items-center">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>{day}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      day <= 3 ? 'bg-green-500' : day === 4 ? 'bg-red-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {day <= 3 ? <Check className="w-4 h-4 text-white" /> : 
                       day === 4 ? <X className="w-4 h-4 text-white" /> : 
                       <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>○</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5 mb-3`}>
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '57%' }}></div>
              </div>

              <button className="w-full bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium">
                오늘 완료하기 (+10 포인트)
              </button>
            </div>

            {/* 지난 챌린지 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>지난 챌린지</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar scrollbar-hide-idle">
                {(showAllPastChallenges ? pastChallenges : pastChallenges.slice(0, 3)).map((challenge, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{challenge.name}</span>
                      <span className={`text-xs ${challenge.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                        {challenge.completed ? 'Completed ✅' : '⚠️'}
                      </span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                      <div className={`${challenge.completed ? 'bg-green-500' : 'bg-blue-500'} h-1.5 rounded-full`} style={{ width: `${challenge.progress}%` }}></div>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{challenge.progress}% 완료</span>
                  </div>
                ))}
              </div>
              {!showAllPastChallenges && pastChallenges.length > 3 && (
                <button
                  onClick={() => setShowAllPastChallenges(true)}
                  className="text-blue-500 text-xs mt-3"
                >
                  더보기 ({pastChallenges.length - 3}개 더)
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-3 mt-4 space-y-4">
            {/* 목표 설정 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>이번 주 목표 설정</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={plasticGoal}
                  onChange={(e) => setPlasticGoal(e.target.value)}
                  className={`flex-1 border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 text-sm`}
                  placeholder="500g"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">설정</button>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>현재: {currentPlastic}g</span>
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>목표: {plasticGoal}g</span>
              </div>
              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(currentPlastic/plasticGoal)*100}%` }}></div>
              </div>
            </div>

            {/* 플라스틱 사용 기록하기 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>플라스틱 사용 기록하기</h3>
              <div className="space-y-3">
                <div>
                  <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>아이템</label>
                  <select 
                    onChange={(e) => {
                      if (e.target.value === '기타 (직접 입력)') {
                        setShowCustomPlastic(true);
                      } else {
                        setShowCustomPlastic(false);
                      }
                    }}
                    className={`w-full border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 mt-1 text-sm`}
                  >
                    {plasticItems.map(item => (
                      <option key={item.name} value={item.name}>
                        {item.name} {item.weight > 0 && `(${item.weight}g)`}
                      </option>
                    ))}
                  </select>
                </div>

                {showCustomPlastic && (
                  <div className="space-y-3">
                    <div>
                      <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>항목 이름</label>
                      <input
                        type="text"
                        value={customPlasticItem}
                        onChange={(e) => setCustomPlasticItem(e.target.value)}
                        className={`w-full border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 mt-1 text-sm`}
                        placeholder="플라스틱 항목 입력"
                      />
                    </div>
                    <div>
                      <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>개당 무게 (g)</label>
                      <input
                        type="number"
                        value={customPlasticWeight}
                        onChange={(e) => setCustomPlasticWeight(e.target.value)}
                        className={`w-full border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 mt-1 text-sm`}
                        placeholder="10"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>수량</label>
                    <input type="number" className={`w-full border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 mt-1 text-sm`} placeholder="2" />
                  </div>
                  <div className="flex-1">
                    <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>무게 (g)</label>
                    <input type="text" className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'} border ${borderColor} rounded-lg px-3 py-2 mt-1 text-sm`} value={showCustomPlastic ? customPlasticWeight * 2 : "40"} disabled />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (showCustomPlastic && customPlasticItem && customPlasticWeight) {
                      setCustomPlasticItems([...customPlasticItems, { name: customPlasticItem, weight: parseInt(customPlasticWeight) }]);
                      setCustomPlasticItem('');
                      setCustomPlasticWeight(10);
                      setShowCustomPlastic(false);
                    }
                  }}
                  className="w-full bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium"
                >
                  기록하기
                </button>
              </div>
            </div>

            {/* 사용량 분석 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>사용량 분석</h3>
              <div className="space-y-2">
                {[
                  { name: '플라스틱병', value: 38, color: 'bg-blue-500' },
                  { name: '음식용기', value: 27, color: 'bg-green-500' },
                  { name: '컵', value: 25, color: 'bg-yellow-500' },
                  { name: '기타', value: 10, color: 'bg-gray-500' }
                ].map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.value}%</span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                      <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 주간 사용량 그래프 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>주간 사용량 추이</h3>
              <div className="flex justify-between items-end h-32">
                {weeklyData.map((data) => (
                  <div key={data.day} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${data.usage * 2}px` }}
                    ></div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{data.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 이번주 기록 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>이번주 기록</h3>
              <div className="space-y-2">
                {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                  <div key={day} className={`flex justify-between items-center py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{day}요일</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {index < 3 ? '병2개, 컵1개' : index === 3 ? '기록 없음' : '-'}
                      </p>
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {index < 3 ? '40g' : index === 3 ? '0g' : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenge;