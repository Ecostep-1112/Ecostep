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
            {/* 지구본 - 상단과 구글 버튼 사이 중앙 */}
            <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <EarthStructure size={180} />
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
              <div className="w-full space-y-4">
              <button
                onClick={() => handleLogin('Google')}
                disabled={isLoading}
                className="w-full flex items-center justify-between bg-white/90 border border-gray-200 rounded-xl py-2.5 pl-5 pr-4 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <FcGoogle className="text-xl" />
                  <span className="text-sm font-medium text-gray-600">
                    {isLoading ? '로그인 중...' : '구글 계정으로 로그인'}
                  </span>
                </div>
                <FiChevronRight className="text-gray-400 text-lg" />
              </button>

              <button
                onClick={() => handleLogin('Kakao')}
                disabled={isLoading}
                className="w-full flex items-center justify-between bg-[#FEE500] rounded-xl py-2.5 pl-5 pr-4 hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <RiKakaoTalkFill className="text-xl text-gray-800" />
                  <span className="text-sm font-medium text-gray-800">
                    {isLoading ? '로그인 중...' : '카카오톡 계정으로 로그인'}
                  </span>
                </div>
                <FiChevronRight className="text-gray-600 text-lg" />
              </button>

              <button
                onClick={() => {
                  alert('Apple 로그인은 Apple Developer 계정이 필요합니다.\n구글 또는 카카오 로그인을 이용해주세요.');
                }}
                disabled={true}
                className="w-full flex items-center justify-between bg-gray-500 rounded-xl py-2.5 pl-5 pr-4 cursor-not-allowed opacity-50"
              >
                <div className="flex items-center gap-3">
                  <FaApple className="text-xl text-white" />
                  <span className="text-sm font-medium text-gray-100">
                    Apple 계정으로 로그인 (준비 중)
                  </span>
                </div>
                <FiChevronRight className="text-gray-400 text-lg" />
              </button>
              </div>

              
              
              <div className="mt-4 text-center">
                <button onClick={() => handleLogin('skip')} className="text-gray-400 text-xs">
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