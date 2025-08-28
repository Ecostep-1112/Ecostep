import React from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FiChevronRight } from 'react-icons/fi';

function Login({ onLogin }) {
  const handleLogin = (provider) => {
    console.log(`${provider} 로그인 시도`);
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-full max-w-[375px] h-[812px] bg-gray-900 rounded-[2.5rem] p-[3px] shadow-2xl">
        <div className="w-full h-full bg-black rounded-[2.3rem] p-[8px]">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center px-6 py-8">
            <h1 className="text-5xl text-center mb-20 text-gray-700" style={{ fontFamily: 'Brush Script MT, cursive' }}>Ecostep</h1>
            
            <div className="w-full space-y-4">
              <button
                onClick={() => handleLogin('Google')}
                className="w-full flex items-center justify-between bg-white/90 border border-gray-200 rounded-xl py-2.5 pl-5 pr-4 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FcGoogle className="text-xl" />
                  <span className="text-sm font-medium text-gray-600">구글 계정으로 로그인</span>
                </div>
                <FiChevronRight className="text-gray-400 text-lg" />
              </button>

              <button
                onClick={() => handleLogin('Kakao')}
                className="w-full flex items-center justify-between bg-[#FEE500] rounded-xl py-2.5 pl-5 pr-4 hover:bg-[#FDD835] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <RiKakaoTalkFill className="text-xl text-gray-800" />
                  <span className="text-sm font-medium text-gray-800">카카오톡 계정으로 로그인</span>
                </div>
                <FiChevronRight className="text-gray-600 text-lg" />
              </button>

              <button
                onClick={() => handleLogin('Apple')}
                className="w-full flex items-center justify-between bg-gray-900 rounded-xl py-2.5 pl-5 pr-4 hover:bg-black transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaApple className="text-xl text-white" />
                  <span className="text-sm font-medium text-gray-100">Apple 계정으로 로그인</span>
                </div>
                <FiChevronRight className="text-gray-400 text-lg" />
              </button>
            </div>

            <div className="mt-12">
              <button onClick={() => handleLogin('skip')} className="text-gray-400 text-sm"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;