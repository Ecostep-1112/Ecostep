import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Leaf, MessageCircle, Github } from 'lucide-react';

const Login = ({ isDarkMode, onNavigateToSignUp, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const placeholderColor = isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400';
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(formData);
      }
    }, 1500);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic here
  };
  
  return (
    <div className={`min-h-screen ${bgColor} flex flex-col`}>
      {/* Logo and Welcome */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <Leaf className="w-12 h-12 text-white" />
        </div>
        <h1 className={`text-3xl font-bold ${textColor} mb-2`}>다시 만나서 반가워요!</h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Ecostep과 함께 지구를 지켜요
        </p>
      </div>
      
      {/* Login Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              이메일
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className={`w-full pl-10 pr-4 py-3 ${inputBg} border ${errors.email ? 'border-red-500' : borderColor} rounded-lg ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              비밀번호
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호 입력"
                className={`w-full pl-10 pr-12 py-3 ${inputBg} border ${errors.password ? 'border-red-500' : borderColor} rounded-lg ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                로그인 상태 유지
              </span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              비밀번호 찾기
            </button>
          </div>
          
          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>
        
        {/* Divider */}
        <div className="relative my-6">
          <div className={`absolute inset-0 flex items-center`}>
            <div className={`w-full border-t ${borderColor}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${bgColor} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              또는
            </span>
          </div>
        </div>
        
        {/* Social Login */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            카카오로 시작하기
          </button>
          
          <button
            onClick={() => handleSocialLogin('google')}
            className={`w-full py-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${borderColor} rounded-lg font-medium transition-colors flex items-center justify-center ${textColor}`}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 시작하기
          </button>
          
          <button
            onClick={() => handleSocialLogin('github')}
            className={`w-full py-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-lg font-medium transition-colors flex items-center justify-center`}
          >
            <Github className="w-5 h-5 mr-2" />
            GitHub로 시작하기
          </button>
        </div>
        
        {/* Sign Up Link */}
        <div className="text-center mt-8 pb-8">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            아직 계정이 없으신가요?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;