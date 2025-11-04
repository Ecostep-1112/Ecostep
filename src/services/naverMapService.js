// 네이버 지도 API 서비스
// 백엔드 서버를 통해 네이버 Local Search API를 호출합니다 (보안)

/**
 * 네이버 Local Search API를 통해 장소 검색
 * @param {string} query - 검색어 (예: "제로웨이스트샵", "리필스테이션")
 * @param {number} display - 최대 결과 수 (기본값: 20)
 * @returns {Promise<Array>} 장소 목록
 */
export const searchPlaces = async (query, display = 20) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5176';
    const response = await fetch(`${API_URL}/api/naver-local-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        display: display
      })
    });

    if (!response.ok) {
      throw new Error('네이버 검색 실패');
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('장소 검색 실패:', error);
    return [];
  }
};

/**
 * 두 좌표 간의 거리를 계산 (Haversine formula)
 * @param {number} lat1 - 첫 번째 위도
 * @param {number} lng1 - 첫 번째 경도
 * @param {number} lat2 - 두 번째 위도
 * @param {number} lng2 - 두 번째 경도
 * @returns {number} 거리 (km)
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 사용자 위치 기준으로 장소를 필터링하고 정렬
 * @param {Array} places - 장소 목록
 * @param {Object} userLocation - 사용자 위치 {lat, lng}
 * @param {number} radiusKm - 반경 (km, 기본값: 3)
 * @returns {Array} 필터링 및 정렬된 장소 목록
 */
export const filterAndSortPlaces = (places, userLocation, radiusKm = 3) => {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return places;
  }

  // 거리 계산 및 필터링
  const placesWithDistance = places
    .map(place => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.lat,
        place.lng
      );
      return {
        ...place,
        distance: distance
      };
    })
    .filter(place => place.distance <= radiusKm); // 반경 내 장소만

  // 거리순으로 정렬 (가까운 순)
  return placesWithDistance.sort((a, b) => a.distance - b.distance);
};

export default {
  searchPlaces,
  calculateDistance,
  filterAndSortPlaces
};
