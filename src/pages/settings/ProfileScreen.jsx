import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Camera, Plus, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { updateUserFId, checkUserFIdDuplicate, deleteAccount } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import Toast from '../../components/Toast';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

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

  // 프로필 데이터는 부모 컴포넌트(App.jsx)에서 이미 Supabase로부터 로드되어 전달됨
  // 여기서 다시 로드하면 덮어쓰기 문제가 발생하므로 제거

  // 프로필 사진은 profileData에서 가져옴 (DB에서 로드됨)
  const profileImage = profileData?.profileImage || null;

  // 이미지 삭제 핸들러
  const handleImageDelete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('사용자 인증 정보가 없습니다.');
        setToastMessage('로그인이 필요합니다.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      // 현재 이미지 URL에서 파일 경로 추출
      if (profileImage) {
        try {
          // URL 디코딩 및 파싱
          const imageUrl = profileImage.includes('%2F') ? decodeURIComponent(profileImage) : profileImage;

          // 여러 URL 패턴 시도
          // 패턴 1: /Profile_pic/user_id/file.jpg
          // 패턴 2: /public/Profile_pic/user_id/file.jpg
          // 패턴 3: user_id/file.jpg (이미 경로만 있는 경우)
          let filePath = null;

          // Profile_pic 이후의 경로 추출
          const match1 = imageUrl.match(/Profile_pic\/(.+?)(?:\?|$)/);
          if (match1 && match1[1]) {
            filePath = match1[1];
          }

          // 경로를 찾지 못했다면, 전체 URL에서 파일명 패턴 찾기
          if (!filePath) {
            const match2 = imageUrl.match(/([a-f0-9-]+\/\d+\.\w+)$/);
            if (match2 && match2[1]) {
              filePath = match2[1];
            }
          }

          if (filePath) {

            // Storage에서 삭제
            const { data: deleteData, error: deleteError } = await supabase.storage
              .from('Profile_pic')
              .remove([filePath]);

            if (deleteError) {
              console.error('Storage 삭제 실패:', deleteError);
              console.error('Error details:', JSON.stringify(deleteError));
              // 404 에러는 파일이 이미 없는 것이므로 무시
              if (deleteError.statusCode !== '404') {
                console.warn('파일 삭제에 실패했지만 계속 진행합니다.');
              }
            } else {
            }
          } else {
            console.warn('파일 경로를 추출할 수 없습니다. DB만 업데이트합니다.');
            console.warn('URL:', imageUrl);
          }
        } catch (urlError) {
          console.error('URL 파싱 에러:', urlError);
          console.warn('파일 삭제를 건너뛰고 DB만 업데이트합니다.');
        }
      }

      // DB에서 URL 제거
      const { error: dbError } = await supabase
        .from('user_info')
        .update({ profile_image_url: null })
        .eq('user_id', user.id);

      if (dbError) {
        console.error('DB 업데이트 실패:', dbError);
        setToastMessage('삭제 중 오류가 발생했습니다.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      // 로컬 상태 업데이트
      setProfileData(prev => {
        const updated = {
          ...prev,
          profileImage: null
        };
        // localStorage 즉시 업데이트
        localStorage.setItem('profileData', JSON.stringify(updated));
        return updated;
      });

      setToastMessage('프로필 이미지가 삭제되었습니다.');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('프로필 이미지 삭제 에러:', error);
      setToastMessage('삭제 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    }
  };

  // 네이티브 갤러리에서 이미지 선택 (카메라 없이 갤러리만)
  const handleNativeImagePick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('사용자 인증 정보가 없습니다.');
        setToastMessage('로그인이 필요합니다.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      // iPad 여부 확인
      const isIPad = /iPad/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      // 카메라 플러그인 사용 가능 여부 확인
      const platform = Capacitor.getPlatform();
      if (platform !== 'ios' && platform !== 'android') {
        document.getElementById('profile-upload')?.click();
        return;
      }

      let image;
      try {
        // 갤러리에서만 이미지 선택 (카메라 옵션 없음)
        image = await CapacitorCamera.getPhoto({
          quality: 90,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos, // 갤러리에서만 선택 (카메라 X)
          width: 800,
          height: 800,
          correctOrientation: true,
          presentationStyle: isIPad ? 'popover' : 'fullscreen', // iPad에서 popover 사용
          promptLabelHeader: '사진 선택',
          promptLabelPhoto: '갤러리에서 선택',
          promptLabelPicture: '갤러리에서 선택'
        });
      } catch (cameraError) {
        // 카메라 플러그인 에러 처리 (카메라 접근 시도 시 크래시 방지)
        console.error('카메라 플러그인 에러:', cameraError);

        // 사용자 취소가 아닌 경우에만 fallback
        if (cameraError.message?.includes('cancelled') ||
            cameraError.message?.includes('canceled') ||
            cameraError.message?.includes('User cancelled') ||
            cameraError.message?.includes('dismiss')) {
          return;
        }

        // 플러그인 에러 시 웹 파일 선택기로 fallback
        document.getElementById('profile-upload')?.click();
        return;
      }

      if (!image || !image.webPath) {
        return;
      }


      // 미리보기 표시
      setProfileData(prev => ({
        ...prev,
        profileImage: image.webPath
      }));

      // 이미지를 Blob으로 변환하여 업로드
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      // 파일 크기 체크 (5MB 제한)
      if (blob.size > 5 * 1024 * 1024) {
        console.error('파일 크기가 너무 큽니다:', blob.size);
        setToastMessage('이미지 크기는 5MB 이하여야 합니다.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      const fileExt = image.format || 'jpeg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Supabase Storage에 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Profile_pic')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: `image/${fileExt}`
        });

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError);
        setToastMessage(`업로드 실패: ${uploadError.message}`);
        setToastType('error');
        setShowToast(true);
        return;
      }


      // 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('Profile_pic')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // DB에 URL 저장
      const { error: dbError } = await supabase
        .from('user_info')
        .update({ profile_image_url: publicUrl })
        .eq('user_id', user.id);

      if (dbError) {
        console.error('DB 저장 실패:', dbError);
        setToastMessage('DB 저장에 실패했습니다.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      // profileData 업데이트
      setProfileData(prev => {
        const updated = { ...prev, profileImage: publicUrl };
        localStorage.setItem('profileData', JSON.stringify(updated));
        return updated;
      });

      setToastMessage('프로필 이미지가 업데이트되었습니다.');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      // 사용자가 취소한 경우
      if (error.message?.includes('cancelled') || error.message?.includes('canceled') ||
          error.message?.includes('User cancelled') || error.message?.includes('dismiss')) {
        return;
      }

      // 카메라 관련 에러 (iPad에서 발생 가능)
      if (error.message?.includes('camera') || error.message?.includes('Camera') ||
          error.message?.includes('photo') || error.message?.includes('Photo')) {
        console.error('카메라/사진 관련 에러:', error);
        setToastMessage('갤러리에서 사진을 선택해주세요.');
        setToastType('warning');
        setShowToast(true);
        return;
      }

      // 권한 관련 에러
      if (error.message?.includes('permission') || error.message?.includes('Permission') ||
          error.message?.includes('denied') || error.message?.includes('Denied')) {
        console.error('권한 에러:', error);
        setToastMessage('사진 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.');
        setToastType('error');
        setShowToast(true);
        return;
      }

      console.error('프로필 이미지 선택 에러:', error);
      setToastMessage('이미지 선택 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    }
  };

  // 웹용 이미지 업로드 핸들러
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('사용자 인증 정보가 없습니다.');
          setToastMessage('로그인이 필요합니다.');
          setToastType('error');
          setShowToast(true);
          return;
        }

        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          console.error('파일 크기가 너무 큽니다:', file.size);
          setToastMessage('이미지 크기는 5MB 이하여야 합니다.');
          setToastType('error');
          setShowToast(true);
          return;
        }

        // 파일 확장자 추출
        const fileExt = file.name.split('.').pop().toLowerCase();
        // 이미지 파일 형식 체크
        const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!allowedTypes.includes(fileExt)) {
          console.error('지원하지 않는 파일 형식:', fileExt);
          setToastMessage('JPG, PNG, GIF, WEBP 형식만 지원합니다.');
          setToastType('error');
          setShowToast(true);
          return;
        }

        // 고유한 파일명 생성 (user_id/timestamp)
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // 먼저 로컬 미리보기 표시 (즉시 피드백)
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileData(prev => ({
            ...prev,
            profileImage: reader.result
          }));
        };
        reader.readAsDataURL(file);

        // Supabase Storage에 업로드
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('Profile_pic')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('이미지 업로드 실패:', uploadError);
          console.error('Error details:', JSON.stringify(uploadError));
          setToastMessage(`업로드 실패: ${uploadError.message}`);
          setToastType('error');
          setShowToast(true);
          return;
        }


        // 업로드된 이미지의 공개 URL 가져오기
        const { data: urlData } = supabase.storage
          .from('Profile_pic')
          .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        // DB에 URL 저장
        const { error: dbError } = await supabase
          .from('user_info')
          .update({ profile_image_url: publicUrl })
          .eq('user_id', user.id);

        if (dbError) {
          console.error('DB 저장 실패:', dbError);
          setToastMessage('DB 저장에 실패했습니다.');
          setToastType('error');
          setShowToast(true);
          return;
        }

        // profileData 업데이트 (실제 URL로 교체) + localStorage 즉시 업데이트
        setProfileData(prev => {
          const updated = {
            ...prev,
            profileImage: publicUrl
          };
          // localStorage 즉시 업데이트
          localStorage.setItem('profileData', JSON.stringify(updated));
          return updated;
        });

        setToastMessage('프로필 이미지가 업데이트되었습니다.');
        setToastType('success');
        setShowToast(true);
      } catch (error) {
        console.error('프로필 이미지 업로드 에러:', error);
        setToastMessage('업로드 중 오류가 발생했습니다.');
        setToastType('error');
        setShowToast(true);
      }
    }
  };

  // 플랫폼에 따라 적절한 이미지 선택 방법 사용
  const handleProfileImageClick = () => {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios' || platform === 'android') {
      // 네이티브: Capacitor Camera 사용 (갤러리만)
      handleNativeImagePick();
    } else {
      // 웹: 파일 input 클릭
      document.getElementById('profile-upload')?.click();
    }
  };

  // 휴대폰 번호 포맷팅 함수 (입력 중 실시간 포맷팅)
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');

    // 최대 11자리까지만 허용
    const limitedNumbers = numbers.slice(0, 11);

    // XXX-XXXX-XXXX 형식으로 포맷팅
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
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
      // 빈 값이거나 정확히 10~11자리 숫자
      return numbers === '' || (numbers.length >= 10 && numbers.length <= 11);
    };

    const handlePhoneSave = () => {
      const numbers = inputValue.replace(/[^0-9]/g, '');

      // 빈 값은 허용
      if (numbers === '') {
        onSave('');
        onClose();
        return;
      }

      // 10~11자리가 아니면 에러
      if (numbers.length < 10 || numbers.length > 11) {
        setError('invalid');
        return;
      }

      onSave(inputValue); // 이미 포맷팅된 값 저장
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
              <ChevronLeft className={`w-4 h-4 ${textColor}`} />
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
              <ChevronLeft className={`w-4 h-4 ${textColor}`} />
            </button>
            <h2 className={`text-sm font-medium ${textColor}`}>{label}</h2>
          </div>
          
          <div className="p-4 max-w-md mx-auto">
            <input
              type="tel"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                // 숫자만 추출하고 자동 포맷팅
                const formatted = formatPhoneNumber(value);
                setInputValue(formatted);
                setError('');
              }}
              placeholder="010-0000-0000"
              maxLength="13"
              className={`w-full px-4 py-2.5 text-sm ${textColor} bg-transparent rounded-lg border ${error ? 'border-red-500' : borderColor} focus:outline-none ${error ? 'focus:border-red-500' : 'focus:border-gray-400'}`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 mt-2 text-center">
                10~11자리 숫자를 입력해주세요
              </p>
            )}
            
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
        return;
      }


      const trimmedValue = inputValue.trim();

      // 유효성 검사
      if (!trimmedValue) {
        setError('invalid');
        if (showToast) {
          showToast('아이디를 입력해주세요.', 'error');
        }
        return;
      }

      // 아이디는 이미 입력 시점에 필터링되므로 길이만 체크
      if (trimmedValue.length < 1 || trimmedValue.length > 15) {
        setError('invalid');
        if (showToast) {
          showToast('아이디는 1~15자여야 합니다.', 'error');
        }
        return;
      }

      // 현재 값과 동일한지 체크
      if (trimmedValue === value) {
        onClose();
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // 아이디 업데이트
        const { success, error: updateError, data } = await updateUserFId(trimmedValue);

        if (success) {

          // 상태 업데이트
          onSave(trimmedValue);

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
            <ChevronLeft className={`w-4 h-4 ${textColor}`} />
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
    <div className={`flex-1 ${bgColor} relative flex flex-col`}>
      <div className={`${bgColor} p-4 flex items-center border-b ${borderColor}`}>
        <button onClick={() => setShowProfile(false)} className="mr-3">
          <ChevronRight className={`w-4 h-4 rotate-180 ${textColor}`} />
        </button>
        <h2 className={`text-sm font-medium ${textColor}`}>프로필</h2>
      </div>
      
      {/* 프로필 사진 업로드 섹션 */}
      <div className="p-4 pb-24 overflow-y-auto flex-1">
        <div className="flex flex-col items-center mb-6">
          <button onClick={handleProfileImageClick} className="cursor-pointer relative">
            <div className={`w-20 h-20 ${cardBg} rounded-full flex items-center justify-center border-2 ${borderColor} overflow-hidden`}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className={`w-6 h-6 ${secondaryText}`} />
              )}
            </div>
            {/* 플러스 아이콘을 안쪽으로 이동하고 크기 축소 */}
            <div className={`absolute bottom-1 right-1 w-5 h-5 ${isDarkMode ? 'bg-white' : 'bg-gray-800'} rounded-full flex items-center justify-center`}>
              <Plus className={`w-2.5 h-2.5 ${isDarkMode ? 'text-gray-800' : 'text-white'}`} />
            </div>
          </button>
          {/* 웹용 숨겨진 파일 input */}
          <input
            id="profile-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          {/* 이미지 삭제 버튼 (이미지가 있을 때만 표시) */}
          {profileImage && (
            <button
              onClick={handleImageDelete}
              className={`mt-3 px-4 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                isDarkMode
                  ? 'text-red-400 border border-red-400/30 hover:bg-red-400/10'
                  : 'text-red-600 border border-red-200 hover:bg-red-50'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              프로필 사진 삭제
            </button>
          )}
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
              <ChevronRight className={`w-4 h-4 ${secondaryText}`} />
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
                {profileData.userFId || '없음'}
              </span>
              <ChevronRight className={`w-4 h-4 ${secondaryText}`} />
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
              <ChevronRight className={`w-4 h-4 ${secondaryText}`} />
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
              <ChevronRight className={`w-4 h-4 ${secondaryText}`} />
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
              <ChevronRight className={`w-4 h-4 ${secondaryText}`} />
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
          onSave={async (value) => {
            // 로컬 상태 업데이트
            const newData = {...profileData, name: value};
            setProfileData(newData);
            localStorage.setItem('profileData', JSON.stringify(newData));

            // Supabase에 저장
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const { error } = await supabase
                  .from('user_info')
                  .update({ name: value })
                  .eq('user_id', user.id);

                if (error) {
                  console.error('이름 업데이트 실패:', error);
                  setToastMessage('이름 저장에 실패했습니다.');
                  setToastType('error');
                  setShowToast(true);
                }
              }
            } catch (error) {
              console.error('이름 저장 에러:', error);
            }
          }}
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
          value={profileData.userFId}
          onSave={(value) => {
            const newData = {...profileData, userFId: value};
            setProfileData(newData);
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
          onSave={async (value) => {
            // 로컬 상태 업데이트
            const newData = {...profileData, birthDate: value};
            setProfileData(newData);
            localStorage.setItem('profileData', JSON.stringify(newData));

            // Supabase에 저장
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                // YYYY.MM.DD 형식을 YYYY-MM-DD 형식으로 변환 (DATE 타입)
                const dateForDB = value ? value.replace(/\./g, '-') : null;

                const { error } = await supabase
                  .from('user_info')
                  .update({ birthdate: dateForDB })
                  .eq('user_id', user.id);

                if (error) {
                  console.error('생년월일 업데이트 실패:', error);
                  setToastMessage('생년월일 저장에 실패했습니다.');
                  setToastType('error');
                  setShowToast(true);
                } else {
                }
              }
            } catch (error) {
              console.error('생년월일 저장 에러:', error);
            }
          }}
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
          onSave={async (value) => {
            // 로컬 상태 업데이트
            const newData = {...profileData, phone: value};
            setProfileData(newData);
            localStorage.setItem('profileData', JSON.stringify(newData));

            // Supabase에 저장
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const { error } = await supabase
                  .from('user_info')
                  .update({ phone_num: value })
                  .eq('user_id', user.id);

                if (error) {
                  console.error('휴대폰 번호 업데이트 실패:', error);
                  setToastMessage('휴대폰 번호 저장에 실패했습니다.');
                  setToastType('error');
                  setShowToast(true);
                }
              }
            } catch (error) {
              console.error('휴대폰 번호 저장 에러:', error);
            }
          }}
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
          onSave={async (value) => {
            // 로컬 상태 업데이트
            const newData = {...profileData, email: value};
            setProfileData(newData);
            localStorage.setItem('profileData', JSON.stringify(newData));

            // Supabase에 저장
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const { error } = await supabase
                  .from('user_info')
                  .update({ email: value })
                  .eq('user_id', user.id);

                if (error) {
                  console.error('이메일 업데이트 실패:', error);
                  setToastMessage('이메일 저장에 실패했습니다.');
                  setToastType('error');
                  setShowToast(true);
                }
              }
            } catch (error) {
              console.error('이메일 저장 에러:', error);
            }
          }}
          onClose={() => setEditingField(null)}
          showToast={(message, type) => {
            setToastMessage(message);
            setToastType(type);
            setShowToast(true);
          }}
        />
      )}
      
      {/* 계정 탈퇴 버튼 - 프로필 메인 화면에서만 표시 (내비게이션 바 위) */}
      {!editingField && (
        <div className="fixed bottom-16 left-0 right-0 z-50 p-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`w-full py-2.5 text-sm font-medium text-red-500 rounded-lg border border-red-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-red-50 transition-colors`}
          >
            계정 탈퇴
          </button>
        </div>
      )}
      
      {/* 탈퇴 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
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