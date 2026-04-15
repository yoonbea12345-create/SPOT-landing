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
const CITIES = [
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

  // 카카오맵 refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const realSpotMarkersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const cityLabelsRef = useRef<any[]>([]);
  const watchIdRef = useRef<number | null>(null);

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

  // 서울시 실시간 데이터 상태
  const [seoulCityData, setSeoulCityData] = useState<Record<string, any>>({});
  const [seoulBanner, setSeoulBanner] = useState<{ text: string; color: string; icon: string } | null>(null);

  // 서울시 실시간 데이터 조회 (홍대 관광특구, 연남동, 성수카페거리)
  const { data: hongdaeData } = trpc.citydata.getDistrict.useQuery({ area: "홍대 관광특구" }, { refetchInterval: 300000 });
  const { data: yeonnamData } = trpc.citydata.getDistrict.useQuery({ area: "연남동" }, { refetchInterval: 300000 });
  const { data: seongsuData } = trpc.citydata.getDistrict.useQuery({ area: "성수카페거리" }, { refetchInterval: 300000 });

  const HONGDAE_CENTER = { lat: 37.5400, lng: 126.9700 };
  const [screenHeight, setScreenHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 800);

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
    const fadeTimer = setTimeout(() => setSplashFading(true), 1700);
    const timer = setTimeout(() => { setScreen("map"); requestAnimationFrame(() => setMapVisible(true)); }, 2000);
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

  // 카카오맵 초기화
  useEffect(() => {
    if (screen !== "map" || !mapContainerRef.current) return;

    const container = mapContainerRef.current;
    const center = userLocation || HONGDAE_CENTER;

    const initMap = () => {
      if (!container || !window.kakao) return;
      const kakao = window.kakao;

      // 지도 생성
      const mapOptions = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 4,
      };
      const map = new kakao.maps.Map(container, mapOptions);
      mapRef.current = map;

      // 컨테이너 크기 재계산 (opacity 전환 후 크기가 0으로 인식될 수 있음)
      setTimeout(() => {
        map.relayout();
        map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
      }, 150);

    // 줌 이벤트
    kakao.maps.event.addListener(map, 'zoom_changed', () => {
      const level = map.getLevel();
      setCurrentZoom(level);
    });

    // 더미 데이터 생성 및 마커 추가
    const dummyData = generateDummyData();
    dummyDataRef.current = dummyData;

    // CSS 주입
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

    // 더미 마커 생성 (단순 점 스타일)
    dummyData.forEach(item => {
      const mbtiColor = MBTI_COLORS[item.mbti] || "#00f0ff";
      const el = document.createElement('div');
      el.className = 'spot-dot-marker';
      el.dataset.mbti = item.mbti;
      el.dataset.category = item.category || '';
      el.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${mbtiColor};
        box-shadow: 0 0 6px ${mbtiColor}99;
        cursor: pointer;
        position: relative;
      `;

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
        setPopupData({
          ...item,
          distance: dist,
        });
        setPopupAddress(null);
        setPopupExpanded(false);
        setPopupTagVotes({});
        // 역지오코딩
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(item.lng, item.lat, (result: any[], status: string) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const addr = result[0].road_address?.address_name || result[0].address?.address_name || null;
            setPopupAddress(addr);
          }
        });
      });

      markersRef.current.push(overlay);
    });

    // 사용자 위치 마커
    const userEl = document.createElement('div');
    userEl.style.cssText = `
      width: 16px;
      height: 16px;
      background: white;
      border: 3px solid rgba(255,255,255,0.9);
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(255,255,255,0.6);
    `;
    const userOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(center.lat, center.lng),
      content: userEl,
      zIndex: 100,
    });
    userOverlay.setMap(map);
    userMarkerRef.current = userOverlay;

    // 도시 레이블 생성
    const { cities, cityStats } = aggregateCityData();
    const hotspots = getHotspotCities(cities.map(c => c.name));
    setHotspotCityNames(hotspots);

    cities.forEach(city => {
      const stats = cityStats[city.name];
      if (!stats || Object.keys(stats).length === 0) return;
      const isHotspot = hotspots.includes(city.name);
      const cityRadius = 0.25;
      const actualCount = dummyData.filter(m =>
        Math.abs(m.lat - city.lat) < cityRadius && Math.abs(m.lng - city.lng) < cityRadius
      ).length;
      const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 3);

      const labelEl = document.createElement('div');
      if (isHotspot) {
        labelEl.style.cssText = `background:rgba(0,0,0,0.97);border:2px solid #ff4500;border-radius:8px;padding:6px 10px;white-space:nowrap;pointer-events:auto;cursor:pointer;opacity:0;transition:opacity 0.3s,transform 0.15s;`;
        labelEl.innerHTML = `
          <div style="display:flex;align-items:center;gap:3px;margin-bottom:3px;">
            <span style="font-size:11px;">🔥</span>
            <span style="font-size:11px;font-weight:900;color:#ff6a00;">핫플</span>
            <span style="font-size:10px;color:rgba(255,180,100,0.9);font-weight:700;"> ${actualCount}명</span>
          </div>
          <div style="font-size:11px;color:#ffcc66;font-weight:900;margin-bottom:2px;letter-spacing:0.5px;">${city.name}</div>
          ${sortedStats.map(([mbti, count]) => `<div style="font-size:10px;color:${MBTI_COLORS[mbti]};line-height:1.5;font-weight:700;">${mbti} <span style="opacity:0.85;font-weight:500;">(${count})</span></div>`).join('')}
        `;
      } else {
        labelEl.style.cssText = `background:rgba(0,0,0,0.95);border:1.5px solid rgba(0,240,255,0.6);border-radius:6px;padding:5px 8px;white-space:nowrap;pointer-events:auto;cursor:pointer;opacity:0;transition:opacity 0.3s,transform 0.15s;box-shadow:0 2px 8px rgba(0,0,0,0.4);`;
        labelEl.innerHTML = `
          <div style="font-size:11px;font-weight:900;color:#00f0ff;margin-bottom:3px;letter-spacing:0.5px;">${city.name} <span style="color:rgba(0,240,255,0.7);font-weight:600;font-size:10px;">(${actualCount})</span></div>
          ${sortedStats.map(([mbti, count]) => `<div style="font-size:10px;color:${MBTI_COLORS[mbti]};line-height:1.6;font-weight:700;">${mbti} <span style="opacity:0.85;font-weight:500;">(${count})</span></div>`).join('')}
        `;
      }

      labelEl.addEventListener('click', () => {
        map.setCenter(new kakao.maps.LatLng(city.lat, city.lng));
        map.setLevel(4);
        setHotspotCityNames(prev => prev);
        setShowHotplacePopup(false);
      });

      const cityLabel = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(city.lat, city.lng),
        content: labelEl,
        zIndex: 5,
      });
      cityLabel.setMap(map);
      cityLabelsRef.current.push(cityLabel);
    });

    // 지도 클릭 시 팝업 닫기
    kakao.maps.event.addListener(map, 'click', () => {
      if (popupData) {
        setPopupVisible(false);
        setTimeout(() => setPopupData(null), 220);
      }
    });

    }; // end initMap

    // 스팟 등록 폼 타이머 (11초 후)
    const spotFormTimer = setTimeout(() => {
      if (!spotSubmitted) setShowSpotForm(true);
    }, 11000);

    // kakao.maps.load()로 SDK 로드 완료 후 초기화
    if (window.kakao && window.kakao.maps) {
      // 이미 로드됨
      initMap();
    } else if (window.kakao) {
      // kakao 객체는 있지만 maps가 아직 로드 안됨
      window.kakao.maps.load(initMap);
    } else {
      // kakao SDK 자체가 없음 - 폴링으로 대기
      let retryCount = 0;
      const retryTimer = setInterval(() => {
        retryCount++;
        if (window.kakao && window.kakao.maps) {
          clearInterval(retryTimer);
          initMap();
        } else if (retryCount > 20) {
          clearInterval(retryTimer);
          console.warn('[SPOT] Kakao Maps SDK failed to load');
        }
      }, 200);
    }

    return () => {
      clearTimeout(spotFormTimer);
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      realSpotMarkersRef.current.forEach(m => m.setMap(null));
      realSpotMarkersRef.current = [];
      cityLabelsRef.current.forEach(m => m.setMap(null));
      cityLabelsRef.current = [];
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

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

  // 스플래시 화면
  if (screen === "splash") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center" style={{ height: `${screenHeight}px`, opacity: splashFading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        <h1 className="text-6xl font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: "#ffffff" }}>SPOT</h1>
      </div>
    );
  }

  // 지도 화면
  return (
    <div className="fixed inset-0 bg-black flex flex-col" style={{ height: `${screenHeight}px`, opacity: mapVisible ? 1 : 0, transition: 'opacity 0.35s ease' }}>
      <Toaster position="top-right" />

      {/* 서울시 실시간 데이터 배너 */}
      {seoulBanner && (
        <div
          className="absolute top-0 left-0 right-0 z-40 flex items-center justify-center gap-2 px-4 py-1.5"
          style={{ background: 'rgba(0,0,0,0.85)', borderBottom: `1px solid ${seoulBanner.color}44`, pointerEvents: 'none' }}
        >
          <span style={{ fontSize: '11px' }}>{seoulBanner.icon}</span>
          <span style={{ fontSize: '11px', color: seoulBanner.color, fontWeight: 700 }}>{seoulBanner.text}</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>실시간</span>
        </div>
      )}

      {/* 핫플레이스 바텀시트 */}
      {showHotplacePopup && hotspotCityNames.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          style={{ pointerEvents: 'none', opacity: hotplaceVisible ? 1 : 0, transform: hotplaceVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.22s ease, transform 0.22s ease' }}
        >
          <div ref={sheetRef} className="hotspot-banner w-full max-w-md rounded-t-2xl overflow-hidden" style={{ background: 'rgba(4,4,18,0.96)', border: '2px solid rgba(255,69,0,0.4)', borderBottom: 'none', pointerEvents: 'auto', maxHeight: '60vh', overflowY: 'auto' }}>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '16px' }}>🔥</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#ff6a00' }}>지금 핫한 곳</span>
              </div>
              <button onClick={() => setShowHotplacePopup(false)} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            {/* 탭 */}
            <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {hotspotCityNames.map((city, idx) => (
                <button key={city} onClick={() => setSelectedHotplaceTab(idx)} className="flex-1 py-2.5 text-xs font-bold transition-colors" style={{ color: selectedHotplaceTab === idx ? '#ff6a00' : 'rgba(255,255,255,0.4)', borderBottom: selectedHotplaceTab === idx ? '2px solid #ff6a00' : '2px solid transparent', background: 'none', cursor: 'pointer' }}>
                  {city}
                </button>
              ))}
            </div>
            {/* 탭 콘텐츠 */}
            {hotspotCityNames[selectedHotplaceTab] && (() => {
              const cityName = hotspotCityNames[selectedHotplaceTab];
              const city = CITIES.find(c => c.name === cityName);
              if (!city) return null;
              const cityRadius = 0.25;
              const citySpots = dummyDataRef.current.filter(m =>
                Math.abs(m.lat - city.lat) < cityRadius && Math.abs(m.lng - city.lng) < cityRadius
              );
              const mbtiCounts: Record<string, number> = {};
              citySpots.forEach(s => { mbtiCounts[s.mbti] = (mbtiCounts[s.mbti] || 0) + 1; });
              const topMBTI = Object.entries(mbtiCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
              // 서울시 실시간 데이터 (홍대/성수)
              const apiPlaces = SEOUL_CITY_API_PLACES[cityName] || [];
              const apiDataList = apiPlaces.map(p => seoulCityData[p]).filter(Boolean);
              return (
                <div className="px-4 py-4">
                  {/* 서울시 실시간 데이터 */}
                  {apiDataList.length > 0 && apiDataList.map((data, i) => {
                    const congestion = data.AREA_CONGEST_LVL || "";
                    const weather = data.WEATHER_TIME ? `${data.TEMP}°C · ${data.WEATHER_TIME}` : null;
                    const congColor = congestion.includes("붐빔") ? "#ff4500" : congestion.includes("약간") ? "#ff9f43" : congestion.includes("보통") ? "#ffd700" : "#00c896";
                    return (
                      <div key={i} className="mb-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{apiPlaces[i]}</span>
                          <span style={{ fontSize: '11px', color: congColor, fontWeight: 900 }}>{congestion || "데이터 없음"}</span>
                        </div>
                        {weather && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{weather}</div>}
                        {data.AREA_CONGEST_MSG && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', lineHeight: 1.4 }}>{data.AREA_CONGEST_MSG.slice(0, 60)}...</div>}
                      </div>
                    );
                  })}
                  {/* MBTI 분포 */}
                  <div className="mb-3">
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>지금 이 곳의 MBTI 분포</div>
                    {topMBTI.map(([mbti, count]) => (
                      <div key={mbti} className="flex items-center gap-2 mb-1.5">
                        <span style={{ fontSize: '11px', fontWeight: 900, color: MBTI_COLORS[mbti], width: '40px' }}>{mbti}</span>
                        <div className="flex-1 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
                          <div style={{ height: '100%', width: `${(count / citySpots.length) * 100}%`, background: MBTI_COLORS[mbti], borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', width: '24px', textAlign: 'right' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if (mapRef.current) {
                        mapRef.current.setCenter(new window.kakao.maps.LatLng(city.lat, city.lng));
                        mapRef.current.setLevel(4);
                      }
                      setShowHotplacePopup(false);
                    }}
                    className="w-full py-2.5 rounded-xl text-sm font-black transition-all"
                    style={{ background: 'rgba(255,106,0,0.15)', border: '1.5px solid rgba(255,106,0,0.4)', color: '#ff6a00' }}
                  >
                    {cityName} 지도로 보기 →
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 카카오맵 컨테이너 */}
      <div className="relative flex-1 overflow-hidden" style={{ marginTop: seoulBanner ? '28px' : '0' }}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* 검색 패널 */}
        {showSearch && (
          <div
            ref={searchPanelRef}
            className="absolute top-2 left-2 right-2 z-30 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(4,4,14,0.97)', border: '1.5px solid rgba(0,240,255,0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)', opacity: searchVisible ? 1 : 0, transform: searchVisible ? 'translateY(0)' : 'translateY(-8px)', transition: 'opacity 0.18s ease, transform 0.18s ease' }}
          >
            {/* 검색 입력 */}
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(0,240,255,0.1)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,240,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="장소·지역 검색 (예: 홍대 카페)"
                className="flex-1 outline-none text-xs bg-transparent"
                style={{ color: '#00f0ff' }}
              />
              {searchQuery ? (
                <button onClick={() => { setSearchQuery(''); setSearchResults([]); searchInputRef.current?.focus(); }} className="hover:text-white transition-colors text-xs leading-none flex-shrink-0" style={{ color: 'rgba(0,240,255,0.5)', padding: '2px' }}>✕</button>
              ) : (
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }} className="hover:text-white transition-colors leading-none flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)', padding: '2px', fontSize: '13px' }}>✕</button>
              )}
            </div>
            {/* 카테고리 칩 */}
            <div className="px-2.5 py-2" style={{ borderBottom: '1px solid rgba(0,240,255,0.1)' }}>
              <div className="flex flex-wrap gap-1">
                {([
                  { key: 'cafe', label: '☕ 카페', color: '#c77dff' },
                  { key: 'restaurant', label: '🍜 맛집', color: '#ff9f43' },
                  { key: 'bar', label: '🍺 술집', color: '#ff6b6b' },
                  { key: 'park', label: '🌿 공원', color: '#00f0b4' },
                  { key: 'nature', label: '🏔 자연', color: '#74b9ff' },
                  { key: 'landmark', label: '📍 명소', color: '#00f0ff' },
                  { key: 'shopping', label: '🛍 쇼핑', color: '#fd79a8' },
                ] as const).map(({ key, label, color }) => {
                  const isActive = selectedCategory === key;
                  return (
                    <button
                      key={key}
                      onClick={() => filterByCategory(key)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold transition-all"
                      style={{ background: isActive ? `${color}22` : 'rgba(255,255,255,0.05)', border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`, color: isActive ? color : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* 검색 결과 */}
            {searchLoading && <div className="px-3 py-3 text-center text-[11px]" style={{ color: 'rgba(0,240,255,0.5)' }}>검색 중...</div>}
            {!searchLoading && searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2.5 text-xs transition-all"
                    style={{ color: 'rgba(255,255,255,0.8)', borderBottom: idx < searchResults.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,240,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,240,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="truncate">{result.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="px-3 py-3 text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>검색 결과가 없습니다</div>
            )}
          </div>
        )}

        {/* 하단 정보 안내 텍스트 */}
        {!selectedMarker && !showSearch && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-500/20 rounded-xl px-4 py-2 shadow-lg" style={{ pointerEvents: 'none' }}>
            <div className="text-xs text-gray-400 whitespace-nowrap">마커를 클릭하여 MBTI 정보를 확인하세요</div>
          </div>
        )}
      </div>

      {/* 팝업 */}
      {popupData && (() => {
        const mbtiColor = MBTI_COLORS[popupData.mbti] || "#00f0ff";
        const hashtags = popupData.hashtags || getPlaceHashtags(popupData.category, popupData.id);
        const activity = popupData.activity || getRandomActivity(popupData.category);
        return (
          <div
            className="fixed bottom-20 left-2 right-2 z-50 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(8,8,16,0.97)', border: `1.5px solid ${mbtiColor}66`, boxShadow: `0 8px 32px rgba(0,0,0,0.8)`, opacity: popupVisible ? 1 : 0, transform: popupVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.22s ease, transform 0.22s ease', maxWidth: '400px', margin: '0 auto' }}
          >
            {/* 헤더 */}
            <div className="flex items-start gap-2.5 px-3 pt-2.5 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {/* 아바타 */}
              <div style={{ borderRadius: '50%', border: `2px solid ${mbtiColor}`, overflow: 'hidden', width: '40px', height: '40px', flexShrink: 0, background: `${mbtiColor}22` }}>
                {popupData.avatar ? (
                  <AvatarSVG config={popupData.avatar} size={40} />
                ) : (
                  <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                )}
              </div>
              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span style={{ fontSize: '13px', fontWeight: 900, color: mbtiColor }}>{popupData.mbti}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>·</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{popupData.mood}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>
                  {activity.emoji} {activity.text}
                </div>
                {(popupData.placeName || popupAddress) && (
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    📍 {popupData.placeName || popupAddress}
                  </div>
                )}
              </div>
              {/* 닫기 + 거리 */}
              <div className="flex flex-col items-end gap-1" style={{ flexShrink: 0 }}>
                <button onClick={() => { setPopupVisible(false); setTimeout(() => setPopupData(null), 220); }} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{popupData.distance < 1000 ? `${popupData.distance}m` : `${(popupData.distance / 1000).toFixed(1)}km`}</span>
              </div>
            </div>

            {/* 사인 */}
            <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"{popupData.sign}"</div>
            </div>

            {/* 해시태그 */}
            <div className="px-3 py-2.5">
              <div className="flex flex-wrap gap-1.5">
                {hashtags.slice(0, 5).map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setPopupTagVotes(prev => ({ ...prev, [tag]: (prev[tag] || 0) + 1 }))}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-all"
                    style={{ background: (popupTagVotes[tag] || 0) > 0 ? `${mbtiColor}22` : 'rgba(255,255,255,0.06)', border: `1px solid ${(popupTagVotes[tag] || 0) > 0 ? mbtiColor + '66' : 'rgba(255,255,255,0.1)'}`, color: (popupTagVotes[tag] || 0) > 0 ? mbtiColor : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                  >
                    #{tag} {(popupTagVotes[tag] || 0) > 0 ? `+${popupTagVotes[tag]}` : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* 경과 시간 */}
            {popupData.createdAt && (
              <div className="px-3 pb-2.5">
                <ElapsedTimer createdAt={popupData.createdAt} mbtiColor={mbtiColor} />
              </div>
            )}
          </div>
        );
      })()}

      {/* 하단 네비게이션 바 */}
      <div className="flex items-center justify-around px-2 py-3" style={{ background: 'rgba(4,4,14,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', height: '64px', flexShrink: 0 }}>
        {/* 검색 버튼 */}
        <button
          onClick={() => setShowSearch(prev => !prev)}
          className="flex flex-col items-center gap-0.5 transition-all"
          style={{ color: showSearch ? '#00f0ff' : 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: '9px' }}>검색</span>
        </button>

        {/* 핫플 버튼 */}
        <button
          onClick={() => setShowHotplacePopup(prev => !prev)}
          className="flex flex-col items-center gap-0.5 transition-all"
          style={{ color: showHotplacePopup ? '#ff6a00' : 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          <span style={{ fontSize: '20px', lineHeight: 1 }}>🔥</span>
          <span style={{ fontSize: '9px' }}>핫플</span>
        </button>

        {/* SPOT 등록 버튼 (중앙 강조) */}
        <button
          onClick={() => setShowSpotForm(true)}
          className="flex flex-col items-center gap-0.5 transition-all"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f0ff, #c77dff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,240,255,0.4)', marginTop: '-12px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>SPOT</span>
        </button>

        {/* 피드 버튼 */}
        <button
          onClick={() => setShowSpotFeed(true)}
          className="flex flex-col items-center gap-0.5 transition-all"
          style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span style={{ fontSize: '9px' }}>피드</span>
        </button>

        {/* 내 위치 버튼 */}
        <button
          onClick={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.setCenter(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng));
              mapRef.current.setLevel(4);
            } else {
              toast.info("위치 정보를 가져오는 중입니다...", { duration: 2000 });
            }
          }}
          className="flex flex-col items-center gap-0.5 transition-all"
          style={{ color: userLocation ? '#00f0ff' : 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
          </svg>
          <span style={{ fontSize: '9px' }}>내 위치</span>
        </button>
      </div>

      {/* GPS 동의 팝업 */}
      {showConsentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', opacity: consentVisible ? 1 : 0, transition: 'opacity 0.22s ease' }}>
          <div style={{ background: 'rgba(4,4,14,0.98)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '20px', padding: '24px', width: '300px', maxWidth: '90vw', boxShadow: '0 4px 20px rgba(0,0,0,0.8)', transform: consentVisible ? 'scale(1)' : 'scale(0.92)', transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div className="text-center mb-4">
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#00f0ff', marginBottom: '6px' }}>위치 정보 사용</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>내 주변 MBTI를 보려면 위치 정보가 필요해요. 정확한 위치는 공유되지 않아요.</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleConsent(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>나중에</button>
              <button onClick={() => handleConsent(true)} className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all" style={{ background: 'rgba(0,240,255,0.15)', border: '1.5px solid rgba(0,240,255,0.4)', color: '#00f0ff', cursor: 'pointer' }}>동의</button>
            </div>
          </div>
        </div>
      )}

      {/* 스팟 등록 폼 */}
      {showSpotForm && !spotSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', opacity: spotFormVisible ? 1 : 0, transition: 'opacity 0.22s ease' }}>
          <div style={{ background: 'rgba(4,4,14,0.98)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '20px', width: '320px', maxWidth: '90vw', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.8)', transform: spotFormVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(16px)', transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative' }}>
            {/* 닫기 버튼 */}
            <button onClick={() => setShowSpotForm(false)} style={{ position: 'absolute', top: '14px', right: '14px', color: 'rgba(255,255,255,0.3)', fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>

            <div style={{ fontSize: '18px', fontWeight: 900, color: '#00f0ff', marginBottom: '4px' }}>지금 여기 있어요</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>내 MBTI를 지도에 남겨보세요</div>

            {/* 아바타 선택 */}
            <div className="mb-4">
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>아바타</div>
              <div className="flex justify-center mb-3">
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${spotFormData.mbti ? MBTI_COLORS[spotFormData.mbti] : 'rgba(0,240,255,0.4)'}`, overflow: 'hidden', background: 'rgba(0,240,255,0.05)' }}>
                  <AvatarSVG config={spotFormData.avatar} size={64} />
                </div>
              </div>
              {/* 아바타 탭 */}
              <div className="flex mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {(['animal', 'accessory', 'expression', 'emoji'] as const).map(tab => (
                  <button key={tab} onClick={() => setAvatarTab(tab)} className="flex-1 py-1.5 text-[10px] font-bold transition-colors" style={{ color: avatarTab === tab ? '#00f0ff' : 'rgba(255,255,255,0.3)', borderBottom: avatarTab === tab ? '2px solid #00f0ff' : '2px solid transparent', background: 'none', cursor: 'pointer' }}>
                    {tab === 'animal' ? '동물' : tab === 'accessory' ? '악세서리' : tab === 'expression' ? '표정' : '이모지'}
                  </button>
                ))}
              </div>
              {/* 아바타 옵션 */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                {avatarTab === 'animal' && (showAllAnimals ? ANIMALS : ANIMALS.slice(0, 12)).map(animal => (
                  <button key={animal.type} onClick={() => setSpotFormData(prev => ({ ...prev, avatar: { ...prev.avatar, animal: animal.type } }))} className="px-2 py-1 rounded-lg text-[10px] transition-all" style={{ background: spotFormData.avatar.animal === animal.type ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.avatar.animal === animal.type ? 'rgba(0,240,255,0.5)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.avatar.animal === animal.type ? '#00f0ff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>{animal.emoji} {animal.label}</button>
                ))}
                {avatarTab === 'animal' && ANIMALS.length > 12 && (
                  <button onClick={() => setShowAllAnimals(p => !p)} className="px-2 py-1 rounded-lg text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{showAllAnimals ? '접기' : `+${ANIMALS.length - 12}`}</button>
                )}
                {avatarTab === 'accessory' && ACCESSORIES.map(acc => (
                  <button key={acc.type} onClick={() => setSpotFormData(prev => ({ ...prev, avatar: { ...prev.avatar, accessory: acc.type } }))} className="px-2 py-1 rounded-lg text-[10px] transition-all" style={{ background: spotFormData.avatar.accessory === acc.type ? 'rgba(199,125,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.avatar.accessory === acc.type ? 'rgba(199,125,255,0.5)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.avatar.accessory === acc.type ? '#c77dff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>{acc.emoji} {acc.label}</button>
                ))}
                {avatarTab === 'expression' && EXPRESSIONS.map(exp => (
                  <button key={exp.type} onClick={() => setSpotFormData(prev => ({ ...prev, avatar: { ...prev.avatar, expression: exp.type } }))} className="px-2 py-1 rounded-lg text-[10px] transition-all" style={{ background: spotFormData.avatar.expression === exp.type ? 'rgba(255,159,67,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.avatar.expression === exp.type ? 'rgba(255,159,67,0.5)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.avatar.expression === exp.type ? '#ff9f43' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>{exp.emoji} {exp.label}</button>
                ))}
                {avatarTab === 'emoji' && EMOJIS.map(emoji => (
                  <button key={emoji.type} onClick={() => setSpotFormData(prev => ({ ...prev, avatar: { ...prev.avatar, emoji: emoji.type } }))} className="px-2 py-1 rounded-lg text-[10px] transition-all" style={{ background: spotFormData.avatar.emoji === emoji.type ? 'rgba(253,121,168,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.avatar.emoji === emoji.type ? 'rgba(253,121,168,0.5)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.avatar.emoji === emoji.type ? '#fd79a8' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>{emoji.label}</button>
                ))}
              </div>
            </div>

            {/* MBTI 선택 */}
            <div className="mb-4">
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>MBTI <span style={{ color: '#ff4500' }}>*</span></div>
              <div className="flex flex-wrap gap-1.5">
                {MBTI_TYPES.map(mbti => (
                  <button key={mbti} onClick={() => setSpotFormData(prev => ({ ...prev, mbti }))} className="px-2 py-1 rounded-lg text-[11px] font-bold transition-all" style={{ background: spotFormData.mbti === mbti ? `${MBTI_COLORS[mbti]}22` : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.mbti === mbti ? MBTI_COLORS[mbti] : 'rgba(255,255,255,0.1)'}`, color: spotFormData.mbti === mbti ? MBTI_COLORS[mbti] : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{mbti}</button>
                ))}
              </div>
            </div>

            {/* MOOD 선택 */}
            <div className="mb-4">
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>지금 기분</div>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_LIST.slice(0, 8).map(mood => (
                  <button key={mood} onClick={() => setSpotFormData(prev => ({ ...prev, mood }))} className="px-2 py-1 rounded-lg text-[10px] transition-all" style={{ background: spotFormData.mood === mood ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.mood === mood ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.mood === mood ? '#00f0ff' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{mood}</button>
                ))}
              </div>
            </div>

            {/* 행동 선택 */}
            <div className="mb-4">
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>지금 뭐 해요?</div>
              <div className="flex flex-wrap gap-1.5">
                {ACTION_FORM_LIST.map(action => (
                  <button key={action.text} onClick={() => {
                    if (action.text === "직접 입력") return;
                    setSpotFormData(prev => ({ ...prev, activity: action.text, activityEmoji: action.emoji }));
                  }} className="px-2 py-1 rounded-lg text-[10px] transition-all" style={{ background: spotFormData.activity === action.text ? 'rgba(199,125,255,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.activity === action.text ? 'rgba(199,125,255,0.4)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.activity === action.text ? '#c77dff' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    {action.emoji} {action.text}
                  </button>
                ))}
              </div>
            </div>

            {/* 사인 선택 */}
            <div className="mb-6">
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>시그널</div>
              <div className="flex flex-wrap gap-1.5">
                {SIGN_SIGNALS.slice(1, 8).map(signal => (
                  <button key={signal.text} onClick={() => setSpotFormData(prev => ({ ...prev, sign: `${signal.emoji} ${signal.text}` }))} className="px-2 py-1 rounded-lg text-[10px] transition-all" style={{ background: spotFormData.sign === `${signal.emoji} ${signal.text}` ? 'rgba(255,159,67,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${spotFormData.sign === `${signal.emoji} ${signal.text}` ? 'rgba(255,159,67,0.4)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.sign === `${signal.emoji} ${signal.text}` ? '#ff9f43' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    {signal.emoji} {signal.text}
                  </button>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
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
              className="w-full py-3 rounded-xl text-sm font-black transition-all"
              style={{ background: spotFormData.mbti ? 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(199,125,255,0.2))' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${spotFormData.mbti ? 'rgba(0,240,255,0.5)' : 'rgba(255,255,255,0.1)'}`, color: spotFormData.mbti ? '#00f0ff' : 'rgba(255,255,255,0.2)', cursor: spotFormData.mbti ? 'pointer' : 'not-allowed', opacity: submitSpot.isPending ? 0.6 : 1 }}
            >
              {submitSpot.isPending ? "등록 중..." : "지금 여기 있어요 ✓"}
            </button>
          </div>
        </div>
      )}

      {/* 숏폼 피드 */}
      {showSpotFeed && (
        <SpotFeed
          onClose={() => setShowSpotFeed(false)}
          mapService={null}
          userSpots={spotsData?.spots}
          onGoToPlace={(lat, lng, placeName) => {
            if (mapRef.current) {
              mapRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
              mapRef.current.setLevel(4);
            }
          }}
        />
      )}
    </div>
  );
}
