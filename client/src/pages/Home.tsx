import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const totalSections = 4;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const CAROUSEL_TOTAL = 4;

  // 카운트다운 타이머 — 2026-07-01 기준
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date('2026-07-01T00:00:00+09:00').getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const trackEvent = trpc.log.trackEvent.useMutation();
  const emailSubscribe = trpc.email.subscribe.useMutation();

  const handleTrackEvent = (eventName: string) => {
    trackEvent.mutate({ eventName, page: '/' });
  };

  const handleTrackAndNavigate = async (eventName: string, url: string) => {
    try {
      await trackEvent.mutateAsync({ eventName, page: '/' });
    } catch (_) {}
    window.location.href = url;
  };

  // 스크롤 섹션 감지
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollY = window.scrollY + window.innerHeight / 2;
      let current = 0;
      sections.forEach((section, i) => {
        const top = (section as HTMLElement).offsetTop;
        if (scrollY >= top) current = i;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 카드 자동 슬라이드 — 3초 간격, 터치/마우스 시 일시정지
  useEffect(() => {
    const startAuto = () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setCarouselIndex(i => (i + 1) % CAROUSEL_TOTAL);
        }
      }, 3000);
    };
    startAuto();
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, []);

  const pauseAuto = () => { isPausedRef.current = true; };
  const resumeAuto = () => {
    isPausedRef.current = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("정보 수신 동의가 필요합니다.");
      return;
    }
    try {
      fetch('https://script.google.com/macros/s/AKfycbyZyy0SdTsdYasmg4RkKAqH6gmDGwtQnqQTylfd0DtTlHtM62ikpcqCn-IMbYitS8gc/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      await emailSubscribe.mutateAsync({ email, source: 'landing' });
      handleTrackEvent('click_알림받기_submit');
      toast.success("알림 신청이 완료되었습니다!");
      setEmail("");
      setAgreed(false);
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ─── HERO (풀스크린 이미지 오버레이) ─── */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100svh' }}>
        {/* 배경 이미지 */}
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/hero_map_fc9a2935.png"
          alt="공간 분위기"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.55)' }}
        />
        {/* 오버레이 */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />

        <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center">
          <h1 className="font-black tracking-tighter mb-6" style={{ fontSize: '80px', lineHeight: 1 }}>
            <span className="text-primary">SPOT</span>
          </h1>
          <p className="font-black mb-1 text-white/70" style={{ fontSize: '30px' }}>
            블로그·SNS·리뷰 보다
          </p>
          <p className="font-black mb-2 text-white" style={{ fontSize: '30px' }}>
            <span className="text-primary">실시간 공간 분위기가</span>
          </p>
          <p className="font-black text-white" style={{ fontSize: '30px' }}>
            더 중요하니까.
          </p>
        </div>
      </section>

      {/* ─── PROBLEM (문제인식 스토리텔링) ─── */}

      {/* Step 1 — 블로그/리뷰 검색 배경 */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/problem_bg1_naver_search_ef4d1485.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.80)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-24" style={{ minHeight: '65vh' }}>
          <p className="text-white/40 font-bold mb-6 tracking-widest" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>THE PROBLEM</p>
          <p className="font-black text-white/60 mb-3" style={{ fontSize: '20px', lineHeight: 1.6 }}>
            우린 여행지·맛집을 찾을 때
          </p>
          <p className="font-black text-white" style={{ fontSize: '24px', lineHeight: 1.5 }}>
            블로그·SNS·리뷰를 찾습니다.
          </p>
          <p className="font-black mt-5" style={{ fontSize: '20px', lineHeight: 1.5, color: 'oklch(0.75 0.18 195)' }}>
            그러곤  실제 방문 후 종종 실망합니다.
          </p>
        </div>
      </section>

      {/* Step 2 — 인스타그램 연출 사진 배경 */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/problem_bg2_insta_d29081c1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-24" style={{ minHeight: '65vh' }}>
          <p className="font-black text-white/60 mb-3" style={{ fontSize: '25px', lineHeight: 1.6 }}>
            분명 사진에선 이뻤고
          </p>
          <p className="font-black text-white/60 mb-3" style={{ fontSize: '25px', lineHeight: 1.6 }}>
            나와 맞는 공간이고
          </p>
          <p className="font-black text-white" style={{ fontSize: '26px', lineHeight: 1.5 }}>
            리뷰와 평점도 완벽했는데.
          </p>
          <p className="font-black mt-8" style={{ fontSize: '30px', lineHeight: 1.4, color: 'oklch(0.75 0.18 195)' }}>
            왜 그럴까요?
          </p>
        </div>
      </section>

      {/* Step 3 — 문제 폭로 + 해결 (배경 없음) */}
      <section className="relative overflow-hidden bg-background">
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-24" style={{ minHeight: '65vh' }}>
          <p className="font-black text-foreground/60 mb-3" style={{ fontSize: '20px', lineHeight: 1.6 }}>
            블로그·SNS·리뷰는
          </p>
          <p className="font-black text-foreground" style={{ fontSize: '28px', lineHeight: 1.5 }}>
            광고와 과거의 모습이지
          </p>
          <p className="font-black mt-2 text-foreground/60" style={{ fontSize: '20px', lineHeight: 1.6 }}>
            지금 이 순간의 분위기가 아닙니다.
          </p>
          <p className="font-black mt-6 text-foreground" style={{ fontSize: '22px', lineHeight: 1.5 }}>
            가장 중요한 건 실시간의 모습.
          </p>
          <div className="mt-10 w-12 h-px bg-foreground/20 mx-auto" />
          <p className="font-black mt-8" style={{ fontSize: '40px', lineHeight: 1.4 }}>
            그래서 <span style={{ color: 'oklch(0.75 0.18 195)' }}>SPOT.</span>
          </p>
        </div>
      </section>


      {/* ─── CAROUSEL ─── */}
      <section className="relative py-0 overflow-hidden border-t border-border">
        <div className="relative z-10 max-w-sm mx-auto">
          {/* 카드 상단 효익 문구 */}
          <p className="text-center text-sm pt-4 pb-2 px-4" style={{ color: '#f8f8f7' }}>
            방문자 수 · 실시간 사진 · 사용자 유형으로<br />
            <span style={{ color: '#f8f8f7' }}>실시간 공간 분위기를 탐색해보세요.</span>
          </p>

          <div className="relative">
            <div
              ref={carouselRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; pauseAuto(); }}
              onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
              onTouchEnd={() => {
                if (touchStartX.current === null || touchEndX.current === null) { resumeAuto(); return; }
                const diff = touchStartX.current - touchEndX.current;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) setCarouselIndex(i => Math.min(i + 1, CAROUSEL_TOTAL - 1));
                  else setCarouselIndex(i => Math.max(i - 1, 0));
                }
                touchStartX.current = null;
                touchEndX.current = null;
                resumeAuto();
              }}
              onMouseDown={(e) => { touchStartX.current = e.clientX; pauseAuto(); }}
              onMouseMove={(e) => { if (touchStartX.current !== null) touchEndX.current = e.clientX; }}
              onMouseUp={() => {
                if (touchStartX.current === null || touchEndX.current === null) { resumeAuto(); return; }
                const diff = touchStartX.current - touchEndX.current;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) setCarouselIndex(i => Math.min(i + 1, CAROUSEL_TOTAL - 1));
                  else setCarouselIndex(i => Math.max(i - 1, 0));
                }
                touchStartX.current = null;
                touchEndX.current = null;
                resumeAuto();
              }}
              onMouseLeave={() => { touchStartX.current = null; touchEndX.current = null; resumeAuto(); }}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {/* Card 0 */}
                <div className="w-full flex-shrink-0 p-2">
                  <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp19_034cedbc.png"
                      alt="스포리 팝업"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-primary">#ZOOM: MOOD</h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        MBTI·MOOD·MODE·SIGN.<br />
                        <span className="text-white">지금 그 공간의 분위기.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 1 */}
                <div className="w-full flex-shrink-0 p-2">
                  <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp14_346f6aa9.png"
                      alt="서울 전체 지도"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-secondary">#ZOOM: EXPLORE</h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        지금 어디에 몇 명이 모였는지.<br />
                        <span className="text-white">실시간 흐름을 한눈에.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="w-full flex-shrink-0 p-2">
                  <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp15_7bd1c973.png"
                      alt="INFP 팝업"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-accent">#ZOOM: REAL-TIME VIEW</h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        마커로 보는 해당 사람·공간의 지금.<br />
                        <span className="text-white">SPOTLIGHT로 누구보다 정확히.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="w-full flex-shrink-0 p-2">
                  <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp17_43341ade.png"
                      alt="스팟 등록 폼"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-primary">#ZOOM: ACTIVITY</h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        이젠 실망했던 실제모습이 아닌 공유하고 싶은 현장을.<br />
                        <span className="text-white">지도 위에 나만의 마커를.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 왼쪽 화살표 */}
            <button
              onClick={() => setCarouselIndex(i => Math.max(i - 1, 0))}
              disabled={carouselIndex === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all disabled:opacity-0"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
              aria-label="이전 카드"
            >‹</button>

            {/* 오른쪽 화살표 */}
            <button
              onClick={() => setCarouselIndex(i => Math.min(i + 1, CAROUSEL_TOTAL - 1))}
              disabled={carouselIndex === CAROUSEL_TOTAL - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all disabled:opacity-0"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
              aria-label="다음 카드"
            >›</button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 py-4">
            {Array.from({ length: CAROUSEL_TOTAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                style={{
                  width: carouselIndex === i ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: carouselIndex === i ? 'oklch(0.8 0.15 195)' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                aria-label={`카드 ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── BETA + FINAL CTA (통합) ─── */}
      <section className="relative py-16 px-6 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
          <p className="font-black" style={{ fontSize: '26px' }}>
            이젠 과거의 선택이 아닌
          </p>
          <p className="font-black text-primary" style={{ fontSize: '34px' }}>
            실시간의 탐색을.
          </p>

          {/* 카운트다운 타이머 */}
          <div>
            <p className="text-muted-foreground mb-3" style={{ fontSize: '13px', letterSpacing: '0.1em' }}>
              26.07. BETA SERVICE LAUNCH
            </p>
            <div className="flex justify-center gap-3">
              {[
                { value: countdown.days, label: 'DAYS' },
                { value: countdown.hours, label: 'HRS' },
                { value: countdown.minutes, label: 'MIN' },
                { value: countdown.seconds, label: 'SEC' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className="rounded-lg font-black text-primary tabular-nums"
                    style={{
                      fontSize: '28px',
                      minWidth: '52px',
                      background: 'oklch(0.15 0.02 195)',
                      border: '1px solid oklch(0.8 0.15 195 / 0.25)',
                      padding: '6px 0',
                    }}
                  >
                    {String(value).padStart(2, '0')}
                  </div>
                  <span className="text-muted-foreground mt-1" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA 단일화 — 출시 알림 받기 */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-10 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary transition-all hover:scale-105"
                onClick={() => handleTrackEvent('click_출시알림')}
              >
                출시 알림 받기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[360px] bg-background border-2 border-primary">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-center mb-2">알림 받기</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                <div className="flex items-start gap-3 px-2">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 mt-1 rounded border-2 border-primary/50 bg-background checked:bg-primary checked:border-primary cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="agreement" className="text-sm text-muted-foreground cursor-pointer select-none leading-relaxed">
                    서비스 출시 정보 수신에 동의합니다.
                  </label>
                </div>
                <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-primary/50 focus:border-primary text-center text-base py-5"
                />
                <Button
                  type="submit"
                  className="w-full py-5 text-base font-black border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  알림 받기
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* ─── 하단 고정 CTA 바 ─── */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '12px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <button
          style={{
            width: '100%',
            maxWidth: '384px',
            height: '52px',
            fontSize: '16px',
            fontWeight: 900,
            border: '2px solid oklch(0.7 0.25 195)',
            background: 'rgba(0, 210, 220, 0.1)',
            color: 'oklch(0.7 0.25 195)',
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
          onClick={() => handleTrackAndNavigate('click_mvp_sticky_cta', '/mvp')}
        >
          SPOT으로 확인하기
        </button>
      </div>

      {/* Scroll Dot Indicator */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[6px]">
        {Array.from({ length: totalSections }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const sections = document.querySelectorAll('section');
              sections[i]?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="transition-all duration-300"
            style={{
              width: activeSection === i ? '6px' : '4px',
              height: activeSection === i ? '6px' : '4px',
              borderRadius: '50%',
              background: activeSection === i ? 'oklch(0.8 0.15 195)' : 'rgba(255,255,255,0.35)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'block',
            }}
            aria-label={`섹션 ${i + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
