import React, { useState } from 'react';
import { FiChevronRight, FiX, FiCamera, FiPlus } from 'react-icons/fi';

const ProfileScreen = ({ isDarkMode, setShowProfile, profileData, setProfileData }) => {
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const secondaryText = isDarkMode ? 'text-gray-500' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  
  // 각 필드의 수정 화면 표시 상태
  const [editingField, setEditingField] = useState(null);
  
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
              <FiX className={`w-4 h-4 ${textColor}`} />
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
              <FiX className={`w-4 h-4 ${textColor}`} />
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
    
    return (
      <div className={`absolute inset-0 z-50 ${bgColor}`}>
        <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
          <button onClick={onClose} className="mr-3">
            <FiX className={`w-4 h-4 ${textColor}`} />
          </button>
          <h2 className={`text-sm font-medium ${textColor}`}>{label}</h2>
        </div>
        
        <div className="p-4 max-w-md mx-auto">
          <input
            type={field === 'email' ? 'email' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getPlaceholder(field)}
            className={`w-full px-4 py-2.5 text-sm ${textColor} bg-transparent rounded-lg border ${borderColor} focus:outline-none focus:border-gray-400`}
            autoFocus
          />
          
          <button
            onClick={() => {
              onSave(inputValue);
              onClose();
            }}
            className="w-full mt-4 py-2.5 text-sm text-white rounded-lg font-medium bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:opacity-90 transition-opacity"
          >
            저장
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
    </div>
  );
};

export default ProfileScreen;