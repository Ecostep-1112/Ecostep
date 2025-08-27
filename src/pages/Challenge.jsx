import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiChevronDown } from 'react-icons/fi';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../components/RankIcons';
import { challengeSavings, isPlasticRelated, estimateSavings } from '../data/challengeData';
import { validatePlasticChallenge, fallbackValidation } from '../api/validatePlastic';

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
  userRanking, // Now this is actually rankTheme from App.jsx
  actualRanking, // This is the actual user ranking for badges
  showToast,
  setTotalPlasticSaved
}) => {
  const [customChallenge, setCustomChallenge] = useState('');
  const [showCustomChallenge, setShowCustomChallenge] = useState(false);
  const [previousChallenge, setPreviousChallenge] = useState(''); // 이전 챌린지 저장
  const [customPlasticItem, setCustomPlasticItem] = useState('');
  const [customPlasticWeight, setCustomPlasticWeight] = useState(10);
  const [showCustomPlastic, setShowCustomPlastic] = useState(false);
  const [previousPlasticItem, setPreviousPlasticItem] = useState(''); // 이전 플라스틱 항목 저장
  const [showAllPastChallenges, setShowAllPastChallenges] = useState(false);
  const [selectedPlasticItem, setSelectedPlasticItem] = useState(null);
  const [showPlasticSelect, setShowPlasticSelect] = useState(false);
  const [plasticQuantity, setPlasticQuantity] = useState(1);
  const [tempPlasticGoal, setTempPlasticGoal] = useState(null);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [userCustomGoals, setUserCustomGoals] = useState(() => {
    const saved = localStorage.getItem('userCustomGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [goalSetDate, setGoalSetDate] = useState(() => {
    const saved = localStorage.getItem('goalSetDate');
    return saved ? new Date(saved) : null;
  });
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
  const [customChallengeSavings, setCustomChallengeSavings] = useState(() => {
    const saved = localStorage.getItem('customChallengeSavings');
    return saved ? JSON.parse(saved) : {};
  }); // 커스텀 챌린지별 절약량 저장
  
  // 플라스틱 목표 옵션 리스트
  const predefinedGoals = [100, 200, 300, 400, 500, 700, 900, 1100, 1300, 1500];
  
  // 단위 변환 함수 (1000g 이상은 kg로)
  const formatWeight = (weight) => {
    if (weight >= 1000) {
      const kg = weight / 1000;
      return kg % 1 === 0 ? `${kg}kg` : `${kg.toFixed(1)}kg`;
    }
    return `${weight}g`;
  };

  // 그램 단위로 변환하는 함수
  const parseWeight = (value) => {
    if (typeof value === 'string') {
      const numValue = parseFloat(value);
      if (value.includes('kg')) {
        return numValue * 1000;
      }
      return numValue;
    }
    return value;
  };

  // 사용자 입력값과 미리 정의된 목표를 합쳐서 정렬
  const getGoalOptions = () => {
    const allGoals = [...predefinedGoals, ...userCustomGoals];
    // 중복 제거 및 오름차순 정렬
    return [...new Set(allGoals)].sort((a, b) => a - b);
  };

  // 월요일이 되었는지 확인
  const canChangeGoal = () => {
    if (!goalSetDate) return true;
    const now = new Date();
    const lastSetDate = new Date(goalSetDate);
    
    // 현재 날짜의 월요일 찾기
    const currentMonday = new Date(now);
    const dayOfWeek = currentMonday.getDay();
    const mondayOffset = dayOfWeek === 0 ? 1 : 1 - dayOfWeek + 7;
    currentMonday.setDate(currentMonday.getDate() + mondayOffset);
    currentMonday.setHours(0, 0, 0, 0);
    
    // 설정 날짜의 다음 월요일 찾기
    const nextMonday = new Date(lastSetDate);
    const setDayOfWeek = nextMonday.getDay();
    const nextMondayOffset = setDayOfWeek === 0 ? 1 : (8 - setDayOfWeek) % 7 || 7;
    nextMonday.setDate(nextMonday.getDate() + nextMondayOffset);
    nextMonday.setHours(0, 0, 0, 0);
    
    // 현재 시간이 설정 날짜의 다음 월요일 이후인지 확인
    return now >= nextMonday;
  };

  // 다음 월요일까지 남은 일수 계산
  const getDaysUntilMonday = () => {
    if (!goalSetDate) return 0;
    const now = new Date();
    const dayOfWeek = now.getDay();
    // 월요일은 1, 일요일은 0
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
    return daysUntilMonday;
  };

  // 목표 설정 (일주일 제한 포함)
  const handleSetGoal = (value) => {
    if (canChangeGoal()) {
      setPlasticGoal(value);
      setGoalSetDate(new Date());
      localStorage.setItem('goalSetDate', new Date().toISOString());
      setShowGoalDropdown(false);
    } else {
      showToast(`목표 변경은 월요일에 가능합니다`);
    }
  };

  // 사용자 설정값 추가
  const addCustomGoal = () => {
    const goalValue = parseWeight(customGoalInput);
    if (goalValue && goalValue > 0 && !userCustomGoals.includes(goalValue) && !predefinedGoals.includes(goalValue)) {
      const newGoals = [...userCustomGoals, goalValue];
      setUserCustomGoals(newGoals);
      localStorage.setItem('userCustomGoals', JSON.stringify(newGoals));
      setTempPlasticGoal(goalValue);
      handleSetGoal(goalValue);
      setCustomGoalInput('');
    }
  };

  // 사용자 설정값 삭제
  const deleteCustomGoal = (goal) => {
    const newGoals = userCustomGoals.filter(g => g !== goal);
    setUserCustomGoals(newGoals);
    localStorage.setItem('userCustomGoals', JSON.stringify(newGoals));
  };

  // 이번 주 플라스틱 사용량 계산
  const getWeeklyPlasticUsage = () => {
    if (!plasticRecords || plasticRecords.length === 0) return 0;
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // 이번 주 일요일
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyRecords = plasticRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && recordDate <= now;
    });
    
    // totalWeight 필드 사용 (weight가 아님)
    return weeklyRecords.reduce((total, record) => {
      return total + (record.totalWeight || record.weight || 0);
    }, 0);
  };

  // 테스트용 기록 리셋
  const resetTestData = () => {
    localStorage.removeItem('goalSetDate');
    localStorage.removeItem('plasticGoal');
    localStorage.removeItem('userCustomGoals');
    localStorage.removeItem('plasticRecords');
    setGoalSetDate(null);
    setPlasticGoal(500);
    setUserCustomGoals([]);
    setPlasticRecords([]);
    showToast('테스트 데이터가 리셋되었습니다');
  };

  // 완료된 챌린지 기록 상태
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('completedChallenges');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 1년 이상 된 데이터 필터링
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const filtered = parsed.filter(challenge => new Date(challenge.endDate) > oneYearAgo);
      if (filtered.length !== parsed.length) {
        localStorage.setItem('completedChallenges', JSON.stringify(filtered));
      }
      return filtered;
    }
    
    // 예시 데이터 10개
    const today = new Date();
    const exampleChallenges = [
      {
        challenge: '텀블러 사용하기',
        startDate: new Date(today.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 64 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 100,
        completed: true,
        completedDays: 7,
        rankColor: 'bronze'
      },
      {
        challenge: '장바구니 사용하기',
        startDate: new Date(today.getTime() - 63 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 57 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 43,
        completed: false,
        completedDays: 3,
        rankColor: 'bronze'
      },
      {
        challenge: '일회용 컵 안쓰기',
        startDate: new Date(today.getTime() - 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 86,
        completed: true,
        completedDays: 6,
        rankColor: 'bronze'
      },
      {
        challenge: '비닐봉지 안쓰기',
        startDate: new Date(today.getTime() - 49 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 43 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 100,
        completed: true,
        completedDays: 7,
        rankColor: 'silver'
      },
      {
        challenge: '에코백 사용하기',
        startDate: new Date(today.getTime() - 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 36 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 57,
        completed: false,
        completedDays: 4,
        rankColor: 'silver'
      },
      {
        challenge: '물티슈 줄이기',
        startDate: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 71,
        completed: true,
        completedDays: 5,
        rankColor: 'silver'
      },
      {
        challenge: '플라스틱 빨대 안 쓰기',
        startDate: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 100,
        completed: true,
        completedDays: 7,
        rankColor: 'silver'
      },
      {
        challenge: '텀블러 사용하기',
        startDate: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 100,
        completed: true,
        completedDays: 7,
        rankColor: 'gold'
      },
      {
        challenge: '일회용 컵 안쓰기',
        startDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 29,
        completed: false,
        completedDays: 2,
        rankColor: 'gold'
      },
      {
        challenge: '배달음식 줄이기',
        startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 71,
        completed: true,
        completedDays: 5,
        rankColor: 'gold'
      }
    ];
    
    localStorage.setItem('completedChallenges', JSON.stringify(exampleChallenges));
    return exampleChallenges;
  });

  // 매주 월요일에 플라스틱 사용 기록 리셋
  useEffect(() => {
    const checkAndResetOnMonday = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      
      // 월요일인 경우 (1) 확인
      if (dayOfWeek === 1) {
        const lastReset = localStorage.getItem('lastMondayReset');
        const todayString = now.toISOString().split('T')[0];
        
        // 오늘 리셋하지 않았다면
        if (lastReset !== todayString) {
          // 플라스틱 기록 리셋
          setPlasticRecords([]);
          localStorage.removeItem('plasticRecords');
          
          // 목표 설정 날짜 리셋 (월요일에 변경 가능하도록)
          localStorage.removeItem('goalSetDate');
          setGoalSetDate(null);
          
          // 플라스틱 목표도 초기화
          setPlasticGoal(null);
          setTempPlasticGoal(null);
          localStorage.removeItem('plasticGoal');
          
          // 챌린지도 초기화 (새로운 주 시작)
          setSelectedChallenge(null);
          
          // 리셋 날짜 저장
          localStorage.setItem('lastMondayReset', todayString);
          
          showToast('새로운 주가 시작되었습니다! 플라스틱 사용 기록이 리셋되었습니다.');
        }
      }
    };
    
    // 처음 로드시 확인
    checkAndResetOnMonday();
    
    // 매일 자정에 체크 (월요일이 되는 순간 리셋)
    const checkInterval = setInterval(() => {
      checkAndResetOnMonday();
    }, 60 * 60 * 1000); // 1시간마다 체크
    
    return () => clearInterval(checkInterval);
  }, []);

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
    
    // 새로운 주차인지 확인하고 이전 주차 저장
    if (!weeklyProgress[weekKey]) {
      // 이전 주차 찾아서 완료된 챌린지로 저장
      const previousMonday = new Date(monday);
      previousMonday.setDate(monday.getDate() - 7);
      const previousWeekKey = previousMonday.toISOString().split('T')[0];
      
      if (weeklyProgress[previousWeekKey]) {
        const prevWeek = weeklyProgress[previousWeekKey];
        const completedDays = prevWeek.days.filter(day => day === true).length;
        const totalDays = 7;
        const progressPercent = Math.round((completedDays / totalDays) * 100);
        
        if (prevWeek.challenge) {
          const newCompleted = {
            challenge: prevWeek.challenge,
            startDate: previousWeekKey,
            endDate: new Date(previousMonday.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            progress: progressPercent,
            completed: progressPercent >= 70, // 70% 이상 완료시 성공으로 간주
            completedDays: completedDays,
            rankColor: userRanking // 현재 랭크 색상 저장
          };
          
          const updatedCompleted = [...completedChallenges, newCompleted];
          setCompletedChallenges(updatedCompleted);
          localStorage.setItem('completedChallenges', JSON.stringify(updatedCompleted));
        }
      }
      
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
      
      // 플라스틱 절약량 계산 및 반영
      let plasticSaved = 0;
      if (challengeSavings[finalChallenge]) {
        plasticSaved = challengeSavings[finalChallenge];
      } else if (customChallengeSavings[finalChallenge]) {
        plasticSaved = customChallengeSavings[finalChallenge];
      }
      
      // 홈 화면에 플라스틱 절약량 반영
      if (plasticSaved > 0 && setTotalPlasticSaved) {
        const currentTotal = parseFloat(localStorage.getItem('totalPlasticSaved') || '0');
        const newTotal = currentTotal + plasticSaved;
        localStorage.setItem('totalPlasticSaved', newTotal.toString());
        setTotalPlasticSaved(newTotal);
      }
      
      // 포인트 증가 및 토스트 메시지 표시
      if (setPoints) {
        setPoints(prev => prev + 10);
      }
      
      // 토스트 메시지 표시
      if (showToast) {
        if (plasticSaved > 0) {
          showToast(`10P 획득 (+${plasticSaved}g)`, 'success');
        } else {
          showToast('10P 획득', 'success');
        }
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
    // 음료 관련
    { name: '플라스틱병', weight: 25, category: 'drink', desc: '500ml' },
    { name: '일회용컵', weight: 10, category: 'drink', desc: '카페' },
    { name: '페트병(대)', weight: 45, category: 'drink', desc: '1.5L' },
    { name: '빨대', weight: 1, category: 'drink', desc: '개당' },
    // 봉투류
    { name: '비닐봉지(소)', weight: 3, category: 'bag', desc: '편의점' },
    { name: '비닐봉지(대)', weight: 7, category: 'bag', desc: '마트' },
    // 배달/음식 관련
    { name: '음식용기', weight: 35, category: 'food', desc: '배달용기' },
    { name: '일회용 수저/포크', weight: 3, category: 'food', desc: '세트' },
    { name: '일회용 접시', weight: 8, category: 'food', desc: '개당' },
    // 기타 생활용품
    { name: '화장품 용기', weight: 15, category: 'etc', desc: '소형' },
    ...customPlasticItems,
    { name: '기타 (직접 입력)', weight: 0, category: 'custom' }
  ];

  // 랭크별 색상 정보
  // Helper function to get colors based on rank theme
  const getThemeColor = () => {
    if (userRanking === 'basic') {
      return isDarkMode ? '#e5e7eb' : '#374151';
    }
    if (userRanking === 'bronze') return '#06b6d4';
    if (userRanking === 'silver') return '#14b8a6';
    if (userRanking === 'gold') return '#facc15';
    if (userRanking === 'platinum') return '#c084fc';
    return '#06b6d4'; // default
  };

  const getThemeGradient = () => {
    if (userRanking === 'basic') {
      return isDarkMode ? '#e5e7eb' : '#374151';
    }
    if (userRanking === 'bronze') return 'linear-gradient(to right, #06b6d4, #3b82f6)';
    if (userRanking === 'silver') return 'linear-gradient(to right, #cbd5e1, #06b6d4, #14b8a6)';
    if (userRanking === 'gold') return 'linear-gradient(to right, #fcd34d, #facc15)';
    if (userRanking === 'platinum') return 'linear-gradient(to right, #c084fc, #ec4899)';
    return 'linear-gradient(to right, #06b6d4, #3b82f6)'; // default
  };
  
  // Helper function to get text color for buttons based on theme
  const getButtonTextColor = () => {
    if (userRanking === 'basic') {
      return isDarkMode ? 'text-black' : 'text-white';
    }
    if (userRanking === 'gold') return 'text-gray-800';
    return 'text-white';
  };
  
  // Helper function to get icon color for check marks
  const getIconColor = () => {
    if (userRanking === 'basic') {
      return isDarkMode ? 'text-black' : 'text-white';
    }
    if (userRanking === 'gold') return 'text-gray-800';
    return 'text-white';
  };

  const getRankColors = (rank) => {
    switch(rank) {
      case 'bronze':
        return {
          gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: '#06b6d4'
        };
      case 'silver':
        return {
          gradient: 'linear-gradient(135deg, #cbd5e1, #06b6d4, #14b8a6)',
          color: '#14b8a6'
        };
      case 'gold':
        return {
          gradient: 'linear-gradient(135deg, #fcd34d, #facc15)',
          color: '#facc15'
        };
      case 'platinum':
        return {
          gradient: 'linear-gradient(135deg, #c084fc, #ec4899)',
          color: '#c084fc'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: '#06b6d4'
        };
    }
  };

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
        <div className="flex mx-3 mt-4 relative">
          {/* 슬라이딩 배경 효과 */}
          <div 
            className={`absolute h-full transition-all duration-300 ease-out ${
              isDarkMode ? 'bg-gray-100' : 'bg-gray-800'
            } ${
              activeSubTab === 'habit' ? 'rounded-l-lg' : 'rounded-r-lg'
            }`}
            style={{
              width: '50%',
              transform: activeSubTab === 'habit' ? 'translateX(0)' : 'translateX(100%)',
              opacity: 1,
              zIndex: 1
            }}
          />
          <button
            onClick={() => setActiveSubTab('habit')}
            className={`flex-1 py-2 text-sm font-bold transition-all duration-300 ease-out text-center border relative z-10 ${
              activeSubTab === 'habit' 
                ? isDarkMode 
                  ? 'text-gray-900 border-gray-100' 
                  : 'text-gray-100 border-gray-800'
                : isDarkMode 
                  ? 'text-gray-400 border-gray-600 hover:text-gray-300' 
                  : 'text-gray-500 border-gray-300 hover:text-gray-600'
            } rounded-l-lg border-r-0 bg-transparent`}
          >
            일일 챌린지
          </button>
          <button
            onClick={() => setActiveSubTab('tracking')}
            className={`flex-1 py-2 text-sm font-bold transition-all duration-300 ease-out text-center border relative z-10 ${
              activeSubTab === 'tracking' 
                ? isDarkMode 
                  ? 'text-gray-900 border-gray-100' 
                  : 'text-gray-100 border-gray-800'
                : isDarkMode 
                  ? 'text-gray-400 border-gray-600 hover:text-gray-300' 
                  : 'text-gray-500 border-gray-300 hover:text-gray-600'
            } rounded-r-lg bg-transparent`}
          >
            제로 챌린지
          </button>
        </div>

        {activeSubTab === 'habit' ? (
          <div className="mx-3 mt-4 space-y-4">
            {/* 챌린지 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-5 relative`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`${textColor} text-sm font-medium`}>챌린지</h3>
                {/* 랭크 아이콘 - 실제 랭킹 기준 */}
                {actualRanking === 'bronze' && <BronzeIcon size={20} />}
                {actualRanking === 'silver' && <SilverIcon size={20} />}
                {actualRanking === 'gold' && <GoldIcon size={20} />}
                {actualRanking === 'platinum' && <PlatinumIcon size={20} />}
              </div>
              
              <div className="relative mb-4 h-9">
              {/* 챌린지가 이미 시작되었는지 확인 */}
              {currentWeekStart && weeklyProgress[currentWeekStart] && 
               weeklyProgress[currentWeekStart].days.some(day => day !== null) ? (
                // 챌린지가 시작됨 - 변경 불가, 가운데 정렬
                <div 
                  className={`w-full h-full ${inputBg} rounded-lg flex items-center justify-center border`}
                  style={{
                    borderColor: getThemeColor()
                  }}>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {weeklyProgress[currentWeekStart].challenge || '챌린지를 선택해 주세요'}
                  </span>
                </div>
              ) : !showCustomChallenge ? (
                // 챌린지 시작 전 - 선택 가능
                <button
                  onClick={() => setShowChallengeSelect(!showChallengeSelect)}
                  className={`w-full h-full ${inputBg} rounded-lg px-2 flex justify-between items-center border`}
                  style={{
                    borderColor: getThemeColor()
                  }}
                >
                  <span className={`text-sm ${selectedChallenge ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')} flex-1 text-center`}>
                    {selectedChallenge || '챌린지를 선택해 주세요'}
                  </span>
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
                      onKeyPress={async (e) => {
                        if (e.key === 'Enter' && customChallenge) {
                          // 중복 체크
                          const allChallenges = [...challenges];
                          if (allChallenges.includes(customChallenge)) {
                            if (showToast) {
                              showToast(`이미 존재하는 챌린지입니다`, 'error');
                            }
                            return;
                          }
                          
                          // API 또는 폴백 로직으로 검증
                          const validation = fallbackValidation(customChallenge);
                          
                          // 챌린지 추가
                          setCustomChallenges([...customChallenges, customChallenge]);
                          const newSavings = {...customChallengeSavings, [customChallenge]: validation.savings};
                          setCustomChallengeSavings(newSavings);
                          localStorage.setItem('customChallengeSavings', JSON.stringify(newSavings));
                          setSelectedChallenge(customChallenge);
                          
                          // 메시지 표시
                          if (showToast) {
                            if (validation.savings > 0) {
                              showToast(`챌린지 추가 (${validation.savings}g/일)`, 'success');
                            } else if (validation.warning) {
                              showToast(`플라스틱과 무관한 챌린지`, 'warning');
                            } else if (validation.suggestion) {
                              showToast(`구체적인 방법을 명시해주세요`, 'info');
                            }
                          }
                          
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
                    onClick={async () => {
                      if (customChallenge) {
                        // 중복 체크
                        const allChallenges = [...challenges];
                        if (allChallenges.includes(customChallenge)) {
                          if (showToast) {
                            showToast(`이미 존재하는 챌린지입니다`, 'error');
                          }
                          return;
                        }
                        
                        // API 또는 폴백 로직으로 검증
                        const validation = fallbackValidation(customChallenge);
                        
                        // 챌린지 추가
                        setCustomChallenges([...customChallenges, customChallenge]);
                        const newSavings = {...customChallengeSavings, [customChallenge]: validation.savings};
                        setCustomChallengeSavings(newSavings);
                        localStorage.setItem('customChallengeSavings', JSON.stringify(newSavings));
                        setSelectedChallenge(customChallenge);
                        
                        // 메시지 표시
                        if (showToast) {
                          if (validation.savings > 0) {
                            showToast(`챌린지 추가 (${validation.savings}g/일)`, 'success');
                          } else if (validation.warning) {
                            showToast(`플라스틱과 무관한 챌린지`, 'warning');
                          } else if (validation.suggestion) {
                            showToast(`구체적인 방법을 명시해주세요`, 'info');
                          }
                        }
                        
                        setCustomChallenge('');
                        setShowCustomChallenge(false);
                      }
                    }}
                    className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                      `${getButtonTextColor()} hover:opacity-90`
                    }`}
                    style={{
                      background: getThemeGradient()
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
                              // customChallengeSavings에서도 제거
                              const updatedSavings = {...customChallengeSavings};
                              delete updatedSavings[challenge];
                              setCustomChallengeSavings(updatedSavings);
                              localStorage.setItem('customChallengeSavings', JSON.stringify(updatedSavings));
                              if (selectedChallenge === challenge) {
                                setSelectedChallenge('텀블러 사용하기');
                              }
                            }}
                            className={`ml-2 p-1 rounded transition-colors ${
                              userRanking === 'basic' ? 'hover:bg-gray-100' :
                              userRanking === 'bronze' ? 'hover:bg-cyan-100' :
                              userRanking === 'silver' ? 'hover:bg-gray-200' :
                              userRanking === 'gold' ? 'hover:bg-yellow-100' :
                              userRanking === 'platinum' ? 'hover:bg-purple-100' :
                              'hover:bg-gray-100'
                            }`}
                          >
                            <FiX className="w-4 h-4" style={{
                              color: getThemeColor()
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
                          getThemeColor()
                        }30 15%, ${
                          getThemeColor()
                        }30 85%, transparent)`
                      : `linear-gradient(to right, transparent, ${
                          getThemeColor()
                        }20 15%, ${
                          getThemeColor()
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
                          getThemeColor()
                        ) : isDarkMode ? '#6b7280' : '#9ca3af'
                      }}>
                        {dayName}
                      </span>
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          dayStatus === false ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : 
                          dayStatus !== true && (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                        }`}
                        style={dayStatus === true ? {
                          background: getThemeGradient().replace('to right', '135deg')
                        } : isToday && dayStatus !== true ? {
                          background: 'transparent',
                          border: `2px solid ${getThemeColor()}`
                        } : {}}
                      >
                        {dayStatus === true ? (
                          <FiCheck className={`w-3.5 h-3.5 ${getIconColor()}`} />
                        ) : dayStatus === false ? (
                          <FiX className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                        ) : isToday ? (
                          <span className="text-sm font-bold" style={{
                            color: getThemeColor()
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
                    background: getThemeGradient()
                  }}
                />
              </div>

              <button 
                onClick={handleCompleteToday}
                disabled={todayCompleted}
                className={`w-full h-9 rounded-lg text-sm font-medium transition-all ${
                  todayCompleted 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : `${getButtonTextColor()} hover:opacity-90`
                }`}
                style={!todayCompleted ? {
                  background: getThemeGradient()
                } : {}}
              >
                {todayCompleted ? '오늘 완료' : '오늘 완료하기 (+10P)'}
              </button>
            </div>

            {/* 지난 챌린지 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>지난 챌린지</h3>
              {completedChallenges.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>
                  아직 완료된 챌린지가 없습니다
                </p>
              ) : (
                <div className="space-y-0 max-h-[180px] overflow-y-auto custom-scrollbar scrollbar-hide-idle">
                  {completedChallenges.slice().reverse().map((challenge, index, array) => {
                    return (
                      <div key={index}>
                        <div className="py-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {challenge.challenge}
                            </span>
                            <span 
                              className={`text-xs font-medium`}
                              style={challenge.progress === 100 ? {
                                background: 'linear-gradient(135deg, #10b981, #22c55e)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              } : {
                                color: isDarkMode ? '#9ca3af' : '#6b7280'
                              }}
                            >
                              {challenge.progress}%
                            </span>
                          </div>
                          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                isDarkMode 
                                  ? 'bg-gradient-to-r from-slate-500 to-slate-400'
                                  : 'bg-gradient-to-r from-slate-400 to-slate-500'
                              }`}
                              style={{ 
                                width: `${challenge.progress}%`
                              }}
                            />
                          </div>
                        </div>
                        {/* 구분선 - 마지막 항목 제외 */}
                        {index < array.length - 1 && (
                          <div 
                            className={`h-[1px] w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* 테스트용 초기화 버튼 */}
            <button
              onClick={() => {
                // 주간 진행 상황 초기화
                setWeeklyProgress({});
                localStorage.removeItem('weeklyProgress');
                
                // 완료된 챌린지 기록 초기화
                setCompletedChallenges([]);
                localStorage.removeItem('completedChallenges');
                
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
            {/* 목표 설정 및 현황 통합 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-5`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`${textColor} text-sm font-medium`}>플라스틱 사용 한도 설정</h3>
                {goalSetDate && !canChangeGoal() && (
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    월요일 변경 가능
                  </span>
                )}
              </div>
              
              {/* 이미 목표가 설정되어 있고 일주일이 안 지난 경우 */}
              {goalSetDate && !canChangeGoal() ? (
                <div className={`mb-4 border rounded-lg py-2 px-4 text-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
                  style={{
                    borderColor: getThemeColor()
                  }}
                >
                  <div className={`${textColor} text-sm font-medium`}>
                    이번 주 목표: {formatWeight(plasticGoal)}
                  </div>
                </div>
              ) : (
                <div className="relative mb-4">
                  {/* 드롭다운 버튼 */}
                  <button
                    onClick={() => {
                    setShowGoalDropdown(!showGoalDropdown);
                    // 다른 드롭다운 닫기
                    setShowPlasticSelect(false);
                  }}
                    className={`w-full flex justify-between items-center border ${borderColor} ${
                      isDarkMode ? 'bg-gray-700' : 'bg-white'
                    } rounded-lg px-3 py-2 text-sm`}
                  >
                    <span className={tempPlasticGoal ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                      {tempPlasticGoal ? formatWeight(tempPlasticGoal) : '플라스틱 사용 한도를 설정해 주세요'}
                    </span>
                    <FiChevronDown className={`transition-transform ${showGoalDropdown ? 'rotate-180' : ''}`} />
                  </button>
                
                {/* 드롭다운 리스트 */}
                {showGoalDropdown && (
                  <>
                    {/* 드롭다운 바로 뒤쪽만 블러 처리 */}
                    <div 
                      className="absolute inset-0 -z-10" 
                      style={{
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)'
                      }}
                    />
                    <div 
                      className={`absolute w-full mt-1 border ${borderColor} ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-lg shadow-lg z-20 overflow-hidden`}
                    >
                      {/* 직접 입력 필드와 설정 버튼 */}
                      <div className={`p-2 border-b ${borderColor} flex gap-2`}>
                        <input
                          type="number"
                          value={customGoalInput}
                          onChange={(e) => setCustomGoalInput(e.target.value)}
                          className={`flex-1 border ${
                            isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                          } rounded px-2 py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all focus:outline-none`}
                          style={{
                            borderColor: getThemeColor(),
                            boxShadow: `0 0 0 0.5px ${getThemeColor()}20`
                          }}
                          placeholder="직접 설정"
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => {
                            e.target.style.boxShadow = `0 0 0 2px ${getThemeColor()}30`;
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = `0 0 0 0.5px ${getThemeColor()}20`;
                          }}
                        />
                        <button 
                          onClick={addCustomGoal}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${getButtonTextColor()}`}
                          style={{
                            background: getThemeGradient()
                          }}
                        >
                          설정
                        </button>
                      </div>
                        
                        {/* 옵션 리스트 (스크롤 가능, 최대 5개 표시) */}
                        <div 
                          className="overflow-y-auto scrollbar-hide"
                          style={{ maxHeight: '180px' }}
                        >
                          {getGoalOptions().map((goal, index) => {
                            const isCustom = userCustomGoals.includes(goal);
                            return (
                              <React.Fragment key={goal}>
                                <div className={`flex items-center`}>
                                  <button
                                    onClick={() => {
                                      setTempPlasticGoal(goal);
                                      handleSetGoal(goal);
                                    }}
                                    className={`flex-1 text-left px-3 py-2 text-sm transition-colors ${
                                      tempPlasticGoal == goal ? 
                                      (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900') : 
                                      (isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50')
                                    }`}
                                  >
                                    {formatWeight(goal)}
                                  </button>
                                  {isCustom && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCustomGoal(goal);
                                      }}
                                      className={`p-2 transition-colors ${
                                        isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                                      }`}
                                    >
                                      <FiX className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                {index < getGoalOptions().length - 1 && (
                                  <div className={`border-b ${borderColor}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                    </div>
                  </>
                )}
              </div>
              )}
              
              {/* 플라스틱 사용 현황 - 같은 카드에 통합 */}
              {(() => {
                const weeklyUsage = getWeeklyPlasticUsage() || 0;
                const currentGoal = plasticGoal || 500;
                const usagePercentage = (weeklyUsage / currentGoal) * 100;
                const remainingPercentage = Math.max(0, Math.min(100, Math.round(100 - usagePercentage)));
                
                return (
                  <>
                    <div className="flex justify-between text-xs mb-2">
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        달성률
                      </span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {isNaN(remainingPercentage) ? 100 : remainingPercentage}%
                      </span>
                    </div>
                    <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                      <div className="h-1.5 rounded-full transition-all duration-300" style={{ 
                        width: `${isNaN(remainingPercentage) ? 100 : remainingPercentage}%`,
                        background: getThemeGradient()
                      }}></div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* 플라스틱 사용 기록하기 */}
            <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>플라스틱 사용 기록하기</h3>
              <div className="space-y-3">
                <div className="relative">
                  {!showCustomPlastic ? (
                    <button
                      onClick={() => {
                        setShowPlasticSelect(!showPlasticSelect);
                        // 다른 드롭다운 닫기
                        setShowGoalDropdown(false);
                      }}
                      className={`w-full ${inputBg} rounded-lg p-2 flex justify-between items-center`}
                    >
                      <span className={`text-sm ${selectedPlasticItem ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                        {selectedPlasticItem || '아이템을 선택해 주세요'}
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
                            `${getButtonTextColor()} hover:opacity-90`
                          }`}
                          style={{
                            background: getThemeGradient()
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
                      {(() => {
                        const categories = {
                          drink: { label: '음료 관련', items: [] },
                          bag: { label: '봉투류', items: [] },
                          food: { label: '배달/음식 관련', items: [] },
                          etc: { label: '기타 생활용품', items: [] },
                          custom: { label: '사용자 정의', items: [] }
                        };
                        
                        plasticItems.forEach(item => {
                          if (categories[item.category]) {
                            categories[item.category].items.push(item);
                          }
                        });
                        
                        return Object.entries(categories).map(([key, category], categoryIndex) => {
                          if (category.items.length === 0) return null;
                          
                          return (
                            <div key={key}>
                              {key !== 'custom' && (
                                <div className={`px-2 py-1 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {category.label}
                                </div>
                              )}
                              {category.items.map((item, index) => (
                                <div
                                  key={item.name + index}
                                  className={`flex items-center justify-between p-2 hover:bg-gray-${isDarkMode ? '700' : '100'} rounded`}
                                >
                                  <button
                                    onClick={() => {
                                      if (item.name === '기타 (직접 입력)') {
                                        setPreviousPlasticItem(selectedPlasticItem);
                                        setShowCustomPlastic(true);
                                        setShowPlasticSelect(false);
                                      } else {
                                        setSelectedPlasticItem(item.name);
                                        setShowPlasticSelect(false);
                                      }
                                    }}
                                    className={`flex-1 text-left text-sm ${textColor}`}
                                  >
                                    <span>{item.name}</span>
                                    {item.desc && (
                                      <span className={`ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        - {item.desc}
                                      </span>
                                    )}
                                  </button>
                                  {customPlasticItems.find(custom => custom.name === item.name) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedItems = customPlasticItems.filter(c => c.name !== item.name);
                                        setCustomPlasticItems(updatedItems);
                                        if (selectedPlasticItem === item.name) {
                                          setSelectedPlasticItem(null);
                                        }
                                      }}
                                      className={`ml-2 p-1 rounded transition-colors ${
                                        userRanking === 'basic' ? 'hover:bg-gray-100' :
                                        userRanking === 'bronze' ? 'hover:bg-cyan-100' :
                                        userRanking === 'silver' ? 'hover:bg-gray-200' :
                                        userRanking === 'gold' ? 'hover:bg-yellow-100' :
                                        userRanking === 'platinum' ? 'hover:bg-purple-100' :
                                        'hover:bg-gray-100'
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
                              {/* 카테고리 구분선 - 마지막 카테고리가 아니고 custom이 아닌 경우에만 표시 */}
                              {categoryIndex < Object.entries(categories).filter(([k, c]) => c.items.length > 0).length - 1 && 
                               key !== 'custom' && (
                                <div className={`mt-2 mb-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                              )}
                            </div>
                          );
                        });
                      })()}
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
                      
                      // 입력 초기화
                      setSelectedPlasticItem(null);
                      setPlasticQuantity(1);
                      showToast('기록이 저장되었습니다', 'success');
                    }
                  }}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
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
                    color: userRanking === 'basic' ? (isDarkMode ? 'bg-white' : 'bg-gray-800') :
                           userRanking === 'bronze' ? 'bg-cyan-500' :
                           userRanking === 'silver' ? 'bg-teal-500' :
                           userRanking === 'gold' ? 'bg-yellow-500' :
                           userRanking === 'platinum' ? 'bg-purple-500' :
                           'bg-gray-500',
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
                          className="w-8 rounded-t"
                          style={{ 
                            height: `${data.usage > 0 ? (data.usage / maxUsage) * 96 : 0}px`,
                            background: getThemeGradient().replace('to right', 'to top')
                          }}
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
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} style={dayData.totalWeight > 0 ? {
                          background: userRanking === 'bronze' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' :
                                      userRanking === 'silver' ? 'linear-gradient(135deg, #cbd5e1, #14b8a6)' :
                                      userRanking === 'gold' ? 'linear-gradient(135deg, #fcd34d, #facc15)' :
                                      userRanking === 'platinum' ? 'linear-gradient(135deg, #c084fc, #ec4899)' :
                                      'linear-gradient(135deg, #06b6d4, #3b82f6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        } : {}}>
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
                  <span className="text-sm font-bold" style={{
                    background: userRanking === 'bronze' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' :
                                userRanking === 'silver' ? 'linear-gradient(135deg, #cbd5e1, #14b8a6)' :
                                userRanking === 'gold' ? 'linear-gradient(135deg, #fcd34d, #facc15)' :
                                userRanking === 'platinum' ? 'linear-gradient(135deg, #c084fc, #ec4899)' :
                                'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
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
                      className={`px-2 py-1 text-xs rounded transition-all ${
                        historyRange === option.value 
                          ? 'text-white'
                          : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                      style={historyRange === option.value ? {
                        background: userRanking === 'bronze' ? 'linear-gradient(to right, #06b6d4, #3b82f6)' :
                                    userRanking === 'silver' ? 'linear-gradient(to right, #cbd5e1, #06b6d4, #14b8a6)' :
                                    userRanking === 'gold' ? 'linear-gradient(to right, #fcd34d, #facc15)' :
                                    userRanking === 'platinum' ? 'linear-gradient(to right, #c084fc, #ec4899)' :
                                    'linear-gradient(to right, #06b6d4, #3b82f6)'
                      } : {}}
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
                            <stop offset="0%" stopColor={
                              getThemeColor()
                            } stopOpacity="0.3" />
                            <stop offset="100%" stopColor={
                              getThemeColor()
                            } stopOpacity="0.05" />
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
                          stroke={
                            getThemeColor()
                          }
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
                                fill={
                                  getThemeColor()
                                }
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
            
            {/* 테스트용 기록 리셋 버튼 */}
            <div className="mt-6 mx-3">
              <button
                onClick={resetTestData}
                className={`w-full py-3 ${
                  isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                } text-white rounded-lg text-sm font-medium transition-colors`}
              >
                🔄 테스트용 기록 리셋
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenge;