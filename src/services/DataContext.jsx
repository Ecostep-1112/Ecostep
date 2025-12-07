import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getStoreFish, getStoreDecorations, getUserPurchasedItems } from '../lib/database';

// 데이터 컨텍스트 생성
const DataContext = createContext();

// 커스텀 훅 - 컴포넌트에서 데이터를 쉽게 사용하기 위함
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// 데이터 프로바이더 컴포넌트
export const DataProvider = ({ children }) => {
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Community 페이지 데이터
  const [allUsers, setAllUsers] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  // Rewards 페이지 데이터
  const [fishData, setFishData] = useState({
    bronze: [],
    silver: [],
    gold: [],
    platinum: []
  });

  const [decorationsData, setDecorationsData] = useState({
    bronze: [],
    silver: [],
    gold: [],
    platinum: []
  });

  const [purchasedFish, setPurchasedFish] = useState([]);
  const [purchasedDecorations, setPurchasedDecorations] = useState([]);

  // 에러 상태
  const [error, setError] = useState(null);

  // 전체 사용자 목록 로드 (상위 50명, amount 기준 내림차순)
  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_info')
        .select('user_id, user_f_id, name, amount, profile_image_url')
        .order('amount', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedUsers = (data || []).map(user => ({
        id: user.user_f_id || user.user_id, // user_f_id 우선, 없으면 user_id
        name: user.name,
        profileImage: user.profile_image_url || null,
        plasticSaved: user.amount || 0
      }));

      setAllUsers(formattedUsers);
      return formattedUsers;
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
      setAllUsers([]);
      return [];
    }
  }, []);

  // 친구 목록 로드 (양방향 확인 및 user_info 조인하여 정보 가져오기)
  const loadFriends = useCallback(async (userId) => {
    if (!userId) {
      setFriendsList([]);
      return [];
    }

    try {
      // user_id가 현재 사용자인 친구 관계 (status가 accepted인 것만)
      const { data: friendsAsUser, error: error1 } = await supabase
        .from('user_friend')
        .select('friend_id')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      // friend_id가 현재 사용자인 친구 관계 (상대방이 나를 추가한 경우, status가 accepted인 것만)
      const { data: friendsAsFriend, error: error2 } = await supabase
        .from('user_friend')
        .select('user_id')
        .eq('friend_id', userId)
        .eq('status', 'accepted');

      if (error1 || error2) throw error1 || error2;

      // 친구 ID 목록 합치기 (중복 제거)
      const friendIds = new Set([
        ...(friendsAsUser || []).map(f => f.friend_id),
        ...(friendsAsFriend || []).map(f => f.user_id)
      ]);

      if (friendIds.size === 0) {
        setFriendsList([]);
        return [];
      }

      // 친구들의 정보를 user_info에서 가져오기 (amount 기준 내림차순)
      const { data: friendsInfo, error: error3 } = await supabase
        .from('user_info')
        .select('user_id, user_f_id, name, amount, profile_image_url')
        .in('user_id', Array.from(friendIds))
        .order('amount', { ascending: false });

      if (error3) throw error3;

      const formattedFriends = (friendsInfo || []).map(friend => ({
        id: friend.user_f_id || friend.user_id, // user_f_id 우선, 없으면 user_id
        name: friend.name,
        profileImage: friend.profile_image_url || null,
        plasticSaved: friend.amount || 0
      }));

      setFriendsList(formattedFriends);
      return formattedFriends;
    } catch (error) {
      console.error('친구 목록 로드 실패:', error);
      setFriendsList([]);
      return [];
    }
  }, []);

  // 상점 데이터 로드
  const loadStoreData = useCallback(async () => {
    try {
      // 물고기 데이터 로드
      const { data: fishList, error: fishError } = await getStoreFish();
      if (!fishError && fishList) {
        const fishByRank = {
          bronze: [],
          silver: [],
          gold: [],
          platinum: []
        };
        fishList.forEach(fish => {
          const rankKey = fish.rank.toLowerCase();
          if (fishByRank[rankKey]) {
            fishByRank[rankKey].push({
              id: fish.item_id,  // Supabase에 저장할 ID
              name: fish.item_name || fish.item_id,  // 화면에 표시할 이름
              description: fish.item_name || fish.item_id,
              price: fish.price
            });
          }
        });
        setFishData(fishByRank);
      }

      // 장식품 데이터 로드
      const { data: decoList, error: decoError } = await getStoreDecorations();
      if (!decoError && decoList) {
        const decoByRank = {
          bronze: [],
          silver: [],
          gold: [],
          platinum: []
        };
        decoList.forEach(deco => {
          const rankKey = deco.rank.toLowerCase();
          if (decoByRank[rankKey]) {
            decoByRank[rankKey].push({
              id: deco.item_id,  // Supabase에 저장할 ID
              name: deco.item_name || deco.item_id,  // 화면에 표시할 이름
              description: deco.item_name || deco.item_id,
              price: deco.price
            });
          }
        });
        setDecorationsData(decoByRank);
      }

      return { fishList, decoList };
    } catch (error) {
      console.error('상점 데이터 로드 에러:', error);
      throw error;
    }
  }, []);

  // 사용자 구매 목록 로드
  const loadUserPurchases = useCallback(async (userId, fishList, decoList) => {
    if (!userId) return;

    try {
      const { data: purchasedItems, error: purchaseError } = await getUserPurchasedItems(userId);

      if (!purchaseError && purchasedItems) {
        const fishNames = [];
        const decoNames = [];

        purchasedItems.forEach(item => {
          const itemId = item.item_id;
          const isFish = fishList?.some(fish => fish.item_id === itemId);

          // item_id로 구매한 아이템을 찾아 item_name으로 변환
          if (isFish) {
            const fish = fishList.find(f => f.item_id === itemId);
            fishNames.push(fish?.item_name || itemId);
          } else {
            const deco = decoList?.find(d => d.item_id === itemId);
            decoNames.push(deco?.item_name || itemId);
          }
        });

        setPurchasedFish(fishNames);
        setPurchasedDecorations(decoNames);
      }
    } catch (error) {
      console.error('구매 목록 로드 에러:', error);
    }
  }, []);

  // 모든 데이터 프리로딩
  const preloadAllData = useCallback(async (userId = null) => {
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);

    try {
      // 1단계: 사용자 목록 로드 (25%)
      await loadUsers();
      setLoadingProgress(25);

      // 2단계: 친구 목록 로드 (50%)
      if (userId) {
        await loadFriends(userId);
      }
      setLoadingProgress(50);

      // 3단계: 상점 데이터 로드 (75%)
      const { fishList, decoList } = await loadStoreData();
      setLoadingProgress(75);

      // 4단계: 사용자 구매 목록 로드 (100%)
      if (userId) {
        await loadUserPurchases(userId, fishList, decoList);
      }
      setLoadingProgress(100);

      setIsLoading(false);
    } catch (error) {
      console.error('데이터 프리로딩 에러:', error);
      setError(error);
      setIsLoading(false);
    }
  }, [loadUsers, loadFriends, loadStoreData, loadUserPurchases]);

  // 개별 데이터 새로고침 함수들
  const refreshUsers = useCallback(async () => {
    await loadUsers();
  }, [loadUsers]);

  const refreshFriends = useCallback(async (userId) => {
    await loadFriends(userId);
  }, [loadFriends]);

  const refreshStoreData = useCallback(async () => {
    await loadStoreData();
  }, [loadStoreData]);

  const refreshUserPurchases = useCallback(async (userId, fishList, decoList) => {
    await loadUserPurchases(userId, fishList, decoList);
  }, [loadUserPurchases]);

  // 컨텍스트 값
  const value = {
    // 로딩 상태
    isLoading,
    loadingProgress,
    error,

    // 데이터
    allUsers,
    friendsList,
    fishData,
    decorationsData,
    purchasedFish,
    purchasedDecorations,

    // 데이터 갱신 함수
    preloadAllData,
    refreshUsers,
    refreshFriends,
    refreshStoreData,
    refreshUserPurchases,
    setPurchasedFish,
    setPurchasedDecorations,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
