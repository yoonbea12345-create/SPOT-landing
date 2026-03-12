/**
 * Avatar.tsx
 * SVG 기반 동물 아바타 컴포넌트
 * - 20종 동물 얼굴 (귀여운/멋있는 스타일)
 * - 액세서리 레이어 (선글라스, 안경, 모자, 목도리, 왕관, 헤드폰 등)
 * - 표정 (5종)
 * - 이모티콘 말풍선
 */

export type AnimalType =
  | 'cat' | 'dog' | 'fox' | 'bear' | 'rabbit'
  | 'panda' | 'tiger' | 'lion' | 'wolf' | 'deer'
  | 'hamster' | 'penguin' | 'koala' | 'frog' | 'owl'
  | 'duck' | 'chick' | 'dragon' | 'shiba' | 'axolotl';

export type AccessoryType =
  | 'none' | 'sunglasses' | 'glasses' | 'hat' | 'cap'
  | 'crown' | 'scarf' | 'headphones' | 'bow' | 'bandana' | 'beanie';

export type ExpressionType = 'happy' | 'cool' | 'sad' | 'surprised' | 'wink';

export type EmojiType =
  | 'none' | '🔥' | '✨' | '💫' | '🎵' | '💤'
  | '❤️' | '👋' | '🌙' | '⚡' | '🌸' | '😎';

export interface AvatarConfig {
  animal: AnimalType;
  accessory: AccessoryType;
  expression: ExpressionType;
  emoji: EmojiType;
  color?: string; // 아바타 배경 색상 (MBTI 색상)
}

// 동물 정보
export const ANIMALS: { type: AnimalType; label: string; emoji: string }[] = [
  { type: 'cat', label: '고양이', emoji: '🐱' },
  { type: 'dog', label: '강아지', emoji: '🐶' },
  { type: 'fox', label: '여우', emoji: '🦊' },
  { type: 'bear', label: '곰', emoji: '🐻' },
  { type: 'rabbit', label: '토끼', emoji: '🐰' },
  { type: 'panda', label: '판다', emoji: '🐼' },
  { type: 'tiger', label: '호랑이', emoji: '🐯' },
  { type: 'lion', label: '사자', emoji: '🦁' },
  { type: 'wolf', label: '늑대', emoji: '🐺' },
  { type: 'deer', label: '사슴', emoji: '🦌' },
  { type: 'hamster', label: '햄스터', emoji: '🐹' },
  { type: 'penguin', label: '펭귄', emoji: '🐧' },
  { type: 'koala', label: '코알라', emoji: '🐨' },
  { type: 'frog', label: '개구리', emoji: '🐸' },
  { type: 'owl', label: '올빼미', emoji: '🦉' },
  { type: 'duck', label: '오리', emoji: '🦆' },
  { type: 'chick', label: '병아리', emoji: '🐣' },
  { type: 'dragon', label: '드래곤', emoji: '🐲' },
  { type: 'shiba', label: '시바견', emoji: '🐕' },
  { type: 'axolotl', label: '아홀로틀', emoji: '🦎' },
];

export const ACCESSORIES: { type: AccessoryType; label: string; emoji: string }[] = [
  { type: 'none', label: '없음', emoji: '✖️' },
  { type: 'sunglasses', label: '선글라스', emoji: '🕶️' },
  { type: 'glasses', label: '안경', emoji: '👓' },
  { type: 'hat', label: '모자', emoji: '🎩' },
  { type: 'cap', label: '캡모자', emoji: '🧢' },
  { type: 'crown', label: '왕관', emoji: '👑' },
  { type: 'scarf', label: '목도리', emoji: '🧣' },
  { type: 'headphones', label: '헤드폰', emoji: '🎧' },
  { type: 'bow', label: '리본', emoji: '🎀' },
  { type: 'bandana', label: '반다나', emoji: '🩺' },
  { type: 'beanie', label: '비니', emoji: '🪖' },
];

export const EXPRESSIONS: { type: ExpressionType; label: string; emoji: string }[] = [
  { type: 'happy', label: '행복', emoji: '😊' },
  { type: 'cool', label: '쿨', emoji: '😎' },
  { type: 'sad', label: '슬픔', emoji: '😢' },
  { type: 'surprised', label: '놀람', emoji: '😮' },
  { type: 'wink', label: '윙크', emoji: '😉' },
];

export const EMOJIS: { type: EmojiType; label: string }[] = [
  { type: 'none', label: '없음' },
  { type: '🔥', label: '불꽃' },
  { type: '✨', label: '반짝' },
  { type: '💫', label: '별' },
  { type: '🎵', label: '음악' },
  { type: '💤', label: '졸음' },
  { type: '❤️', label: '하트' },
  { type: '👋', label: '인사' },
  { type: '🌙', label: '달' },
  { type: '⚡', label: '번개' },
  { type: '🌸', label: '꽃' },
  { type: '😎', label: '쿨' },
];

// 랜덤 아바타 생성
export function randomAvatarConfig(): AvatarConfig {
  const animals = ANIMALS.map(a => a.type);
  const accessories = ACCESSORIES.map(a => a.type);
  const expressions = EXPRESSIONS.map(e => e.type);
  const emojis = EMOJIS.map(e => e.type);
  return {
    animal: animals[Math.floor(Math.random() * animals.length)],
    accessory: accessories[Math.floor(Math.random() * accessories.length)],
    expression: expressions[Math.floor(Math.random() * expressions.length)],
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
  };
}

// 아바타 설정을 문자열로 직렬화/역직렬화
export function serializeAvatar(config: AvatarConfig): string {
  return `${config.animal}|${config.accessory}|${config.expression}|${config.emoji}`;
}

export function deserializeAvatar(str: string): AvatarConfig {
  const [animal, accessory, expression, emoji] = str.split('|');
  return {
    animal: (animal as AnimalType) || 'cat',
    accessory: (accessory as AccessoryType) || 'none',
    expression: (expression as ExpressionType) || 'happy',
    emoji: (emoji as EmojiType) || 'none',
  };
}

// ─── SVG 아바타 렌더러 ───────────────────────────────────────────────────────

interface AvatarSVGProps {
  config: AvatarConfig;
  size?: number;
  bgColor?: string; // 원형 배경 색상
  showEmoji?: boolean;
}

// 동물별 얼굴 SVG path 데이터 (48x48 기준)
function getAnimalFace(animal: AnimalType, expression: ExpressionType): React.ReactNode {
  // 눈 표현
  const eyes = {
    happy: (
      <>
        {/* 왼쪽 눈 - 반원 (행복) */}
        <path d="M15 22 Q17 19 19 22" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* 오른쪽 눈 */}
        <path d="M29 22 Q31 19 33 22" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </>
    ),
    cool: (
      <>
        {/* 왼쪽 눈 - 일자 (쿨) */}
        <line x1="14" y1="21" x2="20" y2="21" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="28" y1="21" x2="34" y2="21" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    ),
    sad: (
      <>
        {/* 슬픈 눈 - 아래로 처진 반원 */}
        <path d="M15 20 Q17 23 19 20" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M29 20 Q31 23 33 20" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </>
    ),
    surprised: (
      <>
        {/* 놀란 눈 - 원 */}
        <circle cx="17" cy="21" r="3" fill="#333"/>
        <circle cx="31" cy="21" r="3" fill="#333"/>
        <circle cx="16" cy="20" r="1" fill="white"/>
        <circle cx="30" cy="20" r="1" fill="white"/>
      </>
    ),
    wink: (
      <>
        {/* 윙크 - 왼쪽 반원, 오른쪽 일자 */}
        <path d="M15 22 Q17 19 19 22" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="28" y1="21" x2="34" y2="21" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    ),
  };

  // 입 표현
  const mouths = {
    happy: <path d="M19 28 Q24 33 29 28" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>,
    cool: <path d="M20 29 Q24 31 28 29" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>,
    sad: <path d="M19 31 Q24 27 29 31" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>,
    surprised: <ellipse cx="24" cy="30" rx="4" ry="5" fill="#333"/>,
    wink: <path d="M19 28 Q24 33 29 28" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>,
  };

  // 동물별 귀/특징
  const animalFeatures: Record<AnimalType, React.ReactNode> = {
    cat: (
      <>
        {/* 고양이 귀 */}
        <polygon points="8,8 16,20 4,20" fill="#f9c5d1" stroke="#e8a0b0" strokeWidth="1"/>
        <polygon points="40,8 32,20 44,20" fill="#f9c5d1" stroke="#e8a0b0" strokeWidth="1"/>
        {/* 귀 안쪽 */}
        <polygon points="9,10 15,19 6,19" fill="#ffb3c6" opacity="0.7"/>
        <polygon points="39,10 33,19 42,19" fill="#ffb3c6" opacity="0.7"/>
        {/* 수염 */}
        <line x1="4" y1="27" x2="16" y2="26" stroke="#aaa" strokeWidth="0.8" opacity="0.7"/>
        <line x1="4" y1="29" x2="16" y2="29" stroke="#aaa" strokeWidth="0.8" opacity="0.7"/>
        <line x1="32" y1="26" x2="44" y2="27" stroke="#aaa" strokeWidth="0.8" opacity="0.7"/>
        <line x1="32" y1="29" x2="44" y2="29" stroke="#aaa" strokeWidth="0.8" opacity="0.7"/>
        {/* 코 */}
        <ellipse cx="24" cy="26" rx="2.5" ry="1.5" fill="#ff9eb5"/>
      </>
    ),
    dog: (
      <>
        {/* 강아지 귀 - 처진 귀 */}
        <ellipse cx="10" cy="22" rx="7" ry="10" fill="#c8a882" transform="rotate(-15 10 22)"/>
        <ellipse cx="38" cy="22" rx="7" ry="10" fill="#c8a882" transform="rotate(15 38 22)"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="4" ry="3" fill="#333"/>
        <ellipse cx="23" cy="26" rx="1.5" ry="1" fill="rgba(255,255,255,0.4)"/>
      </>
    ),
    fox: (
      <>
        {/* 여우 귀 - 뾰족한 귀 */}
        <polygon points="10,4 18,20 2,18" fill="#e8732a" stroke="#c5601e" strokeWidth="1"/>
        <polygon points="38,4 30,20 46,18" fill="#e8732a" stroke="#c5601e" strokeWidth="1"/>
        <polygon points="11,7 17,19 5,18" fill="#fff5e0" opacity="0.8"/>
        <polygon points="37,7 31,19 43,18" fill="#fff5e0" opacity="0.8"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="3" ry="2" fill="#333"/>
        {/* 수염 */}
        <line x1="4" y1="27" x2="16" y2="26" stroke="#aaa" strokeWidth="0.8" opacity="0.6"/>
        <line x1="32" y1="26" x2="44" y2="27" stroke="#aaa" strokeWidth="0.8" opacity="0.6"/>
      </>
    ),
    bear: (
      <>
        {/* 곰 귀 - 둥근 귀 */}
        <circle cx="11" cy="13" r="7" fill="#8B6914"/>
        <circle cx="37" cy="13" r="7" fill="#8B6914"/>
        <circle cx="11" cy="13" r="4" fill="#c49a3c" opacity="0.6"/>
        <circle cx="37" cy="13" r="4" fill="#c49a3c" opacity="0.6"/>
        {/* 코 */}
        <ellipse cx="24" cy="28" rx="5" ry="3.5" fill="#5a3a1a"/>
        <ellipse cx="23" cy="27" rx="2" ry="1.2" fill="rgba(255,255,255,0.3)"/>
      </>
    ),
    rabbit: (
      <>
        {/* 토끼 귀 - 길쭉한 귀 */}
        <ellipse cx="15" cy="6" rx="5" ry="12" fill="#f5e6e8" stroke="#e8c5ca" strokeWidth="1"/>
        <ellipse cx="33" cy="6" rx="5" ry="12" fill="#f5e6e8" stroke="#e8c5ca" strokeWidth="1"/>
        <ellipse cx="15" cy="6" rx="2.5" ry="9" fill="#ffb3c6" opacity="0.6"/>
        <ellipse cx="33" cy="6" rx="2.5" ry="9" fill="#ffb3c6" opacity="0.6"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="2" ry="1.5" fill="#ff9eb5"/>
      </>
    ),
    panda: (
      <>
        {/* 판다 귀 */}
        <circle cx="11" cy="13" r="7" fill="#333"/>
        <circle cx="37" cy="13" r="7" fill="#333"/>
        {/* 눈 주위 검은 반점 */}
        <ellipse cx="17" cy="21" rx="5" ry="4" fill="#333" opacity="0.85"/>
        <ellipse cx="31" cy="21" rx="5" ry="4" fill="#333" opacity="0.85"/>
        {/* 코 */}
        <ellipse cx="24" cy="28" rx="3" ry="2" fill="#333"/>
      </>
    ),
    tiger: (
      <>
        {/* 호랑이 귀 */}
        <polygon points="10,6 17,20 3,18" fill="#e8932a" stroke="#c57820" strokeWidth="1"/>
        <polygon points="38,6 31,20 45,18" fill="#e8932a" stroke="#c57820" strokeWidth="1"/>
        <polygon points="11,9 16,19 5,18" fill="#fff5e0" opacity="0.7"/>
        <polygon points="37,9 32,19 43,18" fill="#fff5e0" opacity="0.7"/>
        {/* 호랑이 줄무늬 */}
        <line x1="10" y1="24" x2="16" y2="22" stroke="#c57820" strokeWidth="1.5" opacity="0.5"/>
        <line x1="10" y1="28" x2="16" y2="27" stroke="#c57820" strokeWidth="1.5" opacity="0.5"/>
        <line x1="32" y1="22" x2="38" y2="24" stroke="#c57820" strokeWidth="1.5" opacity="0.5"/>
        <line x1="32" y1="27" x2="38" y2="28" stroke="#c57820" strokeWidth="1.5" opacity="0.5"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="3" ry="2" fill="#333"/>
      </>
    ),
    lion: (
      <>
        {/* 사자 갈기 */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(angle => (
          <ellipse
            key={angle}
            cx={24 + Math.cos(angle * Math.PI / 180) * 18}
            cy={24 + Math.sin(angle * Math.PI / 180) * 18}
            rx="5" ry="3"
            fill="#c49a3c"
            transform={`rotate(${angle} ${24 + Math.cos(angle * Math.PI / 180) * 18} ${24 + Math.sin(angle * Math.PI / 180) * 18})`}
            opacity="0.8"
          />
        ))}
        {/* 귀 */}
        <circle cx="12" cy="14" r="5" fill="#e8b84b"/>
        <circle cx="36" cy="14" r="5" fill="#e8b84b"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="3.5" ry="2.5" fill="#c87941"/>
      </>
    ),
    wolf: (
      <>
        {/* 늑대 귀 */}
        <polygon points="10,4 18,20 2,16" fill="#888" stroke="#666" strokeWidth="1"/>
        <polygon points="38,4 30,20 46,16" fill="#888" stroke="#666" strokeWidth="1"/>
        <polygon points="11,7 17,19 5,16" fill="#ccc" opacity="0.7"/>
        <polygon points="37,7 31,19 43,16" fill="#ccc" opacity="0.7"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="3.5" ry="2.5" fill="#333"/>
        {/* 수염 */}
        <line x1="4" y1="27" x2="16" y2="26" stroke="#888" strokeWidth="0.8" opacity="0.5"/>
        <line x1="32" y1="26" x2="44" y2="27" stroke="#888" strokeWidth="0.8" opacity="0.5"/>
      </>
    ),
    deer: (
      <>
        {/* 사슴 뿔 */}
        <path d="M12 18 L8 6 M8 6 L4 2 M8 6 L12 3" stroke="#8B6914" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M36 18 L40 6 M40 6 L44 2 M40 6 L36 3" stroke="#8B6914" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* 귀 */}
        <ellipse cx="10" cy="22" rx="5" ry="8" fill="#d4a574" transform="rotate(-20 10 22)"/>
        <ellipse cx="38" cy="22" rx="5" ry="8" fill="#d4a574" transform="rotate(20 38 22)"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="3" ry="2" fill="#c87941"/>
      </>
    ),
    hamster: (
      <>
        {/* 햄스터 귀 */}
        <circle cx="11" cy="16" r="6" fill="#f9c5d1"/>
        <circle cx="37" cy="16" r="6" fill="#f9c5d1"/>
        <circle cx="11" cy="16" r="3.5" fill="#ffb3c6" opacity="0.7"/>
        <circle cx="37" cy="16" r="3.5" fill="#ffb3c6" opacity="0.7"/>
        {/* 볼살 */}
        <circle cx="10" cy="28" r="6" fill="#ffb3c6" opacity="0.4"/>
        <circle cx="38" cy="28" r="6" fill="#ffb3c6" opacity="0.4"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="2" ry="1.5" fill="#ff9eb5"/>
      </>
    ),
    penguin: (
      <>
        {/* 펭귄 - 흰 배 */}
        <ellipse cx="24" cy="30" rx="10" ry="8" fill="white" opacity="0.9"/>
        {/* 눈 주위 흰색 */}
        <ellipse cx="17" cy="21" rx="4" ry="4.5" fill="white" opacity="0.9"/>
        <ellipse cx="31" cy="21" rx="4" ry="4.5" fill="white" opacity="0.9"/>
        {/* 부리 */}
        <polygon points="24,27 21,31 27,31" fill="#f5a623"/>
      </>
    ),
    koala: (
      <>
        {/* 코알라 귀 - 크고 둥근 귀 */}
        <circle cx="9" cy="16" r="9" fill="#888"/>
        <circle cx="39" cy="16" r="9" fill="#888"/>
        <circle cx="9" cy="16" r="5.5" fill="#aaa" opacity="0.7"/>
        <circle cx="39" cy="16" r="5.5" fill="#aaa" opacity="0.7"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="5" ry="3.5" fill="#333"/>
        <ellipse cx="23" cy="26" rx="2" ry="1.2" fill="rgba(255,255,255,0.3)"/>
      </>
    ),
    frog: (
      <>
        {/* 개구리 눈 - 위에 튀어나온 눈 */}
        <circle cx="15" cy="14" r="6" fill="#4a9e4a"/>
        <circle cx="33" cy="14" r="6" fill="#4a9e4a"/>
        {/* 코 */}
        <circle cx="21" cy="26" r="1.5" fill="#2d6e2d"/>
        <circle cx="27" cy="26" r="1.5" fill="#2d6e2d"/>
      </>
    ),
    owl: (
      <>
        {/* 올빼미 귀 깃털 */}
        <polygon points="13,10 18,20 8,20" fill="#8B6914"/>
        <polygon points="35,10 30,20 40,20" fill="#8B6914"/>
        {/* 눈 주위 원형 */}
        <circle cx="17" cy="22" r="7" fill="#fff5e0" opacity="0.9"/>
        <circle cx="31" cy="22" r="7" fill="#fff5e0" opacity="0.9"/>
        {/* 부리 */}
        <polygon points="24,26 21,30 27,30" fill="#f5a623"/>
      </>
    ),
    duck: (
      <>
        {/* 오리 부리 */}
        <ellipse cx="24" cy="29" rx="6" ry="3" fill="#f5a623"/>
        {/* 볼 */}
        <circle cx="11" cy="26" r="5" fill="#ff9eb5" opacity="0.4"/>
        <circle cx="37" cy="26" r="5" fill="#ff9eb5" opacity="0.4"/>
      </>
    ),
    chick: (
      <>
        {/* 병아리 부리 */}
        <polygon points="24,25 21,29 27,29" fill="#f5a623"/>
        {/* 볼 */}
        <circle cx="11" cy="26" r="5" fill="#ff9eb5" opacity="0.5"/>
        <circle cx="37" cy="26" r="5" fill="#ff9eb5" opacity="0.5"/>
        {/* 정수리 깃털 */}
        <path d="M24 12 Q20 6 22 2 Q24 8 26 2 Q28 6 24 12" fill="#f5c842" opacity="0.9"/>
      </>
    ),
    dragon: (
      <>
        {/* 드래곤 뿔 */}
        <polygon points="14,4 18,18 10,16" fill="#7c3aed"/>
        <polygon points="34,4 30,18 38,16" fill="#7c3aed"/>
        {/* 귀 */}
        <polygon points="8,16 14,22 4,22" fill="#a855f7" opacity="0.8"/>
        <polygon points="40,16 34,22 44,22" fill="#a855f7" opacity="0.8"/>
        {/* 코 */}
        <circle cx="21" cy="27" r="2" fill="#5b21b6"/>
        <circle cx="27" cy="27" r="2" fill="#5b21b6"/>
      </>
    ),
    shiba: (
      <>
        {/* 시바견 귀 - 뾰족한 귀 */}
        <polygon points="11,6 17,20 5,18" fill="#e8932a" stroke="#c57820" strokeWidth="1"/>
        <polygon points="37,6 31,20 43,18" fill="#e8932a" stroke="#c57820" strokeWidth="1"/>
        <polygon points="12,9 16,19 7,18" fill="#fff5e0" opacity="0.8"/>
        <polygon points="36,9 32,19 41,18" fill="#fff5e0" opacity="0.8"/>
        {/* 코 */}
        <ellipse cx="24" cy="27" rx="4" ry="3" fill="#333"/>
        <ellipse cx="23" cy="26" rx="1.5" ry="1" fill="rgba(255,255,255,0.4)"/>
      </>
    ),
    axolotl: (
      <>
        {/* 아홀로틀 아가미 */}
        <path d="M8 16 Q4 10 8 6 Q12 10 10 18" fill="#ff9eb5" opacity="0.8"/>
        <path d="M40 16 Q44 10 40 6 Q36 10 38 18" fill="#ff9eb5" opacity="0.8"/>
        <path d="M12 14 Q8 8 12 4 Q16 8 14 16" fill="#ffb3c6" opacity="0.7"/>
        <path d="M36 14 Q40 8 36 4 Q32 8 34 16" fill="#ffb3c6" opacity="0.7"/>
        {/* 코 */}
        <circle cx="21" cy="27" r="1.5" fill="#c87941"/>
        <circle cx="27" cy="27" r="1.5" fill="#c87941"/>
        {/* 볼 */}
        <circle cx="11" cy="26" r="5" fill="#ff9eb5" opacity="0.4"/>
        <circle cx="37" cy="26" r="5" fill="#ff9eb5" opacity="0.4"/>
      </>
    ),
  };

  return (
    <>
      {animalFeatures[animal]}
      {eyes[expression]}
      {mouths[expression]}
    </>
  );
}

// 액세서리 SVG
function getAccessory(accessory: AccessoryType): React.ReactNode {
  switch (accessory) {
    case 'sunglasses':
      return (
        <g>
          <rect x="11" y="18" width="10" height="7" rx="3" fill="#1a1a2e" stroke="#444" strokeWidth="1"/>
          <rect x="27" y="18" width="10" height="7" rx="3" fill="#1a1a2e" stroke="#444" strokeWidth="1"/>
          <line x1="21" y1="21" x2="27" y2="21" stroke="#444" strokeWidth="1.5"/>
          <line x1="5" y1="20" x2="11" y2="21" stroke="#444" strokeWidth="1.5"/>
          <line x1="37" y1="21" x2="43" y2="20" stroke="#444" strokeWidth="1.5"/>
        </g>
      );
    case 'glasses':
      return (
        <g>
          <rect x="11" y="18" width="10" height="7" rx="3" fill="none" stroke="#888" strokeWidth="1.5"/>
          <rect x="27" y="18" width="10" height="7" rx="3" fill="none" stroke="#888" strokeWidth="1.5"/>
          <line x1="21" y1="21" x2="27" y2="21" stroke="#888" strokeWidth="1.5"/>
          <line x1="5" y1="20" x2="11" y2="21" stroke="#888" strokeWidth="1.5"/>
          <line x1="37" y1="21" x2="43" y2="20" stroke="#888" strokeWidth="1.5"/>
        </g>
      );
    case 'hat':
      return (
        <g>
          <rect x="10" y="8" width="28" height="3" rx="1" fill="#1a1a2e"/>
          <rect x="14" y="0" width="20" height="10" rx="2" fill="#1a1a2e"/>
          <rect x="15" y="1" width="18" height="2" rx="1" fill="#c49a3c" opacity="0.6"/>
        </g>
      );
    case 'cap':
      return (
        <g>
          <path d="M8 16 Q24 4 40 16 Z" fill="#e8732a"/>
          <path d="M8 16 Q24 6 40 16" fill="none" stroke="#c5601e" strokeWidth="1"/>
          <rect x="4" y="15" width="10" height="3" rx="1.5" fill="#c5601e"/>
          {/* 로고 */}
          <circle cx="24" cy="11" r="2" fill="#fff" opacity="0.5"/>
        </g>
      );
    case 'crown':
      return (
        <g>
          <polygon points="8,14 12,4 18,12 24,2 30,12 36,4 40,14" fill="#f5c842" stroke="#c49a3c" strokeWidth="1"/>
          <rect x="8" y="13" width="32" height="5" rx="1" fill="#f5c842" stroke="#c49a3c" strokeWidth="1"/>
          <circle cx="18" cy="8" r="2" fill="#e74c3c"/>
          <circle cx="24" cy="5" r="2" fill="#3498db"/>
          <circle cx="30" cy="8" r="2" fill="#e74c3c"/>
        </g>
      );
    case 'scarf':
      return (
        <g>
          <path d="M8 36 Q24 32 40 36 Q38 42 24 40 Q10 42 8 36 Z" fill="#e74c3c"/>
          <path d="M8 36 Q24 34 40 36" fill="none" stroke="#c0392b" strokeWidth="1"/>
          {/* 매듭 */}
          <ellipse cx="30" cy="38" rx="4" ry="3" fill="#c0392b"/>
          <path d="M30 41 L28 46 M30 41 L32 46" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
        </g>
      );
    case 'headphones':
      return (
        <g>
          <path d="M8 24 Q8 8 24 8 Q40 8 40 24" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round"/>
          <rect x="4" y="22" width="7" height="10" rx="3" fill="#333"/>
          <rect x="37" y="22" width="7" height="10" rx="3" fill="#333"/>
          <rect x="5" y="23" width="5" height="8" rx="2" fill="#00f0ff" opacity="0.6"/>
          <rect x="38" y="23" width="5" height="8" rx="2" fill="#00f0ff" opacity="0.6"/>
        </g>
      );
    case 'bow':
      return (
        <g>
          {/* 리본 */}
          <path d="M16 6 Q24 12 32 6 Q28 10 24 8 Q20 10 16 6 Z" fill="#ff6b9d"/>
          <path d="M16 6 Q20 2 24 8 Q28 2 32 6" fill="#ff6b9d"/>
          <circle cx="24" cy="8" r="3" fill="#ff4081"/>
        </g>
      );
    case 'bandana':
      return (
        <g>
          <path d="M8 20 Q24 14 40 20 L36 28 Q24 24 12 28 Z" fill="#e74c3c" opacity="0.85"/>
          <path d="M8 20 Q24 16 40 20" fill="none" stroke="#c0392b" strokeWidth="1"/>
          {/* 도트 패턴 */}
          <circle cx="16" cy="22" r="1" fill="white" opacity="0.4"/>
          <circle cx="24" cy="20" r="1" fill="white" opacity="0.4"/>
          <circle cx="32" cy="22" r="1" fill="white" opacity="0.4"/>
        </g>
      );
    case 'beanie':
      return (
        <g>
          <path d="M8 18 Q8 4 24 4 Q40 4 40 18 L40 20 Q24 16 8 20 Z" fill="#3498db"/>
          <path d="M8 20 Q24 16 40 20" stroke="#2980b9" strokeWidth="2" fill="none"/>
          <path d="M10 14 Q24 10 38 14" stroke="#2980b9" strokeWidth="1.5" fill="none" opacity="0.5"/>
          {/* 폼폼 */}
          <circle cx="24" cy="4" r="4" fill="#e74c3c"/>
        </g>
      );
    default:
      return null;
  }
}

// 메인 아바타 SVG 컴포넌트
export function AvatarSVG({ config, size = 48, bgColor, showEmoji = true }: AvatarSVGProps) {
  const { animal, accessory, expression, emoji } = config;
  const bg = bgColor || '#1a1a2e';

  // 동물별 기본 몸통 색상
  const bodyColors: Record<AnimalType, string> = {
    cat: '#f9c5d1',
    dog: '#d4a574',
    fox: '#e8732a',
    bear: '#8B6914',
    rabbit: '#f5e6e8',
    panda: '#f0f0f0',
    tiger: '#e8932a',
    lion: '#e8b84b',
    wolf: '#aaa',
    deer: '#d4a574',
    hamster: '#f9c5d1',
    penguin: '#1a1a2e',
    koala: '#888',
    frog: '#4a9e4a',
    owl: '#8B6914',
    duck: '#f5c842',
    chick: '#f5c842',
    dragon: '#7c3aed',
    shiba: '#e8932a',
    axolotl: '#ff9eb5',
  };

  const bodyColor = bodyColors[animal];
  const scale = size / 48;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        style={{ display: 'block' }}
      >
        {/* 배경 원 */}
        <circle cx="24" cy="24" r="23" fill={bg} stroke={`${bg}88`} strokeWidth="1"/>

        {/* 몸통/얼굴 원 */}
        <circle cx="24" cy="26" r="17" fill={bodyColor}/>

        {/* 동물 특징 + 표정 */}
        {getAnimalFace(animal, expression)}

        {/* 액세서리 (표정 위에 렌더링) */}
        {getAccessory(accessory)}
      </svg>

      {/* 이모티콘 말풍선 */}
      {showEmoji && emoji !== 'none' && (
        <div
          style={{
            position: 'absolute',
            top: -size * 0.35,
            right: -size * 0.15,
            fontSize: size * 0.38,
            lineHeight: 1,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
            pointerEvents: 'none',
          }}
        >
          {emoji}
        </div>
      )}
    </div>
  );
}

export default AvatarSVG;
