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
  ISTJ: "#00ff9f", ISFJ: "#00ffb8", ESTJ: "#00ffd1", ESFJ: "#00ffea",
  ISTP: "#ff0080", ISFP: "#ff0099", ESTP: "#ff00b3", ESFP: "#ff00cc"
};

// 더미 데이터 생성
const generateDummyData = (center: google.maps.LatLngLiteral) => {
  const data = [];
  for (let i = 0; i < 30; i++) {
    const mbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
    const lat = center.lat + (Math.random() - 0.5) * 0.02;
    const lng = center.lng + (Math.random() - 0.5) * 0.02;
    data.push({ mbti, lat, lng, id: i });
  }
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

  // GPS 동의 처리
  const handleConsent = useCallback((agreed: boolean) => {
    setShowConsentPopup(false);

    if (!agreed) {
      window.location.href = "/";
      return;
    }

    if (!navigator.geolocation) {
      toast.info("📍 GPS를 켜주시고 새로고침 해주세요", { duration: 5000 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        
        if (mapRef.current) {
          mapRef.current.setCenter(newLocation);
        }

        // 사용자 마커 업데이트
        if (userMarkerRef.current && mapRef.current) {
          userMarkerRef.current.position = newLocation;
        }

        toast.success("✅ 내 위치로 이동했어요!", { duration: 3000 });
      },
      (error) => {
        console.log("GPS error:", error);
        toast.info("📍 GPS를 켜주시고 새로고침 해주세요", { duration: 5000 });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  // 지도 준비 완료 시 마커 생성
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    const center = userLocation || HONGDAE_CENTER;

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
    const dummyData = generateDummyData(center);
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
  }, [userLocation]);

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
