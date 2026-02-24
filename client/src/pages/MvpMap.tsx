import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapView } from "@/components/Map";
import { Toaster, toast } from "sonner";

type Screen = "permission" | "loading" | "map";
type ViewMode = "wide" | "near" | "3m";

interface LatLng {
  lat: number;
  lng: number;
}

interface Entity {
  id: string;
  mbti: string;
  lat: number;
  lng: number;
  state: "move" | "stop";
  speed: number; // m/s
  direction: number; // degrees 0~360
  lastUpdate: number; // timestamp
  meta?: {
    city?: string;
    district?: string;
  };
}

interface SelectedEntityInfo {
  entity: Entity;
  distance: number; // meters
}

interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  level: "hotspot" | "super";
  active: boolean;
}

const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

const mbtiColors: Record<string, string> = {
  INTJ: "#a855f7",
  INTP: "#8b5cf6",
  ENTJ: "#7c3aed",
  ENTP: "#6d28d9",
  INFJ: "#ec4899",
  INFP: "#db2777",
  ENFJ: "#be185d",
  ENFP: "#9f1239",
  ISTJ: "#3b82f6",
  ISFJ: "#2563eb",
  ESTJ: "#1d4ed8",
  ESFJ: "#1e40af",
  ISTP: "#10b981",
  ISFP: "#059669",
  ESTP: "#047857",
  ESFP: "#065f46",
};

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const seoulDistricts = [
  { name: "강남구", lat: 37.5172, lng: 127.0473 },
  { name: "강동구", lat: 37.5301, lng: 127.1238 },
  { name: "강북구", lat: 37.6398, lng: 127.0256 },
  { name: "강서구", lat: 37.5509, lng: 126.8495 },
  { name: "관악구", lat: 37.4784, lng: 126.9516 },
  { name: "광진구", lat: 37.5384, lng: 127.0822 },
  { name: "구로구", lat: 37.4954, lng: 126.8874 },
  { name: "금천구", lat: 37.4519, lng: 126.8955 },
  { name: "노원구", lat: 37.6542, lng: 127.0568 },
  { name: "도봉구", lat: 37.6688, lng: 127.0471 },
  { name: "동대문구", lat: 37.5744, lng: 127.0399 },
  { name: "동작구", lat: 37.5124, lng: 126.9393 },
  { name: "마포구", lat: 37.5663, lng: 126.9019 },
  { name: "서대문구", lat: 37.5791, lng: 126.9368 },
  { name: "서초구", lat: 37.4837, lng: 127.0324 },
  { name: "성동구", lat: 37.5634, lng: 127.0371 },
  { name: "성북구", lat: 37.5894, lng: 127.0167 },
  { name: "송파구", lat: 37.5145, lng: 127.1059 },
  { name: "양천구", lat: 37.517, lng: 126.8664 },
  { name: "영등포구", lat: 37.5264, lng: 126.8962 },
  { name: "용산구", lat: 37.5324, lng: 126.99 },
  { name: "은평구", lat: 37.6027, lng: 126.9291 },
  { name: "종로구", lat: 37.5735, lng: 126.9792 },
  { name: "중구", lat: 37.5641, lng: 126.9979 },
  { name: "중랑구", lat: 37.6063, lng: 127.0925 },
];

const defaultSeoulCenter: LatLng = { lat: 37.5665, lng: 126.978 };

const neonTextShadow =
  "0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(0, 245, 255, 0.5)";
const neonBoxShadow =
  "0 0 15px rgba(0, 245, 255, 0.6), 0 0 30px rgba(0, 245, 255, 0.3)";

const HOTSPOT_HONGDAE: Hotspot = {
  id: "hongdae",
  name: "홍대",
  lat: 37.5563,
  lng: 126.9233,
  level: "super",
  active: true,
};

const HOTSPOT_SEONGSU: Hotspot = {
  id: "seongsu",
  name: "성수동",
  lat: 37.5446,
  lng: 127.0565,
  level: "hotspot",
  active: false,
};

const HOTSPOT_YEOUIDO: Hotspot = {
  id: "yeouido",
  name: "여의도",
  lat: 37.5219,
  lng: 126.9244,
  level: "hotspot",
  active: false,
};

const MOVEMENT_INTERVAL_MS = 5 * 60 * 1000; // 5분

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371e3; // 지구 반지름 (m)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위
}

function getDistanceMessage(distance: number): string {
  if (distance < 100) return "바로 옆이네요!";
  if (distance < 500) return "가까운 거리에요";
  if (distance < 1000) return "조금만 걸어가면 돼요";
  return "꽤 멀리 있어요";
}

function generateInitialEntities(): Entity[] {
  const entities: Entity[] = [];
  const now = Date.now();

  // 서울 300명 (25개 구에 분산)
  const seoulCount = 300;
  for (let i = 0; i < seoulCount; i += 1) {
    const district = randomPick(seoulDistricts);
    const lat = district.lat + randomInRange(-0.02, 0.02);
    const lng = district.lng + randomInRange(-0.02, 0.02);
    const mbti = randomPick(MBTI_TYPES);

    const moving = Math.random() < 0.8;
    const speedRoll = Math.random();
    let speed: number;
    if (speedRoll < 0.7) {
      speed = randomInRange(1, 1.8);
    } else if (speedRoll < 0.9) {
      speed = randomInRange(2.78, 5.56);
    } else {
      speed = randomInRange(8.33, 13.89);
    }

    entities.push({
      id: `seoul-${i}`,
      mbti,
      lat,
      lng,
      state: moving ? "move" : "stop",
      speed,
      direction: randomInRange(0, 360),
      lastUpdate: now,
      meta: { city: "서울", district: district.name },
    });
  }

  const cityCenters: { name: string; lat: number; lng: number; count: number }[] =
    [
      { name: "부산", lat: 35.1796, lng: 129.0756, count: 80 },
      { name: "대구", lat: 35.8714, lng: 128.6014, count: 80 },
      { name: "인천", lat: 37.4563, lng: 126.7052, count: 80 },
      { name: "광주", lat: 35.1595, lng: 126.8526, count: 80 },
      { name: "대전", lat: 36.3504, lng: 127.3845, count: 80 },
      { name: "울산", lat: 35.5384, lng: 129.3114, count: 80 },
      { name: "세종", lat: 36.4801, lng: 127.289, count: 80 },
      { name: "제주", lat: 33.4996, lng: 126.5312, count: 80 },
    ];

  cityCenters.forEach((city) => {
    for (let i = 0; i < city.count; i += 1) {
      const lat = city.lat + randomInRange(-0.05, 0.05);
      const lng = city.lng + randomInRange(-0.05, 0.05);
      const mbti = randomPick(MBTI_TYPES);

      const moving = Math.random() < 0.8;
      const speedRoll = Math.random();
      let speed: number;
      if (speedRoll < 0.7) {
        speed = randomInRange(1, 1.8);
      } else if (speedRoll < 0.9) {
        speed = randomInRange(2.78, 5.56);
      } else {
        speed = randomInRange(8.33, 13.89);
      }

      entities.push({
        id: `${city.name}-${i}`,
        mbti,
        lat,
        lng,
        state: moving ? "move" : "stop",
        speed,
        direction: randomInRange(0, 360),
        lastUpdate: now,
        meta: { city: city.name },
      });
    }
  });

  return entities;
}

function updateEntity(entity: Entity): Entity {
  const now = Date.now();
  const elapsedSeconds = (now - entity.lastUpdate) / 1000;

  let { state, speed, direction } = entity;
  if (Math.random() < 0.8) {
    // 80% 확률로 상태 유지/변경
    state = Math.random() < 0.8 ? "move" : "stop";
  }

  if (Math.random() < 0.2) {
    // 20% 확률로 텔레포트 (완전히 새로운 위치)
    const latOffset = randomInRange(-0.05, 0.05);
    const lngOffset = randomInRange(-0.05, 0.05);
    const baseLat = entity.meta?.city === "서울" ? defaultSeoulCenter.lat : entity.lat;
    const baseLng = entity.meta?.city === "서울" ? defaultSeoulCenter.lng : entity.lng;
    return {
      ...entity,
      lat: baseLat + latOffset,
      lng: baseLng + lngOffset,
      direction: randomInRange(0, 360),
      lastUpdate: now,
    };
  }

  if (state === "stop" || elapsedSeconds <= 0) {
    return { ...entity, lastUpdate: now };
  }

  // 속도는 유지
  direction = randomInRange(0, 360);

  const distance = entity.speed * elapsedSeconds; // m
  const newLat =
    entity.lat +
    (distance * Math.cos((direction * Math.PI) / 180)) / 111320;
  const newLng =
    entity.lng +
    (distance *
      Math.sin((direction * Math.PI) / 180)) /
      (111320 * Math.cos((entity.lat * Math.PI) / 180));

  return {
    ...entity,
    lat: newLat,
    lng: newLng,
    direction,
    lastUpdate: now,
  };
}

const MvpMap: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("permission");
  const [loadingStep, setLoadingStep] = useState<1 | 2>(1);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("near");
  const [selectedMbtiTypes, setSelectedMbtiTypes] = useState<string[]>([]);
  const [selectedEntity, setSelectedEntity] =
    useState<SelectedEntityInfo | null>(null);
  const [entities, setEntities] = useState<Entity[]>(() =>
    generateInitialEntities(),
  );
  const [hotspots, setHotspots] = useState<Hotspot[]>([
    HOTSPOT_HONGDAE,
    HOTSPOT_SEONGSU,
    HOTSPOT_YEOUIDO,
  ]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const zoomListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const overlaysRef = useRef<{
    entityCircles: google.maps.Circle[];
    entityLabels: google.maps.marker.AdvancedMarkerElement[];
    clusterMarkers: google.maps.marker.AdvancedMarkerElement[];
    hotspotCircles: google.maps.Circle[];
    hotspotMarkers: google.maps.marker.AdvancedMarkerElement[];
    userCircle?: google.maps.Circle;
    userMarker?: google.maps.marker.AdvancedMarkerElement;
  }>({
    entityCircles: [],
    entityLabels: [],
    clusterMarkers: [],
    hotspotCircles: [],
    hotspotMarkers: [],
    userCircle: undefined,
    userMarker: undefined,
  });

  // 글로벌 스타일 (네온/펄스 애니메이션)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "spot-global-styles";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.1); opacity: 0.5; }
      }
      .spot-hotspot-pulse {
        width: 120px;
        height: 120px;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(255,0,110,0.6), rgba(255,0,110,0.0));
        animation: pulse 1.5s infinite;
      }
      .spot-hotspot-label {
        color: #ff006e;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(255,0,110,0.8), 0 0 20px rgba(255,0,110,0.6);
      }
    `;
    document.head.appendChild(style);
  }, []);

  // viewport 높이 (모바일 주소창 대응)
  useEffect(() => {
    const updateHeight = () => {
      if (typeof window === "undefined") return;
      setViewportHeight(window.innerHeight);
    };
    updateHeight();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateHeight);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateHeight);
      }
    };
  }, []);

  // 움직임 시뮬레이션 (5분 주기)
  useEffect(() => {
    const interval = window.setInterval(() => {
      setEntities((prev) => prev.map(updateEntity));
    }, MOVEMENT_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  // Hotspot 시간대 활성화 (5분마다 체크)
  useEffect(() => {
    const computeHotspots = () => {
      const now = new Date();
      const hour = now.getHours();
      const isNight = hour >= 16 || hour < 9;
      setHotspots([
        HOTSPOT_HONGDAE,
        { ...HOTSPOT_SEONGSU, active: isNight },
        { ...HOTSPOT_YEOUIDO, active: isNight },
      ]);
    };
    computeHotspots();
    const interval = window.setInterval(computeHotspots, MOVEMENT_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  // 로딩 화면 메시지 단계
  useEffect(() => {
    if (screen !== "loading") return;
    setLoadingStep(1);
    const t1 = window.setTimeout(() => setLoadingStep(2), 1000);
    const t2 = window.setTimeout(() => setScreen("map"), 2000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [screen]);

  // 3m 모드 근접 알림
  useEffect(() => {
    if (viewMode !== "3m" || !userLocation) return;
    const close = entities.find(
      (e) =>
        calculateDistance(
          userLocation.lat,
          userLocation.lng,
          e.lat,
          e.lng,
        ) <= 3,
    );
    if (close) {
      toast.success(`3m 이내에 ${close.mbti}가 있어요!`);
    }
  }, [viewMode, userLocation, entities]);

  const activeHotspots = useMemo(
    () => hotspots.filter((h) => h.active),
    [hotspots],
  );

  const handleZoomChanged = useCallback((map: google.maps.Map) => {
    const zoom = map.getZoom() ?? 15;
    if (zoom >= 18) setViewMode("3m");
    else if (zoom >= 14) setViewMode("near");
    else setViewMode("wide");
  }, []);

  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      map.setOptions({
        center: userLocation ?? defaultSeoulCenter,
        zoom: 15,
        styles: darkMapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
      });

      if (zoomListenerRef.current) {
        zoomListenerRef.current.remove();
      }
      zoomListenerRef.current = map.addListener("zoom_changed", () =>
        handleZoomChanged(map),
      );

      handleZoomChanged(map);
    },
    [handleZoomChanged, userLocation],
  );

  // 오버레이 클리어
  const clearOverlays = useCallback(() => {
    const current = overlaysRef.current;
    current.entityCircles.forEach((c) => c.setMap(null));
    current.entityLabels.forEach((m) => m.map = null);
    current.clusterMarkers.forEach((m) => m.map = null);
    current.hotspotCircles.forEach((c) => c.setMap(null));
    current.hotspotMarkers.forEach((m) => m.map = null);
    if (current.userCircle) current.userCircle.setMap(null);
    if (current.userMarker) current.userMarker.map = null;

    overlaysRef.current = {
      entityCircles: [],
      entityLabels: [],
      clusterMarkers: [],
      hotspotCircles: [],
      hotspotMarkers: [],
      userCircle: undefined,
      userMarker: undefined,
    };
  }, []);

  // 지도 오버레이 렌더링
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;

    clearOverlays();

    const next = overlaysRef.current;

    // 사용자 위치 마커
    const userCircle = new google.maps.Circle({
      map,
      center: userLocation,
      radius: 10,
      strokeColor: "#3b82f6",
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: "#ffffff",
      fillOpacity: 0.9,
    });

    const userContent = document.createElement("div");
    userContent.textContent = "📍";
    userContent.style.fontSize = "18px";
    userContent.style.transform = "translate(-50%, -50%)";

    const userMarker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: userLocation,
      content: userContent,
    });

    next.userCircle = userCircle;
    next.userMarker = userMarker;

    // Hotspot
    activeHotspots.forEach((h) => {
      const radius = h.level === "super" ? 200 : 160;
      const circle = new google.maps.Circle({
        map,
        center: { lat: h.lat, lng: h.lng },
        radius,
        strokeColor: "#ff006e",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: "#ff006e",
        fillOpacity: 0.3,
      });

      const wrapper = document.createElement("div");
      const pulse = document.createElement("div");
      pulse.className = "spot-hotspot-pulse";
      const label = document.createElement("div");
      label.className = "spot-hotspot-label";
      label.textContent =
        h.level === "super"
          ? `🔥 Super Hotspot: ${h.name}`
          : `🔥 Hotspot: ${h.name}`;
      wrapper.appendChild(pulse);
      wrapper.appendChild(label);
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.alignItems = "center";
      wrapper.style.transform = "translate(-50%, -50%)";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: h.lat, lng: h.lng },
        content: wrapper,
      });

      next.hotspotCircles.push(circle);
      next.hotspotMarkers.push(marker);
    });

    if (viewMode === "wide") {
      // 서울 Wide View 텍스트 클러스터
      const summaryByDistrict: Record<
        string,
        { total: number; mbtiCounts: Record<string, number> }
      > = {};

      entities
        .filter((e) => e.meta?.city === "서울" && e.meta.district)
        .forEach((e) => {
          const district = e.meta!.district!;
          if (!summaryByDistrict[district]) {
            summaryByDistrict[district] = { total: 0, mbtiCounts: {} };
          }
          summaryByDistrict[district].total += 1;
          summaryByDistrict[district].mbtiCounts[e.mbti] =
            (summaryByDistrict[district].mbtiCounts[e.mbti] ?? 0) + 1;
        });

      seoulDistricts.forEach((d) => {
        const summary = summaryByDistrict[d.name];
        if (!summary || summary.total === 0) return;

        const mbtiSummary = Object.entries(summary.mbtiCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([mbti, count]) => `${mbti} × ${count}`)
          .join(", ");

        const content = document.createElement("div");
        content.style.padding = "8px 12px";
        content.style.borderRadius = "999px";
        content.style.backgroundColor = "rgba(0,0,0,0.8)";
        content.style.color = "#ffffff";
        content.style.fontSize = "12px";
        content.style.fontWeight = "600";
        content.style.boxShadow = neonBoxShadow;
        content.style.textShadow = neonTextShadow;
        content.style.backdropFilter = "blur(8px)";
        content.innerHTML = `<div style="font-size: 13px; margin-bottom: 2px;">${d.name}</div><div style="font-size: 11px; opacity: 0.9;">${mbtiSummary}</div>`;
        content.style.transform = "translate(-50%, -50%)";

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: d.lat, lng: d.lng },
          content,
        });

        next.clusterMarkers.push(marker);
      });
    } else {
      const maxDistance = viewMode === "near" ? 1000 : 3;
      const filtered = entities.filter((e) => {
        if (
          selectedMbtiTypes.length > 0 &&
          !selectedMbtiTypes.includes(e.mbti)
        ) {
          return false;
        }
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          e.lat,
          e.lng,
        );
        return distance <= maxDistance;
      });

      filtered.forEach((e) => {
        const color = mbtiColors[e.mbti] ?? "#00f5ff";
        const circle = new google.maps.Circle({
          map,
          center: { lat: e.lat, lng: e.lng },
          radius: 20,
          strokeColor: color,
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.5,
        });

        const content = document.createElement("div");
        content.textContent = e.mbti;
        content.style.padding = "4px 8px";
        content.style.borderRadius = "999px";
        content.style.backgroundColor = "rgba(0,0,0,0.9)";
        content.style.color = "#ffffff";
        content.style.fontSize = "11px";
        content.style.fontWeight = "700";
        content.style.textShadow = neonTextShadow;
        content.style.boxShadow = neonBoxShadow;
        content.style.transform = "translate(-50%, -50%)";

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: e.lat, lng: e.lng },
          content,
        });

        content.addEventListener("mouseenter", () => {
          circle.setRadius(24);
        });
        content.addEventListener("mouseleave", () => {
          circle.setRadius(20);
        });

        marker.addListener("click", () => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            e.lat,
            e.lng,
          );
          setSelectedEntity({ entity: e, distance });
        });

        next.entityCircles.push(circle);
        next.entityLabels.push(marker);
      });
    }
  }, [
    activeHotspots,
    clearOverlays,
    entities,
    selectedMbtiTypes,
    userLocation,
    viewMode,
  ]);

  const handleRequestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error(
        "이 브라우저는 위치 정보를 지원하지 않아요. 서울 기준으로 보여드릴게요.",
      );
      setUserLocation(defaultSeoulCenter);
      setScreen("loading");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setScreen("loading");
      },
      (err) => {
        console.error(err);
        toast.error(
          "위치 권한을 허용하지 않아, 서울 기준으로 보여드릴게요.",
        );
        setUserLocation(defaultSeoulCenter);
        setScreen("loading");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, []);

  const toggleMbti = useCallback((type: string) => {
    setSelectedEntity(null);
    setSelectedMbtiTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const handleBack = useCallback(() => {
    // 간단한 뒤로 가기 (히스토리 없을 경우 permission 화면으로)
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      setScreen("permission");
    }
  }, []);

  const containerHeight =
    viewportHeight !== null ? `${viewportHeight}px` : "100vh";

  return (
    <div
      style={{
        height: containerHeight,
        width: "100vw",
        maxWidth: "1280px",
        margin: "0 auto",
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily:
          "'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Toaster position="top-center" richColors />

      {screen === "permission" && (
        <PermissionScreen onToggleOn={handleRequestLocation} />
      )}

      {screen === "loading" && <LoadingScreen step={loadingStep} />}

      {screen === "map" && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
            aria-label="지도 영역"
          >
            <MapView onMapReady={handleMapReady} />
          </div>

          <Header onBack={handleBack} />

          <MbtiFilterBar
            selected={selectedMbtiTypes}
            onToggle={toggleMbti}
          />

          <BottomBar
            activeHotspots={activeHotspots}
            selectedFilters={selectedMbtiTypes}
            selectedEntity={selectedEntity}
            viewMode={viewMode}
          />
        </>
      )}
    </div>
  );
};

interface PermissionScreenProps {
  onToggleOn: () => void;
}

const PermissionScreen: React.FC<PermissionScreenProps> = ({ onToggleOn }) => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      onToggleOn();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        padding: "24px",
        textAlign: "center",
      }}
      aria-label="위치 권한 요청 화면"
    >
      <div
        style={{
          fontFamily: "'Orbitron', system-ui, sans-serif",
          fontSize: "48px",
          fontWeight: 800,
          color: "#00f5ff",
          textShadow: neonTextShadow,
          marginBottom: "24px",
        }}
      >
        SPOT
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: 800,
          marginBottom: "12px",
        }}
      >
        지금 이 골목에 나와 같은 MBTI가 있다면?
      </div>

      <div
        style={{
          fontSize: "16px",
          color: "#9ca3af",
          marginBottom: "24px",
        }}
      >
        지금 나와 비슷한 사람은 어디에.
      </div>

      <div
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#ff006e",
          textShadow:
            "0 0 10px rgba(255,0,110,0.8), 0 0 20px rgba(255,0,110,0.6)",
          marginBottom: "16px",
          animation: "pulse 1.5s infinite",
        }}
      >
        📍 GPS를 켜주세요!
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#6b7280",
          lineHeight: 1.5,
          marginBottom: "32px",
          maxWidth: "320px",
        }}
      >
        SPOT은 위치 정보를 사용하여 주변 MBTI를 표시합니다. 언제든지 위치
        설정에서 변경할 수 있습니다.
      </div>

      {/* 안드로이드 스타일 토글 */}
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={enabled}
        aria-label={
          enabled ? "위치 정보 사용 중으로 설정됨" : "위치 정보 사용 안함으로 설정됨"
        }
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "220px",
          padding: "10px 14px",
          borderRadius: "999px",
          border: "1px solid #374151",
          backgroundColor: "rgba(15,23,42,0.9)",
          color: "#e5e7eb",
          cursor: "pointer",
          boxShadow: neonBoxShadow,
          outline: "none",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          위치 액세스
        </span>
        <div
          style={{
            position: "relative",
            width: "72px",
            height: "28px",
            borderRadius: "999px",
            backgroundColor: enabled ? "#2563eb" : "#4b5563",
            boxShadow: enabled
              ? "0 0 10px rgba(59,130,246,0.8)"
              : "0 0 4px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: enabled ? "flex-end" : "flex-start",
            padding: "0 4px",
            transition: "background-color 0.3s ease, justify-content 0.3s ease",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "999px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: enabled ? "#bfdbfe" : "#9ca3af",
          }}
        >
          {enabled ? "사용 중" : "사용 안함"}
        </span>
      </button>
    </div>
  );
};

interface LoadingScreenProps {
  step: 1 | 2;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ step }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000000",
      padding: "24px",
      textAlign: "center",
    }}
    aria-label="로딩 화면"
  >
    <div
      style={{
        fontFamily: "'Orbitron', system-ui, sans-serif",
        fontSize: "40px",
        fontWeight: 800,
        color: "#00f5ff",
        textShadow: neonTextShadow,
        marginBottom: "24px",
      }}
    >
      SPOT
    </div>

    <div
      style={{
        fontSize: "16px",
        color: "#e5e7eb",
        marginBottom: "16px",
      }}
    >
      {step === 1 ? "위치 정보를 불러오는 중..." : "지도를 불러오는 중..."}
    </div>

    <div
      aria-hidden="true"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "999px",
        border: "4px solid rgba(31,41,55,0.8)",
        borderTopColor: "#00f5ff",
        animation: "spin 1s linear infinite",
        boxShadow: neonBoxShadow,
      }}
    />

    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => (
  <header
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "80px",
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      zIndex: 10,
    }}
  >
    <div
      style={{
        fontFamily: "'Orbitron', system-ui, sans-serif",
        fontSize: "24px",
        fontWeight: 800,
        color: "#00f5ff",
        textShadow: neonTextShadow,
      }}
    >
      SPOT
    </div>
    <button
      type="button"
      onClick={onBack}
      aria-label="뒤로 가기"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "999px",
        border: "1px solid #4b5563",
        backgroundColor: "rgba(15,23,42,0.9)",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: neonBoxShadow,
      }}
    >
      ←
    </button>
  </header>
);

interface MbtiFilterBarProps {
  selected: string[];
  onToggle: (type: string) => void;
}

const MbtiFilterBar: React.FC<MbtiFilterBarProps> = ({
  selected,
  onToggle,
}) => (
  <div
    style={{
      position: "absolute",
      top: 80,
      left: 0,
      right: 0,
      padding: "8px 8px 0",
      zIndex: 9,
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
    }}
    aria-label="MBTI 필터"
  >
    <div
      style={{
        display: "flex",
        gap: "8px",
        paddingBottom: "8px",
        paddingLeft: "8px",
        paddingRight: "8px",
      }}
    >
      {MBTI_TYPES.map((type) => {
        const isSelected = selected.includes(type);
        const color = mbtiColors[type] ?? "#00f5ff";
        return (
          <button
            key={type}
            type="button"
            onClick={() => onToggle(type)}
            style={{
              padding: "6px 12px",
              borderRadius: "999px",
              border: `1px solid ${color}`,
              backgroundColor: isSelected
                ? color
                : "rgba(15,23,42,0.8)",
              color: isSelected ? "#0f172a" : "#e5e7eb",
              fontSize: "13px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              cursor: "pointer",
              boxShadow: isSelected ? neonBoxShadow : "none",
              textShadow: isSelected ? neonTextShadow : "none",
            }}
          >
            {type}
          </button>
        );
      })}
    </div>
  </div>
);

interface BottomBarProps {
  activeHotspots: Hotspot[];
  selectedFilters: string[];
  selectedEntity: SelectedEntityInfo | null;
  viewMode: ViewMode;
}

const BottomBar: React.FC<BottomBarProps> = ({
  activeHotspots,
  selectedFilters,
  selectedEntity,
  viewMode,
}) => {
  const hotspotText =
    activeHotspots.length === 0
      ? "Hotspot 없음"
      : `🔥 Hotspot 활성: ${activeHotspots
          .map((h) => h.name)
          .join(", ")}`;

  const filterText =
    selectedFilters.length === 0
      ? "전체 MBTI"
      : `필터: ${selectedFilters.join(", ")}`;

  const distanceText =
    selectedEntity != null
      ? `${Math.round(selectedEntity.distance)}m`
      : null;

  const distanceMessage =
    selectedEntity != null
      ? getDistanceMessage(selectedEntity.distance)
      : null;

  const viewLabel =
    viewMode === "wide"
      ? "Wide View"
      : viewMode === "near"
        ? "Near View"
        : "3m Mode";

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0px))",
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(10px)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontSize: "13px",
      }}
      aria-label="하단 정보 바"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            color:
              activeHotspots.length === 0 ? "#9ca3af" : "#ec4899",
            textShadow:
              activeHotspots.length === 0
                ? "none"
                : "0 0 10px rgba(236,72,153,0.8)",
          }}
        >
          {hotspotText}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#9ca3af",
          }}
        >
          {viewLabel}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "#e5e7eb",
          }}
        >
          {filterText}
        </span>
      </div>

      <div
        style={{
          marginTop: "2px",
          minHeight: "32px",
          padding: "8px 10px",
          borderRadius: "12px",
          border: "1px solid #374151",
          background:
            "linear-gradient(to right, rgba(15,23,42,0.9), rgba(17,24,39,0.9))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        {selectedEntity ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "2px",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "16px",
                  color: mbtiColors[selectedEntity.entity.mbti] ?? "#00f5ff",
                  textShadow: neonTextShadow,
                }}
              >
                {selectedEntity.entity.mbti}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#e5e7eb",
                }}
              >
                {distanceMessage}
              </span>
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#e5e7eb",
              }}
            >
              {distanceText}
            </div>
          </>
        ) : (
          <span
            style={{
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            지도를 움직이거나 MBTI를 선택해 주변 사람들을 확인해보세요.
          </span>
        )}
      </div>
    </div>
  );
};

export default MvpMap;

