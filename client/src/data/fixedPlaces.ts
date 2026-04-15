// 홍대 / 연남 / 성수 3개 지역 전용 장소 데이터

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

const MBTI_LIST = ["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"];
const MOOD_LIST = ["설레는","여유로운","신나는","차분한","피곤한","행복한","외로운","두근두근"];
const MODE_LIST = ["산책 중","카페 탐방","맛집 투어","혼자만의 시간","친구 만남","데이트","전시 관람","그냥 배회 중"];
const SIGN_LIST = ["👋 말 걸어도 돼요","🎧 혼자 있고 싶어요","☕ 같이 앉아도 돼요","👀 구경 중이에요","📸 사진 찍는 중이에요","🐾 산책 중이에요","💬 대화 상대 찾아요","🍽️ 맛집 찾는 중이에요","🍺 한잔 할래요?"];
const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const FIXED_PLACES: FixedPlace[] = [
  // ===== 홍대 =====
  { mbti: r(MBTI_LIST), lat: 37.5566, lng: 126.9236, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 카페 블루보틀", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5560, lng: 126.9220, mood: r(MOOD_LIST), mode: "친구 만남", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 고기집 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5548, lng: 126.9210, mood: r(MOOD_LIST), mode: "혼술 중", sign: "👋 말 걸어도 돼요", placeName: "홍대 클럽 FF", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5552, lng: 126.9230, mood: r(MOOD_LIST), mode: "친구 만남", sign: "👋 말 걸어도 돼요", placeName: "홍대 포차 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5570, lng: 126.9240, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 카페 어니언", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5558, lng: 126.9215, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 떡볶이 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5545, lng: 126.9200, mood: r(MOOD_LIST), mode: "친구 만남", sign: "👋 말 걸어도 돼요", placeName: "홍대 바 에이트", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5575, lng: 126.9250, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 카페 드롭탑", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5562, lng: 126.9228, mood: r(MOOD_LIST), mode: "데이트", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 쌀국수집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5540, lng: 126.9195, mood: r(MOOD_LIST), mode: "혼술 중", sign: "💬 대화 상대 찾아요", placeName: "홍대 이자카야 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5580, lng: 126.9260, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 스타벅스 입구점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5555, lng: 126.9205, mood: r(MOOD_LIST), mode: "친구 만남", sign: "👋 말 걸어도 돼요", placeName: "홍대 닭갈비 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5535, lng: 126.9185, mood: r(MOOD_LIST), mode: "혼술 중", sign: "🍺 한잔 할래요?", placeName: "홍대 포차거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5590, lng: 126.9270, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "홍대 카페 폴바셋", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5525, lng: 126.9175, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "홍대 라멘 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5549, lng: 126.9228, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "💬 대화 상대 찾아요", placeName: "카페 노티드 홍대점", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5571, lng: 126.9215, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "앤트러사이트 홍대", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5560, lng: 126.9248, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "👋 말 걸어도 돼요", placeName: "홍대 걷고싶은거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5558, lng: 126.9205, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "👋 말 걸어도 돼요", placeName: "스타벅스 홍대입구역점", category: "cafe" },
  // 합정/망원 (홍대 인접)
  { mbti: r(MBTI_LIST), lat: 37.5497, lng: 126.9100, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "💬 대화 상대 찾아요", placeName: "합정 카페 메쉬", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5510, lng: 126.9090, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "💬 대화 상대 찾아요", placeName: "망원 맛집 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5505, lng: 126.9080, mood: r(MOOD_LIST), mode: "혼술 중", sign: "👋 말 걸어도 돼요", placeName: "합정 와인바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5520, lng: 126.9110, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "👀 구경 중이에요", placeName: "망원 카페 필로소피", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5488, lng: 126.9070, mood: r(MOOD_LIST), mode: "친구 만남", sign: "🍽️ 맛집 찾는 중이에요", placeName: "합정 돼지갈비집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5500, lng: 126.9140, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "👀 구경 중이에요", placeName: "합정 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5530, lng: 126.9180, mood: r(MOOD_LIST), mode: "혼술 중", sign: "🍺 한잔 할래요?", placeName: "홍대 포차거리", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5475, lng: 126.9210, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "망원 한강공원", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5490, lng: 126.9120, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "당인리 발전소 공원", category: "park" },

  // ===== 연남동 =====
  { mbti: r(MBTI_LIST), lat: 37.5620, lng: 126.9270, mood: r(MOOD_LIST), mode: "데이트", sign: "🐾 산책 중이에요", placeName: "연남동 경의선 숲길", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5640, lng: 126.9250, mood: r(MOOD_LIST), mode: "혼자만의 시간", sign: "🎧 혼자 있고 싶어요", placeName: "연남동 카페거리", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5630, lng: 126.9260, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "연남동 카페 오르에르", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5615, lng: 126.9280, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "연남동 파스타 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5645, lng: 126.9240, mood: r(MOOD_LIST), mode: "혼술 중", sign: "🍺 한잔 할래요?", placeName: "연남동 내추럴 와인바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5625, lng: 126.9255, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "💬 대화 상대 찾아요", placeName: "연남동 브런치 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5610, lng: 126.9290, mood: r(MOOD_LIST), mode: "친구 만남", sign: "👋 말 걸어도 돼요", placeName: "연남동 이탈리안 레스토랑", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5650, lng: 126.9235, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "연남동 숲길 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5635, lng: 126.9265, mood: r(MOOD_LIST), mode: "데이트", sign: "🍽️ 맛집 찾는 중이에요", placeName: "연남동 디저트 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5618, lng: 126.9275, mood: r(MOOD_LIST), mode: "혼술 중", sign: "💬 대화 상대 찾아요", placeName: "연남동 포차", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5642, lng: 126.9248, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "연남동 스페셜티 커피", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5628, lng: 126.9258, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "연남동 한식 골목", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5608, lng: 126.9285, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "👀 구경 중이에요", placeName: "연남동 빈티지 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5655, lng: 126.9230, mood: r(MOOD_LIST), mode: "그냥 배회 중", sign: "👋 말 걸어도 돼요", placeName: "연남동 골목 산책로", category: "park" },

  // ===== 성수동 =====
  { mbti: r(MBTI_LIST), lat: 37.5444, lng: 127.0557, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "💬 대화 상대 찾아요", placeName: "어니언 성수", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5430, lng: 127.0540, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "성수동 카페거리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5410, lng: 127.0500, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "💬 대화 상대 찾아요", placeName: "성수 할아버지공장", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5430, lng: 127.0540, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "👋 말 걸어도 돼요", placeName: "성수 카페 대림창고", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5450, lng: 127.0560, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "💬 대화 상대 찾아요", placeName: "성수 수제버거 집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5420, lng: 127.0530, mood: r(MOOD_LIST), mode: "친구 만남", sign: "👋 말 걸어도 돼요", placeName: "성수 내추럴 와인바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5460, lng: 127.0570, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "💬 대화 상대 찾아요", placeName: "성수 카페 언더스탠드에비뉴", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5435, lng: 127.0545, mood: r(MOOD_LIST), mode: "맛집 투어", sign: "🍽️ 맛집 찾는 중이에요", placeName: "성수 이탈리안 레스토랑", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5415, lng: 127.0525, mood: r(MOOD_LIST), mode: "혼술 중", sign: "💬 대화 상대 찾아요", placeName: "성수 크래프트 비어바", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5455, lng: 127.0565, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "성수 블루보틀", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5425, lng: 127.0535, mood: r(MOOD_LIST), mode: "친구 만남", sign: "🍽️ 맛집 찾는 중이에요", placeName: "성수 뚝섬 맛집", category: "restaurant" },
  { mbti: r(MBTI_LIST), lat: 37.5440, lng: 127.0550, mood: r(MOOD_LIST), mode: "전시 관람", sign: "📸 사진 찍는 중이에요", placeName: "성수 팝업 스토어", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5465, lng: 127.0575, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "👀 구경 중이에요", placeName: "성수 루프탑 카페", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5418, lng: 127.0522, mood: r(MOOD_LIST), mode: "혼술 중", sign: "🍺 한잔 할래요?", placeName: "성수 바 골목", category: "bar" },
  { mbti: r(MBTI_LIST), lat: 37.5460, lng: 127.0580, mood: r(MOOD_LIST), mode: "산책 중", sign: "🐾 산책 중이에요", placeName: "서울숲", category: "park" },
  { mbti: r(MBTI_LIST), lat: 37.5390, lng: 127.0480, mood: r(MOOD_LIST), mode: "산책 중", sign: "📸 사진 찍는 중이에요", placeName: "대림창고 갤러리", category: "landmark" },
  { mbti: r(MBTI_LIST), lat: 37.5470, lng: 127.0590, mood: r(MOOD_LIST), mode: "카페 탐방", sign: "☕ 같이 앉아도 돼요", placeName: "성수 카페 쎈느", category: "cafe" },
  { mbti: r(MBTI_LIST), lat: 37.5408, lng: 127.0510, mood: r(MOOD_LIST), mode: "전시 관람", sign: "👀 구경 중이에요", placeName: "성수 갤러리 골목", category: "landmark" },
];
