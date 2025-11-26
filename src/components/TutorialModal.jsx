import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// 이미지 import
import slide1 from '../assets/슬라이드1.PNG';
import slide2 from '../assets/슬라이드2.PNG';
import slide3 from '../assets/슬라이드3.PNG';
import slide4 from '../assets/슬라이드4.PNG';
import slide5 from '../assets/슬라이드5.PNG';
import slide6 from '../assets/슬라이드6.PNG';
import slide7 from '../assets/슬라이드7.PNG';
import slide8 from '../assets/슬라이드8.PNG';

const TutorialModal = ({ isOpen, onClose, isDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const imageContainerRef = useRef(null);

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8];

  // 최소 스와이프 거리 (픽셀)
  const minSwipeDistance = 50;

  // 모달이 열릴 때 첫 슬라이드로 리셋
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 터치 시작
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // 터치 이동
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // 터치 종료
  const onTouchEnd = (e) => {
    // 터치 스와이프가 없는 경우 (탭)
    if (!touchEnd) {
      handleTouchTap(e);
      return;
    }

    if (!touchStart) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }
  };

  // 터치 탭 핸들러 (양쪽 20% 영역)
  const handleTouchTap = (e) => {
    if (!imageContainerRef.current || !touchStart) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const tapX = touchStart - rect.left;
    const width = rect.width;
    const tapPercentage = (tapX / width) * 100;

    // 왼쪽 20% 탭 - 이전 슬라이드
    if (tapPercentage < 20 && currentSlide > 0) {
      prevSlide();
    }
    // 오른쪽 20% 탭 - 다음 슬라이드
    else if (tapPercentage > 80 && currentSlide < slides.length - 1) {
      nextSlide();
    }
  };

  // 마우스 드래그 (데스크톱)
  const [mouseStart, setMouseStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setMouseStart(e.clientX);
    setHasMoved(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging || !mouseStart) return;
    // 마우스가 조금이라도 움직이면 hasMoved를 true로 설정
    if (Math.abs(e.clientX - mouseStart) > 5) {
      setHasMoved(true);
    }
  };

  const onMouseUp = (e) => {
    if (!isDragging || !mouseStart) return;

    // 드래그가 아니라 클릭인 경우 (움직임이 거의 없는 경우)
    if (!hasMoved) {
      handleImageClick(e);
    } else {
      // 드래그인 경우
      const distance = mouseStart - e.clientX;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && currentSlide < slides.length - 1) {
        nextSlide();
      }
      if (isRightSwipe && currentSlide > 0) {
        prevSlide();
      }
    }

    setIsDragging(false);
    setMouseStart(null);
    setHasMoved(false);
  };

  // 이미지 클릭 핸들러 (양쪽 20% 영역)
  const handleImageClick = (e) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = (clickX / width) * 100;

    // 왼쪽 20% 클릭 - 이전 슬라이드
    if (clickPercentage < 20 && currentSlide > 0) {
      prevSlide();
    }
    // 오른쪽 20% 클릭 - 다음 슬라이드
    else if (clickPercentage > 80 && currentSlide < slides.length - 1) {
      nextSlide();
    }
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 배경 클릭 시 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)',
      }}
    >
      {/* 모달 컨텐츠 */}
      <div
        className={`relative w-full max-w-4xl rounded-xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            앱 사용 방법
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 이미지 영역 */}
        <div
          className="relative select-none cursor-grab active:cursor-grabbing"
          ref={imageContainerRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={() => {
            if (isDragging) {
              setIsDragging(false);
              setMouseStart(null);
            }
          }}
        >
          <div className="flex items-center justify-center py-4">
            <img
              src={slides[currentSlide]}
              alt={`튜토리얼 슬라이드 ${currentSlide + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain"
              draggable="false"
            />
          </div>
        </div>

        {/* 하단 - 페이지 인디케이터 */}
        <div className={`flex items-center justify-center gap-2 p-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {currentSlide + 1} / {slides.length}
          </span>

          {/* 도트 인디케이터 */}
          <div className="flex gap-1.5 ml-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 w-6'
                    : isDarkMode
                    ? 'bg-gray-600 hover:bg-gray-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
