import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Home, Target, Gift, Users, MoreHorizontal, Bell } from 'lucide-react';
import HomePage from './pages/home/Home';
import ChallengePage from './pages/challenge/Challenge';
import RewardsPage from './pages/rewards/Rewards';
import CommunityPage from './pages/community/Community';
import MorePage from './pages/more/More';
import SettingsScreen from './pages/settings/SettingsScreen';
import ProfileScreen from './pages/settings/ProfileScreen';
import FriendsList from './pages/community/FriendsList';
import ChatBot from './pages/more/ChatBot';
import NotificationsScreen from './pages/settings/NotificationsScreen';
import { ThemeSettings, RankThemeSettings, LanguageSettings, NotificationSettings, LocationSettings, AquariumSettings } from './pages/settings/Settings';
import Toast from './components/Toast';
import Login from './pages/auth/Login';
import { onAuthStateChange, getCurrentUser, signOut, createOrUpdateUserProfile } from './lib/auth';
import { getUserInfo, saveUserInfo, getUserItems } from './lib/database';
import { supabase } from './lib/supabase';
import {
  appSettingsStorage,
  aquariumSettingsStorage,
  selectedChallengeStorage,
  customChallengeStorage,
  getLocalStorage,
  setLocalStorage
} from './utils/localStorage';
import { DataProvider, useData } from './services/DataContext';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const EcostepAppContent = () => {
  // 전역 데이터 컨텍스트 사용
  const {
    preloadAllData,
    isLoading: isDataLoading,
    purchasedFish,
    setPurchasedFish,
    purchasedDecorations,
    setPurchasedDecorations
  } = useData();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('habit');
  const [challengeDay, setChallengeDay] = useState(4);
  const [plasticGoal, setPlasticGoal] = useState(() => {
    const saved = localStorage.getItem('plasticGoal');
    return saved ? parseInt(saved) : null;
  });
  const [currentPlastic, setCurrentPlastic] = useState(320);
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('userPoints');
    return savedPoints ? parseInt(savedPoints) : 10000; // 충분한 포인트로 설정
  });
  
  // 누적 포인트 (랭크 계산용 - 소비해도 감소하지 않음)
  const [totalEarnedPoints, setTotalEarnedPoints] = useState(() => {
    const savedTotal = localStorage.getItem('totalEarnedPoints');
    return savedTotal ? parseInt(savedTotal) : 10000; // 초기값은 현재 포인트와 동일
  });
  
  // 포인트 기반 랭크 계산 함수 (누적 포인트 사용)
  const calculateRankFromPoints = (currentPoints) => {
    if (currentPoints < 2100) return 'bronze';
    if (currentPoints < 6300) return 'silver';
    if (currentPoints < 12600) return 'gold';
    return 'platinum';
  };
  
  // 랭크 진행도 계산 함수
  const calculateRankProgress = (currentPoints) => {
    const ranks = {
      bronze: { min: 0, max: 2100 },
      silver: { min: 2100, max: 6300 },
      gold: { min: 6300, max: 12600 },
      platinum: { min: 12600, max: 210000 }
    };
    
    const currentRank = calculateRankFromPoints(currentPoints);
    const rankData = ranks[currentRank];
    
    const progress = ((currentPoints - rankData.min) / (rankData.max - rankData.min)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };
  
  const [testDate, setTestDate] = useState(new Date()); // 테스트용 날짜 상태
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // 프로필 데이터 상태 관리 (localStorage에서 불러오기)
  const [profileData, setProfileDataState] = useState(() => {
    const saved = localStorage.getItem('profileData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('프로필 데이터 파싱 에러:', err);
      }
    }
    return {
      name: '',
      userId: '',
      birthDate: '',
      phone: '',
      email: ''
    };
  });

  // 상태 업데이트 중복 방지를 위한 ref
  const isUpdatingProfile = useRef(false);

  // Supabase에서 유저 데이터 불러오기
  const loadUserDataFromSupabase = async (userId) => {
    try {
      const { data, error } = await getUserInfo(userId);
      if (error) {
        console.log('유저 정보 없음, 새로 생성 필요');
        return null;
      }
      if (data) {
        // Supabase 데이터로 상태 업데이트
        setPoints(data.point_current || 0);
        setTotalEarnedPoints(data.points_total || 0);
        setUserRanking(data.rank || 'bronze');
        setPlasticGoal(data.amount || null);

        // 프로필 데이터도 Supabase 데이터로 업데이트
        setProfileData(prev => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          phone: data.phone_num || prev.phone || '',
          userId: data.user_id || prev.userId
        }));

        console.log('Supabase에서 유저 정보 로드:', data);
        return data;
      }
    } catch (error) {
      console.error('유저 데이터 로드 에러:', error);
      return null;
    }
  };

  // Supabase에 유저 데이터 저장
  const saveUserDataToSupabase = async () => {
    try {
      // Supabase Auth UUID 가져오기
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.log('로그인된 사용자가 없습니다.');
        return;
      }

      const userInfo = {
        name: profileData.name,
        email: profileData.email,
        phone_num: profileData.phone,
        point_current: points,
        points_total: totalEarnedPoints,
        rank: userRanking,
        amount: plasticGoal || 0
      };

      const { data, error } = await saveUserInfo(user.id, userInfo); // Auth UUID 사용
      if (error) {
        console.error('유저 정보 저장 에러:', error);
      } else {
        console.log('Supabase에 유저 정보 저장 완료:', data);
      }
    } catch (error) {
      console.error('유저 데이터 저장 에러:', error);
    }
  };

  // localStorage에도 저장하는 래퍼 함수
  const setProfileData = useCallback((newData) => {
    if (typeof newData === 'function') {
      setProfileDataState(prev => {
        const updated = newData(prev);
        // localStorage에 즉시 저장
        localStorage.setItem('profileData', JSON.stringify(updated));
        return updated;
      });
    } else {
      setProfileDataState(newData);
      // localStorage에 즉시 저장
      localStorage.setItem('profileData', JSON.stringify(newData));
    }
  }, []);
  const [showAquariumSettings, setShowAquariumSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showChallengeSelect, setShowChallengeSelect] = useState(false);
  // 앱 설정들을 로컬 스토리지에서 초기화
  const [appSettings, setAppSettings] = useState(() => appSettingsStorage.get());
  const [isDarkMode, setIsDarkMode] = useState(appSettings.isDarkMode);
  const [language, setLanguage] = useState(appSettings.language);
  const [notificationEnabled, setNotificationEnabled] = useState(appSettings.notifications);
  const [locationSharing, setLocationSharing] = useState(appSettings.location !== null);

  const [showChatBot, setShowChatBot] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showRankThemeSettings, setShowRankThemeSettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  // 어항 설정들을 로컬 스토리지에서 초기화
  const [aquariumSettings, setAquariumSettings] = useState(() => aquariumSettingsStorage.get());
  const [fishCount, setFishCount] = useState(aquariumSettings.fishCount);
  const [isRandomFish, setIsRandomFish] = useState(aquariumSettings.isRandomFish);
  const [isRandomDecorations, setIsRandomDecorations] = useState(false);
  const [selectedFish, setSelectedFish] = useState(aquariumSettings.selectedFish);
  const [selectedDecorations, setSelectedDecorations] = useState(aquariumSettings.selectedDecorations.length > 0 ? aquariumSettings.selectedDecorations : ['해초']);

  // 앱 설정 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    appSettingsStorage.update({
      isDarkMode,
      language,
      notifications: notificationEnabled,
      location: locationSharing ? 'enabled' : null
    });
  }, [isDarkMode, language, notificationEnabled, locationSharing]);

  // 어항 설정 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    aquariumSettingsStorage.update({
      fishCount,
      isRandomFish,
      selectedFish,
      selectedDecorations
    });
  }, [fishCount, isRandomFish, selectedFish, selectedDecorations]);
  const [customChallenges, setCustomChallenges] = useState(() => {
    const saved = localStorage.getItem('customChallenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [customPlasticItems, setCustomPlasticItems] = useState(() => {
    const saved = localStorage.getItem('customPlasticItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTank, setCurrentTank] = useState('basic');
  const [unlockedTanks, setUnlockedTanks] = useState(['basic', 'silver', 'gold', 'platinum']); // 모든 어항 잠금 해제
  const [userRanking, setUserRanking] = useState(() => {
    const savedTotal = localStorage.getItem('totalEarnedPoints');
    const totalPoints = savedTotal ? parseInt(savedTotal) : 10000;
    return calculateRankFromPoints(totalPoints);
  }); // 실제 사용자 랭킹 (누적 포인트 기반)
  const [rankTheme, setRankTheme] = useState(() => {
    const saved = localStorage.getItem('rankTheme');
    if (saved) return saved;
    // 저장된 값이 없으면 기본값은 'basic'
    return 'basic';
  }); // 색상 테마 (색상만 변경)
  const [claimedTanks, setClaimedTanks] = useState(() => {
    const saved = localStorage.getItem('claimedTanks');
    return saved ? JSON.parse(saved) : [];
  }); // 수령 완료한 어항 목록
  const [tankName, setTankName] = useState('수질');
  const [isEditingTankName, setIsEditingTankName] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [rankingInitialTab, setRankingInitialTab] = useState('friends');
  const [showGlobalList, setShowGlobalList] = useState(false);
  const [waterQuality, setWaterQuality] = useState(85);
  const [lastChallengeDate, setLastChallengeDate] = useState(null);
  const [daysWithoutChallenge, setDaysWithoutChallenge] = useState(0);
  const [consecutiveDays, setConsecutiveDays] = useState(() => {
    const saved = localStorage.getItem('consecutiveDays');
    return saved ? parseInt(saved) : 0;
  });
  const [challengeHistory, setChallengeHistory] = useState(() => {
    const saved = localStorage.getItem('challengeHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 총 플라스틱 절약량 상태
  const [totalPlasticSaved, setTotalPlasticSaved] = useState(() => {
    const saved = localStorage.getItem('totalPlasticSaved');
    return saved ? parseFloat(saved) : 0;
  });
  
  // 테스트용 플라스틱 절약량 (개발용)
  const [testPlasticSaved, setTestPlasticSaved] = useState(0);
  
  // 토스트 메시지 상태
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // 토스트 메시지 표시 함수
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };
  
  // 포인트 획득 함수 (누적 포인트도 함께 증가)
  const earnPoints = (amount) => {
    setPoints(prev => prev + amount);
    setTotalEarnedPoints(prev => prev + amount);
  };
  
  // 포인트 소비 함수 (누적 포인트는 변경 안함)
  const spendPoints = (amount) => {
    setPoints(prev => Math.max(0, prev - amount));
  };

  // master의 decorationsData
  const decorationsData = {
    bronze: [
      { name: '해초', description: '자연스러운 수초', price: 100 },
      { name: '용암석', description: '신비로운 화산석', price: 150 },
      { name: '작은 동굴', description: '아늑한 은신처', price: 200 }
    ],
    silver: [
      { name: '산호', description: '화려한 바다 정원', price: 250 },
      { name: '드리프트 우드', description: '오래된 바다 목재', price: 300 },
      { name: '조개 껍질', description: '바다의 보석함', price: 350 }
    ],
    gold: [
      { name: '그리스 신전', description: '고대 문명의 흔적', price: 400 },
      { name: '보물 상자', description: '해적의 황금 보물', price: 450 },
      { name: '해적선', description: '전설의 침몰선', price: 500 }
    ],
    platinum: [
      { name: '크리스탈 동굴', description: '신비한 크리스탈', price: 600 },
      { name: 'LED 해파리', description: '빛나는 수중 요정', price: 700 },
      { name: '아틀란티스 유적', description: '잃어버린 문명', price: 800 }
    ]
  };

  // localStorage에서 상태 불러오기
  // 인증 상태 확인
  useEffect(() => {
    // 초기 세션 확인
    const checkUser = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);

          // 프로필 생성 또는 업데이트 (아이디가 없을 때만 새로 생성)
          const { profile } = await createOrUpdateUserProfile(user);
          console.log('App.jsx - 프로필 생성 결과:', profile);

          // Supabase에서 유저 데이터 불러오기 (프로필 정보 포함)
          if (profile?.user_id) {
            await loadUserDataFromSupabase(profile.user_id);
            // 전역 데이터 프리로딩
            preloadAllData(profile.user_id);
          }
        }
      } catch (error) {
        console.error('사용자 확인 에러:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkUser();

    // 인증 상태 변경 리스너 설정
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('인증 상태 변경: SIGNED_IN - checkUser에서 이미 처리했으므로 중복 호출 방지');
        // checkUser()에서 이미 처리했으므로 여기서는 상태만 업데이트
        setCurrentUser(session.user);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        console.log('인증 상태 변경: SIGNED_OUT');
        setCurrentUser(null);
        setIsLoggedIn(false);
        // 로그아웃 시 프로필 데이터 초기화
        setProfileData({
          name: '',
          userId: '',
          birthDate: '',
          phone: '',
          email: ''
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 로그인 없이 둘러보기 시 Store 데이터 로드
  useEffect(() => {
    if (isLoggedIn && !currentUser && !isCheckingAuth) {
      // 로그인 없이 둘러보기 (currentUser가 null)
      console.log('로그인 없이 둘러보기 - Store 데이터 로드');
      preloadAllData(null);
    }
  }, [isLoggedIn, currentUser, isCheckingAuth]);

  // Deep link 처리 (모바일 앱에서 OAuth callback 처리)
  useEffect(() => {
    const platform = Capacitor.getPlatform();

    if (platform === 'android' || platform === 'ios') {
      // 앱 URL 리스너 설정 (OAuth callback 처리)
      const listener = CapacitorApp.addListener('appUrlOpen', async (data) => {
        console.log('App opened with URL:', data.url);

        // com.ecostep.app://callback?... 형태의 URL 처리
        if (data.url.includes('callback')) {
          // Supabase가 URL에서 자동으로 세션을 처리하도록 URL 전달
          const url = new URL(data.url);

          // URL의 hash 부분에 access_token이 있는 경우
          if (url.hash) {
            const hashParams = new URLSearchParams(url.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (accessToken) {
              console.log('Deep link에서 토큰 발견, 세션 설정 중...');

              // Supabase 세션 설정
              const { data: sessionData, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              });

              if (error) {
                console.error('세션 설정 에러:', error);
              } else {
                console.log('세션 설정 성공:', sessionData);
              }
            }
          }
        }
      });

      return () => {
        listener.remove();
      };
    }
  }, []);

  useEffect(() => {
    const savedTank = localStorage.getItem('currentTank');
    const savedUnlockedTanks = localStorage.getItem('unlockedTanks');
    const savedRanking = localStorage.getItem('userRanking');
    const savedRankTheme = localStorage.getItem('rankTheme');
    const savedTankName = localStorage.getItem('tankName');
    const savedWaterQuality = localStorage.getItem('waterQuality');
    const savedLastChallengeDate = localStorage.getItem('lastChallengeDate');
    const savedTotalPlasticSaved = localStorage.getItem('totalPlasticSaved');
    
    if (savedTank) setCurrentTank(savedTank);
    if (savedUnlockedTanks) setUnlockedTanks(JSON.parse(savedUnlockedTanks));
    if (savedRanking) setUserRanking(savedRanking);
    if (savedRankTheme) setRankTheme(savedRankTheme);
    else if (savedRanking) setRankTheme(savedRanking); // 초기값은 실제 랭킹과 동일
    if (savedTankName && savedTankName !== '나의 어항') {
      setTankName(savedTankName);
    } else {
      setTankName('수질');
      localStorage.setItem('tankName', '수질');
    }
    if (savedWaterQuality) setWaterQuality(parseInt(savedWaterQuality));
    if (savedLastChallengeDate) {
      setLastChallengeDate(savedLastChallengeDate);
      
      // 마지막 챌린지 완료 후 경과 일수 계산
      const lastDate = new Date(savedLastChallengeDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      setDaysWithoutChallenge(daysDiff);
    }
    if (savedTotalPlasticSaved) {
      setTotalPlasticSaved(parseFloat(savedTotalPlasticSaved));
    }
  }, []);

  // 상태 변경시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('currentTank', currentTank);
  }, [currentTank]);

  useEffect(() => {
    localStorage.setItem('unlockedTanks', JSON.stringify(unlockedTanks));
  }, [unlockedTanks]);

  useEffect(() => {
    localStorage.setItem('userRanking', userRanking);
  }, [userRanking]);

  useEffect(() => {
    localStorage.setItem('rankTheme', rankTheme);
  }, [rankTheme]);

  useEffect(() => {
    localStorage.setItem('tankName', tankName);
  }, [tankName]);

  useEffect(() => {
    localStorage.setItem('waterQuality', waterQuality.toString());
  }, [waterQuality]);

  // 포인트 변경시 localStorage + Supabase에 저장
  useEffect(() => {
    localStorage.setItem('userPoints', points.toString());
    // Supabase에 저장 (디바운스 적용)
    const timeoutId = setTimeout(() => {
      saveUserDataToSupabase();
    }, 1000); // 1초 디바운스
    return () => clearTimeout(timeoutId);
  }, [points]);

  // 누적 포인트 변경시 localStorage + Supabase에 저장 및 랭크 업데이트
  useEffect(() => {
    localStorage.setItem('totalEarnedPoints', totalEarnedPoints.toString());
    const newRank = calculateRankFromPoints(totalEarnedPoints);
    if (newRank !== userRanking) {
      setUserRanking(newRank);
    }
    // Supabase에 저장 (디바운스 적용)
    const timeoutId = setTimeout(() => {
      saveUserDataToSupabase();
    }, 1000); // 1초 디바운스
    return () => clearTimeout(timeoutId);
  }, [totalEarnedPoints]);

  // plasticGoal 변경 시 Supabase에 저장
  useEffect(() => {
    if (plasticGoal !== null) {
      const timeoutId = setTimeout(() => {
        saveUserDataToSupabase();
      }, 1000); // 1초 디바운스
      return () => clearTimeout(timeoutId);
    }
  }, [plasticGoal]);

  // 프로필 데이터 변경 감지 (디버깅용)
  useEffect(() => {
    console.log('profileData 업데이트됨:', profileData);
  }, [profileData]);

  useEffect(() => {
    if (lastChallengeDate) {
      localStorage.setItem('lastChallengeDate', lastChallengeDate);
    }
  }, [lastChallengeDate]);

  useEffect(() => {
    localStorage.setItem('consecutiveDays', consecutiveDays.toString());
  }, [consecutiveDays]);

  useEffect(() => {
    localStorage.setItem('challengeHistory', JSON.stringify(challengeHistory));
  }, [challengeHistory]);

  useEffect(() => {
    localStorage.setItem('claimedTanks', JSON.stringify(claimedTanks));
  }, [claimedTanks]);

  // customChallenges 저장
  useEffect(() => {
    if (customChallenges.length > 0) {
      localStorage.setItem('customChallenges', JSON.stringify(customChallenges));
    }
  }, [customChallenges]);

  // customPlasticItems 저장
  useEffect(() => {
    if (customPlasticItems.length > 0) {
      localStorage.setItem('customPlasticItems', JSON.stringify(customPlasticItems));
    }
  }, [customPlasticItems]);

  // 연속 달성 일수 계산 로직
  useEffect(() => {
    const calculateConsecutiveDays = () => {
      if (challengeHistory.length === 0) {
        setConsecutiveDays(0);
        return;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // 최근 챌린지 기록들을 역순으로 확인하여 연속 일수 계산
      let consecutive = 0;
      let checkDate = new Date(today);
      
      for (let i = challengeHistory.length - 1; i >= 0; i--) {
        const historyDate = new Date(challengeHistory[i]);
        historyDate.setHours(0, 0, 0, 0);
        
        // 날짜 차이 계산
        const diffTime = checkDate.getTime() - historyDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0 || diffDays === 1) {
          // 오늘이거나 하루 전 (연속)
          consecutive++;
          checkDate = new Date(historyDate);
        } else {
          // 연속이 끊김
          break;
        }
      }
      
      setConsecutiveDays(consecutive);
    };
    
    calculateConsecutiveDays();
  }, [challengeHistory]);

  // 수질 감소 로직 - 사용자 임의 조정은 유지, 자정 후 활동 없을 때만 감소
  useEffect(() => {
    const calculateWaterQuality = () => {
      if (!lastChallengeDate) {
        // 첫 번째 챌린지 전에는 기본 수질 유지
        setDaysWithoutChallenge(0);
        return;
      }

      const lastDate = new Date(lastChallengeDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      // 마지막 수질 업데이트 날짜 확인
      const lastWaterQualityUpdate = localStorage.getItem('lastWaterQualityUpdate');
      const todayString = today.toISOString().split('T')[0];

      // 오늘 이미 수질이 업데이트되었는지 확인 (사용자 조정 포함)
      if (lastWaterQualityUpdate === todayString) {
        setDaysWithoutChallenge(daysDiff);
        return;
      }

      if (daysDiff === 0) {
        // 오늘 챌린지 완료함 - 100%
        setWaterQuality(100);
        localStorage.setItem('lastWaterQualityUpdate', todayString);
      } else if (daysDiff > 0) {
        // 챌린지 미완료 일수에 따른 수질 감소 (하루에 한 번만)
        let qualityDecrease = 0;

        if (daysDiff === 1 || daysDiff === 2) {
          qualityDecrease = daysDiff * 5; // 1-2일: 5%씩
        } else if (daysDiff === 3 || daysDiff === 4) {
          qualityDecrease = 10 + (daysDiff - 2) * 10; // 3-4일: 10%씩
        } else if (daysDiff === 5 || daysDiff === 6) {
          qualityDecrease = 30 + (daysDiff - 4) * 20; // 5-6일: 20%씩
        } else if (daysDiff === 7) {
          qualityDecrease = 70 + 25; // 7일: 25%
        } else {
          qualityDecrease = 95 + (daysDiff - 7); // 8일 이후: 1%씩
        }

        const newQuality = Math.max(0, 100 - qualityDecrease);
        setWaterQuality(newQuality);
        localStorage.setItem('lastWaterQualityUpdate', todayString);
      }

      setDaysWithoutChallenge(daysDiff);
    };

    calculateWaterQuality();

    // 자정에 수질 재계산 (하루에 한 번만)
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight - now;

    const midnightTimeout = setTimeout(() => {
      calculateWaterQuality();
      // 매일 자정 체크
      const dailyInterval = setInterval(calculateWaterQuality, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, [lastChallengeDate]);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
      // 프로필 데이터 초기화
      setProfileData({
        name: '',
        userId: '',
        birthDate: '',
        phone: '',
        email: ''
      });
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  // 인증 상태 확인 중
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 로그인 화면 표시
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={`h-screen w-full ${bgColor}`}>
        {/* 화면 영역 */}
        <div className="w-full h-full flex flex-col">
          {/* 상단 Safe Area 배경 */}
          <div className={`fixed top-0 left-0 right-0 z-40 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} style={{
            height: 'max(1.5rem, env(safe-area-inset-top))'
          }}></div>

          {/* 상태바 */}
          <div className={`fixed left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-3 py-3 flex justify-between items-center`} style={{
            top: 'max(1.5rem, env(safe-area-inset-top))',
            paddingLeft: 'calc(0.75rem + env(safe-area-inset-left))',
            paddingRight: 'calc(0.75rem + env(safe-area-inset-right))'
          }}>
            <h1 className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-[17px] font-medium`}>
              {activeTab === 'home' && '홈'}
              {activeTab === 'challenge' && '챌린지'}
              {activeTab === 'reward' && '보상'}
              {activeTab === 'community' && '커뮤니티'}
              {activeTab === 'more' && '기타'}
            </h1>
            <div className="flex items-center gap-3">
              <div className={`flex items-center px-2 py-0.5 rounded border mr-1 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <span className={`${isDarkMode ? 'text-white' : 'text-gray-700'} text-[15px] font-normal`}>{points}P</span>
              </div>
              <button className="relative" onClick={() => {
                setShowNotifications(true);
                setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
              }}>
                <Bell className={`w-[19px] h-[19px] ${
                  notificationsList.some(n => !n.read)
                    ? 'text-purple-500'
                    : isDarkMode ? 'text-white' : 'text-gray-700'
                }`} />
              </button>
              <button onClick={() => {
                if (showNotifications) {
                  setShowNotifications(false);
                }
                // Reset all sub-screens when opening settings
                setShowProfile(false);
                setShowThemeSettings(false);
                setShowRankThemeSettings(false);
                setShowLanguageSettings(false);
                setShowNotificationSettings(false);
                setShowLocationSettings(false);
                setShowSettings(true);
              }}>
                <Settings className={`w-[19px] h-[19px] ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              </button>
            </div>
            {/* 그라데이션 테두리 */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
              <div className={`h-full w-full ${isDarkMode ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className={`flex-1 overflow-y-auto ${bgColor}`} style={{
            paddingTop: 'max(4.5rem, calc(3rem + env(safe-area-inset-top)))',
            paddingBottom: 'calc(4.5rem + max(1rem, env(safe-area-inset-bottom)))'
          }}>
          {showNotifications ? (
            <NotificationsScreen 
              isDarkMode={isDarkMode} 
              setShowNotifications={setShowNotifications}
              notifications={notificationsList}
              setNotifications={setNotificationsList}
              points={points}
              setPoints={setPoints}
              earnPoints={earnPoints}
              rankTheme={rankTheme}
            />
          ) : showSettings ? (
            showProfile ? <ProfileScreen isDarkMode={isDarkMode} setShowProfile={setShowProfile} profileData={profileData} setProfileData={setProfileData} /> : 
            showThemeSettings ? <ThemeSettings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setShowThemeSettings={setShowThemeSettings} /> :
            showRankThemeSettings ? <RankThemeSettings isDarkMode={isDarkMode} userRanking={rankTheme} setUserRanking={setRankTheme} setShowRankThemeSettings={setShowRankThemeSettings} currentUserRank={userRanking} showToast={showToast} /> :
            showLanguageSettings ? <LanguageSettings isDarkMode={isDarkMode} language={language} setLanguage={setLanguage} setShowLanguageSettings={setShowLanguageSettings} /> :
            showNotificationSettings ? <NotificationSettings isDarkMode={isDarkMode} notifications={notificationEnabled} setNotifications={setNotificationEnabled} setShowNotificationSettings={setShowNotificationSettings} /> :
            showLocationSettings ? <LocationSettings isDarkMode={isDarkMode} locationSharing={locationSharing} setLocationSharing={setLocationSharing} setShowLocationSettings={setShowLocationSettings} /> :
            <SettingsScreen 
              isDarkMode={isDarkMode}
              setShowSettings={setShowSettings}
              setShowProfile={setShowProfile}
              setShowLanguageSettings={setShowLanguageSettings}
              setShowNotificationSettings={setShowNotificationSettings}
              setShowLocationSettings={setShowLocationSettings}
              setShowThemeSettings={setShowThemeSettings}
              setShowRankThemeSettings={setShowRankThemeSettings}
              userRanking={rankTheme}
              language={language}
              notifications={notificationEnabled}
              locationSharing={locationSharing}
              userProfile={profileData}
              onLogout={handleLogout}
            />
          ) : showAquariumSettings ? (
            <AquariumSettings 
              isDarkMode={isDarkMode}
              setShowAquariumSettings={setShowAquariumSettings}
              fishCount={fishCount}
              setFishCount={setFishCount}
              isRandomFish={isRandomFish}
              setIsRandomFish={setIsRandomFish}
              selectedFish={selectedFish}
              setSelectedFish={setSelectedFish}
              selectedDecorations={selectedDecorations}
              setSelectedDecorations={setSelectedDecorations}
              purchasedFish={purchasedFish}
              currentTank={currentTank}
              setCurrentTank={setCurrentTank}
              unlockedTanks={unlockedTanks}
              tankName={tankName}
              setTankName={setTankName}
              purchasedDecorations={purchasedDecorations}
              decorationsData={decorationsData}
              isRandomDecorations={isRandomDecorations}
              setIsRandomDecorations={setIsRandomDecorations}
              claimedTanks={claimedTanks}
            />
          ) : (
            <>
              {activeTab === 'home' && <HomePage
                isDarkMode={isDarkMode}
                setShowAquariumSettings={setShowAquariumSettings}
                purchasedFish={purchasedFish}
                currentTank={currentTank}
                tankName={tankName}
                purchasedDecorations={purchasedDecorations}
                decorationsData={decorationsData}
                selectedDecorations={selectedDecorations}
                waterQuality={waterQuality}
                daysWithoutChallenge={daysWithoutChallenge}
                setWaterQuality={setWaterQuality}
                isRandomFish={isRandomFish}
                isRandomDecorations={isRandomDecorations}
                selectedFish={selectedFish}
                fishCount={fishCount}
                consecutiveDays={consecutiveDays}
                totalPlasticSaved={totalPlasticSaved}
                testPlasticSaved={testPlasticSaved}
                setTestPlasticSaved={setTestPlasticSaved}
                showToast={showToast}
                isActive={activeTab === 'home'}
              />}
              {activeTab === 'challenge' && <ChallengePage 
                isDarkMode={isDarkMode}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                challengeDay={challengeDay}
                plasticGoal={plasticGoal}
                setPlasticGoal={setPlasticGoal}
                currentPlastic={currentPlastic}
                selectedChallenge={selectedChallenge}
                setSelectedChallenge={setSelectedChallenge}
                showChallengeSelect={showChallengeSelect}
                setShowChallengeSelect={setShowChallengeSelect}
                customChallenges={customChallenges}
                setCustomChallenges={setCustomChallenges}
                customPlasticItems={customPlasticItems}
                setCustomPlasticItems={setCustomPlasticItems}
                points={points}
                setPoints={setPoints}
                earnPoints={earnPoints}
                setLastChallengeDate={setLastChallengeDate}
                setWaterQuality={setWaterQuality}
                challengeHistory={challengeHistory}
                setChallengeHistory={setChallengeHistory}
                userRanking={rankTheme}
                actualRanking={userRanking}
                showToast={showToast}
                setTotalPlasticSaved={setTotalPlasticSaved}
                testDate={testDate}
                setTestDate={setTestDate}
                setNotificationsList={setNotificationsList}
              />}
              {activeTab === 'reward' && <RewardsPage
                isDarkMode={isDarkMode}
                purchasedFish={purchasedFish}
                setPurchasedFish={setPurchasedFish}
                userRanking={userRanking}
                setUserRanking={setUserRanking}
                claimedTanks={claimedTanks}
                setClaimedTanks={setClaimedTanks}
                purchasedDecorations={purchasedDecorations}
                setPurchasedDecorations={setPurchasedDecorations}
                points={points}
                setPoints={setPoints}
                showToast={showToast}
                setCurrentTank={setCurrentTank}
                calculateRankProgress={calculateRankProgress}
                calculateRankFromPoints={calculateRankFromPoints}
                totalEarnedPoints={totalEarnedPoints}
                setTotalEarnedPoints={setTotalEarnedPoints}
                spendPoints={spendPoints}
                isActive={activeTab === 'reward'}
              />}
              {activeTab === 'community' && !showFriendsList && !showGlobalList && <CommunityPage isDarkMode={isDarkMode} onShowFriendsList={() => setShowFriendsList(true)} onShowGlobalList={() => setShowGlobalList(true)} showToast={showToast} userRanking={rankTheme} totalPlasticSaved={testPlasticSaved > 0 ? testPlasticSaved : totalPlasticSaved} currentUserId={currentUser?.id} currentUserName={profileData.name} currentUserNickname={profileData.userId} />}
              {activeTab === 'community' && showFriendsList && <FriendsList isDarkMode={isDarkMode} onBack={() => setShowFriendsList(false)} isGlobalRanking={false} totalPlasticSaved={testPlasticSaved > 0 ? testPlasticSaved : totalPlasticSaved} currentUserId={currentUser?.id} currentUserNickname={profileData.userId} />}
              {activeTab === 'community' && showGlobalList && <FriendsList isDarkMode={isDarkMode} onBack={() => setShowGlobalList(false)} isGlobalRanking={true} totalPlasticSaved={testPlasticSaved > 0 ? testPlasticSaved : totalPlasticSaved} currentUserId={currentUser?.id} currentUserNickname={profileData.userId} />}
              {activeTab === 'more' && !showChatBot && <MorePage isDarkMode={isDarkMode} userPoints={points} setUserPoints={setPoints} onShowChatBot={() => setShowChatBot(true)} earnPoints={earnPoints} rankTheme={rankTheme} showToast={showToast} locationSharing={locationSharing} />}
              {activeTab === 'more' && showChatBot && <ChatBot isDarkMode={isDarkMode} onBack={() => setShowChatBot(false)} />}
            </>
          )}
          </div>

          {/* 하단 네비게이션 - 글래스모피즘 효과 */}
          {!showNotifications && !showSettings && !showProfile && !showAquariumSettings && !showThemeSettings && !showRankThemeSettings && !showLanguageSettings && !showNotificationSettings && !showLocationSettings && !showFriendsList && !showGlobalList && (
            <div className="fixed left-0 right-0 bottom-0 z-50" style={{
              backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(255, 255, 255, 0.3)',
              backdropFilter: isDarkMode ? 'blur(20px) saturate(1.5)' : 'blur(20px) saturate(2.5)',
              WebkitBackdropFilter: isDarkMode ? 'blur(20px) saturate(1.5)' : 'blur(20px) saturate(2.5)',
              borderTop: isDarkMode ? '1px solid rgba(107, 114, 128, 0.3)' : '1px solid rgba(209, 213, 219, 0.8)',
              boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.05)',
              paddingTop: '1px'
            }}>
              <div className="flex justify-around py-2" style={{
                paddingLeft: 'env(safe-area-inset-left)',
                paddingRight: 'env(safe-area-inset-right)',
                paddingBottom: 'calc(0.75rem + max(0.5rem, env(safe-area-inset-bottom)))'
              }}>
                {[
                  { id: 'home', icon: Home, label: '홈' },
                  { id: 'challenge', icon: Target, label: '챌린지' },
                  { id: 'reward', icon: Gift, label: '보상' },
                  { id: 'community', icon: Users, label: '커뮤니티' },
                  { id: 'more', icon: MoreHorizontal, label: '기타' }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center py-1 px-3 ${
                        isDarkMode ? 'text-white' : 'text-gray-700'
                      } ${activeTab === tab.id ? 'opacity-100' : 'opacity-50'}`}
                    >
                      <Icon className="w-5 h-5 mb-0.5" fill={activeTab === tab.id ? 'currentColor' : 'none'} />
                      <span className="text-[13px] font-normal">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 토스트 메시지 */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
          isDarkMode={isDarkMode}
          rankTheme={rankTheme}
        />
      </div>
  );
};

// DataProvider로 감싸서 export
const EcostepApp = () => {
  return (
    <DataProvider>
      <EcostepAppContent />
    </DataProvider>
  );
};

export default EcostepApp;