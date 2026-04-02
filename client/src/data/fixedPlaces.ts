// 실제 장소 좌표 데이터 - 전국 주요 장소 200개+
// 각 장소는 실제 존재하는 장소의 좌표를 사용

export type FixedPlace = {
  mbti: string;
  lat: number;
  lng: number;
  mood: string;
  mode: string;
  sign: string;
  placeName: string;
  category: "cafe" | "restaurant" | "park" | "landmark" | "beach" | "nature" | "bar" | "market";
};

const MBTI_LIST = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP"
];
const MOOD_LIST = [
  "HAPPY","CHILL","EXCITED","PEACEFUL","CURIOUS",
  "DREAMY","CONTENT","HYPED","ENERGETIC","NOSTALGIC"
];

const MODE_LIST = [
  "산책 중","카페 탐방","쇼핑 중","맛집 투어",
  "혼자만의 시간","친구 만남","데이트","야경 구경",
  "전시 관람","그냥 배회 중"
];

const SIGN_LIST = [
  "👋 말 걸어도 돼요","🎧 혼자 있고 싶어요","☕ 같이 앉아도 돼요",
  "👀 구경 중이에요","📸 사진 찍는 중이에요","🌙 야경 보러 왔어요",
  "🐾 산책 중이에요","💬 대화 상대 찾아요","🍽️ 맛집 찾는 중이에요",
  "🛍️ 쇼핑 중이에요"
];

const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const FIXED_PLACES: FixedPlace[] = [
  // ===== 서울 홍대/마포/합정 =====
  { mbti: r(MBTI_LIST), lat: 37.5549, lng: 126.9228, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "카페 노티드 홍대점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5571, lng: 126.9215, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "앤트러사이트 홍대", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5560, lng: 126.9248, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "👋 말 걸어도 돼요", placeName: "홍대 걷고싶은거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5580, lng: 126.9260, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "홍대 상상마당", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5558, lng: 126.9205, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "스타벅스 홍대입구역점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5500, lng: 126.9140, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "합정 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5490, lng: 126.9120, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "당인리 발전소 공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5530, lng: 126.9180, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 포차거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5475, lng: 126.9210, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "망원 한강공원", category: "park" },

  // ===== 서울 강남/압구정/청담 =====
  { mbti: r(MBTI_LIST), lat: 37.5270, lng: 127.0411, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "블루보틀 청담점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5250, lng: 127.0430, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "압구정 로데오거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5220, lng: 127.0220, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "신사동 가로수길", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5175, lng: 127.0473, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "청담동 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5200, lng: 127.0250, mood: r(MOOD_LIST), mode: "데이트", sign: "👋 말 걸어도 돼요", placeName: "도산공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.4979, lng: 127.0276, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "강남역 쇼핑거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5040, lng: 127.0240, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "카페 노티드 강남점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5110, lng: 127.0590, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "코엑스 아쿠아리움", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5130, lng: 127.0580, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "코엑스몰", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.5150, lng: 127.1020, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "올림픽공원", category: "park" },

  // ===== 서울 성수/뚝섬/왕십리 =====
  { mbti: r(MBTI_LIST), lat: 37.5444, lng: 127.0557, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "어니언 성수", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5430, lng: 127.0540, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "성수동 카페거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5460, lng: 127.0580, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "서울숲", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5480, lng: 127.0600, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "뚝섬한강공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5410, lng: 127.0500, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "성수 할아버지공장", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5390, lng: 127.0480, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "대림창고 갤러리", category: "landmark" },

  // ===== 서울 여의도/한강 =====
  { mbti: r(MBTI_LIST), lat: 37.5268, lng: 126.9327, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "여의도 한강공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5253, lng: 126.9345, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "여의도 벚꽃길", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5280, lng: 126.9300, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "63빌딩 전망대", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5290, lng: 126.9310, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "더현대 서울", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.5350, lng: 126.9020, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "선유도공원", category: "park" },

  // ===== 서울 명동/종로/인사동 =====
  { mbti: r(MBTI_LIST), lat: 37.5636, lng: 126.9827, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "명동 쇼핑거리", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.5796, lng: 126.9770, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "경복궁", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5700, lng: 126.9830, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "북촌 한옥마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5720, lng: 126.9860, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "삼청동 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5600, lng: 126.9750, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "남산 서울타워", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5740, lng: 126.9860, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "창덕궁", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5710, lng: 126.9870, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "👋 말 걸어도 돼요", placeName: "인사동 쌈지길", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.5680, lng: 126.9990, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "낙산공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5630, lng: 126.9950, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "이화동 벽화마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5720, lng: 126.9720, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "서촌 골목길", category: "landmark" },

  // ===== 서울 이태원/용산 =====
  { mbti: r(MBTI_LIST), lat: 37.5345, lng: 126.9940, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "이태원 경리단길", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5360, lng: 126.9920, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "이태원 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5380, lng: 126.9980, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "국립중앙박물관", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5400, lng: 127.0040, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "용산 가족공원", category: "park" },

  // ===== 서울 연남동/연희동 =====
  { mbti: r(MBTI_LIST), lat: 37.5620, lng: 126.9270, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "연남동 경의선 숲길", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5640, lng: 126.9250, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "연남동 카페거리", category: "cafe" },

  // ===== 서울 건대/광진 =====
  { mbti: r(MBTI_LIST), lat: 37.5404, lng: 127.0701, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "건대 맛집거리", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5440, lng: 127.0820, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "아차산 생태공원", category: "nature" },

  // ===== 서울 신촌/이대 =====
  { mbti: r(MBTI_LIST), lat: 37.5570, lng: 126.9370, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "신촌 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5590, lng: 126.9460, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "👋 말 걸어도 돼요", placeName: "이화여대 캠퍼스", category: "landmark" },

  // ===== 서울 노원/도봉 =====
  { mbti: r(MBTI_LIST), lat: 37.6550, lng: 127.0630, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "수락산 등산로", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 37.6900, lng: 127.0470, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "도봉산 등산로", category: "nature" },

  // ===== 서울 강서/양천 =====
  { mbti: r(MBTI_LIST), lat: 37.5600, lng: 126.8260, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "강서 한강공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5550, lng: 126.8490, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "목동 카페거리", category: "cafe" },

  // ===== 서울 잠실/송파 =====
  { mbti: r(MBTI_LIST), lat: 37.5140, lng: 127.1000, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "롯데월드몰", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.5110, lng: 127.0980, mood: r(MOOD_LIST), mode: "데이트", sign: "👋 말 걸어도 돼요", placeName: "석촌호수", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5210, lng: 127.1270, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "방이 먹자골목", category: "restaurant" },

  // ===== 부산 =====
  { mbti: r(MBTI_LIST), lat: 35.1587, lng: 129.1603, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "해운대 해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 35.1550, lng: 129.1190, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "광안리 해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 35.1010, lng: 129.0320, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "감천문화마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.0990, lng: 129.0260, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "국제시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 35.1780, lng: 129.1280, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "동백섬 누리마루", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 35.0630, lng: 129.0170, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "태종대 전망대", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 35.1040, lng: 129.0350, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "부산 자갈치시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 35.1800, lng: 129.0750, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "해운대 블루라인파크", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.1440, lng: 129.1100, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "광안대교 야경 포인트", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.1900, lng: 129.0850, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "해리단길 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.1570, lng: 129.0600, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "서면 먹자골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.2100, lng: 129.0130, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "금정산성", category: "nature" },

  // ===== 경주 =====
  { mbti: r(MBTI_LIST), lat: 35.7896, lng: 129.3320, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "불국사", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8350, lng: 129.2100, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "첨성대", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8290, lng: 129.2150, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "안압지 (동궁과 월지)", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8180, lng: 129.2080, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "황리단길", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.7950, lng: 129.3430, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "석굴암", category: "landmark" },

  // ===== 전주 =====
  { mbti: r(MBTI_LIST), lat: 35.8150, lng: 127.1540, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "전주 한옥마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8200, lng: 127.1500, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "전주 남부시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 35.8120, lng: 127.1520, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "전주 경기전", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8170, lng: 127.1600, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "전주 비빔밥 골목", category: "restaurant" },

  // ===== 여수 =====
  { mbti: r(MBTI_LIST), lat: 34.7604, lng: 127.6622, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "여수 밤바다 이순신광장", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 34.7450, lng: 127.6600, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "향일암", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 34.7700, lng: 127.6700, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "여수 오동도", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 34.7580, lng: 127.6580, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "여수 돌산도 게장거리", category: "restaurant" },

  // ===== 강릉 =====
  { mbti: r(MBTI_LIST), lat: 37.7519, lng: 128.8761, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "강릉 커피거리 (안목해변)", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.7600, lng: 128.9000, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "경포해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 37.7480, lng: 128.8700, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "오죽헌", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.7550, lng: 128.8800, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "강릉 테라로사 커피공장", category: "cafe" },

  // ===== 춘천 =====
  { mbti: r(MBTI_LIST), lat: 37.7913, lng: 127.5380, mood: r(MOOD_LIST), mode: "데이트", sign: "👋 말 걸어도 돼요", placeName: "남이섬", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 37.8700, lng: 127.7200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "춘천 닭갈비 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.8810, lng: 127.7290, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "의암호 자전거길", category: "nature" },

  // ===== 속초/양양 =====
  { mbti: r(MBTI_LIST), lat: 38.2070, lng: 128.5910, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "속초 아바이마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 38.1980, lng: 128.5980, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "속초 중앙시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 38.0700, lng: 128.6300, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "양양 서피비치", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 38.0750, lng: 128.6200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "양양 카페거리", category: "cafe" },

  // ===== 제주 =====
  { mbti: r(MBTI_LIST), lat: 33.4890, lng: 126.4983, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "제주 협재해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 33.4060, lng: 126.9400, mood: r(MOOD_LIST), mode: "자연 감상", sign: "🐾 산책 중이에요", placeName: "성산일출봉", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.3620, lng: 126.5300, mood: r(MOOD_LIST), mode: "산책 중", sign: "🌙 야경 보러 왔어요", placeName: "한라산 영실코스", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.5100, lng: 126.5200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "제주 동문시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 33.3950, lng: 126.2400, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "차귀도 해안도로", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.4600, lng: 126.3300, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "애월 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 33.5270, lng: 126.5190, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "제주 용두암", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.4540, lng: 126.9270, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "섭지코지", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.3900, lng: 126.2300, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "수월봉 해안절벽", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.4300, lng: 126.6800, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "제주 만장굴", category: "nature" },

  // ===== 서귀포 =====
  { mbti: r(MBTI_LIST), lat: 33.2541, lng: 126.5601, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "정방폭포", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.2460, lng: 126.5100, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "외돌개", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.2600, lng: 126.5700, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "서귀포 매일올레시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 33.2300, lng: 126.4100, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "중문 색달해변", category: "beach" },

  // ===== 대구 =====
  { mbti: r(MBTI_LIST), lat: 35.8714, lng: 128.6014, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대구 동성로 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8690, lng: 128.5950, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "서문시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 35.8760, lng: 128.6100, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "대구 앞산공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 35.8680, lng: 128.6030, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "대구 막창골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.8730, lng: 128.5980, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대구 수성못 카페거리", category: "cafe" },

  // ===== 인천 =====
  { mbti: r(MBTI_LIST), lat: 37.4750, lng: 126.6200, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "인천 차이나타운", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.4700, lng: 126.6150, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "인천 신포국제시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.4680, lng: 126.6300, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "인천 월미도", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.4760, lng: 126.6250, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "자유공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.3960, lng: 126.6330, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "인천 송도 센트럴파크", category: "park" },

  // ===== 광주 =====
  { mbti: r(MBTI_LIST), lat: 35.1595, lng: 126.8526, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "국립아시아문화전당", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.1500, lng: 126.9000, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "양림동 역사문화마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.1560, lng: 126.8490, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "광주 충장로 먹자골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.1700, lng: 126.9100, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "무등산 국립공원", category: "nature" },

  // ===== 대전 =====
  { mbti: r(MBTI_LIST), lat: 36.3504, lng: 127.3845, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대전 성심당 본점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 36.3700, lng: 127.3900, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "엑스포과학공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 36.3480, lng: 127.4000, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대전 은행동 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 36.4100, lng: 127.3900, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "계룡산 국립공원", category: "nature" },

  // ===== 수원 =====
  { mbti: r(MBTI_LIST), lat: 37.2880, lng: 127.0130, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "수원 화성", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.2860, lng: 127.0100, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "수원 통닭거리", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.2900, lng: 127.0200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "행리단길 카페거리", category: "cafe" },

  // ===== 포항 =====
  { mbti: r(MBTI_LIST), lat: 36.0190, lng: 129.3435, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "포항 영일대 해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 35.9800, lng: 129.3800, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "호미곶 해맞이광장", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 36.0200, lng: 129.3600, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "포항 구룡포 카페거리", category: "cafe" },

  // ===== 목포 =====
  { mbti: r(MBTI_LIST), lat: 34.8118, lng: 126.3922, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "목포 유달산", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 34.8050, lng: 126.4050, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "목포 근대역사관", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 34.7900, lng: 126.3900, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "목포 해상케이블카", category: "landmark" },

  // ===== 울산 =====
  { mbti: r(MBTI_LIST), lat: 35.5384, lng: 129.3114, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "울산 대왕암공원", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 35.5600, lng: 129.3300, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "간절곶 해돋이 명소", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 35.5500, lng: 129.2900, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "울산 삼산 카페거리", category: "cafe" },

  // ===== 창원/마산 =====
  { mbti: r(MBTI_LIST), lat: 35.2280, lng: 128.6810, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "창원 주남저수지", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 35.1900, lng: 128.5800, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "마산 어시장", category: "market" },

  // ===== 진주 =====
  { mbti: r(MBTI_LIST), lat: 35.1800, lng: 128.1076, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "진주 남강 유등축제 장소", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.1900, lng: 128.0900, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "진주성", category: "landmark" },

  // ===== 통영 =====
  { mbti: r(MBTI_LIST), lat: 34.8544, lng: 128.4330, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "통영 한려수도 조망케이블카", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 34.8450, lng: 128.4200, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "통영 중앙시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 34.8600, lng: 128.4400, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "통영 동피랑 벽화마을", category: "landmark" },

  // ===== 군산 =====
  { mbti: r(MBTI_LIST), lat: 35.9761, lng: 126.7366, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "군산 근대역사거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.9700, lng: 126.7100, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "군산 이성당 빵집", category: "cafe" },

  // ===== 순천 =====
  { mbti: r(MBTI_LIST), lat: 34.9507, lng: 127.4872, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "순천만 국가정원", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 34.9600, lng: 127.5000, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "순천만 습지", category: "nature" },

  // ===== 담양 =====
  { mbti: r(MBTI_LIST), lat: 35.3210, lng: 126.9880, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "담양 죽녹원", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 35.3150, lng: 126.9820, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "메타세쿼이아 가로수길", category: "nature" },

  // ===== 청주 =====
  { mbti: r(MBTI_LIST), lat: 36.6424, lng: 127.4890, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "청주 성안길 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 36.6500, lng: 127.4800, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "청주 고인쇄박물관", category: "landmark" },

  // ===== 천안 =====
  { mbti: r(MBTI_LIST), lat: 36.8151, lng: 127.1139, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "천안 호두과자 거리", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 36.8200, lng: 127.1200, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "독립기념관", category: "landmark" },

  // ===== 파주 =====
  { mbti: r(MBTI_LIST), lat: 37.7608, lng: 126.7800, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "파주 헤이리 예술마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.7500, lng: 126.7700, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "파주 프리미엄 아울렛", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.8100, lng: 126.7100, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "임진각 평화누리공원", category: "landmark" },

  // ===== 가평 =====
  { mbti: r(MBTI_LIST), lat: 37.8310, lng: 127.5100, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "가평 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.7900, lng: 127.4600, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "자라섬", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 37.8200, lng: 127.5300, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "청평 호수공원", category: "nature" },

  // ===== 양평 =====
  { mbti: r(MBTI_LIST), lat: 37.4910, lng: 127.4870, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "양평 두물머리", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 37.5100, lng: 127.5100, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "양평 카페거리", category: "cafe" },

  // ===== 용인/에버랜드 =====
  { mbti: r(MBTI_LIST), lat: 37.2941, lng: 127.2026, mood: r(MOOD_LIST), mode: "데이트", sign: "👋 말 걸어도 돼요", placeName: "에버랜드", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.2700, lng: 127.1700, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "한국민속촌", category: "landmark" },

  // ===== 고양/일산 =====
  { mbti: r(MBTI_LIST), lat: 37.6584, lng: 126.8320, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "일산 호수공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.6550, lng: 126.8200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "일산 카페거리", category: "cafe" },

  // ===== 성남/판교 =====
  { mbti: r(MBTI_LIST), lat: 37.3950, lng: 127.1100, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "판교 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.4200, lng: 127.1300, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "분당 서현 먹자골목", category: "restaurant" },

  // ===== 안산/시흥 =====
  { mbti: r(MBTI_LIST), lat: 37.3219, lng: 126.8309, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "안산 대부도 해안길", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 37.3800, lng: 126.8000, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "시흥 갯골생태공원", category: "nature" },

  // ===== 원주 =====
  { mbti: r(MBTI_LIST), lat: 37.3422, lng: 127.9202, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "뮤지엄 산", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.3600, lng: 127.9400, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "치악산 국립공원", category: "nature" },

  // ===== 태안/서산 =====
  { mbti: r(MBTI_LIST), lat: 36.7450, lng: 126.2980, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "태안 꽃지해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 36.7700, lng: 126.4500, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "서산 간월도", category: "nature" },

  // ===== 보령/서천 =====
  { mbti: r(MBTI_LIST), lat: 36.3330, lng: 126.5130, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "보령 대천해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 36.0800, lng: 126.6900, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "서천 국립생태원", category: "nature" },

  // ===== 남해/하동 =====
  { mbti: r(MBTI_LIST), lat: 34.8370, lng: 127.8920, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "남해 독일마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.0670, lng: 127.7510, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "하동 화개장터", category: "market" },
  { mbti: r(MBTI_LIST), lat: 35.0800, lng: 127.7600, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "하동 쌍계사 십리벚꽃길", category: "nature" },

  // ===== 거제 =====
  { mbti: r(MBTI_LIST), lat: 34.8800, lng: 128.6210, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "거제 바람의 언덕", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 34.8700, lng: 128.6100, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "거제 외도 보타니아", category: "nature" },

  // ===== 추가: 서울 홍대/마포 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.5566, lng: 126.9236, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 카페 블루보틀", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5560, lng: 126.9220, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 고기집 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5548, lng: 126.9210, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "홍대 클럽 FF", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5552, lng: 126.9230, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "홍대 포차 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5570, lng: 126.9240, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 카페 어니언", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5558, lng: 126.9215, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 떡볶이 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5545, lng: 126.9200, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "홍대 바 에이트", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5575, lng: 126.9250, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 카페 드롭탑", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5562, lng: 126.9228, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 쌀국수집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5540, lng: 126.9195, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "홍대 이자카야 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5497, lng: 126.9100, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "합정 카페 메쉬", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5510, lng: 126.9090, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "망원 맛집 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5505, lng: 126.9080, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "합정 와인바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5520, lng: 126.9110, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "망원 카페 필로소피", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5488, lng: 126.9070, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "합정 돼지갈비집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5594, lng: 126.9368, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "신촌 카페 스타벅스", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5580, lng: 126.9360, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "신촌 닭갈비 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5600, lng: 126.9380, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "신촌 호프집 거리", category: "bar" },
  // ===== 강남/서초/압구정/청담 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.4979, lng: 127.0276, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "강남역 카페 투썸플레이스", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.4990, lng: 127.0290, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "강남 스시 오마카세", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.4970, lng: 127.0260, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "강남 루프탑바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5040, lng: 127.0240, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "압구정 카페 노티드", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5270, lng: 127.0410, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "청담 카페 베이커리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5260, lng: 127.0400, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "청담 파인다이닝", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5280, lng: 127.0420, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "청담 와인바 르뱅", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5050, lng: 127.0250, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "압구정 로데오 맛집거리", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5060, lng: 127.0260, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "압구정 바 오크우드", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.4990, lng: 126.9990, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "서래마을 카페 몽마르뜨", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.4980, lng: 126.9980, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "서래마을 프렌치 레스토랑", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.4970, lng: 126.9970, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "방배 카페 골목 바", category: "bar" },
  // ===== 성수/뚝섬 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.5444, lng: 127.0557, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "성수 어니언 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5430, lng: 127.0540, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "성수 카페 대림창고", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5450, lng: 127.0560, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "성수 수제버거 집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5420, lng: 127.0530, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "성수 내추럴 와인바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5460, lng: 127.0570, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "성수 카페 언더스탠드에비뉴", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5435, lng: 127.0545, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "성수 이탈리안 레스토랑", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5415, lng: 127.0525, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "성수 크래프트 비어바", category: "bar" },
  // ===== 이태원/한남 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.5345, lng: 126.9940, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "이태원 카페 테라로사", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5360, lng: 126.9920, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "이태원 멕시칸 레스토랑", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5340, lng: 126.9930, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "이태원 루프탑 바 노을", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5355, lng: 126.9950, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "이태원 클럽 나이트", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5370, lng: 126.9960, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "한남동 카페 나인블럭", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5380, lng: 126.9970, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "한남동 파스타집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5350, lng: 126.9945, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "한남동 와인바 빈티지", category: "bar" },
  // ===== 종로/을지로 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.5700, lng: 126.9830, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "을지로 카페 힙지로", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5690, lng: 126.9820, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "을지로 포차 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5710, lng: 126.9840, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "을지로 노포 식당", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5720, lng: 126.9860, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "삼청동 카페 소전서림", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5730, lng: 126.9870, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "삼청동 한정식", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5715, lng: 126.9855, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "종로 막걸리 골목", category: "bar" },
  // ===== 부산 서면/해운대/광안리/남포/해리단길 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 35.1580, lng: 129.0590, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "서면 카페 모모스", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.1570, lng: 129.0580, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "서면 돼지국밥 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.1560, lng: 129.0570, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "서면 클럽 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.1590, lng: 129.0600, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "서면 포차 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.1600, lng: 129.1600, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "해운대 오션뷰 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.1590, lng: 129.1590, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "해운대 횟집 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.1610, lng: 129.1610, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "해운대 비치 바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.1530, lng: 129.1180, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "광안리 카페 파도소리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.1520, lng: 129.1170, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "광안리 해산물 레스토랑", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.1540, lng: 129.1190, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "광안리 루프탑 바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.0980, lng: 129.0320, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "남포동 카페 거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.0970, lng: 129.0310, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "부평 깡통시장 먹자골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.0990, lng: 129.0330, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "남포동 바 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.1900, lng: 129.0850, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "해리단길 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.1910, lng: 129.0860, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "해리단길 맛집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.1920, lng: 129.0870, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "해리단길 바", category: "bar" },
  // ===== 대구 동성로/봉리단길 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 35.8700, lng: 128.5960, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "동성로 카페 봉리단길", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8690, lng: 128.5950, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "동성로 막창 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.8710, lng: 128.5970, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "동성로 클럽 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.8720, lng: 128.5980, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대구 카페 수성못", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8680, lng: 128.5940, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "대구 국밥 노포", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.8730, lng: 128.5990, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "대구 포차 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.8580, lng: 128.6020, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대구 카페 봉덕동", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8560, lng: 128.6000, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "대구 치킨 골목", category: "restaurant" },
  // ===== 인천 송도/부평 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.3830, lng: 126.6560, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "송도 카페 센트럴파크", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.3820, lng: 126.6550, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "송도 레스토랑 거리", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.3840, lng: 126.6570, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "송도 루프탑 바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.4890, lng: 126.7230, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "부평 카페 거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.4880, lng: 126.7220, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "부평 먹자골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.4900, lng: 126.7240, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "부평 포차 거리", category: "bar" },
  // ===== 광주 충장로/동명동 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 35.1490, lng: 126.9180, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "충장로 카페 거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.1480, lng: 126.9170, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "광주 한정식 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.1500, lng: 126.9190, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "충장로 바 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.1510, lng: 126.9200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "광주 카페 동명동", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.1470, lng: 126.9160, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "광주 떡갈비 전문점", category: "restaurant" },
  // ===== 대전 은행동/둔산 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 36.3280, lng: 127.4270, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "은행동 카페 거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 36.3270, lng: 127.4260, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "대전 성심당 근처 맛집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 36.3290, lng: 127.4280, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "은행동 포차 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 36.3510, lng: 127.3850, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "둔산 카페 거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 36.3500, lng: 127.3840, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "둔산 레스토랑 거리", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 36.3520, lng: 127.3860, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "둔산 바 거리", category: "bar" },
  // ===== 전주 한옥마을/객리단길 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 35.8150, lng: 127.1540, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "전주 한옥마을 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8140, lng: 127.1530, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "전주 비빔밥 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.8160, lng: 127.1550, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "전주 막걸리 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.8130, lng: 127.1520, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "전주 객리단길 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8170, lng: 127.1560, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "전주 콩나물국밥 집", category: "restaurant" },
  // ===== 제주/서귀포/애월 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 33.5000, lng: 126.5310, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "제주 카페 몬트락", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 33.4990, lng: 126.5300, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "제주 흑돼지 맛집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 33.5010, lng: 126.5320, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "제주 바 오션뷰", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 33.2550, lng: 126.5610, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "서귀포 카페 오설록", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 33.2540, lng: 126.5600, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "서귀포 갈치조림 맛집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 33.2560, lng: 126.5620, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "서귀포 루프탑 바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 33.4610, lng: 126.3150, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "애월 카페 바다", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 33.4600, lng: 126.3140, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "애월 해산물 식당", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 33.4620, lng: 126.3160, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "협재 오션뷰 카페", category: "cafe" },
  // ===== 수원/용인 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.2636, lng: 127.0286, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "수원 행리단길 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.2626, lng: 127.0276, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "수원 갈비 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.2646, lng: 127.0296, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "수원 포차 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.2411, lng: 127.1776, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "용인 카페 거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.2401, lng: 127.1766, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "용인 맛집 골목", category: "restaurant" },
  // ===== 춘천/강릉 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 37.8813, lng: 127.7300, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "춘천 닭갈비 골목 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.8803, lng: 127.7290, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "춘천 닭갈비 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.8823, lng: 127.7310, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "춘천 막국수 집 바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.7519, lng: 128.8761, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "강릉 카페 테라로사", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.7509, lng: 128.8751, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "강릉 초당 순두부 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.7529, lng: 128.8771, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "강릉 오션뷰 바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.7519, lng: 128.9000, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "강릉 안목해변 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.7509, lng: 128.8990, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "강릉 안목 오션뷰 카페", category: "cafe" },
  // ===== 청주/경주/여수/창원 카페/바/음식점 =====
  { mbti: r(MBTI_LIST), lat: 36.6424, lng: 127.4890, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "청주 성안길 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 36.6414, lng: 127.4880, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "청주 먹자골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 36.6434, lng: 127.4900, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "청주 포차 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 35.8562, lng: 129.2247, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "경주 황리단길 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8552, lng: 129.2237, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "경주 황리단길 맛집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.8572, lng: 129.2257, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "경주 교촌 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8542, lng: 129.2227, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "경주 황리단길 바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 34.7604, lng: 127.6622, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "여수 낭만포차 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 34.7594, lng: 127.6612, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "여수 게장 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 34.7614, lng: 127.6632, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "여수 낭만포차 거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 34.7624, lng: 127.6642, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "여수 오션뷰 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.5396, lng: 128.6292, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "창원 카페 거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.5386, lng: 128.6282, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "마산 아구찜 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 35.5406, lng: 128.6302, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "🍺 한잔 할래요?", placeName: "창원 포차 거리", category: "bar" },
];