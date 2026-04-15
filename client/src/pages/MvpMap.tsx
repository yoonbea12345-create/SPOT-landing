import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { FIXED_PLACES } from "@/data/fixedPlaces";
import { AvatarSVG, ANIMALS, ACCESSORIES, EXPRESSIONS, EMOJIS, randomAvatarConfig, serializeAvatar, deserializeAvatar, type AvatarConfig, type AnimalType, type AccessoryType, type ExpressionType, type EmojiType } from "@/components/Avatar";
import { SpotFeed } from "@/components/SpotFeed";

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

type Screen = "splash" | "home" | "map" | "profile";

// MBTI 타입 정의
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

// MBTI별 색상 (네온 컬러)
const MBTI_COLORS: Record<string, string> = {
  INTJ: "#4db8cc", INTP: "#5ab0d4", ENTJ: "#6aa8dc", ENTP: "#7aa0e4",
  INFJ: "#9b7fd4", INFP: "#a87dd8", ENFJ: "#b57adc", ENFP: "#c278e0",
  ISTJ: "#d4944a", ISFJ: "#d4a84a", ESTJ: "#d4c04a", ESFJ: "#d4a84a",
  ISTP: "#d46080", ISFP: "#d46890", ESTP: "#d470a0", ESFP: "#d478b0"
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

// SIGN 시그널 목록 (등록 폼 선택지)
const SIGN_SIGNALS = [
  { emoji: "✏️", text: "직접 입력" },
  { emoji: "👋", text: "말 걸어도 돼요" },
  { emoji: "🎧", text: "혼자 있고 싶어요" },
  { emoji: "☕", text: "같이 앉아도 돼요" },
  { emoji: "👀", text: "구경 중이에요" },
  { emoji: "🚶", text: "지나가는 중이에요" },
  { emoji: "📸", text: "사진 찍는 중이에요" },
  { emoji: "🍽️", text: "맛집 찾는 중이에요" },
  { emoji: "🛍️", text: "쇼핑 중이에요" },
  { emoji: "💻", text: "작업 중이에요" },
  { emoji: "📖", text: "책 읽는 중이에요" },
  { emoji: "🌙", text: "야경 보러 왔어요" },
  { emoji: "🐾", text: "산책 중이에요" },
  { emoji: "🍺", text: "한잔하러 왔어요" },
  { emoji: "💬", text: "대화 상대 찾아요" },
];

// SIGN 목록 (더미 데이터용)
const SIGN_LIST = SIGN_SIGNALS.slice(1).map(s => `${s.emoji} ${s.text}`);

// 카테고리별 행동 목록
const ACTION_BY_CATEGORY: Record<string, Array<{ emoji: string; text: string }>> = {
  cafe: [
    { emoji: "☕", text: "혼자 카페 중" },
    { emoji: "💻", text: "작업 중" },
    { emoji: "📖", text: "책 읽는 중" },
    { emoji: "💬", text: "친구랑 수다 중" },
    { emoji: "🎧", text: "음악 들으며 멍 때리는 중" },
    { emoji: "📸", text: "카페 사진 찍는 중" },
    { emoji: "🍰", text: "디저트 먹는 중" },
  ],
  bar: [
    { emoji: "🍺", text: "혼술 중" },
    { emoji: "🥂", text: "친구랑 한잔 중" },
    { emoji: "🎵", text: "분위기 즐기는 중" },
    { emoji: "🍻", text: "2차 중" },
    { emoji: "🌙", text: "야간 탐방 중" },
  ],
  restaurant: [
    { emoji: "🍽️", text: "혼밥 중" },
    { emoji: "👥", text: "같이 밥 먹는 중" },
    { emoji: "📸", text: "음식 사진 찍는 중" },
    { emoji: "🍜", text: "맛집 탐방 중" },
  ],
  park: [
    { emoji: "🚶", text: "산책 중" },
    { emoji: "🐾", text: "반려동물 산책 중" },
    { emoji: "📸", text: "사진 찍는 중" },
    { emoji: "🌸", text: "꽃구경 중" },
    { emoji: "🏃", text: "러닝 중" },
    { emoji: "🧘", text: "명상 중" },
    { emoji: "🎵", text: "음악 들으며 산책 중" },
  ],
  beach: [
    { emoji: "🌊", text: "바다 구경 중" },
    { emoji: "📸", text: "사진 찍는 중" },
    { emoji: "🚶", text: "해변 산책 중" },
    { emoji: "🌅", text: "노을 보는 중" },
    { emoji: "🏄", text: "물놀이 중" },
  ],
  landmark: [
    { emoji: "📸", text: "사진 찍는 중" },
    { emoji: "🗺️", text: "구경 중" },
    { emoji: "🎒", text: "여행 중" },
    { emoji: "🚶", text: "산책 중" },
    { emoji: "🌙", text: "야경 보는 중" },
  ],
  shopping: [
    { emoji: "🛍️", text: "쇼핑 중" },
    { emoji: "👀", text: "구경 중" },
    { emoji: "💳", text: "지름신 강림 중" },
    { emoji: "☕", text: "쇼핑 쉬는 중" },
  ],
  default: [
    { emoji: "🚶", text: "산책 중" },
    { emoji: "📸", text: "사진 찍는 중" },
    { emoji: "🎧", text: "음악 들으며 배회 중" },
    { emoji: "👀", text: "구경 중" },
    { emoji: "☕", text: "카페 찾는 중" },
    { emoji: "🌙", text: "야경 보는 중" },
  ],
};

function getRandomActivity(category?: string): { emoji: string; text: string } {
  const list = ACTION_BY_CATEGORY[category ?? 'default'] ?? ACTION_BY_CATEGORY.default;
  return list[Math.floor(Math.random() * list.length)];
}

const ACTION_FORM_LIST: Array<{ emoji: string; text: string }> = [
  { emoji: "✏️", text: "직접 입력" },
  { emoji: "🍺", text: "혼술 중" },
  { emoji: "🚶", text: "산책 중" },
  { emoji: "📸", text: "사진 찍는 중" },
  { emoji: "☕", text: "혼자 카페 중" },
  { emoji: "💻", text: "작업 중" },
  { emoji: "📖", text: "책 읽는 중" },
  { emoji: "🍽️", text: "혼밥 중" },
  { emoji: "💬", text: "친구랑 수다 중" },
  { emoji: "🏃", text: "러닝 중" },
  { emoji: "🎧", text: "음악 들으며 배회 중" },
  { emoji: "🛍️", text: "쇼핑 중" },
  { emoji: "🌙", text: "야경 보는 중" },
  { emoji: "🎒", text: "여행 중" },
];

type PlaceTagType =
  | 'cafe' | 'bar_club' | 'restaurant' | 'park_picnic'
  | 'river_beach' | 'accommodation' | 'market'
  | 'culture_museum' | 'sports_fitness' | 'shopping'
  | 'landmark' | 'nature';

const classifyPlaceType = (category?: string): PlaceTagType => {
  if (!category) return 'landmark';
  const c = category.toLowerCase().trim();
  if (c === 'cafe') return 'cafe';
  if (c === 'bar') return 'bar_club';
  if (c === 'restaurant') return 'restaurant';
  if (c === 'park') return 'park_picnic';
  if (c === 'beach') return 'river_beach';
  if (c === 'nature') return 'nature';
  if (c === 'market') return 'market';
  if (c === 'landmark') return 'landmark';
  if (c.includes('카페') || c.includes('커피') || c.includes('디저트')) return 'cafe';
  if (c.includes('클럽') || c.includes('포차') || c.includes('술집')) return 'bar_club';
  if (c.includes('맛집') || c.includes('식당') || c.includes('음식')) return 'restaurant';
  if (c.includes('공원') || c.includes('피크닉')) return 'park_picnic';
  if (c.includes('한강') || c.includes('해변')) return 'river_beach';
  if (c.includes('시장') || c.includes('마트')) return 'market';
  if (c.includes('문화') || c.includes('박물관') || c.includes('갤러리')) return 'culture_museum';
  if (c.includes('스포츠') || c.includes('피트니스')) return 'sports_fitness';
  if (c.includes('쇼핑') || c.includes('백화점')) return 'shopping';
  if (c.includes('자연') || c.includes('산') || c.includes('숲')) return 'nature';
  return 'landmark';
};

const PLACE_HASHTAG_POOL: Record<PlaceTagType, string[]> = {
  cafe: ['아아맛집', '따아맛집', '크로와상맛집', '화장실 깨끗', '콘센트 있음', '혼자 와도 어색 안함', '줄 없음', '줄 김', '자리 많음', '자리 없음', '와이파이 빠름', '노트북 하기 좋음', '뷰 실화', '사진 잘 나옴', '직원 친절', '음악 좋음', '조용함', '시끄러움'],
  bar_club: ['혼술하기 좋음', '분위기 미침', '웨이팅 있음', '웨이팅 없음', '음악 너무 큼', '음악 딱 좋음', '안주 맛있음', '가성비 좋음', '혼자 와도 어색 안함', '커플 많음', '직원 친절', '화장실 깨끗', '야외석 있음', '지금 자리 있음', '지금 자리 없음'],
  restaurant: ['웨이팅 있음', '웨이팅 없음', '줄 김', '줄 없음', '양 많음', '가성비 실화', '맛 실화', '국물 진함', '매운맛 주의', '혼밥 하기 좋음', '단체석 있음', '화장실 깨끗', '포장 가능', '직원 친절', '재료 신선'],
  park_picnic: ['사람 없어요', '사람 많아요', '자리 있음', '자리 없음', '바람 많이 붐', '날씨 딱 좋음', '그늘 있음', '그늘 없음', '강아지 많음', '조용함', '시끄러움', '화장실 있음', '편의점 근처', '돗자리 필수', '야경 좋음'],
  river_beach: ['한강뷰 실화', '바다뷰 실화', '노을 지금 딱 좋음', '파도 잔잔', '바람 시원', '사람 많음', '사람 없음', '화장실 있음', '편의점 있음', '자전거 많음', '야경 미침', '사진 잘 나옴', '혼자 와도 좋음'],
  accommodation: ['침대 깨끗', '직원 친절', '방음 잘 됨', '와이파이 빠름', '뷰 좋음', '청결 합격', '주차 가능', '조식 맛있음', '가성비 좋음'],
  market: ['사람 많음', '사람 없음', '신선도 좋음', '먹거리 많음', '화장실 있음', '카드 됨', '구경 재밌음', '로컬 느낌', '야시장 분위기'],
  culture_museum: ['줄 없음', '줄 김', '조용함', '전시 좋음', '사진 찍기 좋음', '화장실 깨끗', '에어컨 빵빵', '혼자 와도 좋음', '카페 있음', '기념품샵 있음'],
  sports_fitness: ['기구 많음', '사람 많음', '사람 없음', '샤워실 깨끗', '직원 친절', '에어컨 빵빵', '운동 분위기 좋음', '초보자 환영', '가성비 좋음'],
  shopping: ['세일 중', '사람 많음', '사람 없음', '주차 가능', '에어컨 빵빵', '화장실 깨끗', '직원 친절', '구경 재밌음', '가성비 좋음', '신상 있음'],
  nature: ['산책하기 좋음', '사람 없어요', '뷰 실화', '공기 좋음', '날씨 딱 좋음', '길 평탄', '화장실 있음', '그늘 있음', '일몰 좋음', '사진 잘 나옴'],
  landmark: ['사진 잘 나옴', '뷰 실화', '사람 많음', '사람 없음', '야경 미침', '주차 가능', '화장실 있음', '포토존 있음', '줄 없음', '줄 김', '입장료 없음', '혼자 와도 좋음'],
};

const getPlaceHashtags = (category?: string, seed?: number): string[] => {
  const type = classifyPlaceType(category);
  const pool = PLACE_HASHTAG_POOL[type];
  const rng = (n: number) => {
    const s = (seed ?? 42) + n * 31;
    return ((s * 1103515245 + 12345) & 0x7fffffff) % pool.length;
  };
  const count = 4 + (rng(99) % 2);
  const indices = new Set<number>();
  let i = 0;
  while (indices.size < count && i < 100) {
    indices.add(rng(i++));
  }
  return Array.from(indices).map(idx => pool[idx]);
};

// Haversine 거리 계산 (미터 단위)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 더미 데이터 타입
interface DummySpot {
  id: number;
  mbti: string;
  mood: string;
  mode: string;
  sign: string;
  lat: number;
  lng: number;
  avatar: AvatarConfig;
  placeName?: string;
  category?: string;
  activity: { emoji: string; text: string };
  hashtags: string[];
  nearbyCount: number;
  createdAt: number;
}

// 카카오맵 장소 상세정보 타입
interface KakaoPlaceInfo {
  id: string;
  name: string;
  address: string;
  roadAddress: string;
  phone: string;
  category: string;
  url: string;
  lat: number;
  lng: number;
  distance?: number;
}

// 팝업 데이터 타입
interface PopupData {
  id: number;
  mbti: string;
  mood: string;
  mode: string;
  sign: string;
  lat: number;
  lng: number;
  avatar?: AvatarConfig;
  placeName?: string;
  category?: string;
  activity?: { emoji: string; text: string };
  hashtags?: string[];
  nearbyCount?: number;
  distance: number;
  createdAt?: number;
  isReal?: boolean;
}

// 스팟 폼 데이터 타입
interface SpotFormData {
  mbti: string;
  mood: string;
  mode: string;
  sign: string;
  activity: string;
  activityEmoji: string;
  avatar: AvatarConfig;
}

// 더미 데이터 생성 (서울시 실시간 API 연동 전 기본 분포)
function generateDummyData(): DummySpot[] {
  const spots: DummySpot[] = [];
  let id = 1;

  FIXED_PLACES.forEach((place, idx) => {
    const count = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const mbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
      const latOffset = (Math.random() - 0.5) * 0.0004;
      const lngOffset = (Math.random() - 0.5) * 0.0004;
      const activity = getRandomActivity(place.category);
      spots.push({
        id: id++,
        mbti,
        mood: MOOD_LIST[Math.floor(Math.random() * MOOD_LIST.length)],
        mode: MODE_LIST[Math.floor(Math.random() * MODE_LIST.length)],
        sign: SIGN_LIST[Math.floor(Math.random() * SIGN_LIST.length)],
        lat: place.lat + latOffset,
        lng: place.lng + lngOffset,
        avatar: randomAvatarConfig(),
        placeName: place.placeName,
        category: place.category,
        activity,
        hashtags: getPlaceHashtags(place.category, idx * 7 + i),
        nearbyCount: 3 + Math.floor(Math.random() * 20),
        createdAt: Date.now() - Math.floor(Math.random() * 3600000),
      });
    }
  });

  return spots;
}

// 도시 목록
// MVP: 홍대/연남/성수 3개 지역만
const CITIES = [
  { name: "홍대", lat: 37.5566, lng: 126.9236 },
  { name: "연남", lat: 37.5630, lng: 126.9260 },
  { name: "성수", lat: 37.5444, lng: 127.0557 },
];

// 서울시 실시간 API 연동 장소 매핑
const SEOUL_CITY_API_PLACES: Record<string, string[]> = {
  "홍대": ["홍대 관광특구", "연남동"],
  "성수": ["성수카페거리"],
};

// 경과 시간 포맷
function formatElapsed(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}초 전`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  return `${hr}시간 전`;
}

// 경과 시간 표시 컴포넌트
function ElapsedTimer({ createdAt, mbtiColor }: { createdAt: number; mbtiColor: string }) {
  const [elapsed, setElapsed] = useState(Date.now() - createdAt);
  useEffect(() => {
    const timer = setInterval(() => setElapsed(Date.now() - createdAt), 1000);
    return () => clearInterval(timer);
  }, [createdAt]);
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: mbtiColor, animation: 'pulse-dot 1.5s ease-in-out infinite', flexShrink: 0 }} />
      <div className="text-sm font-black tabular-nums" style={{ color: mbtiColor, letterSpacing: '0.02em' }}>
        {formatElapsed(elapsed)}
      </div>
      <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>지나는 중</div>
    </div>
  );
}

export default function MvpMap() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [splashFading, setSplashFading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const trackGps = trpc.log.trackGps.useMutation();
  const trackEvent = trpc.log.trackEvent.useMutation();
  const submitSpot = trpc.spot.submit.useMutation();
  const { data: spotsData, refetch: refetchSpots } = trpc.spot.getAll.useQuery(undefined, { refetchInterval: 30000 });
  const mvpLogIdRef = useRef<number | null>(null);
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [spotFormData, setSpotFormData] = useState<SpotFormData>({ mbti: "", mood: "", mode: "", sign: "", activity: "", activityEmoji: "", avatar: randomAvatarConfig() });
  const [avatarTab, setAvatarTab] = useState<'animal' | 'accessory' | 'expression' | 'emoji'>('animal');
  const [showAllAnimals, setShowAllAnimals] = useState(false);
  const [avatarTabSliding, setAvatarTabSliding] = useState(false);
  const [avatarSlideDir, setAvatarSlideDir] = useState<'left' | 'right'>('right');
  const [spotSubmitted, setSpotSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<{ mbti: string; distance: number } | null>(null);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupExpanded, setPopupExpanded] = useState(false);
  const [popupTagVotes, setPopupTagVotes] = useState<Record<string, number>>({});
  const popupCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popupAddress, setPopupAddress] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [popupPlaceName, setPopupPlaceName] = useState<string | null>(null);

  // 카카오맵 refs - 3개 지역 미리 초기화용
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // 현재 활성 지도 컨테이너 (하위 호환)
  // 지역별 독립 컨테이너 refs
  const hongdaeContainerRef = useRef<HTMLDivElement | null>(null);
  const yeonnamContainerRef = useRef<HTMLDivElement | null>(null);
  const seongsuContainerRef = useRef<HTMLDivElement | null>(null);
  // 지역별 독립 지도 refs
  const hongdaeMapRef = useRef<any>(null);
  const yeonnamMapRef = useRef<any>(null);
  const seongsuMapRef = useRef<any>(null);
  // 지역별 마커 refs
  const hongdaeMarkersRef = useRef<any[]>([]);
  const yeonnamMarkersRef = useRef<any[]>([]);
  const seongsuMarkersRef = useRef<any[]>([]);
  const mapRef = useRef<any>(null); // 현재 활성 지도 (하위 호환)
  const markersRef = useRef<any[]>([]);
  const realSpotMarkersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const cityLabelsRef = useRef<any[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const [mapsPreloaded, setMapsPreloaded] = useState(false); // 3개 지도 미리 로드 완료 여부

  const [currentZoom, setCurrentZoom] = useState(15.0);
  const [hotspotCityNames, setHotspotCityNames] = useState<string[]>([]);
  const [showHotplacePopup, setShowHotplacePopup] = useState(false);
  const [selectedHotplaceTab, setSelectedHotplaceTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [hotplaceVisible, setHotplaceVisible] = useState(false);
  const [spotFormVisible, setSpotFormVisible] = useState(false);
  const [consentVisible, setConsentVisible] = useState(false);
  const spotFormCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consentCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dummyDataRef = useRef<DummySpot[]>([]);
  const [showSpotFeed, setShowSpotFeed] = useState(false);

  // 새 UI 상태 변수
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string | null>(null);
  const [selectedFilterPurpose, setSelectedFilterPurpose] = useState<string | null>(null);
  const [showMomentReport, setShowMomentReport] = useState(false);
  const [showCommunityFeed, setShowCommunityFeed] = useState(false);
  const [profileNickname, setProfileNickname] = useState('');
  const [profileEditingNick, setProfileEditingNick] = useState(false);
  const [savedSpots, setSavedSpots] = useState<Array<{ name: string; region: string; date: string }>>([]);
  const [selectedKakaoPlace, setSelectedKakaoPlace] = useState<KakaoPlaceInfo | null>(null);
  const [kakaoPlaceVisible, setKakaoPlaceVisible] = useState(false);

  // 서울시 실시간 데이터 상태
  const [seoulCityData, setSeoulCityData] = useState<Record<string, any>>({});
  const [seoulBanner, setSeoulBanner] = useState<{ text: string; color: string; icon: string } | null>(null);

  // 서울시 실시간 데이터 조회 (홍대 관광특구, 연남동, 성수카페거리)
  const { data: hongdaeData } = trpc.citydata.getDistrict.useQuery({ area: "홍대 관광특구" }, { refetchInterval: 300000 });
  const { data: yeonnamData } = trpc.citydata.getDistrict.useQuery({ area: "연남동" }, { refetchInterval: 300000 });
  const { data: seongsuData } = trpc.citydata.getDistrict.useQuery({ area: "성수카페거리" }, { refetchInterval: 300000 });

  // 카카오 이미지 검색 - 지역 분위기 사진
  const { data: hongdaeImgs } = trpc.kakao.searchImages.useQuery({ query: '홍대 카페 골목 2025' }, { refetchInterval: 600000 });
  const { data: yeonnamImgs } = trpc.kakao.searchImages.useQuery({ query: '연남동 카페 감성 2025' }, { refetchInterval: 600000 });
  const { data: seongsuImgs } = trpc.kakao.searchImages.useQuery({ query: '성수동 팝업 힙 2025' }, { refetchInterval: 600000 });
  const [imgIndexes, setImgIndexes] = useState({ hongdae: 0, yeonnam: 0, seongsu: 0 });

  // 사진 랜덤 순환 (10초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndexes(prev => ({
        hongdae: hongdaeImgs?.images?.length ? (prev.hongdae + 1) % hongdaeImgs.images.length : 0,
        yeonnam: yeonnamImgs?.images?.length ? (prev.yeonnam + 1) % yeonnamImgs.images.length : 0,
        seongsu: seongsuImgs?.images?.length ? (prev.seongsu + 1) % seongsuImgs.images.length : 0,
      }));
    }, 10000);
    return () => clearInterval(timer);
  }, [hongdaeImgs, yeonnamImgs, seongsuImgs]);

  const HONGDAE_CENTER = { lat: 37.5400, lng: 126.9700 };
  const [screenHeight, setScreenHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const [homeCityIndex, setHomeCityIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 서울시 실시간 데이터 → 배너 업데이트
  useEffect(() => {
    const allData: Record<string, any> = {};
    if (hongdaeData?.success) allData["홍대 관광특구"] = hongdaeData;
    if (yeonnamData?.success) allData["연남동"] = yeonnamData;
    if (seongsuData?.success) allData["성수카페거리"] = seongsuData;
    setSeoulCityData(allData);

    // 현재 지도 중심 기준 가장 가까운 장소의 혼잡도 배너 설정
    const entries = Object.entries(allData);
    if (entries.length === 0) return;

    // 첫 번째 데이터로 배너 설정
    const [placeName, data] = entries[0];
    const congestion = data?.AREA_CONGEST_LVL || "";
    let icon = "🟢";
    let color = "#00c896";
    let text = "";
    if (congestion.includes("붐빔")) { icon = "🔴"; color = "#ff4500"; text = `${placeName} 지금 매우 붐빔`; }
    else if (congestion.includes("약간 붐빔")) { icon = "🟠"; color = "#ff9f43"; text = `${placeName} 약간 붐빔`; }
    else if (congestion.includes("보통")) { icon = "🟡"; color = "#ffd700"; text = `${placeName} 보통 혼잡`; }
    else if (congestion.includes("여유")) { icon = "🟢"; color = "#00c896"; text = `${placeName} 여유 있음`; }
    else { text = `${placeName} 실시간 데이터 로딩 중`; }

    if (text) setSeoulBanner({ text, color, icon });
  }, [hongdaeData, yeonnamData, seongsuData]);

  // 팝업 페이드인/아웃
  useEffect(() => {
    if (popupData) {
      if (popupCloseTimerRef.current) clearTimeout(popupCloseTimerRef.current);
      requestAnimationFrame(() => setPopupVisible(true));
    }
  }, [popupData]);

  // 검색창 페이드인/아웃
  useEffect(() => {
    if (showSearch) requestAnimationFrame(() => setSearchVisible(true));
    else setSearchVisible(false);
  }, [showSearch]);

  // 핫플 바텀시트 페이드인/아웃
  useEffect(() => {
    if (showHotplacePopup) requestAnimationFrame(() => setHotplaceVisible(true));
    else setHotplaceVisible(false);
  }, [showHotplacePopup]);

  // 스팟 폼 페이드인/아웃
  useEffect(() => {
    if (showSpotForm) {
      if (spotFormCloseTimerRef.current) clearTimeout(spotFormCloseTimerRef.current);
      requestAnimationFrame(() => setSpotFormVisible(true));
    } else setSpotFormVisible(false);
  }, [showSpotForm]);

  // GPS 동의 팝업 페이드인/아웃
  useEffect(() => {
    if (showConsentPopup) {
      if (consentCloseTimerRef.current) clearTimeout(consentCloseTimerRef.current);
      requestAnimationFrame(() => setConsentVisible(true));
    } else setConsentVisible(false);
  }, [showConsentPopup]);

  const gpsAgreedRef = useRef<boolean>(false);
  const gpsRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 스플래시 → 지도 전환
  useEffect(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (gpsRetryTimerRef.current) { clearTimeout(gpsRetryTimerRef.current); gpsRetryTimerRef.current = null; }
    gpsAgreedRef.current = false;
    const checkLogId = () => {
      const id = Number(sessionStorage.getItem('spotLogId_/mvp') || sessionStorage.getItem('spotLogId') || '0');
      if (id) mvpLogIdRef.current = id;
    };
    const idTimer = setTimeout(checkLogId, 500);
    const fadeTimer = setTimeout(() => setSplashFading(true), 500);
    const timer = setTimeout(() => { setScreen("home"); }, 800);
    const consentTimer = setTimeout(() => setShowConsentPopup(true), 5800);
    return () => { clearTimeout(timer); clearTimeout(idTimer); clearTimeout(fadeTimer); clearTimeout(consentTimer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GPS 추적 시작
  const startGpsWatch = useCallback((agreed: boolean) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    const onSuccess = (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      setUserLocation({ lat, lng });
      if (userMarkerRef.current && mapRef.current) {
        userMarkerRef.current.setPosition(new window.kakao.maps.LatLng(lat, lng));
      }
      if (agreed && accuracy < 100) {
        // trackGps requires logId - skip for now
        // trackGps.mutate({ lat, lng, accuracy, page: '/mvp' });
      }
    };
    const onError = () => {
      if (gpsRetryTimerRef.current) clearTimeout(gpsRetryTimerRef.current);
      gpsRetryTimerRef.current = setTimeout(() => {
        if (!gpsAgreedRef.current) return;
        watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
      }, 3000);
    };
    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: false, timeout: 3000, maximumAge: 5000 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackGps]);

  const handleConsent = useCallback((agreed: boolean) => {
    setShowConsentPopup(false);
    gpsAgreedRef.current = agreed;
    trackEvent.mutate({ eventName: agreed ? 'click_GPS_동의' : 'click_GPS_미동의', page: '/mvp' });
    startGpsWatch(agreed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGpsWatch, trackEvent]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      if (gpsRetryTimerRef.current) { clearTimeout(gpsRetryTimerRef.current); gpsRetryTimerRef.current = null; }
      gpsAgreedRef.current = false;
    };
  }, []);

  // HOTSPOT 도시 선정
  const hotspotCitiesRef = useRef<string[] | null>(null);
  const getHotspotCities = useCallback((cityNames: string[]) => {
    if (hotspotCitiesRef.current) return hotspotCitiesRef.current;
    const candidates = ["홍대", "강남", "여의도", "성수", "명동", "부산", "대구", "인천", "광주", "대전", "울산", "수원", "고양", "제주시"].filter(c => cityNames.includes(c));
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    hotspotCitiesRef.current = shuffled.slice(0, 3);
    return hotspotCitiesRef.current;
  }, []);

  // 도시별 MBTI 집계
  const aggregateCityData = useCallback(() => {
    const dummyData = generateDummyData();
    const cityStats: Record<string, Record<string, number>> = {};
    CITIES.forEach(city => { cityStats[city.name] = {}; });
    dummyData.forEach(item => {
      let closestCity = CITIES[0];
      let minDist = Infinity;
      CITIES.forEach(city => {
        const d = Math.sqrt(Math.pow(city.lat - item.lat, 2) + Math.pow(city.lng - item.lng, 2));
        if (d < minDist) { minDist = d; closestCity = city; }
      });
      if (!cityStats[closestCity.name][item.mbti]) cityStats[closestCity.name][item.mbti] = 0;
      cityStats[closestCity.name][item.mbti]++;
    });
    return { cities: CITIES, cityStats };
  }, []);

  // 카카오맵 초기화 - 스플래시 중 3개 지역 동시 미리 로드
  useEffect(() => {
    // 더미 데이터 미리 생성
    const dummyData = generateDummyData();
    dummyDataRef.current = dummyData;

    // CSS 주입 (한 번만)
    if (!document.getElementById('spot-map-style')) {
      const style = document.createElement('style');
      style.id = 'spot-map-style';
      style.textContent = `
        @keyframes pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.7; } }
        @keyframes hotspot-badge-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes banner-border-glow { 0%, 100% { box-shadow: 0 0 8px rgba(255,69,0,0.3); } 50% { box-shadow: 0 0 16px rgba(255,69,0,0.6); } }
        @keyframes rank-1-glow { 0%, 100% { color: #ffd700; } 50% { color: #ffe84d; } }
        @keyframes banner-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .hotspot-banner { animation: banner-border-glow 2.5s ease-in-out infinite; }
        .spot-dot-marker { transition: transform 0.15s ease; }
        .spot-dot-marker:hover { transform: scale(1.5); }
      `;
      document.head.appendChild(style);
    }

    // 3개 지역 정보
    const REGION_CONFIGS = [
      { name: '홍대', center: HONGDAE_CENTER, containerRef: hongdaeContainerRef, mapRef: hongdaeMapRef, markersRef: hongdaeMarkersRef },
      { name: '연남', center: { lat: 37.5630, lng: 126.9260 }, containerRef: yeonnamContainerRef, mapRef: yeonnamMapRef, markersRef: yeonnamMarkersRef },
      { name: '성수', center: { lat: 37.5444, lng: 127.0557 }, containerRef: seongsuContainerRef, mapRef: seongsuMapRef, markersRef: seongsuMarkersRef },
    ];

    let loadedCount = 0;

    const initRegionMap = (config: typeof REGION_CONFIGS[0]) => {
      const container = config.containerRef.current;
      if (!container || !window.kakao) return;
      const kakao = window.kakao;
      const center = config.center;

      // 지도 생성
      const mapOptions = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 4,
      };
      const map = new kakao.maps.Map(container, mapOptions);
      config.mapRef.current = map;

      // 현재 선택된 지역이면 mapRef도 업데이트 (mapVisible은 지역 버튼 클릭 시에만 활성화)
      if (config.name === (selectedCity || '홍대')) {
        mapRef.current = map;
        markersRef.current = config.markersRef.current;
      }

      // 컨테이너 크기 재계산
      requestAnimationFrame(() => {
        map.relayout();
        map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
      });

      loadedCount++;
      if (loadedCount === 3) setMapsPreloaded(true);

      const map_local = map; // 클로저용
      const container_local = container;
      const center_local = center;

      // 줌 이벤트 (현재 선택된 지역만)
      kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        setCurrentZoom(level);
      });

      // 해당 지역 더미 데이터만 필터링
      const regionRadius = 0.08;
      const regionData = dummyData.filter(item =>
        Math.abs(item.lat - center.lat) < regionRadius &&
        Math.abs(item.lng - center.lng) < regionRadius
      );

      const createMarker = (item: DummySpot) => {
        const mbtiColor = MBTI_COLORS[item.mbti] || "#00f0ff";
        const el = document.createElement('div');
        el.className = 'spot-dot-marker';
        el.dataset.mbti = item.mbti;
        el.dataset.category = item.category || '';
        el.style.cssText = `width:8px;height:8px;border-radius:50%;background:${mbtiColor};box-shadow:0 0 6px ${mbtiColor}99;cursor:pointer;position:relative;`;
        const overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(item.lat, item.lng),
          content: el,
          zIndex: 10,
        });
        overlay.setMap(map);
        (overlay as any)._spotData = item;
        el.addEventListener('click', () => {
          const userLoc = userLocation || HONGDAE_CENTER;
          const dist = Math.round(haversineDistance(userLoc.lat, userLoc.lng, item.lat, item.lng));
          setPopupData({ ...item, distance: dist });
          setPopupAddress(null);
          setPopupExpanded(false);
          setPopupTagVotes({});
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(item.lng, item.lat, (result: any[], status: string) => {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
              const addr = result[0].road_address?.address_name || result[0].address?.address_name || null;
              setPopupAddress(addr);
            }
          });
        });
        config.markersRef.current.push(overlay);
        markersRef.current.push(overlay); // 하위 호환
      };

      // 마커 즉시 배치 (지역별 데이터만이라 빠름)
      regionData.forEach(createMarker);

      // 사용자 위치 마커 (홍대 지도에만)
      if (config.name === '홍대') {
        const userEl = document.createElement('div');
        userEl.style.cssText = `width:16px;height:16px;background:white;border:3px solid rgba(255,255,255,0.9);border-radius:50%;box-shadow:0 0 8px rgba(255,255,255,0.6);`;
        const userOverlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(center.lat, center.lng),
          content: userEl,
          zIndex: 100,
        });
        userOverlay.setMap(map);
        userMarkerRef.current = userOverlay;
      }

      // 지도 클릭 이벤트 - 장소 정보 조회
      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        if (popupData) {
          setPopupVisible(false);
          setTimeout(() => setPopupData(null), 220);
        }
        const latlng = mouseEvent.latLng;
        if (!latlng) return;
        const clickLat = latlng.getLat();
        const clickLng = latlng.getLng();
        const ps = new kakao.maps.services.Places();
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(clickLng, clickLat, (geoResult: any[], geoStatus: string) => {
          let keyword = '장소';
          if (geoStatus === kakao.maps.services.Status.OK && geoResult.length > 0) {
            const addr = geoResult[0].road_address?.address_name || geoResult[0].address?.address_name || '';
            const parts = addr.split(' ');
            keyword = parts.slice(0, 3).join(' ');
          }
          ps.keywordSearch(keyword, (data: any[], status: string) => {
            if (status === kakao.maps.services.Status.OK && data.length > 0) {
              let closest = data[0];
              let minDist = Infinity;
              data.forEach((place: any) => {
                const pLat = parseFloat(place.y);
                const pLng = parseFloat(place.x);
                const dist = Math.sqrt(Math.pow(pLat - clickLat, 2) + Math.pow(pLng - clickLng, 2));
                if (dist < minDist) { minDist = dist; closest = place; }
              });
              const placeInfo: KakaoPlaceInfo = {
                id: closest.id,
                name: closest.place_name,
                address: closest.address_name,
                roadAddress: closest.road_address_name || closest.address_name,
                phone: closest.phone || '',
                category: closest.category_name,
                url: closest.place_url,
                lat: parseFloat(closest.y),
                lng: parseFloat(closest.x),
                distance: closest.distance ? parseInt(closest.distance) : undefined,
              };
              if (selectedKakaoPlace) {
                setKakaoPlaceVisible(false);
                setTimeout(() => {
                  setSelectedKakaoPlace(placeInfo);
                  setKakaoPlaceVisible(true);
                }, 200);
              } else {
                setSelectedKakaoPlace(placeInfo);
                setTimeout(() => setKakaoPlaceVisible(true), 50);
              }
            }
          }, {
            location: new kakao.maps.LatLng(clickLat, clickLng),
            radius: 50,
            sort: kakao.maps.services.SortBy.DISTANCE,
          });
        });
      });
    }; // end initRegionMap

    // 스팟 등록 폼 타이머 (11초 후)
    const spotFormTimer = setTimeout(() => {
      if (!spotSubmitted) setShowSpotForm(true);
    }, 11000);

    // kakao SDK 로드 후 3개 지역 동시 초기화
    const runInit = () => {
      REGION_CONFIGS.forEach(initRegionMap);
      // 홈 미니맵 초기화 (서울 전체 뷰, 인터랙션 비활성화)
      const minimapContainer = document.getElementById('home-minimap');
      if (minimapContainer) {
        const minimapOptions = {
          center: new window.kakao.maps.LatLng(37.5520, 126.9780), // 홍대~성수 중간
          level: 7, // 서울 전체 보이는 줌
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          keyboardShortcuts: false,
        };
        const minimap = new window.kakao.maps.Map(minimapContainer, minimapOptions);
        // 3개 지역 마커 표시
        [{ lat: 37.5400, lng: 126.9700, label: '홍대' }, { lat: 37.5630, lng: 126.9260, label: '연남' }, { lat: 37.5444, lng: 127.0557, label: '성수' }].forEach(({ lat, lng, label }) => {
          const markerEl = document.createElement('div');
          markerEl.style.cssText = 'background:#00C9C9;color:#fff;font-size:11px;font-weight:900;padding:4px 9px;border-radius:14px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,201,201,0.5);white-space:nowrap;cursor:pointer;';
          markerEl.textContent = label;
          const overlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(lat, lng),
            content: markerEl,
            yAnchor: 0.5,
          });
          overlay.setMap(minimap);
        });
      }
    };

    if (window.kakao) {
      window.kakao.maps.load(runInit);
    } else {
      let retryCount = 0;
      const retryTimer = setInterval(() => {
        retryCount++;
        if (window.kakao) {
          clearInterval(retryTimer);
          window.kakao.maps.load(runInit);
        } else if (retryCount > 50) {
          clearInterval(retryTimer);
          console.warn('[SPOT] Kakao Maps SDK failed to load');
        }
      }, 100);
    }

    return () => {
      clearTimeout(spotFormTimer);
      hongdaeMarkersRef.current.forEach(m => m.setMap(null));
      yeonnamMarkersRef.current.forEach(m => m.setMap(null));
      seongsuMarkersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      realSpotMarkersRef.current.forEach(m => m.setMap(null));
      realSpotMarkersRef.current = [];
      cityLabelsRef.current.forEach(m => m.setMap(null));
      cityLabelsRef.current = [];
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 지역 변경 시 mapRef 전환 + relayout
  useEffect(() => {
    if (screen !== 'map') return;
    const city = selectedCity || '홍대';
    const regionMap = city === '홍대' ? hongdaeMapRef.current
      : city === '연남' ? yeonnamMapRef.current
      : seongsuMapRef.current;
    if (regionMap) {
      mapRef.current = regionMap;
      // 숨겨졌다 다시 보이는 지도는 relayout 필요
      requestAnimationFrame(() => {
        regionMap.relayout();
      });
      setMapVisible(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, screen]);

  // 줌 레벨에 따라 마커/레이블 표시/숨김
  useEffect(() => {
    const isZoomedOut = currentZoom > 7;
    markersRef.current.forEach(marker => {
      const el = marker.getContent();
      if (el instanceof HTMLElement) el.style.opacity = isZoomedOut ? '0' : '1';
    });
    cityLabelsRef.current.forEach(label => {
      const el = label.getContent();
      if (el instanceof HTMLElement) el.style.opacity = isZoomedOut ? '1' : '0';
    });
  }, [currentZoom]);

  // DB 스팟 마커 업데이트
  const addRealSpotMarker = useCallback((spot: { id: number; mbti: string; mood: string; mode: string; sign: string; lat: number; lng: number; avatar?: AvatarConfig }) => {
    if (!mapRef.current || !window.kakao) return;
    const kakao = window.kakao;
    const mbtiColor = MBTI_COLORS[spot.mbti] || "#00f0ff";
    const el = document.createElement('div');
    el.className = 'spot-dot-marker';
    el.dataset.mbti = spot.mbti;
    el.style.cssText = `
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${mbtiColor};
      box-shadow: 0 0 8px ${mbtiColor}cc, 0 0 16px ${mbtiColor}66;
      cursor: pointer;
      border: 1.5px solid rgba(255,255,255,0.5);
    `;
    const overlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(spot.lat, spot.lng),
      content: el,
      zIndex: 20,
    });
    overlay.setMap(mapRef.current);
    (overlay as any)._spotData = spot;

    el.addEventListener('click', () => {
      const userLoc = userLocation || HONGDAE_CENTER;
      const dist = Math.round(haversineDistance(userLoc.lat, userLoc.lng, spot.lat, spot.lng));
      setPopupData({ ...spot, distance: dist, isReal: true });
      setPopupAddress(null);
      setPopupExpanded(false);
      setPopupTagVotes({});
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2Address(spot.lng, spot.lat, (result: any[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result.length > 0) {
          const addr = result[0].road_address?.address_name || result[0].address?.address_name || null;
          setPopupAddress(addr);
        }
      });
    });

    realSpotMarkersRef.current.push(overlay);
  }, [userLocation]);

  useEffect(() => {
    if (!spotsData?.spots || !mapRef.current) return;
    realSpotMarkersRef.current.forEach(m => m.setMap(null));
    realSpotMarkersRef.current = [];
    spotsData.spots.forEach(spot => {
      let parsedAvatar: AvatarConfig | undefined = undefined;
      if (spot.avatar) { try { parsedAvatar = deserializeAvatar(spot.avatar); } catch (_) {} }
      addRealSpotMarker({ ...spot, avatar: parsedAvatar });
    });
  }, [spotsData, addRealSpotMarker]);

  // MBTI 필터링
  const filterByMBTI = (mbti: string) => {
    if (selectedMBTI === mbti) {
      setSelectedMBTI(null);
      markersRef.current.forEach(marker => {
        const el = marker.getContent();
        if (el instanceof HTMLElement) el.style.opacity = "1";
      });
    } else {
      setSelectedMBTI(mbti);
      markersRef.current.forEach(marker => {
        const el = marker.getContent();
        if (el instanceof HTMLElement) {
          el.style.opacity = el.dataset.mbti === mbti ? "1" : "0.15";
        }
      });
    }
  };

  // 카테고리 필터링
  const filterByCategory = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      markersRef.current.forEach(marker => {
        const el = marker.getContent();
        if (el instanceof HTMLElement) { el.style.opacity = "1"; el.style.display = ""; }
      });
    } else {
      setSelectedCategory(category);
      markersRef.current.forEach(marker => {
        const el = marker.getContent();
        if (el instanceof HTMLElement) {
          const cat = el.dataset.category;
          el.style.opacity = !cat ? "0.08" : (cat === category ? "1" : "0.08");
        }
      });
    }
  };

  // 카카오 장소 검색
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim() || q.trim().length < 2) { setSearchResults([]); return; }
    if (!window.kakao || !mapRef.current) return;
    setSearchLoading(true);
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(q, (data: any[], status: string) => {
      setSearchLoading(false);
      if (status === window.kakao.maps.services.Status.OK) {
        const items = data.slice(0, 5).map((d: any) => ({
          name: d.place_name,
          lat: parseFloat(d.y),
          lng: parseFloat(d.x),
        }));
        setSearchResults(items);
      } else {
        setSearchResults([]);
      }
    }, { location: mapRef.current.getCenter() });
  };

  // 검색 패널 외부 클릭 시 닫기
  useEffect(() => {
    if (!showSearch) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showSearch]);


  // 스플래시/홈/지도 화면을 하나의 return으로 통합 (ref 항상 유지)
  const currentCity = selectedCity || '홍대';
  const currentCityData = currentCity === '홍대' ? hongdaeData : currentCity === '성수' ? seongsuData : yeonnamData;
  const congestionLevel = currentCityData?.congestLvl || '';
  const congestionAge = currentCityData?.ppltnMin ? `${currentCityData.ppltnMin}~${currentCityData.ppltnMax}명` : '';

  return (
    <div style={{ position: 'fixed', inset: 0, height: `${screenHeight}px` }}>
      {/* ===== 스플래시 화면 ===== */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{
          height: `${screenHeight}px`,
          background: '#F5F0E8',
          opacity: splashFading ? 0 : 1,
          transition: 'opacity 0.3s ease',
          zIndex: 100,
          display: screen === 'splash' ? 'flex' : 'none',
          pointerEvents: screen === 'splash' ? 'auto' : 'none',
        }}
      >
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: '52px',
            color: '#2C1810',
            fontFamily: "'Inter', 'Pretendard', sans-serif",
            letterSpacing: '-0.02em'
          }}
        >
          SPOT
        </h1>
      </div>

      {/* ===== 홈 화면 (지역 선택) ===== */}
      <div
        className="fixed inset-0 flex flex-col"
        style={{ height: `${screenHeight}px`, background: '#F5F0E8', display: screen === 'home' ? 'flex' : 'none' }}
      >
        <Toaster position="top-center" />

        {/* 광고 배너 - 앱 내 광고 컨셉 */}
        <div
          style={{
            background: '#2C1810',
            color: '#F5F0E8',
            fontSize: '12px',
            fontWeight: 600,
            textAlign: 'center',
            padding: '8px 16px',
            lineHeight: 1.5,
            flexShrink: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {[`🔥 일일수작 홍대입구역점 4/15~4/19 소주 3천원`, `🌸 산리오 팝업 홍대 7번 출구 · 구경만 해도 키링 증정`, `☕ 메가커피 홍대점 오늘 아아 1+1 이벤트 진행 중`, `🍺 홍대 맥주창고 오늘 생맥주 2+1 · 테이블 예약 가능`, `🎵 클럽 FF 오늘 밤 DJ 세트 · 입장료 1만원 할인`, `🍜 연남동 파스타피아 런치 세트 8천원 · 오늘만`][Math.floor(Date.now() / 5000) % 6]}
        </div>

        {/* 상단 헤더 - SPOT 로고 중앙 */}
        <div
          className="flex items-center justify-center"
          style={{ height: '52px', flexShrink: 0, borderBottom: '1px solid #E0D8CC' }}
        >
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#2C1810', letterSpacing: '-0.02em' }}>SPOT</span>
        </div>

        {/* ===== Zenly+BeReal 스타일 홈화면 ===== */}
        <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F7F5F2' }}>

          {/* 상단: 라이브 미니맵 */}
          <div style={{ position: 'relative', flex: '0 0 48%', overflow: 'hidden' }}>
            {/* 카카오맵 미니맵 배경 */}
            <div
              id="home-minimap"
              style={{ width: '100%', height: '100%', filter: 'brightness(1.05) saturate(0.9)' }}
            />
            {/* 반투명 오버레이 */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(247,245,242,0) 50%, rgba(247,245,242,0.95) 100%)', pointerEvents: 'none' }} />

            {/* 지역 핀 버튼 3개 */}
            {[
              { city: '홍대', x: '28%', y: '42%', congestLvl: hongdaeData?.congestLvl, updatedAt: hongdaeData?.updatedAt },
              { city: '연남', x: '22%', y: '28%', congestLvl: yeonnamData?.congestLvl, updatedAt: yeonnamData?.updatedAt },
              { city: '성수', x: '72%', y: '55%', congestLvl: seongsuData?.congestLvl, updatedAt: seongsuData?.updatedAt },
            ].map((pin) => {
              const col = pin.congestLvl?.includes('붐빔') ? '#E53E3E' : pin.congestLvl?.includes('보통') ? '#D69E2E' : '#00C9C9';
              return (
                <button
                  key={pin.city}
                  onClick={() => { setSelectedCity(pin.city); setScreen('map'); setMapVisible(true); }}
                  style={{
                    position: 'absolute', left: pin.x, top: pin.y,
                    transform: 'translate(-50%, -50%)',
                    background: '#FFFFFF', border: `2.5px solid ${col}`,
                    borderRadius: '20px', padding: '5px 10px',
                    cursor: 'pointer', boxShadow: `0 2px 12px ${col}55`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
                    zIndex: 10,
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.02em' }}>{pin.city}</span>
                  {pin.congestLvl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <div style={{ position: 'relative', width: '5px', height: '5px' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: col, animation: 'spot-pulse 1.8s ease-out infinite' }} />
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: col, position: 'relative', zIndex: 1 }} />
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: col }}>{pin.congestLvl}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '9px', color: '#C0B8B0' }}>로딩 중</span>
                  )}
                </button>
              );
            })}

            {/* LIVE 배지 */}
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: '#FF3B30', color: '#fff',
              fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em',
              padding: '3px 8px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '4px',
              boxShadow: '0 2px 8px rgba(255,59,48,0.4)',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', animation: 'spot-pulse 1.5s ease-out infinite' }} />
              LIVE
            </div>

            {/* 지도 보기 버튼 */}
            <button
              onClick={() => { setSelectedCity(selectedCity || '홍대'); setScreen('map'); setMapVisible(true); }}
              style={{
                position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
                background: '#00C9C9', color: '#fff',
                fontSize: '12px', fontWeight: 800, letterSpacing: '-0.01em',
                padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,201,201,0.4)',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              지금 지도 보기
            </button>
          </div>

          {/* 하단: 실시간 피드 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 12px' }}>
            {/* 섹션 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em' }}>지금 이 골목에서</span>
              <span style={{ fontSize: '11px', color: '#00C9C9', fontWeight: 700 }}>전체 보기</span>
            </div>

            {/* 피드 아이템 */}
            {[
              { city: '홍대', time: '방금', text: '이 골목 지금 완전 내 바이브다', img: hongdaeImgs?.images?.[imgIndexes.hongdae]?.url || hongdaeImgs?.images?.[imgIndexes.hongdae]?.thumbnail, congestLvl: hongdaeData?.congestLvl },
              { city: '성수', time: '1분 전', text: '서울숲 지금 완전 골든아워다 빨리 와', img: seongsuImgs?.images?.[imgIndexes.seongsu]?.url || seongsuImgs?.images?.[imgIndexes.seongsu]?.thumbnail, congestLvl: seongsuData?.congestLvl },
              { city: '연남', time: '3분 전', text: '경의선숲길 오늘 노을 진짜 말도 안 됨', img: yeonnamImgs?.images?.[imgIndexes.yeonnam]?.url || yeonnamImgs?.images?.[imgIndexes.yeonnam]?.thumbnail, congestLvl: yeonnamData?.congestLvl },
              { city: '홍대', time: '5분 전', text: '홍대 2번 출구 앞 지금 뭔가 터질 것 같은 분위기', img: hongdaeImgs?.images?.[(imgIndexes.hongdae + 2) % (hongdaeImgs?.images?.length || 1)]?.url, congestLvl: hongdaeData?.congestLvl },
              { city: '성수', time: '8분 전', text: '성수 팝업 줄 서는 사람들 표정이 다 설레보임', img: seongsuImgs?.images?.[(imgIndexes.seongsu + 1) % (seongsuImgs?.images?.length || 1)]?.url, congestLvl: seongsuData?.congestLvl },
            ].map((item, i) => {
              const col = item.congestLvl?.includes('붐빔') ? '#E53E3E' : item.congestLvl?.includes('보통') ? '#D69E2E' : '#00C9C9';
              return (
                <button
                  key={i}
                  onClick={() => { setSelectedCity(item.city); setScreen('map'); setMapVisible(true); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 0',
                    background: 'none', border: 'none', borderBottom: '1px solid #EDEAE5',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {/* 썸네일 */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                    overflow: 'hidden', background: '#EDE8E0',
                    border: `2px solid ${col}33`,
                  }}>
                    {item.img ? (
                      <img src={item.img} alt={item.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {item.city === '홍대' ? '🎵' : item.city === '연남' ? '☕' : '🏭'}
                      </div>
                    )}
                  </div>
                  {/* 텍스트 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: col, background: col + '15', borderRadius: '6px', padding: '1px 6px' }}>{item.city}</span>
                      <span style={{ fontSize: '10px', color: '#B0A898', fontWeight: 500 }}>{item.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#2A2A2A', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>{item.text}</p>
                  </div>
                  {/* 화살표 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0B8B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* pulse 애니메이션 keyframes */}
        <style>{`
          @keyframes spot-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(3.5); opacity: 0; }
          }
        `}</style>

        {/* 홈화면 하단 탭바 - 5개 */}
        <div
          className="flex items-center justify-around px-2"
          style={{
            background: '#F5F0E8',
            borderTop: '1.5px solid #2C1810',
            height: '68px',
            flexShrink: 0,
          }}
        >
          {/* 홈 탭 (현재 활성) */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', padding: '4px 8px' }}
          >
            {/* 커서/홈 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 700 }}>홈</span>
          </button>

          {/* 지도 탭 */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
            onClick={() => { setSelectedCity(selectedCity || '홍대'); setScreen('map'); setMapVisible(true); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 500 }}>지도</span>
          </button>

          {/* 게시판 탭 - 강조 없이 다른 탭과 동일하게 */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
            onClick={() => { setSelectedCity(selectedCity || '홍대'); setScreen('map'); setMapVisible(true); setTimeout(() => setShowCommunityFeed(true), 100); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 500 }}>게시판</span>
          </button>

          {/* 검색 탭 */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
            onClick={() => { setSelectedCity(selectedCity || '홍대'); setScreen('map'); setMapVisible(true); setTimeout(() => { setShowSearch(true); setTimeout(() => setSearchVisible(true), 10); }, 100); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 500 }}>검색</span>
          </button>

          {/* 프로필 탭 */}
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
            onClick={() => setScreen('profile')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 500 }}>프로필</span>
          </button>
        </div>
      </div>

      {/* ===== 지도 화면 ===== */}
      <div
        className="fixed inset-0 flex flex-col"
        style={{
          height: `${screenHeight}px`,
          background: '#F5F0E8',
          display: screen === 'map' ? 'flex' : 'none',
        }}
      >
      <Toaster position="top-center" />

      {/* 상단 헤더 */}
      <div
        className="flex items-center px-4 py-2"
        style={{
          background: '#F5F0E8',
          borderBottom: '1.5px solid #2C1810',
          flexShrink: 0,
          minHeight: '48px'
        }}
      >
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => { setScreen('home'); setMapVisible(false); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', marginRight: '8px', padding: '4px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div style={{ fontSize: '18px', fontWeight: 900, color: '#2C1810' }}>{currentCity}</div>

        {congestionLevel && (
          <div
            className="flex items-center gap-1 ml-2"
            style={{ fontSize: '12px', color: '#6B5B4E', fontWeight: 600 }}
          >
            <span># 혼잡도: {congestionLevel.includes('붐빔') ? 'S' : congestionLevel.includes('보통') ? 'M' : 'L'}</span>
            {congestionAge && <span># {congestionAge}</span>}
          </div>
        )}
        {!congestionLevel && (
          <div style={{ fontSize: '12px', color: '#A89880', marginLeft: '8px' }}>
            # 혼잡도: S  #20대 압도적
          </div>
        )}
      </div>

      {/* 카카오맵 컨테이너 - 3개 지역 미리 로드 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 홍대 지도 */}
        <div
          ref={hongdaeContainerRef}
          className="absolute inset-0"
          style={{ display: currentCity === '홍대' ? 'block' : 'none', background: '#E8E0D0' }}
        />
        {/* 연남 지도 */}
        <div
          ref={yeonnamContainerRef}
          className="absolute inset-0"
          style={{ display: currentCity === '연남' ? 'block' : 'none', background: '#E8E0D0' }}
        />
        {/* 성수 지도 */}
        <div
          ref={seongsuContainerRef}
          className="absolute inset-0"
          style={{ display: currentCity === '성수' ? 'block' : 'none', background: '#E8E0D0' }}
        />

        {/* 카카오맵 로드 실패 시 폴백 */}
        {!mapRef.current && screen === 'map' && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: '#E8E0D0', color: '#A89880', fontSize: '13px', textAlign: 'center' }}
          >
            <div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
              <div>지도를 불러오는 중...</div>
            </div>
          </div>
        )}

        {/* 검색 패널 */}
        {showSearch && (
          <div
            ref={searchPanelRef}
            className="absolute top-2 left-2 right-2 z-30 rounded-lg overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #2C1810',
              boxShadow: '0 4px 16px rgba(44,24,16,0.15)',
              opacity: searchVisible ? 1 : 0,
              transform: searchVisible ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.18s ease, transform 0.18s ease'
            }}
          >
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid #E0D8CC' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="장소·지역 검색 (예: 홍대 카페)"
                className="flex-1 outline-none text-sm bg-transparent"
                style={{ color: '#2C1810' }}
              />
              <button
                onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                style={{ color: '#A89880', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
              >✕</button>
            </div>
            {searchLoading && <div className="px-3 py-3 text-center text-sm" style={{ color: '#A89880' }}>검색 중...</div>}
            {!searchLoading && searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2.5 text-sm"
                    style={{ color: '#2C1810', borderBottom: idx < searchResults.length - 1 ? '1px solid #F0EBE0' : 'none', background: 'transparent', cursor: 'pointer' }}
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setCenter(new window.kakao.maps.LatLng(result.lat, result.lng));
                        mapRef.current.setLevel(4);
                        toast.success(`📍 ${result.name}`, { duration: 2000 });
                        setShowSearch(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }
                    }}
                  >
                    📍 {result.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 업종&목적 필터 패널 (8.png) */}
        {showFilter && (
          <div
            className="absolute bottom-0 left-0 right-0 z-40"
            style={{
              background: '#B2DFDB',
              border: '1.5px solid #2C1810',
              borderBottom: 'none',
              borderRadius: '12px 12px 0 0',
              padding: '16px',
              opacity: filterVisible ? 1 : 0,
              transform: filterVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease'
            }}
          >
            {/* 업종 */}
            <div className="flex gap-2 mb-3">
              {['카페', '술집', '팝업', '전시'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilterCategory(prev => prev === cat ? null : cat)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: selectedFilterCategory === cat ? '#E53E3E' : '#E53E3E',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* 목적 */}
            <div style={{ borderTop: '1.5px solid #2C1810', paddingTop: '12px' }}>
              <div className="flex flex-wrap gap-2">
                {['#데이트', '#카공', '#작업', '#친목', '#식사', '#술', '#쇼핑', '#구경'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedFilterPurpose(prev => prev === tag ? null : tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: selectedFilterPurpose === tag ? '#F6E05E' : '#F6E05E',
                      color: '#2C1810',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {/* 닫기 화살표 */}
            <div className="flex justify-center mt-3">
              <button
                onClick={() => { setFilterVisible(false); setTimeout(() => setShowFilter(false), 200); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 팝업 카드 (3/4.png 스타일) */}
      {popupData && (() => {
        const activity = popupData.activity || getRandomActivity(popupData.category);
        return (
          <div
            className="absolute z-50"
            style={{
              bottom: '80px',
              left: '12px',
              right: '12px',
              background: '#FFFFFF',
              border: '1.5px solid #2C1810',
              borderRadius: '4px',
              opacity: popupVisible ? 1 : 0,
              transform: popupVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            {/* 헤더 행 */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: '1px solid #E0D8CC' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2C1810' }}>{popupData.mbti}</span>
              <span style={{ fontSize: '12px', color: '#6B5B4E' }}>|</span>
              <span style={{ fontSize: '12px', color: '#6B5B4E' }}>{popupData.placeName || '홍대점'}</span>
              <span style={{ fontSize: '11px', color: '#A89880', marginLeft: 'auto' }}>
                {popupData.createdAt ? `${Math.floor((Date.now() - popupData.createdAt) / 60000)}분전` : '방금'}
              </span>
              <button
                onClick={() => { setPopupVisible(false); setTimeout(() => setPopupData(null), 220); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', fontSize: '14px', marginLeft: '4px' }}
              >✕</button>
            </div>

            {/* 사진/동영상 2칸 */}
            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #E0D8CC', minHeight: '100px' }}>
              <div
                className="flex items-center justify-center"
                style={{ borderRight: '1px solid #E0D8CC', padding: '20px', color: '#A89880', fontSize: '13px', background: '#F5F0E8' }}
              >
                사진OR동영상
              </div>
              <div
                className="flex items-center justify-center"
                style={{ padding: '20px', color: '#A89880', fontSize: '13px', background: '#F5F0E8' }}
              >
                사진OR동영상
              </div>
            </div>

            {/* 분위기 태그 */}
            <div className="px-3 py-2.5">
              <div style={{ fontSize: '12px', color: '#2C1810', lineHeight: 1.6 }}>
                {popupData.hashtags?.slice(0, 3).map((tag, i) => (
                  <div key={i}>#{i+1}({i === 0 ? '현재 분위기' : i === 1 ? '체류감' : '주의사항'}): {tag}</div>
                )) || (
                  <>
                    <div>#1(현재 분위기): EX.)커플 비중 높음/ 작업가능</div>
                    <div>#2(체류감): EX.)회전 느림/오래 앉기가능</div>
                    <div>#3(주의사항): EX.)주차불편/웨이팅</div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 카카오맵 장소 상세정보 팝업 */}
      {selectedKakaoPlace && (
        <div
          className="absolute z-50"
          style={{
            bottom: '80px',
            left: '0',
            right: '0',
            opacity: kakaoPlaceVisible ? 1 : 0,
            transform: kakaoPlaceVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents: kakaoPlaceVisible ? 'auto' : 'none',
          }}
        >
          <div
            style={{
              margin: '0 12px',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(44,24,16,0.18)',
              overflow: 'hidden',
              border: '1px solid #E0D8CC',
            }}
          >
            {/* 헤더 */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid #F0E8DC', background: '#FDFAF6' }}
            >
              {/* 카테고리 아이콘 */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#F5F0E8',
                  border: '1.5px solid #E0D8CC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '18px',
                }}
              >
                {selectedKakaoPlace.category.includes('카페') ? '☕' :
                 selectedKakaoPlace.category.includes('편의점') ? '🏪' :
                 selectedKakaoPlace.category.includes('음식') || selectedKakaoPlace.category.includes('식당') || selectedKakaoPlace.category.includes('맛집') ? '🍽️' :
                 selectedKakaoPlace.category.includes('술') || selectedKakaoPlace.category.includes('주점') || selectedKakaoPlace.category.includes('바') ? '🍺' :
                 selectedKakaoPlace.category.includes('쇼핑') || selectedKakaoPlace.category.includes('마트') ? '🛍️' :
                 selectedKakaoPlace.category.includes('병원') || selectedKakaoPlace.category.includes('약국') ? '🏥' :
                 selectedKakaoPlace.category.includes('은행') || selectedKakaoPlace.category.includes('ATM') ? '🏦' :
                 selectedKakaoPlace.category.includes('주유') ? '⛽' :
                 selectedKakaoPlace.category.includes('주차') ? '🅿️' :
                 selectedKakaoPlace.category.includes('지하철') || selectedKakaoPlace.category.includes('버스') ? '🚇' :
                 selectedKakaoPlace.category.includes('공원') ? '🌿' :
                 selectedKakaoPlace.category.includes('학교') ? '🏫' :
                 '📍'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A0F0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedKakaoPlace.name}
                </div>
                <div style={{ fontSize: '11px', color: '#A89880', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedKakaoPlace.category.split(' > ').slice(-2).join(' · ')}
                </div>
              </div>
              {/* 닫기 버튼 */}
              <button
                onClick={() => { setKakaoPlaceVisible(false); setTimeout(() => setSelectedKakaoPlace(null), 250); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px', flexShrink: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* 주소 */}
            <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #F0E8DC' }}>
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  {selectedKakaoPlace.roadAddress && selectedKakaoPlace.roadAddress !== selectedKakaoPlace.address && (
                    <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.5 }}>{selectedKakaoPlace.roadAddress}</div>
                  )}
                  <div style={{ fontSize: '12px', color: '#8B7B6E', lineHeight: 1.5 }}>{selectedKakaoPlace.address}</div>
                </div>
              </div>
            </div>

            {/* 전화번호 */}
            {selectedKakaoPlace.phone && (
              <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #F0E8DC' }}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A89880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href={`tel:${selectedKakaoPlace.phone}`} style={{ fontSize: '13px', color: '#2C6EAF', fontWeight: 600, textDecoration: 'none' }}>
                    {selectedKakaoPlace.phone}
                  </a>
                </div>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex gap-2 px-4 py-3">
              {/* 카카오맵에서 보기 */}
              <a
                href={selectedKakaoPlace.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  background: '#FEE500',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  textDecoration: 'none',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                카카오맵에서 보기
              </a>
              {/* 길찾기 */}
              <a
                href={`kakaomap://route?ep=${selectedKakaoPlace.lat},${selectedKakaoPlace.lng}&by=FOOT`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  background: '#2C1810',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#F5F0E8',
                  textDecoration: 'none',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                길찾기
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 바 - 5개 (PNG 스타일) */}
      <div
        className="flex items-center justify-around px-2"
        style={{
          background: '#F5F0E8',
          borderTop: '1.5px solid #2C1810',
          height: '72px',
          flexShrink: 0
        }}
      >
        {/* 채팅 (오늘의 홍대) */}
        <button
          onClick={() => setShowCommunityFeed(true)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>채팅</span>
        </button>

        {/* 탐색 (필터) */}
        <button
          onClick={() => { setShowFilter(true); setTimeout(() => setFilterVisible(true), 10); }}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="6" r="2" /><circle cx="11" cy="12" r="2" /><circle cx="11" cy="18" r="2" />
            <line x1="16" y1="6" x2="22" y2="6" /><line x1="16" y1="12" x2="22" y2="12" /><line x1="16" y1="18" x2="22" y2="18" />
            <line x1="2" y1="6" x2="6" y2="6" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="2" y1="18" x2="6" y2="18" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>탐색</span>
        </button>

        {/* SPOT 등록 (중앙 강조) */}
        <button
          onClick={() => setShowSpotForm(true)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#2C1810',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-14px',
              boxShadow: '0 2px 8px rgba(44,24,16,0.3)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span style={{ fontSize: '9px', fontWeight: 600, color: '#2C1810' }}>SPOT</span>
        </button>

        {/* 검색 */}
        <button
          onClick={() => setShowSearch(prev => !prev)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: showSearch ? '#2C1810' : '#A89880', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>검색</span>
        </button>

        {/* 즐겨찾기 (지금이순간) */}
        <button
          onClick={() => setShowMomentReport(true)}
          className="flex flex-col items-center gap-1"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span style={{ fontSize: '9px', fontWeight: 600 }}>이순간</span>
        </button>
      </div>

      {/* GPS 동의 팝업 */}
      {showConsentPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(44,24,16,0.5)', opacity: consentVisible ? 1 : 0, transition: 'opacity 0.22s ease' }}
        >
          <div
            style={{
              background: '#F5F0E8',
              border: '1.5px solid #2C1810',
              borderRadius: '12px',
              padding: '24px',
              width: '300px',
              maxWidth: '90vw',
              transform: consentVisible ? 'scale(1)' : 'scale(0.92)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)'
            }}
          >
            <div className="text-center mb-4">
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#2C1810', marginBottom: '6px' }}>위치 정보 사용</div>
              <div style={{ fontSize: '12px', color: '#6B5B4E', lineHeight: 1.6 }}>내 주변 MBTI를 보려면 위치 정보가 필요해요. 정확한 위치는 공유되지 않아요.</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleConsent(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold"
                style={{ background: '#E0D8CC', border: '1px solid #C0B8AC', color: '#6B5B4E', cursor: 'pointer' }}
              >나중에</button>
              <button
                onClick={() => handleConsent(true)}
                className="flex-1 py-2.5 rounded-lg text-sm font-black"
                style={{ background: '#2C1810', border: '1.5px solid #2C1810', color: '#F5F0E8', cursor: 'pointer' }}
              >동의</button>
            </div>
          </div>
        </div>
      )}

      {/* 스팟 등록 폼 (6.png 스타일) */}
      {showSpotForm && !spotSubmitted && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(44,24,16,0.4)', opacity: spotFormVisible ? 1 : 0, transition: 'opacity 0.22s ease' }}
        >
          <div
            style={{
              background: '#F5F0E8',
              border: '1.5px solid #2C1810',
              borderRadius: '12px 12px 0 0',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '88vh',
              overflowY: 'auto',
              transform: spotFormVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)'
            }}
          >
            {/* 헤더 */}
            <div
              className="flex items-center px-4 py-3"
              style={{ borderBottom: '1px solid #E0D8CC' }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#2C1810' }}>@{spotFormData.mbti || 'Min._.jeong'}</span>
            </div>

            {/* ACTIVITY 선택 */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #E0D8CC' }}>
              <div style={{ fontSize: '12px', color: '#6B5B4E', marginBottom: '8px' }}>
                #ACTIVITY: 직접 입력이 아닌 선택하게끔(타인에게 공유X, 거시적인 정보에서만 반영)
              </div>
              <div className="flex flex-wrap gap-2">
                {ACTION_FORM_LIST.map(action => (
                  <button
                    key={action.text}
                    onClick={() => setSpotFormData(prev => ({ ...prev, activity: action.text, activityEmoji: action.emoji }))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: spotFormData.activity === action.text ? '#2C1810' : '#FFFFFF',
                      border: '1px solid #2C1810',
                      color: spotFormData.activity === action.text ? '#F5F0E8' : '#2C1810',
                      cursor: 'pointer'
                    }}
                  >
                    {action.emoji} {action.text}
                  </button>
                ))}
              </div>
            </div>

            {/* MBTI 선택 */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #E0D8CC' }}>
              <div style={{ fontSize: '12px', color: '#6B5B4E', marginBottom: '8px' }}>MBTI</div>
              <div className="flex flex-wrap gap-1.5">
                {MBTI_TYPES.map(mbti => (
                  <button
                    key={mbti}
                    onClick={() => setSpotFormData(prev => ({ ...prev, mbti }))}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: spotFormData.mbti === mbti ? '#2C1810' : '#FFFFFF',
                      border: '1px solid #2C1810',
                      color: spotFormData.mbti === mbti ? '#F5F0E8' : '#2C1810',
                      cursor: 'pointer'
                    }}
                  >
                    {mbti}
                  </button>
                ))}
              </div>
            </div>

            {/* 사진/동영상 업로드 영역 */}
            <div
              className="flex items-center justify-center px-4 py-8"
              style={{ borderBottom: '1px solid #E0D8CC', color: '#A89880', fontSize: '14px', textAlign: 'center', background: '#F5F0E8' }}
            >
              해당 위치의 사진과 동영상을 올리고<br />
              사람들과 공유해봐요.
            </div>

            {/* 게시/취소 버튼 */}
            <div className="flex items-center justify-around px-8 py-4">
              <button
                onClick={async () => {
                  if (!spotFormData.mbti) { toast.error("MBTI를 선택해주세요"); return; }
                  const loc = userLocation || HONGDAE_CENTER;
                  try {
                    await submitSpot.mutateAsync({
                      mbti: spotFormData.mbti,
                      mood: spotFormData.mood || "CHILL",
                      mode: spotFormData.mode || "산책 중",
                      sign: spotFormData.sign || "👋 말 걸어도 돼요",
                      lat: loc.lat,
                      lng: loc.lng,
                      avatar: serializeAvatar(spotFormData.avatar),
                    });
                    setSpotSubmitted(true);
                    setShowSpotForm(false);
                    toast.success("🎉 SPOT이 등록되었어요!", { duration: 3000 });
                    refetchSpots();
                  } catch (e) {
                    toast.error("등록에 실패했어요. 다시 시도해주세요.");
                  }
                }}
                disabled={submitSpot.isPending}
                style={{
                  padding: '10px 32px',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  background: '#F6E05E',
                  border: 'none',
                  color: '#2C1810',
                  cursor: 'pointer'
                }}
              >
                {submitSpot.isPending ? '게시 중...' : '게시'}
              </button>
              <button
                onClick={() => setShowSpotForm(false)}
                style={{
                  padding: '10px 32px',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  background: '#6B5B4E',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 지금 이순간 AI 리포트 (7.png) */}
      {showMomentReport && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: '#F5F0E8', height: `${screenHeight}px` }}
        >
          {/* 헤더 */}
          <div
            className="flex items-center px-4 py-3"
            style={{ borderBottom: '1.5px solid #2C1810', flexShrink: 0 }}
          >
            <button
              onClick={() => setShowMomentReport(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', marginRight: '8px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#2C1810' }}>지금 이순간의 {currentCity}는</div>
          </div>

          {/* 리포트 내용 */}
          <div className="flex-1 overflow-y-auto">
            {currentCityData ? (
              <div>
                {/* #1 현재 분위기 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #1 오늘 {currentCity}는 한 곳에 오래 머무는 분위기 보다, 팝업/편집숍을 짧게 들리고 빠르게 이동하는 흐름이 강합니다.
                  </div>
                </div>
                {/* #2 추천행동 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #2 오늘은 날씨가 좋아서 초저녁에는 팝업 1곳과 골목 산책을 묶은 2~3곳 동선으로 움직이는 편이 가장 만족스러울것 같아요
                  </div>
                </div>
                {/* #3 비추천행동 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #3 정교하게 예약 중심으로 짜는 일정이나, 한 장소에 모든 기대를 거는 계획은 비추천입니다.
                  </div>
                </div>
                {/* #4 실시간 변수 */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid #E0D8CC' }}>
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #4 메인 상권 쪽은 순간 체류가 높고, 사진 촬영/쇼핑 후 다음 장소로 넘어가는 흐름이 빠른 편입니다.
                    {currentCityData.congestLvl && (
                      <span style={{ color: '#E53E3E', fontWeight: 700 }}> 현재 혼잡도: {currentCityData.congestLvl}</span>
                    )}
                  </div>
                </div>
                {/* #5 한줄 평 */}
                <div className="px-4 py-4">
                  <div style={{ fontSize: '13px', color: '#2C1810', lineHeight: 1.7 }}>
                    #5 총정리: 오늘 {currentCity}는 '계획형 코스'보다 '짧고 선명한 즉흥 코스'가 더 잘 맞습니다.<br />
                    (추천): 마음먹고 길게 있기 보다는 3시간 이내의 체류를 추천해요!
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40" style={{ color: '#A89880', fontSize: '14px' }}>
                실시간 데이터를 불러오는 중...
              </div>
            )}
          </div>
        </div>
      )}

      {/* 오늘의 홍대 커뮤니티 피드 (9.png) */}
      {showCommunityFeed && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: '#F5F0E8', height: `${screenHeight}px` }}
        >
          {/* 헤더 */}
          <div
            className="flex items-center px-4 py-3"
            style={{ borderBottom: '1.5px solid #2C1810', flexShrink: 0 }}
          >
            <button
              onClick={() => setShowCommunityFeed(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', marginRight: '8px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#2C1810' }}>오늘의 {currentCity}</div>
          </div>

          {/* 피드 목록 */}
          <div className="flex-1 overflow-y-auto">
            {[
              { user: `@min._.jeong`, text: `${currentCity}입구역 7번 출구 산리오 팝업 스토어 이벤트로 구경만 해도 산리오 키링 주고 있습니다!!!`, isAd: false },
              { user: `(광고)@일일수작 ${currentCity}점`, text: `4월13일 오늘 단 하루만 양주 주문시 3만원 단가의 짬뽕탕+감자튀김 무료!`, isAd: true },
              { user: `@kihyun03`, text: `한신포차 앞에 경찰차 있던대 무슨일임?`, isAd: false },
              { user: `@lovely_minju`, text: `지금 ${currentCity}입구역 근처 카공 가능한 곳 추천좀`, isAd: false },
              { user: `@Auhyun._.:`, text: `외국인 웰캐 많나 진짜로;;;.`, isAd: false },
              { user: `@nayeonyiayo`, text: `실시간 ${currentCity} 카리나 등장.`, isAd: false },
              { user: `@zkdfwe`, text: `pastapia<<<여기 파스타 되게 ㄱㅊ은듯.`, isAd: false },
              { user: `(광고)@PASTA IN HD`, text: `${currentCity} 1등 파스타집 파스타 인 ${currentCity}`, isAd: true },
              { user: `@stron_minsu`, text: `메가커피 ${currentCity}점 지금 아아 1+1이래요.`, isAd: false },
              { user: `@04_02_subin`, text: `${currentCity}입구역 7번 출구에 번따남있어요조심하세요.`, isAd: false },
            ].map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-3 text-center"
                style={{
                  borderBottom: '1px solid #E0D8CC',
                  fontSize: '14px',
                  color: item.isAd ? '#6B5B4E' : '#2C1810',
                  lineHeight: 1.5
                }}
              >
                <span style={{ fontWeight: 700 }}>{item.user}</span>: {item.text}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* ===== 프로필 화면 ===== */}
      <div
        className="fixed inset-0 flex flex-col"
        style={{ height: `${screenHeight}px`, background: '#F5F0E8', display: screen === 'profile' ? 'flex' : 'none' }}
      >
        {/* 상단 헤더 */}
        <div
          className="flex items-center px-5"
          style={{ height: '56px', flexShrink: 0, borderBottom: '1px solid #E0D8CC' }}
        >
          <button
            onClick={() => setScreen('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px', padding: '4px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={{ fontSize: '17px', fontWeight: 900, color: '#2C1810' }}>프로필</span>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto">

          {/* 프로필 카드 */}
          <div
            style={{
              margin: '20px 20px 0',
              background: '#FFFFFF',
              border: '1.5px solid #E0D8CC',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            {/* 아바타 + 닉네임 */}
            <div className="flex items-center gap-4">
              {/* 아바타 원 */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#2C1810',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              {/* 닉네임 영역 */}
              <div className="flex-1">
                <div style={{ fontSize: '13px', color: '#A89880', fontWeight: 500, marginBottom: '4px' }}>로그인 해서 지도를 꾸며봐요.</div>
                {profileEditingNick ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profileNickname}
                      onChange={e => setProfileNickname(e.target.value)}
                      placeholder="닉네임 입력"
                      style={{
                        flex: 1,
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#2C1810',
                        border: 'none',
                        borderBottom: '2px solid #2C1810',
                        background: 'transparent',
                        outline: 'none',
                        padding: '2px 0',
                      }}
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') setProfileEditingNick(false); }}
                    />
                    <button
                      onClick={() => setProfileEditingNick(false)}
                      style={{ background: '#2C1810', border: 'none', borderRadius: '4px', color: '#F5F0E8', fontSize: '11px', fontWeight: 700, padding: '4px 8px', cursor: 'pointer' }}
                    >완료</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#2C1810' }}>
                      {profileNickname || '닉네임 없음'}
                    </span>
                    <button
                      onClick={() => setProfileEditingNick(true)}
                      style={{ background: 'none', border: '1px solid #C0B8AC', borderRadius: '4px', color: '#6B5B4E', fontSize: '11px', fontWeight: 600, padding: '2px 8px', cursor: 'pointer' }}
                    >닉네임 변경</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 기능 아이콘 3개 */}
          <div
            style={{
              margin: '12px 20px 0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            {/* 내 지도 */}
            <button
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E0D8CC',
                borderRadius: '10px',
                padding: '16px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
              onClick={() => { setScreen('home'); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
                <circle cx="12" cy="12" r="2" fill="#2C1810" stroke="none" />
              </svg>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2C1810' }}>내 지도</span>
            </button>

            {/* 저장한 스팟 */}
            <button
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E0D8CC',
                borderRadius: '10px',
                padding: '16px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2C1810' }}>저장 스팟</span>
            </button>

            {/* 내 사진·영상 (필름) */}
            <button
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E0D8CC',
                borderRadius: '10px',
                padding: '16px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="17" x2="22" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
              </svg>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2C1810' }}>사진·영상</span>
            </button>
          </div>

          {/* 구분선 */}
          <div style={{ margin: '20px 20px 0', borderTop: '1px solid #E0D8CC' }} />

          {/* 저장한 스팟 목록 */}
          <div style={{ margin: '16px 20px 0' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#2C1810', marginBottom: '12px' }}>저장한 스팟</div>
            {savedSpots.length === 0 ? (
              <div
                style={{
                  background: '#EDE8DF',
                  borderRadius: '10px',
                  padding: '32px 20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📍</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#2C1810', marginBottom: '4px' }}>아직 저장한 스팟이 없어요</div>
                <div style={{ fontSize: '12px', color: '#6B5B4E' }}>지도에서 마음에 드는 장소를 저장해보세요</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedSpots.map((spot, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #E0D8CC',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#2C1810' }}>{spot.name}</div>
                      <div style={{ fontSize: '11px', color: '#6B5B4E', marginTop: '2px' }}>{spot.region} · {spot.date}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#2C1810" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 내 사진·영상 섹션 */}
          <div style={{ margin: '20px 20px 0' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#2C1810', marginBottom: '12px' }}>내가 올린 사진·영상</div>
            <div
              style={{
                background: '#EDE8DF',
                borderRadius: '10px',
                padding: '32px 20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎞️</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2C1810', marginBottom: '4px' }}>아직 올린 콘텐츠가 없어요</div>
              <div style={{ fontSize: '12px', color: '#6B5B4E' }}>스팟 등록 시 사진·영상을 함께 올려보세요</div>
            </div>
          </div>

          {/* 하단 여백 */}
          <div style={{ height: '32px' }} />
        </div>

        {/* 프로필 화면 하단 탭바 - 5개 */}
        <div
          className="flex items-center justify-around px-2"
          style={{
            background: '#F5F0E8',
            borderTop: '1.5px solid #2C1810',
            height: '68px',
            flexShrink: 0,
          }}
        >
          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
            onClick={() => setScreen('home')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 500 }}>홈</span>
          </button>

          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
            onClick={() => { setSelectedCity(selectedCity || '홍대'); setScreen('map'); setMapVisible(true); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 500 }}>지도</span>
          </button>

          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
            onClick={() => { setSelectedCity(selectedCity || '홍대'); setScreen('map'); setMapVisible(true); setTimeout(() => setShowCommunityFeed(true), 100); }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#2C1810', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-12px', boxShadow: '0 2px 8px rgba(44,24,16,0.3)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 600, color: '#2C1810' }}>대화</span>
          </button>

          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89880', padding: '4px 8px' }}
            onClick={() => { setSelectedCity(selectedCity || '홍대'); setScreen('map'); setMapVisible(true); setTimeout(() => { setShowSearch(true); setTimeout(() => setSearchVisible(true), 10); }, 100); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 500 }}>검색</span>
          </button>

          <button
            className="flex flex-col items-center gap-1"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2C1810', padding: '4px 8px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 700 }}>프로필</span>
          </button>
        </div>
      </div>

    </div>
  );
}
