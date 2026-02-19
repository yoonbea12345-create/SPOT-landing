# 🚀 SPOT 프로젝트 작업 가이드

## 📁 파일 구조

```
client/src/pages/
├── Home.tsx          → 랜딩 페이지 (Manus AI가 관리)
├── MvpMap.tsx        → 지도 MVP 페이지 (사용자가 관리)
└── NotFound.tsx      → 404 페이지
```

## 🎯 라우팅

- `/` → 랜딩 페이지 (Home.tsx)
- `/mvp` → 지도 MVP (MvpMap.tsx)

## ⚠️ 충돌 방지 규칙

### 사용자 (VS Code 작업)
- ✅ **수정 가능**: `client/src/pages/MvpMap.tsx`
- ❌ **수정 금지**: `client/src/pages/Home.tsx`

### Manus AI
- ✅ **수정 가능**: `client/src/pages/Home.tsx`
- ❌ **수정 금지**: `client/src/pages/MvpMap.tsx`

## 📝 작업 흐름

### 1. 사용자 작업 시작
```bash
git pull origin main
# MvpMap.tsx 파일만 수정
git add client/src/pages/MvpMap.tsx
git commit -m "feat: 지도 MVP 업데이트"
git push origin main
```

### 2. Manus AI 작업
- Home.tsx (랜딩 페이지)만 수정
- 자동으로 GitHub에 동기화

### 3. 충돌 발생 시
- 각자 맡은 파일만 수정했다면 자동 병합됨
- 문제 발생 시 Manus AI에게 "GitHub 동기화" 요청

## 🔗 버튼 연결

랜딩 페이지의 CTA 버튼들은 `/mvp` 경로로 연결되어 있습니다:
- "내 주변 확인하기" → https://spot-landing-6oai.vercel.app/mvp
- "내 주변 MBTI 보기" → https://spot-landing-6oai.vercel.app/mvp

## 💡 팁

- `MvpMap.tsx`에서 지도 컴포넌트를 자유롭게 개발하세요
- 스타일은 inline styles 또는 Tailwind CSS 사용 가능
- 필요한 패키지는 `pnpm add` 로 설치하세요
