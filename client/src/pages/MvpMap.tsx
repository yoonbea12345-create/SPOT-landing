import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { FIXED_PLACES } from "@/data/fixedPlaces";

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

// SIGN 목록 (더미 데이터용 - SIGN_SIGNALS와 동일한 이모지+텍스트 형식)
const SIGN_LIST = SIGN_SIGNALS.slice(1).map(s => `${s.emoji} ${s.text}`);

// 핫플레이스 도시별 큐레이션 데이터
type HotplaceVenue = {
  name: string;
  category: string;
  address: string;
  description: string;
  stats: { icon: string; text: string }[];
};

const HOTPLACE_DATA: Record<string, HotplaceVenue> = {
  홍대: {
    name: "핵인싸 클럽 FF",
    category: "🍺 클럽 · 바",
    address: "서울 마포구 와우산로 홍대입구역 3번 출구",
    description: "홍대 골목 숨은 루프탑 바. 인스타 성지로 떠오른 네온 인테리어.",
    stats: [
      { icon: "💬", text: "지금 이 공간 반경 50m — ENFP 7명, ENTP 5명 감지 중. 대화 시작 확률 높은 구역" },
      { icon: "⚡", text: "이 시간대 SPOT 신규 유입 속도 — 서울 전체 클럽 중 1위. 지금 이 순간이 피크" },
      { icon: "🕐", text: "금요일 밤 11시, 지금 이 시간대가 역대 SPOT 밀도 최고 기록 시간대예요" },
    ],
  },
  강남: {
    name: "카페 그레이 가든",
    category: "☕ 감성 카페",
    address: "서울 강남구 선릉로 압구정로데오역 인근",
    description: "압구정 골목 속 유럽풍 정원 카페. 인스타 릴스 촬영 명소.",
    stats: [
      { icon: "🧠", text: "이 카페 방문자 MBTI 1위 INFJ, 2위 ISFP — 감성 충전 목적 방문 비율 61%" },
      { icon: "🤝", text: "혼자 방문한 사람 중 28%가 옆 테이블과 대화를 시작했어요 (SPOT 기록 기준)" },
      { icon: "📍", text: "반경 100m 내 지금 SPOT 활성 유저 12명 — 강남 전체 카페 중 밀도 3위" },
    ],
  },
  여의도: {
    name: "한강 피크닉 스팟 B구역",
    category: "🌿 야외 · 피크닉",
    address: "서울 영등포구 여의도 한강공원 B구역",
    description: "여의도 한강공원 숨은 피크닉 명당. 석양 뷰 최고.",
    stats: [
      { icon: "🌅", text: "일몰 직전 30분, 이 구역 SPOT 밀도가 하루 중 최고치 — 지금 ISFP 9명, INFP 6명 감지" },
      { icon: "💬", text: "피크닉 매트 펼친 사람끼리 말 걸 확률 — 이 구역이 한강공원 전체 중 1위 (SPOT 집계)" },
      { icon: "🎯", text: "오늘 이 시간대 같은 MBTI를 만날 확률 추정 68% — 지금 당장 가볼 만한 이유" },
    ],
  },
  성수: {
    name: "성수 어반 브루어리",
    category: "🍺 크래프트 비어",
    address: "서울 성동구 성수이로 뚝섬역 2번 출구",
    description: "공장 개조 크래프트 비어 펍. 성수 힙스터들의 성지.",
    stats: [
      { icon: "🔥", text: "지금 이 펍 반경 30m — ENTJ 8명, ENTP 6명 집중. 성수 전체 SPOT 밀도 1위 구역" },
      { icon: "🗣️", text: "이 공간 방문자 중 44%가 모르는 사람과 대화를 나눴어요 — 서울 바 중 대화 지수 최상위" },
      { icon: "⚡", text: "퇴근 후 7~9시, ENTJ·ENTP 유형 급증 타임 — 지금이 SPOT 황금 시간대" },
    ],
  },
  명동: {
    name: "명동 이색 라멘 골목",
    category: "🍜 맛집 · 라멘",
    address: "서울 중구 명동8나길 명동역 8번 출구",
    description: "외국인도 줄 서는 명동 골목 라멘집. 진한 돈코츠 국물.",
    stats: [
      { icon: "🌏", text: "대기줄 MBTI 분포 — ESTJ 31%, ISTJ 24%, ENTJ 18% (SPOT 대기 유저 집계 기준)" },
      { icon: "💬", text: "평균 대기 22분 — 이 줄에서 옆 사람과 대화 시작한 비율 52%. 대기줄이 곧 만남의 광장" },
      { icon: "🎯", text: "같은 MBTI끼리 자연스럽게 합석 성사율 — 명동 전체 맛집 중 1위 (SPOT 기록)" },
    ],
  },
  부산: {
    name: "해운대 루프탑 바 WAVE",
    category: "🌊 루프탑 바",
    address: "부산 해운대구 해운대해변로 해운대역 인근",
    description: "해운대 바다 뷰 루프탑 바. 부산 여행 필수 코스.",
    stats: [
      { icon: "✈️", text: "여행 중 방문자 비율 78% — ENFP·ESFP 유형이 '부산 왔으면 여기'로 SPOT에 등록한 장소 1위" },
      { icon: "🎯", text: "이 루프탑 SPOT 유저 재방문율 68% — '한 번 오면 또 오게 되는' 부산 바 1위" },
      { icon: "🌊", text: "저녁 8시 이후 SPOT 밀도 3배 급증 — 지금 이 시간 반경 50m에 23명 감지 중" },
    ],
  },
  대구: {
    name: "동성로 빈티지 카페 거리",
    category: "☕ 빈티지 카페",
    address: "대구 중구 동성로 중앙로역 인근",
    description: "대구 동성로 골목 빈티지 감성 카페 밀집 구역.",
    stats: [
      { icon: "🎨", text: "이 골목 SPOT 유저 MBTI 1위 INFP (34%), 2위 ISFP (27%) — 감성 유형 집중 구역" },
      { icon: "📸", text: "오전 11시~오후 1시 자연광 타임, 이 시간대 SPOT 사진 공유 수 하루 중 최다" },
      { icon: "🤫", text: "혼자 온 사람끼리 말 없이 같은 공간 공유하는 비율 — 대구 카페 중 1위. 조용한 연대감" },
    ],
  },
  인천: {
    name: "개항로 이색 포차",
    category: "🍢 이색 포차",
    address: "인천 중구 개항로 인천역 1번 출구",
    description: "개항장 골목 옛 창고를 개조한 이색 포차. 인천 로컬 감성.",
    stats: [
      { icon: "🎸", text: "버스킹 시작 후 30분 내 SPOT 신규 등록 평균 +14명 — 음악이 사람을 불러모으는 공간" },
      { icon: "🍻", text: "이 포차 방문자 중 ISTP·ESTP 비율 합산 49% — '말보다 분위기로 통하는' 유형 집중" },
      { icon: "💬", text: "처음 온 사람이 단골처럼 어울리게 된 비율 63% — 인천 전체 포차 중 '낯선 사람 친해지기' 1위" },
    ],
  },
  광주: {
    name: "동명동 감성 카페 골목",
    category: "☕ 감성 카페",
    address: "광주 동구 동명동 충장로 인근",
    description: "광주 예술의 거리 옆 감성 카페 골목. 로컬 아티스트 공간.",
    stats: [
      { icon: "🎨", text: "플리마켓 당일 SPOT 활성 유저 평소 대비 4.2배 급증 — INFJ·ENFJ 유형 집중 유입" },
      { icon: "💡", text: "이 골목 방문자 중 '새로운 사람을 만나러 왔다'고 SPOT에 등록한 비율 — 광주 1위 (38%)" },
      { icon: "🤝", text: "아티스트와 방문객이 자연스럽게 대화 시작한 비율 55% — 광주에서 가장 열린 공간" },
    ],
  },
  대전: {
    name: "성심당 옆 골목 디저트 투어",
    category: "🍰 디저트 카페",
    address: "대전 중구 은행동 성심당 인근",
    description: "성심당 줄 서다 발견한 골목 디저트 카페들. 대전 여행 필수.",
    stats: [
      { icon: "🍞", text: "성심당 오픈런 대기줄 SPOT 등록자 중 ESFJ 35%, ENFJ 22% — '같이 기다리면 친해지는' 유형 집중" },
      { icon: "💬", text: "대기 중 옆 사람과 디저트 추천 대화 시작 비율 67% — 대전 전체 맛집 대기줄 중 1위" },
      { icon: "📍", text: "이 골목 반경 200m, 지금 SPOT 활성 유저 18명 — 대전 전체 핫플 중 밀도 압도적 1위" },
    ],
  },
  울산: {
    name: "태화강 국가정원 카페",
    category: "🌿 자연 카페",
    address: "울산 중구 태화동 태화강 국가정원 내",
    description: "태화강 국가정원 안 힐링 카페. 대나무숲 뷰 인생샷 명소.",
    stats: [
      { icon: "🌿", text: "이 카페 SPOT 유저 MBTI 1위 ISFJ (31%), 2위 INFJ (26%) — 조용히 힐링하러 온 사람들의 공간" },
      { icon: "🎋", text: "저녁 7시 이후 대나무숲 조명 점등 — 이 시간 SPOT 신규 등록 하루 중 최다, 지금 11명 감지" },
      { icon: "🌙", text: "저녁 7시 이후 솔로 방문자 비율 71% — 혼자 와도 외롭지 않은 공간, 울산 SPOT 감성 1위" },
    ],
  },
  수원: {
    name: "행리단길 이색 맛집",
    category: "🍽️ 이색 맛집",
    address: "수원 팔달구 행궁동 수원화성 인근",
    description: "수원화성 옆 행리단길 골목 이색 퓨전 맛집. 수원 로컬 핫플.",
    stats: [
      { icon: "🏰", text: "수원화성 야경 감상 후 이 골목 유입 비율 72% — ENTP·ENFP 유형이 '다음 코스'로 가장 많이 등록" },
      { icon: "🍽️", text: "이 골목 합석 문화 정착 — 처음 온 솔로 방문자 중 합석 성사율 48%, 수원 1위" },
      { icon: "🔥", text: "이 골목 SPOT 밀도 주말 저녁 기준 수원 전체 1위 — 지금 이 시간 반경 100m에 17명 감지" },
    ],
  },
  고양: {
    name: "일산 호수공원 피크닉 카페",
    category: "🌿 호수뷰 카페",
    address: "경기 고양시 일산동구 호수공원 인근",
    description: "일산 호수공원 뷰 카페. 주말 피크닉 성지.",
    stats: [
      { icon: "🌊", text: "분수 쇼 시간(오후 2·4·6시) 전후 30분 — SPOT 밀도 평소 대비 2.8배 급증, 지금 ISFP 8명 감지" },
      { icon: "🎯", text: "피크닉 매트 펼친 솔로 방문자 중 같은 MBTI와 자연스럽게 어울린 비율 — 경기도 1위 (41%)" },
      { icon: "💬", text: "'강아지 때문에 대화 시작됐다'는 SPOT 후기 비율 — 이 공원이 경기도 전체 중 압도적 1위" },
    ],
  },
  제주시: {
    name: "제주 협재 해변 이색 카페",
    category: "🌊 오션뷰 카페",
    address: "제주 제주시 한림읍 협재리 협재해수욕장 인근",
    description: "협재 해변 바로 앞 오션뷰 카페. 에메랄드빛 바다 뷰 인생샷.",
    stats: [
      { icon: "✈️", text: "제주 여행 중 SPOT 등록자 중 이 카페 방문 비율 — ENFP 1위, ESFP 2위. '제주 왔으면 여기'" },
      { icon: "🌅", text: "일몰 1시간 전 SPOT 밀도 최고치 — 지금 이 시간 반경 100m에 ENFP 11명, ESFP 8명 감지" },
      { icon: "🌊", text: "제주 여행자 SPOT 등록 장소 중 재방문 의향 1위 — '다음에 제주 오면 무조건 다시 올 곳'" },
    ],
  },
};

// 더미 데이터 타입
type DummyMarker = {
  mbti: string;
  lat: number;
  lng: number;
  id: number;
  mood: string;
  mode: string;
  sign: string;
  placeName?: string;   // 실제 장소명 (고정 마커)
  placeId?: string;     // Google Place ID (고정 마커)
  category?: string;    // 장소 카테고리 (폴백 이미지용)
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

  // 해당 도시의 고정 장소 필터링 함수
  const getFixedPlacesNearCity = (cityLat: number, cityLng: number, radiusDeg = 0.25) =>
    FIXED_PLACES.filter(p =>
      Math.abs(p.lat - cityLat) < radiusDeg && Math.abs(p.lng - cityLng) < radiusDeg
    );

  cities.forEach((city) => {
    const count = Math.floor(Math.random() * (city.count[1] - city.count[0] + 1)) + city.count[0];
    const nearbyFixed = getFixedPlacesNearCity(city.lat, city.lng);

    for (let i = 0; i < count; i++) {
      const mbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
      const mood = MOOD_LIST[Math.floor(Math.random() * MOOD_LIST.length)];
      const mode = MODE_LIST[Math.floor(Math.random() * MODE_LIST.length)];
      const sign = SIGN_LIST[Math.floor(Math.random() * SIGN_LIST.length)];
      
      let lat, lng;

      // 75% 확률로 고정 장소 좌표에 정확히 배치, 그 중 30%는 외부 랜덤 재배치
      if (nearbyFixed.length > 0 && Math.random() < 0.75) {
        if (Math.random() < 0.30) {
          // 30%는 도시 전체 랜덤 배치 (골목/시골 등)
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.pow(Math.random(), 0.6) * 0.18;
          lat = city.lat + Math.sin(angle) * dist;
          lng = city.lng + Math.cos(angle) * dist;
        } else {
          // 70%는 고정 장소 좌표에 4m 이내 무작위 분산 배치 (1도 ≈ 111,000m, 4m ÷ 111,000 ≈ 0.000036)
          const anchor = nearbyFixed[Math.floor(Math.random() * nearbyFixed.length)];
          const angle = Math.random() * Math.PI * 2;
          // 반경 4m 이내에서 무작위 분산 (제곱근 적용으로 중심부 과집중 방지)
          const dist = Math.sqrt(Math.random()) * 0.000036;
          lat = anchor.lat + Math.sin(angle) * dist;
          lng = anchor.lng + Math.cos(angle) * dist;
        }
      } else if (city.name === "제주시" || city.name === "서귀포") {
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

  // 실제 장소 고정 마커 추가
  FIXED_PLACES.forEach(place => {
    data.push({ ...place, id: id++ });
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
  screenX: number; // 클릭한 마커의 화면 X 좌표
  screenY: number; // 클릭한 마커의 화면 Y 좌표
  placeName?: string;  // 실제 장소명 (고정 마커)
  category?: string;   // 장소 카테고리 (폴백용)
  nearbyCount?: number; // 이 장소 반경 내 인원 수
  nearbyMbtiDist?: Record<string, number>; // 반경 내 MBTI 분포
};

// 장소 사진 타입
type PlacePhoto = {
  url: string;
  attribution: string;
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
  const [placePhotos, setPlacePhotos] = useState<PlacePhoto[]>([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [popupPlaceName, setPopupPlaceName] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const cityLabelsRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState(15.0);
  const [hotspotCityNames, setHotspotCityNames] = useState<string[]>([]);
  const [showHotplacePopup, setShowHotplacePopup] = useState(false);
  const [selectedHotplaceTab, setSelectedHotplaceTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{name: string; lat: number; lng: number}[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dummyDataRef = useRef<ReturnType<typeof generateDummyData>>([]);
  const swipeTouchStartY = useRef<number | null>(null);
  const swipeTranslateY = useRef(0);
  const [sheetTranslateY, setSheetTranslateY] = useState(0);

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

  // 스팟 폼은 CTA 버튼으로 수동 오픈

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

  // HOTSPOT 도시 (랜덤 3곳, 컴포넌트 마운트 시 1회 결정)
  const hotspotCitiesRef = useRef<string[] | null>(null);
  const getHotspotCities = useCallback((cityNames: string[]) => {
    if (hotspotCitiesRef.current) return hotspotCitiesRef.current;
    // 주요 도시 중에서만 선정 (서울 5곳 + 광역시 + 수원/성남/고양 등 인지도 높은 곳)
    const candidateCities = [
      "홍대", "강남", "여의도", "성수", "명동",
      "부산", "대구", "인천", "광주", "대전", "울산",
      "수원", "고양", "제주시"
    ].filter(c => cityNames.includes(c));
    const shuffled = [...candidateCities].sort(() => Math.random() - 0.5);
    hotspotCitiesRef.current = shuffled.slice(0, 3);
    return hotspotCitiesRef.current;
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

    // 구글 맵 기본 UI 컨트롤 제거 (전체화면 버튼만 유지)
    map.setOptions({
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      keyboardShortcuts: false,
      rotateControl: false,
      panControl: false,
      tilt: 0,
      gestureHandling: 'greedy',
    });

    // 줌 레벨 변경 감지
    map.addListener('zoom_changed', () => {
      const zoom = map.getZoom() || 15;
      setCurrentZoom(Math.round(zoom * 2) / 2); // 0.5 단위로 반올림
    });

    // 핀치줌 완전 재구현 - 구글맵 기본 핀치줌 차단 후 직접 제어
    // ===== 핀치줌 재구현 (네이버지도 수준) =====
    const mapDiv = map.getDiv();
    let pinchStartDist = 0;
    let pinchStartZoom = 15;
    let pinchStartCenter: google.maps.LatLng | null = null;
    let pinchMidX = 0; // 핀치 시작 시 중심점 X (px)
    let pinchMidY = 0; // 핀치 시작 시 중심점 Y (px)
    let isPinching = false;
    const PINCH_SENSITIVITY = 2.8;

    // 화면 px 좌표를 지도 LatLng로 변환
    const pixelToLatLng = (px: number, py: number, zoom: number, center: google.maps.LatLng) => {
      const scale = Math.pow(2, zoom);
      const rect = mapDiv.getBoundingClientRect();
      const mapW = rect.width;
      const mapH = rect.height;
      const centerX = mapW / 2;
      const centerY = mapH / 2;
      const dxPx = px - centerX;
      const dyPx = py - centerY;
      const metersPerPx = 156543.03392 / scale;
      const dLng = (dxPx * metersPerPx) / (111320 * Math.cos(center.lat() * Math.PI / 180));
      const dLat = -(dyPx * metersPerPx) / 111320;
      return { lat: center.lat() + dLat, lng: center.lng() + dLng };
    };

    const getPinchDist = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onPinchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
        pinchStartDist = getPinchDist(e.touches);
        pinchStartZoom = map.getZoom() ?? 15;
        pinchStartCenter = map.getCenter() ?? null;
        // 두 손가락 중간점 (px)
        const rect = mapDiv.getBoundingClientRect();
        pinchMidX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - rect.left;
        pinchMidY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - rect.top;
        isPinching = true;
      }
    };

    const onPinchMove = (e: TouchEvent) => {
      if (!isPinching || e.touches.length < 2 || !pinchStartCenter) return;
      e.preventDefault();
      const dist = getPinchDist(e.touches);
      if (pinchStartDist < 10) return;
      const ratio = dist / pinchStartDist;
      const zoomDelta = Math.log2(ratio) * PINCH_SENSITIVITY;
      const newZoom = Math.max(5, Math.min(21, pinchStartZoom + zoomDelta));

      // 핀치 중심점을 기준으로 지도 중심 보정
      // 중심점이 핀치 시작 위치에 고정되도록 코드
      const pinchLatLng = pixelToLatLng(pinchMidX, pinchMidY, pinchStartZoom, pinchStartCenter);
      const mapCenterLatLng = pixelToLatLng(mapDiv.getBoundingClientRect().width / 2, mapDiv.getBoundingClientRect().height / 2, pinchStartZoom, pinchStartCenter);
      const scaleFactor = Math.pow(2, newZoom - pinchStartZoom);
      const newCenterLat = pinchLatLng.lat - (pinchLatLng.lat - mapCenterLatLng.lat) / scaleFactor;
      const newCenterLng = pinchLatLng.lng - (pinchLatLng.lng - mapCenterLatLng.lng) / scaleFactor;

      map.setZoom(newZoom);
      map.setCenter({ lat: newCenterLat, lng: newCenterLng });
    };

    const onPinchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isPinching = false;
        pinchStartDist = 0;
        pinchStartCenter = null;
      }
    };

    mapDiv.addEventListener('touchstart', onPinchStart, { passive: false, capture: true });
    mapDiv.addEventListener('touchmove', onPinchMove, { passive: false, capture: true });
    mapDiv.addEventListener('touchend', onPinchEnd, { passive: true, capture: true });

    // ===== 더블탭 줌인 =====
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    const onDoubleTap = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const now = Date.now();
      const tapX = e.touches[0].clientX;
      const tapY = e.touches[0].clientY;
      const dt = now - lastTapTime;
      const dx = Math.abs(tapX - lastTapX);
      const dy = Math.abs(tapY - lastTapY);
      if (dt < 300 && dx < 40 && dy < 40) {
        // 더블탭 감지 - 탭 위치 기준으로 줌인
        e.preventDefault();
        const rect = mapDiv.getBoundingClientRect();
        const tapPxX = tapX - rect.left;
        const tapPxY = tapY - rect.top;
        const curZoom = map.getZoom() ?? 15;
        const curCenter = map.getCenter();
        if (curCenter) {
          const tapLatLng = pixelToLatLng(tapPxX, tapPxY, curZoom, curCenter);
          // 탭 위치를 중심으로 줌인
          const newZoom = Math.min(21, curZoom + 1);
          const scaleFactor = Math.pow(2, 1); // +1 줌
          const newCenterLat = tapLatLng.lat - (tapLatLng.lat - curCenter.lat()) / scaleFactor;
          const newCenterLng = tapLatLng.lng - (tapLatLng.lng - curCenter.lng()) / scaleFactor;
          map.panTo({ lat: newCenterLat, lng: newCenterLng });
          map.setZoom(newZoom);
        }
        lastTapTime = 0;
      } else {
        lastTapTime = now;
        lastTapX = tapX;
        lastTapY = tapY;
      }
    };
    mapDiv.addEventListener('touchstart', onDoubleTap, { passive: false, capture: false });

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
    dummyDataRef.current = dummyData;
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
        // 반경 50m 내 마커 수 및 MBTI 분포 계산
        const NEARBY_R = 0.0005;
        const nearbyAllM = dummyDataRef.current.filter(d =>
          Math.abs(d.lat - item.lat) < NEARBY_R && Math.abs(d.lng - item.lng) < NEARBY_R
        );
        const nearbyMbtiDistM: Record<string, number> = {};
        nearbyAllM.forEach(d => { nearbyMbtiDistM[d.mbti] = (nearbyMbtiDistM[d.mbti] || 0) + 1; });
        setSelectedMarker({ mbti: item.mbti, distance });
        setPopupAddress(null);
        setPlacePhotos([]);
        setLightboxIndex(null);
        setPopupPlaceName(null);
        setPopupData({
          mbti: item.mbti,
          mood: item.mood,
          mode: item.mode,
          sign: item.sign,
          distance,
          lat: item.lat,
          lng: item.lng,
          screenX: mouseEvent.clientX,
          screenY: mouseEvent.clientY,
          placeName: item.placeName,
          category: item.category,
          nearbyCount: nearbyAllM.length,
          nearbyMbtiDist: nearbyMbtiDistM,
        });
        // 고정 장소명 있으면 즉시 설정
        if (item.placeName) setPopupPlaceName(item.placeName);
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
        // Google Places API로 장소 사진 가져오기
        setPhotoLoading(true);
        const placesService = new google.maps.places.PlacesService(mapRef.current!);

        const fetchPhotosByPlaceId = (placeId: string) => {
          placesService.getDetails(
            { placeId, fields: ['photos', 'name'] },
            (detail, detailStatus) => {
              if (detailStatus === google.maps.places.PlacesServiceStatus.OK && detail?.photos) {
                const photos: PlacePhoto[] = detail.photos.slice(0, 6).map(photo => ({
                  url: photo.getUrl({ maxWidth: 800, maxHeight: 600 }),
                  attribution: photo.html_attributions?.[0] ?? '',
                }));
                setPlacePhotos(photos);
                // Places API에서 장소명 가져오기 (고정명 없을 때)
                if (!item.placeName && detail.name) setPopupPlaceName(detail.name);
              }
              setPhotoLoading(false);
            }
          );
        };

        if (item.placeName) {
          // 고정 장소명이 있으면 텍스트 검색으로 Place ID 조회
          placesService.findPlaceFromQuery(
            {
              query: item.placeName,
              fields: ['place_id', 'name'],
              locationBias: new google.maps.LatLng(item.lat, item.lng),
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]?.place_id) {
                fetchPhotosByPlaceId(results[0].place_id);
              } else {
                // 텍스트 검색 실패 시 nearbySearch 폴백
                placesService.nearbySearch(
                  { location: { lat: item.lat, lng: item.lng }, radius: 150, type: 'establishment' },
                  (placeResults, placeStatus) => {
                    if (placeStatus === google.maps.places.PlacesServiceStatus.OK && placeResults && placeResults.length > 0) {
                      const withPhotos = placeResults.filter(p => p.photos && p.photos.length > 0);
                      const target = withPhotos.length > 0 ? withPhotos[0] : placeResults[0];
                      if (target.place_id) fetchPhotosByPlaceId(target.place_id);
                      else setPhotoLoading(false);
                    } else { setPhotoLoading(false); }
                  }
                );
              }
            }
          );
        } else {
          // 고정명 없으면 nearbySearch
          placesService.nearbySearch(
            { location: { lat: item.lat, lng: item.lng }, radius: 150, type: 'establishment' },
            (placeResults, placeStatus) => {
              if (placeStatus === google.maps.places.PlacesServiceStatus.OK && placeResults && placeResults.length > 0) {
                const withPhotos = placeResults.filter(p => p.photos && p.photos.length > 0);
                const target = withPhotos.length > 0 ? withPhotos[0] : placeResults[0];
                if (target.place_id) fetchPhotosByPlaceId(target.place_id);
                else setPhotoLoading(false);
              } else { setPhotoLoading(false); }
            }
          );
        }
      });

      markersRef.current.push(marker);
    });

    // 고정 장소별 마커 수 카운트 계산 → 15개 이상이면 반짝이 이펙트
    const locationCount: Record<string, { lat: number; lng: number; count: number; name: string }> = {};
    dummyData.forEach(item => {
      const key = `${Math.round(item.lat / 0.00005) * 0.00005},${Math.round(item.lng / 0.00005) * 0.00005}`;
      if (!locationCount[key]) {
        locationCount[key] = { lat: item.lat, lng: item.lng, count: 0, name: item.placeName || '' };
      }
      locationCount[key].count++;
    });

    // 반짝이 CSS 주입 (중복 방지)
    if (!document.getElementById('sparkle-style')) {
      const sparkleStyle = document.createElement('style');
      sparkleStyle.id = 'sparkle-style';
      sparkleStyle.textContent = `
        @keyframes sparkle-rotate { 0% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(90deg) scale(1.2); } 50% { transform: rotate(180deg) scale(0.9); } 75% { transform: rotate(270deg) scale(1.15); } 100% { transform: rotate(360deg) scale(1); } }
        @keyframes sparkle-fade { 0%, 100% { opacity: 0.9; } 50% { opacity: 0.4; } }
        @keyframes sparkle-orbit { 0% { transform: rotate(0deg) translateX(7px) rotate(0deg); opacity: 1; } 100% { transform: rotate(360deg) translateX(7px) rotate(-360deg); opacity: 0.6; } }
        .sparkle-core { animation: sparkle-rotate 2s ease-in-out infinite, sparkle-fade 1.5s ease-in-out infinite; }
        .sparkle-dot { animation: sparkle-orbit 2.5s linear infinite; }
        .sparkle-dot:nth-child(2) { animation-delay: -0.83s; }
        .sparkle-dot:nth-child(3) { animation-delay: -1.66s; }
      `;
      document.head.appendChild(sparkleStyle);
    }

    Object.values(locationCount).forEach(loc => {
      if (loc.count < 15) return;
      const sparkleEl = document.createElement('div');
      // 작은 크기로 마커 옆에 붙어있는 느낌
      sparkleEl.style.cssText = `
        width: 12px;
        height: 12px;
        position: relative;
        pointer-events: auto;
        cursor: pointer;
      `;
      sparkleEl.title = loc.name || '핫스팟';
      sparkleEl.innerHTML = `
        <div class="sparkle-core" style="
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          font-size: 9px; line-height: 1;
          filter: drop-shadow(0 0 3px rgba(255,220,80,1)) drop-shadow(0 0 6px rgba(255,180,0,0.8));
        ">✨</div>
        <div class="sparkle-dot" style="
          position: absolute; top: 50%; left: 50%; margin: -1.5px;
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,220,80,0.9);
          box-shadow: 0 0 3px rgba(255,220,80,0.8);
        "></div>
        <div class="sparkle-dot" style="
          position: absolute; top: 50%; left: 50%; margin: -1px;
          width: 2px; height: 2px; border-radius: 50%;
          background: rgba(255,160,0,0.8);
          box-shadow: 0 0 2px rgba(255,160,0,0.7);
          animation-delay: -0.83s;
        "></div>
        <div class="sparkle-dot" style="
          position: absolute; top: 50%; left: 50%; margin: -1px;
          width: 2px; height: 2px; border-radius: 50%;
          background: rgba(255,255,160,0.9);
          box-shadow: 0 0 2px rgba(255,255,160,0.8);
          animation-delay: -1.66s;
        "></div>
      `;
      // 마커 좌표에서 약간 오프셋 (lng +0.00003 정도 오른쪽 위로)
      const offsetLat = loc.lat + 0.000025;
      const offsetLng = loc.lng + 0.000030;
      const sparkleMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: offsetLat, lng: offsetLng },
        content: sparkleEl,
        zIndex: 998,
      });

      // 반짝이 클릭 시 해당 좌표의 더미 마커 데이터로 스포리 팝업 열기
      sparkleEl.addEventListener('click', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        // 해당 좌표에 있는 더미 마커 중 고정 장소명 있는 것 우선 선택
        const nearby = dummyDataRef.current.filter(item => {
          const dLat = Math.abs(item.lat - loc.lat);
          const dLng = Math.abs(item.lng - loc.lng);
          return dLat < 0.0002 && dLng < 0.0002;
        });
        const target = nearby.find(item => item.placeName) || nearby[0];
        if (!target) return;
        const center = userLocation || HONGDAE_CENTER;
        const distance = Math.round(
          google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(center.lat, center.lng),
            new google.maps.LatLng(target.lat, target.lng)
          )
        );
        // 반경 50m 내 마커 수 및 MBTI 분포 계산
        const NEARBY_RS = 0.0005;
        const nearbyAllS = dummyDataRef.current.filter(d =>
          Math.abs(d.lat - loc.lat) < NEARBY_RS && Math.abs(d.lng - loc.lng) < NEARBY_RS
        );
        const nearbyMbtiDistS: Record<string, number> = {};
        nearbyAllS.forEach(d => { nearbyMbtiDistS[d.mbti] = (nearbyMbtiDistS[d.mbti] || 0) + 1; });
        setSelectedMarker({ mbti: target.mbti, distance });
        setPopupAddress(null);
        setPlacePhotos([]);
        setLightboxIndex(null);
        setPopupPlaceName(target.placeName || null);
        setPopupData({
          mbti: target.mbti,
          mood: target.mood,
          mode: target.mode,
          sign: target.sign,
          distance,
          lat: target.lat,
          lng: target.lng,
          screenX: mouseEvent.clientX,
          screenY: mouseEvent.clientY,
          placeName: target.placeName,
          category: target.category,
          nearbyCount: nearbyAllS.length,
          nearbyMbtiDist: nearbyMbtiDistS,
        });
        // 역지오코딩
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: target.lat, lng: target.lng } }, (results, status) => {
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
        // Places API 사진 로딩
        setPhotoLoading(true);
        const placesService = new google.maps.places.PlacesService(mapRef.current!);
        const fetchPhotosByPlaceId = (placeId: string) => {
          placesService.getDetails(
            { placeId, fields: ['photos', 'name'] },
            (detail, detailStatus) => {
              if (detailStatus === google.maps.places.PlacesServiceStatus.OK && detail?.photos) {
                const photos: PlacePhoto[] = detail.photos.slice(0, 6).map(photo => ({
                  url: photo.getUrl({ maxWidth: 800, maxHeight: 600 }),
                  attribution: photo.html_attributions?.[0] ?? '',
                }));
                setPlacePhotos(photos);
                if (!target.placeName && detail.name) setPopupPlaceName(detail.name);
              }
              setPhotoLoading(false);
            }
          );
        };
        if (target.placeName) {
          placesService.findPlaceFromQuery(
            { query: target.placeName, fields: ['place_id'], locationBias: new google.maps.LatLng(target.lat, target.lng) },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results?.[0]?.place_id) {
                fetchPhotosByPlaceId(results[0].place_id!);
              } else {
                placesService.nearbySearch(
                  { location: { lat: target.lat, lng: target.lng }, radius: 150, type: 'establishment' },
                  (placeResults, placeStatus) => {
                    if (placeStatus === google.maps.places.PlacesServiceStatus.OK && placeResults?.length) {
                      const withPhotos = placeResults.filter(p => p.photos?.length);
                      const t = withPhotos[0] || placeResults[0];
                      if (t.place_id) fetchPhotosByPlaceId(t.place_id);
                      else setPhotoLoading(false);
                    } else { setPhotoLoading(false); }
                  }
                );
              }
            }
          );
        } else {
          placesService.nearbySearch(
            { location: { lat: target.lat, lng: target.lng }, radius: 150, type: 'establishment' },
            (placeResults, placeStatus) => {
              if (placeStatus === google.maps.places.PlacesServiceStatus.OK && placeResults?.length) {
                const withPhotos = placeResults.filter(p => p.photos?.length);
                const t = withPhotos[0] || placeResults[0];
                if (t.place_id) fetchPhotosByPlaceId(t.place_id);
                else setPhotoLoading(false);
              } else { setPhotoLoading(false); }
            }
          );
        }
        e.stopPropagation();
      });
    });

    // 도시별 텍스트 라벨 생성
    const { cities, cityStats } = aggregateCityData();
    const cityNames = cities.map(c => c.name);
    const hotspots = getHotspotCities(cityNames);
    setHotspotCityNames(hotspots);

    // HOTSPOT 폄스 애니메이션 CSS 주입 (중복 방지)
    if (!document.getElementById('hotspot-style')) {
      const style = document.createElement('style');
      style.id = 'hotspot-style';
      style.textContent = `
        @keyframes hotspot-pulse {
          0%, 100% { box-shadow: 0 0 20px #ff4500cc, 0 0 40px #ff4500aa, 0 0 60px #ff450066; transform: scale(1); }
          50% { box-shadow: 0 0 30px #ff6a00ff, 0 0 60px #ff4500cc, 0 0 90px #ff450099; transform: scale(1.04); }
        }
        @keyframes hotspot-badge-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.1); }
        }
        .hotspot-label {
          animation: hotspot-pulse 2s ease-in-out infinite;
        }
        .hotspot-badge {
          animation: hotspot-badge-pulse 1.5s ease-in-out infinite;
        }
        @keyframes banner-border-glow {
          0%, 100% { border-color: rgba(255,69,0,0.35); box-shadow: 0 1px 8px rgba(255,69,0,0.15); }
          50% { border-color: rgba(255,106,0,0.7); box-shadow: 0 1px 16px rgba(255,69,0,0.45); }
        }
        @keyframes fire-shake {
          0%, 100% { transform: rotate(-8deg) scale(1); }
          25% { transform: rotate(8deg) scale(1.15); }
          50% { transform: rotate(-5deg) scale(1.05); }
          75% { transform: rotate(6deg) scale(1.1); }
        }
        @keyframes rank-1-glow {
          0%, 100% { text-shadow: 0 0 6px #ffd70066, 0 0 12px #ffd70033; color: #ffd700; }
          50% { text-shadow: 0 0 14px #ffd700cc, 0 0 28px #ffd70088; color: #ffe84d; }
        }
        @keyframes banner-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hotspot-banner {
          animation: banner-border-glow 2.5s ease-in-out infinite;
        }
        .hotspot-fire {
          display: inline-block;
          animation: fire-shake 1.2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .hotspot-rank-1-city {
          animation: rank-1-glow 2s ease-in-out infinite;
          background: linear-gradient(90deg, #ffd700, #ffaa00, #ffd700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rank-1-glow 2s ease-in-out infinite, banner-shimmer 3s linear infinite;
        }
        .hotspot-rank-num {
          display: inline-block;
          animation: hotspot-badge-pulse 1.8s ease-in-out infinite;
        }
        @keyframes search-border-glow {
          0%, 100% { border-color: rgba(0,240,255,0.4); box-shadow: 0 0 10px rgba(0,240,255,0.2); }
          50% { border-color: rgba(0,240,255,0.85); box-shadow: 0 0 20px rgba(0,240,255,0.55), 0 0 36px rgba(0,240,255,0.2); }
        }
        @keyframes search-icon-bounce {
          0%, 100% { transform: rotate(-12deg) scale(1); }
          20% { transform: rotate(10deg) scale(1.18); }
          40% { transform: rotate(-8deg) scale(1.08); }
          60% { transform: rotate(7deg) scale(1.14); }
          80% { transform: rotate(-4deg) scale(1.04); }
        }
        .search-btn-glow {
          animation: search-border-glow 2.2s ease-in-out infinite;
        }
        .search-icon-anim {
          display: inline-block;
          animation: search-icon-bounce 1.8s ease-in-out infinite;
          transform-origin: center center;
        }
        @keyframes spot-border-glow {
          0%, 100% { border-color: rgba(255,0,255,0.45); box-shadow: 0 0 10px rgba(255,0,255,0.2); }
          50% { border-color: rgba(255,0,255,0.9); box-shadow: 0 0 22px rgba(255,0,255,0.6), 0 0 40px rgba(255,0,255,0.2); }
        }
        @keyframes spot-icon-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          20% { transform: translateY(-3px) scale(1.15); }
          40% { transform: translateY(1px) scale(0.95); }
          60% { transform: translateY(-2px) scale(1.1); }
          80% { transform: translateY(0.5px) scale(0.98); }
        }
        .spot-btn-glow {
          animation: spot-border-glow 2s ease-in-out infinite;
        }
        .spot-icon-anim {
          display: inline-block;
          animation: spot-icon-bounce 2s ease-in-out infinite;
          transform-origin: center bottom;
        }
      `;
      document.head.appendChild(style);
    }

    cities.forEach(city => {
      const stats = cityStats[city.name];
      if (!stats || Object.keys(stats).length === 0) return;

      const isHotspot = hotspots.includes(city.name);
      const labelElement = document.createElement('div');

      // 실제 마커 수 계산 (dummyData에서 해당 도시 반경 내 마커 수)
      const cityRadius = 0.25;
      const actualMarkerCount = dummyData.filter(m =>
        Math.abs(m.lat - city.lat) < cityRadius && Math.abs(m.lng - city.lng) < cityRadius
      ).length;

      if (isHotspot) {
        labelElement.className = 'hotspot-label';
        labelElement.style.cssText = `
          background: rgba(0,0,0,0.97);
          border: 2px solid #ff4500;
          border-radius: 8px;
          padding: 6px 10px;
          white-space: nowrap;
          pointer-events: auto;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s, transform 0.15s;
          position: relative;
          box-shadow: 0 0 12px rgba(255,69,0,0.5), inset 0 0 8px rgba(255,69,0,0.1);
        `;
        const sortedStats = Object.entries(stats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        labelElement.innerHTML = `
          <div style="display:flex;align-items:center;gap:3px;margin-bottom:3px;">
            <span style="font-size:11px;">&#x1F525;</span>
            <span style="font-size:11px;font-weight:900;color:#ff6a00;text-shadow:0 0 8px rgba(255,106,0,0.8);">핫플</span>
            <span style="font-size:10px;color:rgba(255,180,100,0.9);font-weight:700;"> ${actualMarkerCount}명</span>
          </div>
          <div style="font-size:11px;color:#ffcc66;font-weight:900;margin-bottom:2px;text-shadow:0 0 6px rgba(255,204,102,0.6);letter-spacing:0.5px;">${city.name}</div>
          ${sortedStats.map(([mbti, count]) =>
            `<div style="font-size:10px;color:${MBTI_COLORS[mbti]};line-height:1.5;font-weight:700;text-shadow:0 0 4px ${MBTI_COLORS[mbti]}66;">${mbti} <span style="opacity:0.85;font-weight:500;">(${count})</span></div>`
          ).join('')}
        `;
      } else {
        labelElement.style.cssText = `
          background: rgba(0,0,0,0.95);
          border: 1.5px solid rgba(0,240,255,0.6);
          border-radius: 6px;
          padding: 5px 8px;
          white-space: nowrap;
          pointer-events: auto;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s, transform 0.15s;
          box-shadow: 0 0 8px rgba(0,240,255,0.25);
        `;
        const sortedStats = Object.entries(stats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        labelElement.innerHTML = `
          <div style="font-size:11px;font-weight:900;color:#00f0ff;margin-bottom:3px;text-shadow:0 0 6px rgba(0,240,255,0.7);letter-spacing:0.5px;">${city.name} <span style="color:rgba(0,240,255,0.7);font-weight:600;font-size:10px;">(${actualMarkerCount})</span></div>
          ${sortedStats.map(([mbti, count]) =>
            `<div style="font-size:10px;color:${MBTI_COLORS[mbti]};line-height:1.6;font-weight:700;text-shadow:0 0 4px ${MBTI_COLORS[mbti]}55;">${mbti} <span style="opacity:0.85;font-weight:500;">(${count})</span></div>`
          ).join('')}
        `;
      }

      const cityLabel = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: city.lat, lng: city.lng },
        content: labelElement,
      });

      // 클러스터 클릭 시 부드러운 줌인 애니메이션
      labelElement.addEventListener('click', () => {
        const targetZoom = 14;
        const startZoom = map.getZoom() ?? 10;
        const startCenter = map.getCenter()!;
        const targetLat = city.lat;
        const targetLng = city.lng;
        const duration = 600; // ms
        const startTime = performance.now();
        // easeInOutCubic
        const ease = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
        const animate = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const e = ease(t);
          const curZoom = startZoom + (targetZoom - startZoom) * e;
          const curLat = startCenter.lat() + (targetLat - startCenter.lat()) * e;
          const curLng = startCenter.lng() + (targetLng - startCenter.lng()) * e;
          map.setZoom(curZoom);
          map.setCenter({ lat: curLat, lng: curLng });
          if (t < 1) requestAnimationFrame(animate);
          else {
            // 줌인 완료 후 핫플 도시면 팝업 자동 오픈
            if (isHotspot) {
              const hotIdx = hotspots.indexOf(city.name);
              if (hotIdx >= 0) {
                setSelectedHotplaceTab(hotIdx);
                setShowHotplacePopup(true);
              }
            }
          }
        };
        requestAnimationFrame(animate);
      });
      labelElement.addEventListener('mouseenter', () => {
        labelElement.style.transform = 'scale(1.06)';
      });
      labelElement.addEventListener('mouseleave', () => {
        labelElement.style.transform = 'scale(1)';
      });

      cityLabelsRef.current.push(cityLabel);
    });
  }, [userLocation, aggregateCityData, getHotspotCities]);

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
      const NEARBY_RR = 0.0005;
      const nearbyAllR = dummyDataRef.current.filter(d =>
        Math.abs(d.lat - spot.lat) < NEARBY_RR && Math.abs(d.lng - spot.lng) < NEARBY_RR
      );
      const nearbyMbtiDistR: Record<string, number> = {};
      nearbyAllR.forEach(d => { nearbyMbtiDistR[d.mbti] = (nearbyMbtiDistR[d.mbti] || 0) + 1; });
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
        screenX: me.clientX,
        screenY: me.clientY,
        nearbyCount: nearbyAllR.length,
        nearbyMbtiDist: nearbyMbtiDistR,
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
        <p className="text-sm text-gray-400">사람으로 공간을 탐험하다.</p>
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

      {/* 핫플레이스 팝업 모달 */}
      {/* 핫플레이스 bottom sheet - 배경 오버레이 없이 지도 위에 뜨우는 구조 */}
      {showHotplacePopup && hotspotCityNames.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <div
            ref={sheetRef}
            className="hotspot-banner w-full max-w-md rounded-t-2xl overflow-hidden"
            style={{
              background: 'rgba(4,4,18,0.96)',
              backdropFilter: 'blur(24px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
              border: '1.5px solid rgba(255,69,0,0.5)',
              borderBottom: 'none',
              boxShadow: '0 -8px 40px rgba(255,69,0,0.35)',
              maxHeight: '70vh',
              overflowY: 'auto',
              pointerEvents: 'auto',
              transform: `translateY(${sheetTranslateY}px)`,
              transition: swipeTouchStartY.current !== null ? 'none' : 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
            }}
            onTouchStart={(e) => {
              swipeTouchStartY.current = e.touches[0].clientY;
              swipeTranslateY.current = 0;
            }}
            onTouchMove={(e) => {
              if (swipeTouchStartY.current === null) return;
              const delta = e.touches[0].clientY - swipeTouchStartY.current;
              if (delta > 0) {
                swipeTranslateY.current = delta;
                setSheetTranslateY(delta);
              }
            }}
            onTouchEnd={() => {
              if (swipeTranslateY.current > 80) {
                setSheetTranslateY(600);
                setTimeout(() => {
                  setShowHotplacePopup(false);
                  setSheetTranslateY(0);
                }, 280);
              } else {
                setSheetTranslateY(0);
              }
              swipeTouchStartY.current = null;
              swipeTranslateY.current = 0;
            }}
          >
            {/* 드래그 핸들 */}
            <div
              style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '4px', cursor: 'grab' }}
              onTouchStart={(e) => {
                swipeTouchStartY.current = e.touches[0].clientY;
                swipeTranslateY.current = 0;
              }}
            >
              <div style={{
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.2)',
              }} />
            </div>
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,69,0,0.2)' }}>
              <div className="flex items-center gap-2">
                <span className="hotspot-fire" style={{ fontSize: '20px' }}>🔥</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#ff6a00', textShadow: '0 0 10px #ff450099', letterSpacing: '1px' }}>핫플레이스 TOP3</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,150,80,0.7)', marginTop: '1px' }}>지금 가장 핫한 골목 큐레이션</div>
                </div>
              </div>
              <button
                onClick={() => setShowHotplacePopup(false)}
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >✕</button>
            </div>

            {/* 탭 */}
            <div className="flex" style={{ borderBottom: '1px solid rgba(255,69,0,0.15)' }}>
              {hotspotCityNames.map((city, idx) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedHotplaceTab(idx);
                    // 탭 전환 시 지도를 해당 도시 좌표로 자동 이동
                    const cityCoords: Record<string, { lat: number; lng: number }> = {
                      '홍대': { lat: 37.5563, lng: 126.9236 },
                      '강남': { lat: 37.5172, lng: 127.0473 },
                      '여의도': { lat: 37.5219, lng: 126.9245 },
                      '성수': { lat: 37.5445, lng: 127.0557 },
                      '명동': { lat: 37.5636, lng: 126.9827 },
                      '부산': { lat: 35.1587, lng: 129.1603 },
                      '대구': { lat: 35.8714, lng: 128.6014 },
                      '인천': { lat: 37.4563, lng: 126.7052 },
                      '광주': { lat: 35.1595, lng: 126.8526 },
                      '대전': { lat: 36.3504, lng: 127.3845 },
                      '울산': { lat: 35.5384, lng: 129.3114 },
                      '수원': { lat: 37.2636, lng: 127.0286 },
                      '고양': { lat: 37.6584, lng: 126.8320 },
                      '제주시': { lat: 33.4890, lng: 126.4983 },
                    };
                    const coords = cityCoords[hotspotCityNames[idx]];
                    if (coords && mapRef.current) {
                      mapRef.current.panTo(coords);
                      mapRef.current.setZoom(14);
                    }
                  }}
                  className="flex-1 py-3 text-center transition-all"
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: selectedHotplaceTab === idx
                      ? (idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : '#cd7f32')
                      : 'rgba(255,255,255,0.35)',
                    borderBottom: selectedHotplaceTab === idx
                      ? `2px solid ${idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : '#cd7f32'}`
                      : '2px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    textShadow: selectedHotplaceTab === idx
                      ? `0 0 8px ${idx === 0 ? '#ffd700aa' : idx === 1 ? '#c0c0c088' : '#cd7f3288'}`
                      : 'none',
                  }}
                >
                  <span className={selectedHotplaceTab === idx && idx === 0 ? 'hotspot-rank-1-city' : ''}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {city}
                  </span>
                </button>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            {(() => {
              const city = hotspotCityNames[selectedHotplaceTab];
              const venue = HOTPLACE_DATA[city] || {
                name: `${city} 추천 핫플`,
                category: '📍 로컬 명소',
                address: `${city} 중심부`,
                description: `${city}에서 지금 가장 주목받는 공간입니다.`,
                stats: [
                  { icon: '🧠', text: `${city}에서 다양한 MBTI 유형이 모여요` },
                  { icon: '🔥', text: '주말 저녁 방문 추천' },
                  { icon: '📅', text: '최근 SNS에서 급부상 중인 장소' },
                ],
              };
              const rankColor = selectedHotplaceTab === 0 ? '#ffd700' : selectedHotplaceTab === 1 ? '#c0c0c0' : '#cd7f32';
              return (
                <div className="px-5 py-4">
                  {/* 장소 헤더 */}
                  <div className="mb-4">
                    <div style={{ fontSize: '11px', color: rankColor, fontWeight: 700, marginBottom: '4px', letterSpacing: '0.5px' }}>
                      {venue.category}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '4px', textShadow: `0 0 12px ${rankColor}55` }}>
                      {venue.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
                      📍 {venue.address}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,180,100,0.85)', lineHeight: 1.6, padding: '10px 12px', background: 'rgba(255,69,0,0.08)', borderRadius: '8px', border: '1px solid rgba(255,69,0,0.15)' }}>
                      {venue.description}
                    </div>
                  </div>

                  {/* SPOT 통계 */}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,150,80,0.8)', marginBottom: '10px', letterSpacing: '0.5px' }}>
                    ✦ SPOT 통계
                  </div>
                  <div className="flex flex-col gap-2">
                    {venue.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                        style={{
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,69,0,0.12)',
                        }}
                      >
                        <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{stat.icon}</span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{stat.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* 하단 여백 */}
                  <div style={{ height: '16px' }} />
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 지도 */}
      <div className="flex-1 relative">
        <MapView
          className="w-full h-full"
          initialCenter={userLocation || HONGDAE_CENTER}
          initialZoom={13}
          onMapReady={handleMapReady}
        />

        {/* 내 위치로 돌아가기 버튼 + 내 스팟 등록 버튼 (세로 배치) */}
        <div className="absolute bottom-24 left-4 flex flex-col items-center gap-3">
          {/* 핫플레이스 CTA 버튼 - 내 스팟 등록 버튼 위에 */}
          {hotspotCityNames.length > 0 && (
            <button
              onClick={() => { setSelectedHotplaceTab(0); setShowHotplacePopup(true); }}
              className="hotspot-banner bg-black/95 backdrop-blur-lg border-2 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform"
              style={{
                borderColor: 'rgba(255,69,0,0.7)',
                boxShadow: '0 0 18px rgba(255,69,0,0.55)',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <span className="hotspot-fire" style={{ fontSize: '18px', lineHeight: 1 }}>🔥</span>
            </button>
          )}

          {/* 내 스팟 등록 CTA 버튼 - 내 위치 찾기 버튼 위에 */}
          {!spotSubmitted && (
            <button
              onClick={() => setShowSpotForm(true)}
              className="bg-black/95 backdrop-blur-lg border-2 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform spot-btn-glow"
              style={{
                borderColor: 'rgba(255,0,255,0.7)',
                boxShadow: '0 0 14px rgba(255,0,255,0.45)',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              {/* 아바타 핀 아이콘: 사람 실루얣 + 위치 핀 조합 */}
              <span className="spot-icon-anim" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 머리 */}
                <circle cx="12" cy="6" r="3" fill="#ff00ff" opacity="0.9"/>
                {/* 몸통 */}
                <path d="M7 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="#ff00ff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9"/>
                {/* 핀 꼬리 */}
                <path d="M12 19 L12 22" stroke="#ff00ff" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
                {/* 핀 원 */}
                <circle cx="12" cy="19" r="1.5" fill="#ff00ff" opacity="0.85"/>
                {/* 발광 효과용 외곽 */}
                <circle cx="12" cy="6" r="3" stroke="#ff00ff" strokeWidth="0.5" opacity="0.4"/>
              </svg>
              </span>
            </button>
          )}

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
            className="bg-black/95 backdrop-blur-lg border-2 border-cyan-500/50 rounded-full p-2 shadow-2xl hover:scale-110 transition-transform"
            style={{
              boxShadow: "0 0 14px rgba(0, 240, 255, 0.5)",
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
          </button>
        </div>

        {/* 우측 하단 돋보기 검색 버튼 */}
        <div className="absolute bottom-24 right-4 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              setShowSearch(prev => !prev);
              setSearchQuery('');
              setSearchResults([]);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className={`bg-black/95 backdrop-blur-lg border-2 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform ${!showSearch ? 'search-btn-glow' : ''}`}
            style={{
              borderColor: showSearch ? 'rgba(0,240,255,0.95)' : undefined,
              boxShadow: showSearch ? '0 0 22px rgba(0,240,255,0.75)' : undefined,
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <span className={!showSearch ? 'search-icon-anim' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </button>
        </div>

        {/* 검색 패널 - 말풍선 모양 */}
        {showSearch && (
          <div
            className="absolute z-50"
            style={{
              bottom: '72px', // 돋보기 버튼 바로 위
              right: '4px',
              width: '240px',
            }}
          >
            {/* 말풍선 꼬리 - 우측 하단 */}
            <div style={{
              position: 'absolute',
              bottom: '-9px',
              right: '14px',
              width: 0,
              height: 0,
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderTop: '10px solid rgba(0,240,255,0.6)',
              zIndex: 2,
            }} />
            {/* 꼬리 내부 (배경색 채우기) */}
            <div style={{
              position: 'absolute',
              bottom: '-7px',
              right: '15px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '9px solid rgba(4,4,14,0.97)',
              zIndex: 3,
            }} />
            <div
              style={{
                background: 'rgba(4,4,14,0.97)',
                border: '1.5px solid rgba(0,240,255,0.6)',
                borderRadius: '14px',
                boxShadow: '0 0 28px rgba(0,240,255,0.3), 0 4px 20px rgba(0,0,0,0.6)',
                overflow: 'hidden',
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(0,240,255,0.15)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,240,255,0.6)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    if (!q.trim() || q.trim().length < 2) {
                      setSearchResults([]);
                      return;
                    }
                    if (!mapRef.current) return;
                    setSearchLoading(true);
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode(
                      { address: q + ' 한국', region: 'KR' },
                      (results, status) => {
                        setSearchLoading(false);
                        if (status === 'OK' && results && results.length > 0) {
                          const items = results.slice(0, 5).map(r => ({
                            name: r.formatted_address.replace(', 대한민국', '').replace('대한민국 ', ''),
                            lat: r.geometry.location.lat(),
                            lng: r.geometry.location.lng(),
                          }));
                          setSearchResults(items);
                        } else {
                          setSearchResults([]);
                        }
                      }
                    );
                  }}
                  placeholder="지역 검색 (예: 홍대, 강남)"
                  className="flex-1 outline-none text-xs bg-transparent"
                  style={{ color: '#00f0ff' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="text-gray-600 hover:text-gray-300 transition-colors text-xs leading-none flex-shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchLoading && (
                <div className="px-3 py-3 text-center text-[11px]" style={{ color: 'rgba(0,240,255,0.5)' }}>검색 중...</div>
              )}
              {!searchLoading && searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-3 py-2.5 text-xs transition-all"
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        borderBottom: idx < searchResults.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        background: 'transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,240,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => {
                        if (mapRef.current) {
                          mapRef.current.panTo({ lat: result.lat, lng: result.lng });
                          mapRef.current.setZoom(14);
                          toast.success(`📍 ${result.name}`, { duration: 2000 });
                          setShowSearch(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,240,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
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
              {!searchQuery && (
                <div className="px-3 py-3 text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>지역명을 입력하세요</div>
              )}
            </div>
          </div>
        )}

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
        const PW = 260;
        const PH = 220; // 대략적 높이
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

                {/* 3가지 성향 그리드 (MOOD/MODE/SIGN) */}
                <div className="p-2 flex flex-col gap-1.5">
                  {/* 상단 행: MOOD + MODE */}
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
                      {popupData.sign}
                    </div>
                  </div>

                  {/* 이 장소 인원 & MBTI 분포 */}
                  {popupData.nearbyCount !== undefined && popupData.nearbyCount > 0 && (
                    <div
                      className="rounded-xl p-2"
                      style={{
                        background: `${MBTI_COLORS[popupData.mbti]}0d`,
                        border: `1px solid ${MBTI_COLORS[popupData.mbti]}33`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[9px] font-bold tracking-widest" style={{ color: MBTI_COLORS[popupData.mbti] }}>👥 이 장소</div>
                        <div
                          className="text-[11px] font-black"
                          style={{
                            color: MBTI_COLORS[popupData.mbti],
                            textShadow: `0 0 8px ${MBTI_COLORS[popupData.mbti]}88`,
                          }}
                        >
                          {popupData.nearbyCount}명
                        </div>
                      </div>
                      {popupData.nearbyMbtiDist && (
                        <div className="flex flex-col gap-1">
                          {Object.entries(popupData.nearbyMbtiDist)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 4)
                            .map(([mbti, count]) => {
                              const pct = Math.round((count / popupData.nearbyCount!) * 100);
                              const color = MBTI_COLORS[mbti] || '#00f0ff';
                              return (
                                <div key={mbti} className="flex items-center gap-1.5">
                                  <div className="text-[9px] font-bold flex-shrink-0" style={{ color, width: '30px' }}>{mbti}</div>
                                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
                                    <div
                                      style={{
                                        width: `${pct}%`,
                                        height: '100%',
                                        background: color,
                                        borderRadius: '9999px',
                                        boxShadow: `0 0 4px ${color}88`,
                                        transition: 'width 0.5s ease',
                                      }}
                                    />
                                  </div>
                                  <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)', width: '22px', textAlign: 'right' }}>{pct}%</div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 사진 갤러리 */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${MBTI_COLORS[popupData.mbti]}33`,
                    }}
                  >
                    {/* 헤더 - 장소명 + 사진 수 */}
                    <div className="flex items-center justify-between px-2 py-1.5"
                      style={{ borderBottom: `1px solid ${MBTI_COLORS[popupData.mbti]}22` }}
                    >
                      <div className="flex flex-col gap-0 min-w-0 flex-1">
                        <div className="text-[9px] font-bold tracking-widest" style={{ color: MBTI_COLORS[popupData.mbti] }}>
                          ✨ SPOTLIGHT
                        </div>
                        {popupPlaceName && (
                          <div className="text-[9px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.55)', marginTop: '1px' }}>
                            {popupPlaceName}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {placePhotos.length > 0 && (
                          <div className="text-[8px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {placePhotos.length}장
                          </div>
                        )}

                      </div>
                    </div>

                    {/* 사진 콘텐츠 */}
                    {photoLoading ? (
                      // 로딩 스켈레톤
                      <div className="flex gap-1.5 p-2 overflow-x-auto">
                        {[0,1,2].map(i => (
                          <div
                            key={i}
                            className="flex-shrink-0 rounded-lg"
                            style={{
                              width: '72px',
                              height: '72px',
                              background: `linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)`,
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s infinite',
                            }}
                          />
                        ))}
                      </div>
                    ) : placePhotos.length > 0 ? (
                      // 사진 스트립
                      <div
                        className="flex gap-1.5 p-2 overflow-x-auto"
                        style={{ scrollbarWidth: 'none' }}
                      >
                        {placePhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                            style={{
                              width: '72px',
                              height: '72px',
                              border: `1.5px solid ${MBTI_COLORS[popupData.mbti]}44`,
                              transition: 'all 0.2s',
                              boxShadow: `0 2px 8px rgba(0,0,0,0.5)`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxIndex(idx);
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.border = `1.5px solid ${MBTI_COLORS[popupData.mbti]}cc`;
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.border = `1.5px solid ${MBTI_COLORS[popupData.mbti]}44`;
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                            }}
                          >
                            <img
                              src={photo.url}
                              alt={`장소 사진 ${idx + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      // 사진 없음 - 카테고리별 폴백 이미지
                      (() => {
                        const cat = popupData.category ?? 'landmark';
                        const fallbackImages: Record<string, string[]> = {
                          // 카페 - 한국 스타일 카페 느낌의 이미지
                          cafe: [
                            'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=300&fit=crop',
                          ],
                          // 식당 - 한국 식당/포장마사 느낌
                          restaurant: [
                            'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
                          ],
                          // 공원 - 한국 공원/한강 느낌
                          park: [
                            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop',
                          ],
                          // 해변 - 한국 해수웕/해변 느낌
                          beach: [
                            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&h=300&fit=crop&q=80',
                          ],
                          // 자연 - 산/자연경관 (한라산/설악산 느낌)
                          nature: [
                            'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
                          ],
                          // 시장 - 재래시장/야시장 느낌
                          market: [
                            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
                          ],
                          // 술집 - 네온 간판 한국 술집 골목 느낌
                          bar: [
                            'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1543007631-283050bb3e8c?w=400&h=300&fit=crop',
                          ],
                          // 랜드마크 - 한국 구도시/거리 느낌
                          landmark: [
                            'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
                          ],
                          // 문화 - 갔러리/문화공간 느낌
                          culture: [
                            'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=300&fit=crop',
                          ],
                          // 스포츠 - 피트니스/스포츠시설 느낌
                          sports: [
                            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
                          ],
                        };
                        const imgs = fallbackImages[cat] ?? fallbackImages['landmark'];
                        return (
                          <div>
                            <div className="flex gap-1.5 p-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                              {imgs.map((src, idx) => (
                                <div
                                  key={idx}
                                  className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer relative"
                                  style={{
                                    width: '72px', height: '72px',
                                    border: `1.5px solid ${MBTI_COLORS[popupData.mbti]}33`,
                                    opacity: 0.7,
                                  }}
                                  onClick={e => { e.stopPropagation(); setLightboxIndex(idx); setPlacePhotos(imgs.map(u => ({ url: u, attribution: '' }))); }}
                                >
                                  <img src={src} alt={`참고 사진 ${idx+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                </div>
                              ))}
                            </div>
                            <div className="text-center pb-1.5" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '8px' }}>
                              참고 이미지 · 실제 장소와 다를 수 있어요
                            </div>
                          </div>
                        );
                      })()
                    )}
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

      {/* 라이트박스 모달 */}
      {lightboxIndex !== null && placePhotos.length > 0 && popupData && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* 이전 버튼 */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
              style={{
                width: '40px', height: '40px',
                background: 'rgba(255,255,255,0.12)',
                border: `1.5px solid ${MBTI_COLORS[popupData.mbti]}66`,
                borderRadius: '50%',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => i !== null ? Math.max(0, i - 1) : 0); }}
            >‹</button>
          )}

          {/* 메인 이미지 */}
          <div
            className="relative flex flex-col items-center"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '80vh' }}
          >
            <img
              src={placePhotos[lightboxIndex].url}
              alt="장소 사진"
              style={{
                maxWidth: '90vw',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '12px',
                border: `2px solid ${MBTI_COLORS[popupData.mbti]}88`,
                boxShadow: `0 0 40px ${MBTI_COLORS[popupData.mbti]}44`,
              }}
            />
            {/* 뎷 인디케이터 */}
            <div className="flex gap-2 mt-4">
              {placePhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    width: i === lightboxIndex ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === lightboxIndex ? MBTI_COLORS[popupData.mbti] : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: i === lightboxIndex ? `0 0 8px ${MBTI_COLORS[popupData.mbti]}` : 'none',
                  }}
                />
              ))}
            </div>
            {/* 닫기 버튼 */}
            <button
              className="absolute top-2 right-2"
              style={{
                width: '28px', height: '28px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onClick={() => setLightboxIndex(null)}
            >✕</button>
          </div>

          {/* 다음 버튼 */}
          {lightboxIndex < placePhotos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
              style={{
                width: '40px', height: '40px',
                background: 'rgba(255,255,255,0.12)',
                border: `1.5px solid ${MBTI_COLORS[popupData.mbti]}66`,
                borderRadius: '50%',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => i !== null ? Math.min(placePhotos.length - 1, i + 1) : 0); }}
            >›</button>
          )}
        </div>
      )}

      {/* 스팝 입력 팝업 (11초 후) */}
      {showSpotForm && !spotSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: 'rgba(0,0,0,0.7)'}}>
          <div
            style={{
              background: 'rgba(4, 4, 14, 0.98)',
              border: '2px solid rgba(0, 240, 255, 0.5)',
              borderRadius: '20px',
              padding: '20px 20px',
              width: '320px',
              maxWidth: '90vw',
              maxHeight: '88vh',
              overflowY: 'auto',
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
              사용자님의 MBTI를<br />
              지도 위에 표시해봐요!!
            </p>

            {/* MBTI - 자동완성 드롭다운 */}
            {/* MBTI - 16개 카드 그리드 선택 UI */}
            <div className="mb-4">
              <label className="block text-center text-xs font-bold mb-2" style={{color: '#00f0ff', letterSpacing: '0.15em'}}>#TYPE (MBTI)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {MBTI_TYPES.map((type) => {
                  const isSelected = spotFormData.mbti === type;
                  const color = MBTI_COLORS[type] || '#00f0ff';
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSpotFormData(p => ({...p, mbti: p.mbti === type ? '' : type}))}
                      className="rounded-lg py-2.5 text-center transition-all"
                      style={{
                        background: isSelected ? `${color}22` : 'rgba(255,255,255,0.04)',
                        border: isSelected ? `2px solid ${color}` : '1.5px solid rgba(255,255,255,0.12)',
                        color: isSelected ? color : 'rgba(255,255,255,0.45)',
                        fontSize: '11px',
                        fontWeight: isSelected ? 900 : 600,
                        letterSpacing: '0.03em',
                        boxShadow: isSelected ? `0 0 8px ${color}55` : 'none',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
              {spotFormData.mbti && (
                <div className="text-center text-[11px] mt-2 font-bold" style={{color: MBTI_COLORS[spotFormData.mbti] || '#00f0ff'}}>
                  ✓ {spotFormData.mbti} 선택됨
                </div>
              )}
            </div>

            {/* MOOD */}
            <div className="mb-4">
              <label className="block text-center text-xs font-bold mb-2" style={{color: '#c77dff', letterSpacing: '0.15em'}}>#MOOD</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['HAPPY', 'CHILL', 'EXCITED', 'LONELY', 'HYPED', 'PEACEFUL', 'CURIOUS', 'ENERGETIC'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSpotFormData(p => ({...p, mood: p.mood === m ? '' : m}))}
                    className="rounded-lg py-2 text-center transition-all"
                    style={{
                      background: spotFormData.mood === m ? 'rgba(199,125,255,0.22)' : 'rgba(199,125,255,0.05)',
                      border: spotFormData.mood === m ? '1.5px solid rgba(199,125,255,0.9)' : '1.5px solid rgba(199,125,255,0.25)',
                      color: spotFormData.mood === m ? '#c77dff' : 'rgba(199,125,255,0.5)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}
                  >{m}</button>
                ))}
              </div>
            </div>

            {/* MODE */}
            <div className="mb-4">
              <label className="block text-center text-xs font-bold mb-2" style={{color: '#00f0b4', letterSpacing: '0.15em'}}>#MODE</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['산책 중', '카페 탐방', '쇼핑 중', '맛집 투어', '혼자만의 시간', '친구 만남', '데이트', '야경 구경'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSpotFormData(p => ({...p, mode: p.mode === m ? '' : m}))}
                    className="rounded-lg py-2 text-center transition-all"
                    style={{
                      background: spotFormData.mode === m ? 'rgba(0,240,180,0.18)' : 'rgba(0,240,180,0.05)',
                      border: spotFormData.mode === m ? '1.5px solid rgba(0,240,180,0.9)' : '1.5px solid rgba(0,240,180,0.25)',
                      color: spotFormData.mode === m ? '#00f0b4' : 'rgba(0,240,180,0.5)',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >{m}</button>
                ))}
              </div>
            </div>

            {/* SIGN */}
            <div className="mb-6">
              <label className="block text-center text-xs font-bold mb-2" style={{color: '#ffc800', letterSpacing: '0.15em'}}>#SIGN</label>
              {/* 시그널 선택 그리드 */}
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {SIGN_SIGNALS.map((sig) => {
                  const isDirectInput = sig.text === '직접 입력';
                  const signedValue = `${sig.emoji} ${sig.text}`;
                  const isSelected = isDirectInput
                    ? !SIGN_SIGNALS.slice(1).some(s => `${s.emoji} ${s.text}` === spotFormData.sign) && spotFormData.sign !== '' && spotFormData.sign !== '__direct__'
                    : spotFormData.sign === signedValue;
                  const isDirectInputMode = spotFormData.sign === '__direct__' || (!SIGN_SIGNALS.slice(1).some(s => `${s.emoji} ${s.text}` === spotFormData.sign) && spotFormData.sign !== '' && spotFormData.sign !== '__direct__');
                  return (
                    <button
                      key={sig.text}
                      type="button"
                      onClick={() => {
                        if (isDirectInput) {
                          setSpotFormData(p => ({...p, sign: '__direct__'}));
                        } else {
                          // 이모지+텍스트 형식으로 저장 (더미 데이터와 동일)
                          setSpotFormData(p => ({...p, sign: `${sig.emoji} ${sig.text}`}));
                        }
                      }}
                      className="rounded-lg px-2 py-2 text-center transition-all flex items-center justify-center gap-1.5"
                      style={{
                        background: isDirectInput
                          ? (isDirectInputMode ? 'rgba(255,200,0,0.2)' : 'rgba(255,200,0,0.05)')
                          : (isSelected ? 'rgba(255,200,0,0.2)' : 'rgba(255,200,0,0.05)'),
                        border: isDirectInput
                          ? (isDirectInputMode ? '1.5px solid rgba(255,200,0,0.8)' : '1.5px solid rgba(255,200,0,0.25)')
                          : (isSelected ? '1.5px solid rgba(255,200,0,0.8)' : '1.5px solid rgba(255,200,0,0.25)'),
                        color: isDirectInput
                          ? (isDirectInputMode ? '#ffc800' : 'rgba(255,200,0,0.5)')
                          : (isSelected ? '#ffc800' : 'rgba(255,200,0,0.5)'),
                        fontSize: '10px',
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{sig.emoji}</span>
                      <span style={{ fontSize: '10px' }}>{sig.text}</span>
                    </button>
                  );
                })}
              </div>
              {/* 직접 입력 모드일 때 텍스트 입력창 표시 */}
              {spotFormData.sign === '__direct__' && (
                <input
                  type="text"
                  value=""
                  onChange={e => setSpotFormData(p => ({...p, sign: e.target.value || '__direct__'}))}
                  placeholder="직접 입력해주세요"
                  maxLength={64}
                  autoFocus
                  className="w-full text-center rounded-lg px-3 py-2 text-sm font-bold outline-none"
                  style={{
                    background: 'rgba(255, 200, 0, 0.07)',
                    border: '1.5px solid rgba(255, 200, 0, 0.6)',
                    color: '#ffc800',
                  }}
                />
              )}
              {/* 직접 입력 후 텍스트가 있을 때 (프리셋이 아닌 값) */}
              {spotFormData.sign !== '' && spotFormData.sign !== '__direct__' && !SIGN_SIGNALS.slice(1).some(s => `${s.emoji} ${s.text}` === spotFormData.sign) && (
                <input
                  type="text"
                  value={spotFormData.sign}
                  onChange={e => setSpotFormData(p => ({...p, sign: e.target.value || '__direct__'}))}
                  placeholder="직접 입력해주세요"
                  maxLength={64}
                  autoFocus
                  className="w-full text-center rounded-lg px-3 py-2 text-sm font-bold outline-none"
                  style={{
                    background: 'rgba(255, 200, 0, 0.07)',
                    border: '1.5px solid rgba(255, 200, 0, 0.6)',
                    color: '#ffc800',
                  }}
                />
              )}
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
                  const { mbti, mood, mode } = spotFormData;
                  // __direct__ 상태(직접 입력 선택했지만 아직 입력 안 한 경우) 처리
                  const sign = spotFormData.sign === '__direct__' ? '' : spotFormData.sign;
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
              GPS를 켜주세요!
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
                정확한 좌표는 어디에도 공개하지 않습니다.
                <br />
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
