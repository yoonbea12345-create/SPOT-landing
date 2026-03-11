// 실제 장소 고정 마커 데이터 (카페/핫플/자연경관 혼합)
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
  // ===== 서울 홍대/마포 =====
  { mbti: r(MBTI_LIST), lat: 37.5549, lng: 126.9228, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "카페 노티드 홍대점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5571, lng: 126.9215, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "앤트러사이트 홍대", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5560, lng: 126.9248, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "👋 말 걸어도 돼요", placeName: "홍대 걷고싶은거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5580, lng: 126.9260, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "홍대 상상마당", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5558, lng: 126.9205, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "스타벅스 홍대입구역점", category: "cafe" },

  // ===== 서울 강남/압구정 =====
  { mbti: r(MBTI_LIST), lat: 37.5270, lng: 127.0411, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "블루보틀 삼청동", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5250, lng: 127.0430, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "압구정 로데오거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5220, lng: 127.0220, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "신사동 가로수길", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5175, lng: 127.0473, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "카페 드롭탑 강남점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5200, lng: 127.0250, mood: r(MOOD_LIST), mode: "데이트", sign: "👋 말 걸어도 돼요", placeName: "도산공원", category: "park" },

  // ===== 서울 성수/뚝섬 =====
  { mbti: r(MBTI_LIST), lat: 37.5444, lng: 127.0557, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "어니언 성수", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5430, lng: 127.0540, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "성수동 카페거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5460, lng: 127.0580, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "서울숲", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5480, lng: 127.0600, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "뚝섬한강공원", category: "park" },

  // ===== 서울 여의도/한강 =====
  { mbti: r(MBTI_LIST), lat: 37.5268, lng: 126.9327, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "여의도 한강공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5253, lng: 126.9345, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "여의도 벚꽃길", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5280, lng: 126.9300, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "63빌딩 전망대", category: "landmark" },

  // ===== 서울 명동/종로 =====
  { mbti: r(MBTI_LIST), lat: 37.5636, lng: 126.9827, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "명동 쇼핑거리", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.5796, lng: 126.9770, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "경복궁", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5700, lng: 126.9830, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "북촌 한옥마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5720, lng: 126.9860, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "삼청동 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5600, lng: 126.9750, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "남산 서울타워", category: "landmark" },

  // ===== 부산 =====
  { mbti: r(MBTI_LIST), lat: 35.1587, lng: 129.1603, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "해운대 해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 35.1550, lng: 129.1190, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "광안리 해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 35.1010, lng: 129.0320, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "감천문화마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.0990, lng: 129.0260, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "국제시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 35.1780, lng: 129.1280, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "동백섬 누리마루", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 35.0630, lng: 129.0170, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "태종대 전망대", category: "nature" },

  // ===== 경주 =====
  { mbti: r(MBTI_LIST), lat: 35.8562, lng: 129.2247, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "불국사", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8350, lng: 129.2100, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "첨성대", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8290, lng: 129.2150, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "안압지 (동궁과 월지)", category: "landmark" },

  // ===== 전주 =====
  { mbti: r(MBTI_LIST), lat: 35.8150, lng: 127.1540, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "전주 한옥마을", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.8200, lng: 127.1500, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "전주 남부시장", category: "market" },

  // ===== 여수 =====
  { mbti: r(MBTI_LIST), lat: 34.7604, lng: 127.6622, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "여수 밤바다 이순신광장", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 34.7450, lng: 127.6600, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "향일암", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 34.7700, lng: 127.6700, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "여수 오동도", category: "nature" },

  // ===== 강릉 =====
  { mbti: r(MBTI_LIST), lat: 37.7519, lng: 128.8761, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "강릉 커피거리 (안목해변)", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.7600, lng: 128.9000, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "경포해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 37.7480, lng: 128.8700, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "오죽헌", category: "landmark" },

  // ===== 춘천 =====
  { mbti: r(MBTI_LIST), lat: 37.8813, lng: 127.7300, mood: r(MOOD_LIST), mode: "데이트", sign: "👋 말 걸어도 돼요", placeName: "남이섬", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 37.8700, lng: 127.7200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "춘천 닭갈비 골목", category: "restaurant" },

  // ===== 제주 =====
  { mbti: r(MBTI_LIST), lat: 33.4890, lng: 126.4983, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "제주 협재해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 33.4060, lng: 126.9400, mood: r(MOOD_LIST), mode: "자연 감상", sign: "🐾 산책 중이에요", placeName: "성산일출봉", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.3620, lng: 126.5300, mood: r(MOOD_LIST), mode: "산책 중", sign: "🌙 야경 보러 왔어요", placeName: "한라산 영실코스", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.5100, lng: 126.5200, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "제주 동문시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 33.3950, lng: 126.2400, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "차귀도 해안도로", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.4600, lng: 126.3300, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "애월 카페거리", category: "cafe" },

  // ===== 서귀포 =====
  { mbti: r(MBTI_LIST), lat: 33.2541, lng: 126.5601, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "정방폭포", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 33.2460, lng: 126.5100, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "외돌개", category: "nature" },

  // ===== 대구 =====
  { mbti: r(MBTI_LIST), lat: 35.8714, lng: 128.6014, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대구 동성로 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 35.8690, lng: 128.5950, mood: r(MOOD_LIST), mode: "쇼핑 중", sign: "🛍️ 쇼핑 중이에요", placeName: "서문시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 35.8760, lng: 128.6100, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "대구 앞산공원", category: "park" },

  // ===== 인천 =====
  { mbti: r(MBTI_LIST), lat: 37.4750, lng: 126.6200, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "인천 차이나타운", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.4700, lng: 126.6150, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "인천 신포국제시장", category: "market" },
  { mbti: r(MBTI_LIST), lat: 37.4680, lng: 126.6300, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "인천 월미도", category: "landmark" },

  // ===== 광주 =====
  { mbti: r(MBTI_LIST), lat: 35.1595, lng: 126.8526, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "국립아시아문화전당", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 35.1500, lng: 126.9000, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "양림동 역사문화마을", category: "landmark" },

  // ===== 대전 =====
  { mbti: r(MBTI_LIST), lat: 36.3504, lng: 127.3845, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "대전 성심당 본점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 36.3700, lng: 127.3900, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "엑스포과학공원", category: "park" },

  // ===== 수원 =====
  { mbti: r(MBTI_LIST), lat: 37.2880, lng: 127.0130, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "수원 화성", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.2860, lng: 127.0100, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "수원 통닭거리", category: "restaurant" },

  // ===== 포항 =====
  { mbti: r(MBTI_LIST), lat: 36.0190, lng: 129.3435, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "포항 영일대 해수욕장", category: "beach" },
  { mbti: r(MBTI_LIST), lat: 35.9800, lng: 129.3800, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "호미곶 해맞이광장", category: "nature" },

  // ===== 목포 =====
  { mbti: r(MBTI_LIST), lat: 34.8118, lng: 126.3922, mood: r(MOOD_LIST), mode: "야경 구경", sign: "🌙 야경 보러 왔어요", placeName: "목포 유달산", category: "nature" },
  { mbti: r(MBTI_LIST), lat: 34.8050, lng: 126.4050, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "목포 근대역사관", category: "landmark" },
];
