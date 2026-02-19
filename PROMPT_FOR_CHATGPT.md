# 🚨 중요: ChatGPT에게 전달할 프롬프트

아래 내용을 ChatGPT에게 복사해서 붙여넣으세요:

---

# SPOT 프로젝트 - 지도 MVP 개발 가이드

## 📌 현재 상황

이 프로젝트는 **두 명이 협업** 중입니다:
- **Manus AI**: 랜딩 페이지 (`Home.tsx`) 담당
- **나 (사용자)**: 지도 MVP (`MvpMap.tsx`) 담당

**충돌 방지를 위해 파일이 완전히 분리되었습니다.**

---

## 🚫 절대 규칙

### ❌ 절대 수정하면 안 되는 파일:
- `client/src/pages/Home.tsx` (랜딩 페이지 - Manus AI 전용)
- `client/src/App.tsx` (라우팅 설정 - 이미 완료됨)

### ✅ 내가 수정할 수 있는 파일:
- `client/src/pages/MvpMap.tsx` (지도 MVP - 이 파일만 수정!)
- 새로 만드는 컴포넌트 파일들 (예: `client/src/components/Map/...`)

---

## 📁 현재 프로젝트 구조

```
spot-landing/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          ← 랜딩 페이지 (건드리지 말 것!)
│   │   │   ├── MvpMap.tsx        ← 지도 MVP (여기만 수정!)
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   └── ui/               ← shadcn/ui 컴포넌트
│   │   ├── App.tsx               ← 라우팅 (건드리지 말 것!)
│   │   └── index.css
│   └── public/
├── package.json
└── WORK_GUIDE.md                 ← 작업 가이드 문서
```

---

## 🎯 라우팅 구조 (이미 설정 완료)

- `/` → 랜딩 페이지 (`Home.tsx`)
- `/mvp` → 지도 MVP (`MvpMap.tsx`) ← 여기서 작업!

---

## 📝 MvpMap.tsx 현재 상태

현재 `client/src/pages/MvpMap.tsx`는 기본 템플릿만 있는 상태입니다:

```tsx
import React from "react";

export default function MvpMap() {
  return (
    <div style={wrap}>
      <div style={card}>
        <div style={brand}>SPOT</div>
        <div style={headline}>내 주변 MBTI 분포, 지금 바로</div>
        {/* ... 기본 템플릿 ... */}
      </div>
      <div style={bgGlow} />
    </div>
  );
}
```

**이 파일을 지도 MVP로 개발해야 합니다.**

---

## 🛠️ 기술 스택

- **프레임워크**: React 19 + TypeScript
- **스타일링**: Tailwind CSS 4 + inline styles
- **라우팅**: Wouter
- **패키지 관리자**: pnpm
- **UI 컴포넌트**: shadcn/ui (이미 설치됨)

---

## ✅ 작업 지침

### 1. 파일 수정 규칙
```bash
# ✅ 이것만 수정하세요
client/src/pages/MvpMap.tsx

# ✅ 필요하면 새 컴포넌트 생성 가능
client/src/components/Map/MapView.tsx
client/src/components/Map/MBTIMarker.tsx

# ❌ 절대 수정 금지
client/src/pages/Home.tsx
client/src/App.tsx
```

### 2. Git 커밋 규칙
```bash
# 작업 시작 전 항상 pull
git pull origin main

# MvpMap.tsx만 커밋
git add client/src/pages/MvpMap.tsx
git commit -m "feat: 지도 MVP 기능 추가"
git push origin main

# ❌ Home.tsx를 절대 add 하지 마세요!
```

### 3. 코드 작성 시 주의사항
- `MvpMap.tsx` 파일의 전체 코드를 제공할 때, **파일 전체를 덮어쓸 수 있도록** 완전한 코드를 제공하세요
- import 문부터 export까지 모든 코드를 포함하세요
- Tailwind CSS 클래스 또는 inline styles 사용 가능
- shadcn/ui 컴포넌트 사용 가능 (예: Button, Card, Dialog 등)

---

## 🎨 디자인 가이드

현재 프로젝트의 디자인 테마:
- **다크 모드**: 배경 `#07070a`
- **메인 컬러**: 
  - Cyan (primary): `#00F0FF`
  - Magenta (secondary): `#FF006E`
- **폰트**: 굵은 폰트 (font-weight: 950)
- **스타일**: Neo-Brutalism Digital Street Culture

지도 MVP도 이 디자인 테마를 따라주세요.

---

## 📦 설치된 주요 패키지

```json
{
  "react": "^19.x",
  "typescript": "^5.x",
  "tailwindcss": "^4.x",
  "wouter": "^3.x",
  "shadcn/ui": "설치됨"
}
```

추가 패키지가 필요하면:
```bash
pnpm add [패키지명]
```

---

## 🚀 개발 서버

```bash
# 개발 서버 실행 (이미 실행 중일 수 있음)
pnpm dev

# 로컬: http://localhost:3000/mvp
```

---

## 💡 요청 사항

**내가 요청할 때마다 다음을 지켜주세요:**

1. **오직 `MvpMap.tsx` 파일만 수정**
2. **전체 파일 코드를 제공** (부분 코드 말고)
3. **Home.tsx는 절대 언급하지 말 것**
4. **App.tsx 라우팅은 이미 설정되어 있으니 건드리지 말 것**
5. **코드 제공 시 파일 경로를 명확히 표시**: 
   ```
   파일: client/src/pages/MvpMap.tsx
   ```

---

## 🎯 지금 해야 할 일

나는 지금부터 **지도 MVP 기능을 개발**하려고 합니다.

`client/src/pages/MvpMap.tsx` 파일에:
- 카카오맵 또는 구글맵 통합
- MBTI 마커 표시
- 실시간 위치 기반 기능
- 등등...

**이 내용을 이해했다면, "MvpMap.tsx 파일 수정 준비 완료. 어떤 기능을 추가할까요?"라고 답변해주세요.**

---

## 📚 참고 문서

프로젝트 루트의 `WORK_GUIDE.md` 파일에 더 자세한 내용이 있습니다.
