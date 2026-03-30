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
  const totalSections = 6;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const CAROUSEL_TOTAL = 4;

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

      {/* ─── HERO ─── */}
      <section className="relative flex items-center justify-center px-6 overflow-hidden" style={{ minHeight: '75vh' }}>
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <h1 className="font-black tracking-tighter mb-10" style={{ fontSize: '72px', lineHeight: 1 }}>
            <span className="text-primary">SPOT</span>
          </h1>

          {/* 3줄 문구 — 크기 점층적으로 커짐 */}
          <p className="font-medium text-muted-foreground mb-2" style={{ fontSize: '18px', letterSpacing: '0.02em' }}>
            연출된 리뷰, 평점, 사진보다
          </p>
          <p className="font-black mb-2" style={{ fontSize: '26px' }}>
            실시간 공간 분위기 정보가
          </p>
          <p className="font-black text-primary mb-12" style={{ fontSize: '30px' }}>
            더 중요하니까.
          </p>

          <Button
            className="px-10 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary transition-all hover:scale-105"
            onClick={() => handleTrackAndNavigate('click_보러가기_hero', '/mvp')}
          >
            지금 확인하기
          </Button>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="relative py-16 px-6 bg-card/40 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full filter blur-3xl animate-pulse" />
        </div>
        <div className="relative z-10 max-w-lg mx-auto text-center space-y-5">
          <p className="font-black leading-tight" style={{ fontSize: '28px' }}>
            리뷰, 평점, 사진은
          </p>
          <p className="font-black leading-tight text-secondary" style={{ fontSize: '28px' }}>
            실시간 공간을 못 담기에
          </p>
          <p className="font-black leading-tight pt-2" style={{ fontSize: '28px', whiteSpace: 'nowrap' }}>
            <span className="text-primary">SPOT</span>이 새롭게 시작합니다.
          </p>
        </div>
      </section>

      {/* ─── CAROUSEL ─── */}
      <section className="relative py-0 overflow-hidden border-t border-border">
        <div className="relative z-10 max-w-sm mx-auto">
          <div className="relative">
            <div
              ref={carouselRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
              onTouchEnd={() => {
                if (touchStartX.current === null || touchEndX.current === null) return;
                const diff = touchStartX.current - touchEndX.current;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) setCarouselIndex(i => Math.min(i + 1, CAROUSEL_TOTAL - 1));
                  else setCarouselIndex(i => Math.max(i - 1, 0));
                }
                touchStartX.current = null;
                touchEndX.current = null;
              }}
              onMouseDown={(e) => { touchStartX.current = e.clientX; }}
              onMouseMove={(e) => { if (touchStartX.current !== null) touchEndX.current = e.clientX; }}
              onMouseUp={() => {
                if (touchStartX.current === null || touchEndX.current === null) return;
                const diff = touchStartX.current - touchEndX.current;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) setCarouselIndex(i => Math.min(i + 1, CAROUSEL_TOTAL - 1));
                  else setCarouselIndex(i => Math.max(i - 1, 0));
                }
                touchStartX.current = null;
                touchEndX.current = null;
              }}
              onMouseLeave={() => { touchStartX.current = null; touchEndX.current = null; }}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {/* Card 0 */}
                <div className="w-full flex-shrink-0 p-2">
                  <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp19_e5c120f8.png"
                      alt="스포리 팝업"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-primary">#SPOT:INFO</h3>
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
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp14_491996bc.png"
                      alt="서울 전체 지도"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-secondary">#SPOT:WIDE</h3>
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
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp15_0534eb38.png"
                      alt="INFP 팝업"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-accent">#SPOT:NEAR</h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        마커로 보는 해당 사람, 공간의 지금.<br />
                        <span className="text-white">SPOTLIGHT로 누구보다 정확히.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="w-full flex-shrink-0 p-2">
                  <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/mvp17_b95ae4f4.png"
                      alt="스팟 등록 폼"
                      className="w-full object-cover object-top"
                      style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                      <h3 className="text-xl font-black mb-1 text-primary">#SPOT:ME</h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        이젠 실망한 모습에서 공유하고 싶은 현장을.<br />
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

      {/* ─── BETA CTA ─── */}
      <section className="relative py-16 px-6 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
          <p className="font-black" style={{ fontSize: '32px' }}>
            26.07. BETA SERVICE LAUNCH
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-10 py-6 text-base font-black border-2 border-secondary bg-transparent hover:bg-secondary/10 text-secondary transition-all hover:scale-105"
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

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-16 px-6 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative z-10 max-w-lg mx-auto text-center space-y-8">
          <div className="space-y-3">
            <p className="font-medium text-muted-foreground" style={{ fontSize: '18px' }}>
              이젠 과거로부터의 선택이 아닌
            </p>
            <p className="font-black text-primary" style={{ fontSize: '34px' }}>
              실시간의 탐색을.
            </p>
          </div>
          <Button
            className="px-12 py-7 text-xl font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary transition-all hover:scale-105"
            onClick={() => handleTrackAndNavigate('click_보러가기_cta', '/mvp')}
          >
            보러 가기
          </Button>
        </div>
      </section>

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
