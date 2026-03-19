/**
 * SpotFeed - SPOT 서비스의 숏폼 컨텐츠 뷰어
 * 장소 사진 + 해시태그 + MBTI/SIGN을 세로형 스와이프 뷰어로 표시
 * 인스타 릴스와 차별화: 다크 네온 테마, SPOT 고유 정보 레이어
 *
 * v2: 검정 피드 완전 제거 - 사진 확인된 카드만 표시
 *     지도 연동 + 사용자 스팟 연동
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { FIXED_PLACES, type FixedPlace } from "@/data/fixedPlaces";

// ─── 타입 ────────────────────────────────────────────────────────
type PlaceTagType =
  | 'cafe' | 'bar_club' | 'restaurant' | 'park_picnic'
  | 'river_beach' | 'accommodation' | 'market' | 'culture_museum'
  | 'sports_fitness' | 'shopping' | 'landmark' | 'nature';

type FeedCard = {
  id: string;
  place: FixedPlace;
  mbti: string;
  sign: string;
  mood: string;
  hashtags: string[];
  photoUrl: string;        // 사진 확인된 것만 cards에 추가하므로 항상 존재
  postedAt: number;        // 게시 시각 (ms timestamp)
  isUserSpot?: boolean;    // 실제 사용자 스팟 여부
  userSpotInfo?: {
    mbti: string;
    sign: string;
    mood: string;
  };
};

type UserSpot = {
  id: number;
  mbti: string;
  mood: string;
  mode: string;
  sign: string;
  lat: number;
  lng: number;
  avatar?: string | null;
  createdAt: Date;
};

// ─── 상수 ────────────────────────────────────────────────────────
const MBTI_TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP"
];

const MBTI_COLORS: Record<string, string> = {
  INTJ: "#00f5ff", INTP: "#00d4ff", ENTJ: "#00b8ff", ENTP: "#009cff",
  INFJ: "#bf00ff", INFP: "#d400ff", ENFJ: "#e900ff", ENFP: "#ff00e5",
  ISTJ: "#ff9500", ISFJ: "#ffb800", ESTJ: "#ffd700", ESFJ: "#ffaa00",
  ISTP: "#ff0080", ISFP: "#ff0099", ESTP: "#ff00b3", ESFP: "#ff00cc"
};

const SIGN_LIST = [
  "👋 말 걸어도 돼요", "🎧 혼자 있고 싶어요", "☕ 같이 앉아도 돼요",
  "👀 구경 중이에요", "📸 사진 찍는 중이에요", "🌙 야경 보러 왔어요",
  "🐾 산책 중이에요", "💬 대화 상대 찾아요", "🍽️ 맛집 찾는 중이에요",
  "🛍️ 쇼핑 중이에요", "💻 작업 중이에요", "🍺 한잔하러 왔어요",
];

const MOOD_LIST = [
  "HAPPY", "CHILL", "EXCITED", "PEACEFUL", "CURIOUS",
  "DREAMY", "CONTENT", "HYPED", "ENERGETIC", "NOSTALGIC"
];

// ─── 해시태그 풀 (지금성 - 현장에 있는 사람만 알 수 있는 실시간 정보) ─────
// 핵심 철학: 단순 장소 정보가 아닌, 지금 이 순간 현장 분위기를 전달
const PLACE_HASHTAG_POOL: Record<PlaceTagType, string[]> = {
  cafe: [
    '줄 없음','자리 있음','조용함','사람 많음',
    '콘센트 자리 있음','음악 좋음','뷰 딩 좋음',
    '웨이팅 없음','혼자 온 사람 많음','작업하기 좋음',
    '커플 많음','분위기 업됨','와이파이 빠름',
  ],
  bar_club: [
    '자리 있음','분위기 미침','웨이팅 없음',
    '음악 딩 좋음','혼술하기 좋음','사람 적당함',
    '야외석 비어있음','분위기 업됨','혼자 온 사람 많음',
    '시끄러움','조용한 편','20대 많음',
  ],
  restaurant: [
    '웨이팅 없음','자리 있음','혼밥하기 좋음',
    '사람 많음','회전율 빠름','포장 가능',
    '조용함','시끄러움','직원 친절',
    '재료 신선','양 많음','가성비 실화',
  ],
  park_picnic: [
    '사람 없음','자리 있음','날씨 딩 좋음',
    '그늘 있음','조용함','강아지 많음',
    '돌자리 많음','야경 좋음','바람 시원',
    '커플 많음','가족 많음','사진 잘 나옴',
  ],
  river_beach: [
    '노을 딩 좋음','바람 시원','사람 없음',
    '사진 잘 나옴','야경 미침','자리 있음',
    '자전거 많음','혼자 와도 좋음','뷰 실화',
    '물 맑음','파도 잌잌','분위기 좋음',
  ],
  accommodation: [
    '체크인 빠름','직원 친절','방음 잘 됨',
    '청결 합격','뷰 좋음','와이파이 빠름',
    '조용함','시설 깨끗','조식 맛있음',
    '주차 가능','가성비 좋음','빈 방 있음',
  ],
  market: [
    '사람 많음','먹거리 많음','구경 재및음',
    '로컈 느낌','흥정 가능','신선도 좋음',
    '외국인 많음','야시장 분위기','카드 됨',
    '줄 없음','가격 착함','포장 가능',
  ],
  culture_museum: [
    '줄 없음','조용함','에어콘 빡빡',
    '혼자 와도 좋음','사진 찍기 좋음','전시 좋음',
    '설명 잘 돼 있음','카페 있음','기념품샵 있음',
    '입장 가능','관람객 적음','분위기 좋음',
  ],
  sports_fitness: [
    '기구 비어있음','사람 없음','에어콘 빡빡',
    '운동 분위기 좋음','샤워실 깨끗','락커 있음',
    '초보자 환영','가성비 좋음','와이파이 됨',
    '직원 친절','혼자 와도 좋음','쿨적함',
  ],
  shopping: [
    '세일 중','사람 없음','에어콘 빡빡',
    '신상 있음','피팅룸 비어있음','직원 친절',
    '주차 가능','구경 재및음','음식점 많음',
    '화장실 깨끗','카드 됨','할인 중',
  ],
  nature: [
    '산책하기 좋음','사람 없음','공기 좋음',
    '날씨 딩 좋음','그늘 있음','일몰 좋음',
    '사진 잘 나옴','혼자 와도 좋음','강아지 동반 가능',
    '조용함','바람 시원','뷰 실화',
  ],
  landmark: [
    '줄 없음','사진 잘 나옴','야경 미침',
    '포토존 비어있음','외국인 많음','혼자 와도 좋음',
    '입장 가능','뷰 실화','낙에 딩 좋음',
    '주차 가능','관광객 많음','분위기 좋음',
  ],
};

const classifyPlaceType = (category: string): PlaceTagType => {
  const c = category.toLowerCase().trim();
  if (c === 'cafe') return 'cafe';
  if (c === 'bar') return 'bar_club';
  if (c === 'restaurant') return 'restaurant';
  if (c === 'park') return 'park_picnic';
  if (c === 'beach') return 'river_beach';
  if (c === 'nature') return 'nature';
  if (c === 'market') return 'market';
  if (c === 'landmark') return 'landmark';
  return 'landmark';
};

const getHashtags = (category: string, seed: number): string[] => {
  const type = classifyPlaceType(category);
  const pool = PLACE_HASHTAG_POOL[type];
  const shuffled = [...pool].sort((a, b) => {
    const ha = (a.charCodeAt(0) * 31 + seed) % pool.length;
    const hb = (b.charCodeAt(0) * 31 + seed) % pool.length;
    return ha - hb;
  });
  return shuffled.slice(0, 5);
};

const r = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ─── 카테고리 이모지 ──────────────────────────────────────────────
const CATEGORY_EMOJI: Record<string, string> = {
  cafe: '☕', bar: '🍺', restaurant: '🍽️', park: '🌿',
  beach: '🌊', nature: '🌲', market: '🛒', landmark: '📍',
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────
interface SpotFeedProps {
  onClose: () => void;
  mapService?: google.maps.places.PlacesService | null; // 선택적 - 이제 사진 로드에 불필요
  onGoToPlace?: (lat: number, lng: number, placeName: string) => void;
  userSpots?: UserSpot[];
}

export function SpotFeed({ onClose, mapService, onGoToPlace, userSpots }: SpotFeedProps) {
  // 확인된 카드만 표시 (사진 있는 것만)
  const [cards, setCards] = useState<FeedCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [slideDir, setSlideDir] = useState<'up' | 'down'>('up');
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 즉시 카드 생성으로 로딩 불필요
  const [imageLoaded, setImageLoaded] = useState(false); // 현재 카드 사진 로드 완료 여부

  // 처리 중인 장소 큐 (사진 조회 대기)
  const pendingRef = useRef<FixedPlace[]>([]);
  const processingRef = useRef(false); // 현재 처리 중 여부
  const mountedRef = useRef(true);
  const processedCountRef = useRef(0); // 처리된 총 수

  // 터치 스와이프
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  // 페이드인
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => {
      clearTimeout(t);
      mountedRef.current = false;
    };
  }, []);

  // ─── 카테고리별 큐레이션된 Unsplash 이미지 URL 풀 ────────────────────
  // source.unsplash.com 서비스 종료로 images.unsplash.com 직접 URL 사용
  const CATEGORY_PHOTOS: Record<string, string[]> = {
    cafe: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=1200&fit=crop',
    ],
    restaurant: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=1200&fit=crop',
    ],
    bar: [
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=1200&fit=crop',
    ],
    park: [
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=1200&fit=crop',
    ],
    beach: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&h=1200&fit=crop',
    ],
    nature: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=1200&fit=crop',
    ],
    market: [
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=1200&fit=crop',
    ],
    landmark: [
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1549693578-d683be217e58?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=1200&fit=crop',
    ],
  };

  const getPhotoUrl = useCallback((place: FixedPlace, seed: number): string => {
    const photos = CATEGORY_PHOTOS[place.category] || CATEGORY_PHOTOS['landmark'];
    return photos[seed % photos.length];
  }, []);

  // ─── 큐 처리 (동기 - API 호출 없이 즉시 카드 생성) ──────────────
  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    processingRef.current = true;

    const batch = pendingRef.current.splice(0, 20); // 한 번에 20개 처리
    if (batch.length === 0) {
      processingRef.current = false;
      return;
    }

    const newCards: FeedCard[] = batch.map((place, i) => {
      const seed = processedCountRef.current + i;
      const minutesAgo = Math.floor(Math.random() * 30) + 1;
      return {
        id: `place-${place.placeName}-${seed}`,
        place,
        mbti: r(MBTI_TYPES),
        sign: r(SIGN_LIST),
        mood: r(MOOD_LIST),
        hashtags: getHashtags(place.category, seed * 137 + 42),
        photoUrl: getPhotoUrl(place, seed),
        postedAt: Date.now() - minutesAgo * 60 * 1000,
      };
    });

    processedCountRef.current += batch.length;

    if (mountedRef.current) {
      setCards(prev => [...prev, ...newCards]);
      setIsLoading(false);
    }

    processingRef.current = false;
  }, [getPhotoUrl]);

  // ─── 초기 큐 설정 (마운트 즉시 실행, mapService 불필요) ──────────────────
  useEffect(() => {
    // FIXED_PLACES 랜덤 셔플 후 큐에 추가
    const shuffled = [...FIXED_PLACES].sort(() => Math.random() - 0.5);
    pendingRef.current = shuffled;
    processedCountRef.current = 0;
    processingRef.current = false;

    processQueue();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 카드 부족 시 추가 처리 ──────────────────────────────────────
  useEffect(() => {
    const remaining = cards.length - currentIndex;
    if (remaining <= 5 && pendingRef.current.length > 0 && !processingRef.current) {
      processQueue();
    }
  }, [currentIndex, cards.length, processQueue]);

    // ─── 사용자 스팟 피드에 삽입 ─────────────────────────────────
  // userSpots가 있으면 cards 3번째마다 삽입 (별도 처리)
  const [userSpotCards, setUserSpotCards] = useState<FeedCard[]>([]);

  useEffect(() => {
    if (!userSpots?.length) return;

    // 사용자 스팟 주변 장소 사진 조회 (getPhotoUrl 사용)
    const newUserCards: FeedCard[] = [];
    for (const spot of userSpots.slice(0, 10)) {
      // 가장 가까운 FIXED_PLACE 찾기
      let closestPlace: FixedPlace | null = null;
      let minDist = Infinity;
      for (const fp of FIXED_PLACES) {
        const d = Math.sqrt(
          Math.pow(fp.lat - spot.lat, 2) + Math.pow(fp.lng - spot.lng, 2)
        );
        if (d < minDist) { minDist = d; closestPlace = fp; }
      }
      if (!closestPlace) continue;

      const seed = Math.floor(Math.random() * 1000);
      newUserCards.push({
        id: `user-spot-${spot.id}`,
        place: { ...closestPlace, placeName: closestPlace.placeName },
        mbti: spot.mbti,
        sign: spot.sign || r(SIGN_LIST),
        mood: spot.mood || r(MOOD_LIST),
        hashtags: getHashtags(closestPlace.category, spot.id * 37),
        photoUrl: getPhotoUrl(closestPlace, seed),
        postedAt: spot.createdAt instanceof Date ? spot.createdAt.getTime() : Date.now() - 2 * 60 * 1000,
        isUserSpot: true,
        userSpotInfo: { mbti: spot.mbti, sign: spot.sign, mood: spot.mood },
      });
    }
    if (newUserCards.length > 0 && mountedRef.current) {
      setUserSpotCards(newUserCards);
    }
  }, [userSpots, getPhotoUrl]);

  // ─── 최종 피드 = 일반 카드 + 사용자 스팟 카드 섞기 ──────────────
  const mergedCards = (() => {
    if (!userSpotCards.length) return cards;
    // 3번째마다 사용자 스팟 카드 삽입
    const result: FeedCard[] = [];
    let userIdx = 0;
    cards.forEach((card, i) => {
      result.push(card);
      if ((i + 1) % 3 === 0 && userIdx < userSpotCards.length) {
        result.push(userSpotCards[userIdx++]);
      }
    });
    return result;
  })();

  const goTo = useCallback((dir: 'up' | 'down') => {
    if (transitioning) return;
    const next = dir === 'up' ? currentIndex + 1 : currentIndex - 1;
    if (next < 0 || next >= mergedCards.length) return;
    setSlideDir(dir);
    setTransitioning(true);
    setImageLoaded(false); // 스와이프 즉시 로딩 상태로 전환
    setTimeout(() => {
      setCurrentIndex(next);
      setTransitioning(false);
    }, 280);
  }, [transitioning, currentIndex, mergedCards.length]);

  // ─── 이미지 프리로드 (현재 ±2 카드 미리 로드) ──────────────────
  useEffect(() => {
    const preloadIndexes = [currentIndex + 1, currentIndex + 2, currentIndex - 1];
    preloadIndexes.forEach(idx => {
      if (idx >= 0 && idx < mergedCards.length) {
        const img = new window.Image();
        img.src = mergedCards[idx].photoUrl;
      }
    });
  }, [currentIndex, mergedCards]);

  // 키보드
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo('up');
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goTo('down');
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goTo, onClose]);

  // 터치 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    const dt = Date.now() - touchStartTime.current;
    if (Math.abs(dy) > 40 && dt < 500) {
      goTo(dy > 0 ? 'up' : 'down');
    }
    touchStartY.current = null;
  };

  // 드래그 실시간 피드백 (translateY 따라오기)
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);

  // 터치 드래그 (onTouchMove 추가)
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    // 반대 방향 제한: 첫 카드에서 위로, 마지막 카드에서 아래로
    if (currentIndex === 0 && dy > 0) return;
    if (currentIndex === mergedCards.length - 1 && dy < 0) return;
    setDragOffset(dy * 0.4); // 저항감 (0.4배)
  };

  // 마우스 드래그
  const mouseStartY = useRef<number | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartY.current = e.clientY;
    isDragging.current = true;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartY.current === null) return;
    const dy = e.clientY - mouseStartY.current;
    if (currentIndex === 0 && dy > 0) return;
    if (currentIndex === mergedCards.length - 1 && dy < 0) return;
    setDragOffset(dy * 0.4);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (mouseStartY.current === null) return;
    const dy = mouseStartY.current - e.clientY;
    setDragOffset(0);
    isDragging.current = false;
    if (Math.abs(dy) > 50) goTo(dy > 0 ? 'up' : 'down');
    mouseStartY.current = null;
  };
  const onMouseLeave = () => {
    if (isDragging.current && mouseStartY.current !== null) {
      setDragOffset(0);
      isDragging.current = false;
      mouseStartY.current = null;
    }
  };

  const card = mergedCards[currentIndex];
  const mbtiColor = card ? (MBTI_COLORS[card.mbti] || '#00f0ff') : '#00f0ff';
  const catEmoji = card ? (CATEGORY_EMOJI[card.place.category] || '📍') : '📍';

  // ─── 초기 로딩 화면 ──────────────────────────────────────────────
  if (isLoading || !card) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#000',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.6)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="1" y1="1" x2="13" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="13" y1="1" x2="1" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div style={{
          fontFamily: "'Bebas Neue', 'Black Han Sans', sans-serif",
          fontSize: '28px',
          fontWeight: 900,
          letterSpacing: '4px',
          color: '#00f0ff',
          textShadow: '0 0 20px #00f0ff88',
        }}>
          SPOT
        </div>
        {/* 로딩 스피너 */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0,240,255,0.15)',
          borderTop: '3px solid #00f0ff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '2px',
        }}>
          장소 사진 불러오는 중...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 슬라이드 애니메이션 + 드래그 오프셋
  const slideStyle: React.CSSProperties = transitioning
    ? {
        transform: slideDir === 'up' ? 'translateY(-8%)' : 'translateY(8%)',
        opacity: 0,
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease',
      }
    : dragOffset !== 0
    ? {
        transform: `translateY(${dragOffset}px)`,
        opacity: 1 - Math.abs(dragOffset) / 400,
        transition: 'none', // 드래그 중 트랜지션 없애야 부드러움
      }
    : {
        transform: 'translateY(0)',
        opacity: 1,
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease',
      };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={(e) => { setDragOffset(0); onTouchEnd(e); }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10001,
          background: 'rgba(0,0,0,0.6)',
          border: '1.5px solid rgba(255,255,255,0.25)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="1" y1="1" x2="13" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <line x1="13" y1="1" x2="1" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* SPOT 로고 (좌상단) */}
      <div
        style={{
          position: 'absolute',
          top: '18px',
          left: '16px',
          zIndex: 10001,
          fontFamily: "'Bebas Neue', 'Black Han Sans', sans-serif",
          fontSize: '20px',
          fontWeight: 900,
          letterSpacing: '3px',
          color: '#00f0ff',
          textShadow: '0 0 12px #00f0ff88',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        SPOT
        {card.isUserSpot && (
          <span style={{
            fontSize: '9px',
            background: 'rgba(255,0,200,0.2)',
            border: '1px solid rgba(255,0,200,0.5)',
            borderRadius: '4px',
            padding: '1px 5px',
            color: '#ff00cc',
            letterSpacing: '1px',
            fontFamily: 'inherit',
          }}>LIVE</span>
        )}
      </div>

      {/* 카드 영역 */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          maxHeight: '100dvh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 메인 카드 */}
        <div
          style={{
            ...slideStyle,
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* 배경 사진 (항상 존재) */}
          <img
            src={card.photoUrl}
            alt={card.place.placeName}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
            draggable={false}
            onLoad={() => setImageLoaded(true)}
          />

          {/* 로딩 중 오버레이 */}
          {!imageLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#0a0a0a',
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              {/* Shimmer 오버레이 */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(105deg, transparent 40%, rgba(0,240,255,0.04) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s ease-in-out infinite',
              }} />

              {/* 상단 장소명 스켈레턴 */}
              <div style={{
                position: 'absolute',
                top: '60px',
                left: '16px',
                height: '22px',
                width: '140px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.08) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
              </div>

              {/* 하단 오버레이 그라디언트 */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '55%',
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.85) 60%, #000 100%)',
              }} />

              {/* MBTI 배지 스켈레턴 */}
              <div style={{
                position: 'absolute',
                bottom: '180px',
                left: '16px',
                height: '28px',
                width: '72px',
                borderRadius: '14px',
                background: 'rgba(0,240,255,0.1)',
                border: '1px solid rgba(0,240,255,0.15)',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.12) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite 0.1s' }} />
              </div>

              {/* SIGN 스켈레턴 */}
              <div style={{
                position: 'absolute',
                bottom: '144px',
                left: '16px',
                height: '16px',
                width: '160px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite 0.2s' }} />
              </div>

              {/* 해시태그 스켈레턴 3개 */}
              <div style={{ position: 'absolute', bottom: '108px', left: '16px', display: 'flex', gap: '6px' }}>
                {[80, 100, 70].map((w, i) => (
                  <div key={i} style={{
                    height: '22px',
                    width: `${w}px`,
                    borderRadius: '11px',
                    background: 'rgba(255,255,255,0.07)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s ease-in-out infinite ${0.1 * i}s` }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 그라디언트 오버레이 (하단 정보 가독성) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 45%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* 상단 - 장소명 태그 */}
          <div
            style={{
              position: 'absolute',
              top: '60px',
              left: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${mbtiColor}44`,
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.5px',
              }}
            >
              {catEmoji} {card.place.placeName.length > 14 ? card.place.placeName.slice(0, 14) + '…' : card.place.placeName}
            </div>
          </div>

          {/* 우측 - 인터랙션 버튼 */}
          <div
            style={{
              position: 'absolute',
              right: '12px',
              bottom: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >


            {/* 지도 이동 버튼 (SPOT 고유 기능) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(0,240,255,0.12)',
                  border: '2px solid rgba(0,240,255,0.5)',
                  boxShadow: '0 0 12px rgba(0,240,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (onGoToPlace) {
                    onGoToPlace(card.place.lat, card.place.lng, card.place.placeName);
                  }
                  onClose();
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
                </svg>
              </div>
              <span style={{ fontSize: '9px', color: 'rgba(0,240,255,0.7)', textAlign: 'center', lineHeight: 1.2 }}>지도에서<br/>보기</span>
            </div>

            {/* 인원 수 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,0,200,0.12)',
                  border: '2px solid rgba(255,0,200,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 900,
                  color: '#ff00cc',
                }}
              >
                {card.place.placeName.length % 14 + 3}
              </div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>명</span>
            </div>

            {/* 공유 버튼 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={async (e) => {
                  e.stopPropagation();
                  const shareText = `${card.place.placeName}\n${card.mbti} · ${card.mood}\n${card.hashtags.slice(0, 3).join(' ')}\n\nSPOT - 지금 이 곳의 실시간 분위기`;
                  const shareUrl = window.location.origin + '/mvp';
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: `SPOT · ${card.place.placeName}`, text: shareText, url: shareUrl });
                    } catch (_) { /* 취소 */ }
                  } else {
                    // 폴백: 클립보드 복사
                    try {
                      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                      // 토스트 대신 잊시적 피드백
                      const el = e.currentTarget as HTMLElement;
                      const prev = el.style.background;
                      el.style.background = 'rgba(0,240,255,0.25)';
                      setTimeout(() => { el.style.background = prev; }, 600);
                    } catch (_) { /* 실패 무시 */ }
                  }
                }}
              >
                {/* 공유 아이콘 (arrow up from box) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>공유</span>
            </div>
          </div>

          {/* 실시간 공간 피드 - N분 전 표시 */}
          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: '12px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(6px)',
              border: `1px solid ${card.isUserSpot ? 'rgba(255,0,200,0.3)' : 'rgba(0,240,255,0.25)'}`,
              borderRadius: '20px',
              padding: '3px 8px',
            }}
          >
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: card.isUserSpot ? '#ff00cc' : '#00f0ff',
              boxShadow: card.isUserSpot ? '0 0 6px #ff00cc' : '0 0 6px #00f0ff',
              animation: 'pulse-dot 1.5s ease-in-out infinite',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '10px',
              color: card.isUserSpot ? 'rgba(255,0,200,0.9)' : 'rgba(0,240,255,0.85)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              {(() => {
                const diff = Math.floor((Date.now() - card.postedAt) / 60000);
                if (diff < 1) return '방금';
                if (diff < 60) return `${diff}분 전`;
                const h = Math.floor(diff / 60);
                return `${h}시간 전`;
              })()}
            </span>
          </div>

          {/* 하단 오버레이 - 핵심 정보 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 16px 36px',
            }}
          >
            {/* 아이디/MBTI/SIGN 라인 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                flexWrap: 'wrap',
              }}
            >
              {/* MBTI 인라인 뱃지 */}
              <span
                style={{
                  background: `${mbtiColor}22`,
                  border: `1px solid ${mbtiColor}88`,
                  borderRadius: '6px',
                  padding: '2px 7px',
                  fontSize: '11px',
                  fontWeight: 900,
                  color: mbtiColor,
                  letterSpacing: '1px',
                  textShadow: `0 0 8px ${mbtiColor}66`,
                }}
              >
                {card.mbti}
              </span>
              {/* SIGN */}
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                }}
              >
                {card.sign}
              </span>
            </div>

            {/* 장소명 */}
            <div
              style={{
                fontSize: '17px',
                fontWeight: 900,
                color: '#fff',
                marginBottom: '10px',
                letterSpacing: '-0.3px',
                lineHeight: 1.3,
                textShadow: '0 1px 8px rgba(0,0,0,0.8)',
              }}
            >
              {card.place.placeName}
            </div>

            {/* 해시태그 */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {card.hashtags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '12px',
                    color: i === 0 ? '#00f0ff' : 'rgba(255,255,255,0.65)',
                    fontWeight: i === 0 ? 700 : 400,
                    textShadow: i === 0 ? '0 0 8px #00f0ff66' : 'none',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* SPOT 워터마크 */}
            <div
              style={{
                marginTop: '12px',
                fontSize: '10px',
                color: card.isUserSpot ? 'rgba(255,0,200,0.6)' : 'rgba(0,240,255,0.4)',
                letterSpacing: '2px',
                fontWeight: 700,
              }}
            >
              {card.isUserSpot ? 'SPOT · 실시간 현장' : 'SPOT · 지금 이 순간'}
            </div>
          </div>
        </div>

        {/* 우측 진행 인디케이터 */}
        <div
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 10,
          }}
        >
          {mergedCards.slice(Math.max(0, currentIndex - 2), Math.min(mergedCards.length, currentIndex + 5)).map((_, i) => {
            const absIdx = Math.max(0, currentIndex - 2) + i;
            const isActive = absIdx === currentIndex;
            return (
              <div
                key={absIdx}
                style={{
                  width: isActive ? '3px' : '2px',
                  height: isActive ? '20px' : '6px',
                  borderRadius: '2px',
                  background: isActive ? '#00f0ff' : 'rgba(255,255,255,0.25)',
                  boxShadow: isActive ? '0 0 6px #00f0ff' : 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            );
          })}
        </div>

        {/* 스와이프 힌트 (첫 번째 카드에만) */}
        {currentIndex === 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              animation: 'swipeHint 2s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>위로 스와이프</span>
          </div>
        )}
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes swipeHint {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
          50% { transform: translateX(-50%) translateY(-8px); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
