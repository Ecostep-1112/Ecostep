import React, { useState } from 'react';
import { Settings, Home, Target, Gift, Users, MoreHorizontal } from 'lucide-react';
import HomePage from './pages/Home';
import ChallengePage from './pages/Challenge';
import RewardsPage from './pages/Rewards';
import CommunityPage from './pages/Community';
import MorePage from './pages/More';
import SettingsScreen from './pages/SettingsScreen';
import ProfileScreen from './pages/ProfileScreen';
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
            />
          ) : (
            <>
              {activeTab === 'home' && <HomePage isDarkMode={isDarkMode} setShowAquariumSettings={setShowAquariumSettings} purchasedFish={purchasedFish} />}
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
              />}
              {activeTab === 'reward' && <RewardsPage isDarkMode={isDarkMode} purchasedFish={purchasedFish} fishData={fishData} />}
              {activeTab === 'community' && <CommunityPage isDarkMode={isDarkMode} />}
              {activeTab === 'more' && <MorePage isDarkMode={isDarkMode} />}
            </>
          )}

          {/* 하단 네비게이션 */}
          {!showSettings && !showProfile && !showAquariumSettings && !showThemeSettings && !showLanguageSettings && !showNotificationSettings && (
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