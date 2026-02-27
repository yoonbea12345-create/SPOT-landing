import { useCallback, useEffect, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

type Screen = "splash" | "map";

// MBTI 타입 정의
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

// MBTI별 색상 (네온 컬러)
const MBTI_COLORS: Record<string, string> = {
  INTJ: "#00f5ff", INTP: "#00d4ff", ENTJ: "#00b8ff", ENTP: "#009cff",
  INFJ: "#bf00ff", INFP: "#d400ff", ENFJ: "#e900ff", ENFP: "#ff00e5",
  ISTJ: "#ff9500", ISFJ: "#ffb800", ESTJ: "#ffd700", ESFJ: "#ffaa00",
  ISTP: "#ff0080", ISFP: "#ff0099", ESTP: "#ff00b3", ESFP: "#ff00cc"
};

// 더미 데이터 생성 (주요 도시 집약 + 전국 무작위 분포)
const generateDummyData = () => {
  const data = [];
  let id = 0;
  
  // 대한민국 주요 도시 및 지역 (40개)
  const cities = [
    // 서울 (5개 지역)
    { name: "홍대", lat: 37.5566, lng: 126.9236, count: [50, 100] },
    { name: "강남", lat: 37.4979, lng: 127.0276, count: [50, 100] },
    { name: "여의도", lat: 37.5219, lng: 126.9245, count: [40, 80] },
    { name: "성수", lat: 37.5444, lng: 127.0557, count: [40, 80] },
    { name: "명동", lat: 37.5838, lng: 127.0017, count: [30, 60] },
    // 광역시
    { name: "부산", lat: 35.1796, lng: 129.0756, count: [40, 70] },
    { name: "대구", lat: 35.8714, lng: 128.6014, count: [40, 70] },
    { name: "인천", lat: 37.4563, lng: 126.7052, count: [40, 70] },
    { name: "광주", lat: 35.1595, lng: 126.8526, count: [30, 60] },
    { name: "대전", lat: 36.3504, lng: 127.3845, count: [30, 60] },
    { name: "울산", lat: 35.5384, lng: 129.3114, count: [30, 60] },
    // 경기도
    { name: "수원", lat: 37.2636, lng: 127.0286, count: [30, 60] },
    { name: "성남", lat: 37.4386, lng: 127.1378, count: [25, 50] },
    { name: "고양", lat: 37.6584, lng: 126.8320, count: [25, 50] },
    { name: "용인", lat: 37.2411, lng: 127.1776, count: [25, 50] },
    { name: "부천", lat: 37.4989, lng: 126.7831, count: [20, 40] },
    { name: "안양", lat: 37.3943, lng: 126.9568, count: [20, 40] },
    { name: "안산", lat: 37.3219, lng: 126.8309, count: [20, 40] },
    { name: "평택", lat: 37.0703, lng: 127.1127, count: [15, 30] },
    { name: "파주", lat: 37.7608, lng: 126.7800, count: [15, 30] },
    // 강원도
    { name: "춘천", lat: 37.8813, lng: 127.7300, count: [15, 30] },
    { name: "강릉", lat: 37.7519, lng: 128.8761, count: [15, 30] },
    { name: "원주", lat: 37.3422, lng: 127.9202, count: [10, 25] },
    // 충청도
    { name: "청주", lat: 36.6424, lng: 127.4890, count: [20, 40] },
    { name: "천안", lat: 36.8151, lng: 127.1139, count: [15, 30] },
    { name: "충주", lat: 36.9910, lng: 127.9258, count: [10, 25] },
    // 경상도
    { name: "창원", lat: 35.5396, lng: 128.6292, count: [20, 40] },
    { name: "김해", lat: 35.2285, lng: 128.8811, count: [15, 30] },
    { name: "진주", lat: 35.1800, lng: 128.1076, count: [10, 25] },
    { name: "포항", lat: 36.0190, lng: 129.3435, count: [15, 30] },
    { name: "경주", lat: 35.8562, lng: 129.2247, count: [15, 30] },
    // 전라도
    { name: "전주", lat: 35.8242, lng: 127.1480, count: [20, 40] },
    { name: "군산", lat: 35.9761, lng: 126.7366, count: [10, 25] },
    { name: "여수", lat: 34.7604, lng: 127.6622, count: [10, 25] },
    { name: "순천", lat: 34.9507, lng: 127.4872, count: [10, 25] },
    { name: "목포", lat: 34.8118, lng: 126.3922, count: [10, 25] },
    // 제주도
    { name: "제주시", lat: 33.4996, lng: 126.5312, count: [30, 60] },
    { name: "서귀포", lat: 33.2541, lng: 126.5601, count: [15, 30] },
  ];
  
  cities.forEach((city) => {
    const count = Math.floor(Math.random() * (city.count[1] - city.count[0] + 1)) + city.count[0];
    for (let i = 0; i < count; i++) {
      const mbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
      const lat = city.lat + (Math.random() - 0.5) * 0.2;
      const lng = city.lng + (Math.random() - 0.5) * 0.2;
      data.push({ mbti, lat, lng, id: id++ });
    }
  })
  
  // 3. 홍대 기본 위치 1m 앞에 ENFP 고정 (랜딩페이지 예시용)
  data.push({ 
    mbti: "ENFP", 
    lat: 37.5566 + 0.000009, 
    lng: 126.9236, 
    id: id++ 
  });
  
  return data;
};

export default function MvpMap() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<{mbti: string, distance: number} | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const cityLabelsRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState(15);

  // 홍대입구역 기본 위치
  const HONGDAE_CENTER = { lat: 37.5566, lng: 126.9236 };

  // 화면 높이 계산
  const [screenHeight, setScreenHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 스플래시 → 지도 전환 (2초 후)
  useEffect(() => {
    const timer = setTimeout(() => setScreen("map"), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 지도 표시 후 2초 뒤 GPS 동의 팝업
  useEffect(() => {
    if (screen === "map") {
      const timer = setTimeout(() => setShowConsentPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);



  // GPS 동의 처리 - 동의 버튼 클릭 시 즉시 GPS 권한 요청
  const handleConsent = useCallback((agreed: boolean) => {
    setShowConsentPopup(false);

    if (!agreed) {
      window.location.href = "/";
      return;
    }

    // 브라우저가 Geolocation을 지원하지 않는 경우
    if (!navigator.geolocation) {
      toast.error("📍 이 브라우저는 GPS를 지원하지 않습니다.", { duration: 5000 });
      return;
    }

    // 로딩 토스트 표시
    const loadingToast = toast.loading("📍 위치 정보를 가져오는 중... GPS를 켜주세요");

    // 동의 버튼 클릭 시 즉시 getCurrentPosition 호출
    // → 안드로이드 시스템 GPS 권한 팝업 자동 표시
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        console.log("✅ GPS 위치 수신 성공:", newLocation);
        
        setUserLocation(newLocation);
        
        if (mapRef.current) {
          mapRef.current.setCenter(newLocation);
        }

        // 사용자 마커 업데이트
        if (userMarkerRef.current) {
          userMarkerRef.current.position = newLocation;
        }

        toast.dismiss(loadingToast);
        toast.success("✅ 내 위치로 이동했어요!", { duration: 3000 });
      },
      (error) => {
        console.log("GPS 에러:", error);
        toast.dismiss(loadingToast);
        
        // 에러 타입에 따른 메시지
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("📍 GPS 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.", { duration: 5000 });
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error("📍 위치 정보를 가져올 수 없습니다. GPS를 켜주시고 새로고침 해주세요.", { duration: 5000 });
        } else if (error.code === error.TIMEOUT) {
          toast.error("📍 위치 정보 요청 시간이 초과되었습니다. GPS를 켜주시고 다시 시도해주세요.", { duration: 5000 });
        } else {
          toast.error("📍 알 수 없는 오류가 발생했습니다. GPS를 켜주시고 새로고침 해주세요.", { duration: 5000 });
        }
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  }, []);

  // 실시간 GPS 추적 시작
  const startWatchingPosition = useCallback(() => {
    // 이미 추적 중이면 중복 방지
    if (watchIdRef.current !== null) {
      return;
    }

    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    console.log("📍 실시간 GPS 추적 시작");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("📍 위치 업데이트:", newLocation);

        // 상태 업데이트
        setUserLocation(newLocation);

        // 사용자 마커 업데이트
        if (userMarkerRef.current) {
          userMarkerRef.current.position = newLocation;
        }

        // 지도 중심은 업데이트하지 않음 (사용자가 지도를 보고 있을 수 있으므로)
      },
      (error) => {
        console.log("GPS watch error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // 실시간 GPS 추적 중지
  const stopWatchingPosition = useCallback(() => {
    if (watchIdRef.current !== null) {
      console.log("🚫 실시간 GPS 추적 중지");
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // GPS 권한 허용 후 실시간 추적 시작
  useEffect(() => {
    if (userLocation && screen === "map") {
      startWatchingPosition();
    }

    // 컴포넌트 언마운트 시 추적 중지
    return () => {
      stopWatchingPosition();
    };
  }, [userLocation, screen, startWatchingPosition, stopWatchingPosition]);

  // 도시별 MBTI 개수 집계
  const aggregateCityData = useCallback(() => {
    const dummyData = generateDummyData();
    const cityStats: Record<string, Record<string, number>> = {};
    
    const cities = [
      { name: "홍대", lat: 37.5566, lng: 126.9236 },
      { name: "강남", lat: 37.4979, lng: 127.0276 },
      { name: "여의도", lat: 37.5219, lng: 126.9245 },
      { name: "성수", lat: 37.5444, lng: 127.0557 },
      { name: "명동", lat: 37.5838, lng: 127.0017 },
      { name: "부산", lat: 35.1796, lng: 129.0756 },
      { name: "대구", lat: 35.8714, lng: 128.6014 },
      { name: "인천", lat: 37.4563, lng: 126.7052 },
      { name: "광주", lat: 35.1595, lng: 126.8526 },
      { name: "대전", lat: 36.3504, lng: 127.3845 },
      { name: "울산", lat: 35.5384, lng: 129.3114 },
      { name: "수원", lat: 37.2636, lng: 127.0286 },
      { name: "성남", lat: 37.4386, lng: 127.1378 },
      { name: "고양", lat: 37.6584, lng: 126.8320 },
      { name: "용인", lat: 37.2411, lng: 127.1776 },
      { name: "부천", lat: 37.4989, lng: 126.7831 },
      { name: "안양", lat: 37.3943, lng: 126.9568 },
      { name: "안산", lat: 37.3219, lng: 126.8309 },
      { name: "평택", lat: 37.0703, lng: 127.1127 },
      { name: "파주", lat: 37.7608, lng: 126.7800 },
      { name: "춘천", lat: 37.8813, lng: 127.7300 },
      { name: "강릉", lat: 37.7519, lng: 128.8761 },
      { name: "원주", lat: 37.3422, lng: 127.9202 },
      { name: "청주", lat: 36.6424, lng: 127.4890 },
      { name: "천안", lat: 36.8151, lng: 127.1139 },
      { name: "충주", lat: 36.9910, lng: 127.9258 },
      { name: "창원", lat: 35.5396, lng: 128.6292 },
      { name: "김해", lat: 35.2285, lng: 128.8811 },
      { name: "진주", lat: 35.1800, lng: 128.1076 },
      { name: "포항", lat: 36.0190, lng: 129.3435 },
      { name: "경주", lat: 35.8562, lng: 129.2247 },
      { name: "전주", lat: 35.8242, lng: 127.1480 },
      { name: "군산", lat: 35.9761, lng: 126.7366 },
      { name: "여수", lat: 34.7604, lng: 127.6622 },
      { name: "순천", lat: 34.9507, lng: 127.4872 },
      { name: "목포", lat: 34.8118, lng: 126.3922 },
      { name: "제주시", lat: 33.4996, lng: 126.5312 },
      { name: "서귀포", lat: 33.2541, lng: 126.5601 },
    ];

    cities.forEach(city => {
      cityStats[city.name] = {};
    });

    dummyData.forEach(item => {
      let closestCity = cities[0];
      let minDistance = Infinity;

      cities.forEach(city => {
        const distance = Math.sqrt(
          Math.pow(city.lat - item.lat, 2) + Math.pow(city.lng - item.lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestCity = city;
        }
      });

      if (!cityStats[closestCity.name][item.mbti]) {
        cityStats[closestCity.name][item.mbti] = 0;
      }
      cityStats[closestCity.name][item.mbti]++;
    });

    return { cities, cityStats };
  }, []);

  // 지도 준비 완료 시 마커 생성
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    const center = userLocation || HONGDAE_CENTER;

    // 줌 레벨 변경 감지
    map.addListener('zoom_changed', () => {
      const zoom = map.getZoom() || 15;
      setCurrentZoom(zoom);
    });

    // 사용자 위치 마커
    const userMarkerElement = document.createElement("div");
    userMarkerElement.style.cssText = `
      width: 20px;
      height: 20px;
      background: white;
      border: 3px solid #00f0ff;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
    `;

    userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: center,
      content: userMarkerElement,
      title: "내 위치",
    });

    // 더미 데이터 마커
    const dummyData = generateDummyData();
    dummyData.forEach((item) => {
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background: ${MBTI_COLORS[item.mbti]}22;
        border: 2px solid ${MBTI_COLORS[item.mbti]};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 10px;
        color: ${MBTI_COLORS[item.mbti]};
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 0 15px ${MBTI_COLORS[item.mbti]}66;
      `;
      markerElement.textContent = item.mbti;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: item.lat, lng: item.lng },
        content: markerElement,
        title: item.mbti,
      });

      markerElement.addEventListener("click", () => {
        const distance = Math.round(
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(center.lat, center.lng),
            new google.maps.LatLng(item.lat, item.lng)
          )
        );
        setSelectedMarker({ mbti: item.mbti, distance });
      });

      markersRef.current.push(marker);
    });

    // 도시별 텍스트 라벨 생성
    const { cities, cityStats } = aggregateCityData();
    cities.forEach(city => {
      const stats = cityStats[city.name];
      if (!stats || Object.keys(stats).length === 0) return;

      const labelElement = document.createElement('div');
      labelElement.style.cssText = `
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid rgba(0, 240, 255, 0.5);
        border-radius: 12px;
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 700;
        color: #00f0ff;
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
      `;

      const sortedStats = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      labelElement.innerHTML = `
        <div style="font-size: 12px; margin-bottom: 4px; color: #00f0ff;">${city.name}</div>
        ${sortedStats.map(([mbti, count]) => 
          `<div style="color: ${MBTI_COLORS[mbti]}; text-shadow: 0 0 8px ${MBTI_COLORS[mbti]}88;">${mbti} × ${count}</div>`
        ).join('')}
      `;

      const cityLabel = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: city.lat, lng: city.lng },
        content: labelElement,
      });

      cityLabelsRef.current.push(cityLabel);
    });
  }, [userLocation, aggregateCityData]);

  // 줌 레벨에 따른 표시 전환
  useEffect(() => {
    const isZoomedOut = currentZoom < 12;

    // 반경원 표시/숨김
    markersRef.current.forEach(marker => {
      if (marker.content instanceof HTMLElement) {
        marker.content.style.opacity = isZoomedOut ? '0' : '1';
      }
    });

    // 도시 라벨 표시/숨김
    cityLabelsRef.current.forEach(label => {
      if (label.content instanceof HTMLElement) {
        label.content.style.opacity = isZoomedOut ? '1' : '0';
      }
    });
  }, [currentZoom]);

  // MBTI 필터링
  const filterByMBTI = (mbti: string) => {
    if (selectedMBTI === mbti) {
      setSelectedMBTI(null);
      markersRef.current.forEach(marker => {
        if (marker.content instanceof HTMLElement) {
          marker.content.style.opacity = "1";
        }
      });
    } else {
      setSelectedMBTI(mbti);
      markersRef.current.forEach(marker => {
        if (marker.content instanceof HTMLElement) {
          const markerMBTI = marker.content.textContent;
          marker.content.style.opacity = markerMBTI === mbti ? "1" : "0.15";
        }
      });
    }
  };

  // 스플래시 화면
  if (screen === "splash") {
    return (
      <div
        className="fixed inset-0 bg-black flex flex-col items-center justify-center"
        style={{ height: `${screenHeight}px` }}
      >
        <h1
          className="text-6xl font-bold"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: "#00f0ff",
            textShadow: "0 0 30px rgba(0, 240, 255, 0.8)",
          }}
        >
          SPOT
        </h1>
      </div>
    );
  }

  // 지도 화면
  return (
    <div
      className="fixed inset-0 bg-black flex flex-col"
      style={{ height: `${screenHeight}px` }}
    >
      <Toaster position="top-right" />
      
      {/* 상단 헤더 */}
      <div className="bg-black/95 backdrop-blur-lg border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between z-10">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: "#00f0ff",
            textShadow: "0 0 20px rgba(0, 240, 255, 0.8)",
          }}
        >
          SPOT
        </h1>
        <p className="text-sm text-gray-400">내 주변 같은 MBTI 찾기</p>
      </div>

      {/* MBTI 필터 바 */}
      <div className="bg-black/95 backdrop-blur-lg border-b border-cyan-500/20 p-4 overflow-x-auto z-10">
        <div className="flex gap-2 min-w-max">
          {MBTI_TYPES.map((mbti) => (
            <Button
              key={mbti}
              onClick={() => filterByMBTI(mbti)}
              variant="outline"
              size="sm"
              className={`
                font-black text-xs transition-all
                ${selectedMBTI === mbti ? 'border-2 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'}
              `}
              style={{
                borderColor: MBTI_COLORS[mbti],
                color: MBTI_COLORS[mbti],
                boxShadow: selectedMBTI === mbti ? `0 0 20px ${MBTI_COLORS[mbti]}88` : 'none'
              }}
            >
              {mbti}
            </Button>
          ))}
        </div>
      </div>

      {/* 지도 */}
      <div className="flex-1 relative">
        <MapView
          className="w-full h-full"
          initialCenter={userLocation || HONGDAE_CENTER}
          initialZoom={15}
          onMapReady={handleMapReady}
        />

        {/* 줄 레벨 슬라이더 */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/95 backdrop-blur-lg border-2 border-cyan-500/50 rounded-2xl p-3 shadow-2xl" style={{boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)"}}>
          {/* 모드 표시 */}
          <div className="text-center mb-3">
            <div className="text-xs font-black" style={{
              color: currentZoom >= 18 ? '#ff00ff' : currentZoom >= 12 ? '#9d4edd' : '#00f0ff',
              textShadow: `0 0 10px ${currentZoom >= 18 ? '#ff00ff88' : currentZoom >= 12 ? '#9d4edd88' : '#00f0ff88'}`,
              transition: 'all 0.3s'
            }}>
              {currentZoom >= 18 ? '3M' : currentZoom >= 12 ? 'NEAR' : 'WIDE'}
            </div>
          </div>
          
          {/* 세로 슬라이더 */}
          <div className="relative h-32 w-8 flex items-center justify-center">
            <input
              type="range"
              min="8"
              max="20"
              value={currentZoom}
              onChange={(e) => {
                const newZoom = parseInt(e.target.value);
                setCurrentZoom(newZoom);
                if (mapRef.current) {
                  mapRef.current.setZoom(newZoom);
                }
              }}
              className="absolute"
              style={{
                width: '128px',
                height: '8px',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                appearance: 'none',
                background: `linear-gradient(to right, #00f0ff 0%, #00f0ff ${((12-8)/(20-8)*100)}%, #9d4edd ${((12-8)/(20-8)*100)}%, #9d4edd ${((18-8)/(20-8)*100)}%, #ff00ff ${((18-8)/(20-8)*100)}%, #ff00ff 100%)`,
                borderRadius: '4px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
          
          {/* 구간 표시 */}
          <div className="flex flex-col items-center gap-1 mt-2 text-[8px] font-bold">
            <div style={{color: '#ff00ff', textShadow: '0 0 5px #ff00ff88'}}>3M</div>
            <div style={{color: '#9d4edd', textShadow: '0 0 5px #9d4edd88'}}>NEAR</div>
            <div style={{color: '#00f0ff', textShadow: '0 0 5px #00f0ff88'}}>WIDE</div>
          </div>
        </div>

        {/* 내 위치로 돌아가기 버튼 */}
        <button
          onClick={() => {
            if (mapRef.current && userLocation) {
              mapRef.current.panTo(userLocation);
              mapRef.current.setZoom(15);
              toast.success("내 위치로 이동했습니다");
            } else {
              toast.error("GPS 위치를 찾을 수 없습니다");
            }
          }}
          className="absolute bottom-24 left-4 bg-black/95 backdrop-blur-lg border-2 border-cyan-500/50 rounded-full p-3 shadow-2xl hover:scale-110 transition-transform"
          style={{
            boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        {/* 하단 정보 카드 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-lg border border-cyan-500/30 rounded-2xl px-6 py-4 shadow-2xl max-w-md w-full mx-4">
          <div className="text-center">
            {selectedMarker ? (
              <>
                <div className="text-2xl font-black mb-2" style={{color: MBTI_COLORS[selectedMarker.mbti]}}>
                  {selectedMarker.mbti}
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  거리: <span className="font-bold" style={{color: "#00f0ff"}}>{selectedMarker.distance}m</span>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedMarker.distance < 100 ? '바로 옆이네요!' : 
                   selectedMarker.distance < 500 ? '가까운 거리에요' : 
                   selectedMarker.distance < 1000 ? '조금만 걸어가면 돼요' : 
                   '꽤 멀리 있어요'}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-400">
                마커를 클릭하여 MBTI 정보를 확인하세요
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GPS 동의 팝업 (중간, 작게) */}
      {showConsentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="bg-black border-2 border-cyan-500/50 rounded-2xl p-5 max-w-sm w-full space-y-3">
            {/* 제목 */}
            <h2
              className="text-lg font-bold text-center"
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                color: "#00f0ff",
                textShadow: "0 0 15px rgba(0, 240, 255, 0.6)",
              }}
            >
              지금, 이 골목을 보기위해
              <br />
              GPS를 수동으로 켜주세요.
            </h2>

            <div className="border-t border-gray-700" />

            {/* 설명 */}
            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <p>
                위치 정확도는 해당 서비스에 대해
                <br />
                개인화한 위치 정보를 제공합니다.
                <br />
                정확한 개인식별은 불가합니다.
              </p>
              <p>
                해당 웹사이트에서는 현재 위치를
                <br />
                기준으로 주변의 분포를 가상계산합니다.
                <br />
                정확한 좌표는 어디에도 공개하지 않습니다.
                <br />
                점이 아닌, 범위로 표시합니다.
              </p>
            </div>

            <div className="border-t border-gray-700" />

            <p className="text-xs text-gray-400 text-center">
              동의하면, 지금 이 근처를 바로 보여드립니다.
              <br />
              <br />
              언제든지 위치 설정에서 이 설정을 변경할수 있습니다.
            </p>

            <div className="border-t border-gray-700" />

            {/* 버튼 */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => handleConsent(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-600 text-gray-400 text-sm hover:bg-gray-900 transition-all"
              >
                미동의
              </button>
              <button
                onClick={() => handleConsent(true)}
                className="flex-1 py-2 px-4 rounded-lg border-2 text-sm transition-all"
                style={{
                  borderColor: "#00f0ff",
                  color: "#00f0ff",
                  boxShadow: "0 0 20px rgba(0, 240, 255, 0.6)",
                }}
              >
                동의
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
