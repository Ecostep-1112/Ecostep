import React, { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FiChevronRight } from 'react-icons/fi';
import { signInWithGoogle, signInWithKakao, signInWithApple } from '../lib/auth';

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
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center px-6 py-8 relative">
            {/* 상단에서 내려오는 구불구불한 선과 박스 */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 327 812" preserveAspectRatio="xMidYMid meet">
                {/* 위에서 내려오는 구불구불한 선 - 원과 연결 */}
                <path 
                  d="M 163.5 0 Q 158 40, 166 80 T 161 140 Q 168 160, 163.5 180 T 163.5 195" 
                  stroke="white" 
                  strokeWidth="0.5" 
                  fill="none"
                  opacity="0.8"
                />
                
                {/* 구불구불한 완전 원형 박스 - 화면 중앙 정렬 */}
                <path 
                  d="M 163.5 195 Q 143 197, 123 207 T 98 232 Q 93 252, 95 272 T 105 307 Q 118 327, 138 335 T 173 340 Q 193 337, 213 327 T 238 302 Q 243 282, 241 262 T 229 227 Q 216 207, 196 199 T 163 193 Q 165 194, 163.5 195 Z" 
                  stroke="white" 
                  strokeWidth="0.5" 
                  fill="none"
                  opacity="0.8"
                />
                
                {/* Ecostep 텍스트 - 화면 중앙 정렬 */}
                <text x="163.5" y="270" 
                  fontFamily="Brush Script MT, cursive" 
                  fontSize="48" 
                  fill="#374151"
                  textAnchor="middle"
                  dominantBaseline="middle">
                  Ecostep
                </text>
              </svg>
            </div>
            
            {/* 에러 메시지 */}
            {error && (
              <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {/* 로그인 버튼들 */}
            <div className="w-full space-y-4 mt-auto mb-40">
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

            {/* 이메일 로그인 옵션 */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => alert('이메일 로그인은 추후 추가 예정입니다.')}
                className="text-gray-500 text-xs underline"
              >
                이메일로 로그인
              </button>
            </div>
            
            <div className="mt-4">
              <button onClick={() => handleLogin('skip')} className="text-gray-400 text-xs">
                로그인 없이 둘러보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;