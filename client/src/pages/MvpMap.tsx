/**
 * MVP Map Page - SPOT / Spotlight System
 * 디자인 컨셉: 랜딩 페이지와 동일한 다크 모드 + 네온 액센트
 * 스펙: Wide/Near/3m 모드, 움직임 시뮬레이션, Hotspot 시스템
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// MBTI 타입 정의
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

// MBTI별 색상 (네온 컬러 - 녹색 제외)
const MBTI_COLORS: Record<string, string> = {
  INTJ: "#00f5ff", INTP: "#00d4ff", ENTJ: "#00b8ff", ENTP: "#009cff",
  INFJ: "#bf00ff", INFP: "#d400ff", ENFJ: "#e900ff", ENFP: "#ff00e5",
  ISTJ: "#ff8800", ISFJ: "#ff9900", ESTJ: "#ffaa00", ESFJ: "#ffbb00",
  ISTP: "#ff0080", ISFP: "#ff0099", ESTP: "#ff00b3", ESFP: "#ff00cc"
};

// 한국 주요 도시 좌표
const KOREA_CITIES = [
  { name: "서울", lat: 37.5665, lng: 126.9780 },
  { name: "부산", lat: 35.1796, lng: 129.0756 },
  { name: "대구", lat: 35.8714, lng: 128.6014 },
  { name: "인천", lat: 37.4563, lng: 126.7052 },
  { name: "광주", lat: 35.1595, lng: 126.8526 },
  { name: "대전", lat: 36.3504, lng: 127.3845 },
  { name: "울산", lat: 35.5384, lng: 129.3114 },
  { name: "세종", lat: 36.4800, lng: 127.2890 },
  { name: "제주", lat: 33.4996, lng: 126.5312 },
];

// 서울 주요 구 좌표
const SEOUL_DISTRICTS = [
  { name: "강남구", lat: 37.5172, lng: 127.0473 },
  { name: "서초구", lat: 37.4837, lng: 127.0324 },
  { name: "송파구", lat: 37.5145, lng: 127.1059 },
  { name: "강동구", lat: 37.5301, lng: 127.1238 },
  { name: "마포구", lat: 37.5663, lng: 126.9019 },
  { name: "용산구", lat: 37.5326, lng: 126.9905 },
  { name: "성동구", lat: 37.5634, lng: 127.0368 },
  { name: "광진구", lat: 37.5384, lng: 127.0822 },
  { name: "종로구", lat: 37.5735, lng: 126.9788 },
  { name: "중구", lat: 37.5641, lng: 126.9979 },
];

// Hotspot
const FIXED_HOTSPOTS = [{ name: "홍대입구역", lat: 37.5563, lng: 126.9236 }];
const DYNAMIC_HOTSPOTS = [
  { name: "성수동", lat: 37.5447, lng: 127.0557 },
  { name: "여의도 더현대", lat: 37.5262, lng: 126.9293 },
];

interface Entity {
  id: string;
  mbti: string;
  lat: number;
  lng: number;
  state: "move" | "stop";
  speed: number;
  direction: number;
  lastUpdate: number;
}

export default function MvpMap() {
  const [step, setStep] = useState<"permission" | "loading" | "map">("permission");
  const [loadingMessage, setLoadingMessage] = useState("위치 정보를 불러오는 중...");
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedMbti, setSelectedMbti] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [viewMode, setViewMode] = useState<"wide" | "near" | "3m">("near");
  const [nearbyEntities3m, setNearbyEntities3m] = useState<Entity[]>([]);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Circle[]>([]);
  const clusterLabelsRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const hotspotCirclesRef = useRef<google.maps.Circle[]>([]);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 전국 더미 데이터 생성
  const generateAllEntities = useCallback((userLoc: google.maps.LatLngLiteral) => {
    const allEntities: Entity[] = [];
    let id = 0;

    KOREA_CITIES.forEach(city => {
      const count = city.name === "서울" ? 300 : 80;
      
      for (let i = 0; i < count; i++) {
        const mbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
        const lat = city.lat + (Math.random() - 0.5) * 0.05;
        const lng = city.lng + (Math.random() - 0.5) * 0.05;
        const state = Math.random() < 0.8 ? "move" : "stop";
        
        let speed = 0;
        if (state === "move") {
          const rand = Math.random();
          if (rand < 0.7) speed = 1 + Math.random() * 0.8;
          else if (rand < 0.9) speed = 2.78;
          else speed = Math.random() * 3;
        }
        
        allEntities.push({
          id: `entity-${id++}`,
          mbti, lat, lng, state, speed,
          direction: Math.random() * 360,
          lastUpdate: Date.now()
        });
      }
    });

    setEntities(allEntities);
  }, []);

  // 거리 계산
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // MBTI 한글 이름
  const getMbtiName = useCallback((mbti: string): string => {
    const names: Record<string, string> = {
      INTJ: "전략가형", INTP: "논리술사형", ENTJ: "통솔자형", ENTP: "변론가형",
      INFJ: "옹호자형", INFP: "중재자형", ENFJ: "선도자형", ENFP: "활동가형",
      ISTJ: "현실주의자형", ISFJ: "수호자형", ESTJ: "경영자형", ESFJ: "집정관형",
      ISTP: "장인형", ISFP: "모험가형", ESTP: "사업가형", ESFP: "연예인형"
    };
    return names[mbti] || mbti;
  }, []);

  // 화면 높이 업데이트
  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 위치 권한 요청
  const handleRequestLocation = useCallback(() => {
    setStep("loading");
    setLoadingMessage("위치 정보를 불러오는 중...");
    
    if (!navigator.geolocation) {
      toast.error("위치 서비스를 지원하지 않는 브라우저입니다.");
      const fallbackLocation = { lat: 37.5665, lng: 126.9780 };
      setUserLocation(fallbackLocation);
      generateAllEntities(fallbackLocation);
      setTimeout(() => setStep("map"), 1000);
      return;
    }

    const timeout = setTimeout(() => {
      setLoadingMessage("지도를 불러오는 중...");
    }, 2000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(location);
        generateAllEntities(location);
        setTimeout(() => setStep("map"), 1000);
      },
      (error) => {
        clearTimeout(timeout);
        console.error("위치 정보 오류:", error);
        toast.error("위치 정보를 가져올 수 없습니다. 기본 위치(서울)로 표시합니다.");
        const fallbackLocation = { lat: 37.5665, lng: 126.9780 };
        setUserLocation(fallbackLocation);
        generateAllEntities(fallbackLocation);
        setTimeout(() => setStep("map"), 1000);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [generateAllEntities]);

  // 움직임 시뮬레이션
  useEffect(() => {
    if (step !== "map") return;

    const interval = setInterval(() => {
      setEntities(prevEntities => {
        return prevEntities.map(entity => {
          const now = Date.now();
          const elapsed = (now - entity.lastUpdate) / 1000;
          const shouldReassign = Math.random() < (elapsed / 300);
          
          if (shouldReassign) {
            const newState = Math.random() < 0.8 ? "move" : "stop";
            let newSpeed = 0;
            if (newState === "move") {
              const rand = Math.random();
              if (rand < 0.7) newSpeed = 1 + Math.random() * 0.8;
              else if (rand < 0.9) newSpeed = 2.78;
              else newSpeed = Math.random() * 3;
            }
            return { ...entity, state: newState, speed: newSpeed, direction: Math.random() * 360, lastUpdate: now };
          }
          
          if (entity.state === "move") {
            const distance = entity.speed * elapsed;
            const latChange = (distance * Math.cos(entity.direction * Math.PI / 180)) / 111320;
            const lngChange = (distance * Math.sin(entity.direction * Math.PI / 180)) / (111320 * Math.cos(entity.lat * Math.PI / 180));
            return { ...entity, lat: entity.lat + latChange, lng: entity.lng + lngChange, lastUpdate: now };
          }
          
          return { ...entity, lat: entity.lat + (Math.random() - 0.5) * 0.00001, lng: entity.lng + (Math.random() - 0.5) * 0.00001, lastUpdate: now };
        });
      });
    }, 1000);

    simulationIntervalRef.current = interval;
    return () => { if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current); };
  }, [step]);

  // 3m 모드 근접 감지
  useEffect(() => {
    if (!userLocation || viewMode !== "3m") return;

    const nearby = entities.filter(entity => {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, entity.lat, entity.lng);
      return distance <= 3;
    });

    nearby.forEach(entity => {
      if (!nearbyEntities3m.find(e => e.id === entity.id)) {
        const mbtiName = getMbtiName(entity.mbti);
        toast(`${mbtiName} ${entity.mbti}와 곧 마주치거나 이미 지나쳤어요!`, { duration: 3000 });
      }
    });

    setNearbyEntities3m(nearby);
  }, [entities, userLocation, viewMode, nearbyEntities3m, calculateDistance, getMbtiName]);

  // Hotspot 렌더링
  const renderHotspots = useCallback((map: google.maps.Map) => {
    hotspotCirclesRef.current.forEach(circle => circle.setMap(null));
    hotspotCirclesRef.current = [];

    const now = new Date();
    const hour = now.getHours();
    const isDynamicHotspotTime = hour < 9 || hour >= 16;

    FIXED_HOTSPOTS.forEach(hotspot => {
      const circle = new google.maps.Circle({
        map, center: { lat: hotspot.lat, lng: hotspot.lng }, radius: 300,
        fillColor: "#ff00e5", fillOpacity: 0.2, strokeColor: "#ff00e5", strokeWeight: 3, strokeOpacity: 0.6,
      });
      hotspotCirclesRef.current.push(circle);
    });

    if (isDynamicHotspotTime) {
      DYNAMIC_HOTSPOTS.forEach(hotspot => {
        const circle = new google.maps.Circle({
          map, center: { lat: hotspot.lat, lng: hotspot.lng }, radius: 300,
          fillColor: "#bf00ff", fillOpacity: 0.2, strokeColor: "#bf00ff", strokeWeight: 3, strokeOpacity: 0.6,
        });
        hotspotCirclesRef.current.push(circle);
      });
    }
  }, []);

  // 지도 준비 완료
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    map.addListener("zoom_changed", () => {
      const zoom = map.getZoom() || 15;
      if (zoom <= 11) setViewMode("wide");
      else if (zoom <= 17) setViewMode("near");
      else setViewMode("3m");
    });

    if (userLocation) {
      new google.maps.Circle({
        map, center: userLocation, radius: 50,
        fillColor: "#ffffff", fillOpacity: 0.8, strokeColor: "#00f5ff", strokeWeight: 3, strokeOpacity: 1,
      });
    }

    renderHotspots(map);
  }, [userLocation, renderHotspots]);

  // 마커 렌더링
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    clusterLabelsRef.current.forEach(label => label.map = null);
    clusterLabelsRef.current = [];

    const map = mapRef.current;

    if (viewMode === "wide") {
      const clusterData: Record<string, Record<string, number>> = {};
      SEOUL_DISTRICTS.forEach(district => {
        clusterData[district.name] = {};
        MBTI_TYPES.forEach(mbti => { clusterData[district.name][mbti] = 0; });
      });

      entities.forEach(entity => {
        let closestDistrict = SEOUL_DISTRICTS[0];
        let minDistance = Infinity;
        SEOUL_DISTRICTS.forEach(district => {
          const distance = calculateDistance(entity.lat, entity.lng, district.lat, district.lng);
          if (distance < minDistance) { minDistance = distance; closestDistrict = district; }
        });
        if (minDistance < 5000) clusterData[closestDistrict.name][entity.mbti]++;
      });

      SEOUL_DISTRICTS.forEach(district => {
        const counts = clusterData[district.name];
        const sortedMbti = Object.entries(counts).filter(([_, count]) => count > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
        if (sortedMbti.length > 0) {
          const content = document.createElement("div");
          content.style.cssText = `background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 2px solid rgba(0, 245, 255, 0.5); border-radius: 12px; padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif; font-weight: 700; color: #00f5ff; text-shadow: 0 0 10px rgba(0, 245, 255, 0.5); white-space: nowrap;`;
          content.innerHTML = sortedMbti.map(([mbti, count]) => `${mbti} × ${count}`).join("<br>");
          const label = new google.maps.marker.AdvancedMarkerElement({ map, position: { lat: district.lat, lng: district.lng }, content });
          clusterLabelsRef.current.push(label);
        }
      });

    } else if (viewMode === "near") {
      const nearbyEntities = entities.filter(entity => calculateDistance(userLocation.lat, userLocation.lng, entity.lat, entity.lng) <= 1000);
      nearbyEntities.forEach(entity => {
        if (selectedMbti && entity.mbti !== selectedMbti) return;
        const circle = new google.maps.Circle({
          map, center: { lat: entity.lat, lng: entity.lng }, radius: 30,
          fillColor: MBTI_COLORS[entity.mbti], fillOpacity: selectedMbti === entity.mbti ? 0.6 : 0.4,
          strokeColor: MBTI_COLORS[entity.mbti], strokeWeight: selectedMbti === entity.mbti ? 3 : 2, strokeOpacity: 1,
        });
        circle.addListener("click", () => setSelectedEntity(entity));
        markersRef.current.push(circle);
      });

    } else if (viewMode === "3m") {
      entities.forEach(entity => {
        if (selectedMbti && entity.mbti !== selectedMbti) return;
        const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, entity.lat, entity.lng) : Infinity;
        const isNear = distance <= 3;
        const circle = new google.maps.Circle({
          map, center: { lat: entity.lat, lng: entity.lng }, radius: isNear ? 20 : 15,
          fillColor: MBTI_COLORS[entity.mbti], fillOpacity: isNear ? 0.8 : 0.5,
          strokeColor: MBTI_COLORS[entity.mbti], strokeWeight: isNear ? 4 : 2, strokeOpacity: 1,
        });
        circle.addListener("click", () => setSelectedEntity(entity));
        markersRef.current.push(circle);
      });
    }
  }, [entities, viewMode, selectedMbti, userLocation, calculateDistance]);

  // 위치 권한 요청 화면
  if (step === "permission") {
    return (
      <div style={{ minHeight: `${screenHeight}px`, background: 'linear-gradient(to bottom right, #000, #1e293b, #581c87)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div className="max-w-2xl w-full bg-black/50 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-8 space-y-6">
          <h1 className="text-5xl font-black text-center mb-4" style={{ color: "#00f5ff", textShadow: "0 0 20px rgba(0, 245, 255, 0.5)" }}>SPOT</h1>
          
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-2xl font-bold text-center" style={{ color: "#ff00e5", textShadow: "0 0 15px rgba(255, 0, 229, 0.6)" }}>
              📍 GPS를 켜주세요!
            </p>
            
            <p className="text-xl">
              지금, 이 골목을 보기 위해선 <span className="text-cyan-400 font-bold">위치 정확도</span>가 필요해요.
            </p>
            
            <p className="text-sm text-gray-400">
              위치 정확도는 서비스에 대해 더 정확한 위치 정보를 제공합니다.<br />
              정확한 개인 식별은 불가합니다.
            </p>
            
            <p className="text-sm">
              해당 웹사이트에서는 현재 위치를 기준으로<br />
              주변의 분포를 가상 계산합니다.
            </p>
            
            <p className="text-sm text-cyan-300 font-semibold">
              정확한 좌표는 어디에도 공개하지 않습니다.<br />
              점이 아닌, 범위로 표시됩니다.
            </p>
            
            <p className="text-base">
              동의하면, 지금 이 근처를 바로 보여드립니다.
            </p>
            
            <p className="text-xs text-gray-500">
              언제든지 위치 설정에서 변경할 수 있습니다.
            </p>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleRequestLocation}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(229, 231, 235, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>사용 중</span>
              <div style={{
                width: '51px',
                height: '31px',
                borderRadius: '15.5px',
                backgroundColor: '#3b82f6',
                position: 'relative',
                transition: 'all 0.3s'
              }}>
                <div style={{
                  width: '27px',
                  height: '27px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  position: 'absolute',
                  right: '2px',
                  top: '2px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 화면
  if (step === "loading") {
    return (
      <div style={{ minHeight: `${screenHeight}px`, background: 'linear-gradient(to bottom right, #000, #1e293b, #581c87)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="text-6xl font-black mb-8" style={{ color: "#00f5ff", textShadow: "0 0 30px rgba(0, 245, 255, 0.6)" }}>SPOT</h1>
        <p className="text-xl text-gray-300 animate-pulse">{loadingMessage}</p>
        <p className="text-sm text-gray-500 mt-4">오래 걸릴 경우 새로고침 해주세요.</p>
      </div>
    );
  }

  // 지도 화면
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: `${screenHeight}px`, overflow: 'hidden', backgroundColor: '#000' }}>
      {/* 상단 헤더 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,245,255,0.3)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#00f5ff', textShadow: '0 0 10px rgba(0,245,255,0.5)' }}>SPOT</h1>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            모드: <span style={{ color: '#00f5ff', fontWeight: '600' }}>
              {viewMode === "wide" ? "WIDE VIEW" : viewMode === "near" ? "NEAR VIEW" : "3M MODE"}
            </span>
          </div>
        </div>
      </div>

      {/* MBTI 필터 버튼 */}
      <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, zIndex: 10, padding: '0 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
            {MBTI_TYPES.map(mbti => (
              <button
                key={mbti}
                onClick={() => setSelectedMbti(selectedMbti === mbti ? null : mbti)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap',
                  backgroundColor: selectedMbti === mbti ? MBTI_COLORS[mbti] : `${MBTI_COLORS[mbti]}20`,
                  color: selectedMbti === mbti ? "#000" : MBTI_COLORS[mbti],
                  border: `2px solid ${MBTI_COLORS[mbti]}`,
                  boxShadow: selectedMbti === mbti ? `0 0 20px ${MBTI_COLORS[mbti]}80` : "none",
                  transform: selectedMbti === mbti ? 'scale(1.1)' : 'scale(1)',
                  opacity: selectedMbti === mbti ? 1 : 0.7,
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                {mbti}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 지도 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <MapView
          initialCenter={userLocation || { lat: 37.5665, lng: 126.9780 }}
          initialZoom={15}
          onMapReady={handleMapReady}
        />
      </div>

      {/* 하단 정보 카드 */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(0,245,255,0.3)', padding: '16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* 스포트라이트 시스템 정보 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00f5ff', animation: 'pulse 2s infinite' }}></div>
              <span style={{ color: '#9ca3af' }}>스포트라이트 시스템 활성</span>
            </div>
            {selectedMbti && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#9ca3af' }}>필터:</span>
                <span style={{
                  padding: '4px 8px', borderRadius: '4px', fontWeight: '700',
                  backgroundColor: `${MBTI_COLORS[selectedMbti]}20`,
                  color: MBTI_COLORS[selectedMbti],
                  border: `1px solid ${MBTI_COLORS[selectedMbti]}`
                }}>
                  {selectedMbti}
                </span>
              </div>
            )}
          </div>

          {/* 선택된 엔티티 정보 */}
          {selectedEntity ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px', borderTop: '1px solid #374151' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900',
                backgroundColor: MBTI_COLORS[selectedEntity.mbti], color: '#000'
              }}>
                {selectedEntity.mbti}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: '600' }}>{getMbtiName(selectedEntity.mbti)} ({selectedEntity.mbti})</p>
                <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {selectedEntity.state === "move" ? "이동 중" : "정지 중"}
                  {userLocation && ` · ${Math.round(calculateDistance(userLocation.lat, userLocation.lng, selectedEntity.lat, selectedEntity.lng))}m`}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', paddingTop: '12px', borderTop: '1px solid #374151' }}>
              마커를 클릭하거나 위의 MBTI 버튼으로 필터링하세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
