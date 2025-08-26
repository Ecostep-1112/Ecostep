import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiChevronDown } from 'react-icons/fi';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../components/RankIcons';

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
  setPoints,
  setLastChallengeDate,
  setWaterQuality,
  challengeHistory,
  setChallengeHistory,
  userRanking,
  showToast
}) => {
  const [customChallenge, setCustomChallenge] = useState('');
  const [showCustomChallenge, setShowCustomChallenge] = useState(false);
  const [previousChallenge, setPreviousChallenge] = useState(''); // 이전 챌린지 저장
  const [customPlasticItem, setCustomPlasticItem] = useState('');
  const [customPlasticWeight, setCustomPlasticWeight] = useState(10);
  const [showCustomPlastic, setShowCustomPlastic] = useState(false);
  const [previousPlasticItem, setPreviousPlasticItem] = useState(''); // 이전 플라스틱 항목 저장
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
  const [historyRange, setHistoryRange] = useState(7); // 7일, 4주, 16주, 32주

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
        challenge: null, // 처음에는 null로 설정
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
  }, []);  // 의존성 배열 비워두기

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
    if (!todayCompleted && currentWeekStart) {
      // 현재 주차 데이터 가져오기 (없으면 생성)
      const currentWeekData = weeklyProgress[currentWeekStart] || {
        challenge: null,
        days: [null, null, null, null, null, null, null],
        startDate: currentWeekStart
      };
      
      // 챌린지가 설정되지 않았으면 현재 선택된 챌린지 사용
      const finalChallenge = currentWeekData.challenge || selectedChallenge;
      
      const updatedWeek = {
        ...currentWeekData,
        challenge: finalChallenge,
        days: currentWeekData.days.map((day, idx) => 
          idx === currentDayIndex ? true : day
        )
      };
      const updatedProgress = { ...weeklyProgress, [currentWeekStart]: updatedWeek };
      setWeeklyProgress(updatedProgress);
      localStorage.setItem('weeklyProgress', JSON.stringify(updatedProgress));
      setTodayCompleted(true);
      
      // 포인트 증가 및 토스트 메시지 표시
      if (setPoints) {
        setPoints(prev => prev + 10);
      }
      
      // 토스트 메시지 표시
      if (showToast) {
        showToast('10P 획득', 'success');
      }
      
      // 수질 100%로 회복 및 마지막 챌린지 날짜 업데이트
      if (setWaterQuality) {
        setWaterQuality(100);
      }
      
      const today = new Date().toISOString();
      if (setLastChallengeDate) {
        setLastChallengeDate(today);
      }
      
      // 챌린지 기록에 추가 (연속 날짜 계산용)
      if (setChallengeHistory) {
        const newHistory = [...(challengeHistory || []), today];
        setChallengeHistory(newHistory);
      }
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  const challenges = [
    '텀블러 사용하기',
    '일회용 컵 안쓰기',
    '플라스틱 빨대 안 쓰기',
    '에코백 사용하기',
    '장바구니 사용하기',
    '비닐봉지 안쓰기',
    '물티슈 줄이기',
    '배달음식 줄이기',
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
            {/* 챌린지 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-5 relative`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`${textColor} text-sm font-medium`}>챌린지</h3>
                {/* 랭크 아이콘 - 보상 탭 스타일 */}
                {userRanking === 'bronze' && <BronzeIcon size={20} />}
                {userRanking === 'silver' && <SilverIcon size={20} />}
                {userRanking === 'gold' && <GoldIcon size={20} />}
                {userRanking === 'platinum' && <PlatinumIcon size={20} />}
              </div>
              
              <div className="relative mb-4 h-9">
              {/* 챌린지가 이미 시작되었는지 확인 */}
              {currentWeekStart && weeklyProgress[currentWeekStart] && 
               weeklyProgress[currentWeekStart].days.some(day => day !== null) ? (
                // 챌린지가 시작됨 - 변경 불가, 가운데 정렬
                <div 
                  className={`w-full h-full ${inputBg} rounded-lg flex items-center justify-center border`}
                  style={{
                    borderColor: userRanking === 'bronze' ? '#06b6d4' :
                                userRanking === 'silver' ? '#14b8a6' :
                                userRanking === 'gold' ? '#fcd34d' :
                                userRanking === 'platinum' ? '#c084fc' :
                                '#06b6d4'
                  }}>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {weeklyProgress[currentWeekStart].challenge || '챌린지를 선택해주세요'}
                  </span>
                </div>
              ) : !showCustomChallenge ? (
                // 챌린지 시작 전 - 선택 가능
                <button
                  onClick={() => setShowChallengeSelect(!showChallengeSelect)}
                  className={`w-full h-full ${inputBg} rounded-lg px-2 flex justify-between items-center border`}
                  style={{
                    borderColor: userRanking === 'bronze' ? '#06b6d4' :
                                userRanking === 'silver' ? '#14b8a6' :
                                userRanking === 'gold' ? '#fcd34d' :
                                userRanking === 'platinum' ? '#c084fc' :
                                '#06b6d4'
                  }}
                >
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex-1 text-center`}>{selectedChallenge}</span>
                  <FiChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              ) : (
                <>
                  {/* 배경 블러 오버레이 - 카드 영역만 */}
                  <div className="absolute inset-0 backdrop-blur-[1px] bg-black/[0.02] z-10 rounded-xl" onClick={() => {
                    setShowCustomChallenge(false);
                    setCustomChallenge('');
                    if (previousChallenge) {
                      setSelectedChallenge(previousChallenge); // 이전 챌린지로 복귀
                    }
                  }} />
                  <div className="relative z-20 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customChallenge}
                      onChange={(e) => setCustomChallenge(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && customChallenge) {
                          setCustomChallenges([...customChallenges, customChallenge]);
                          setSelectedChallenge(customChallenge);
                          setCustomChallenge('');
                          setShowCustomChallenge(false);
                        }
                      }}
                      placeholder="챌린지 이름 입력"
                      className={`w-full ${inputBg} rounded-lg p-2 pr-8 text-sm ${textColor}`}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowCustomChallenge(false);
                        setShowChallengeSelect(true);
                        setCustomChallenge('');
                        if (previousChallenge) {
                          setSelectedChallenge(previousChallenge);
                        }
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-${isDarkMode ? '700' : '200'} rounded transition-colors`}
                    >
                      <FiChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (customChallenge) {
                        setCustomChallenges([...customChallenges, customChallenge]);
                        setSelectedChallenge(customChallenge);
                        setCustomChallenge('');
                        setShowCustomChallenge(false);
                      }
                    }}
                    className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                      userRanking === 'gold' ? 'text-gray-800 hover:opacity-90' : 'text-white hover:opacity-90'
                    }`}
                    style={{
                      background: userRanking === 'bronze' ? 'linear-gradient(to right, #06b6d4, #3b82f6)' :
                                  userRanking === 'silver' ? 'linear-gradient(to right, #cbd5e1, #06b6d4, #14b8a6)' :
                                  userRanking === 'gold' ? 'linear-gradient(to right, #fcd34d, #facc15)' :
                                  userRanking === 'platinum' ? 'linear-gradient(to right, #c084fc, #ec4899)' :
                                  'linear-gradient(to right, #06b6d4, #3b82f6)'
                    }}
                  >
                    추가
                  </button>
                </div>
                </>
              )}
              
              {showChallengeSelect && (
                <>
                  {/* 배경 블러 오버레이 - 카드 영역만 */}
                  <div className="absolute inset-0 backdrop-blur-[1px] bg-black/[0.02] z-10 rounded-xl" onClick={() => setShowChallengeSelect(false)} />
                  <div className={`absolute z-20 w-full mt-1 ${inputBg} rounded-lg p-2 max-h-60 overflow-y-auto scrollbar-hide shadow-lg border ${borderColor}`}>
                  {challenges.map((challenge, index) => (
                    <div key={challenge + index}>
                      <div
                        className={`flex items-center justify-between p-2 hover:bg-gray-${isDarkMode ? '700' : '100'} rounded`}
                      >
                        <button
                          onClick={() => {
                            if (challenge === '기타 (직접 입력)') {
                              setPreviousChallenge(selectedChallenge); // 현재 챌린지 저장
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
                                setSelectedChallenge('텀블러 사용하기');
                              }
                            }}
                            className={`ml-2 p-1 rounded transition-colors ${
                              userRanking === 'bronze' ? 'hover:bg-cyan-100' :
                              userRanking === 'silver' ? 'hover:bg-gray-200' :
                              userRanking === 'gold' ? 'hover:bg-yellow-100' :
                              userRanking === 'platinum' ? 'hover:bg-purple-100' :
                              'hover:bg-cyan-100'
                            }`}
                          >
                            <FiX className="w-4 h-4" style={{
                              color: userRanking === 'bronze' ? '#06b6d4' :
                                     userRanking === 'silver' ? '#14b8a6' :
                                     userRanking === 'gold' ? '#facc15' :
                                     userRanking === 'platinum' ? '#c084fc' :
                                     '#06b6d4'
                            }} />
                          </button>
                        )}
                      </div>
                      {index < challenges.length - 1 && (
                        <div 
                          className={`mx-2 my-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                          style={{ height: '0.5px' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                </>
              )}
              </div>

              {/* 구분선 - 양 끝으로 갈수록 흐리게 */}
              <div className="relative my-4 px-2">
                <div 
                  className="h-[1px] w-full"
                  style={{
                    background: isDarkMode 
                      ? `linear-gradient(to right, transparent, ${
                          userRanking === 'bronze' ? '#06b6d4' :
                          userRanking === 'silver' ? '#14b8a6' :
                          userRanking === 'gold' ? '#facc15' :
                          userRanking === 'platinum' ? '#c084fc' :
                          '#06b6d4'
                        }30 15%, ${
                          userRanking === 'bronze' ? '#06b6d4' :
                          userRanking === 'silver' ? '#14b8a6' :
                          userRanking === 'gold' ? '#facc15' :
                          userRanking === 'platinum' ? '#c084fc' :
                          '#06b6d4'
                        }30 85%, transparent)`
                      : `linear-gradient(to right, transparent, ${
                          userRanking === 'bronze' ? '#06b6d4' :
                          userRanking === 'silver' ? '#14b8a6' :
                          userRanking === 'gold' ? '#facc15' :
                          userRanking === 'platinum' ? '#c084fc' :
                          '#06b6d4'
                        }20 15%, ${
                          userRanking === 'bronze' ? '#06b6d4' :
                          userRanking === 'silver' ? '#14b8a6' :
                          userRanking === 'gold' ? '#facc15' :
                          userRanking === 'platinum' ? '#c084fc' :
                          '#06b6d4'
                        }20 85%, transparent)`
                  }}
                />
              </div>
              
              <div className="flex justify-between mb-4">
                {['월', '화', '수', '목', '금', '토', '일'].map((dayName, idx) => {
                  const dayStatus = currentWeekStart && weeklyProgress[currentWeekStart] 
                    ? weeklyProgress[currentWeekStart].days[idx] 
                    : null;
                  const isToday = idx === currentDayIndex;
                  const isPast = idx < currentDayIndex;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <span className={`text-xs mb-1 ${
                        isToday ? `font-bold` : ''
                      }`} style={{
                        color: isToday ? (
                          userRanking === 'bronze' ? '#06b6d4' :
                          userRanking === 'silver' ? '#14b8a6' :
                          userRanking === 'gold' ? '#facc15' :
                          userRanking === 'platinum' ? '#c084fc' :
                          '#06b6d4'
                        ) : isDarkMode ? '#6b7280' : '#9ca3af'
                      }}>
                        {dayName}
                      </span>
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          dayStatus === false ? 'bg-red-500' : 
                          dayStatus !== true && (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                        }`}
                        style={dayStatus === true ? {
                          background: userRanking === 'bronze' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' :
                                      userRanking === 'silver' ? 'linear-gradient(135deg, #cbd5e1, #06b6d4, #14b8a6)' :
                                      userRanking === 'gold' ? 'linear-gradient(135deg, #fcd34d, #facc15)' :
                                      userRanking === 'platinum' ? 'linear-gradient(135deg, #c084fc, #ec4899)' :
                                      'linear-gradient(135deg, #06b6d4, #3b82f6)'
                        } : isToday && dayStatus !== true ? {
                          background: 'transparent',
                          border: `2px solid ${
                            userRanking === 'bronze' ? '#06b6d4' :
                            userRanking === 'silver' ? '#14b8a6' :
                            userRanking === 'gold' ? '#fcd34d' :
                            userRanking === 'platinum' ? '#c084fc' :
                            '#06b6d4'
                          }`
                        } : {}}
                      >
                        {dayStatus === true ? (
                          <FiCheck className="w-3.5 h-3.5 text-white" />
                        ) : dayStatus === false ? (
                          <FiX className="w-3.5 h-3.5 text-white" />
                        ) : isToday ? (
                          <span className="text-sm font-bold" style={{
                            color: userRanking === 'bronze' ? '#06b6d4' :
                                   userRanking === 'silver' ? '#14b8a6' :
                                   userRanking === 'gold' ? '#facc15' :
                                   userRanking === 'platinum' ? '#c084fc' :
                                   '#06b6d4'
                          }}>!</span>
                        ) : (
                          <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 진행률 표시 */}
              <div className="flex justify-between mb-2">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  진행률
                </span>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentWeekStart && weeklyProgress[currentWeekStart] 
                    ? Math.round((weeklyProgress[currentWeekStart].days.filter(d => d === true).length / 7) * 100)
                    : 0}%
                </span>
              </div>
              
              <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5 mb-4`}>
                <div 
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${currentWeekStart && weeklyProgress[currentWeekStart] 
                      ? (weeklyProgress[currentWeekStart].days.filter(d => d === true).length / 7 * 100) 
                      : 0}%`,
                    background: userRanking === 'bronze' ? 'linear-gradient(to right, #06b6d4, #3b82f6, #2563eb)' :
                                userRanking === 'silver' ? 'linear-gradient(to right, #cbd5e1, #06b6d4, #14b8a6)' :
                                userRanking === 'gold' ? 'linear-gradient(to right, #fcd34d, #facc15)' :
                                userRanking === 'platinum' ? 'linear-gradient(to right, #c084fc, #ec4899)' :
                                'linear-gradient(to right, #06b6d4, #3b82f6, #2563eb)'
                  }}
                />
              </div>

              <button 
                onClick={handleCompleteToday}
                disabled={todayCompleted}
                className={`w-full h-9 rounded-lg text-sm font-medium transition-all ${
                  todayCompleted 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : userRanking === 'gold' ? 'text-gray-800 hover:opacity-90' : 'text-white hover:opacity-90'
                }`}
                style={!todayCompleted ? {
                  background: userRanking === 'bronze' ? 'linear-gradient(to right, #06b6d4, #3b82f6)' :
                              userRanking === 'silver' ? 'linear-gradient(to right, #cbd5e1, #06b6d4, #14b8a6)' :
                              userRanking === 'gold' ? 'linear-gradient(to right, #fcd34d, #facc15)' :
                              userRanking === 'platinum' ? 'linear-gradient(to right, #c084fc, #ec4899)' :
                              'linear-gradient(to right, #06b6d4, #3b82f6)'
                } : {}}
              >
                {todayCompleted ? '오늘 완료' : '오늘 완료하기 (+10P)'}
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
            
            {/* 테스트용 초기화 버튼 */}
            <button
              onClick={() => {
                // 주간 진행 상황 초기화
                setWeeklyProgress({});
                localStorage.removeItem('weeklyProgress');
                
                // 현재 상태 초기화 및 다시 계산
                setTodayCompleted(false);
                setSelectedChallenge('텀블러 사용하기');
                setShowChallengeSelect(false);
                
                // 새로운 주차 데이터 생성
                const today = new Date();
                const dayOfWeek = today.getDay();
                const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(today);
                monday.setDate(today.getDate() + mondayOffset);
                monday.setHours(0, 0, 0, 0);
                const weekKey = monday.toISOString().split('T')[0];
                const currentDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                
                setCurrentWeekStart(weekKey);
                setCurrentDayIndex(currentDay);
                
                // 초기화 성공 메시지 (선택사항)
                // alert('습관 챌린지 기록이 초기화되었습니다.');
              }}
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors mt-3"
            >
              🔄 테스트용 초기화 (습관 챌린지 기록 삭제)
            </button>
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
              {currentPlastic > plasticGoal ? (
                <div>
                  <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5 mb-2`}>
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-green-500 text-sm font-medium">🎉 목표 달성! (+{currentPlastic - plasticGoal}g 초과)</span>
                  </div>
                </div>
              ) : (
                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((currentPlastic/plasticGoal)*100, 100)}%` }}></div>
                </div>
              )}
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
                    <>
                      {/* 배경 블러 오버레이 - 카드 영역만 */}
                      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/[0.02] z-10 rounded-xl" onClick={() => {
                        setShowCustomPlastic(false);
                        setCustomPlasticItem('');
                        setCustomPlasticWeight(10);
                        if (previousPlasticItem) {
                          setSelectedPlasticItem(previousPlasticItem); // 이전 항목으로 복귀
                        }
                      }} />
                      <div className="mt-1 relative z-20 space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={customPlasticItem}
                            onChange={(e) => setCustomPlasticItem(e.target.value)}
                            placeholder="항목 이름 입력"
                            className={`w-full ${inputBg} rounded-lg p-2 pr-8 text-sm ${textColor}`}
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              setShowCustomPlastic(false);
                              setShowPlasticSelect(true);
                              setCustomPlasticItem('');
                              setCustomPlasticWeight(10);
                              if (previousPlasticItem) {
                                setSelectedPlasticItem(previousPlasticItem);
                              }
                            }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-${isDarkMode ? '700' : '200'} rounded transition-colors`}
                          >
                            <FiChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={customPlasticWeight}
                            onChange={(e) => setCustomPlasticWeight(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && customPlasticItem && customPlasticWeight) {
                                const newItem = { name: customPlasticItem, weight: parseInt(customPlasticWeight) };
                                setCustomPlasticItems([...customPlasticItems, newItem]);
                                setSelectedPlasticItem(customPlasticItem);
                                setCustomPlasticItem('');
                                setCustomPlasticWeight(10);
                                setShowCustomPlastic(false);
                              }
                            }}
                            placeholder="개당 무게"
                            className={`w-full ${inputBg} rounded-lg p-2 pr-8 text-sm ${textColor}`}
                          />
                          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            g
                          </span>
                        </div>
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
                          className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                            userRanking === 'gold' ? 'text-gray-800 hover:opacity-90' : 'text-white hover:opacity-90'
                          }`}
                          style={{
                            background: userRanking === 'bronze' ? 'linear-gradient(to right, #06b6d4, #3b82f6)' :
                                        userRanking === 'silver' ? 'linear-gradient(to right, #cbd5e1, #06b6d4, #14b8a6)' :
                                        userRanking === 'gold' ? 'linear-gradient(to right, #fcd34d, #facc15)' :
                                        userRanking === 'platinum' ? 'linear-gradient(to right, #c084fc, #ec4899)' :
                                        'linear-gradient(to right, #06b6d4, #3b82f6)'
                          }}
                        >
                          추가
                        </button>
                      </div>
                    </div>
                    </>
                  )}
                  
                  {showPlasticSelect && (
                    <>
                      {/* 배경 블러 오버레이 - 카드 영역만 */}
                      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/[0.02] z-10 rounded-xl" onClick={() => setShowPlasticSelect(false)} />
                      <div className={`absolute z-20 w-full mt-1 ${inputBg} rounded-lg p-2 max-h-60 overflow-y-auto scrollbar-hide shadow-lg border ${borderColor}`}>
                      {plasticItems.map((item, index) => (
                        <div
                          key={item.name + index}
                          className={`flex items-center justify-between p-2 hover:bg-gray-${isDarkMode ? '700' : '100'} rounded`}
                        >
                          <button
                            onClick={() => {
                              if (item.name === '기타 (직접 입력)') {
                                setPreviousPlasticItem(selectedPlasticItem); // 현재 항목 저장
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
                              className={`ml-2 p-1 rounded transition-colors ${
                                userRanking === 'bronze' ? 'hover:bg-cyan-100' :
                                userRanking === 'silver' ? 'hover:bg-gray-200' :
                                userRanking === 'gold' ? 'hover:bg-yellow-100' :
                                userRanking === 'platinum' ? 'hover:bg-purple-100' :
                                'hover:bg-cyan-100'
                              }`}
                            >
                              <FiX className="w-4 h-4" style={{
                                color: userRanking === 'bronze' ? '#06b6d4' :
                                       userRanking === 'silver' ? '#14b8a6' :
                                       userRanking === 'gold' ? '#facc15' :
                                       userRanking === 'platinum' ? '#c084fc' :
                                       '#06b6d4'
                              }} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    </>
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
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
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

            {/* 주간 사용량 기록 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`${textColor} text-sm font-medium`}>갤럭시 게이머</h3>
                <div className="flex gap-1">
                  {[
                    { value: 7, label: '지난 7일' },
                    { value: 4, label: '지난 4주' },
                    { value: 16, label: '지난 16주' },
                    { value: 32, label: '지난 32주' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setHistoryRange(option.value)}
                      className={`px-2 py-1 text-xs rounded ${
                        historyRange === option.value 
                          ? 'bg-blue-500 text-white' 
                          : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-48 relative">
                {(() => {
                  const today = new Date();
                  const graphData = [];
                  let maxValue = 100;
                  
                  // Calculate data based on selection
                  if (historyRange === 7) {
                    // Daily data for last 7 days
                    for (let i = 6; i >= 0; i--) {
                      const date = new Date(today);
                      date.setDate(date.getDate() - i);
                      date.setHours(0, 0, 0, 0);
                      
                      const nextDate = new Date(date);
                      nextDate.setDate(date.getDate() + 1);
                      
                      const dayRecords = plasticRecords.filter(record => {
                        const recordDate = new Date(record.date);
                        return recordDate >= date && recordDate < nextDate;
                      });
                      
                      const totalWeight = dayRecords.reduce((sum, record) => sum + record.totalWeight, 0);
                      
                      graphData.push({
                        label: date.getDate().toString(),
                        value: totalWeight,
                        fullDate: date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
                      });
                      
                      maxValue = Math.max(maxValue, totalWeight);
                    }
                  } else {
                    // Weekly data
                    const numWeeks = historyRange === 4 ? 4 : historyRange === 16 ? 16 : 32;
                    for (let i = numWeeks - 1; i >= 0; i--) {
                      const weekStart = new Date(today);
                      const dayOfWeek = weekStart.getDay();
                      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                      weekStart.setDate(weekStart.getDate() + mondayOffset - (i * 7));
                      weekStart.setHours(0, 0, 0, 0);
                      
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 7);
                      
                      const weekRecords = plasticRecords.filter(record => {
                        const recordDate = new Date(record.date);
                        return recordDate >= weekStart && recordDate < weekEnd;
                      });
                      
                      const totalWeight = weekRecords.reduce((sum, record) => sum + record.totalWeight, 0);
                      
                      // Show fewer labels for longer ranges
                      let label = '';
                      if (numWeeks <= 4 || i % Math.ceil(numWeeks / 8) === 0 || i === numWeeks - 1) {
                        label = (weekStart.getMonth() + 1) + '.' + weekStart.getDate();
                      }
                      
                      graphData.push({
                        label: label,
                        value: totalWeight,
                        fullDate: weekStart.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
                      });
                      
                      maxValue = Math.max(maxValue, totalWeight);
                    }
                  }
                  
                  // Add padding to max value
                  maxValue = Math.ceil(maxValue * 1.2 / 100) * 100;
                  
                  return (
                    <>
                      {/* Y-axis grid lines and labels */}
                      <div className="absolute inset-0">
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                          <div
                            key={ratio}
                            className="absolute w-full flex items-center"
                            style={{ bottom: `${ratio * 100}%` }}
                          >
                            <div className={`w-full border-t ${ratio === 0 ? 'border-gray-400' : isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${ratio !== 0 && 'border-dashed'}`} />
                            <span className={`absolute -left-8 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {Math.round(maxValue * ratio)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Graph line and area */}
                      <svg className="absolute inset-0 w-full h-full" style={{ marginTop: '-2px' }}>
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        
                        {/* Area under the line */}
                        <path
                          d={`
                            M ${graphData.map((point, i) => {
                              const x = (i / (graphData.length - 1)) * 100;
                              const y = 100 - (point.value / maxValue) * 100;
                              return `${x},${y}`;
                            }).join(' L ')}
                            L 100,100 L 0,100 Z
                          `}
                          fill="url(#areaGradient)"
                          className="w-full h-full"
                          vectorEffect="non-scaling-stroke"
                          style={{ transform: 'scaleX(100%) scaleY(100%)' }}
                        />
                        
                        {/* Line */}
                        <polyline
                          points={graphData.map((point, i) => {
                            const x = (i / (graphData.length - 1)) * 100;
                            const y = 100 - (point.value / maxValue) * 100;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          className="w-full h-full"
                          vectorEffect="non-scaling-stroke"
                          style={{ transform: 'scaleX(100%) scaleY(100%)' }}
                        />
                        
                        {/* Points */}
                        {graphData.map((point, i) => {
                          const x = (i / (graphData.length - 1)) * 100;
                          const y = 100 - (point.value / maxValue) * 100;
                          return (
                            <g key={i}>
                              <circle
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="4"
                                fill="#3B82F6"
                                stroke="white"
                                strokeWidth="2"
                              />
                              {/* Value label on hover area */}
                              <rect
                                x={`${x - 2}%`}
                                y="0"
                                width="4%"
                                height="100%"
                                fill="transparent"
                                className="cursor-pointer"
                              >
                                <title>{point.fullDate}: {point.value}g</title>
                              </rect>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* X-axis labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between" style={{ top: '100%', paddingTop: '4px' }}>
                        {graphData.map((point, i) => (
                          <span
                            key={i}
                            className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                            style={{
                              position: 'absolute',
                              left: `${(i / (graphData.length - 1)) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            {point.label}
                          </span>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenge;