import React, { useState, useEffect } from 'react';
import { FiShare2, FiChevronDown, FiChevronUp, FiBook, FiPhone, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { Check } from 'lucide-react';
import { generateEnvironmentalTip } from '../../services/claudeService';

const More = ({ isDarkMode, userPoints, setUserPoints, earnPoints, rankTheme, showToast, onShowChatBot }) => {
  const [expandedTip, setExpandedTip] = useState(null);
  
  // 카카오톡 API 초기화
  useEffect(() => {
    if (!window.Kakao.isInitialized() && import.meta.env.VITE_KAKAO_API_KEY) {
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
  const [selectedCategory, setSelectedCategory] = useState('랜덤');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryIndices, setCategoryIndices] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [sortedPlaces, setSortedPlaces] = useState([]);
  const [selectedPlaceCategory, setSelectedPlaceCategory] = useState('전체');
  const [showPlaceCategoryDropdown, setShowPlaceCategoryDropdown] = useState(false);

  const categories = ['랜덤', '재활용 팁', '생활 습관', '에너지 절약', '제로웨이스트'];
  const placeCategories = ['전체', '리필샵', '친환경 매장', '재활용/업사이클', '무포장 가게', '비건/친환경 카페'];

  // 컴포넌트 마운트 시 초기 팁 로드 및 사용자 위치 가져오기
  useEffect(() => {
    loadInitialTip();
    getUserLocation();
  }, []);

  // 사용자 위치 및 카테고리 기반으로 장소 정렬 및 필터링
  useEffect(() => {
    let filteredPlaces = zeroWastePlaces;
    
    // 카테고리 필터링
    if (selectedPlaceCategory !== '전체') {
      filteredPlaces = zeroWastePlaces.filter(place => place.category === selectedPlaceCategory);
    }
    
    if (userLocation) {
      const placesWithDistance = filteredPlaces.map(place => ({
        ...place,
        distance: calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
      }));
      const sorted = placesWithDistance.sort((a, b) => a.distance - b.distance);
      setSortedPlaces(sorted);
    } else {
      // 위치 정보가 없으면 원래 순서대로
      setSortedPlaces(filteredPlaces.map(place => ({ ...place, distance: null })));
    }
  }, [userLocation, selectedPlaceCategory]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          // 기본 위치 (서울) 사용
          setUserLocation({ lat: 37.5665, lng: 126.9780 });
        }
      );
    } else {
      // Geolocation을 지원하지 않는 경우 기본 위치
      setUserLocation({ lat: 37.5665, lng: 126.9780 });
    }
  };

  const loadInitialTip = async () => {
    setIsLoadingTip(true);
    try {
      const tip = await generateEnvironmentalTip(selectedCategory === '랜덤' ? null : selectedCategory);
      setEnvironmentalTip(tip);
      setErrorMessage('');
    } catch (error) {
      console.error('팁 로드 실패:', error);
      setErrorMessage('환경 팁을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoadingTip(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setShowCategoryDropdown(false);
    
    if (selectedCategory === category) {
      // 같은 카테고리 클릭 시 새로운 팁 로드
      const currentIndex = categoryIndices[category] || 0;
      setIsLoadingTip(true);
      try {
        const tip = await generateEnvironmentalTip(category === '랜덤' ? null : category, currentIndex + 1);
        setEnvironmentalTip(tip);
        // 팁이 변경되어도 오늘 이미 확인했다면 버튼 비활성화 유지
        // setHasCheckedTip(false); 제거
        
        if (category !== '랜덤' && tip.currentIndex !== undefined) {
          setCategoryIndices(prev => ({
            ...prev,
            [category]: tip.currentIndex
          }));
        }
      } catch (error) {
        console.error('팁 로드 실패:', error);
      } finally {
        setIsLoadingTip(false);
      }
    } else {
      // 다른 카테고리 선택
      setSelectedCategory(category);
      setIsLoadingTip(true);
      try {
        const tip = await generateEnvironmentalTip(category === '랜덤' ? null : category);
        setEnvironmentalTip(tip);
        // 팁이 변경되어도 오늘 이미 확인했다면 버튼 비활성화 유지
        // setHasCheckedTip(false); 제거
      } catch (error) {
        console.error('팁 로드 실패:', error);
      } finally {
        setIsLoadingTip(false);
      }
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
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
  
  // 매일 자정에 리셋되도록 체크
  useEffect(() => {
    const checkReset = () => {
      const lastChecked = localStorage.getItem('lastTipCheckedDate');
      if (lastChecked) {
        const lastDate = new Date(lastChecked);
        const today = new Date();
        if (lastDate.toDateString() !== today.toDateString()) {
          setHasCheckedTip(false);
        }
      }
    };
    
    checkReset();
    // 1분마다 체크
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, []);

  const zeroWastePlaces = [
    { name: '알맹상점 서울역점', description: '리필 전문 매장', address: '서울시 용산구 한강대로 405', lat: 37.5547, lng: 126.9707, category: '리필샵' },
    { name: '더피커 성수', description: '친환경 편집숍', address: '서울시 성동구 왕십리로 115', lat: 37.5447, lng: 127.0557, category: '친환경 매장' },
    { name: '송파 나눔장터', description: '재활용품 거래소', address: '서울시 송파구 올림픽로 240', lat: 37.5145, lng: 127.1065, category: '재활용/업사이클' },
    { name: '지구샵 홍대점', description: '플라스틱 프리 카페', address: '서울시 마포구 와우산로 29', lat: 37.5563, lng: 126.9220, category: '비건/친환경 카페' },
    { name: '채움소 연남점', description: '세제 리필 스테이션', address: '서울시 마포구 성미산로 190', lat: 37.5665, lng: 126.9251, category: '리필샵' },
    { name: '덕분애 제로웨이스트샵', description: '친환경 생활용품', address: '서울시 강남구 선릉로 428', lat: 37.5040, lng: 127.0492, category: '친환경 매장' },
    { name: '허그어웨일', description: '업사이클링 매장', address: '서울시 종로구 윤보선길 35', lat: 37.5773, lng: 126.9681, category: '재활용/업사이클' },
    { name: '보틀팩토리', description: '텀블러 전문점', address: '서울시 강남구 강남대로 390', lat: 37.4979, lng: 127.0276, category: '친환경 매장' },
    { name: '제로그램', description: '무포장 식료품점', address: '서울시 서대문구 연세로 11길', lat: 37.5585, lng: 126.9388, category: '무포장 가게' },
    { name: '리필리', description: '화장품 리필샵', address: '서울시 중구 을지로 281', lat: 37.5663, lng: 127.0090, category: '리필샵' },
    { name: '동네정미소', description: '곡물 리필매장', address: '서울시 은평구 통일로 684', lat: 37.6027, lng: 126.9288, category: '무포장 가게' },
    { name: '얼스어스', description: '비건 제로웨이스트', address: '서울시 용산구 이태원로 228', lat: 37.5340, lng: 126.9948, category: '비건/친환경 카페' }
  ];

  const openInNaverMap = (place) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encodedAddress = encodeURIComponent(place.address);
    
    if (isMobile) {
      const appUrl = `nmap://place?lat=${place.lat}&lng=${place.lng}&name=${encodeURIComponent(place.name)}&appname=com.ecostep`;
      window.location.href = appUrl;
      setTimeout(() => {
        window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank');
      }, 1000);
    } else {
      window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank');
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
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <h3 className={`${textColor} text-sm font-medium`}>오늘의 환경 상식</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg border ${
                    isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                  } hover:opacity-80 transition-opacity bg-transparent`}
                >
                  <span>{selectedCategory}</span>
                  {showCategoryDropdown ? (
                    <FiChevronUp className="w-3 h-3" />
                  ) : (
                    <FiChevronDown className="w-3 h-3" />
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
                        className={`block w-full text-left px-3 py-2 text-xs whitespace-nowrap first:rounded-t-lg last:rounded-b-lg ${
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
            <div className="text-red-500 text-sm mb-3">{errorMessage}</div>
          )}
          
          {isLoadingTip && !environmentalTip ? (
            <div className="flex justify-center items-center h-32">
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
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                      {environmentalTip.title}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {environmentalTip.preview}
                      {expandedTip === environmentalTip.id ? (
                        <FiChevronUp className={`inline w-3 h-3 ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <FiArrowRight className={`inline w-3 h-3 ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </p>
                  </div>
                </div>
                
                {/* 확장된 내용 */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedTip === environmentalTip.id ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}>
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-3`}>
                    <p className={`text-sm leading-relaxed text-justify ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {environmentalTip.content}
                    </p>
                    <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button 
                        onClick={handleShareTip}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-all bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white hover:opacity-90"
                      >
                        <FiShare2 className="w-3 h-3 mr-1" />
                        공유하기
                      </button>
                      <button 
                        onClick={handleCheckTip}
                        className={`${
                          hasCheckedTip 
                            ? isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white hover:opacity-90'
                        } px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition-colors`}
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
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                환경 팁을 불러올 수 없습니다.
              </p>
            </div>
          )}
          
          <div className="mt-2 pt-2">
            <div className={`h-[1px] mb-2 bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-700' : 'via-gray-200'} to-transparent`}></div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>
              매일 새로운 환경 팁을 확인하세요 🌱
            </p>
          </div>
        </div>

        {/* 제로웨이스트 맵 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`${textColor} text-sm font-medium`}>제로웨이스트 맵</h3>
            <div className="relative">
              <button
                onClick={() => setShowPlaceCategoryDropdown(!showPlaceCategoryDropdown)}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg border ${
                  isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                } hover:opacity-80 transition-opacity bg-transparent`}
              >
                <span>{selectedPlaceCategory}</span>
                {showPlaceCategoryDropdown ? (
                  <FiChevronUp className="w-3 h-3" />
                ) : (
                  <FiChevronDown className="w-3 h-3" />
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
                      className={`block w-full text-left px-3 py-2 text-xs whitespace-nowrap first:rounded-t-lg last:rounded-b-lg ${
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
            {sortedPlaces.slice(0, 4).map((place, index) => (
              <div key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-3 min-h-[60px]`}>
                <div className="flex justify-between">
                  <div className="flex-1 pr-3">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{place.name}</p>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{place.description}</span>
                  </div>
                  <div className="relative min-w-[60px] min-h-[20px]">
                    <button 
                      onClick={() => openInNaverMap(place)}
                      className="absolute top-0 right-0 mb-1 text-sm font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent"
                    >
                      이동
                    </button>
                    {place.distance !== null && (
                      <span className={`absolute bottom-1 right-0 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {place.distance < 1 ? 
                          `${Math.round(place.distance * 1000)}m` : 
                          `${place.distance.toFixed(1)}km`
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {sortedPlaces.length > 4 && (
              <div className="pt-2 border-t border-gray-300 dark:border-gray-700">
                {sortedPlaces.slice(4).map((place, index) => (
                  <div key={index + 4} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-3 mb-2 min-h-[60px]`}>
                    <div className="flex justify-between">
                      <div className="flex-1 pr-3">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{place.name}</p>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{place.description}</span>
                      </div>
                      <div className="relative min-w-[60px] min-h-[20px]">
                        <button 
                          onClick={() => openInNaverMap(place)}
                          className="absolute top-0 right-0 mb-1 text-sm font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 bg-clip-text text-transparent"
                        >
                          이동
                        </button>
                        {place.distance !== null && (
                          <span className={`absolute bottom-1 right-0 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {place.distance < 1 ? 
                              `${Math.round(place.distance * 1000)}m` : 
                              `${place.distance.toFixed(1)}km`
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 도움말 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3`}>도움말</h3>
          <div className="space-y-2">
            <button className={`w-full flex items-center justify-between p-3 ${inputBg} rounded-lg`}>
              <div className="flex items-center">
                <FiBook className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>앱 사용 방법</span>
              </div>
              <FiChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            <button 
              onClick={onShowChatBot}
              className={`w-full flex items-center justify-between p-3 ${inputBg} rounded-lg`}
            >
              <div className="flex items-center">
                <FiPhone className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>고객 센터</span>
              </div>
              <FiChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;