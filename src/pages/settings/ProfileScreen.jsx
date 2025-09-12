import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronLeft, FiX, FiCamera, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import { getUserProfile, updateUserId, deleteAccount } from '../../lib/auth';
import Toast from '../../components/Toast';

const ProfileScreen = ({ isDarkMode, setShowProfile, profileData, setProfileData }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const secondaryText = isDarkMode ? 'text-gray-500' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  
  // 각 필드의 수정 화면 표시 상태
  const [editingField, setEditingField] = useState(null);
  
  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  const loadUserProfile = async () => {
    const { profile, error } = await getUserProfile();
    if (profile && !error) {
      // 데이터베이스에서 가져온 user_id를 userId로 설정 (기존 값이 없을 때만)
      setProfileData(prev => ({
        ...prev,
        userId: prev.userId || profile.user_id || '', // 기존 userId가 있으면 유지
        name: prev.name || '', // name은 로컬 상태 유지
        email: profile.email || prev.email || '',
        birthDate: prev.birthDate || '',
        phone: prev.phone || ''
      }));
    }
  };
  
  // 프로필 사진 상태 관리
  const [profileImage, setProfileImage] = useState(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 휴대폰 번호 포맷팅 함수
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');
    
    // 010이 없으면 추가
    let formatted = numbers;
    if (!formatted.startsWith('010')) {
      formatted = '010' + formatted;
    }
    
    // 11자리가 되도록 조정 (010 + 8자리)
    if (formatted.length === 11) {
      return formatted.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (formatted.length === 10) {
      // 010 + 7자리인 경우 (잘못된 입력)
      return formatted.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    
    return phone; // 포맷팅 불가능한 경우 원본 반환
  };

  // 각 필드별 수정 화면 컴포넌트
  const EditFieldScreen = ({ field, label, value, onSave, onClose }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // 생년월일 필드용 상태
    const parseBirthDate = (dateStr) => {
      if (!dateStr) return { year: '', month: '', day: '' };
      const parts = dateStr.split('.');
      return {
        year: parts[0] || '',
        month: parts[1] || '',
        day: parts[2] || ''
      };
    };
    
    const [birthDateParts, setBirthDateParts] = useState(parseBirthDate(value));
    
    // 연도 자동 변환 함수
    const convertYear = (year) => {
      if (!year) return '';
      const yearNum = parseInt(year);
      if (yearNum < 100) {
        // 00-29는 2000년대, 30-99는 1900년대로 변환
        if (yearNum <= 29) {
          return `20${year.padStart(2, '0')}`;
        } else {
          return `19${year}`;
        }
      }
      return year;
    };
    
    const handleBirthDateSave = () => {
      // 모든 필드가 입력되었는지 확인
      if (!birthDateParts.year || !birthDateParts.month || !birthDateParts.day) {
        onSave(''); // 빈 값으로 저장
      } else {
        const fullYear = convertYear(birthDateParts.year);
        const formattedDate = `${fullYear}.${birthDateParts.month.padStart(2, '0')}.${birthDateParts.day.padStart(2, '0')}`;
        onSave(formattedDate);
      }
      onClose();
    };
    
    const handlePhoneSave = () => {
      const formatted = formatPhoneNumber(inputValue);
      onSave(formatted);
      onClose();
    };
    
    // 맞춤법에 맞는 placeholder 설정
    const getPlaceholder = (field) => {
      switch(field) {
        case 'name': return '이름을 입력하세요';
        case 'userId': return '아이디를 입력하세요';
        case 'email': return '이메일 주소를 입력하세요';
        case 'phone': return '휴대폰 번호를 입력하세요';
        default: return `${label}을(를) 입력하세요`;
      }
    };
    
    if (field === 'birthDate') {
      return (
        <div className={`absolute inset-0 z-50 ${bgColor}`}>
          <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
            <button onClick={onClose} className="mr-3">
              <FiChevronLeft className={`w-4 h-4 ${textColor}`} />
            </button>
            <h2 className={`text-sm font-medium ${textColor}`}>{label}</h2>
          </div>
          
          <div className="p-4 max-w-md mx-auto">
            <div className="flex gap-2 justify-center mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={birthDateParts.year}
                  onChange={(e) => setBirthDateParts({...birthDateParts, year: e.target.value})}
                  placeholder="년도"
                  maxLength="4"
                  className={`w-full px-3 py-2 text-sm text-center ${textColor} bg-transparent rounded-lg border ${borderColor} focus:outline-none focus:border-gray-400 placeholder:text-gray-400`}
                  autoFocus
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={birthDateParts.month}
                  onChange={(e) => setBirthDateParts({...birthDateParts, month: e.target.value})}
                  placeholder="월"
                  maxLength="2"
                  className={`w-full px-3 py-2 text-sm text-center ${textColor} bg-transparent rounded-lg border ${borderColor} focus:outline-none focus:border-gray-400 placeholder:text-gray-400`}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={birthDateParts.day}
                  onChange={(e) => setBirthDateParts({...birthDateParts, day: e.target.value})}
                  placeholder="일"
                  maxLength="2"
                  className={`w-full px-3 py-2 text-sm text-center ${textColor} bg-transparent rounded-lg border ${borderColor} focus:outline-none focus:border-gray-400 placeholder:text-gray-400`}
                />
              </div>
            </div>
            
            <button
              onClick={handleBirthDateSave}
              className="w-full py-2.5 text-sm text-white rounded-lg font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:opacity-90 transition-opacity"
            >
              저장
            </button>
          </div>
        </div>
      );
    }
    
    if (field === 'phone') {
      return (
        <div className={`absolute inset-0 z-50 ${bgColor}`}>
          <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
            <button onClick={onClose} className="mr-3">
              <FiChevronLeft className={`w-4 h-4 ${textColor}`} />
            </button>
            <h2 className={`text-sm font-medium ${textColor}`}>{label}</h2>
          </div>
          
          <div className="p-4 max-w-md mx-auto">
            <input
              type="tel"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="휴대폰 번호를 입력하세요"
              className={`w-full px-4 py-2.5 text-sm ${textColor} bg-transparent rounded-lg border ${borderColor} focus:outline-none focus:border-gray-400`}
              autoFocus
            />
            
            <button
              onClick={handlePhoneSave}
              className="w-full mt-4 py-2.5 text-sm text-white rounded-lg font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:opacity-90 transition-opacity"
            >
              저장
            </button>
          </div>
        </div>
      );
    }
    
    // 아이디 저장 핸들러
    const handleUserIdSave = async () => {
      if (!inputValue.trim()) {
        setError('invalid');
        return;
      }
      
      // 아이디 유효성 검사 (1~15글자, 영문/숫자/언더스코어만 허용)
      const idRegex = /^[a-zA-Z0-9_]{1,15}$/;
      if (!idRegex.test(inputValue)) {
        setError('invalid');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      const { success, error } = await updateUserId(inputValue);
      
      setIsLoading(false);
      
      if (success) {
        onSave(inputValue);
        
        // localStorage에도 업데이트
        const savedData = localStorage.getItem('profileData');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          parsed.userId = inputValue;
          localStorage.setItem('profileData', JSON.stringify(parsed));
        }
        
        onClose();
        setToastMessage('아이디가 성공적으로 변경되었습니다.');
        setToastType('success');
        setShowToast(true);
      } else {
        setError('invalid');
      }
    };
    
    return (
      <div className={`absolute inset-0 z-50 ${bgColor}`}>
        <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
          <button onClick={onClose} className="mr-3">
            <FiChevronLeft className={`w-4 h-4 ${textColor}`} />
          </button>
          <h2 className={`text-sm font-medium ${textColor}`}>{label}</h2>
        </div>
        
        <div className="p-4 max-w-md mx-auto">
          <input
            type={field === 'email' ? 'email' : 'text'}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            placeholder={getPlaceholder(field)}
            className={`w-full px-4 py-2.5 text-sm ${textColor} bg-transparent rounded-lg border ${error ? 'border-red-500' : borderColor} focus:outline-none focus:border-gray-400`}
            autoFocus
            disabled={isLoading}
          />
          
          {field === 'userId' && (
            <p className={`text-xs ${secondaryText} mt-2 text-center`}>
              영문, 숫자, 언더스코어만 사용 가능 (1~15자)
            </p>
          )}
          
          <button
            onClick={() => {
              if (field === 'userId') {
                handleUserIdSave();
              } else {
                onSave(inputValue);
                onClose();
              }
            }}
            disabled={isLoading}
            className={`w-full mt-4 py-2.5 text-sm text-white rounded-lg font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:opacity-90 transition-opacity ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-1 ${bgColor} relative`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowProfile(false)} className="mr-3">
          <FiChevronRight className={`w-4 h-4 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-sm font-medium ${textColor}`}>프로필</h2>
      </div>
      
      {/* 프로필 사진 업로드 섹션 */}
      <div className="p-4">
        <div className="flex justify-center mb-6">
          <label htmlFor="profile-upload" className="cursor-pointer relative">
            <div className={`w-20 h-20 ${cardBg} rounded-full flex items-center justify-center border-2 ${borderColor} overflow-hidden`}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiCamera className={`w-6 h-6 ${secondaryText}`} />
              )}
            </div>
            {/* 플러스 아이콘을 안쪽으로 이동하고 크기 축소 */}
            <div className={`absolute bottom-1 right-1 w-5 h-5 ${isDarkMode ? 'bg-white' : 'bg-gray-800'} rounded-full flex items-center justify-center`}>
              <FiPlus className={`w-2.5 h-2.5 ${isDarkMode ? 'text-gray-800' : 'text-white'}`} />
            </div>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        
        {/* 필드 영역 배경 박스 */}
        <div className={`${cardBg} rounded-xl border ${borderColor} overflow-hidden`}>
          {/* 이름 필드 */}
          <button
            onClick={() => setEditingField('name')}
            className={`w-full px-4 py-3 flex items-center justify-between`}
          >
            <span className={`${textColor} text-sm`}>이름</span>
            <div className="flex items-center">
              <span className={`${secondaryText} text-sm mr-2`}>
                {profileData.name || '없음'}
              </span>
              <FiChevronRight className={`w-4 h-4 ${secondaryText}`} />
            </div>
          </button>

          <div className={`mx-4 border-t ${borderColor}`}></div>
          
          {/* 아이디 필드 */}
          <button
            onClick={() => setEditingField('userId')}
            className={`w-full px-4 py-3 flex items-center justify-between`}
          >
            <span className={`${textColor} text-sm`}>아이디</span>
            <div className="flex items-center">
              <span className={`${secondaryText} text-sm mr-2`}>
                {profileData.userId || '없음'}
              </span>
              <FiChevronRight className={`w-4 h-4 ${secondaryText}`} />
            </div>
          </button>

          <div className={`mx-4 border-t ${borderColor}`}></div>
          
          {/* 생년월일 필드 */}
          <button
            onClick={() => setEditingField('birthDate')}
            className={`w-full px-4 py-3 flex items-center justify-between`}
          >
            <span className={`${textColor} text-sm`}>생년월일</span>
            <div className="flex items-center">
              <span className={`${secondaryText} text-sm mr-2`}>
                {profileData.birthDate || '없음'}
              </span>
              <FiChevronRight className={`w-4 h-4 ${secondaryText}`} />
            </div>
          </button>

          <div className={`mx-4 border-t ${borderColor}`}></div>
          
          {/* 휴대폰 번호 필드 */}
          <button
            onClick={() => setEditingField('phone')}
            className={`w-full px-4 py-3 flex items-center justify-between`}
          >
            <span className={`${textColor} text-sm`}>휴대폰 번호</span>
            <div className="flex items-center">
              <span className={`${secondaryText} text-sm mr-2`}>
                {profileData.phone || '없음'}
              </span>
              <FiChevronRight className={`w-4 h-4 ${secondaryText}`} />
            </div>
          </button>

          <div className={`mx-4 border-t ${borderColor}`}></div>
          
          {/* 이메일 주소 필드 */}
          <button
            onClick={() => setEditingField('email')}
            className={`w-full px-4 py-3 flex items-center justify-between`}
          >
            <span className={`${textColor} text-sm`}>이메일 주소</span>
            <div className="flex items-center">
              <span className={`${secondaryText} text-sm mr-2`}>
                {profileData.email || '없음'}
              </span>
              <FiChevronRight className={`w-4 h-4 ${secondaryText}`} />
            </div>
          </button>
        </div>
      </div>

      {/* 각 필드별 수정 화면 */}
      {editingField === 'name' && (
        <EditFieldScreen
          field="name"
          label="이름"
          value={profileData.name}
          onSave={(value) => setProfileData({...profileData, name: value})}
          onClose={() => setEditingField(null)}
        />
      )}
      
      {editingField === 'userId' && (
        <EditFieldScreen
          field="userId"
          label="아이디"
          value={profileData.userId}
          onSave={(value) => setProfileData({...profileData, userId: value})}
          onClose={() => setEditingField(null)}
        />
      )}
      
      {editingField === 'birthDate' && (
        <EditFieldScreen
          field="birthDate"
          label="생년월일"
          value={profileData.birthDate}
          onSave={(value) => setProfileData({...profileData, birthDate: value})}
          onClose={() => setEditingField(null)}
        />
      )}
      
      {editingField === 'phone' && (
        <EditFieldScreen
          field="phone"
          label="휴대폰 번호"
          value={profileData.phone}
          onSave={(value) => setProfileData({...profileData, phone: value})}
          onClose={() => setEditingField(null)}
        />
      )}
      
      {editingField === 'email' && (
        <EditFieldScreen
          field="email"
          label="이메일 주소"
          value={profileData.email}
          onSave={(value) => setProfileData({...profileData, email: value})}
          onClose={() => setEditingField(null)}
        />
      )}
      
      {/* 계정 탈퇴 버튼 */}
      <div className="absolute bottom-8 left-4 right-4">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className={`w-full py-2.5 text-sm font-medium text-red-500 rounded-lg border border-red-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-red-50 transition-colors`}
        >
          계정 탈퇴
        </button>
      </div>
      
      {/* 탈퇴 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`mx-4 w-full max-w-xs ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-5 shadow-xl`}>
            <h3 className={`text-lg font-semibold text-center mb-3 ${textColor}`}>
              정말 탈퇴하시겠습니까?
            </h3>
            
            <p className={`text-xs text-center mb-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              계정을 탈퇴하시면 모든 데이터가<br />
              영구적으로 삭제되며, 복구할 수 없습니다.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border ${borderColor} ${textColor} hover:bg-gray-50 transition-colors`}
              >
                아니요
              </button>
              <button
                onClick={async () => {
                  try {
                    // 계정 삭제 실행
                    const { success, error } = await deleteAccount();
                    
                    if (success) {
                      // 성공 시 페이지 새로고침 (로그인 화면으로 이동)
                      window.location.reload();
                    } else {
                      throw new Error(error);
                    }
                  } catch (error) {
                    console.error('계정 탈퇴 실패:', error);
                    setToastMessage('계정 탈퇴에 실패했습니다.');
                    setToastType('error');
                    setShowToast(true);
                    setShowDeleteConfirm(false);
                  }
                }}
                className="flex-1 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                네, 탈퇴합니다
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ProfileScreen;