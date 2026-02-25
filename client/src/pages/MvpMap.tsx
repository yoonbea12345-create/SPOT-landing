/**
 * MVP Map Page - MBTI 기반 위치 지도
 * 디자인 컨셉: 랜딩 페이지와 동일한 다크 모드 + 네온 액센트
 */

import { useEffect, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// MBTI 타입 정의
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

// MBTI별 색상 (네온 컬러)
const MBTI_COLORS: Record<string, string> = {
  INTJ: "#00f5ff", // cyan
  INTP: "#00d4ff",
  ENTJ: "#00b8ff",
  ENTP: "#009cff",
  INFJ: "#bf00ff", // purple
  INFP: "#d400ff",
  ENFJ: "#e900ff",
  ENFP: "#ff00e5",
  ISTJ: "#00ff9f", // green
  ISFJ: "#00ffb8",
  ESTJ: "#00ffd1",
  ESFJ: "#00ffea",
  ISTP: "#ff0080", // magenta
  ISFP: "#ff0099",
  ESTP: "#ff00b3",
  ESFP: "#ff00cc"
};

// 더미 데이터 (MVP용 - 나중에 백엔드 연동)
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
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<{mbti: string, distance: number} | null>(null);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setIsLoading(false);
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          // 기본 위치: 서울 강남역
          setUserLocation({ lat: 37.4979, lng: 127.0276 });
          setIsLoading(false);
        }
      );
    } else {
      // 기본 위치: 서울 강남역
      setUserLocation({ lat: 37.4979, lng: 127.0276 });
      setIsLoading(false);
    }
  }, []);

  // 지도 준비 완료 시 마커 생성
  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    
    if (!userLocation) return;

    // 더미 데이터 생성
    const dummyData = generateDummyData(userLocation);

    // 마커 생성
    dummyData.forEach((item) => {
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${MBTI_COLORS[item.mbti]}22;
        border: 3px solid ${MBTI_COLORS[item.mbti]};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 10px;
        color: ${MBTI_COLORS[item.mbti]};
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 20px ${MBTI_COLORS[item.mbti]}88;
      `;
      markerElement.textContent = item.mbti;

      // hover 효과
      markerElement.addEventListener("mouseenter", () => {
        markerElement.style.transform = "scale(1.3)";
        markerElement.style.boxShadow = `0 0 30px ${MBTI_COLORS[item.mbti]}`;
      });
      markerElement.addEventListener("mouseleave", () => {
        markerElement.style.transform = "scale(1)";
        markerElement.style.boxShadow = `0 0 20px ${MBTI_COLORS[item.mbti]}88`;
      });

      // 클릭 시 거리 계산 및 정보 표시
      markerElement.addEventListener("click", () => {
        if (userLocation && window.google?.maps?.geometry) {
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(userLocation.lat, userLocation.lng),
            new google.maps.LatLng(item.lat, item.lng)
          );
          setSelectedMarker({
            mbti: item.mbti,
            distance: Math.round(distance)
          });
        }
      });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: item.lat, lng: item.lng },
        content: markerElement,
      });

      markersRef.current.push(marker);
    });

    // 사용자 위치 마커 (특별한 스타일)
    const userMarkerElement = document.createElement("div");
    userMarkerElement.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      border: 4px solid #00f5ff;
      box-shadow: 0 0 30px #00f5ff;
      animation: pulse 2s infinite;
    `;

    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: userLocation,
      content: userMarkerElement,
    });
  };

  // MBTI 필터링
  const filterByMBTI = (mbti: string) => {
    if (selectedMBTI === mbti) {
      // 필터 해제
      setSelectedMBTI(null);
      markersRef.current.forEach(marker => {
        if (marker.content instanceof HTMLElement) {
          marker.content.style.opacity = "1";
        }
      });
    } else {
      // 필터 적용
      setSelectedMBTI(mbti);
      markersRef.current.forEach(marker => {
        if (marker.content instanceof HTMLElement) {
          const markerMBTI = marker.content.textContent;
          marker.content.style.opacity = markerMBTI === mbti ? "1" : "0.15";
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black text-primary glow-cyan mb-4">SPOT</div>
          <div className="text-lg opacity-70">위치 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-black text-primary glow-cyan hover:scale-110 transition-transform">
              SPOT
            </a>
          </Link>
          <div className="text-sm opacity-70">
            내 주변 같은 MBTI 찾기
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pt-20 h-screen flex flex-col">
        {/* MBTI 필터 바 */}
        <div className="bg-background/95 backdrop-blur-lg border-b border-primary/20 p-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {MBTI_TYPES.map((mbti) => (
              <Button
                key={mbti}
                onClick={() => filterByMBTI(mbti)}
                variant="outline"
                size="sm"
                className={`
                  font-black text-xs transition-all
                  ${selectedMBTI === mbti 
                    ? 'border-2 scale-110 shadow-lg' 
                    : 'opacity-60 hover:opacity-100'
                  }
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
            initialCenter={userLocation || { lat: 37.4979, lng: 127.0276 }}
            initialZoom={15}
            onMapReady={handleMapReady}
          />

          {/* 하단 정보 카드 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-lg border border-primary/30 rounded-2xl px-6 py-4 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              {selectedMarker ? (
                <>
                  <div className="text-2xl font-black mb-2" style={{color: MBTI_COLORS[selectedMarker.mbti]}}>
                    {selectedMarker.mbti}
                  </div>
                  <div className="text-sm opacity-70 mb-1">
                    거리: <span className="font-bold text-primary">{selectedMarker.distance}m</span>
                  </div>
                  <div className="text-xs opacity-50">
                    {selectedMarker.distance < 100 ? '바로 옆이네요!' : 
                     selectedMarker.distance < 500 ? '가까운 거리에요' : 
                     selectedMarker.distance < 1000 ? '조금만 걸어가면 돼요' : 
                     '꽤 멀리 있어요'}
                  </div>
                  <Button
                    onClick={() => setSelectedMarker(null)}
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs opacity-50 hover:opacity-100"
                  >
                    닫기
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-sm opacity-70 mb-2">
                    {selectedMBTI ? `${selectedMBTI} 타입만 표시 중` : '모든 MBTI 타입 표시 중'}
                  </div>
                  <div className="text-xs opacity-50">
                    마커를 클릭하거나 위의 MBTI 버튼으로 필터링하세요
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
