import React, { useState, useEffect } from 'react';
import { FiSettings, FiHome, FiTarget, FiGift, FiUsers, FiMoreHorizontal } from 'react-icons/fi';
import { IoNotificationsOutline } from 'react-icons/io5';
import HomePage from './pages/Home';
import ChallengePage from './pages/Challenge';
import RewardsPage from './pages/Rewards';
import CommunityPage from './pages/Community';
import MorePage from './pages/More';
import SettingsScreen from './pages/SettingsScreen';
import ProfileScreen from './pages/ProfileScreen';
import FriendsList from './pages/FriendsList';
import NotificationsScreen from './pages/NotificationsScreen';
import { ThemeSettings, RankThemeSettings, LanguageSettings, NotificationSettings, LocationSettings, AquariumSettings } from './pages/Settings';
import Toast from './components/Toast';
import fishData from './data/fishData.json';

const EcostepApp = () => {
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
  const [showAquariumSettings, setShowAquariumSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showChallengeSelect, setShowChallengeSelect] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showRankThemeSettings, setShowRankThemeSettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [language, setLanguage] = useState('ko');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [fishCount, setFishCount] = useState(5);
  const [isRandomFish, setIsRandomFish] = useState(true);
  const [isRandomDecorations, setIsRandomDecorations] = useState(true);
  const [selectedFish, setSelectedFish] = useState([]);
  const [selectedDecorations, setSelectedDecorations] = useState([]);
  const [purchasedFish, setPurchasedFish] = useState(() => {
    const saved = localStorage.getItem('purchasedFish');
    return saved ? JSON.parse(saved) : [];
  });
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
  const [rankTheme, setRankTheme] = useState('bronze'); // 색상 테마 (색상만 변경)
  const [claimedTanks, setClaimedTanks] = useState(() => {
    const saved = localStorage.getItem('claimedTanks');
    return saved ? JSON.parse(saved) : [];
  }); // 수령 완료한 어항 목록
  const [tankName, setTankName] = useState('수질');
  const [isEditingTankName, setIsEditingTankName] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showGlobalList, setShowGlobalList] = useState(false);
  const [purchasedDecorations, setPurchasedDecorations] = useState(() => {
    const saved = localStorage.getItem('purchasedDecorations');
    return saved ? JSON.parse(saved) : [];
  });
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

  // 포인트 변경시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('userPoints', points.toString());
  }, [points]);
  
  // 누적 포인트 변경시 localStorage에 저장 및 랭크 업데이트
  useEffect(() => {
    localStorage.setItem('totalEarnedPoints', totalEarnedPoints.toString());
    const newRank = calculateRankFromPoints(totalEarnedPoints);
    if (newRank !== userRanking) {
      setUserRanking(newRank);
    }
  }, [totalEarnedPoints]);

  // 구매한 장식품 저장
  useEffect(() => {
    localStorage.setItem('purchasedDecorations', JSON.stringify(purchasedDecorations));
  }, [purchasedDecorations]);

  // 구매한 물고기 저장
  useEffect(() => {
    localStorage.setItem('purchasedFish', JSON.stringify(purchasedFish));
  }, [purchasedFish]);

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

  // 수질 감소 로직
  useEffect(() => {
    const calculateWaterQuality = () => {
      if (!lastChallengeDate) return;
      
      const lastDate = new Date(lastChallengeDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // 오늘 챌린지 완료함 - 100%
        setWaterQuality(100);
      } else {
        // 챌린지 미완료 일수에 따른 수질 감소
        let qualityDecrease = 0;
        
        if (daysDiff === 1 || daysDiff === 2) {
          qualityDecrease = daysDiff * 5; // 1-2일: 5%씩
        } else if (daysDiff === 3 || daysDiff === 4) {
          qualityDecrease = 10 + (daysDiff - 2) * 10; // 3-4일: 10%씩 (총 10+10, 10+20)
        } else if (daysDiff === 5 || daysDiff === 6) {
          qualityDecrease = 30 + (daysDiff - 4) * 20; // 5-6일: 20%씩 (총 30+20, 30+40)
        } else if (daysDiff === 7) {
          qualityDecrease = 70 + 25; // 7일: 25% (총 95)
        } else {
          qualityDecrease = 95 + (daysDiff - 7); // 8일 이후: 1%씩
        }
        
        const newQuality = Math.max(0, 100 - qualityDecrease);
        setWaterQuality(newQuality);
      }
      
      setDaysWithoutChallenge(daysDiff);
    };
    
    calculateWaterQuality();
    
    // 매일 자정에 수질 재계산
    const interval = setInterval(() => {
      calculateWaterQuality();
    }, 60000); // 1분마다 체크 (실제로는 자정 체크용)
    
    return () => clearInterval(interval);
  }, [lastChallengeDate]);

  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} p-4`}>
      {/* 핸드폰 프레임 - 더 현실적인 디자인 */}
      <div className="relative w-full max-w-[375px] h-[812px] bg-gray-900 rounded-[2.5rem] p-[3px] shadow-2xl">
        {/* 핸드폰 베젤 */}
        <div className="w-full h-full bg-black rounded-[2.3rem] p-[8px]">
        
        {/* 화면 영역 */}
        <div className={`w-full h-full ${bgColor} rounded-[2rem] overflow-hidden flex flex-col`}>
          {/* 상태바 */}
          <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-3 py-3 flex justify-between items-center relative`}>
            <h1 className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm font-medium`}>
              {activeTab === 'home' && '홈'}
              {activeTab === 'challenge' && '챌린지'}
              {activeTab === 'reward' && '보상'}
              {activeTab === 'community' && '커뮤니티'}
              {activeTab === 'more' && '기타'}
            </h1>
            <div className="flex items-center gap-3">
              <div className={`flex items-center px-2 py-1 rounded ${isDarkMode ? 'bg-white/20' : 'bg-gray-100'}`}>
                <span className={`${isDarkMode ? 'text-white' : 'text-gray-700'} text-xs font-medium`}>{points}P</span>
              </div>
              <button className="relative" onClick={() => {
                setShowNotifications(true);
                setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
              }}>
                <IoNotificationsOutline className={`w-[18px] h-[18px] ${
                  notificationsList.some(n => !n.read) 
                    ? 'text-blue-500' 
                    : isDarkMode ? 'text-white' : 'text-gray-700'
                }`} />
              </button>
              <button onClick={() => {
                if (showNotifications) {
                  setShowNotifications(false);
                }
                setShowSettings(true);
              }}>
                <FiSettings className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              </button>
            </div>
            {/* 그라데이션 테두리 */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
              <div className={`h-full w-full ${isDarkMode ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
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
            showProfile ? <ProfileScreen isDarkMode={isDarkMode} setShowProfile={setShowProfile} /> : 
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
              fishData={fishData}
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
                fishData={fishData}
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
              />}
              {activeTab === 'community' && !showFriendsList && !showGlobalList && <CommunityPage isDarkMode={isDarkMode} onShowFriendsList={() => setShowFriendsList(true)} onShowGlobalList={() => setShowGlobalList(true)} showToast={showToast} userRanking={rankTheme} />}
              {activeTab === 'community' && showFriendsList && <FriendsList isDarkMode={isDarkMode} onBack={() => setShowFriendsList(false)} />}
              {activeTab === 'community' && showGlobalList && <FriendsList isDarkMode={isDarkMode} onBack={() => setShowGlobalList(false)} isGlobalRanking={true} />}
              {activeTab === 'more' && <MorePage isDarkMode={isDarkMode} userPoints={points} setUserPoints={setPoints} earnPoints={earnPoints} rankTheme={rankTheme} showToast={showToast} />}
            </>
          )}

          {/* 하단 네비게이션 - 글래스모피즘 효과 */}
          {!showNotifications && !showSettings && !showProfile && !showAquariumSettings && !showThemeSettings && !showRankThemeSettings && !showLanguageSettings && !showNotificationSettings && !showLocationSettings && !showFriendsList && !showGlobalList && (
            <div style={{
              backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(255, 255, 255, 0.3)',
              backdropFilter: isDarkMode ? 'blur(20px) saturate(1.5)' : 'blur(20px) saturate(2.5)',
              WebkitBackdropFilter: isDarkMode ? 'blur(20px) saturate(1.5)' : 'blur(20px) saturate(2.5)',
              borderTop: isDarkMode ? '1px solid rgba(107, 114, 128, 0.3)' : '1px solid rgba(209, 213, 219, 0.8)',
              boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.05)'
            }}>
              <div className="flex justify-around py-2">
                {[
                  { id: 'home', icon: FiHome, label: '홈' },
                  { id: 'challenge', icon: FiTarget, label: '챌린지' },
                  { id: 'reward', icon: FiGift, label: '보상' },
                  { id: 'community', icon: FiUsers, label: '커뮤니티' },
                  { id: 'more', icon: FiMoreHorizontal, label: '기타' }
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
                      <span className="text-xs">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        </div>
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

export default EcostepApp;