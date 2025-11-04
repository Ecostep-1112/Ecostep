import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Book, Phone, ChevronRight, ArrowRight, Check } from 'lucide-react';
import { getTodayTip, generateDailyTip } from '../../services/claudeService';
import { searchPlaces, filterAndSortPlaces } from '../../services/naverMapService';

const More = ({ isDarkMode, userPoints, setUserPoints, earnPoints, rankTheme, showToast, onShowChatBot, locationSharing }) => {
  const [expandedTip, setExpandedTip] = useState(null);
  
  // 카카오톡 API 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized() && import.meta.env.VITE_KAKAO_API_KEY) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
    }
  }, []);
  
  // 테마 색상 가져오기
  const getThemeColor = () => {
    if (rankTheme === 'basic') {
      return isDarkMode ? 'bg-gray-200' : 'bg-gray-700';
    }
    if (rankTheme === 'bronze') return 'bg-cyan-500';
    if (rankTheme === 'silver') return 'bg-teal-500';
    if (rankTheme === 'gold') return 'bg-yellow-400';
    if (rankTheme === 'platinum') return 'bg-purple-400';
    return isDarkMode ? 'bg-gray-700' : 'bg-gray-900';
  };
  
  const getThemeHoverColor = () => {
    if (rankTheme === 'basic') {
      return isDarkMode ? 'hover:bg-gray-300' : 'hover:bg-gray-600';
    }
    if (rankTheme === 'bronze') return 'hover:bg-cyan-600';
    if (rankTheme === 'silver') return 'hover:bg-teal-600';
    if (rankTheme === 'gold') return 'hover:bg-yellow-500';
    if (rankTheme === 'platinum') return 'hover:bg-purple-500';
    return isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-800';
  };
  
  const getButtonTextColor = () => {
    if (rankTheme === 'basic') {
      return isDarkMode ? 'text-black' : 'text-white';
    }
    if (rankTheme === 'gold') return 'text-gray-800';
    return 'text-white';
  };
  
  const getOutlineColor = () => {
    if (rankTheme === 'basic') {
      return isDarkMode ? 'border-gray-400' : 'border-gray-700';
    }
    if (rankTheme === 'bronze') return 'border-cyan-500';
    if (rankTheme === 'silver') return 'border-teal-500';
    if (rankTheme === 'gold') return 'border-yellow-400';
    if (rankTheme === 'platinum') return 'border-purple-400';
    return isDarkMode ? 'border-gray-400' : 'border-gray-700';
  };
  
  const getOutlineTextColor = () => {
    if (rankTheme === 'basic') {
      return isDarkMode ? 'text-gray-400' : 'text-gray-700';
    }
    if (rankTheme === 'bronze') return 'text-cyan-500';
    if (rankTheme === 'silver') return 'text-teal-500';
    if (rankTheme === 'gold') return 'text-yellow-500';
    if (rankTheme === 'platinum') return 'text-purple-400';
    return isDarkMode ? 'text-gray-400' : 'text-gray-700';
  };
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [environmentalTip, setEnvironmentalTip] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  // 날짜 체크 및 카테고리 업데이트 유틸 함수 (중복 제거)
  const checkAndUpdateDailyData = () => {
    const today = new Date().toDateString();
    const lastUpdate = localStorage.getItem('lastCategoryUpdateDate');

    if (lastUpdate !== today) {
      // 날짜가 바뀜 - nextDayCategory를 tipCategory로 이동
      const nextCat = localStorage.getItem('nextDayCategory');
      if (nextCat) {
        localStorage.setItem('tipCategory', nextCat);
        localStorage.removeItem('nextDayCategory');
      }
      localStorage.setItem('lastCategoryUpdateDate', today);
      return true; // 날짜가 변경됨
    }
    return false; // 날짜가 같음
  };

  const [hasCheckedTip, setHasCheckedTip] = useState(() => {
    // 오늘 이미 확인했는지 체크
    const lastChecked = localStorage.getItem('lastTipCheckedDate');
    if (lastChecked) {
      const lastDate = new Date(lastChecked);
      const today = new Date();
      return lastDate.toDateString() === today.toDateString();
    }
    return false;
  });

  // 카테고리 초기화 함수
  const initializeCategory = () => {
    checkAndUpdateDailyData();
    return localStorage.getItem('tipCategory') || '랜덤';
  };

  const [selectedCategory, setSelectedCategory] = useState(initializeCategory());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryIndices, setCategoryIndices] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState('제로웨이스트샵');
  const [showPlaceCategoryDropdown, setShowPlaceCategoryDropdown] = useState(false);
  const [zeroWastePlaces, setZeroWastePlaces] = useState([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(true); // 기본값: 위치 꺼짐
  const [placesCache, setPlacesCache] = useState({}); // 카테고리별 장소 캐시
  const [placeError, setPlaceError] = useState(null); // 장소 로드 에러 상태

  const categories = ['랜덤', '재활용 팁', '생활 습관', '에너지 절약', '제로웨이스트'];

  // 제로웨이스트 맵 카테고리 정의 (전체 제거)
  const placeCategories = ['제로웨이스트샵', '리필스테이션', '친환경매장', '재활용센터'];

  // 카테고리별 검색어 매핑 (전체 제거)
  const categorySearchQueries = {
    '제로웨이스트샵': ['제로웨이스트샵', '제로웨이스트'],
    '리필스테이션': ['리필스테이션', '리필샵'],
    '친환경매장': ['친환경매장', '친환경제품'],
    '재활용센터': ['재활용센터', '재활용']
  };

  // 네이버 지도 API에서 장소 데이터 불러오기 (캐싱 포함)
  const loadPlaces = async () => {
    try {
      setIsLoadingPlaces(true);
      setPlaceError(null);

      // 위치 권한이 없으면 검색하지 않음
      if (!userLocation) {
        setZeroWastePlaces([]);
        setIsLoadingPlaces(false);
        return;
      }

      // 캐시 키 생성 (카테고리 + 위치)
      const cacheKey = `${selectedPlaceCategory}-${userLocation.lat.toFixed(3)}-${userLocation.lng.toFixed(3)}`;

      // 캐시에 데이터가 있으면 사용 (10분간 유효)
      const cached = placesCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
        setZeroWastePlaces(cached.places);
        setIsLoadingPlaces(false);
        return;
      }

      // 선택된 카테고리에 해당하는 검색어 가져오기
      const searchQueries = categorySearchQueries[selectedPlaceCategory];

      if (!searchQueries) {
        console.error('유효하지 않은 카테고리:', selectedPlaceCategory);
        setPlaceError('유효하지 않은 카테고리입니다.');
        setIsLoadingPlaces(false);
        return;
      }

      // 모든 검색어로 장소 검색
      const searchPromises = searchQueries.map(query => searchPlaces(query, 20));
      const searchResults = await Promise.all(searchPromises);

      // 모든 결과 합치기
      const allPlaces = searchResults.flat();

      // 중복 제거 (같은 이름과 주소를 가진 장소) - O(n) 성능 개선
      const seenKeys = new Set();
      const uniquePlaces = allPlaces.filter(place => {
        const key = `${place.name}-${place.address}`;
        if (seenKeys.has(key)) {
          return false;
        }
        seenKeys.add(key);
        return true;
      }).map(place => ({
        ...place,
        category: selectedPlaceCategory
      }));

      // 사용자 위치 기준 3km 반경 내 장소만 필터링 및 정렬
      const filteredPlaces = filterAndSortPlaces(uniquePlaces, userLocation, 3);

      setZeroWastePlaces(filteredPlaces);

      // 캐시에 저장
      setPlacesCache(prev => ({
        ...prev,
        [cacheKey]: {
          places: filteredPlaces,
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      console.error('장소 데이터 로드 실패:', error);
      setZeroWastePlaces([]);
      setPlaceError('장소를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');

      if (showToast) {
        showToast('장소 검색에 실패했습니다', 'error');
      }
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // 컴포넌트 마운트 시 초기 팁 로드
  useEffect(() => {
    loadInitialTip();
  }, []);

  // locationSharing 설정에 따라 위치 정보 가져오기
  useEffect(() => {
    if (locationSharing) {
      // 위치 설정이 켜져있으면 위치 정보 요청
      getUserLocation();
    } else {
      // 위치 설정이 꺼져있으면 위치 거부 상태로 설정
      setLocationPermissionDenied(true);
      setUserLocation(null);
      setZeroWastePlaces([]);
    }
  }, [locationSharing]);

  // 사용자 위치를 가져온 후 또는 카테고리 변경 시 장소 로드
  useEffect(() => {
    if (userLocation) {
      loadPlaces();
    }
  }, [userLocation, selectedPlaceCategory]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationPermissionDenied(false);
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          // 위치 권한이 거부된 경우
          setLocationPermissionDenied(true);
          setUserLocation(null);
        }
      );
    } else {
      // Geolocation을 지원하지 않는 경우
      setLocationPermissionDenied(true);
      setUserLocation(null);
    }
  };

  const loadInitialTip = async () => {
    setIsLoadingTip(true);
    try {
      // localStorage에서 저장된 오늘의 팁 가져오기
      const tip = getTodayTip();
      setEnvironmentalTip(tip);

      // 현재 카테고리 가져오기
      const currentCategory = localStorage.getItem('tipCategory') || '랜덤';
      setSelectedCategory(currentCategory);

      setErrorMessage('');
    } catch (error) {
      console.error('팁 로드 실패:', error);
      setErrorMessage('환경 팁을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoadingTip(false);
    }
  };

  const handleCategoryClick = (category) => {
    setShowCategoryDropdown(false);

    // 카테고리 저장 (다음 팁 생성 시 적용)
    localStorage.setItem('tipCategory', category);
    setSelectedCategory(category);

    // 토스트 메시지 표시
    if (showToast) {
      showToast(`내일부터 "${category}" 팁이 표시됩니다`, 'success');
    }
  };

  const handleCheckTip = () => {
    if (!hasCheckedTip && environmentalTip) {
      setHasCheckedTip(true);
      // 오늘 날짜 저장
      localStorage.setItem('lastTipCheckedDate', new Date().toISOString());
      
      if (earnPoints) {
        earnPoints(100);
      } else if (setUserPoints) {
        setUserPoints(prev => prev + 100);
      }
      
      // 토스트 메시지 표시
      if (showToast) {
        showToast('+100 포인트 획득!', 'success');
      }
    }
  };

  const handleShareTip = () => {
    if (!environmentalTip) return;

    console.log('공유 버튼 클릭됨');
    console.log('Kakao 객체:', window.Kakao);
    console.log('Kakao.Share:', window.Kakao?.Share);

    if (window.Kakao && window.Kakao.Share) {
      try {
        console.log('카카오톡 공유 시도');
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: '🌱 EcoStep - ' + environmentalTip.title,
            description: environmentalTip.content,
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500',
            link: {
              mobileWebUrl: window.location.origin,
              webUrl: window.location.origin,
            },
          },
        });
      } catch (error) {
        console.error('카카오톡 공유 에러:', error);
        fallbackShare();
      }
    } else {
      console.log('카카오톡 사용 불가, 대체 방법 사용');
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const shareText = `🌱 ${environmentalTip.title}\n\n${environmentalTip.content}\n\n- EcoStep에서`;
    
    if (navigator.share) {
      navigator.share({
        title: '🌱 EcoStep - ' + environmentalTip.title,
        text: shareText,
      }).catch(err => {
        console.log('Web Share API 실패:', err);
        copyToClipboard(shareText);
      });
    } else if (navigator.clipboard) {
      copyToClipboard(shareText);
    } else {
      console.log('공유 기능을 사용할 수 없습니다');
      if (showToast) {
        showToast('공유 기능을 사용할 수 없습니다', 'error');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('클립보드 복사 성공');
      if (showToast) {
        showToast('클립보드에 복사되었습니다!', 'success');
      }
    }).catch(err => {
      console.error('클립보드 복사 실패:', err);
      if (showToast) {
        showToast('복사에 실패했습니다', 'error');
      }
    });
  };
  
  // 매일 자정에 리셋되도록 체크 (날짜 변경 시 팁도 리로드) - 중복 로직 통합
  useEffect(() => {
    const checkReset = () => {
      const lastChecked = localStorage.getItem('lastTipCheckedDate');
      const today = new Date().toDateString();

      // 포인트 리셋 체크
      if (lastChecked) {
        const lastDate = new Date(lastChecked);
        if (lastDate.toDateString() !== today) {
          setHasCheckedTip(false);
        }
      }

      // 날짜 변경 체크 및 팁 리로드 (통합된 함수 사용)
      const dateChanged = checkAndUpdateDailyData();
      if (dateChanged) {
        console.log('날짜가 변경되었습니다. 팁을 리로드합니다.');
        loadInitialTip();
      }
    };

    checkReset();
    // 1분마다 체크
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, []);

  // zeroWastePlaces는 네이버 Local Search API에서 실시간으로 불러옵니다

  // 장소 카드 컴포넌트 (중복 제거)
  const PlaceCard = ({ place, isDarkMode }) => (
    <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-3 min-h-[60px]`}>
      <div className="flex justify-between">
        <div className="flex-1 pr-3">
          <p className={`text-[16px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{place.name}</p>
          <span className={`text-[14px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{place.description}</span>
        </div>
        <div className="relative min-w-[60px] min-h-[20px]">
          <button
            onClick={() => openInNaverMap(place)}
            className="absolute top-[1px] right-0 mb-1 text-[16px] font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent"
          >
            이동
          </button>
          {place.distance !== null && (
            <span className={`absolute bottom-1 right-0 text-[14px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {place.distance < 1 ?
                `${Math.round(place.distance * 1000)}m` :
                `${place.distance.toFixed(1)}km`
              }
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const openInNaverMap = (place) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // address가 있으면 사용하고, 없으면 name 사용
    const searchQuery = place.address || place.name;
    const encodedQuery = encodeURIComponent(searchQuery);

    if (isMobile) {
      const appUrl = `nmap://place?lat=${place.lat}&lng=${place.lng}&name=${encodeURIComponent(place.name)}&appname=com.ecostep`;

      // 앱이 설치되어 있는지 확인
      let appOpened = false;
      window.location.href = appUrl;

      // 앱이 열리지 않았을 때만 웹 페이지 열기
      const timer = setTimeout(() => {
        if (!appOpened) {
          window.open(`https://map.naver.com/v5/search/${encodedQuery}`, '_blank');
        }
      }, 1500);

      // 앱이 열렸으면 타이머 취소
      window.addEventListener('blur', () => {
        appOpened = true;
        clearTimeout(timer);
      }, { once: true });
    } else {
      window.open(`https://map.naver.com/v5/search/${encodedQuery}`, '_blank');
    }
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 오늘의 환경 상식 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl px-4 pt-4 pb-0`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <h3 className={`${textColor} text-[16px] font-medium`}>오늘의 환경 상식</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`flex items-center gap-1 px-2 py-1 text-[14px] rounded-lg border ${
                    isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                  } hover:opacity-80 transition-opacity bg-transparent`}
                >
                  <span>{selectedCategory}</span>
                  {showCategoryDropdown ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
                {showCategoryDropdown && (
                  <div className={`absolute right-0 mt-1 w-max rounded-lg shadow-lg z-10 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`block w-full text-left px-3 py-2 text-[14px] whitespace-nowrap first:rounded-t-lg last:rounded-b-lg ${
                          selectedCategory === category
                            ? isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900'
                            : isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {errorMessage && (
            <div className="text-red-500 text-[15px] mb-3">{errorMessage}</div>
          )}
          
          {isLoadingTip && !environmentalTip ? (
            <div className="flex justify-center items-center h-16">
              <div className="text-gray-500">팁을 불러오는 중...</div>
            </div>
          ) : environmentalTip ? (
            <div>
              <div className="pb-3">
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedTip(expandedTip === environmentalTip.id ? null : environmentalTip.id)}
                >
                  <div className="flex flex-col">
                    <p className={`text-[16px] font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                      {environmentalTip.title}
                    </p>
                    <p className={`text-[14px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {environmentalTip.preview}
                      {expandedTip === environmentalTip.id ? (
                        <ChevronUp className={`inline w-3 h-3 ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <ArrowRight className={`inline w-3 h-3 ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </p>
                  </div>
                </div>
                
                {/* 확장된 내용 */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedTip === environmentalTip.id ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-3 pt-2 pb-0">
                    <p className={`text-[16px] leading-relaxed text-justify ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {environmentalTip.content}
                    </p>
                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button
                        onClick={handleShareTip}
                        className="px-3 py-1.5 rounded-lg text-[14px] font-medium flex items-center transition-all bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white hover:opacity-90"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        공유하기
                      </button>
                      <button
                        onClick={handleCheckTip}
                        className={`${
                          hasCheckedTip
                            ? isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white hover:opacity-90'
                        } px-3 py-1.5 rounded-lg text-[14px] font-medium flex items-center transition-colors`}
                        disabled={hasCheckedTip}
                      >
                        {hasCheckedTip ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            확인 완료
                          </>
                        ) : (
                          <>확인(+100P)</>
                        )}
                      </button>
                    </div>
                    <div className="mt-2 -mb-1.5">
                      <div className={`h-[1px] mb-2 bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-700' : 'via-gray-200'} to-transparent`}></div>
                      <p className={`text-[14px] m-0 pb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center italic leading-none`}>
                        매일 새로운 환경 팁을 확인하세요
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[15px]`}>
                환경 팁을 불러올 수 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 제로웨이스트 맵 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`${textColor} text-[16px] font-medium`}>제로웨이스트 맵</h3>
            <div className="relative">
              <button
                onClick={() => setShowPlaceCategoryDropdown(!showPlaceCategoryDropdown)}
                className={`flex items-center gap-1 px-2 py-1 text-[14px] rounded-lg border ${
                  isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                } hover:opacity-80 transition-opacity bg-transparent`}
              >
                <span>{selectedPlaceCategory}</span>
                {showPlaceCategoryDropdown ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {showPlaceCategoryDropdown && (
                <div className={`absolute right-0 mt-1 w-max rounded-lg shadow-lg z-10 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  {placeCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedPlaceCategory(category);
                        setShowPlaceCategoryDropdown(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-[14px] whitespace-nowrap first:rounded-t-lg last:rounded-b-lg ${
                        selectedPlaceCategory === category
                          ? isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900'
                          : isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar">
            {locationPermissionDenied ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[15px] text-center`}>
                  설정에서 위치 권한을 허락해 주세요
                </p>
              </div>
            ) : isLoadingPlaces ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">장소를 불러오는 중...</div>
              </div>
            ) : placeError ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-[15px] text-center mb-2`}>
                  {placeError}
                </p>
                <button
                  onClick={loadPlaces}
                  className={`px-3 py-1.5 rounded-lg text-[14px] font-medium ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  } hover:opacity-80`}
                >
                  다시 시도
                </button>
              </div>
            ) : zeroWastePlaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[15px] text-center`}>
                  3km 반경 내에 장소가 없습니다
                </p>
              </div>
            ) : (
              <>
                {zeroWastePlaces.slice(0, 4).map((place, index) => (
                  <PlaceCard key={index} place={place} isDarkMode={isDarkMode} />
                ))}
                {zeroWastePlaces.length > 4 && (
                  <div className="pt-2">
                    {zeroWastePlaces.slice(4).map((place, index) => (
                      <PlaceCard key={index + 4} place={place} isDarkMode={isDarkMode} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 도움말 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-3`}>
          <h3 className={`${textColor} text-[16px] font-medium mb-2`}>도움말</h3>
          <div className="space-y-2">
            <button className={`w-full flex items-center justify-between p-2.5 ${inputBg} rounded-lg`}>
              <div className="flex items-center">
                <Book className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-[16px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>앱 사용 방법</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            <button
              onClick={onShowChatBot}
              className={`w-full flex items-center justify-between p-2.5 ${inputBg} rounded-lg`}
            >
              <div className="flex items-center">
                <Phone className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-[16px] ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>고객 센터</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;