import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
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

// MOOD 목록
const MOOD_LIST = [
  "HAPPY", "CHILL", "EXCITED", "LONELY", "BORED",
  "HYPED", "PEACEFUL", "CURIOUS", "MELANCHOLY", "ENERGETIC",
  "NOSTALGIC", "FOCUSED", "DREAMY", "RESTLESS", "CONTENT"
];

// MODE 목록
const MODE_LIST = [
  "산책 중", "카페 탐방", "운동 중", "쇼핑 중", "맛집 투어",
  "혼자만의 시간", "친구 만남", "데이트", "공부 중", "드라이브",
  "전시 관람", "야경 구경", "음악 감상", "독서 중", "그냥 배회 중"
];

// SIGN 목록 (랜덤 문구)
const SIGN_LIST = [
  "모두 안녕하세요",
  "오늘 날씨 좋다",
  "누군가 말 걸어줘요",
  "같이 커피 마실 사람?",
  "여기 자주 와요",
  "오늘 기분 좋음",
  "지나가는 중",
  "이 동네 처음이에요",
  "맛집 추천 받아요",
  "혼자가 편한 날",
  "반가워요 :)",
  "오늘도 열심히",
  "좋은 하루 되세요",
  "여기 분위기 좋네요",
  "우연히 마주치면 반가워요"
];

// 더미 데이터 타입
type DummyMarker = {
  mbti: string;
  lat: number;
  lng: number;
  id: number;
  mood: string;
  mode: string;
  sign: string;
};

// 더미 데이터 생성 (주요 도시 집약 + 전국 무작위 분포)
const generateDummyData = (): DummyMarker[] => {
  const data: DummyMarker[] = [];
  let id = 0;
  
  // 대한민국 주요 도시 및 지역 (38개)
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
  
  // 제주도 육지 경계 체크 함수
  const isJejuLand = (lat: number, lng: number): boolean => {
    if (lat < 33.20 || lat > 33.56 || lng < 126.15 || lng > 126.97) return false;
    if (lat > 33.52) return false;
    if (lat < 33.22) return false;
    if (lng > 126.85 && lat > 33.45) return false;
    if (lng > 126.90 && lat < 33.30) return false;
    if (lng < 126.25 && lat > 33.45) return false;
    if (lng < 126.20 && lat < 33.35) return false;
    return true;
  };

  cities.forEach((city) => {
    const count = Math.floor(Math.random() * (city.count[1] - city.count[0] + 1)) + city.count[0];
    for (let i = 0; i < count; i++) {
      const mbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
      const mood = MOOD_LIST[Math.floor(Math.random() * MOOD_LIST.length)];
      const mode = MODE_LIST[Math.floor(Math.random() * MODE_LIST.length)];
      const sign = SIGN_LIST[Math.floor(Math.random() * SIGN_LIST.length)];
      
      let lat, lng;
      if (city.name === "제주시" || city.name === "서귀포") {
        let attempts = 0;
        do {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 0.06;
          lat = city.lat + Math.sin(angle) * dist;
          lng = city.lng + Math.cos(angle) * dist;
          attempts++;
        } while (!isJejuLand(lat, lng) && attempts < 20);
        if (!isJejuLand(lat, lng)) {
          lat = city.lat + (Math.random() - 0.5) * 0.02;
          lng = city.lng + (Math.random() - 0.5) * 0.02;
        }
      } else {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.6) * 0.18;
        lat = city.lat + Math.sin(angle) * dist;
        lng = city.lng + Math.cos(angle) * dist;
      }
      
      data.push({ mbti, lat, lng, id: id++, mood, mode, sign });
    }
  });
  
  // 홍대 기본 위치 1m 앞에 ENFP 고정 (랜딩페이지 예시용)
  data.push({ 
    mbti: "ENFP", 
    lat: 37.5566 + 0.000009, 
    lng: 126.9236, 
    id: id++,
    mood: "HAPPY",
    mode: "산책 중",
    sign: "모두 안녕하세요"
  });
  
  return data;
};

// 팝업 데이터 타입
type PopupData = {
  mbti: string;
  mood: string;
  mode: string;
  sign: string;
  distance: number;
  lat: number;
  lng: number;
  color: string; // MBTI 색상
  screenX: number; // 클릭한 마커의 화면 X 좌표
  screenY: number; // 클릭한 마커의 화면 Y 좌표
};

// 실제 스팟 입력 폼 타입
type SpotFormData = {
  mbti: string;
  mood: string;
  mode: string;
  sign: string;
};

export default function MvpMap() {
  const [screen, setScreen] = useState<Screen>("splash");
  const trackGps = trpc.log.trackGps.useMutation();
  const trackEvent = trpc.log.trackEvent.useMutation();
  const submitSpot = trpc.spot.submit.useMutation();
  const { data: spotsData, refetch: refetchSpots } = trpc.spot.getAll.useQuery(undefined, { refetchInterval: 30000 });
  const mvpLogIdRef = useRef<number | null>(null);
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [spotFormData, setSpotFormData] = useState<SpotFormData>({ mbti: "", mood: "", mode: "", sign: "" });
  const [spotSubmitted, setSpotSubmitted] = useState(false);
  const realSpotMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<{mbti: string, distance: number} | null>(null);
  // 팝업 상태
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [popupAddress, setPopupAddress] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const cityLabelsRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState(15);

  // 초기 지도 시점: 서울 중심부 (홍대~서울역~경복궁 구간)
  const HONGDAE_CENTER = { lat: 37.5400, lng: 126.9700 };

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
    const checkLogId = () => {
      const id = Number(sessionStorage.getItem('spotLogId_/mvp') || sessionStorage.getItem('spotLogId') || '0');
      if (id) mvpLogIdRef.current = id;
    };
    const idTimer = setTimeout(checkLogId, 500);
    const timer = setTimeout(() => setScreen("map"), 2000);
    return () => { clearTimeout(timer); clearTimeout(idTimer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 지도 표시 후 3.8초 뒤 GPS 동의 팝업
  useEffect(() => {
    if (screen === "map") {
      const timer = setTimeout(() => setShowConsentPopup(true), 3800);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // 지도 진입 후 11초 뒤 스팟 입력 팝업 (아직 제출 안 한 경우만)
  useEffect(() => {
    if (screen === "map" && !spotSubmitted) {
      const timer = setTimeout(() => {
        setShowSpotForm(true);
      }, 11000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // GPS 동의 처리 - 이벤트 트래킹은 비동기로 실행하고 GPS는 즉시 시작
  const handleConsent = useCallback((agreed: boolean) => {
    setShowConsentPopup(false);

    // 이벤트 트래킹은 GPS와 독립적으로 비동기 실행 (대기 없음)
    trackEvent.mutate({ eventName: agreed ? 'click_GPS_동의' : 'click_GPS_미동의', page: '/mvp' });

    if (!navigator.geolocation) {
      if (agreed) toast.error("📍 이 브라우저는 GPS를 지원하지 않습니다.", { duration: 5000 });
      return;
    }

    // 이미 추적 중이면 중복 방지
    if (watchIdRef.current !== null) return;

    const isFirstRef = { current: true };

    const onSuccess = (position: GeolocationPosition) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setUserLocation(newLocation);

      if (userMarkerRef.current) {
        userMarkerRef.current.position = newLocation;
      }

      if (isFirstRef.current) {
        isFirstRef.current = false;

        if (mapRef.current) {
          mapRef.current.setCenter(newLocation);
          mapRef.current.setZoom(15);
        }

        if (agreed) {
          toast.dismiss('gps-loading');
          toast.success("✅ 내 위치로 이동했어요!", { duration: 2000 });
        }

        // GPS 좌표 서버 저장 (1회)
        const saveGps = (id: number) => {
          trackGps.mutate({ logId: id, lat: newLocation.lat, lng: newLocation.lng });
        };
        const latestLogId = Number(sessionStorage.getItem('spotLogId_/mvp') || sessionStorage.getItem('spotLogId') || '0');
        if (latestLogId) mvpLogIdRef.current = latestLogId;
        const existingLogId = mvpLogIdRef.current;
        if (existingLogId) {
          saveGps(existingLogId);
        } else {
          fetch('/api/trpc/log.track?batch=1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ "0": { json: { pathname: '/mvp' } } }),
          }).then(r => r.json()).then(data => {
            const newLogId = data?.[0]?.result?.data?.json?.logId;
            if (newLogId) {
              mvpLogIdRef.current = newLogId;
              saveGps(newLogId);
            }
          }).catch(() => {});
        }
      }
    };

    const onError = (error: GeolocationPositionError) => {
      console.log("GPS watch error:", error);
      toast.dismiss('gps-loading');
      if (agreed) {
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("📍 GPS 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.", { duration: 5000 });
        } else {
          toast.error("📍 GPS를 켜주시고 다시 시도해주세요.", { duration: 5000 });
        }
      }
      watchIdRef.current = null;
    };

    if (agreed) {
      toast.loading("📍 GPS 연결 중...", { id: 'gps-loading', duration: 10000 });
    }

    // 1단계: 저정밀 모드로 즉시 첫 응답 수신 (enableHighAccuracy: false → 빠름)
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      (error) => {
        // 저정밀 실패 시 고정밀로 폴백
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        // 고정밀 모드로 재시도
        watchIdRef.current = navigator.geolocation.watchPosition(
          onSuccess,
          onError,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      },
      // 저정밀: 네트워크/WiFi 기반 위치 즉시 응답 (1~2초)
      { enableHighAccuracy: false, timeout: 3000, maximumAge: 5000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackEvent]);

  // 컴포넌트 언마운트 시 GPS 추적 중지
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

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

    // 더미 데이터 마커 (반경원 스타일 - 작고 채워진 원, MBTI 텍스트 없음)
    const dummyData = generateDummyData();
    dummyData.forEach((item) => {
      const color = MBTI_COLORS[item.mbti];
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      // 기존보다 작은 원, 테두리 색 동일, 내부 반투명 채움, 텍스트 없음
      markerElement.style.cssText = `
        width: 22px;
        height: 22px;
        background: ${color}33;
        border: 2px solid ${color};
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 0 8px ${color}55;
      `;
      // data 속성으로 MBTI 저장 (필터링용)
      markerElement.dataset.mbti = item.mbti;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: item.lat, lng: item.lng },
        content: markerElement,
        title: item.mbti,
      });

      // 클릭 시 팝업 표시
      markerElement.addEventListener("click", (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const distance = Math.round(
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(center.lat, center.lng),
            new google.maps.LatLng(item.lat, item.lng)
          )
        );
        setSelectedMarker({ mbti: item.mbti, distance });
        setPopupAddress(null);
        setPopupData({
          mbti: item.mbti,
          mood: item.mood,
          mode: item.mode,
          sign: item.sign,
          distance,
          lat: item.lat,
          lng: item.lng,
          color: MBTI_COLORS[item.mbti] || '#00f0ff',
          screenX: mouseEvent.clientX,
          screenY: mouseEvent.clientY,
        });
        // 역지오코딩으로 주소 가져오기
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: item.lat, lng: item.lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const components = results[0].address_components;
            const get = (type: string) => components.find(c => c.types.includes(type))?.long_name || '';
            const si = get('administrative_area_level_1') || get('locality');
            const gu = get('sublocality_level_1') || get('administrative_area_level_2');
            const dong = get('sublocality_level_2') || get('sublocality_level_3') || get('neighborhood');
            const addr = [si, gu, dong].filter(Boolean).join(' ');
            setPopupAddress(addr || results[0].formatted_address.split(',')[0]);
          }
        });
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

  // 실제 스팟 마커를 지도에 추가
  const addRealSpotMarker = useCallback((spot: { id: number; mbti: string; mood: string; mode: string; sign: string; lat: number; lng: number }, map: google.maps.Map) => {
    const color = MBTI_COLORS[spot.mbti.toUpperCase()] || '#00f0ff';
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.dataset.mbti = spot.mbti.toUpperCase();
    // 실제 유저 마커: 더 밝고 리폄 있는 원 (glow 강함)
    el.style.cssText = `
      width: 22px;
      height: 22px;
      background: ${color}55;
      border: 2.5px solid ${color};
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 14px ${color}99, 0 0 4px ${color};
      transition: all 0.2s;
    `;
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: spot.lat, lng: spot.lng },
      content: el,
      title: spot.mbti,
    });
    el.addEventListener('click', (e: Event) => {
      const me = e as MouseEvent;
      const ref = userLocation || HONGDAE_CENTER;
      const distance = Math.round(
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(ref.lat, ref.lng),
          new google.maps.LatLng(spot.lat, spot.lng)
        )
      );
      setSelectedMarker({ mbti: spot.mbti.toUpperCase(), distance });
      setPopupAddress(null);
      setPopupData({
        mbti: spot.mbti.toUpperCase(),
        mood: spot.mood,
        mode: spot.mode,
        sign: spot.sign,
        distance,
        lat: spot.lat,
        lng: spot.lng,
        color: MBTI_COLORS[spot.mbti.toUpperCase()] || '#00f0ff',
        screenX: me.clientX,
        screenY: me.clientY,
      });
      // 역지오코딩으로 주소 가져오기
      const geocoder2 = new google.maps.Geocoder();
      geocoder2.geocode({ location: { lat: spot.lat, lng: spot.lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const components = results[0].address_components;
          const get = (type: string) => components.find(c => c.types.includes(type))?.long_name || '';
          const si = get('administrative_area_level_1') || get('locality');
          const gu = get('sublocality_level_1') || get('administrative_area_level_2');
          const dong = get('sublocality_level_2') || get('sublocality_level_3') || get('neighborhood');
          const addr = [si, gu, dong].filter(Boolean).join(' ');
          setPopupAddress(addr || results[0].formatted_address.split(',')[0]);
        }
      });
    });
    realSpotMarkersRef.current.push(marker);
  }, [userLocation]);

  // DB에서 스팟 데이터 로드 시 마커 업데이트
  useEffect(() => {
    if (!spotsData?.spots || !mapRef.current) return;
    // 기존 실제 스팟 마커 제거
    realSpotMarkersRef.current.forEach(m => { m.map = null; });
    realSpotMarkersRef.current = [];
    // 새로 추가
    spotsData.spots.forEach(spot => {
      if (mapRef.current) addRealSpotMarker(spot, mapRef.current);
    });
  }, [spotsData, addRealSpotMarker]);

  // 줄 레벨 슬라이더
  useEffect(() => {
    const isZoomedOut = currentZoom < 12;

    markersRef.current.forEach(marker => {
      if (marker.content instanceof HTMLElement) {
        marker.content.style.opacity = isZoomedOut ? '0' : '1';
      }
    });

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
          const markerMBTI = (marker.content as HTMLElement).dataset.mbti;
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
          initialZoom={13}
          onMapReady={handleMapReady}
        />

        {/* 줄 레벨 슬라이더 */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/95 backdrop-blur-lg border-2 border-cyan-500/50 rounded-2xl p-3 shadow-2xl" style={{boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)"}}>
          <div className="text-center mb-3">
            <div className="text-xs font-black" style={{
              color: currentZoom >= 18 ? '#ff00ff' : currentZoom >= 12 ? '#9d4edd' : '#00f0ff',
              textShadow: `0 0 10px ${currentZoom >= 18 ? '#ff00ff88' : currentZoom >= 12 ? '#9d4edd88' : '#00f0ff88'}`,
              transition: 'all 0.3s'
            }}>
              {currentZoom >= 18 ? '3M' : currentZoom >= 12 ? 'NEAR' : 'WIDE'}
            </div>
          </div>
          
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        {/* 하단 정보 안내 텍스트 */}
        {!selectedMarker && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-500/20 rounded-xl px-4 py-2 shadow-lg">
            <div className="text-xs text-gray-400 whitespace-nowrap">
              마커를 클릭하여 MBTI 정보를 확인하세요
            </div>
          </div>
        )}
      </div>

      {/* ─── 말풍선 팝업 ─── */}
      {popupData && (() => {
        // 팝업 크기 (px)
        const PW = 220;
        const PH = 200; // 대략적 높이
        const TAIL = 10; // 말풍선 코 높이
        const MARGIN = 8;

        // 화면 경계 내에서 팝업 위치 계산
        let left = popupData.screenX - PW / 2;
        let top = popupData.screenY - PH - TAIL - 4;
        let tailBelow = false; // 코가 아래로 향하는 기본

        // 위에 공간이 부족하면 아래로
        if (top < MARGIN) {
          top = popupData.screenY + TAIL + 4;
          tailBelow = true;
        }
        // 좌우 경계 보정
        if (left < MARGIN) left = MARGIN;
        if (left + PW > window.innerWidth - MARGIN) left = window.innerWidth - PW - MARGIN;

        // 코 X 위치 (0~1 비율)
        const tailX = Math.min(Math.max(popupData.screenX - left, 16), PW - 16);

        return (
          <>
            {/* 외부 클릭 시 닫기 오버레이 (배경 흐림 없음) */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setPopupData(null)}
            />
            {/* 말풍선 컨테이너 */}
            <div
              className="fixed z-50"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${PW}px`,
                pointerEvents: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 코 (위에 있을 때 - 아래로 향하는 코) */}
              {!tailBelow && (
                <div style={{
                  position: 'absolute',
                  bottom: -TAIL,
                  left: tailX,
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: `${TAIL}px solid ${MBTI_COLORS[popupData.mbti]}99`,
                  zIndex: 1,
                }} />
              )}

              {/* 팝업 본체 */}
              <div
                style={{
                  background: 'rgba(4, 4, 14, 0.97)',
                  border: `1.5px solid ${MBTI_COLORS[popupData.mbti]}99`,
                  borderRadius: '14px',
                  boxShadow: `0 0 24px ${MBTI_COLORS[popupData.mbti]}55, 0 8px 32px rgba(0,0,0,0.9)`,
                  overflow: 'hidden',
                }}
              >
                {/* 헤더: MBTI 뼱지 + 주소 + 거리 + X */}
                <div
                  className="flex items-center justify-between px-3 pt-3 pb-2"
                  style={{ borderBottom: `1px solid ${MBTI_COLORS[popupData.mbti]}22` }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* MBTI 뼱지 */}
                    <div
                      className="px-2 py-0.5 rounded-full text-xs font-black tracking-widest flex-shrink-0"
                      style={{
                        background: `${MBTI_COLORS[popupData.mbti]}22`,
                        border: `1.5px solid ${MBTI_COLORS[popupData.mbti]}`,
                        color: MBTI_COLORS[popupData.mbti],
                        boxShadow: `0 0 8px ${MBTI_COLORS[popupData.mbti]}66`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {popupData.mbti}
                    </div>
                    {/* 주소 + 거리 */}
                    <div className="flex flex-col gap-0 min-w-0">
                      <div className="text-[10px] font-bold text-gray-300 truncate">
                        {popupAddress ?? '위치 확인 중...'}
                      </div>
                      <div className="text-[9px]" style={{ color: '#888' }}>
                        {popupData.distance < 1000 ? `${popupData.distance}m` : `${(popupData.distance / 1000).toFixed(1)}km`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPopupData(null)}
                    className="text-gray-600 hover:text-gray-300 transition-colors text-xs leading-none ml-2 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* 4가지 성향 그리드 (TYPE/MOOD/MODE/SIGN) */}
                <div className="p-2 flex flex-col gap-1.5">
                  {/* 최상단 행: TYPE 전체 너비 */}
                  <div
                    className="rounded-xl p-2"
                    style={{
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                    }}
                  >
                    <div className="text-[9px] font-bold text-gray-600 mb-0.5 tracking-widest">#TYPE</div>
                    <div
                      className="text-xs font-black"
                      style={{
                        color: popupData.color || '#00f0ff',
                        textShadow: `0 0 8px ${popupData.color || '#00f0ff'}99`,
                      }}
                    >
                      {popupData.mbti}
                    </div>
                  </div>

                  {/* 중간 행: MOOD + MODE */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* #MOOD */}
                    <div
                      className="rounded-xl p-2"
                      style={{
                        background: 'rgba(157, 78, 221, 0.08)',
                        border: '1px solid rgba(157, 78, 221, 0.3)',
                      }}
                    >
                      <div className="text-[9px] font-bold text-gray-600 mb-0.5 tracking-widest">#MOOD</div>
                      <div
                        className="text-xs font-black"
                        style={{
                          color: '#c77dff',
                          textShadow: '0 0 8px rgba(199, 125, 255, 0.7)',
                        }}
                      >
                        {popupData.mood}
                      </div>
                    </div>

                    {/* #MODE */}
                    <div
                      className="rounded-xl p-2"
                      style={{
                        background: 'rgba(0, 240, 180, 0.08)',
                        border: '1px solid rgba(0, 240, 180, 0.3)',
                      }}
                    >
                      <div className="text-[9px] font-bold text-gray-600 mb-0.5 tracking-widest">#MODE</div>
                      <div
                        className="text-xs font-black leading-tight"
                        style={{
                          color: '#00f0b4',
                          textShadow: '0 0 8px rgba(0, 240, 180, 0.7)',
                        }}
                      >
                        {popupData.mode}
                      </div>
                    </div>
                  </div>

                  {/* 하단 행: SIGN 전체 너비 */}
                  <div
                    className="rounded-xl p-2"
                    style={{
                      background: 'rgba(255, 200, 0, 0.08)',
                      border: '1px solid rgba(255, 200, 0, 0.3)',
                    }}
                  >
                    <div className="text-[9px] font-bold text-gray-600 mb-0.5 tracking-widest">#SIGN</div>
                    <div
                      className="text-[10px] font-bold leading-snug"
                      style={{
                        color: '#ffc800',
                        textShadow: '0 0 6px rgba(255, 200, 0, 0.6)',
                      }}
                    >
                      "{popupData.sign}"
                    </div>
                  </div>
                </div>
              </div>

              {/* 코 (아래에 있을 때 - 위로 향하는 코) */}
              {tailBelow && (
                <div style={{
                  position: 'absolute',
                  top: -TAIL,
                  left: tailX,
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: `${TAIL}px solid ${MBTI_COLORS[popupData.mbti]}99`,
                  zIndex: 1,
                }} />
              )}
            </div>
          </>
        );
      })()}

      {/* 스팟 입력 팝업 (11초 후) */}
      {showSpotForm && !spotSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: 'rgba(0,0,0,0.7)'}}>
          <div
            style={{
              background: 'rgba(4, 4, 14, 0.98)',
              border: '2px solid rgba(0, 240, 255, 0.5)',
              borderRadius: '20px',
              padding: '28px 24px',
              width: '320px',
              maxWidth: '90vw',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.3)',
            }}
          >
            {/* 제목 */}
            <p
              className="text-center font-bold mb-6"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 12px rgba(0, 240, 255, 0.7)',
                fontSize: '15px',
                lineHeight: '1.6',
              }}
            >
              사용자님의 현재를<br />
              지도 위에 표시해봐요!!
            </p>

            {/* MBTI - 자동완성 드롭다운 */}
            <div className="mb-4 relative">
              <label className="block text-center text-xs font-bold mb-1" style={{color: '#00f0ff', letterSpacing: '0.15em'}}>#TYPE (MBTI)</label>
              <input
                type="text"
                value={spotFormData.mbti}
                onChange={e => {
                  const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
                  setSpotFormData(p => ({...p, mbti: val}));
                }}
                placeholder="ex) ENFP"
                maxLength={4}
                autoComplete="off"
                className="w-full text-center rounded-lg px-3 py-2 text-sm font-bold outline-none"
                style={{
                  background: 'rgba(0, 240, 255, 0.07)',
                  border: `1.5px solid ${MBTI_TYPES.includes(spotFormData.mbti) ? '#00f0ff' : spotFormData.mbti.length === 4 ? '#ff4444' : 'rgba(0, 240, 255, 0.4)'}`,
                  color: '#00f0ff',
                }}
              />
              {/* 유효성 메시지 */}
              {spotFormData.mbti.length === 4 && !MBTI_TYPES.includes(spotFormData.mbti) && (
                <div className="text-center text-[10px] mt-1" style={{color: '#ff4444'}}>올바른 MBTI 유형이 아닙니다</div>
              )}
              {spotFormData.mbti.length === 4 && MBTI_TYPES.includes(spotFormData.mbti) && (
                <div className="text-center text-[10px] mt-1" style={{color: '#00f0ff'}}>✓ {spotFormData.mbti}</div>
              )}
              {/* 자동완성 드롭다운 */}
              {spotFormData.mbti.length > 0 && spotFormData.mbti.length < 4 && (
                <div
                  className="absolute left-0 right-0 z-10 rounded-lg overflow-hidden"
                  style={{
                    top: '100%',
                    marginTop: '2px',
                    background: 'rgba(4, 4, 14, 0.98)',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
                  }}
                >
                  {MBTI_TYPES.filter(t => t.startsWith(spotFormData.mbti)).map(t => (
                    <div
                      key={t}
                      className="px-3 py-2 text-sm font-bold text-center cursor-pointer"
                      style={{ color: '#00f0ff' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,240,255,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onMouseDown={e => {
                        e.preventDefault();
                        setSpotFormData(p => ({...p, mbti: t}));
                      }}
                    >
                      {t}
                    </div>
                  ))}
                  {MBTI_TYPES.filter(t => t.startsWith(spotFormData.mbti)).length === 0 && (
                    <div className="px-3 py-2 text-xs text-center" style={{color: '#666'}}>일치하는 MBTI 없음</div>
                  )}
                </div>
              )}
            </div>

            {/* MOOD */}
            <div className="mb-4">
              <label className="block text-center text-xs font-bold mb-1" style={{color: '#c77dff', letterSpacing: '0.15em'}}>#MOOD</label>
              <input
                type="text"
                value={spotFormData.mood}
                onChange={e => setSpotFormData(p => ({...p, mood: e.target.value}))}
                placeholder="ex) HAPPY"
                maxLength={32}
                className="w-full text-center rounded-lg px-3 py-2 text-sm font-bold outline-none"
                style={{
                  background: 'rgba(199, 125, 255, 0.07)',
                  border: '1.5px solid rgba(199, 125, 255, 0.4)',
                  color: '#c77dff',
                }}
              />
            </div>

            {/* MODE */}
            <div className="mb-4">
              <label className="block text-center text-xs font-bold mb-1" style={{color: '#00f0b4', letterSpacing: '0.15em'}}>#MODE</label>
              <input
                type="text"
                value={spotFormData.mode}
                onChange={e => setSpotFormData(p => ({...p, mode: e.target.value}))}
                placeholder="ex) 산책 중"
                maxLength={32}
                className="w-full text-center rounded-lg px-3 py-2 text-sm font-bold outline-none"
                style={{
                  background: 'rgba(0, 240, 180, 0.07)',
                  border: '1.5px solid rgba(0, 240, 180, 0.4)',
                  color: '#00f0b4',
                }}
              />
            </div>

            {/* SIGN */}
            <div className="mb-6">
              <label className="block text-center text-xs font-bold mb-1" style={{color: '#ffc800', letterSpacing: '0.15em'}}>#SIGN</label>
              <input
                type="text"
                value={spotFormData.sign}
                onChange={e => setSpotFormData(p => ({...p, sign: e.target.value}))}
                placeholder="ex) 모두 안녕하세요"
                maxLength={64}
                className="w-full text-center rounded-lg px-3 py-2 text-sm font-bold outline-none"
                style={{
                  background: 'rgba(255, 200, 0, 0.07)',
                  border: '1.5px solid rgba(255, 200, 0, 0.4)',
                  color: '#ffc800',
                }}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSpotForm(false)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#888' }}
              >
                닫기
              </button>
              <button
                onClick={async () => {
                  const { mbti, mood, mode, sign } = spotFormData;
                  if (!mbti || !mood || !mode || !sign) {
                    toast.error('네 가지를 모두 입력해주세요!');
                    return;
                  }
                  if (!MBTI_TYPES.includes(mbti)) {
                    toast.error('올바른 MBTI 유형을 입력해주세요! (ex: ENFP)');
                    return;
                  }
                  if (!userLocation) {
                    toast.error('현재 위치를 확인할 수 없어요. GPS를 켜주세요.');
                    return;
                  }
                  const result = await submitSpot.mutateAsync({
                    mbti,
                    mood,
                    mode,
                    sign,
                    lat: userLocation.lat,
                    lng: userLocation.lng,
                  });
                  if (result.success) {
                    setSpotSubmitted(true);
                    setShowSpotForm(false);
                    toast.success('📍 내 SPOT이 지도에 표시되었어요!');
                    refetchSpots();
                  } else {
                    toast.error('저장에 실패했어요. 다시 시도해주세요.');
                  }
                }}
                disabled={submitSpot.isPending}
                className="flex-1 py-2 rounded-lg text-sm font-black"
                style={{
                  border: '2px solid #00f0ff',
                  color: '#00f0ff',
                  background: 'rgba(0, 240, 255, 0.1)',
                  boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)',
                  opacity: submitSpot.isPending ? 0.6 : 1,
                }}
              >
                {submitSpot.isPending ? '저장 중...' : '지도에 표시'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GPS 동의 팝업 */}
      {showConsentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="bg-black border-2 border-cyan-500/50 rounded-2xl p-5 max-w-sm w-full space-y-3">
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
