import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiChevronDown } from 'react-icons/fi';

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
  setCustomPlasticItems,
  points,
  setPoints
}) => {
  const [customChallenge, setCustomChallenge] = useState('');
  const [showCustomChallenge, setShowCustomChallenge] = useState(false);
  const [customPlasticItem, setCustomPlasticItem] = useState('');
  const [customPlasticWeight, setCustomPlasticWeight] = useState(10);
  const [showCustomPlastic, setShowCustomPlastic] = useState(false);
  const [showAllPastChallenges, setShowAllPastChallenges] = useState(false);
  const [selectedPlasticItem, setSelectedPlasticItem] = useState('플라스틱병');
  const [showPlasticSelect, setShowPlasticSelect] = useState(false);
  const [plasticQuantity, setPlasticQuantity] = useState(1);
  const [tempPlasticGoal, setTempPlasticGoal] = useState(500);
  const [plasticRecords, setPlasticRecords] = useState(() => {
    const saved = localStorage.getItem('plasticRecords');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 주간 챌린지 관리
  const [weeklyProgress, setWeeklyProgress] = useState(() => {
    const saved = localStorage.getItem('weeklyProgress');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentWeekStart, setCurrentWeekStart] = useState('');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(false);

  // 월요일 기준 주차 계산
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const weekKey = monday.toISOString().split('T')[0];
    setCurrentWeekStart(weekKey);
    
    // 현재 요일 인덱스 (월요일=0, 일요일=6)
    const currentDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    setCurrentDayIndex(currentDay);
    
    // 새로운 주차인지 확인
    if (!weeklyProgress[weekKey]) {
      const newWeek = {
        challenge: selectedChallenge,
        days: [null, null, null, null, null, null, null],
        startDate: weekKey
      };
      const updatedProgress = { ...weeklyProgress, [weekKey]: newWeek };
      setWeeklyProgress(updatedProgress);
      localStorage.setItem('weeklyProgress', JSON.stringify(updatedProgress));
    } else {
      // 오늘 이미 완료했는지 확인
      setTodayCompleted(weeklyProgress[weekKey].days[currentDay] === true);
    }
  }, [selectedChallenge]);

  // 자정이 지나면 자동으로 미완료 처리
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow - now;
      
      setTimeout(() => {
        if (currentWeekStart && weeklyProgress[currentWeekStart]) {
          const yesterday = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
          if (weeklyProgress[currentWeekStart].days[yesterday] === null) {
            const updatedWeek = {
              ...weeklyProgress[currentWeekStart],
              days: weeklyProgress[currentWeekStart].days.map((day, idx) => 
                idx === yesterday && day === null ? false : day
              )
            };
            const updatedProgress = { ...weeklyProgress, [currentWeekStart]: updatedWeek };
            setWeeklyProgress(updatedProgress);
            localStorage.setItem('weeklyProgress', JSON.stringify(updatedProgress));
          }
        }
        checkMidnight(); // 다음 자정 체크
      }, timeUntilMidnight);
    };
    
    checkMidnight();
  }, [currentWeekStart, currentDayIndex, weeklyProgress]);

  const handleCompleteToday = () => {
    if (!todayCompleted && currentWeekStart && weeklyProgress[currentWeekStart]) {
      const updatedWeek = {
        ...weeklyProgress[currentWeekStart],
        days: weeklyProgress[currentWeekStart].days.map((day, idx) => 
          idx === currentDayIndex ? true : day
        )
      };
      const updatedProgress = { ...weeklyProgress, [currentWeekStart]: updatedWeek };
      setWeeklyProgress(updatedProgress);
      localStorage.setItem('weeklyProgress', JSON.stringify(updatedProgress));
      setTodayCompleted(true);
      
      // 포인트 증가
      if (setPoints) {
        setPoints(prev => prev + 10);
      }
    }
  };

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
              
              <div className="relative mb-3">
              {!showCustomChallenge ? (
                <button
                  onClick={() => setShowChallengeSelect(!showChallengeSelect)}
                  className={`w-full ${inputBg} rounded-lg p-2 flex justify-between items-center`}
                >
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedChallenge}</span>
                  <FiChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              ) : (
                <div>
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
                <div className={`absolute z-10 w-full mt-1 ${inputBg} rounded-lg p-2 max-h-60 overflow-y-auto shadow-lg border ${borderColor}`}>
                  {challenges.map((challenge, index) => (
                    <div
                      key={challenge + index}
                      className={`flex items-center justify-between p-2 hover:bg-gray-${isDarkMode ? '700' : '100'} rounded`}
                    >
                      <button
                        onClick={() => {
                          if (challenge === '기타 (직접 입력)') {
                            setShowCustomChallenge(true);
                            setShowChallengeSelect(false);
                          } else {
                            setSelectedChallenge(challenge);
                            setShowChallengeSelect(false);
                          }
                        }}
                        className={`flex-1 text-left text-sm ${textColor}`}
                      >
                        {challenge}
                      </button>
                      {customChallenges.includes(challenge) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedChallenges = customChallenges.filter(c => c !== challenge);
                            setCustomChallenges(updatedChallenges);
                            if (selectedChallenge === challenge) {
                              setSelectedChallenge('플라스틱 빨대 안쓰기');
                            }
                          }}
                          className="ml-2 p-1 hover:bg-red-100 rounded"
                        >
                          <FiX className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              </div>

              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-3`}>
                {currentDayIndex + 1}일차 / 7일
              </p>
              
              <div className="flex justify-between mb-3">
                {['월', '화', '수', '목', '금', '토', '일'].map((dayName, idx) => {
                  const dayStatus = currentWeekStart && weeklyProgress[currentWeekStart] 
                    ? weeklyProgress[currentWeekStart].days[idx] 
                    : null;
                  const isToday = idx === currentDayIndex;
                  const isPast = idx < currentDayIndex;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <span className={`text-xs ${isToday ? 'text-blue-500 font-bold' : isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                        {dayName}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        dayStatus === true ? 'bg-green-500' : 
                        dayStatus === false ? 'bg-red-500' : 
                        isToday ? 'bg-blue-500' :
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {dayStatus === true ? <FiCheck className="w-4 h-4 text-white" /> : 
                         dayStatus === false ? <FiX className="w-4 h-4 text-white" /> : 
                         isToday ? <span className="text-white text-xs font-bold">!</span> :
                         <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>○</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5 mb-3`}>
                <div className="bg-green-500 h-1.5 rounded-full" style={{ 
                  width: `${currentWeekStart && weeklyProgress[currentWeekStart] 
                    ? (weeklyProgress[currentWeekStart].days.filter(d => d === true).length / 7 * 100) 
                    : 0}%` 
                }}></div>
              </div>

              <button 
                onClick={handleCompleteToday}
                disabled={todayCompleted}
                className={`w-full py-2.5 rounded-lg text-sm font-medium ${
                  todayCompleted 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {todayCompleted ? '오늘 완료됨' : '오늘 완료하기 (+10 포인트)'}
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
                  value={tempPlasticGoal}
                  onChange={(e) => setTempPlasticGoal(e.target.value)}
                  className={`flex-1 border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 text-sm`}
                  placeholder="500g"
                />
                <button 
                  onClick={() => setPlasticGoal(tempPlasticGoal)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  설정
                </button>
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
                <div className="relative">
                  <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>아이템</label>
                  
                  {!showCustomPlastic ? (
                    <button
                      onClick={() => setShowPlasticSelect(!showPlasticSelect)}
                      className={`w-full ${inputBg} rounded-lg p-2 mt-1 flex justify-between items-center`}
                    >
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {selectedPlasticItem} {plasticItems.find(item => item.name === selectedPlasticItem)?.weight > 0 && 
                          `(${plasticItems.find(item => item.name === selectedPlasticItem)?.weight}g)`}
                      </span>
                      <FiChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                  ) : (
                    <div className="mt-1">
                      <input
                        type="text"
                        value={customPlasticItem}
                        onChange={(e) => setCustomPlasticItem(e.target.value)}
                        placeholder="항목 이름 입력"
                        className={`w-full ${inputBg} rounded-lg p-2 text-sm ${textColor} mb-2`}
                      />
                      <div className="relative mb-2">
                        <input
                          type="number"
                          value={customPlasticWeight}
                          onChange={(e) => setCustomPlasticWeight(e.target.value)}
                          placeholder="개당 무게"
                          className={`w-full ${inputBg} rounded-lg p-2 pr-8 text-sm ${textColor}`}
                        />
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          g
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (customPlasticItem && customPlasticWeight) {
                              const newItem = { name: customPlasticItem, weight: parseInt(customPlasticWeight) };
                              setCustomPlasticItems([...customPlasticItems, newItem]);
                              setSelectedPlasticItem(customPlasticItem);
                              setCustomPlasticItem('');
                              setCustomPlasticWeight(10);
                              setShowCustomPlastic(false);
                            }
                          }}
                          className="flex-1 bg-blue-500 text-white py-1 rounded text-sm"
                        >
                          추가
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomPlastic(false);
                            setCustomPlasticItem('');
                            setCustomPlasticWeight(10);
                          }}
                          className={`flex-1 ${inputBg} ${textColor} py-1 rounded text-sm`}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {showPlasticSelect && (
                    <div className={`absolute z-10 w-full mt-1 ${inputBg} rounded-lg p-2 max-h-60 overflow-y-auto shadow-lg border ${borderColor}`}>
                      {plasticItems.map((item, index) => (
                        <div
                          key={item.name + index}
                          className={`flex items-center justify-between p-2 hover:bg-gray-${isDarkMode ? '700' : '100'} rounded`}
                        >
                          <button
                            onClick={() => {
                              if (item.name === '기타 (직접 입력)') {
                                setShowCustomPlastic(true);
                                setShowPlasticSelect(false);
                              } else {
                                setSelectedPlasticItem(item.name);
                                setShowPlasticSelect(false);
                              }
                            }}
                            className={`flex-1 text-left text-sm ${textColor}`}
                          >
                            {item.name} {item.weight > 0 && `(${item.weight}g)`}
                          </button>
                          {customPlasticItems.find(custom => custom.name === item.name) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedItems = customPlasticItems.filter(c => c.name !== item.name);
                                setCustomPlasticItems(updatedItems);
                                if (selectedPlasticItem === item.name) {
                                  setSelectedPlasticItem('플라스틱병');
                                }
                              }}
                              className="ml-2 p-1 hover:bg-red-100 rounded"
                            >
                              <FiX className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>수량</label>
                    <input 
                      type="number" 
                      value={plasticQuantity}
                      onChange={(e) => setPlasticQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`w-full border ${borderColor} ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-lg px-3 py-2 mt-1 text-sm`} 
                      placeholder="1" 
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>총 무게 (g)</label>
                    <input 
                      type="text" 
                      className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'} border ${borderColor} rounded-lg px-3 py-2 mt-1 text-sm`} 
                      value={(() => {
                        if (showCustomPlastic && customPlasticWeight) {
                          return `${plasticQuantity * customPlasticWeight}g`;
                        } else if (selectedPlasticItem && selectedPlasticItem !== '기타 (직접 입력)') {
                          const item = plasticItems.find(i => i.name === selectedPlasticItem) || 
                                     customPlasticItems.find(i => i.name === selectedPlasticItem);
                          if (item && item.weight) {
                            return `${plasticQuantity * item.weight}g`;
                          }
                        }
                        return '0g';
                      })()}
                      disabled 
                    />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    let recordItem = null;
                    let totalWeight = 0;
                    
                    if (selectedPlasticItem && selectedPlasticItem !== '') {
                      recordItem = plasticItems.find(i => i.name === selectedPlasticItem) || 
                                  customPlasticItems.find(i => i.name === selectedPlasticItem);
                      if (recordItem) {
                        totalWeight = plasticQuantity * recordItem.weight;
                      }
                    }
                    
                    if (recordItem && plasticQuantity > 0) {
                      const newRecord = {
                        date: new Date().toISOString(),
                        item: recordItem.name,
                        quantity: plasticQuantity,
                        unitWeight: recordItem.weight,
                        totalWeight: totalWeight
                      };
                      
                      const updatedRecords = [...plasticRecords, newRecord];
                      setPlasticRecords(updatedRecords);
                      localStorage.setItem('plasticRecords', JSON.stringify(updatedRecords));
                      
                      // 현재 플라스틱 사용량 업데이트
                      setCurrentPlastic(prev => prev + totalWeight);
                      
                      // 입력 초기화
                      setSelectedPlasticItem('플라스틱병');
                      setPlasticQuantity(1);
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
                {(() => {
                  // 실제 데이터 기반 분석
                  const analysis = {};
                  let totalWeight = 0;
                  
                  plasticRecords.forEach(record => {
                    const itemName = record.item;
                    if (!analysis[itemName]) {
                      analysis[itemName] = 0;
                    }
                    analysis[itemName] += record.totalWeight;
                    totalWeight += record.totalWeight;
                  });
                  
                  // 카테고리별로 그룹핑
                  const categories = {
                    '플라스틱병': { weight: 0, color: 'bg-blue-500' },
                    '음식용기': { weight: 0, color: 'bg-green-500' },
                    '컵': { weight: 0, color: 'bg-yellow-500' },
                    '기타': { weight: 0, color: 'bg-gray-500' }
                  };
                  
                  Object.entries(analysis).forEach(([item, weight]) => {
                    if (item.includes('병')) {
                      categories['플라스틱병'].weight += weight;
                    } else if (item.includes('용기')) {
                      categories['음식용기'].weight += weight;
                    } else if (item.includes('컵')) {
                      categories['컵'].weight += weight;
                    } else {
                      categories['기타'].weight += weight;
                    }
                  });
                  
                  const categoryData = Object.entries(categories).map(([name, data]) => ({
                    name,
                    value: totalWeight > 0 ? Math.round((data.weight / totalWeight) * 100) : 0,
                    color: data.color,
                    weight: data.weight
                  }));
                  
                  if (totalWeight === 0) {
                    return <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>아직 기록된 데이터가 없습니다</p>;
                  }
                  
                  return categoryData.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.name} ({item.weight}g)
                        </span>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.value}%</span>
                      </div>
                      <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                        <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* 주간 사용량 그래프 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>주간 사용량 추이 (지난 7일)</h3>
              <div className="flex justify-between items-end h-32">
                {(() => {
                  // 지난 7일간의 데이터 계산
                  const today = new Date();
                  const weekData = [];
                  
                  for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    date.setHours(0, 0, 0, 0);
                    
                    const nextDate = new Date(date);
                    nextDate.setDate(nextDate.getDate() + 1);
                    
                    const dayRecords = plasticRecords.filter(record => {
                      const recordDate = new Date(record.date);
                      return recordDate >= date && recordDate < nextDate;
                    });
                    
                    const totalWeight = dayRecords.reduce((sum, record) => sum + record.totalWeight, 0);
                    
                    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                    weekData.push({
                      day: dayNames[date.getDay()],
                      usage: totalWeight,
                      date: date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
                    });
                  }
                  
                  const maxUsage = Math.max(...weekData.map(d => d.usage), 100);
                  
                  return weekData.map((data) => (
                    <div key={data.date} className="flex flex-col items-center flex-1">
                      <div className="relative h-24 flex flex-col justify-end">
                        <div 
                          className="w-8 bg-blue-500 rounded-t"
                          style={{ height: `${data.usage > 0 ? (data.usage / maxUsage) * 96 : 0}px` }}
                        >
                          {data.usage > 0 && (
                            <span className="text-[10px] text-white text-center block pt-1">
                              {data.usage}g
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        {data.day}
                      </span>
                      <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {data.date}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* 이번주 기록 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>이번주 기록</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {(() => {
                  // 이번 주 시작일 (월요일) 계산
                  const today = new Date();
                  const dayOfWeek = today.getDay();
                  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                  const monday = new Date(today);
                  monday.setDate(today.getDate() + mondayOffset);
                  monday.setHours(0, 0, 0, 0);
                  
                  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
                  const weekRecords = [];
                  
                  for (let i = 0; i < 7; i++) {
                    const date = new Date(monday);
                    date.setDate(monday.getDate() + i);
                    date.setHours(0, 0, 0, 0);
                    
                    const nextDate = new Date(date);
                    nextDate.setDate(date.getDate() + 1);
                    
                    const dayRecords = plasticRecords.filter(record => {
                      const recordDate = new Date(record.date);
                      return recordDate >= date && recordDate < nextDate;
                    });
                    
                    weekRecords.push({
                      day: weekDays[i],
                      date: date,
                      records: dayRecords,
                      totalWeight: dayRecords.reduce((sum, r) => sum + r.totalWeight, 0)
                    });
                  }
                  
                  return weekRecords.map((dayData, index) => (
                    <div key={index} className={`py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {dayData.day}요일 
                            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                              ({dayData.date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })})
                            </span>
                          </p>
                          {dayData.records.length > 0 ? (
                            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                              {dayData.records.map((record, idx) => (
                                <div key={idx}>
                                  {record.item} {record.quantity}개 ({record.totalWeight}g)
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {dayData.date > today ? '-' : '기록 없음'}
                            </p>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${dayData.totalWeight > 0 ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {dayData.totalWeight > 0 ? `${dayData.totalWeight}g` : dayData.date > today ? '-' : '0g'}
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              <div className={`mt-3 pt-3 border-t ${borderColor}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${textColor}`}>주간 총계</span>
                  <span className="text-sm font-bold text-blue-500">
                    {(() => {
                      const today = new Date();
                      const dayOfWeek = today.getDay();
                      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                      const monday = new Date(today);
                      monday.setDate(today.getDate() + mondayOffset);
                      monday.setHours(0, 0, 0, 0);
                      
                      const sunday = new Date(monday);
                      sunday.setDate(monday.getDate() + 7);
                      
                      const weekTotal = plasticRecords
                        .filter(record => {
                          const recordDate = new Date(record.date);
                          return recordDate >= monday && recordDate < sunday;
                        })
                        .reduce((sum, record) => sum + record.totalWeight, 0);
                      
                      return `${weekTotal}g`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenge;