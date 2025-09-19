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
  const [isUpdating, setIsUpdating] = useState(false);

  // 컴포넌트 마운트 시 프로필 데이터 로드
  useEffect(() => {
    loadUserProfile();
  }, []);
  
  const loadUserProfile = async () => {
    try {
      const { profile, error } = await getUserProfile();
      if (profile && !error) {
        // localStorage에서 현재 값 확인
        const savedData = localStorage.getItem('profileData');
        const parsedData = savedData ? JSON.parse(savedData) : {};

        // 데이터베이스에서 가져온 user_id를 userId로 설정
        setProfileData(prev => {
          const newData = {
            ...prev,
            userId: parsedData.userId || prev.userId || profile.user_id || '',
            name: parsedData.name || prev.name || '',
            email: profile.email || prev.email || '',
            birthDate: parsedData.birthDate || prev.birthDate || '',
            phone: parsedData.phone || prev.phone || ''
          };
          // localStorage에 저장
          localStorage.setItem('profileData', JSON.stringify(newData));
          return newData;
        });
      }
    } catch (err) {
      console.error('프로필 로드 에러:', err);
    }
  };
  
  // 프로필 사진 상태 관리 - localStorage에서 초기값 로드
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || null;
  });

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setProfileImage(imageDataUrl);
        // localStorage에 저장
        localStorage.setItem('profileImage', imageDataUrl);
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
  const EditFieldScreen = ({ field, label, value, onSave, onClose, showToast }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [saveTimer, setSaveTimer] = useState(null);
    
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
    const [birthDateErrors, setBirthDateErrors] = useState({ year: false, month: false, day: false });
    
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
    
    // 생년월일 유효성 검사 (개별 필드)
    const validateBirthDate = () => {
      const errors = { year: false, month: false, day: false };
      let hasError = false;
      
      // 모두 비어있으면 OK
      if (!birthDateParts.year && !birthDateParts.month && !birthDateParts.day) {
        setBirthDateErrors(errors);
        return true;
      }
      
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작
      const currentDay = today.getDate();
      
      // 연도 검사
      if (birthDateParts.year) {
        const year = parseInt(convertYear(birthDateParts.year));
        if (isNaN(year) || year < 1900 || year > currentYear) {
          errors.year = true;
          hasError = true;
        }
      }
      
      // 월 검사
      if (birthDateParts.month) {
        const month = parseInt(birthDateParts.month);
        const year = parseInt(convertYear(birthDateParts.year)) || currentYear;
        
        if (isNaN(month) || month < 1 || month > 12) {
          errors.month = true;
          hasError = true;
        } else if (year === currentYear && month > currentMonth) {
          // 현재 년도인 경우, 현재 월보다 미래 월은 불가
          errors.month = true;
          hasError = true;
        }
      }
      
      // 일 검사
      if (birthDateParts.day) {
        const day = parseInt(birthDateParts.day);
        const month = parseInt(birthDateParts.month) || 1;
        const year = parseInt(convertYear(birthDateParts.year)) || currentYear;
        const daysInMonth = new Date(year, month, 0).getDate();
        
        if (isNaN(day) || day < 1 || day > daysInMonth) {
          errors.day = true;
          hasError = true;
        } else if (year === currentYear && month === currentMonth && day > currentDay) {
          // 현재 년월인 경우, 오늘보다 미래 일은 불가
          errors.day = true;
          hasError = true;
        }
      }
      
      // 전체 날짜가 오늘보다 미래인지 최종 확인
      if (birthDateParts.year && birthDateParts.month && birthDateParts.day && !hasError) {
        const inputDate = new Date(
          parseInt(convertYear(birthDateParts.year)),
          parseInt(birthDateParts.month) - 1,
          parseInt(birthDateParts.day)
        );
        
        if (inputDate > today) {
          // 입력 날짜가 오늘보다 미래인 경우
          if (parseInt(convertYear(birthDateParts.year)) > currentYear) {
            errors.year = true;
          } else if (parseInt(birthDateParts.month) > currentMonth) {
            errors.month = true;
          } else {
            errors.day = true;
          }
          hasError = true;
        }
      }
      
      setBirthDateErrors(errors);
      return !hasError;
    };
    
    const handleBirthDateSave = () => {
      // 유효성 검사
      if (!validateBirthDate()) {
        return;
      }
      
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
    
    // 휴대폰 번호 유효성 검사
    const validatePhoneNumber = (phone) => {
      const numbers = phone.replace(/[^0-9]/g, '');
      // 빈 값이거나 10~11자리 숫자
      return numbers === '' || (numbers.length >= 10 && numbers.length <= 11);
    };
    
    const handlePhoneSave = () => {
      if (!validatePhoneNumber(inputValue)) {
        setError('invalid');
        return;
      }
      const formatted = formatPhoneNumber(inputValue);
      onSave(formatted);
      onClose();
    };
    
    // 이름 유효성 검사
    const validateName = (name) => {
      if (!name || name.trim() === '') return false; // 빈 값은 허용 안 함
      return name.length <= 10;
    };
    
    // 맞춤법에 맞는 placeholder 설정
    const getPlaceholder = (field) => {
      switch(field) {
        case 'name': return '이름을 입력하세요 (1~10자)';
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
                  inputMode="numeric"
                  value={birthDateParts.year}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setBirthDateParts({...birthDateParts, year: value});
                    setBirthDateErrors({...birthDateErrors, year: false});
                  }}
                  placeholder="년도"
                  maxLength="4"
                  className={`w-full px-3 py-2 text-sm text-center ${textColor} bg-transparent rounded-lg border ${birthDateErrors.year ? 'border-red-500' : borderColor} focus:outline-none ${birthDateErrors.year ? 'focus:border-red-500' : 'focus:border-gray-400'} placeholder:text-gray-400`}
                  autoFocus
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={birthDateParts.month}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setBirthDateParts({...birthDateParts, month: value});
                    setBirthDateErrors({...birthDateErrors, month: false});
                  }}
                  placeholder="월"
                  maxLength="2"
                  className={`w-full px-3 py-2 text-sm text-center ${textColor} bg-transparent rounded-lg border ${birthDateErrors.month ? 'border-red-500' : borderColor} focus:outline-none ${birthDateErrors.month ? 'focus:border-red-500' : 'focus:border-gray-400'} placeholder:text-gray-400`}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={birthDateParts.day}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setBirthDateParts({...birthDateParts, day: value});
                    setBirthDateErrors({...birthDateErrors, day: false});
                  }}
                  placeholder="일"
                  maxLength="2"
                  className={`w-full px-3 py-2 text-sm text-center ${textColor} bg-transparent rounded-lg border ${birthDateErrors.day ? 'border-red-500' : borderColor} focus:outline-none ${birthDateErrors.day ? 'focus:border-red-500' : 'focus:border-gray-400'} placeholder:text-gray-400`}
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
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9-]/g, '');
                setInputValue(value);
                setError('');
              }}
              placeholder="휴대폰 번호를 입력하세요"
              className={`w-full px-4 py-2.5 text-sm ${textColor} bg-transparent rounded-lg border ${error ? 'border-red-500' : borderColor} focus:outline-none ${error ? 'focus:border-red-500' : 'focus:border-gray-400'}`}
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
    
    // 이메일 유효성 검사
    const validateEmail = (email) => {
      if (!email) return true; // 빈 값은 OK
      // 이메일 정규식: 기본적인 이메일 형식 검사
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };
    
    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
      return () => {
        if (saveTimer) {
          clearTimeout(saveTimer);
        }
      };
    }, [saveTimer]);

    // 아이디 저장 핸들러
    const handleUserIdSave = async () => {
      // 이미 처리 중이면 무시
      if (isLoading) {
        console.log('이미 저장 처리 중');
        return;
      }

      console.log('=== 아이디 저장 시작 ===');
      console.log('입력값:', inputValue);

      const trimmedValue = inputValue.trim();
      console.log('trim된 값:', trimmedValue);

      // 유효성 검사
      if (!trimmedValue) {
        console.log('빈 값으로 인한 에러');
        setError('invalid');
        if (showToast) {
          showToast('아이디를 입력해주세요.', 'error');
        }
        return;
      }

      // 아이디는 이미 입력 시점에 필터링되므로 길이만 체크
      if (trimmedValue.length < 1 || trimmedValue.length > 15) {
        console.log('길이 조건 미충족:', trimmedValue.length);
        setError('invalid');
        if (showToast) {
          showToast('아이디는 1~15자여야 합니다.', 'error');
        }
        return;
      }

      // 현재 값과 동일한지 체크
      if (trimmedValue === value) {
        console.log('기존 값과 동일함');
        onClose();
        return;
      }

      console.log('유효성 검사 통과, 저장 시도');
      setIsLoading(true);
      setError('');

      try {
        // 아이디 업데이트
        console.log('아이디 업데이트 시작');
        const { success, error: updateError, data } = await updateUserId(trimmedValue);
        console.log('업데이트 결과:', { success, error: updateError });

        if (success) {
          console.log('저장 성공');

          // 상태 업데이트
          onSave(trimmedValue);

          // localStorage 업데이트
          const savedData = localStorage.getItem('profileData');
          if (savedData) {
            const parsed = JSON.parse(savedData);
            parsed.userId = trimmedValue;
            localStorage.setItem('profileData', JSON.stringify(parsed));
            console.log('localStorage 업데이트 완료');
          }

          // 토스트 메시지 표시
          if (showToast) {
            showToast('아이디가 성공적으로 변경되었습니다.', 'success');
          }

          // 약간의 딜레이 후 화면 닫기
          setTimeout(() => {
            setIsLoading(false);
            onClose();
          }, 300);
        } else {
          console.error('아이디 업데이트 실패:', updateError);
          setIsLoading(false);
          setError('invalid');

          if (updateError === '이미 사용 중인 아이디입니다.') {
            if (showToast) {
              showToast('이미 사용 중인 아이디입니다.', 'error');
            }
          } else {
            if (showToast) {
              showToast('아이디 저장에 실패했습니다.', 'error');
            }
          }
        }
      } catch (err) {
        console.error('아이디 저장 중 오류:', err);
        setIsLoading(false);
        setError('invalid');
        if (showToast) {
          showToast('아이디 저장 중 오류가 발생했습니다.', 'error');
        }
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
              const value = e.target.value;

              // 아이디 필드
              if (field === 'userId') {
                // 영문, 숫자, 언더스코어만 허용
                const filtered = value.replace(/[^a-zA-Z0-9_]/g, '');
                const finalValue = filtered.slice(0, 15);
                setInputValue(finalValue);
                setError('');

                // 기존 타이머 취소
                if (saveTimer) {
                  clearTimeout(saveTimer);
                }
                return;
              }
              
              // 이름 필드 - 10자 제한
              if (field === 'name') {
                if (value.length <= 10) {
                  setInputValue(value);
                  setError('');
                }
                return;
              }
              
              // 기타 필드
              setInputValue(value);
              setError('');
            }}
            placeholder={getPlaceholder(field)}
            className={`w-full px-4 py-2.5 text-sm ${textColor} bg-transparent rounded-lg border ${error ? 'border-red-500' : borderColor} focus:outline-none ${error ? 'focus:border-red-500' : 'focus:border-gray-400'}`}
            autoFocus
            disabled={isLoading}
            maxLength={field === 'name' ? 10 : field === 'userId' ? 15 : undefined}
          />
          
          {field === 'userId' && (
            <p className={`text-xs ${secondaryText} mt-2 text-center`}>
              영문, 숫자, 언더스코어만 사용 가능 (1~15자)
            </p>
          )}
          
          <button
            onClick={async () => {
              // 버튼 중복 클릭 방지
              if (isLoading) return;

              if (field === 'userId') {
                await handleUserIdSave();
              } else if (field === 'email') {
                if (!validateEmail(inputValue)) {
                  setError('invalid');
                  return;
                }
                onSave(inputValue);
                onClose();
              } else if (field === 'name') {
                if (!validateName(inputValue)) {
                  setError('invalid');
                  return;
                }
                onSave(inputValue);
                onClose();
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
          showToast={(message, type) => {
            setToastMessage(message);
            setToastType(type);
            setShowToast(true);
          }}
        />
      )}
      
      {editingField === 'userId' && (
        <EditFieldScreen
          field="userId"
          label="아이디"
          value={profileData.userId}
          onSave={(value) => {
            setProfileData(prev => {
              const newData = {...prev, userId: value};
              localStorage.setItem('profileData', JSON.stringify(newData));
              return newData;
            });
          }}
          onClose={() => setEditingField(null)}
          showToast={(message, type) => {
            setToastMessage(message);
            setToastType(type);
            setShowToast(true);
          }}
        />
      )}
      
      {editingField === 'birthDate' && (
        <EditFieldScreen
          field="birthDate"
          label="생년월일"
          value={profileData.birthDate}
          onSave={(value) => setProfileData({...profileData, birthDate: value})}
          onClose={() => setEditingField(null)}
          showToast={(message, type) => {
            setToastMessage(message);
            setToastType(type);
            setShowToast(true);
          }}
        />
      )}
      
      {editingField === 'phone' && (
        <EditFieldScreen
          field="phone"
          label="휴대폰 번호"
          value={profileData.phone}
          onSave={(value) => setProfileData({...profileData, phone: value})}
          onClose={() => setEditingField(null)}
          showToast={(message, type) => {
            setToastMessage(message);
            setToastType(type);
            setShowToast(true);
          }}
        />
      )}
      
      {editingField === 'email' && (
        <EditFieldScreen
          field="email"
          label="이메일 주소"
          value={profileData.email}
          onSave={(value) => setProfileData({...profileData, email: value})}
          onClose={() => setEditingField(null)}
          showToast={(message, type) => {
            setToastMessage(message);
            setToastType(type);
            setShowToast(true);
          }}
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