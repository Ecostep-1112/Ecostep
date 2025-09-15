import React, { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FiChevronRight } from 'react-icons/fi';
import { signInWithGoogle, signInWithKakao, signInWithApple } from '../lib/auth';
import EarthStructure from './EarthStructure';

function Login({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stars, setStars] = useState([]);

  // 별 생성 - 황금비율 적용 (총 30개)
  React.useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const phi = 1.618; // 황금비율
      
      // 황금비율로 크기 설정 (각 크기는 이전 크기의 1.618배)
      const baseStar = 1;
      const starSizes = [
        baseStar,                    // 1
        baseStar * phi,              // 1.618
        baseStar * phi * phi,        // 2.618
        baseStar * phi * phi * phi,  // 4.236
      ];
      
      // 황금비율로 개수 분배 (총 30개)
      // 큰 별:작은 별 = 1:1.618 비율로 감소
      const starConfig = [
        { size: starSizes[0], count: 12 },  // 40%
        { size: starSizes[1], count: 8 },   // 27%
        { size: starSizes[2], count: 6 },   // 20%
        { size: starSizes[3], count: 4 },   // 13%
      ];
      
      let id = 0;
      
      // 황금 나선 패턴으로 균등 분포
      starConfig.forEach(config => {
        for (let i = 0; i < config.count; i++) {
          let left, top;
          let attempts = 0;
          const maxAttempts = 100;
          
          // 황금각(137.5도)을 이용한 분포
          const goldenAngle = 137.5;
          const angle = (id * goldenAngle) % 360;
          const radius = (id / 30) * 50; // 중심에서 바깥으로 퍼지는 반경
          
          do {
            // 황금 나선 기반 초기 위치
            const baseX = 50 + radius * Math.cos(angle * Math.PI / 180);
            const baseY = 35 + radius * 0.7 * Math.sin(angle * Math.PI / 180);
            
            // 약간의 랜덤성 추가로 자연스럽게
            left = baseX + (Math.random() - 0.5) * 15;
            top = baseY + (Math.random() - 0.5) * 10;
            
            // 경계 조정
            left = Math.max(5, Math.min(95, left));
            top = Math.max(3, Math.min(80, top));
            
            attempts++;
            
            if (attempts >= maxAttempts) {
              // 실패시 완전 랜덤 위치
              left = Math.random() * 90 + 5;
              top = Math.random() * 80;
              break;
            }
          } while (
            // 지구본 영역 체크 (중앙 35% 위치)
            (Math.pow(left - 50, 2) + Math.pow((top - 35) * 1.3, 2) < 600)
          );
          
          newStars.push({
            id: id++,
            left: left,
            top: top,
            size: config.size,
            animationDelay: Math.random() * 3,
            animationDuration: Math.random() * 2 + 2
          });
        }
      });
      
      setStars(newStars);
    };
    generateStars();
  }, []);

  const handleLogin = async (provider) => {
    console.log(`${provider} 로그인 시도`);
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch(provider) {
        case 'Google':
          console.log('구글 로그인 함수 호출');
          result = await signInWithGoogle();
          break;
        case 'Kakao':
          console.log('카카오 로그인 함수 호출');
          result = await signInWithKakao();
          break;
        case 'Apple':
          console.log('애플 로그인 함수 호출');
          result = await signInWithApple();
          break;
        case 'skip':
          onLogin();
          return;
        default:
          throw new Error('지원하지 않는 로그인 방식입니다.');
      }
      
      console.log('로그인 결과:', result);
      
      if (result.error) {
        throw result.error;
      }
      
      // 로그인 성공 시 처리는 리다이렉트 후 App.jsx에서 처리됨
      console.log('로그인 성공, 리다이렉트 대기중...');
    } catch (err) {
      console.error(`${provider} 로그인 에러:`, err);
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-full max-w-[375px] h-[812px] bg-gray-900 rounded-[2.5rem] p-[3px] shadow-2xl">
        <div className="w-full h-full bg-black rounded-[2.3rem] p-[8px]">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-[2rem] overflow-hidden flex flex-col items-center px-6 py-8 relative">
            {/* 별 애니메이션 */}
            <style jsx>{`
              @keyframes twinkle {
                0%, 100% {
                  opacity: 0;
                  transform: scale(0.5);
                }
                50% {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              .star {
                position: absolute;
                background: white;
                border-radius: 50%;
                animation: twinkle infinite ease-in-out;
              }
            `}</style>
            
            {/* 별들 렌더링 */}
            {stars.map((star) => (
              <div
                key={star.id}
                className="star"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: `${star.animationDelay}s`,
                  animationDuration: `${star.animationDuration}s`,
                }}
              />
            ))}
            
            {/* 지구본 - 상단과 구글 버튼 사이 중앙 */}
            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <EarthStructure size={180} angle={108} />
            </div>
            
            {/* 하단 영역 - 로그인 버튼들 */}
            <div className="mt-auto w-full">
              {/* 에러 메시지 */}
              {error && (
                <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* 로그인 버튼들 */}
              <div className="flex flex-col items-center space-y-4 relative z-20">
              <button
                onClick={() => handleLogin('Google')}
                disabled={isLoading}
                className="w-[237px] flex items-center justify-between bg-white/90 border border-gray-200 rounded-xl py-2 pl-[15px] pr-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  <FcGoogle className="text-[18px] flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-600 ml-3">
                    <span className="inline-block w-12 text-left tracking-tight">G<span className="text-[13px]">oo</span>gle</span>
                    <span className="ml-1">{isLoading ? '로그인 중...' : '계정으로 로그인'}</span>
                  </span>
                </div>
                <FiChevronRight className="text-gray-400 text-lg flex-shrink-0" />
              </button>

              <button
                onClick={() => handleLogin('Kakao')}
                disabled={isLoading}
                className="w-[237px] flex items-center justify-between bg-[#FEE500] rounded-xl py-2 pl-[15px] pr-3 hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  <RiKakaoTalkFill className="text-[18px] text-gray-800 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-600 ml-3">
                    <span className="inline-block w-12 text-left tracking-[0.07em]">Kakao</span>
                    <span className="ml-[4.5px]">{isLoading ? '로그인 중...' : '계정으로 로그인'}</span>
                  </span>
                </div>
                <FiChevronRight className="text-gray-400 text-lg flex-shrink-0" />
              </button>

              <button
                onClick={() => {
                  alert('Apple 로그인은 Apple Developer 계정이 필요합니다.\n구글 또는 카카오 로그인을 이용해주세요.');
                }}
                disabled={true}
                className="w-[237px] flex items-center justify-between bg-gray-500 rounded-xl py-2 pl-[15px] pr-3 cursor-not-allowed opacity-50"
              >
                <div className="flex items-center">
                  <FaApple className="text-[18px] text-white flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-100 ml-3">
                    <span className="inline-block w-12 text-left tracking-[0.08em]">Apple</span>
                    <span className="ml-1">계정으로 로그인</span>
                  </span>
                </div>
                <FiChevronRight className="text-gray-400 text-lg flex-shrink-0" />
              </button>
              </div>

              
              
              <div className="mt-3 text-center">
                <button onClick={() => handleLogin('skip')} className="text-gray-400 text-xs py-2">
                  로그인 없이 둘러보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;