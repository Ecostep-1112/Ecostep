import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Leaf, ArrowLeft, CheckCircle } from 'lucide-react';

const SignUp = ({ isDarkMode, onNavigateToLogin, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const placeholderColor = isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400';
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = '사용자 이름을 입력해주세요';
    } else if (formData.username.length < 2) {
      newErrors.username = '사용자 이름은 2자 이상이어야 합니다';
    }
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 다시 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '필수 약관에 동의해주세요';
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
      if (onSignUpSuccess) {
        onSignUpSuccess(formData);
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
  
  return (
    <div className={`min-h-screen ${bgColor} flex flex-col`}>
      {/* Header */}
      <div className="p-4">
        <button 
          onClick={onNavigateToLogin}
          className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors`}
        >
          <ArrowLeft className={`w-5 h-5 ${textColor}`} />
        </button>
      </div>
      
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <h1 className={`text-2xl font-bold ${textColor}`}>Ecostep 시작하기</h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
          지구를 위한 첫 걸음을 시작하세요
        </p>
      </div>
      
      {/* Sign Up Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              사용자 이름
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="홍길동"
                className={`w-full pl-10 pr-4 py-3 ${inputBg} border ${errors.username ? 'border-red-500' : borderColor} rounded-lg ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          
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
                placeholder="8자 이상 입력"
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
          
          {/* Confirm Password Field */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="비밀번호를 다시 입력"
                className={`w-full pl-10 pr-12 py-3 ${inputBg} border ${errors.confirmPassword ? 'border-red-500' : borderColor} rounded-lg ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* Terms and Conditions */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-0.5 mr-2 w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                [필수] 서비스 이용약관 및 개인정보 처리방침에 동의합니다
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-500 text-xs ml-6">{errors.agreeTerms}</p>
            )}
            
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeMarketing"
                checked={formData.agreeMarketing}
                onChange={handleInputChange}
                className="mt-0.5 mr-2 w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                [선택] 마케팅 정보 수신에 동의합니다
              </span>
            </label>
          </div>
          
          {/* Submit Button */}
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
                가입 중...
              </span>
            ) : (
              '회원가입'
            )}
          </button>
        </form>
        
        {/* Login Link */}
        <div className="text-center mt-6 pb-8">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            이미 계정이 있으신가요?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;