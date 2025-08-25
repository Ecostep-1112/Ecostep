import React, { useState, useEffect } from 'react';
import { Leaf, Share2, ChevronDown, ChevronUp, Book, Phone, ChevronRight, Check } from 'lucide-react';
import { generateEnvironmentalTip } from '../services/claudeService';

const More = ({ isDarkMode, userPoints, setUserPoints }) => {
  const [expandedTip, setExpandedTip] = useState(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [environmentalTip, setEnvironmentalTip] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCheckedTip, setHasCheckedTip] = useState(false);

  // 컴포넌트 마운트 시 초기 팁 로드
  useEffect(() => {
    loadInitialTip();
  }, []);

  const loadInitialTip = async () => {
    setIsLoadingTip(true);
    try {
      const tip = await generateEnvironmentalTip();
      setEnvironmentalTip(tip);
      setErrorMessage('');
    } catch (error) {
      console.error('팁 로드 실패:', error);
      setErrorMessage('환경 팁을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoadingTip(false);
    }
  };

  const handleCheckTip = () => {
    if (!hasCheckedTip && environmentalTip) {
      setHasCheckedTip(true);
      if (setUserPoints) {
        setUserPoints(prev => prev + 10);
      }
    }
  };

  const zeroWastePlaces = [
    { name: '알맹상점 서울역점', description: '리필 전문 매장', address: '서울시 용산구 한강대로 405', lat: 37.5547, lng: 126.9707 },
    { name: '더피커 성수', description: '친환경 편집숍', address: '서울시 성동구 왕십리로 115', lat: 37.5447, lng: 127.0557 },
    { name: '송파 나눔장터', description: '재활용품 거래소', address: '서울시 송파구 올림픽로 240', lat: 37.5145, lng: 127.1065 },
    { name: '지구샵 홍대점', description: '플라스틱 프리 카페', address: '서울시 마포구 와우산로 29', lat: 37.5563, lng: 126.9220 },
    { name: '채움소 연남점', description: '세제 리필 스테이션', address: '서울시 마포구 성미산로 190', lat: 37.5665, lng: 126.9251 },
    { name: '덕분애 제로웨이스트샵', description: '친환경 생활용품', address: '서울시 강남구 선릉로 428', lat: 37.5040, lng: 127.0492 },
    { name: '허그어웨일', description: '업사이클링 매장', address: '서울시 종로구 윤보선길 35', lat: 37.5773, lng: 126.9681 },
    { name: '보틀팩토리', description: '텀블러 전문점', address: '서울시 강남구 강남대로 390', lat: 37.4979, lng: 127.0276 },
    { name: '제로그램', description: '무포장 식료품점', address: '서울시 서대문구 연세로 11길', lat: 37.5585, lng: 126.9388 },
    { name: '리필리', description: '화장품 리필샵', address: '서울시 중구 을지로 281', lat: 37.5663, lng: 127.0090 },
    { name: '동네정미소', description: '곡물 리필매장', address: '서울시 은평구 통일로 684', lat: 37.6027, lng: 126.9288 },
    { name: '얼스어스', description: '비건 제로웨이스트', address: '서울시 용산구 이태원로 228', lat: 37.5340, lng: 126.9948 }
  ];

  const openInNaverMap = (place) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encodedName = encodeURIComponent(place.name);
    const encodedAddress = encodeURIComponent(place.address);
    
    if (isMobile) {
      const appUrl = `nmap://place?lat=${place.lat}&lng=${place.lng}&name=${encodedName}&appname=com.ecostep`;
      const webUrl = `https://map.naver.com/v5/search/${encodedAddress}`;
      
      window.location.href = appUrl;
      
      setTimeout(() => {
        window.open(webUrl, '_blank');
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
              <Leaf className={`w-4 h-4 text-green-500 mr-2`} />
              <h3 className={`${textColor} text-sm font-medium`}>오늘의 환경 상식</h3>
            </div>
            {hasCheckedTip && (
              <span className="text-green-500 text-xs font-medium">+10 포인트 획득!</span>
            )}
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
              <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-3`}>
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedTip(expandedTip === environmentalTip.id ? null : environmentalTip.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mb-1 ${
                        isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                      }`}>
                        {environmentalTip.category}
                      </span>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                        {environmentalTip.title}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                        {environmentalTip.preview}
                      </p>
                    </div>
                    <button className="flex-shrink-0 mt-1">
                      {expandedTip === environmentalTip.id ? (
                        <ChevronUp className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* 확장된 내용 */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedTip === environmentalTip.id ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}>
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-3`}>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {environmentalTip.content}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
                      <button 
                        onClick={handleCheckTip}
                        className={`${
                          hasCheckedTip 
                            ? 'bg-green-500 text-white cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } px-3 py-1 rounded-lg text-xs flex items-center transition-colors`}
                        disabled={hasCheckedTip}
                      >
                        {hasCheckedTip ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            확인 완료
                          </>
                        ) : (
                          <>확인하고 10 포인트 받기</>
                        )}
                      </button>
                      <button className="text-blue-500 text-xs flex items-center">
                        <Share2 className="w-3 h-3 mr-1" />
                        공유하기
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
          
          <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>
              매일 새로운 환경 팁을 확인하세요 🌱
            </p>
          </div>
        </div>

        {/* 제로웨이스트 맵 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3`}>제로웨이스트 맵</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {zeroWastePlaces.map((place, index) => (
              <div key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-2`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>{place.name}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{place.description}</span>
                  <button 
                    onClick={() => openInNaverMap(place)}
                    className="text-blue-500 text-xs"
                  >
                    이동 →
                  </button>
                </div>
              </div>
            ))}
          </div>
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
};

export default More;