import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Settings, Home, Target, Gift, Users, MoreHorizontal, Check, X, TrendingUp, Calendar, MapPin, Share2, ChevronDown, BarChart3, Plus, Camera, Sun, Moon, Globe, Search, HelpCircle, Phone, Book, Lock } from 'lucide-react';
import FishIcons from './components/FishIcons';
import DecorationIcons from './components/DecorationIcons';
import BasicTank from './components/tanks/BasicTank';
import SilverTank from './components/tanks/SilverTank';
import GoldTank from './components/tanks/GoldTank';
import PlatinumTank from './components/tanks/PlatinumTank';

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
  const [customChallenge, setCustomChallenge] = useState('');
  const [showCustomChallenge, setShowCustomChallenge] = useState(false);
  const [customPlasticItem, setCustomPlasticItem] = useState('');
  const [customPlasticWeight, setCustomPlasticWeight] = useState(10);
  const [showCustomPlastic, setShowCustomPlastic] = useState(false);
  const [showAllPastChallenges, setShowAllPastChallenges] = useState(false);
  const [customChallenges, setCustomChallenges] = useState([]);
  const [customPlasticItems, setCustomPlasticItems] = useState([]);
  const [currentTank, setCurrentTank] = useState('basic');
  const [unlockedTanks, setUnlockedTanks] = useState(['basic', 'silver', 'gold', 'platinum']); // 모든 어항 잠금 해제
  const [userRanking, setUserRanking] = useState('gold'); // 골드 랭킹으로 설정
  const [claimedTanks, setClaimedTanks] = useState([]); // 수령 완료한 어항 목록
  const [tankName, setTankName] = useState('나의 어항');
  const [isEditingTankName, setIsEditingTankName] = useState(false);

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

  const fishData = {
    bronze: [
      { name: '코리도라스', description: '바닥 청소 요정' },
      { name: '체리바브', description: '체리 같은 귀요미' },
      { name: '네온테트라', description: '반짝이는 보석' }
    ],
    silver: [
      { name: '아피스토그라마', description: '포켓 드래곤' },
      { name: '람시클리드', description: '온화한 젠틀맨' },
      { name: '구피', description: '꼬리 댄싱퀸' }
    ],
    gold: [
      { name: '엔젤피쉬', description: '수중의 천사' },
      { name: '킬리피쉬', description: '자유로운 모험가' },
      { name: '베타', description: '실크 드레스 퀸' }
    ],
    platinum: [
      { name: '디스커스', description: '수중 황제' },
      { name: '만다린피쉬', description: '네온 아티스트' },
      { name: '아로와나', description: '전설의 용' }
    ]
  };

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
  
  const [purchasedDecorations, setPurchasedDecorations] = useState(['해초', '산호']);

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
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  const HomeTab = () => {
    const CurrentTankComponent = 
      currentTank === 'silver' ? SilverTank :
      currentTank === 'gold' ? GoldTank :
      currentTank === 'platinum' ? PlatinumTank :
      BasicTank;
    
    return (
      <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
        <div className="min-h-full">
          {/* 어항 섹션 */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-2xl mx-3 mt-4 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1">
                <h3 
                  className="text-white text-sm font-medium cursor-pointer hover:text-blue-100 transition-colors inline-block"
                  onClick={() => setShowAquariumSettings(true)}
                >
                  {tankName}
                </h3>
                <p className="text-blue-100 text-xs mt-0.5">
                  {currentTank === 'basic' ? '기본 어항' : 
                   currentTank === 'silver' ? '실버 어항' :
                   currentTank === 'gold' ? '골드 어항' :
                   '플래티넘 어항'}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAquariumSettings(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <span className="text-xs text-white">어항 변경</span>
                </button>
                <button 
                  onClick={() => setShowAquariumSettings(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors p-1.5 rounded-lg"
                >
                  <Settings className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="h-64 relative overflow-visible">
              {/* 선택된 어항 표시 - 크기 확대 */}
              <div className="absolute inset-0 scale-110 animate-tankFadeIn tank-transition">
                <CurrentTankComponent className="w-full h-full" />
              </div>
              
              {/* 물고기들 어항 위에 표시 */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none z-10">
                {/* 구매한 물고기 중 일부 표시 */}
                {purchasedFish.slice(0, 3).map((fishName, i) => {
                  const FishIcon = FishIcons[fishName.replace(' ', '')];
                  return FishIcon ? (
                  <div 
                    key={i} 
                    className="animate-swim"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${4 + i}s`
                    }}
                  >
                    <FishIcon size={45} />
                    {/* 물고기 그림자 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black opacity-10 blur-sm rounded-full mt-8" />
                  </div>
                ) : null;
                })}
              </div>
              
              {/* 장식품 - 어항 내부로 이동 */}
              <div className="absolute bottom-10 left-20 z-5 animate-sway" style={{animationDuration: '3s'}}>
                <span className="text-2xl">🌿</span>
              </div>
              <div className="absolute bottom-10 right-20 z-5 animate-sway" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
                <span className="text-2xl">🪸</span>
              </div>
            </div>
          <div className="mt-3 bg-white/10 rounded-lg p-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-xs">수질</span>
              <span className="text-white text-xs font-medium">85%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* 연속 사용 알림 */}
        <div className={`mx-3 mt-4 p-3 ${isDarkMode ? 'bg-gray-800 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl`}>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">🔥 23일 연속 달성!</span>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="mx-3 mt-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>플라스틱 절약량</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className={`text-2xl font-bold ${textColor}`}>18.7kg</p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>자동차 3일 운행량, 나무 2그루 효과</p>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const ChallengeTab = () => (
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

  const RewardTab = () => (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 현재 랭크 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-6`}>
          <h3 className={`${textColor} text-center text-sm font-medium mb-4`}>현재 랭크</h3>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">Gold</span>
              </div>
              <span className="absolute -top-2 -right-2 text-2xl">🥇</span>
            </div>
          </div>
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-3`}>플래티넘까지 70% 달성</p>
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-4`}>
            <div className="bg-gradient-to-r from-yellow-400 to-gray-300 h-2 rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
          </div>
          <div className="flex justify-between text-xs px-2">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🥉</span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>브론즈</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🥈</span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>실버</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🥇</span>
              <span className="text-yellow-500">골드</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">👑</span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>플래티넘</span>
            </div>
          </div>
        </div>

        {/* 랭킹 보상 - 어항 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>랭킹 보상</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {/* 실버 어항 */}
            <button
              onClick={() => {
                const canClaim = userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum';
                if (canClaim && !claimedTanks.includes('silver')) {
                  setClaimedTanks([...claimedTanks, 'silver']);
                }
              }}
              disabled={claimedTanks.includes('silver') || (userRanking !== 'silver' && userRanking !== 'gold' && userRanking !== 'platinum')}
              className={`${claimedTanks.includes('silver') ? 'bg-green-50 border-green-300' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? `${cardBg} hover:bg-blue-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('silver') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
            >
              {/* 블러 효과를 받을 컨테이너 */}
              <div className={`w-full h-full flex flex-col items-center justify-between ${(userRanking !== 'silver' && userRanking !== 'gold' && userRanking !== 'platinum') ? 'filter blur-[1px]' : ''}`}>
                <div className={`h-[42px] w-full flex items-center justify-center relative`}>
                  <SilverTank isPreview={true} />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                  <p className={`text-[11px] leading-tight ${claimedTanks.includes('silver') ? 'text-green-700' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'} text-center font-medium`}>
                    실버 어항
                  </p>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                    실버 랭킹 보상
                  </p>
                </div>
                
                <div className="h-[20px] flex items-center justify-center w-full">
                  <p className={`text-xs ${claimedTanks.includes('silver') ? 'text-green-500 font-medium' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center`}>
                    {claimedTanks.includes('silver') ? '수령 완료' : (userRanking === 'silver' || userRanking === 'gold' || userRanking === 'platinum') ? '수령 가능' : '실버 도달'}
                  </p>
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'silver' && userRanking !== 'gold' && userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600 opacity-80" />
                  </div>
                </>
              )}
            </button>
            
            {/* 골드 어항 */}
            <button
              onClick={() => {
                const canClaim = userRanking === 'gold' || userRanking === 'platinum';
                if (canClaim && !claimedTanks.includes('gold')) {
                  setClaimedTanks([...claimedTanks, 'gold']);
                }
              }}
              disabled={claimedTanks.includes('gold') || (userRanking !== 'gold' && userRanking !== 'platinum')}
              className={`${claimedTanks.includes('gold') ? 'bg-green-50 border-green-300' : (userRanking === 'gold' || userRanking === 'platinum') ? `${cardBg} hover:bg-blue-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('gold') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
            >
              {/* 블러 효과를 받을 컨테이너 */}
              <div className={`w-full h-full flex flex-col items-center justify-between ${(userRanking !== 'gold' && userRanking !== 'platinum') ? 'filter blur-[1px]' : ''}`}>
                <div className={`h-[42px] w-full flex items-center justify-center relative`}>
                  <GoldTank isPreview={true} />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                  <p className={`text-[11px] leading-tight ${claimedTanks.includes('gold') ? 'text-green-700' : (userRanking === 'gold' || userRanking === 'platinum') ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'} text-center font-medium`}>
                    골드 어항
                  </p>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                    골드 랭킹 보상
                  </p>
                </div>
                
                <div className="h-[20px] flex items-center justify-center w-full">
                  <p className={`text-xs ${claimedTanks.includes('gold') ? 'text-green-500 font-medium' : (userRanking === 'gold' || userRanking === 'platinum') ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center`}>
                    {claimedTanks.includes('gold') ? '수령 완료' : (userRanking === 'gold' || userRanking === 'platinum') ? '수령 가능' : '골드 도달'}
                  </p>
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'gold' && userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600 opacity-80" />
                  </div>
                </>
              )}
            </button>
            
            {/* 플래티넘 어항 */}
            <button
              onClick={() => {
                const canClaim = userRanking === 'platinum';
                if (canClaim && !claimedTanks.includes('platinum')) {
                  setClaimedTanks([...claimedTanks, 'platinum']);
                }
              }}
              disabled={claimedTanks.includes('platinum') || userRanking !== 'platinum'}
              className={`${claimedTanks.includes('platinum') ? 'bg-green-50 border-green-300' : userRanking === 'platinum' ? `${cardBg} hover:bg-blue-50` : 'bg-gray-100 cursor-not-allowed'} border ${claimedTanks.includes('platinum') ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2 transition-colors overflow-hidden`}
            >
              {/* 블러 효과를 받을 컨테이너 */}
              <div className={`w-full h-full flex flex-col items-center justify-between ${userRanking !== 'platinum' ? 'filter blur-[1px]' : ''}`}>
                <div className={`h-[42px] w-full flex items-center justify-center relative`}>
                  <PlatinumTank isPreview={true} />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                  <p className={`text-[11px] leading-tight ${claimedTanks.includes('platinum') ? 'text-green-700' : userRanking === 'platinum' ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'} text-center font-medium`}>
                    플래티넘 어항
                  </p>
                  <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                    플래티넘 랭킹 보상
                  </p>
                </div>
                
                <div className="h-[20px] flex items-center justify-center w-full">
                  <p className={`text-xs ${claimedTanks.includes('platinum') ? 'text-green-500 font-medium' : userRanking === 'platinum' ? 'text-blue-500 font-medium' : 'text-gray-400'} text-center`}>
                    {claimedTanks.includes('platinum') ? '수령 완료' : userRanking === 'platinum' ? '수령 가능' : '플래티넘 도달'}
                  </p>
                </div>
              </div>
              
              {/* 잠금 오버레이와 자물쇠 */}
              {userRanking !== 'platinum' && (
                <>
                  <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600 opacity-80" />
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mx-3 mt-6 border-t border-gray-200"></div>

        {/* 물고기 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>물고기</h3>
          
          {Object.entries(fishData).map(([rank, fishes]) => (
            <div key={rank} className="mb-4">
              <h4 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mb-2 capitalize`}>
                {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {fishes.map((fish, i) => {
                  const isPurchased = purchasedFish.includes(fish.name);
                  const isLocked = false; // 플래티넘도 잠금 해제
                  
                  return (
                    <button 
                      key={i} 
                      className={`${isLocked ? 'bg-gray-100 opacity-50' : isPurchased ? 'bg-green-50 border-green-300' : cardBg} border ${isPurchased ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2`}
                      disabled={isLocked || isPurchased}
                    >
                      {/* 물고기 SVG 아이콘 - 더 크게, 중앙 정렬 */}
                      <div className={`h-[42px] w-full flex items-center justify-center ${isLocked ? 'blur-sm' : ''}`}>
                        {(() => {
                          const FishIcon = FishIcons[fish.name.replace(' ', '')];
                          // 특정 물고기는 더 크게 표시
                          const iconSize = ['네온테트라', '아피스토그라마', '킬리피쉬'].includes(fish.name) ? 48 : 36;
                          return FishIcon ? <FishIcon size={iconSize} /> : null;
                        })()}
                      </div>
                      
                      {/* 텍스트 영역 - 중앙 정렬 */}
                      <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                        {/* 물고기 이름 - 더 크게 */}
                        <p className={`text-[11px] leading-tight ${isLocked ? 'text-gray-400' : isPurchased ? 'text-green-600' : isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center font-medium`}>
                          {fish.name}
                        </p>
                        
                        {/* 설명 - 더 크게 */}
                        <p className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5 text-center leading-tight`}>
                          {fish.description}
                        </p>
                      </div>
                      
                      {/* 가격/구매완료 - 하단 고정 */}
                      <div className="h-[20px] flex items-center justify-center w-full">
                        {!isLocked && (
                          <p className={`text-xs ${isPurchased ? 'text-green-500 font-medium' : 'text-blue-500'} text-center`}>
                            {isPurchased ? '구매완료' : `${(rank === 'bronze' ? 100 : rank === 'silver' ? 300 : 500) + i * 100}P`}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-3 mt-4 border-t border-gray-200"></div>

        {/* 어항 장식품 */}
        <div className="mx-3 mt-4">
          <h3 className={`${textColor} text-sm font-medium mb-3`}>어항 장식품</h3>
          
          {Object.entries(decorationsData).map(([rank, decorations]) => (
            <div key={rank} className="mb-4">
              <h4 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mb-2 capitalize`}>
                {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {decorations.map((deco, i) => {
                  const isPurchased = purchasedDecorations.includes(deco.name);
                  const isLocked = rank === 'platinum';
                  
                  return (
                    <button 
                      key={i} 
                      className={`${
                        isLocked 
                          ? cardBg
                          : isPurchased 
                            ? 'bg-green-50 border-green-300' 
                            : cardBg
                      } border ${isPurchased ? 'border-green-300' : borderColor} rounded-lg relative flex flex-col items-center justify-between h-[125px] p-2`}
                      style={isLocked ? { filter: 'none !important', opacity: '1 !important' } : {}}
                      disabled={isLocked || isPurchased}
                    >
                      {/* 아이콘 - 고정 높이 영역 */}
                      <div className="h-[42px] w-full flex items-center justify-center">
                        <div className="w-9 h-9">
                          {DecorationIcons[deco.name] && React.createElement(DecorationIcons[deco.name])}
                        </div>
                      </div>
                      
                      {/* 텍스트 영역 - 중앙 정렬 */}
                      <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <p className={`text-[11px] ${
                          isLocked 
                            ? isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            : isPurchased 
                              ? 'text-green-600' 
                              : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        } text-center font-medium`}>
                          {deco.name}
                        </p>
                      </div>
                      
                      {/* 가격 - 하단 고정 */}
                      <div className="h-[20px] flex items-center justify-center w-full">
                        <p className={`text-xs ${isPurchased ? 'text-green-500 font-medium' : 'text-blue-500'} text-center`}>
                          {isPurchased ? '구매완료' : `${deco.price}P`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 전역 랭킹 체크 함수
  const checkRankingAchievements = useCallback(() => {
    const totalSaved = 18.7; // 실제로는 사용자의 총 절약량을 계산
    
    // 랭킹 기준 (kg)
    const rankThresholds = {
      silver: 10,
      gold: 25,
      platinum: 50
    };
    
    // 랭킹 업데이트
    let newRanking = 'bronze';
    let newUnlockedTanks = [...unlockedTanks];
    let notification = null;
    
    if (totalSaved >= rankThresholds.platinum) {
      newRanking = 'platinum';
      if (!unlockedTanks.includes('platinum')) {
        newUnlockedTanks.push('platinum');
        notification = '🎉 플래티넘 랭킹 달성! 플래티넘 어항이 해제되었습니다!';
      }
      if (!unlockedTanks.includes('gold')) newUnlockedTanks.push('gold');
      if (!unlockedTanks.includes('silver')) newUnlockedTanks.push('silver');
    } else if (totalSaved >= rankThresholds.gold) {
      newRanking = 'gold';
      if (!unlockedTanks.includes('gold')) {
        newUnlockedTanks.push('gold');
        notification = '🎉 골드 랭킹 달성! 골드 어항이 해제되었습니다!';
      }
      if (!unlockedTanks.includes('silver')) newUnlockedTanks.push('silver');
    } else if (totalSaved >= rankThresholds.silver) {
      newRanking = 'silver';
      if (!unlockedTanks.includes('silver')) {
        newUnlockedTanks.push('silver');
        notification = '🎉 실버 랭킹 달성! 실버 어항이 해제되었습니다!';
      }
    }
    
    if (notification) {
      alert(notification);
    }
    
    setUserRanking(newRanking);
    setUnlockedTanks(newUnlockedTanks);
  }, [unlockedTanks]);

  // 랭킹 체크를 앱 시작시 실행
  useEffect(() => {
    checkRankingAchievements();
  }, []);

  const CommunityTab = () => {
    
    // 컴포넌트 마운트시 랭킹 체크
    useEffect(() => {
      checkRankingAchievements();
    }, []);
    
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
              <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
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
        
        {/* 현재 랭킹 표시 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-2`}>나의 랭킹</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                userRanking === 'platinum' ? 'bg-purple-100 text-purple-700' :
                userRanking === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                userRanking === 'silver' ? 'bg-gray-100 text-gray-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {userRanking === 'platinum' ? '💎 플래티넘' :
                 userRanking === 'gold' ? '🥇 골드' :
                 userRanking === 'silver' ? '🥈 실버' :
                 '🥉 브론즈'}
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                총 절약량: 18.7kg
              </span>
            </div>
            <button 
              onClick={checkRankingAchievements}
              className="text-blue-500 text-xs"
            >
              업데이트
            </button>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-1">다음 랭킹까지</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{width: userRanking === 'silver' ? '75%' : userRanking === 'bronze' ? '87%' : '100%'}}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {userRanking === 'bronze' ? '실버까지 1.3kg' :
               userRanking === 'silver' ? '골드까지 6.3kg' :
               userRanking === 'gold' ? '플래티넘까지 31.3kg' :
               '최고 랭킹 달성!'}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const MoreTab = () => (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 환경 뉴스 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3`}>환경 뉴스</h3>
          <div className="space-y-3">
            {[
              { title: 'EU 플라스틱 규제 확대', date: '2024.05.15' },
              { title: '한국 플라스틱 사용량 OECD 1위', date: '2024.04.28' },
              { title: '생분해 포장재 기술 혁신', date: '2024.04.15' }
            ].map((news, index) => (
              <div key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-2`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{news.title}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{news.date}</span>
                  <button className="text-blue-500 text-xs">더보기 →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 제로웨이스트 맵 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3`}>제로웨이스트 맵</h3>
          <div className={`${inputBg} rounded-lg h-32 mb-3 flex items-center justify-center`}>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
          <div className="space-y-2">
            {[
              { name: 'The Package Free Shop', distance: '1.2km' },
              { name: 'GreenFill Station', distance: '0.8km' },
              { name: '재활용센터', distance: '2.5km' }
            ].map((place, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{place.name}</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{place.distance}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-3 text-sm">
            지도 보기
          </button>
        </div>

        {/* 도움말 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3`}>도움말</h3>
          <div className="space-y-2">
            <button className={`w-full flex items-center justify-between p-3 ${inputBg} rounded-lg`}>
              <div className="flex items-center">
                <Book className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>앱 사용 방법</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            <button className={`w-full flex items-center justify-between p-3 ${inputBg} rounded-lg`}>
              <div className="flex items-center">
                <Phone className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>고객 센터</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>설정</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        {/* 프로필 섹션 - 동일한 크기 */}
        <button 
          onClick={() => setShowProfile(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center`}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
            송일
          </div>
          <div className="flex-1 text-left">
            <p className={`text-sm font-medium ${textColor}`}>송일님의 정보</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>내 정보</p>
          </div>
          <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        </button>

        <button 
          onClick={() => setShowLanguageSettings(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex justify-between items-center`}
        >
          <span className={`text-sm ${textColor}`}>언어</span>
          <div className="flex items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>한국어</span>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </button>
        
        <button 
          onClick={() => setShowNotificationSettings(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex justify-between items-center`}
        >
          <span className={`text-sm ${textColor}`}>알림</span>
          <div className="flex items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>{notifications ? '켜짐' : '꺼짐'}</span>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </button>
        
        <button 
          onClick={() => setShowThemeSettings(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex justify-between items-center`}
        >
          <span className={`text-sm ${textColor}`}>화면 테마</span>
          <div className="flex items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>{isDarkMode ? '다크' : '라이트'}</span>
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </button>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowProfile(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>송일님의 정보</h2>
      </div>
      
      {/* 프로필 사진 섹션 */}
      <div className="flex justify-center mt-6 mb-4">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-blue-500" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      <div className="mx-3 space-y-3">
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>이름</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>송일</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>아이디</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>@songil_eco</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>생년월일</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>2004.12.02</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>이메일 주소</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>callmesongil@kakao.com</p>
        </div>
        
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4`}>
          <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>휴대폰 번호</label>
          <p className={`text-sm font-medium mt-1 ${textColor}`}>010-5633-3473</p>
        </div>
        
        {/* 계정 탈퇴 */}
        <button className="w-full text-red-500 text-sm py-3 mt-6">
          계정 탈퇴
        </button>
      </div>
    </div>
  );

  const ThemeSettings = () => (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowThemeSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>화면 테마</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setIsDarkMode(false)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${!isDarkMode ? 'border-blue-500' : ''}`}
        >
          <div className="flex items-center">
            <Sun className={`w-5 h-5 mr-3 ${!isDarkMode ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${textColor}`}>라이트 모드</span>
          </div>
          {!isDarkMode && <Check className="w-5 h-5 text-blue-500" />}
        </button>
        
        <button 
          onClick={() => setIsDarkMode(true)}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${isDarkMode ? 'border-blue-500' : ''}`}
        >
          <div className="flex items-center">
            <Moon className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-blue-500' : 'text-gray-600'}`} />
            <span className={`text-sm ${textColor}`}>다크 모드</span>
          </div>
          {isDarkMode && <Check className="w-5 h-5 text-blue-500" />}
        </button>
      </div>
    </div>
  );

  const LanguageSettings = () => (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowLanguageSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>언어</h2>
      </div>
      
      <div className="mx-3 mt-4 space-y-2">
        <button 
          onClick={() => setLanguage('ko')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${language === 'ko' ? 'border-blue-500' : ''}`}
        >
          <span className={`text-sm ${textColor}`}>한국어</span>
          {language === 'ko' && <Check className="w-5 h-5 text-blue-500" />}
        </button>
        
        <button 
          onClick={() => setLanguage('en')}
          className={`w-full ${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between ${language === 'en' ? 'border-blue-500' : ''}`}
        >
          <span className={`text-sm ${textColor}`}>English</span>
          {language === 'en' && <Check className="w-5 h-5 text-blue-500" />}
        </button>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className={`flex-1 ${bgColor}`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowNotificationSettings(false)} className="mr-3">
          <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-base font-medium ${textColor}`}>알림</h2>
      </div>
      
      <div className="mx-3 mt-4">
        <div className={`${cardBg} border ${borderColor} rounded-xl p-4 flex items-center justify-between`}>
          <span className={`text-sm ${textColor}`}>알림 받기</span>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full ${notifications ? 'bg-blue-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} relative transition-colors`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );

  const AquariumSettings = () => {
    const [selectedTankTemp, setSelectedTankTemp] = useState(currentTank);
    
    const tanks = [
      { id: 'basic', name: '기본 어항', component: BasicTank, always: true },
      { id: 'silver', name: '실버 어항', component: SilverTank, rank: 'silver' },
      { id: 'gold', name: '골드 어항', component: GoldTank, rank: 'gold' },
      { id: 'platinum', name: '플래티넘 어항', component: PlatinumTank, rank: 'platinum' }
    ];
    
    const handleTankSelect = (tankId) => {
      if (tankId === 'basic' || unlockedTanks.includes(tankId)) {
        setSelectedTankTemp(tankId);
      }
    };
    
    const handleApply = () => {
      setCurrentTank(selectedTankTemp);
      setShowAquariumSettings(false);
    };
    
    return (
      <div className={`flex-1 ${bgColor} overflow-y-auto`}>
        <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
          <button onClick={() => setShowAquariumSettings(false)} className="mr-3">
            <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
          </button>
          <h2 className={`text-base font-medium ${textColor}`}>어항 설정</h2>
        </div>
        
        <div className="mx-3 mt-4">
          <h3 className={`text-sm font-medium mb-3 ${textColor}`}>어항 선택</h3>
          
          {/* 현재 선택된 어항 미리보기 */}
          <div className="mb-4">
            <div className="w-full h-48 flex items-center justify-center relative">
              {(() => {
                const SelectedTank = tanks.find(t => t.id === selectedTankTemp)?.component || BasicTank;
                return <SelectedTank className="w-full h-full" />;
              })()}
            </div>
            <p className={`text-center text-sm mt-2 ${textColor} font-medium`}>
              현재 선택: {tanks.find(t => t.id === selectedTankTemp)?.name || '기본 어항'}
            </p>
          </div>
          
          {/* 어항 선택 그리드 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {tanks.map((tank) => {
              const isUnlocked = tank.always || unlockedTanks.includes(tank.id);
              const isSelected = selectedTankTemp === tank.id;
              const TankComponent = tank.component;
              
              return (
                <button
                  key={tank.id}
                  onClick={() => handleTankSelect(tank.id)}
                  disabled={!isUnlocked}
                  className={`border rounded-xl p-3 relative transition-all ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 scale-105 shadow-lg' 
                      : isUnlocked 
                        ? `${cardBg} ${borderColor} hover:scale-105 hover:shadow-md` 
                        : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                >
                  <div className={`w-full aspect-square mb-2 flex items-center justify-center relative overflow-visible`}>
                    <TankComponent isPreview={true} />
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                    {isSelected && isUnlocked && (
                      <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className={`text-xs text-center ${isUnlocked ? (isDarkMode ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'}`}>
                    {tank.name}
                  </p>
                  <p className={`text-xs text-center ${
                    isUnlocked 
                      ? isSelected 
                        ? 'text-blue-500 font-medium' 
                        : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      : 'text-gray-400'
                  }`}>
                    {isUnlocked 
                      ? (isSelected ? '선택됨' : '보유')
                      : tank.rank ? `${tank.rank === 'silver' ? '실버' : tank.rank === 'gold' ? '골드' : '플래티넘'}` : '잠김'
                    }
                  </p>
                </button>
              );
            })}
          </div>

          <h3 className={`text-sm font-medium mb-3 ${textColor}`}>물고기 설정</h3>
          <div className={`${inputBg} rounded-lg p-3 mb-3`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>물고기 수: {fishCount}마리</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFishCount(Math.max(1, fishCount - 1))}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center`}
                >-</button>
                <span className={`text-sm font-medium px-3 ${textColor}`}>{fishCount}</span>
                <button 
                  onClick={() => setFishCount(Math.min(purchasedFish.length, fishCount + 1))}
                  className={`w-8 h-8 ${cardBg} border ${borderColor} rounded flex items-center justify-center`}
                >+</button>
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={isRandomFish}
                onChange={() => setIsRandomFish(!isRandomFish)}
                className="mr-2"
              />
              <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>랜덤 선택</label>
            </div>
          </div>

        {!isRandomFish && (
          <div className="mb-6">
            <h4 className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>물고기 선택 ({selectedFish.length}/{fishCount})</h4>
            {Object.entries(fishData).map(([rank, fishes]) => {
              const purchasedInRank = fishes.filter(fish => purchasedFish.includes(fish.name));
              if (purchasedInRank.length === 0) return null;
              
              return (
                <div key={rank} className="mb-3">
                  <h5 className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                    {rank === 'bronze' ? '브론즈' : rank === 'silver' ? '실버' : rank === 'gold' ? '골드' : '플래티넘'}
                  </h5>
                  <div className="grid grid-cols-3 gap-2">
                    {purchasedInRank.map((fish, i) => (
                      <button
                        key={fish.name}
                        onClick={() => {
                          const fishIndex = purchasedFish.indexOf(fish.name);
                          if (selectedFish.includes(fishIndex)) {
                            setSelectedFish(selectedFish.filter(f => f !== fishIndex));
                          } else if (selectedFish.length < fishCount) {
                            setSelectedFish([...selectedFish, fishIndex]);
                          }
                        }}
                        className={`p-2 rounded-lg border ${
                          selectedFish.includes(purchasedFish.indexOf(fish.name)) ? 'border-blue-500 bg-blue-50' : borderColor
                        } ${cardBg}`}
                        disabled={!selectedFish.includes(purchasedFish.indexOf(fish.name)) && selectedFish.length >= fishCount}
                      >
                        <div className="flex justify-center">
                          {(() => {
                            const FishIcon = FishIcons[fish.name.replace(' ', '')];
                            return FishIcon ? <FishIcon size={20} /> : null;
                          })()}
                        </div>
                        <p className={`text-[10px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{fish.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h3 className={`text-sm font-medium mb-3 ${textColor}`}>어항 꾸미기</h3>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {purchasedDecorations.map((decoName, i) => {
            const deco = Object.values(decorationsData).flat().find(d => d.name === decoName);
            if (!deco) return null;
            
            return (
              <button
                key={i}
                onClick={() => {
                  if (selectedDecorations.includes(i)) {
                    setSelectedDecorations(selectedDecorations.filter(d => d !== i));
                  } else {
                    setSelectedDecorations([...selectedDecorations, i]);
                  }
                }}
                className={`p-3 rounded-lg border ${
                  selectedDecorations.includes(i) ? 'border-blue-500 bg-blue-50' : borderColor
                } ${cardBg}`}
              >
                <div className="w-8 h-8 mb-1">
                  {DecorationIcons[deco.name] && React.createElement(DecorationIcons[deco.name])}
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{deco.name}</p>
              </button>
            );
          })}
        </div>

        <button 
          onClick={handleApply}
          className="w-full bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          적용하기
        </button>
      </div>
    </div>
    );
  };

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
            showProfile ? <ProfileScreen /> : 
            showThemeSettings ? <ThemeSettings /> :
            showLanguageSettings ? <LanguageSettings /> :
            showNotificationSettings ? <NotificationSettings /> :
            <SettingsScreen />
          ) : showAquariumSettings ? (
            <AquariumSettings />
          ) : (
            <>
              {activeTab === 'home' && <HomeTab />}
              {activeTab === 'challenge' && <ChallengeTab />}
              {activeTab === 'reward' && <RewardTab />}
              {activeTab === 'community' && <CommunityTab />}
              {activeTab === 'more' && <MoreTab />}
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