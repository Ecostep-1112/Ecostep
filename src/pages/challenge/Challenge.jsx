import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../../components/RankIcons';
import { challengeSavings, isPlasticRelated, estimateSavings } from '../../data/challengeData';
import { validatePlasticChallenge, fallbackValidation } from '../../utils/validatePlastic';
import { validatePlasticItem, fallbackEstimation } from '../../utils/validatePlasticItem';
import { formatWeight } from '../../utils/formatters';
import {
  customChallengeStorage,
  customPlasticItemStorage
} from '../../utils/localStorage';
import { supabase } from '../../lib/supabase';
import {
  getUserZeroChallengeRecords,
  saveZeroChallengeRecord,
  getWeeklyChallengeRecord,
  completeWeeklyChallenge,
  saveChallengeCompletionDate
} from '../../lib/database';
import { getThisMonday, toDateString } from '../../utils/dateUtils';

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
  earnPoints,
  setLastChallengeDate,
  setWaterQuality,
  challengeHistory,
  setChallengeHistory,
  userRanking, // Now this is actually rankTheme from App.jsx
  actualRanking, // This is the actual user ranking for badges
  showToast,
  setTotalPlasticSaved,
  testDate,
  setTestDate,
  setNotificationsList,
  userId
}) => {
  const [customChallenge, setCustomChallenge] = useState('');
  const [showCustomChallenge, setShowCustomChallenge] = useState(false);
  const [previousChallenge, setPreviousChallenge] = useState(''); // 이전 챌린지 저장
  const [customPlasticItem, setCustomPlasticItem] = useState('');
  const [customPlasticWeight, setCustomPlasticWeight] = useState(10);
  const [showCustomPlastic, setShowCustomPlastic] = useState(false);
  const [previousPlasticItem, setPreviousPlasticItem] = useState(''); // 이전 플라스틱 항목 저장
  const [isLoadingWeight, setIsLoadingWeight] = useState(false);
  const [showAllPastChallenges, setShowAllPastChallenges] = useState(false);
  const [selectedPlasticItem, setSelectedPlasticItem] = useState(null);
  const [showPlasticSelect, setShowPlasticSelect] = useState(false);
  const [plasticQuantity, setPlasticQuantity] = useState(1);
  const [tempPlasticGoal, setTempPlasticGoal] = useState(null);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [userCustomGoals, setUserCustomGoals] = useState(() => {
    const saved = localStorage.getItem('userCustomGoals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('userCustomGoals 파싱 에러:', error);
        return [];
      }
    }
    return [];
  });
  const [goalSetDate, setGoalSetDate] = useState(() => {
    const saved = localStorage.getItem('goalSetDate');
    return saved ? new Date(saved) : null;
  });
  const [plasticRecords, setPlasticRecords] = useState(() => {
    const saved = localStorage.getItem('plasticRecords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('plasticRecords 파싱 에러:', error);
        return [];
      }
    }
    return [];
  });
  
  // 주간 챌린지 관리
  const [weeklyProgress, setWeeklyProgress] = useState(() => {
    const saved = localStorage.getItem('weeklyProgress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('weeklyProgress 파싱 에러:', error);
        return {};
      }
    }
    return {};
  });
  const [currentWeekStart, setCurrentWeekStart] = useState('');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [historyRange, setHistoryRange] = useState(7); // 7일, 4주, 16주, 32주
  const [expandedDays, setExpandedDays] = useState([]); // 확장된 요일 추적
  const [usagePeriod, setUsagePeriod] = useState('전체'); // 사용량 기간 선택 state - 기본값 전체
  const [showUsagePeriodDropdown, setShowUsagePeriodDropdown] = useState(false); // 사용량 기간 드롭다운 표시 여부
  const [customChallengeSavings, setCustomChallengeSavings] = useState(() => {
    const saved = localStorage.getItem('customChallengeSavings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('customChallengeSavings 파싱 에러:', error);
        return {};
      }
    }
    return {};
  }); // 커스텀 챌린지별 절약량 저장
  
  // 플라스틱 목표 옵션 리스트
  const predefinedGoals = [100, 200, 300, 400, 500, 700, 900, 1100, 1300, 1500];

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
    const now = new Date(testDate || new Date());
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
    const now = new Date(testDate || new Date());
    const dayOfWeek = now.getDay();
    // 월요일은 1, 일요일은 0
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
    return daysUntilMonday;
  };

  // 목표 설정 (일주일 제한 포함)
  const handleSetGoal = (value) => {
    if (canChangeGoal()) {
      setPlasticGoal(value);
      localStorage.setItem('plasticGoal', value); // localStorage에 저장
      setGoalSetDate(new Date(testDate || new Date()));
      localStorage.setItem('goalSetDate', new Date(testDate || new Date()).toISOString());
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
  const getWeeklyPlasticUsage = (checkLastWeek = false) => {
    if (!plasticRecords || plasticRecords.length === 0) return 0;
    
    const now = new Date(testDate || new Date());
    let weekStart = new Date(now);
    let weekEnd = new Date(now);
    
    if (checkLastWeek) {
      // 지난 주 데이터 가져오기 (월요일에 사용)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - 7); // 지난 주 일요일
      weekEnd.setDate(weekEnd.getDate() - weekEnd.getDay() - 1); // 지난 주 토요일
    } else {
      // 이번 주 데이터 가져오기
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // 이번 주 일요일
    }
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyRecords = plasticRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
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
    setPlasticGoal(null);
    setUserCustomGoals([]);
    setPlasticRecords([]);
    showToast('테스트 데이터가 리셋되었습니다');
  };

  // 완료된 챌린지 기록 상태
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('completedChallenges');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 1년 이상 된 데이터 필터링
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const filtered = parsed.filter(challenge => new Date(challenge.endDate) > oneYearAgo);
        if (filtered.length !== parsed.length) {
          localStorage.setItem('completedChallenges', JSON.stringify(filtered));
        }
        return filtered;
      } catch (error) {
        console.error('completedChallenges 파싱 에러:', error);
        return [];
      }
    }

    // 실제 완료된 챌린지만 반환 (예시 데이터 제거)
    return [];
  });

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 클릭한 요소가 드롭다운 내부인지 확인
      if (!event.target.closest('.dropdown-container')) {
        setShowGoalDropdown(false);
        setShowPlasticSelect(false);
        setShowUsagePeriodDropdown(false);
      }
    };

    if (showGoalDropdown || showPlasticSelect || showUsagePeriodDropdown) {
      // setTimeout을 사용하여 현재 클릭 이벤트가 처리된 후 리스너 추가
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showGoalDropdown, showPlasticSelect, showUsagePeriodDropdown]);

  // Supabase에서 플라스틱 기록 로드
  useEffect(() => {
    const loadPlasticRecordsFromDB = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 최근 3개월 데이터만 로드
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const startDate = threeMonthsAgo.toISOString().split('T')[0];

        const { data, error } = await getUserZeroChallengeRecords(user.id, startDate);

        if (error) {
          console.error('플라스틱 기록 로드 실패:', error);
          return;
        }

        if (data && data.length > 0) {
          // Supabase 데이터를 plasticRecords 형식으로 변환
          const formattedRecords = data.map(record => ({
            date: `${record.tracked_date}T00:00:00.000Z`, // 시간대 문제 방지 - 날짜만 사용
            item: record.item_name || record.item_id || '알 수 없음',
            quantity: record.quantity || record.item_num || 1,
            unitWeight: Math.round(record.weight / (record.quantity || 1)),
            totalWeight: record.weight,
            recordId: record.record_id // DB record ID 추가
          }));

          // 기존 localStorage 데이터 가져오기
          let existingRecords = [];
          try {
            existingRecords = JSON.parse(localStorage.getItem('plasticRecords') || '[]');
          } catch (error) {
            console.error('plasticRecords 파싱 에러:', error);
          }

          // DB에서 가져온 레코드의 record_id 목록
          const dbRecordIds = new Set(formattedRecords.map(r => r.recordId).filter(Boolean));

          // localStorage에만 있는 데이터 (DB에 저장되지 않은 새 데이터)
          const localOnlyRecords = existingRecords.filter(record =>
            !record.recordId || !dbRecordIds.has(record.recordId)
          );

          // DB 데이터를 우선으로 하고, localStorage 전용 데이터 추가
          const finalRecords = [...formattedRecords, ...localOnlyRecords];

          setPlasticRecords(finalRecords);
          localStorage.setItem('plasticRecords', JSON.stringify(finalRecords));

          console.log('플라스틱 기록 로드 완료:', finalRecords.length, '개 (DB:', formattedRecords.length, ', Local:', localOnlyRecords.length, ')');
        }
      } catch (error) {
        console.error('플라스틱 기록 로드 에러:', error);
      }
    };

    loadPlasticRecordsFromDB();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // ✅ DB에서 이번 주 챌린지 데이터 로드 (DB 우선)
  // 로그인 시 DB에서 데이터를 로드하여 localStorage를 덮어씁니다
  useEffect(() => {
    const loadWeeklyChallengeFromDB = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 이번 주 월요일 날짜
        const thisMonday = getThisMonday();

        // DB에서 이번 주 챌린지 기록 가져오기 (항상 DB 우선)
        const { data, error } = await getWeeklyChallengeRecord(user.id, thisMonday);

        if (error) {
          console.error('주간 챌린지 로드 실패:', error);
          return;
        }

        if (data) {
          console.log('✅ DB에서 주간 챌린지 로드:', data);

          // ⚠️ DB에는 total_completed만 있고 요일별 정보가 없음
          // 따라서 정확한 복원은 불가능 - 앞쪽부터 채우기
          const dbCompletedDays = data.total_completed; // 1~7

          // days 배열 생성 (완료된 날짜 수만큼 앞에서부터 true로 채우기)
          const days = [null, null, null, null, null, null, null];
          for (let i = 0; i < dbCompletedDays && i < 7; i++) {
            days[i] = true;
          }

          const weekData = {
            challenge: data.content,
            days: days,
            startDate: thisMonday
          };

          // DB 데이터로 localStorage 업데이트 (DB 우선)
          setWeeklyProgress(prev => {
            const updatedProgress = { ...prev, [thisMonday]: weekData };
            localStorage.setItem('weeklyProgress', JSON.stringify(updatedProgress));
            return updatedProgress;
          });

          console.log(`   - 챌린지: ${data.content}`);
          console.log(`   - 완료 횟수: ${data.total_completed}/7`);
        } else {
          console.log('📭 DB에 이번 주 챌린지 데이터 없음');
        }
      } catch (error) {
        console.error('주간 챌린지 로드 에러:', error);
      }
    };

    loadWeeklyChallengeFromDB();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 매주 월요일에 포인트 지급 및 리셋
  useEffect(() => {
    const checkMonday = () => {
      const now = new Date(testDate || new Date());
      const dayOfWeek = now.getDay();
      
      console.log('[제로챌린지] 체크 시작:', {
        요일: dayOfWeek,
        날짜: now.toISOString(),
        plasticGoal,
        setNotificationsList: !!setNotificationsList
      });
      
      // 🔄 개선: goalSetDate 기준으로 주간 리셋 (localStorage lastMondayCheck 불필요)
      if (goalSetDate) {
        const todayString = toDateString(now);
        const thisMonday = getThisMonday();
        const goalSetString = toDateString(goalSetDate);

        // 목표 설정일이 이번 주 월요일보다 이전이면 (= 지난 주에 설정됨)
        if (goalSetString < thisMonday) {
          console.log('[제로챌린지] 새로운 주 감지 - 목표 리셋:', {
            목표설정일: goalSetString,
            이번주월요일: thisMonday,
            오늘: todayString
          });

          // 플라스틱 목표가 있었다면 달성률 체크
          if (plasticGoal && plasticGoal > 0) {
            // 지난 주 데이터로 달성률 계산
            const weeklyUsage = getWeeklyPlasticUsage(true); // true = 지난 주 데이터
            const achievementPercent = Math.max(0, 100 - (weeklyUsage / plasticGoal * 100));

            console.log('[제로챌린지] 달성률 계산:', {
              목표: plasticGoal,
              지난주_사용량: weeklyUsage,
              달성률: achievementPercent
            });

            // 달성률 1% 이상이면 알림
            if (achievementPercent >= 1) {
              if (setNotificationsList) {
                const newNotification = {
                  id: Date.now(),
                  title: '제로 챌린지 달성!',
                  message: `지난 주 플라스틱 사용 목표를 달성했습니다.`,
                  timestamp: new Date(),
                  read: false,
                  isReward: true,
                  claimed: false,
                  pointsAmount: 700
                };
                console.log('[제로챌린지] 알림 생성:', newNotification);
                setNotificationsList(prev => {
                  console.log('[제로챌린지] 알림 추가 전:', prev);
                  return [newNotification, ...prev];
                });
              } else {
                console.log('[제로챌린지] setNotificationsList가 없음!');
              }
            } else {
              console.log('[제로챌린지] 달성 실패 (달성률 1% 미만)');
            }
          } else {
            console.log('[제로챌린지] 목표 없음 또는 0');
          }

          // 새로운 주 시작 - 목표 리셋
          localStorage.removeItem('goalSetDate');
          setGoalSetDate(null);
          setPlasticGoal(null);
          setTempPlasticGoal(null);
          localStorage.removeItem('plasticGoal');
          setSelectedChallenge(null);

          console.log('[제로챌린지] 주간 목표 리셋 완료');
        }
      }
    };
    
    // 컴포넌트 로드시 즉시 체크
    checkMonday();
    
    // 1분마다 체크
    const interval = setInterval(checkMonday, 60000);
    
    return () => clearInterval(interval);
  }, [testDate, plasticGoal, setNotificationsList]);

  // 월요일에 목표 재설정 알림
  useEffect(() => {
    const today = new Date(testDate || new Date());
    const dayOfWeek = today.getDay();
    
    // 월요일이고 목표 설정이 가능한 경우 알림 (주석 처리)
    // if (dayOfWeek === 1 && canChangeGoal() && !plasticGoal) {
    //   showToast('이번 주 플라스틱 사용 한도를 설정해주세요!', 'info');
    // }
  }, [testDate]);

  // 월요일 기준 주차 계산
  useEffect(() => {
    const today = new Date(testDate || new Date());
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
  }, [testDate]);  // testDate 변경시 재계산

  // 자정이 지나면 자동으로 미완료 처리
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date(testDate || new Date());
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
  }, [currentWeekStart, currentDayIndex, weeklyProgress, testDate]);

  const handleCompleteToday = async () => {
    if (!todayCompleted && currentWeekStart) {
      // 현재 주차 데이터 가져오기 (없으면 생성)
      const currentWeekData = weeklyProgress[currentWeekStart] || {
        challenge: null,
        days: [null, null, null, null, null, null, null],
        startDate: currentWeekStart
      };

      // 챌린지가 설정되지 않았으면 현재 선택된 챌린지 사용
      const finalChallenge = currentWeekData.challenge || selectedChallenge;

      // 챌린지가 없으면 에러 메시지 표시
      if (!finalChallenge) {
        showToast('챌린지를 먼저 선택해주세요', 'error');
        return;
      }

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

      // ✅ Supabase에 주간 챌린지 기록 저장 (insert or update)
      try {
        // Supabase Auth 사용자 ID 가져오기 (UUID)
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('사용자 인증 오류:', userError);
        } else if (user) {
          // 주간 챌린지 완료 처리 (DB에 insert or update)
          const { data, error } = await completeWeeklyChallenge(
            user.id,
            currentWeekStart, // 이번 주 월요일 날짜 (YYYY-MM-DD)
            null, // chal_id (현재는 null, 나중에 daily_chal_list와 연동 가능)
            finalChallenge // 챌린지 이름
          );

          if (error) {
            console.error('주간 챌린지 기록 저장 실패:', error);
          } else {
            console.log('✅ 주간 챌린지 기록 저장 성공:', data);
            console.log(`   - 이번 주 완료 횟수: ${data.total_completed}/7`);
          }
        } else {
          console.warn('로그인된 사용자가 없습니다.');
        }
      } catch (error) {
        console.error('주간 챌린지 기록 저장 오류:', error);
      }

      // 포인트 증가 및 토스트 메시지 표시
      if (earnPoints) {
        earnPoints(100);
      } else if (setPoints) {
        setPoints(prev => prev + 100);
      }

      // 토스트 메시지 표시
      if (showToast) {
        if (plasticSaved > 0) {
          showToast(`100P 획득 (+${plasticSaved}g)`, 'success');
        } else {
          showToast('100P 획득', 'success');
        }
      }

      // 수질 100%로 회복 및 마지막 챌린지 날짜 업데이트
      if (setWaterQuality) {
        setWaterQuality(100);
        // 오늘 수질이 업데이트되었음을 표시 (App.jsx의 자동 계산 방지)
        const todayString = new Date().toISOString().split('T')[0];
        localStorage.setItem('lastWaterQualityUpdate', todayString);
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

      // DB에 챌린지 완료 날짜 저장
      if (userId) {
        const dateString = new Date().toISOString().split('T')[0];
        saveChallengeCompletionDate(userId, dateString).catch(error => {
          console.error('챌린지 완료 날짜 저장 실패:', error);
        });
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
    { id: 'plastic_bottle_500ml', name: '플라스틱병', weight: 25, category: 'drink', desc: '500ml' },
    { id: 'disposable_cup', name: '일회용 컵', weight: 10, category: 'drink', desc: '카페' },
    { id: 'plastic_bottle_1500ml', name: '페트병(대)', weight: 45, category: 'drink', desc: '1.5L' },
    { id: 'straw', name: '빨대', weight: 1, category: 'drink', desc: '개당' },
    // 봉투류
    { id: 'plastic_bag_small', name: '비닐봉지(소)', weight: 3, category: 'bag', desc: '편의점' },
    { id: 'plastic_bag_large', name: '비닐봉지(대)', weight: 7, category: 'bag', desc: '마트' },
    // 배달/음식 관련
    { id: 'food_container', name: '음식용기', weight: 35, category: 'food', desc: '배달용기' },
    { id: 'disposable_cutlery', name: '일회용 수저/포크', weight: 3, category: 'food', desc: '세트' },
    { id: 'disposable_plate', name: '일회용 접시', weight: 8, category: 'food', desc: '개당' },
    // 기타 생활용품
    { id: 'cosmetic_container', name: '화장품 용기', weight: 15, category: 'etc', desc: '소형' },
    ...customPlasticItems,
    { id: 'custom_input', name: '기타 (직접 입력)', weight: 0, category: 'custom' }
  ];

  // 기타(추가) 카테고리에 들어갈 아이템 목록 (customPlasticItems 사용)
  const customAddedItems = customPlasticItems.map(item => ({
    ...item,
    category: 'custom-added'
  }));

  // 랭크별 색상 정보
  // Helper function to get colors based on rank theme
  const getThemeColor = () => {
    if (userRanking === 'basic') {
      return isDarkMode ? '#e5e7eb' : '#374151';
    }
    if (userRanking === 'bronze') return '#06b6d4';
    if (userRanking === 'silver') return '#14b8a6';
    if (userRanking === 'gold') return '#fcd34d';
    if (userRanking === 'platinum') return '#c084fc';
    return '#06b6d4'; // default
  };

  // Helper function to get gradient colors
  const getThemeGradient = () => {
    if (userRanking === 'basic') {
      // 기본 테마는 단색 배경
      return isDarkMode ? 'linear-gradient(135deg, #e5e7eb 0%, #e5e7eb 100%)' : 'linear-gradient(135deg, #374151 0%, #374151 100%)';
    }
    if (userRanking === 'bronze') {
      return 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)';
    }
    if (userRanking === 'silver') {
      return 'linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #059669 100%)';
    }
    if (userRanking === 'gold') {
      return 'linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #fbbf24 100%)';
    }
    if (userRanking === 'platinum') {
      return 'linear-gradient(135deg, #e879f9 0%, #d946ef 50%, #c026d3 100%)';
    }
    return 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)'; // default
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
          gradient: 'linear-gradient(135deg, #fde68a, #fcd34d)',
          color: '#fcd34d'
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

  // 사용량 데이터 계산 함수
  const getUsageData = () => {
    if (!usagePeriod) return [];

    const today = new Date(testDate || new Date());
    today.setHours(0, 0, 0, 0);

    // 날짜를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수
    const getDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (usagePeriod === '일주일') {
      // 최근 7일간 데이터
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = getDateString(date);

        const dayUsage = plasticRecords
          .filter(record => {
            const recordDateStr = record.date.split('T')[0]; // ISO 문자열에서 날짜 부분만 추출
            return recordDateStr === dateStr;
          })
          .reduce((sum, record) => sum + record.totalWeight, 0);

        data.push({
          label: `${date.getDate()}일`,
          value: dayUsage
        });
      }
      return data;
    } else if (usagePeriod === '한 달') {
      // 최근 4주간 데이터 (주 단위)
      const data = [];
      for (let i = 3; i >= 0; i--) {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - (i * 7));
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);

        const weekStartStr = getDateString(weekStart);
        const weekEndStr = getDateString(weekEnd);

        const weekUsage = plasticRecords
          .filter(record => {
            const recordDateStr = record.date.split('T')[0];
            return recordDateStr >= weekStartStr && recordDateStr <= weekEndStr;
          })
          .reduce((sum, record) => sum + record.totalWeight, 0);

        // 월이 다르면 월 표시, 같으면 일만 표시
        const endLabel = weekStart.getMonth() === weekEnd.getMonth()
          ? `${weekEnd.getDate()}`
          : `${weekEnd.getMonth()+1}/${weekEnd.getDate()}`;

        data.push({
          label: `${weekStart.getMonth()+1}/${weekStart.getDate()}-${endLabel}`,
          value: weekUsage
        });
      }
      return data;
    } else if (usagePeriod === '6개월') {
      // 최근 6개월 데이터
      const data = [];
      for (let i = 5; i >= 0; i--) {
        const monthEnd = new Date(today);
        monthEnd.setMonth(today.getMonth() - i);
        const monthStart = new Date(monthEnd.getFullYear(), monthEnd.getMonth(), 1);
        const nextMonth = new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 1);
        nextMonth.setDate(0); // 해당 월의 마지막 날

        const monthStartStr = getDateString(monthStart);
        const monthEndStr = getDateString(nextMonth);

        const monthUsage = plasticRecords
          .filter(record => {
            const recordDateStr = record.date.split('T')[0];
            return recordDateStr >= monthStartStr && recordDateStr <= monthEndStr;
          })
          .reduce((sum, record) => sum + record.totalWeight, 0);

        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        data.push({
          label: monthNames[monthEnd.getMonth()],
          value: monthUsage
        });
      }
      return data;
    } else if (usagePeriod === '1년') {
      // 최근 12개월 데이터
      const data = [];
      for (let i = 11; i >= 0; i--) {
        const monthEnd = new Date(today);
        monthEnd.setMonth(today.getMonth() - i);
        const monthStart = new Date(monthEnd.getFullYear(), monthEnd.getMonth(), 1);
        const nextMonth = new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, 1);
        nextMonth.setDate(0); // 해당 월의 마지막 날

        const monthStartStr = getDateString(monthStart);
        const monthEndStr = getDateString(nextMonth);

        const monthUsage = plasticRecords
          .filter(record => {
            const recordDateStr = record.date.split('T')[0];
            return recordDateStr >= monthStartStr && recordDateStr <= monthEndStr;
          })
          .reduce((sum, record) => sum + record.totalWeight, 0);

        data.push({
          label: `${monthEnd.getMonth() + 1}월`,
          value: monthUsage
        });
      }
      return data;
    } else if (usagePeriod === '전체') {
      // 전체 기간 데이터 (연도별로 집계, 최대 6년)
      if (plasticRecords.length === 0) return [];

      const yearlyData = {};
      plasticRecords.forEach(record => {
        const dateStr = record.date.split('T')[0]; // YYYY-MM-DD
        const year = dateStr.split('-')[0]; // YYYY
        if (!yearlyData[year]) {
          yearlyData[year] = 0;
        }
        yearlyData[year] += record.totalWeight;
      });

      const years = Object.keys(yearlyData).map(Number).sort((a, b) => a - b);

      // 최대 6년만 표시
      const displayYears = years.slice(-6);

      const data = displayYears.map(year => ({
        label: `${year}년`,
        value: yearlyData[year]
      }));

      return data;
    }
    
    return [];
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
            onClick={(e) => {
              e.stopPropagation();
              setActiveSubTab('habit');
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              setActiveSubTab('tracking');
            }}
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
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-5 relative`}>
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
                  className={`w-full h-full ${inputBg} rounded-lg flex items-center justify-center gradient-border`}
                  style={{
                    '--gradient': getThemeGradient()
                  }}>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {weeklyProgress[currentWeekStart].challenge || '챌린지를 선택해 주세요'}
                  </span>
                </div>
              ) : !showCustomChallenge ? (
                // 챌린지 시작 전 - 선택 가능
                <button
                  onClick={() => setShowChallengeSelect(!showChallengeSelect)}
                  className={`w-full h-full ${inputBg} rounded-lg px-2 flex justify-between items-center`}
                >
                  <span className={`text-sm flex-1 text-center ${selectedChallenge ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                    {selectedChallenge || '챌린지를 선택해 주세요'}
                  </span>
                  <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
                    <div 
                      className="relative rounded-lg p-[1px]"
                      style={{ background: getThemeGradient() }}
                    >
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
                          customChallengeStorage.add(customChallenge);
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
                    </div>
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
                      <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
                            <X className="w-4 h-4" style={{
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
                      {isToday ? (
                        <span 
                          className="text-xs mb-1 font-bold bg-clip-text text-transparent"
                          style={{
                            backgroundImage: getThemeGradient(),
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}
                        >
                          {dayName}
                        </span>
                      ) : (
                        <span className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {dayName}
                        </span>
                      )}
                      {isToday && dayStatus !== true ? (
                        <div className="relative w-7 h-7">
                          <div 
                            className="absolute inset-0 rounded-full p-[2px]"
                            style={{ background: getThemeGradient() }}
                          >
                            <div className={`w-full h-full rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                              <span className="text-sm font-bold" style={{
                                backgroundImage: getThemeGradient(),
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}>!</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            dayStatus === false ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : 
                            dayStatus !== true && (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                          }`}
                          style={dayStatus === true ? {
                            background: getThemeGradient()
                          } : {}}
                        >
                        {dayStatus === true ? (
                          <Check className={`w-3.5 h-3.5 ${getIconColor()}`} />
                        ) : dayStatus === false ? (
                          <X className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                        ) : (
                          <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                        )}
                        </div>
                      )}
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
                disabled={todayCompleted || (!weeklyProgress[currentWeekStart]?.challenge && !selectedChallenge)}
                className={`w-full h-9 rounded-lg text-sm font-medium transition-all ${
                  todayCompleted || (!weeklyProgress[currentWeekStart]?.challenge && !selectedChallenge)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : `${getButtonTextColor()} hover:opacity-90`
                }`}
                style={!todayCompleted && (weeklyProgress[currentWeekStart]?.challenge || selectedChallenge) ? {
                  background: getThemeGradient()
                } : {}}
              >
                {todayCompleted ? '오늘 완료' : 
                 (!weeklyProgress[currentWeekStart]?.challenge && !selectedChallenge) ? '챌린지를 선택해주세요' : 
                 '오늘 완료하기 (+100P)'}
              </button>
            </div>

            {/* 지난 챌린지 */}
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-4`}>
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
          </div>
        ) : (
          <div className="mx-3 mt-4 space-y-4">
            {/* 목표 설정 및 현황 통합 */}
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-5`}>
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
                <div className={`mb-4 rounded-lg py-2 px-4 text-center gradient-border ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
                  style={{
                    '--gradient': getThemeGradient()
                  }}
                >
                  <div className={`${textColor} text-sm font-medium`}>
                    이번 주 목표: {formatWeight(plasticGoal)}
                  </div>
                </div>
              ) : (
                <div className="relative mb-4 dropdown-container">
                  {/* 드롭다운 버튼 */}
                  <button
                    onClick={() => {
                      setShowGoalDropdown(!showGoalDropdown);
                      // 다른 드롭다운 닫기
                      setShowPlasticSelect(false);
                    }}
                    className={`w-full flex justify-between items-center rounded-lg px-3 py-2 text-sm ${tempPlasticGoal ? 'gradient-border' : ''} ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
                    style={{
                      '--gradient': tempPlasticGoal ? getThemeGradient() : 'transparent'
                    }}
                  >
                    <span className={tempPlasticGoal ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
                      {tempPlasticGoal ? formatWeight(tempPlasticGoal) : '플라스틱 사용 한도를 설정해 주세요'}
                    </span>
                    <ChevronDown className={`transition-transform ${showGoalDropdown ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
                          className={`flex-1 ${
                            isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                          } rounded px-2 py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all focus:outline-none`}
                          style={{
                            boxShadow: `inset 0 0 0 1px ${getThemeColor()}30`
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
                                      <X className="w-3 h-3" />
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
                
                // 목표가 설정되어 있는지 확인
                if (plasticGoal && plasticGoal > 0) {
                  // 목표가 설정된 경우 - 남은 한도 표시
                  const usagePercentage = (weeklyUsage / plasticGoal) * 100;
                  const remainingPercentage = Math.max(0, Math.min(100, Math.round(100 - usagePercentage)));
                  const remainingGrams = Math.max(0, plasticGoal - weeklyUsage);

                  return (
                    <>
                      <div className="flex justify-between text-xs mb-2">
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          남은 한도
                        </span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {remainingPercentage}% ({remainingGrams}g)
                        </span>
                      </div>
                      <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                        <div className="h-1.5 rounded-full transition-all duration-300" style={{ 
                          width: `${remainingPercentage}%`,
                          background: getThemeGradient()
                        }}></div>
                      </div>
                    </>
                  );
                } else {
                  // 목표가 설정되지 않은 경우 - 사용량만 표시
                  return (
                    <>
                      <div className="flex justify-between text-xs mb-2">
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          이번 주 사용량
                        </span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatWeight(weeklyUsage)}
                        </span>
                      </div>
                      <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                        <div className="h-1.5 rounded-full transition-all duration-300" style={{ 
                          width: '0%',
                          background: 'transparent'
                        }}></div>
                      </div>
                    </>
                  );
                }
              })()}
            </div>

            {/* 플라스틱 사용 기록하기 */}
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>플라스틱 사용 기록하기</h3>
              <div className="space-y-3">
                <div className="relative dropdown-container">
                  {!showCustomPlastic ? (
                    <div 
                      className="relative rounded-lg p-[1px]"
                      style={{ background: selectedPlasticItem ? getThemeGradient() : 'transparent' }}
                    >
                      <button
                        onClick={() => {
                          setShowPlasticSelect(!showPlasticSelect);
                          // 다른 드롭다운 닫기
                          setShowGoalDropdown(false);
                        }}
                        className={`w-full ${inputBg} rounded-lg p-2 flex justify-between items-center`}
                      >
                        <span className={`text-sm flex-1 text-center ${selectedPlasticItem ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                          {selectedPlasticItem || '아이템을 선택해 주세요'}
                        </span>
                        <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* 배경 블러 오버레이 - 카드 영역만 */}
                      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/[0.02] z-10 rounded-xl" onClick={() => {
                        setShowCustomPlastic(false);
                        setCustomPlasticItem('');
                        setCustomPlasticWeight(10);
                        setIsLoadingWeight(false);
                        if (previousPlasticItem) {
                          setSelectedPlasticItem(previousPlasticItem); // 이전 항목으로 복귀
                        }
                      }} />
                      <div className="mt-1 relative z-20 space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <div 
                            className="relative rounded-lg p-[1px]"
                            style={{ background: getThemeGradient() }}
                          >
                            <input
                              type="text"
                              value={customPlasticItem}
                              onChange={async (e) => {
                              const value = e.target.value;
                              setCustomPlasticItem(value);
                              
                              // 입력이 비어있지 않은 경우 무게 추천
                              if (value.trim()) {
                                setIsLoadingWeight(true);
                                try {
                                  // API 호출 또는 폴백 로직 사용
                                  const estimation = await fallbackEstimation(value);
                                  setCustomPlasticWeight(estimation.weight);
                                  
                                  // 추천 결과 표시 (선택적)
                                  if (estimation.confidence === 'high') {
                                    // 높은 신뢰도일 때만 자동 설정
                                  } else if (estimation.confidence === 'low') {
                                    // 낮은 신뢰도일 때 기본값 유지
                                    setCustomPlasticWeight(15); // 기본값
                                  }
                                } catch (error) {
                                  console.error('무게 추천 오류:', error);
                                  setCustomPlasticWeight(15); // 오류 시 기본값
                                } finally {
                                  setIsLoadingWeight(false);
                                }
                              }
                            }}
                              placeholder="항목 이름 입력"
                              className={`w-full ${inputBg} rounded-lg p-2 pr-8 text-sm ${textColor}`}
                              autoFocus
                            />
                          </div>
                          <button
                            onClick={() => {
                              setShowCustomPlastic(false);
                              setShowPlasticSelect(true);
                              setCustomPlasticItem('');
                              setCustomPlasticWeight(10);
                              setIsLoadingWeight(false);
                              if (previousPlasticItem) {
                                setSelectedPlasticItem(previousPlasticItem);
                              }
                            }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-${isDarkMode ? '700' : '200'} rounded transition-colors`}
                          >
                            <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <div 
                            className="relative rounded-lg p-[1px]"
                            style={{ background: getThemeGradient() }}
                          >
                            <input
                              type="number"
                              value={isLoadingWeight ? '' : customPlasticWeight}
                              onChange={(e) => setCustomPlasticWeight(e.target.value)}
                              onKeyPress={async (e) => {
                              if (e.key === 'Enter' && customPlasticItem && customPlasticWeight) {
                                // 중복 체크
                                const allItems = [...plasticItems, ...customAddedItems];
                                if (allItems.some(item => item.name === customPlasticItem)) {
                                  if (showToast) {
                                    showToast(`이미 존재하는 아이템입니다`, 'error');
                                  }
                                  return;
                                }

                                // 고유 ID 생성 (custom_ 접두사 + 타임스탬프)
                                const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                const newItem = {
                                  id: customId,
                                  name: customPlasticItem,
                                  weight: parseInt(customPlasticWeight),
                                  desc: `추천 ${customPlasticWeight}g`
                                };
                                const updatedItems = [...customPlasticItems, newItem];
                                setCustomPlasticItems(updatedItems);
                                customPlasticItemStorage.set(updatedItems);

                                // Supabase zero_chal_item 테이블에도 추가
                                try {
                                  await supabase
                                    .from('zero_chal_item')
                                    .insert({
                                      item_id: customId,
                                      item_name: customPlasticItem,
                                      tag: 'custom',
                                      plastic_amount: parseInt(customPlasticWeight)
                                    });
                                  console.log('커스텀 아이템을 zero_chal_item에 추가했습니다');
                                } catch (error) {
                                  console.error('커스텀 아이템 추가 실패:', error);
                                }

                                setSelectedPlasticItem(customPlasticItem);
                                setCustomPlasticItem('');
                                setCustomPlasticWeight(10);
                                setShowCustomPlastic(false);
                                setIsLoadingWeight(false);
                                if (showToast) {
                                  showToast(`${customPlasticItem} 항목이 추가되었습니다`, 'success');
                                }
                              }
                            }}
                              placeholder={isLoadingWeight ? "추천 중..." : "개당 무게"}
                              className={`w-full ${inputBg} rounded-lg p-2 pr-8 text-sm ${textColor} [
                                appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                              disabled={isLoadingWeight}
                            />
                            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              g
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (customPlasticItem && customPlasticWeight) {
                              // 중복 체크
                              const allItems = [...plasticItems, ...customAddedItems];
                              if (allItems.some(item => item.name === customPlasticItem)) {
                                if (showToast) {
                                  showToast(`이미 존재하는 아이템입니다`, 'error');
                                }
                                return;
                              }
                              
                              // 고유 ID 생성 (custom_ 접두사 + 타임스탬프)
                              const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                              const newItem = {
                                id: customId,
                                name: customPlasticItem,
                                weight: parseInt(customPlasticWeight),
                                desc: `추천 ${customPlasticWeight}g`
                              };
                              setCustomPlasticItems([...customPlasticItems, newItem]);
                              customPlasticItemStorage.set([...customPlasticItems, newItem]);

                              // Supabase zero_chal_item 테이블에도 추가
                              try {
                                await supabase
                                  .from('zero_chal_item')
                                  .insert({
                                    item_id: customId,
                                    item_name: customPlasticItem,
                                    tag: 'custom',
                                    plastic_amount: parseInt(customPlasticWeight)
                                  });
                                console.log('커스텀 아이템을 zero_chal_item에 추가했습니다');
                              } catch (error) {
                                console.error('커스텀 아이템 추가 실패:', error);
                              }
                              setSelectedPlasticItem(customPlasticItem);
                              setCustomPlasticItem('');
                              setCustomPlasticWeight(10);
                              setShowCustomPlastic(false);
                              setIsLoadingWeight(false);
                              if (showToast) {
                                showToast(`${customPlasticItem} 항목이 추가되었습니다`, 'success');
                              }
                            }
                          }}
                          disabled={!customPlasticItem || !customPlasticWeight || isLoadingWeight}
                          className={`flex-1 h-9 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                            (!customPlasticItem || !customPlasticWeight || isLoadingWeight)
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : `${getButtonTextColor()} hover:opacity-90`
                          }`}
                          style={(!customPlasticItem || !customPlasticWeight || isLoadingWeight) ? {} : {
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
                      <div className={`text-xs px-2 py-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center italic`}>
                        아이템이 없거나 무게가 맞지 않는 경우<br />
                        아래 '기타'를 클릭해서 직접 추가하세요
                      </div>
                      <div className={`my-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}></div>
                      {(() => {
                        const categories = {
                          drink: { label: '음료 관련', items: [] },
                          bag: { label: '봉투류', items: [] },
                          food: { label: '배달/음식 관련', items: [] },
                          etc: { label: '기타 생활용품', items: [] },
                          'custom-added': { label: '기타 (추가)', items: [] },
                          custom: { label: '사용자 정의', items: [] }
                        };
                        
                        // 기본 항목 추가
                        plasticItems.forEach(item => {
                          if (categories[item.category]) {
                            categories[item.category].items.push(item);
                          }
                        });
                        
                        // 기타(추가) 항목 추가
                        customAddedItems.forEach(item => {
                          categories['custom-added'].items.push(item);
                        });
                        
                        return Object.entries(categories).map(([key, category], categoryIndex) => {
                          if (category.items.length === 0) return null;
                          
                          return (
                            <div key={key}>
                              {(key !== 'custom' || category.items.length > 0) && (
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
                                        // customPlasticItems에서 삭제
                                        const updatedItems = customPlasticItems.filter(c => c.name !== item.name);
                                        setCustomPlasticItems(updatedItems);
                                        customPlasticItemStorage.set(updatedItems);
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
                                      <X className="w-4 h-4" style={{
                                        color: getThemeColor()
                                      }} />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {/* 카테고리 구분선 - 마지막 카테고리가 아니고 custom이 아닌 경우에만 표시 */}
                              {categoryIndex < Object.entries(categories).filter(([k, c]) => c.items.length > 0).length - 1 && 
                               key !== 'custom' && (
                                <div className={`mt-2 mb-2 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}></div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                    </>
                  )}
                </div>

                {/* 가로 구분선 - 양 끝이 흐려지는 효과 */}
                <div className="relative my-3">
                  <div className={`h-px w-full bg-gradient-to-r from-transparent via-${isDarkMode ? 'gray-600' : 'gray-300'} to-transparent`}></div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs text-center block`}>수량</label>
                    <div className={`flex items-center justify-center gap-1 mt-1 h-9 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg px-1`}>
                      <button
                        onClick={() => setPlasticQuantity(Math.max(1, plasticQuantity - 1))}
                        className={`flex-1 h-7 rounded-md ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-50 hover:bg-gray-100'} flex items-center justify-center text-lg font-medium transition-colors`}
                      >
                        -
                      </button>
                      <div className={`flex-1 h-7 flex items-center justify-center text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {plasticQuantity}
                      </div>
                      <button
                        onClick={() => setPlasticQuantity(plasticQuantity + 1)}
                        className={`flex-1 h-7 rounded-md ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-50 hover:bg-gray-100'} flex items-center justify-center text-lg font-medium transition-colors`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs text-center block`}>총 무게</label>
                    <div className={`h-9 mt-1 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg flex items-center justify-center text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {(() => {
                        let totalWeight = 0;
                        if (showCustomPlastic && customPlasticWeight) {
                          totalWeight = plasticQuantity * customPlasticWeight;
                        } else if (selectedPlasticItem && selectedPlasticItem !== '기타 (직접 입력)') {
                          const item = plasticItems.find(i => i.name === selectedPlasticItem) || 
                                     customPlasticItems.find(i => i.name === selectedPlasticItem) ||
                                     customAddedItems.find(i => i.name === selectedPlasticItem);
                          if (item && item.weight) {
                            totalWeight = plasticQuantity * item.weight;
                          }
                        }
                        
                        // 1000g 이상은 kg로 표시
                        if (totalWeight >= 1000) {
                          const kg = totalWeight / 1000;
                          return kg % 1 === 0 ? `${kg}kg` : `${kg.toFixed(1)}kg`;
                        }
                        return `${totalWeight}g`;
                      })()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    let recordItem = null;
                    let totalWeight = 0;

                    if (selectedPlasticItem && selectedPlasticItem !== '') {
                      recordItem = plasticItems.find(i => i.name === selectedPlasticItem) ||
                                  customPlasticItems.find(i => i.name === selectedPlasticItem) ||
                                  customAddedItems.find(i => i.name === selectedPlasticItem);
                      if (recordItem) {
                        totalWeight = plasticQuantity * recordItem.weight;
                      }
                    }

                    if (recordItem && plasticQuantity > 0) {
                      // ✅ recordItem.name 검증 추가
                      if (!recordItem.name || recordItem.name.trim() === '') {
                        console.error('❌ 플라스틱 아이템 이름이 없습니다:', recordItem);
                        alert('플라스틱 아이템을 선택해주세요.');
                        return;
                      }

                      // 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (UTC 변환 없이)
                      const currentDate = testDate || new Date();
                      let localDateStr;

                      if (typeof currentDate === 'string') {
                        localDateStr = currentDate.split('T')[0];
                      } else {
                        const year = currentDate.getFullYear();
                        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                        const day = String(currentDate.getDate()).padStart(2, '0');
                        localDateStr = `${year}-${month}-${day}`;
                      }

                      const newRecord = {
                        date: `${localDateStr}T00:00:00.000Z`, // 날짜만 사용, 시간은 00:00:00
                        item: recordItem.name,
                        quantity: plasticQuantity,
                        unitWeight: recordItem.weight,
                        totalWeight: totalWeight
                      };

                      // Supabase에 플라스틱 기록 저장 (UPSERT 방식)
                      try {
                        const { data: { user }, error: userError } = await supabase.auth.getUser();

                        if (userError) {
                          console.error('사용자 인증 오류:', userError);
                          throw userError;
                        }

                        if (user) {
                          const { data, error } = await saveZeroChallengeRecord(user.id, {
                            item_name: recordItem.name, // ✅ item_name을 먼저 (필수)
                            item_num: 1,
                            tracked_date: localDateStr, // 이미 계산된 로컬 날짜 사용
                            quantity: plasticQuantity,
                            weight: totalWeight
                          });

                          if (error) {
                            console.error('플라스틱 기록 저장 에러:', error);
                          } else {
                            console.log('플라스틱 기록 저장 성공:', data);
                            // DB에서 반환된 record_id를 newRecord에 추가
                            if (data && data.record_id) {
                              newRecord.recordId = data.record_id;
                            }
                          }
                        } else {
                          console.warn('로그인된 사용자가 없습니다.');
                        }
                      } catch (error) {
                        console.error('플라스틱 기록 저장 실패:', error);
                      }

                      // DB 저장 후 plasticRecords에 추가 (record_id 포함)
                      const updatedRecords = [...plasticRecords, newRecord];
                      setPlasticRecords(updatedRecords);
                      localStorage.setItem('plasticRecords', JSON.stringify(updatedRecords));

                      // 입력 초기화
                      setSelectedPlasticItem(null);
                      setPlasticQuantity(1);
                    }
                  }}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  기록하기
                </button>
              </div>
            </div>

            {/* 사용량 분석 */}
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>사용량 분석</h3>
              <div className="space-y-2">
                {(() => {
                  // 선택된 기간에 맞는 데이터만 필터링
                  const today = new Date(testDate || new Date());
                  today.setHours(0, 0, 0, 0);

                  let filteredRecords = plasticRecords;

                  if (usagePeriod === '일주일') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 6);
                    filteredRecords = plasticRecords.filter(record => {
                      const recordDate = new Date(record.date);
                      return recordDate >= weekAgo && recordDate <= today;
                    });
                  } else if (usagePeriod === '한 달') {
                    const monthAgo = new Date(today);
                    monthAgo.setDate(today.getDate() - 27); // 4주
                    filteredRecords = plasticRecords.filter(record => {
                      const recordDate = new Date(record.date);
                      return recordDate >= monthAgo && recordDate <= today;
                    });
                  } else if (usagePeriod === '6개월') {
                    const sixMonthsAgo = new Date(today);
                    sixMonthsAgo.setMonth(today.getMonth() - 6);
                    filteredRecords = plasticRecords.filter(record => {
                      const recordDate = new Date(record.date);
                      return recordDate >= sixMonthsAgo && recordDate <= today;
                    });
                  } else if (usagePeriod === '1년') {
                    const yearAgo = new Date(today);
                    yearAgo.setFullYear(today.getFullYear() - 1);
                    filteredRecords = plasticRecords.filter(record => {
                      const recordDate = new Date(record.date);
                      return recordDate >= yearAgo && recordDate <= today;
                    });
                  }
                  // usagePeriod === '전체'인 경우 filteredRecords는 plasticRecords 그대로

                  // 아이템별로 그룹핑 및 정렬
                  const analysis = {};
                  let totalWeight = 0;

                  filteredRecords.forEach(record => {
                    const itemName = record.item;
                    if (!analysis[itemName]) {
                      analysis[itemName] = { weight: 0, count: 0 };
                    }
                    analysis[itemName].weight += record.totalWeight;
                    analysis[itemName].count += record.quantity;
                    totalWeight += record.totalWeight;
                  });
                  
                  // 무게 기준으로 정렬
                  const sortedItems = Object.entries(analysis)
                    .sort((a, b) => b[1].weight - a[1].weight)
                    .map(([name, data]) => ({
                      name,
                      weight: data.weight,
                      count: data.count,
                      percentage: totalWeight > 0 ? Math.round((data.weight / totalWeight) * 100) : 0
                    }));
                  
                  if (sortedItems.length === 0) {
                    return <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>아직 기록된 데이터가 없습니다</p>;
                  }
                  
                  // 색상 테마 함수
                  const getItemColor = (index) => {
                    if (index === 0) {
                      // 1위는 풀 컬러
                      return getThemeGradient();
                    } else if (index === 1) {
                      // 2위는 75% 농도
                      return userRanking === 'basic' ? (isDarkMode ? 'linear-gradient(to right, rgba(255,255,255,0.75), rgba(255,255,255,0.75))' : 'linear-gradient(to right, rgba(31,41,55,0.75), rgba(31,41,55,0.75))') :
                             userRanking === 'bronze' ? 'linear-gradient(to right, rgba(6,182,212,0.75), rgba(59,130,246,0.75))' :
                             userRanking === 'silver' ? 'linear-gradient(to right, rgba(203,213,225,0.75), rgba(20,184,166,0.75))' :
                             userRanking === 'gold' ? 'linear-gradient(to right, rgba(253,230,138,0.75), rgba(252,211,77,0.75))' :
                             userRanking === 'platinum' ? 'linear-gradient(to right, rgba(192,132,252,0.75), rgba(236,72,153,0.75))' :
                             'linear-gradient(to right, rgba(6,182,212,0.75), rgba(59,130,246,0.75))';
                    } else if (index === 2) {
                      // 3위는 50% 농도
                      return userRanking === 'basic' ? (isDarkMode ? 'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.5))' : 'linear-gradient(to right, rgba(31,41,55,0.5), rgba(31,41,55,0.5))') :
                             userRanking === 'bronze' ? 'linear-gradient(to right, rgba(6,182,212,0.5), rgba(59,130,246,0.5))' :
                             userRanking === 'silver' ? 'linear-gradient(to right, rgba(203,213,225,0.5), rgba(20,184,166,0.5))' :
                             userRanking === 'gold' ? 'linear-gradient(to right, rgba(253,230,138,0.5), rgba(252,211,77,0.5))' :
                             userRanking === 'platinum' ? 'linear-gradient(to right, rgba(192,132,252,0.5), rgba(236,72,153,0.5))' :
                             'linear-gradient(to right, rgba(6,182,212,0.5), rgba(59,130,246,0.5))';
                    } else if (index === 3) {
                      // 4위는 25% 농도
                      return userRanking === 'basic' ? (isDarkMode ? 'linear-gradient(to right, rgba(255,255,255,0.25), rgba(255,255,255,0.25))' : 'linear-gradient(to right, rgba(31,41,55,0.25), rgba(31,41,55,0.25))') :
                             userRanking === 'bronze' ? 'linear-gradient(to right, rgba(6,182,212,0.25), rgba(59,130,246,0.25))' :
                             userRanking === 'silver' ? 'linear-gradient(to right, rgba(203,213,225,0.25), rgba(20,184,166,0.25))' :
                             userRanking === 'gold' ? 'linear-gradient(to right, rgba(253,230,138,0.25), rgba(252,211,77,0.25))' :
                             userRanking === 'platinum' ? 'linear-gradient(to right, rgba(192,132,252,0.25), rgba(236,72,153,0.25))' :
                             'linear-gradient(to right, rgba(6,182,212,0.25), rgba(59,130,246,0.25))';
                    } else {
                      // 5위 이후는 지난 챌린지 바 색상 (회색)
                      return isDarkMode ? 'linear-gradient(to right, #4b5563, #4b5563)' : 
                             'linear-gradient(to right, #d1d5db, #d1d5db)';
                    }
                  };
                  
                  return (
                    <div className={`${sortedItems.length > 4 ? 'max-h-[135px] overflow-y-auto' : ''}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <style>{`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      {sortedItems.map((item, index) => (
                        <div key={item.name} className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {item.name} ({item.count}개, {formatWeight(item.weight)})
                            </span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.percentage}%</span>
                          </div>
                          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                            <div className="h-1.5 rounded-full transition-all duration-300" style={{ 
                              width: `${item.percentage}%`,
                              background: getItemColor(index)
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 주간 사용량 그래프 */}
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-4`}>
              <h3 className={`${textColor} text-sm font-medium mb-3`}>주간 사용량(지난 7일)</h3>
              <div className="flex justify-between items-end" style={{ height: '135px' }}>
                {(() => {
                  // 지난 7일간의 데이터 계산
                  const today = new Date(testDate || new Date());
                  const weekData = [];
                  
                  for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    date.setHours(0, 0, 0, 0);

                    // 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (UTC 변환 없이)
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

                    const dayRecords = plasticRecords.filter(record => {
                      const recordDateStr = record.date.split('T')[0];
                      return recordDateStr === dateStr;
                    });

                    const totalWeight = dayRecords.reduce((sum, record) => sum + record.totalWeight, 0);

                    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                    weekData.push({
                      day: dayNames[date.getDay()],
                      usage: totalWeight,
                      date: `${date.getMonth() + 1}/${date.getDate()}`
                    });
                  }
                  
                  const maxUsage = Math.max(...weekData.map(d => d.usage), 100);
                  
                  // 사용량 기준으로 순위 정렬하여 색상 농도 계산
                  const sortedByUsage = [...weekData].sort((a, b) => b.usage - a.usage);
                  const getBarColor = (usage) => {
                    const rank = sortedByUsage.findIndex(d => d.usage === usage);
                    let opacity = 1;
                    if (rank === 0) opacity = 1;        // 1위 100%
                    else if (rank === 1) opacity = 0.85; // 2위 85%
                    else if (rank === 2) opacity = 0.7;  // 3위 70%
                    else if (rank === 3) opacity = 0.55; // 4위 55%
                    else if (rank === 4) opacity = 0.4;  // 5위 40%
                    else if (rank === 5) opacity = 0.25; // 6위 25%
                    else opacity = 0.15;                 // 7위 15%
                    
                    // 테마별 색상 적용
                    if (userRanking === 'basic') {
                      return isDarkMode 
                        ? `rgba(255, 255, 255, ${opacity})`
                        : `rgba(31, 41, 55, ${opacity})`;
                    } else if (userRanking === 'bronze') {
                      return `linear-gradient(to top, rgba(6, 182, 212, ${opacity}), rgba(59, 130, 246, ${opacity}))`;
                    } else if (userRanking === 'silver') {
                      return `linear-gradient(to top, rgba(203, 213, 225, ${opacity}), rgba(20, 184, 166, ${opacity}))`;
                    } else if (userRanking === 'gold') {
                      return `linear-gradient(to top, rgba(253, 230, 138, ${opacity}), rgba(252, 211, 77, ${opacity}))`;
                    } else if (userRanking === 'platinum') {
                      return `linear-gradient(to top, rgba(192, 132, 252, ${opacity}), rgba(236, 72, 153, ${opacity}))`;
                    }
                    return `linear-gradient(to top, rgba(6, 182, 212, ${opacity}), rgba(59, 130, 246, ${opacity}))`;
                  };
                  
                  return weekData.map((data) => (
                    <div key={data.date} className="flex flex-col items-center flex-1">
                      <div className="relative flex flex-col justify-end" style={{ height: '90px' }}>
                        <div 
                          className="w-8 rounded-t relative"
                          style={{ 
                            height: `${data.usage > 0 ? (data.usage / maxUsage) * 90 : 0}px`,
                            background: getBarColor(data.usage)
                          }}
                        >
                        </div>
                        {/* 사용량 텍스트를 그래프 위에 표시 */}
                        {data.usage > 0 && (
                          <span 
                            className={`text-[10px] font-medium absolute left-1/2 -translate-x-1/2 whitespace-nowrap ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                            style={{
                              bottom: `${Math.min((data.usage / maxUsage) * 90 + 2, 92)}px`
                            }}
                          >
                            {formatWeight(data.usage)}
                          </span>
                        )}
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

            {/* 이번 주 기록 */}
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-3 h-[280px] flex flex-col`}>
              <h3 className={`${textColor} text-sm font-medium mb-1.5`}>이번 주 기록</h3>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {(() => {
                  // 이번 주 시작일 (월요일) 계산
                  const currentDate = new Date(testDate || new Date());
                  const today = new Date(testDate || new Date());
                  const dayOfWeek = currentDate.getDay();
                  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                  const monday = new Date(currentDate);
                  monday.setDate(currentDate.getDate() + mondayOffset);
                  monday.setHours(0, 0, 0, 0);
                  
                  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
                  const weekRecords = [];
                  
                  for (let i = 0; i < 7; i++) {
                    const date = new Date(monday);
                    date.setDate(monday.getDate() + i);
                    date.setHours(0, 0, 0, 0);

                    // 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (UTC 변환 없이)
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

                    const dayRecords = plasticRecords.filter(record => {
                      const recordDateStr = record.date.split('T')[0];
                      return recordDateStr === dateStr;
                    });

                    weekRecords.push({
                      day: weekDays[i],
                      date: date,
                      records: dayRecords,
                      totalWeight: dayRecords.reduce((sum, r) => sum + r.totalWeight, 0)
                    });
                  }
                  
                  // Toggle function for expanding/collapsing days
                  const toggleDay = (index) => {
                    setExpandedDays(prev => 
                      prev.includes(index) 
                        ? prev.filter(i => i !== index)
                        : [...prev, index]
                    );
                  };

                  // Group items by type and count
                  const groupItems = (records) => {
                    const itemMap = {};
                    records.forEach(record => {
                      const key = record.item;
                      if (itemMap[key]) {
                        itemMap[key].quantity += record.quantity;
                        itemMap[key].totalWeight += record.totalWeight;
                      } else {
                        itemMap[key] = {
                          item: record.item,
                          quantity: record.quantity,
                          totalWeight: record.totalWeight
                        };
                      }
                    });
                    return Object.values(itemMap);
                  };

                  return weekRecords.map((dayData, index) => {
                    const isExpanded = expandedDays.includes(index);
                    const groupedItems = groupItems(dayData.records);
                    
                    return (
                      <div key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} last:border-b-0`}>
                        <div 
                          className="py-[0.3rem] cursor-pointer hover:bg-opacity-5 hover:bg-gray-500 transition-colors"
                          onClick={() => toggleDay(index)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] transition-transform inline-block w-2 ${
                                dayData.records.length > 0 
                                  ? `${textColor} ${isExpanded ? 'rotate-90' : ''}`
                                  : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                              }`}>
                                {dayData.records.length > 0 ? '▶' : '▷'}
                              </span>
                              <span className={`text-xs ${textColor}`}>
                                {dayData.day}요일
                                <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ml-1`}>
                                  ({dayData.date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })})
                                </span>
                              </span>
                            </div>
                            {dayData.totalWeight > 0 && (
                              <span className={`text-[10px] ${textColor}`}>
                                {formatWeight(dayData.totalWeight)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Expanded content */}
                        {isExpanded && dayData.records.length > 0 && (
                          <div className={`px-4 pb-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {groupedItems.map((item, idx) => (
                              <div key={idx} className="text-[10px] py-0 pl-3">
                                - {item.item} ({item.quantity}개, {formatWeight(item.totalWeight)})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
              <div className={`mt-1.5 pt-1.5 border-t ${borderColor}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${textColor}`}>주간 총계</span>
                  <span className={`text-xs ${textColor}`}>
                    {(() => {
                      const today = new Date(testDate || new Date());
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
                      
                      return formatWeight(weekTotal);
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* 사용량 섹션 */}
            <div className={`${cardBg} border-[0.3px] ${borderColor} rounded-xl p-3 h-[280px] flex flex-col`}>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className={`${textColor} text-sm font-medium`}>사용량</h3>
                <div className="relative dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUsagePeriodDropdown(!showUsagePeriodDropdown);
                      // 다른 드롭다운 닫기
                      setShowGoalDropdown(false);
                      setShowPlasticSelect(false);
                    }}
                    className={`flex items-center gap-1 px-2 py-1 text-xs ${
                      isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } rounded transition-colors`}
                  >
                    <span>{usagePeriod || '기간'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showUsagePeriodDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showUsagePeriodDropdown && (
                    <div className={`absolute right-0 mt-1 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } border ${borderColor} rounded-lg shadow-lg z-20 overflow-hidden`} style={{ width: 'auto' }}>
                      {['일주일', '한 달', '6개월', '1년', '전체'].map((period, idx) => (
                        <React.Fragment key={period}>
                          <button
                            onClick={() => {
                              setUsagePeriod(period);
                              setShowUsagePeriodDropdown(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-xs transition-colors whitespace-nowrap ${
                              usagePeriod === period 
                                ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                                : (isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50')
                            }`}
                          >
                            {period}
                          </button>
                          {idx < 4 && <div className={`border-b ${borderColor}`} />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 그래프 영역 - 주간 사용량 스타일 */}
              {usagePeriod && (
                <div className="relative flex justify-between items-end flex-1 pb-4">
                  {(() => {
                    const data = getUsageData();
                    if (data.length === 0) {
                      return (
                        <div className="flex items-center justify-center w-full h-full">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            데이터가 없습니다
                          </span>
                        </div>
                      );
                    }
                    
                    const maxValue = Math.max(...data.map(d => d.value), 100);
                    const nonZeroData = data.filter(d => d.value > 0);
                    const avgValue = nonZeroData.length > 0 
                      ? nonZeroData.reduce((sum, d) => sum + d.value, 0) / nonZeroData.length 
                      : 0;
                    
                    // 그래프 높이 설정
                    const graphHeight = 200; // flex-1 대신 고정 높이 사용
                    
                    // 평균선 높이 계산 - 점들과 동일한 스케일 사용
                    const avgHeight = (avgValue / maxValue) * (graphHeight * 0.70) + 20;
                    
                    return (
                      <>
                        {/* 점과 점 사이 개별 연결선 - 0이 아닌 값만 연결 */}
                        <svg className="absolute inset-0 pointer-events-none" style={{ height: `${graphHeight}px`, width: '100%' }}>
                          {data.length >= 1 && (() => {
                            const lines = [];
                            const dots = [];
                            let lastNonZeroIndex = -1;
                            let firstNonZeroIndex = -1;
                            let finalNonZeroIndex = -1;
                            
                            // 첫 번째와 마지막 0이 아닌 값의 인덱스 찾기
                            data.forEach((item, index) => {
                              if (item.value > 0) {
                                if (firstNonZeroIndex === -1) {
                                  firstNonZeroIndex = index;
                                }
                                finalNonZeroIndex = index;
                              }
                            });
                            
                            data.forEach((item, index) => {
                              if (item.value > 0) {
                                if (lastNonZeroIndex !== -1) {
                                  // 이전 0이 아닌 점과 현재 점을 연결
                                  const prevItem = data[lastNonZeroIndex];
                                  const itemWidth = 100 / data.length;
                                  const x1 = (lastNonZeroIndex + 0.5) * itemWidth;
                                  const y1 = graphHeight - ((prevItem.value / maxValue) * (graphHeight * 0.70)) - 20;
                                  const x2 = (index + 0.5) * itemWidth;
                                  const y2 = graphHeight - ((item.value / maxValue) * (graphHeight * 0.70)) - 20;
                                  
                                  lines.push(
                                    <line
                                      key={`${lastNonZeroIndex}-${index}`}
                                      x1={`${x1}%`}
                                      y1={y1}
                                      x2={`${x2}%`}
                                      y2={y2}
                                      stroke={getThemeColor()}
                                      strokeWidth="0.5"
                                      strokeLinecap="round"
                                    />
                                  );
                                }
                                
                                // 모든 데이터 포인트(선이 꺾이는 지점)에 점 추가
                                const itemWidth = 100 / data.length;
                                const x = (index + 0.5) * itemWidth;
                                const y = graphHeight - ((item.value / maxValue) * (graphHeight * 0.70)) - 20;
                                
                                dots.push(
                                  <circle
                                    key={`dot-${index}`}
                                    cx={`${x}%`}
                                    cy={y}
                                    r="2.5"
                                    fill={getThemeColor()}
                                  />
                                );
                                
                                lastNonZeroIndex = index;
                              }
                            });
                            
                            return [...lines, ...dots];
                          })()}
                          
                          {/* 평균선 - SVG 내부에서 그리기 */}
                          {nonZeroData.length >= 2 && (() => {
                            const avgY = graphHeight - ((avgValue / maxValue) * (graphHeight * 0.70)) - 20;
                            return (
                              <>
                                {/* 평균 텍스트 - 거의 왼쪽 벽 */}
                                <text 
                                  x="0.1%" 
                                  y={avgY}
                                  dominantBaseline="middle"
                                  textAnchor="start"
                                  className={`text-[10px] ${isDarkMode ? 'fill-white' : 'fill-black'}`}
                                >
                                  평균
                                </text>
                                {/* 평균과 값 사이의 선 - 양쪽 텍스트와 동일한 간격 */}
                                <line 
                                  x1="9%" 
                                  y1={avgY}
                                  x2="91%" 
                                  y2={avgY}
                                  stroke={isDarkMode ? 'white' : 'black'}
                                  strokeWidth="0.5"
                                />
                                {/* 값 텍스트 - 거의 오른쪽 벽 */}
                                <text 
                                  x="99.9%" 
                                  y={avgY}
                                  dominantBaseline="middle"
                                  textAnchor="end"
                                  className={`text-[10px] ${isDarkMode ? 'fill-white' : 'fill-black'}`}
                                >
                                  {formatWeight(Math.round(avgValue))}
                                </text>
                              </>
                            );
                          })()}
                        </svg>
                        
                        {/* 데이터 포인트들 */}
                        {data.map((item, index) => {
                          const height = (item.value / maxValue) * (graphHeight * 0.70) + 20;
                          // 0이 아닌 값 중에서 최대값과 최소값 찾기
                          const nonZeroValues = data.filter(d => d.value > 0).map(d => d.value);
                          const maxVal = nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 0;
                          const minVal = nonZeroValues.length > 0 ? Math.min(...nonZeroValues) : 0;
                          const isMax = item.value > 0 && item.value === maxVal;
                          const isMin = item.value > 0 && item.value === minVal && minVal !== maxVal; // 최소값과 최대값이 같으면 최소값 표시 안함
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-1 relative">
                              <div className="relative flex flex-col justify-end" style={{ height: `${graphHeight}px` }}>
                                {/* 데이터 포인트 제거 - 선만 표시 */}
                                {/* 최대값과 최소값만 표시 */}
                                {isMax && item.value > 0 && (
                                  <span 
                                    className={`text-[11px] font-medium absolute left-1/2 -translate-x-1/2 whitespace-nowrap ${
                                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                    style={{
                                      bottom: `${height + 5}px` // 최대값은 항상 점 위에
                                    }}
                                  >
                                    {formatWeight(item.value)}
                                  </span>
                                )}
                                {isMin && item.value > 0 && (
                                  <span 
                                    className={`text-[11px] font-medium absolute left-1/2 -translate-x-1/2 whitespace-nowrap ${
                                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                    style={{
                                      bottom: `${Math.max(height - 20, 5)}px` // 최소값은 항상 점 아래에 (더 많은 간격)
                                    }}
                                  >
                                    {formatWeight(item.value)}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                {usagePeriod === '1년' ? item.label.replace('월', '') : item.label}
                              </span>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              )}
              
              {/* 기간 선택 안 된 경우 */}
              {!usagePeriod && (
                <div className="flex-1 flex items-center justify-center">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    기간을 선택해주세요
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenge;