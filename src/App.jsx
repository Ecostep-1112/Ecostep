import React, { useState, useEffect } from 'react';
import { Settings, Home, Target, Gift, Users, MoreHorizontal } from 'lucide-react';
import HomePage from './pages/Home';
import ChallengePage from './pages/Challenge';
import RewardsPage from './pages/Rewards';
import CommunityPage from './pages/Community';
import MorePage from './pages/More';
import SettingsScreen from './pages/SettingsScreen';
import ProfileScreen from './pages/ProfileScreen';
import FriendsList from './pages/FriendsList';
import { ThemeSettings, LanguageSettings, NotificationSettings, AquariumSettings } from './pages/Settings';
import fishData from './data/fishData.json';

const EcostepApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('habit');
  const [challengeDay, setChallengeDay] = useState(4);
  const [plasticGoal, setPlasticGoal] = useState(500);
  const [currentPlastic, setCurrentPlastic] = useState(320);
  const [points, setPoints] = useState(1240);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAquariumSettings, setShowAquariumSettings] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState('플라스틱 빨대 안쓰기');
  const [showChallengeSelect, setShowChallengeSelect] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [language, setLanguage] = useState('ko');
  const [notifications, setNotifications] = useState(true);
  const [fishCount, setFishCount] = useState(5);
  const [isRandomFish, setIsRandomFish] = useState(true);
  const [selectedFish, setSelectedFish] = useState([]);
  const [selectedDecorations, setSelectedDecorations] = useState([]);
  const [purchasedFish, setPurchasedFish] = useState(['네온테트라', '체리바브', '구피', '베타']);
  const [customChallenges, setCustomChallenges] = useState([]);
  const [customPlasticItems, setCustomPlasticItems] = useState([]);
  const [currentTank, setCurrentTank] = useState('basic');
  const [unlockedTanks, setUnlockedTanks] = useState(['basic', 'silver', 'gold', 'platinum']); // 모든 어항 잠금 해제
  const [userRanking, setUserRanking] = useState('gold'); // 골드 랭킹으로 설정
  const [claimedTanks, setClaimedTanks] = useState([]); // 수령 완료한 어항 목록
  const [tankName, setTankName] = useState('나의 어항');
  const [isEditingTankName, setIsEditingTankName] = useState(false);
  const [purchasedDecorations, setPurchasedDecorations] = useState(['해초', '산호']);
  const [showFriendsList, setShowFriendsList] = useState(false);

  // master의 decorationsData
  const decorationsData = {
    bronze: [
      { name: '해초', description: '자연스러운 수초', price: 100 },
      { name: '용암석', description: '신비로운 화산석', price: 150 },
      { name: '작은동굴', description: '아늑한 은신처', price: 200 }
    ],
    silver: [
      { name: '산호', description: '화려한 바다 정원', price: 250 },
      { name: '드리프트우드', description: '오래된 바다 목재', price: 300 },
      { name: '조개껍질', description: '바다의 보석함', price: 350 }
    ],
    gold: [
      { name: '그리스신전', description: '고대 문명의 흔적', price: 400 },
      { name: '보물상자', description: '해적의 황금 보물', price: 450 },
      { name: '해적선', description: '전설의 침몰선', price: 500 }
    ],
    platinum: [
      { name: '크리스탈동굴', description: '신비한 크리스탈', price: 600 },
      { name: 'LED해파리', description: '빛나는 수중 요정', price: 700 },
      { name: '아틀란티스유적', description: '잃어버린 문명', price: 800 }
    ]
  };

  // localStorage에서 상태 불러오기
  useEffect(() => {
    const savedTank = localStorage.getItem('currentTank');
    const savedUnlockedTanks = localStorage.getItem('unlockedTanks');
    const savedRanking = localStorage.getItem('userRanking');
    const savedTankName = localStorage.getItem('tankName');
    
    if (savedTank) setCurrentTank(savedTank);
    if (savedUnlockedTanks) setUnlockedTanks(JSON.parse(savedUnlockedTanks));
    if (savedRanking) setUserRanking(savedRanking);
    if (savedTankName) setTankName(savedTankName);
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
    localStorage.setItem('tankName', tankName);
  }, [tankName]);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gray-100'} p-4`}>
      {/* 핸드폰 프레임 - 더 현실적인 디자인 */}
      <div className="relative w-full max-w-[375px] h-[812px] bg-gray-900 rounded-[2.5rem] p-[3px] shadow-2xl">
        {/* 핸드폰 베젤 */}
        <div className="w-full h-full bg-black rounded-[2.3rem] p-[8px]">
        
        {/* 화면 영역 */}
        <div className={`w-full h-full ${bgColor} rounded-[2rem] overflow-hidden flex flex-col`}>
          {/* 상태바 */}
          <div className="bg-blue-500 px-3 py-3 flex justify-between items-center">
            <h1 className="text-white text-sm">송일님 환영합니다</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white/20 px-2 py-1 rounded">
                <span className="text-white text-xs font-medium">{points}P</span>
              </div>
              <button onClick={() => setShowSettings(true)}>
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          {showSettings ? (
            showProfile ? <ProfileScreen isDarkMode={isDarkMode} setShowProfile={setShowProfile} /> : 
            showThemeSettings ? <ThemeSettings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setShowThemeSettings={setShowThemeSettings} /> :
            showLanguageSettings ? <LanguageSettings isDarkMode={isDarkMode} language={language} setLanguage={setLanguage} setShowLanguageSettings={setShowLanguageSettings} /> :
            showNotificationSettings ? <NotificationSettings isDarkMode={isDarkMode} notifications={notifications} setNotifications={setNotifications} setShowNotificationSettings={setShowNotificationSettings} /> :
            <SettingsScreen 
              isDarkMode={isDarkMode}
              setShowSettings={setShowSettings}
              setShowProfile={setShowProfile}
              setShowLanguageSettings={setShowLanguageSettings}
              setShowNotificationSettings={setShowNotificationSettings}
              setShowThemeSettings={setShowThemeSettings}
              language={language}
              notifications={notifications}
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
              />}
              {activeTab === 'reward' && <RewardsPage 
                isDarkMode={isDarkMode} 
                purchasedFish={purchasedFish} 
                fishData={fishData}
                userRanking={userRanking}
                claimedTanks={claimedTanks}
                setClaimedTanks={setClaimedTanks}
                purchasedDecorations={purchasedDecorations}
              />}
              {activeTab === 'community' && !showFriendsList && <CommunityPage isDarkMode={isDarkMode} onShowFriendsList={() => setShowFriendsList(true)} />}
              {activeTab === 'community' && showFriendsList && <FriendsList isDarkMode={isDarkMode} onBack={() => setShowFriendsList(false)} />}
              {activeTab === 'more' && <MorePage isDarkMode={isDarkMode} userPoints={points} setUserPoints={setPoints} />}
            </>
          )}

          {/* 하단 네비게이션 */}
          {!showSettings && !showProfile && !showAquariumSettings && !showThemeSettings && !showLanguageSettings && !showNotificationSettings && !showFriendsList && (
            <div className={`${bgColor} border-t ${borderColor}`}>
              <div className="flex justify-around py-2">
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
                        activeTab === tab.id ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-400'
                      }`}
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
    </div>
  );
};

export default EcostepApp;