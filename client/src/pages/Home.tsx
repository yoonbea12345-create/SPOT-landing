import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const totalSections = 8;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const CAROUSEL_TOTAL = 4;

  // Tracking
  const trackEvent = trpc.log.trackEvent.useMutation();
  const emailSubscribe = trpc.email.subscribe.useMutation();
  // 체류 시간 기록은 useAccessLog에서 통합 처리

  const handleTrackEvent = (eventName: string) => {
    trackEvent.mutate({ eventName, page: '/' });
  };

  // 이벤트 기록 후 페이지 이동 (기록이 날아가기 전에 이동하는 문제 방지)
  const handleTrackAndNavigate = async (eventName: string, url: string) => {
    try {
      await trackEvent.mutateAsync({ eventName, page: '/' });
    } catch (_) {
      // 실패해도 이동은 진행
    }
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
      // Google Script에도 전송 (기존 유지)
      fetch('https://script.google.com/macros/s/AKfycbyZyy0SdTsdYasmg4RkKAqH6gmDGwtQnqQTylfd0DtTlHtM62ikpcqCn-IMbYitS8gc/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      // DB에도 저장
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
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 md:px-8 py-12 overflow-hidden" style={{minHeight: '70vh'}}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-black text-6xl md:text-8xl mb-8 tracking-tighter">
            <span className="text-primary">SPOT</span>
          </h1>

          <div className="space-y-6 mb-12">
            <h2 className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '24px'}}>
              이젠 연출된 사진도 리뷰도 아닌<br />
              <span className="text-primary">실시간의 탐색을.</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              지금, 모든 지역의 실시간 <br />
              모습을 탐색해보세요.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Button 
              className="px-12 py-7 text-xl font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary transition-all hover:scale-105"
              onClick={() => handleTrackAndNavigate('click_보러가기_hero', '/mvp')}
            >
              보러 가기
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Recognition Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 bg-card/50 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="space-y-8 text-center">
            <p className="text-3xl md:text-5xl font-black leading-tight" style={{fontSize: '34px'}}>
             사진에선 예뻤지만<span className="text-secondary">실제는.</span> 다르다.
            </p>
            </p>

            <div className="pt-4">
              <p className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '30px'}}>
                연출된 콘텐츠와 실제공간은<br /> 때때로<span className="text-primary">다른 공간.</span>       
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="space-y-10 text-center">
            <h2 className="text-5xl md:text-7xl font-black leading-tight" style={{fontSize: '42px'}}>
              정보는 넘치는데
            </h2>
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '22px', color: '#f1f2f2'}}>
                리뷰와 평점은 <span className="text-foreground font-black">광고 혹은 과거</span>.
              </p>
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '22px', color: '#f2f1f2'}}>
                인스타그램은 <span className="text-foreground font-black">연출.</span>
              </p>
              <p className="text-3xl md:text-4xl font-black leading-tight" style={{fontSize: '28px'}}>
                <span className="text-secondary">가장 중요한건 해당 지점의 연출없는 실시간의 모습.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="space-y-10 text-center">
            <h2 className="text-5xl md:text-7xl font-black leading-tight" style={{fontSize: '42px'}}>
              그래서 <span className="text-primary">SPOT</span>
            </h2>
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '22px', color: '#f3f3f3'}}>
                과거도, 연출도 아닌
              </p>
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '22px', color: '#f3f3f3'}}>
                <span className="text-foreground font-black">그저 지금의 공간</span>을 제시합니다.
              </p>
              <p className="text-3xl md:text-4xl font-black leading-tight" style={{fontSize: '26px', color: '#f7f7f7'}}>
                <span className="text-primary font-black">지금의 공간을 보여주는 서비스.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2-View System Section */}
      <section className="relative py-0 overflow-hidden">
        <div className="relative z-10 max-w-sm mx-auto">
          {/* PC/모바일 통합 캐러셀 */}
          <div className="mb-0">
            {/* 캐러셀 + 화살표 오버레이 래퍼 */}
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
                  {/* Card 0 - ZOOM:Reality */}
                  <div className="w-full flex-shrink-0 p-2">
                    <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/spotmbti-unzs4ztv.manus.space_mvp(3)_0a7d4ede.png"
                        alt="Reality View"
                        className="w-full object-cover object-top"
                        style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                        <h3 className="text-xl font-black mb-1 text-primary">#ZOOM:Reality</h3>
                        <p className="text-sm leading-relaxed text-white/80">
                          연출도, 광고도 아닌.<br /><span className="text-primary">지금 이 순간의 모습.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Card 1 - ZOOM:WIDE */}
                  <div className="w-full flex-shrink-0 p-2">
                    <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/spotmbti-unzs4ztv.manus.space_mvp(5)_03939046.png"
                        alt="Wide View"
                        className="w-full object-cover object-top"
                        style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                        <h3 className="text-xl font-black mb-1 text-secondary">#ZOOM:WIDE</h3>
                        <p className="text-sm leading-relaxed text-white/80">
                          지금 어디에 어떤 사람들이 있는지.<br /><span className="text-secondary">실시간의 흐름 탐색을.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Card 2 - ZOOM:NEAR */}
                  <div className="w-full flex-shrink-0 p-2">
                    <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/spotmbti-unzs4ztv.manus.space_mvp(4)_b3e41202.png"
                        alt="Near View"
                        className="w-full object-cover object-top"
                        style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                        <h3 className="text-xl font-black mb-1 text-accent">#ZOOM:NEAR</h3>
                        <p className="text-sm leading-relaxed text-white/80">
                          해당 지점에 어떤 사람들이 얼마나 있는지.<br /><span className="text-accent">실제 분위기를 탐색.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Card 3 - ZOOM:3M */}
                  <div className="w-full flex-shrink-0 p-2">
                    <div className="relative overflow-hidden rounded-2xl bg-black shadow-lg">
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663349269149/Unzs4ztvsFWb6bAqqUL6Mc/spotmbti-unzs4ztv.manus.space_mvp(6)_3aad8ccb.png"
                        alt="Register View"
                        className="w-full object-cover object-top"
                        style={{ aspectRatio: '9/16', maxHeight: '75vh' }}
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
                        <h3 className="text-xl font-black mb-1 text-primary">#ZOOM:3M</h3>
                        <p className="text-sm leading-relaxed text-white/80">
                         이젠 실망한 모습이 아닌.<br /><span className="text-primary">공유하고 싶은 현장을.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 왼쪽 화살표 오버레이 */}
              <button
                onClick={() => setCarouselIndex(i => Math.max(i - 1, 0))}
                disabled={carouselIndex === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all disabled:opacity-0"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
                aria-label="이전 카드"
              >
                ‹
              </button>
              {/* 오른쪽 화살표 오버레이 */}
              <button
                onClick={() => setCarouselIndex(i => Math.min(i + 1, CAROUSEL_TOTAL - 1))}
                disabled={carouselIndex === CAROUSEL_TOTAL - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all disabled:opacity-0"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
                aria-label="다음 카드"
              >
                ›
              </button>
            </div>

            {/* Carousel dots */}
            <div className="flex justify-center gap-2 py-4">
              {Array.from({ length: CAROUSEL_TOTAL }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  style={{
                    width: carouselIndex === i ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: carouselIndex === i
                      ? 'oklch(0.8 0.15 195)'
                      : 'rgba(255,255,255,0.3)',
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
        </div>
      </section>

  
      {/* Beta Announcement Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="space-y-6 mb-10">
            <p className="text-4xl md:text-6xl font-black leading-tight">
              26.07.BETA SERVICE LAUNCH.
            </p>
          
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="mt-2 px-12 py-7 text-xl font-black border-2 border-secondary bg-transparent hover:bg-secondary/10 text-secondary transition-all hover:scale-105"
                onClick={() => handleTrackEvent('click_출시알림')}
              >
                출시 알림 받기
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[360px] bg-background border-2 border-primary">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black text-center mb-2">
                  알림 받기
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                {/* 개인정보 수신 동의 체크박스 */}
                <div className="flex items-center gap-3 px-2">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-primary/50 bg-background checked:bg-primary checked:border-primary cursor-pointer flex-shrink-0"
                  />
                  <label
                    htmlFor="agreement"
                    className="text-xs text-muted-foreground cursor-pointer select-none" style={{fontSize: '18px', lineHeight: '1.2'}}
                  >
                    서비스의 정식 출시 정보를<br />
                    담은 정보 수신에 동의합니다.
                  </label>
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 border-primary/50 focus:border-primary text-center text-lg py-6"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg font-black border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary"
                  onClick={() => handleTrackEvent('click_알림받기_제출')}
                >
                  알림 받기
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="space-y-6 mb-10">
            <p className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '36px'}}>
              이젠 과거로부터의 선택에서 
            <p className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '36px'}}>
              <span className="text-primary">실시간의 탐색을.</span>
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              className="px-12 py-7 text-xl font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary transition-all hover:scale-105"
              onClick={() => handleTrackAndNavigate('click_보러가기_cta', '/mvp')}
            >
              보러 가기
            </Button>
          </div>
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
              background: activeSection === i
                ? 'oklch(0.8 0.15 195)'
                : 'rgba(255,255,255,0.35)',
              boxShadow: activeSection === i
                ? '0 0 6px 1px oklch(0.8 0.15 195)'
                : 'none',
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
