import React, { useState, useEffect } from 'react';
import { MessageCircle, Link, UserSearch, ChevronDown } from 'lucide-react';
import SearchFriends from './SearchFriends';
import { BronzeIcon, SilverIcon, GoldIcon, PlatinumIcon } from '../../components/RankIcons';
import { supabase } from '../../lib/supabase';
import { useData } from '../../services/DataContext';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

const Community = ({ isDarkMode, onShowFriendsList, onShowGlobalList, showToast, userRanking, currentUserId = '', currentUserFId = '', currentUserName = '', pendingInviteSearch, setPendingInviteSearch }) => {
  // 전역 데이터 컨텍스트에서 데이터 가져오기
  const { allUsers, friendsList: friendsData, refreshUsers, refreshFriends } = useData();

  const [showSearchPage, setShowSearchPage] = useState(false);
  const [initialSearchTerm, setInitialSearchTerm] = useState(''); // 초기 검색어
  const [currentUserPlasticSaved, setCurrentUserPlasticSaved] = useState(0); // DB에서 로드할 때까지 0

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';

  // 나의 실제 플라스틱 절약량 (g 단위를 kg 또는 g으로 표시)
  const getDisplayScore = (grams) => {
    if (grams < 1000) {
      return `${Math.round(grams)}g`;
    } else {
      return `${(grams / 1000).toFixed(2)}kg`;
    }
  };

  const myScore = getDisplayScore(currentUserPlasticSaved);

  // 전체 랭킹 데이터 - 데이터베이스에서 가져온 상위 50명 사용
  let globalRankingDataRaw = allUsers.map(user => ({
    name: user.name,
    id: user.id,
    score: getDisplayScore(user.plasticSaved),
    grams: user.plasticSaved,
    profileImage: user.profileImage
  }));

  // 현재 사용자가 상위 50명에 없다면 추가
  const currentUserInList = globalRankingDataRaw.find(u => u.id === currentUserFId);
  if (!currentUserInList && currentUserFId) {
    globalRankingDataRaw.push({
      name: currentUserName || '사용자',
      id: currentUserFId,
      score: myScore,
      grams: currentUserPlasticSaved
    });
    // 다시 정렬
    globalRankingDataRaw.sort((a, b) => b.grams - a.grams);
  }

  // 나의 전체 순위 찾기
  const myGlobalRank = globalRankingDataRaw.findIndex(u => u.id === currentUserFId) + 1;
  const totalUsers = globalRankingDataRaw.length;
  const topPercentage = myGlobalRank > 0 ? Math.round((myGlobalRank / totalUsers) * 100) : 0;

  // 친구 목록 데이터 - 데이터베이스에서 가져온 친구들 사용
  let friendsListRaw = friendsData.map(friend => ({
    name: friend.name,
    id: friend.id,
    score: getDisplayScore(friend.plasticSaved),
    grams: friend.plasticSaved,
    profileImage: friend.profileImage
  }));

  // 나 자신 추가 (친구 목록에 없는 경우)
  const meInFriends = friendsListRaw.find(f => f.id === currentUserFId);
  if (!meInFriends && currentUserFId) {
    friendsListRaw.push({
      name: currentUserName || '사용자',
      id: currentUserFId,
      score: myScore,
      grams: currentUserPlasticSaved
    });
    // 다시 정렬
    friendsListRaw.sort((a, b) => b.grams - a.grams);
  }

  // 랭킹 부여
  const friendsList = friendsListRaw.map((friend, index) => ({
    ...friend,
    rank: index + 1
  }));

  // 나의 친구 중 랭킹 찾기
  const myRank = friendsList.findIndex(f => f.id === currentUserFId) + 1;
  const isInTop3 = myRank <= 3 && myRank > 0;

  // 컴포넌트 마운트 시 데이터 새로고침
  useEffect(() => {
    // 전체 사용자 목록과 친구 목록 새로고침
    const refreshData = async () => {
      await refreshUsers();
      if (currentUserId) {
        await refreshFriends(currentUserId);

        // 현재 사용자의 실제 DB 데이터 가져오기
        try {
          const { data, error } = await supabase
            .from('user_info')
            .select('amount')
            .eq('user_id', currentUserId)
            .single();

          if (!error && data) {
            setCurrentUserPlasticSaved(data.amount || 0);
          }
        } catch (error) {
          console.error('현재 사용자 데이터 로드 실패:', error);
        }
      }
    };

    refreshData();
  }, [currentUserId]); // currentUserId가 변경될 때마다 실행

  // Initialize Kakao SDK when component mounts
  useEffect(() => {
    const initKakao = () => {
      const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

      if (!kakaoApiKey || kakaoApiKey === 'your-kakao-api-key-here') {
        console.warn('Kakao API key not configured');
        return;
      }

      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(kakaoApiKey);
            console.log('Kakao SDK initialized successfully');
          } catch (error) {
            console.error('Failed to initialize Kakao SDK:', error);
          }
        } else {
          console.log('Kakao SDK already initialized');
        }
      } else {
        console.warn('Kakao SDK not loaded yet, retrying...');
        // SDK가 아직 로드되지 않았다면 1초 후 재시도
        setTimeout(initKakao, 1000);
      }
    };

    initKakao();
  }, []);

  // 초대 코드로 검색 화면 자동 열기
  useEffect(() => {
    if (pendingInviteSearch) {
      console.log('초대 코드로 검색 화면 자동 열기:', pendingInviteSearch);
      setInitialSearchTerm(pendingInviteSearch);
      setShowSearchPage(true);
      // pendingInviteSearch 상태 초기화 (한 번만 실행)
      setPendingInviteSearch(null);
    }
  }, [pendingInviteSearch, setPendingInviteSearch]);

  if (showSearchPage) {
    return <SearchFriends isDarkMode={isDarkMode} onBack={() => {
      setShowSearchPage(false);
      setInitialSearchTerm(''); // 검색어 초기화
    }} userRanking={userRanking} showToast={showToast} currentUserId={currentUserId} currentUserFId={currentUserFId} currentUserName={currentUserName} initialSearchTerm={initialSearchTerm} />;
  }

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar scrollbar-hide-idle pb-20 ${bgColor}`}>
      <div className="min-h-full">
        {/* 친구 초대 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <h3 className={`${textColor} text-sm font-medium mb-3 text-center`}>초대</h3>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  // localStorage에서 user_f_id 가져오기
                  const savedProfileData = localStorage.getItem('profileData');
                  let userFId = '';

                  if (savedProfileData) {
                    try {
                      const parsed = JSON.parse(savedProfileData);
                      userFId = parsed.userFId || '';
                    } catch (e) {
                      console.error('프로필 데이터 파싱 오류:', e);
                    }
                  }

                  // user_f_id가 없으면 경고
                  if (!userFId) {
                    if (showToast) {
                      showToast('먼저 설정에서 아이디를 설정해주세요', 'warning');
                    }
                    return;
                  }

                  // 공유 콘텐츠 설정
                  const shareTitle = 'EcoStep';
                  const shareText = `Small Steps, Big Change. Why Not?\n\n초대 코드: ${userFId}`;

                  // 플랫폼 감지
                  const isAndroid = /android/i.test(navigator.userAgent);
                  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
                  const isNative = Capacitor.isNativePlatform();

                  // 스토어 링크 설정
                  let shareUrl;
                  if (isAndroid) {
                    shareUrl = 'https://play.google.com/store/apps/details?id=com.ecostep.app';
                  } else if (isIOS) {
                    shareUrl = 'https://apps.apple.com/app/ecostep/id0000000000'; // TODO: 실제 iOS 앱 ID로 변경
                  } else {
                    shareUrl = 'https://play.google.com/store/apps/details?id=com.ecostep.app';
                  }

                  if (isNative) {
                    // 모바일 앱: Native Share API 사용 (공유 시트에서 카카오톡 선택)
                    try {
                      await Share.share({
                        title: shareTitle,
                        text: shareText,
                        url: shareUrl,
                        dialogTitle: '친구 초대하기',
                      });
                      console.log('Native share opened successfully');
                    } catch (error) {
                      // 사용자가 취소한 경우 에러 표시하지 않음
                      if (error && error.message && !error.message.includes('cancel')) {
                        console.error('Native share error:', error);
                        if (showToast) {
                          showToast('공유 기능을 사용할 수 없습니다', 'error');
                        }
                      }
                    }
                  } else {
                    // 웹: Kakao SDK 시도, 실패 시 fallback
                    if (window.Kakao && window.Kakao.isInitialized()) {
                      try {
                        await window.Kakao.Share.sendDefault({
                          objectType: 'feed',
                          content: {
                            title: 'EcoStep',
                            description: `Small Steps, Big Change. Why Not?\n\n초대 코드: ${userFId}`,
                            imageUrl: 'https://ecostep-production.up.railway.app/og-image.png',
                            link: {
                              mobileWebUrl: shareUrl,
                              webUrl: shareUrl,
                            },
                          },
                          buttons: [
                            {
                              title: '앱 다운로드',
                              link: {
                                mobileWebUrl: shareUrl,
                                webUrl: shareUrl,
                              },
                            },
                          ],
                        });
                        console.log('Kakao share sent successfully');
                      } catch (kakaoError) {
                        console.error('Kakao SDK error:', kakaoError);
                        // Fallback: Web Share API 또는 클립보드
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: shareTitle,
                              text: shareText,
                              url: shareUrl,
                            });
                          } catch (shareError) {
                            if (shareError && !shareError.message?.includes('cancel')) {
                              await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                              if (showToast) {
                                showToast('링크가 복사되었습니다', 'info');
                              }
                            }
                          }
                        } else {
                          await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                          if (showToast) {
                            showToast('링크가 복사되었습니다', 'info');
                          }
                        }
                      }
                    } else {
                      // Kakao SDK 미초기화: Web Share API 또는 클립보드
                      console.warn('Kakao SDK not initialized');
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: shareTitle,
                            text: shareText,
                            url: shareUrl,
                          });
                        } catch (error) {
                          if (error && !error.message?.includes('cancel')) {
                            await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                            if (showToast) {
                              showToast('링크가 복사되었습니다', 'info');
                            }
                          }
                        }
                      } else {
                        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                        if (showToast) {
                          showToast('링크가 복사되었습니다', 'info');
                        }
                      }
                    }
                  }
                } catch (error) {
                  console.error('Share error:', error);
                  if (showToast) {
                    showToast('공유 중 오류가 발생했습니다', 'error');
                  }
                }
              }}
              className={`flex-1 relative overflow-hidden py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-all transform hover:scale-[1.02]`}
              style={{
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px -12px rgba(0,0,0,0.5)'
                  : '0 8px 24px -4px rgba(0,0,0,0.15)',
                color: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)'
              }}
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              카톡
            </button>
            <button
              onClick={async () => {
                // localStorage에서 user_f_id 가져오기
                const savedProfileData = localStorage.getItem('profileData');
                let userFId = '';

                if (savedProfileData) {
                  try {
                    const parsed = JSON.parse(savedProfileData);
                    userFId = parsed.userFId || '';
                  } catch (e) {
                    console.error('프로필 데이터 파싱 오류:', e);
                  }
                }

                // user_f_id가 없으면 경고
                if (!userFId) {
                  if (showToast) {
                    showToast('먼저 설정에서 아이디를 설정해주세요', 'warning');
                  }
                  return;
                }

                // 링크 버튼용 Custom URL Scheme
                let inviteLink;

                // 플랫폼 감지
                const isAndroid = /android/i.test(navigator.userAgent);
                const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

                if (isAndroid) {
                  // Android: Intent URL 사용 (앱 없으면 Play Store로 자동 이동)
                  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.ecostep.app';
                  inviteLink = `intent://invite?code=${userFId}#Intent;scheme=ecostep;package=com.ecostep.app;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
                } else if (isIOS) {
                  // iOS: Custom Scheme URL
                  inviteLink = `ecostep://invite?code=${userFId}`;
                } else {
                  // 데스크톱 또는 기타: Custom Scheme URL
                  inviteLink = `ecostep://invite?code=${userFId}`;
                }

                // 클립보드에 직접 복사 (공유 시트 없이)
                try {
                  await navigator.clipboard.writeText(inviteLink);
                  if (showToast) {
                    showToast('링크가 복사되었습니다', 'success');
                  }
                } catch (clipboardError) {
                  console.error('Clipboard error:', clipboardError);
                  if (showToast) {
                    showToast('링크 복사에 실패했습니다', 'error');
                  }
                }
              }}
              className={`flex-1 relative overflow-hidden py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-all transform hover:scale-[1.02]`}
              style={{
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px -12px rgba(0,0,0,0.5)'
                  : '0 8px 24px -4px rgba(0,0,0,0.15)',
                color: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)'
              }}
            >
              <Link className="w-4 h-4 mr-1.5" />
              링크
            </button>
            <button 
              onClick={() => setShowSearchPage(true)}
              className={`flex-1 relative overflow-hidden py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-all transform hover:scale-[1.02]`}
              style={{
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px -12px rgba(0,0,0,0.5)'
                  : '0 8px 24px -4px rgba(0,0,0,0.15)',
                color: isDarkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)'
              }}
            >
              <UserSearch className="w-4 h-4 mr-1.5" />
              검색
            </button>
          </div>
        </div>

        {/* 친구 랭킹 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${textColor} text-sm font-medium`}>친구</h3>
            <button 
              onClick={onShowFriendsList} 
              className={`text-xs ${textColor} hover:opacity-70 transition-opacity flex items-center gap-0.5`}
            >
              더보기
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div>
            {friendsList.slice(0, 3).map((friend, index) => {
              // 화면 표시 순위 (1, 2, 3)
              const displayRank = index + 1;
              const isMe = friend.id === currentUserFId;
              
              return (
                <div key={friend.rank}>
                  <div className="flex items-center justify-between" style={{ paddingTop: '0.425rem', paddingBottom: '0.425rem' }}>
                    <div className="flex items-center">
                      {/* Top 3: Show rank icons only */}
                      {displayRank <= 3 ? (
                        <div className="flex items-center justify-center" style={{
                          width: '28px',
                          height: displayRank === 1 ? '28px' : displayRank === 2 ? '26px' : '24px',
                          marginRight: '8px'
                        }}>
                          {displayRank === 1 ? (
                            <PlatinumIcon size={28} />
                          ) : displayRank === 2 ? (
                            <GoldIcon size={26} />
                          ) : (
                            <SilverIcon size={24} />
                          )}
                        </div>
                      ) : (
                        /* Rank 4+: Show profile picture or default avatar */
                        <div className="flex items-center justify-center" style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '8px'
                        }}>
                          {friend.profileImage ? (
                            <img
                              src={friend.profileImage}
                              alt={`${friend.name} profile`}
                              className="w-7 h-7 rounded-full object-cover border"
                              style={{ borderColor: isDarkMode ? '#4b5563' : '#d1d5db' }}
                            />
                          ) : (
                            <div
                              className="w-7 h-7 rounded-full border flex items-center justify-center bg-gray-200"
                              style={{ borderColor: isDarkMode ? '#4b5563' : '#d1d5db' }}
                            >
                              <span className="text-xs text-gray-500">{friend.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 flex flex-col items-start">
                        <span
                          className={`${displayRank === 1 ? 'text-sm' : displayRank === 2 ? 'text-[13px]' : 'text-xs'} ${isDarkMode ? 'text-gray-300 font-normal' : 'text-gray-700 font-normal'}`}
                          style={isMe ? {
                            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          } : {}}
                        >
                          {friend.name}
                        </span>
                        {friend.id && <span className={`${displayRank === 1 ? 'text-[10px]' : displayRank === 2 ? 'text-[9px]' : 'text-[8px]'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${displayRank === 1 ? '-mt-[1.5px]' : displayRank === 2 ? '-mt-[3px]' : '-mt-[1px]'}`}>@{friend.id}</span>}
                      </div>
                    </div>
                    <span
                      className={`${displayRank === 1 ? 'text-xs' : displayRank === 2 ? 'text-[11px]' : 'text-[10px]'} ${isDarkMode ? 'text-gray-300 font-normal' : 'text-gray-700 font-normal'}`}
                      style={isMe ? {
                        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      } : {}}
                    >
                      {friend.score}
                    </span>
                  </div>
                  {index < 2 && <div className={`border-b ${borderColor}`}></div>}
                </div>
              );
            })}
            {!isInTop3 && (
              <>
                <div className={`border-t ${borderColor}`}></div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center" style={{
                      width: '28px',
                      height: '24px',
                      marginRight: '8px'
                    }}>
                      <div
                        className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {myRank}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <span
                        className="text-xs font-normal"
                        style={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {currentUserName || '사용자'}
                      </span>
                      {currentUserFId && <span className={`text-[8px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} -mt-[1px]`}>@{currentUserFId}</span>}
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-normal"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {myScore}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 전체 랭킹 */}
        <div className={`mx-3 mt-4 ${cardBg} border ${borderColor} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`${textColor} text-sm font-medium`}>전체</h3>
            <button 
              onClick={onShowGlobalList} 
              className={`text-xs ${textColor} hover:opacity-70 transition-opacity flex items-center gap-0.5`}
            >
              더보기
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div>
            {globalRankingDataRaw.slice(0, 3).map((user, index) => {
              // 1등: 플래티넘, 2등: 골드, 3등: 실버
              const actualRank = index + 1; // 실제 순위
              const rankColor = actualRank === 1 ? '#ec4899' : actualRank === 2 ? '#fcd34d' : '#06b6d4';
              const isMe = user.id === currentUserFId;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between" style={{ paddingTop: '0.425rem', paddingBottom: '0.425rem' }}>
                    <div className="flex items-center">
                      {/* Top 3: Show rank icons only */}
                      {actualRank <= 3 ? (
                        <div className="flex items-center justify-center" style={{
                          width: '28px',
                          height: actualRank === 1 ? '28px' : actualRank === 2 ? '26px' : '24px',
                          marginRight: '8px'
                        }}>
                          {actualRank === 1 ? (
                            <PlatinumIcon size={28} />
                          ) : actualRank === 2 ? (
                            <GoldIcon size={26} />
                          ) : (
                            <SilverIcon size={24} />
                          )}
                        </div>
                      ) : (
                        /* Rank 4+: Show profile picture or default avatar */
                        <div className="flex items-center justify-center" style={{
                          width: '28px',
                          height: '28px',
                          marginRight: '8px'
                        }}>
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={`${user.name} profile`}
                              className="w-7 h-7 rounded-full object-cover border"
                              style={{ borderColor: isDarkMode ? '#4b5563' : '#d1d5db' }}
                            />
                          ) : (
                            <div
                              className="w-7 h-7 rounded-full border flex items-center justify-center bg-gray-200"
                              style={{ borderColor: isDarkMode ? '#4b5563' : '#d1d5db' }}
                            >
                              <span className="text-xs text-gray-500">{user.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 flex flex-col items-start">
                        <span
                          className={`${actualRank === 1 ? 'text-sm' : actualRank === 2 ? 'text-[13px]' : 'text-xs'} ${isDarkMode ? 'text-gray-300 font-normal' : 'text-gray-700 font-normal'}`}
                          style={isMe ? {
                            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          } : {}}
                        >
                          {user.name}
                        </span>
                        {user.id && <span className={`${actualRank === 1 ? 'text-[10px]' : actualRank === 2 ? 'text-[9px]' : 'text-[8px]'} ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${actualRank === 1 ? '-mt-[1.5px]' : actualRank === 2 ? '-mt-[3px]' : '-mt-[1px]'}`}>@{user.id}</span>}
                      </div>
                    </div>
                    <span
                      className={`${actualRank === 1 ? 'text-xs' : actualRank === 2 ? 'text-[11px]' : 'text-[10px]'} ${isDarkMode ? 'text-gray-300 font-normal' : 'text-gray-700 font-normal'}`}
                      style={isMe ? {
                        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      } : {}}
                    >
                      {user.score}
                    </span>
                  </div>
                  {index < 2 && <div className={`border-b ${borderColor}`}></div>}
                </div>
              );
            })}
            {/* 나의 랭킹 (1~3등이 아닐 때만 표시) */}
            {myGlobalRank > 3 && (
              <>
                <div className={`border-t ${borderColor}`}></div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center" style={{ 
                      width: '28px',
                      height: '24px',
                      marginRight: '8px'
                    }}>
                      <div 
                        className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center text-[11px] font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ borderColor: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      >
                        {myGlobalRank <= 99 ? myGlobalRank : '···'}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <span
                        className="text-xs font-normal"
                        style={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {currentUserName || '사용자'}
                      </span>
                      {currentUserFId && <span className={`text-[8px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} -mt-[1px]`}>@{currentUserFId}</span>}
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-normal"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #2563eb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    상위 {topPercentage}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;