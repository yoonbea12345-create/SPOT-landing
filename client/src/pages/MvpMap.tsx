import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapView } from "@/components/Map";
import { Toaster, toast } from "sonner";

type Screen = "splash" | "map";

export default function MvpMap() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // 홍대입구역 기본 위치
  const HONGDAE_CENTER = { lat: 37.5566, lng: 126.9236 };

  // 화면 높이 계산 (모바일 짤림 방지)
  const [screenHeight, setScreenHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 스플래시 → 지도 전환 (2초 후)
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen("map");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 지도 표시 후 0.8초 뒤 GPS 동의 팝업
  useEffect(() => {
    if (screen === "map") {
      const timer = setTimeout(() => {
        setShowConsentPopup(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // GPS 동의 처리
  const handleConsent = useCallback((agreed: boolean) => {
    setShowConsentPopup(false);

    if (!agreed) {
      // 미동의 시 홈으로 이동
      window.location.href = "/";
      return;
    }

    // 동의 시 GPS 체크
    if (!navigator.geolocation) {
      // GPS 미지원 브라우저
      toast.info("📍 GPS를 켜주시고 새로고침 해주세요", {
        duration: 5000,
      });
      return;
    }

    // GPS 위치 요청
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // GPS 성공 - 위치 변경
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        
        // 지도 중심 이동
        if (mapRef.current) {
          mapRef.current.setCenter(newLocation);
        }

        toast.success("✅ 내 위치로 이동했어요!", {
          duration: 3000,
        });
      },
      (error) => {
        // GPS 실패 - 새로고침 안내
        console.log("GPS error:", error);
        toast.info("📍 GPS를 켜주시고 새로고침 해주세요", {
          duration: 5000,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  // 스플래시 화면
  if (screen === "splash") {
    return (
      <div
        className="fixed inset-0 bg-black flex flex-col items-center justify-center"
        style={{ height: `${screenHeight}px` }}
      >
        <h1
          className="text-6xl font-bold mb-8"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: "#00f0ff",
            textShadow: "0 0 30px rgba(0, 240, 255, 0.8)",
          }}
        >
          SPOT
        </h1>
        <p
          className="text-lg text-gray-400 text-center px-6"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          곳목 위치 파악을 위해
          <br />
          GPS를 켜주세요.
        </p>
      </div>
    );
  }

  // 지도 화면
  return (
    <div
      className="fixed inset-0 bg-black"
      style={{ height: `${screenHeight}px` }}
    >
      <Toaster position="top-center" />
      
      {/* 상단 헤더 */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
        }}
      >
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
        <p
          className="text-sm text-gray-400"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          내 주변 같은 MBTI 찾기
        </p>
      </div>

      {/* 지도 */}
      <MapView
        className="w-full h-full"
        initialCenter={userLocation || HONGDAE_CENTER}
        initialZoom={15}
        onMapReady={(map) => {
          mapRef.current = map;
        }}
      />

      {/* GPS 동의 팝업 (최소 크기, 하단) */}
      {showConsentPopup && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20 p-4"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.8))",
          }}
        >
          <div className="max-w-md mx-auto space-y-3">
            {/* 제목 */}
            <h2
              className="text-lg font-bold text-center"
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                color: "#00f0ff",
                textShadow: "0 0 15px rgba(0, 240, 255, 0.6)",
              }}
            >
              곳목 위치 파악을 위해
              <br />
              위치 정확도가 필요해요
            </h2>

            {/* 설명 */}
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              위치 정확도는 개인화한 위치 정보를 제공합니다.
              <br />
              정확한 개인식별은 불가하며, 좌표는 공개되지 않습니다.
            </p>

            {/* 버튼 */}
            <div className="flex gap-3 pt-2">
              {/* 미동의 */}
              <button
                onClick={() => handleConsent(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-600 text-gray-400 text-sm hover:bg-gray-900 transition-all"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}
              >
                미동의
              </button>

              {/* 동의 */}
              <button
                onClick={() => handleConsent(true)}
                className="flex-1 py-2 px-4 rounded-lg border-2 text-sm transition-all"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  borderColor: "#00f0ff",
                  color: "#00f0ff",
                  boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)",
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
