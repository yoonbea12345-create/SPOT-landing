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
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const CAROUSEL_TOTAL = 3;

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
              지금, 사람으로 도시를 읽어보세요.
              
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              지도에서 발견하는 도시의 진짜 분위기
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
              블로그는 말합니다. <br /> 여기가<span className="text-secondary"> 핫플이라고.</span>
            </p>

            <p className="text-3xl md:text-5xl font-black leading-tight" style={{fontSize: '34px'}}>
              인스타는 보여줍니다.<br />
              여기가<span className="text-secondary"> 예쁘다고.</span>
            </p>

            <div className="pt-4">
              <p className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '30px'}}>
                과연, <span className="text-primary">실제</span>로도 그럴까요?       
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="space-y-10 text-center">
            <h2 className="text-5xl md:text-7xl font-black leading-tight" style={{fontSize: '42px'}}>
              더이상 <span style={{color: '#f1f2f1'}}>속지</span> 마세요.
            </h2>
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '22px', color: '#f1f2f2'}}>
                리뷰는 <span className="text-foreground font-black">과거</span>, 사진은 <span className="text-foreground font-black">연출</span>입니다.
              </p>
              <p className="text-2xl md:text-3xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '22px', color: '#f2f1f2'}}>
                그래서 실제로 가보면
              </p>
              <p className="text-3xl md:text-4xl font-black leading-tight" style={{fontSize: '28px'}}>
                <span className="text-secondary">"생각보다 별론데?"</span>
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
              그래서 <span className="text-primary">SPOT.</span>
            </h2>
            <div className="space-y-6">
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '20px', color: '#f3f3f3'}}>
                SPOT은 해당공간에 <span className="text-foreground font-black">위치한 사람</span>들을 <br />통해 공간을 보여주는
              </p>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '20px', color: '#f7f7f7'}}>
                <span className="text-primary font-black">지도 기반 소셜 플랫폼</span>입니다.
              </p>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-muted-foreground" style={{fontSize: '18px', color: '#f6f7f7'}}>
                이젠, 사람들의 <span className="text-foreground font-black">실제 분포</span>와 <span className="text-foreground font-black">분위기</span>를 통해<br />
                공간을 파악하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2-View System Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-10 text-center" style={{fontSize: '33px'}}>
            같은 <span className="text-secondary">지도</span>,  다른 <span className="text-primary">정보</span>
          </h2>

          {/* Desktop: 3-column grid / Mobile: swipe carousel */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-6">
            {/* Card 1 - Wide View */}
            <div className="p-4 border-2 border-primary bg-background/50 hover:bg-background/80 transition-colors rounded-lg">
              <div className="mb-4 rounded-md">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/jejsdBJgIKarYQRp.png"
                  alt="Wide View"
                  className="w-full h-auto border border-primary/30 rounded-md"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-black mb-2 text-primary">#ZOOM:WIDE</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
               오늘의 흐름이 보입니다. <span className="text-primary"><br />어디로 모였는지.</span>
              </p>
            </div>
            {/* Card 2 - Near View */}
            <div className="p-4 border-2 border-secondary bg-background/50 hover:bg-background/80 transition-colors rounded-lg">
              <div className="mb-4 rounded-md">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/FbSOHHCIytgRidsM.png"
                  alt="Near View"
                  className="w-full h-auto border border-secondary/30 rounded-md"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-black mb-2 text-secondary">#ZOOM:NEAR</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
               나와 같은 MBTI들은. <br /><span className="text-secondary">어디서, 무엇을 하고 있을까.</span>
              </p>
            </div>
            {/* Card 3 - Ultra Near */}
            <div className="p-4 border-2 border-accent bg-background/50 hover:bg-background/80 transition-colors rounded-lg">
              <div className="mb-4 rounded-md">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/YakrPBGTkUyXeEIk.png"
                  alt="Register View"
                  className="w-full h-auto border border-accent/30 rounded-md"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-black mb-2 text-accent">#ZOOM:3M</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                지도에 내 위치를 표시해보세요. <span className="text-primary"><br />MBTI, 기분, 느낌, 원하는 것 무엇이든.</span>
              </p>
            </div>
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden mb-4">
            <div
              ref={carouselRef}
              className="overflow-hidden"
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
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {/* Mobile Card 1 */}
                <div className="w-full flex-shrink-0 p-4 border-2 border-primary bg-background/50 rounded-lg">
                  <div className="mb-4 rounded-md">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/jejsdBJgIKarYQRp.png"
                      alt="Wide View"
                      className="w-full h-auto border border-primary/30 rounded-md"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-primary">#ZOOM:WIDE</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    오늘의 흐름이 보입니다. <span className="text-primary"><br />어디로 모였는지.</span>
                  </p>
                </div>
                {/* Mobile Card 2 */}
                <div className="w-full flex-shrink-0 p-4 border-2 border-secondary bg-background/50 rounded-lg">
                  <div className="mb-4 rounded-md">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/FbSOHHCIytgRidsM.png"
                      alt="Near View"
                      className="w-full h-auto border border-secondary/30 rounded-md"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-secondary">#ZOOM:NEAR</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    나와 같은 MBTI들은. <br /><span className="text-secondary">어디서, 무엇을 하고 있을까.</span>
                  </p>
                </div>
                {/* Mobile Card 3 */}
                <div className="w-full flex-shrink-0 p-4 border-2 border-accent bg-background/50 rounded-lg">
                  <div className="mb-4 rounded-md">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/YakrPBGTkUyXeEIk.png"
                      alt="Register View"
                      className="w-full h-auto border border-accent/30 rounded-md"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-accent">#ZOOM:3M</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    지도에 내 위치를 표시해보세요. <span className="text-primary"><br />MBTI, 기분, 느낌, 원하는 것 무엇이든.</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Carousel dots */}
            <div className="flex justify-center gap-2 mt-4">
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



      {/* Trust & Privacy Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">
           걱정하지 마세요
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {/* Principle 1 */}
            <div className="p-8 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg text-center hover:border-primary/70 transition-all">
              <div className="text-5xl mb-4">1️⃣</div>
              <h4 className="text-xl font-black mb-3 text-primary">
                누구인지 보이지 않습니다.
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground" style={{fontSize: '14px'}}>
                오직 MBTI만. 
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-8 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg text-center hover:border-primary/70 transition-all">
              <div className="text-5xl mb-4">2️⃣</div>
              <h4 className="text-xl font-black mb-3 text-secondary">
                개인정보 보호
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                GPS정보는 어디에도 유포하지 않습니다.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-8 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg text-center hover:border-primary/70 transition-all">
              <div className="text-5xl mb-4">3️⃣</div>
              <h4 className="text-xl font-black mb-3 text-accent">
                선택은 당신의 몫
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                GPS를 키지 않고도 전국을 탐험해보세요.
              </p>
            </div>
          </div>


        </div>
      </section>




      {/* Beta Announcement Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="space-y-6 mb-10">
            <p className="text-4xl md:text-6xl font-black leading-tight">
              지금은 베타.
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-muted-foreground" style={{color: 'oklch(0.98 0 0)'}}>
              곧, 정식 앱으로.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className="mt-2 px-10 py-5 text-lg font-black border-2 border-border text-foreground bg-card/50 hover:bg-card rounded-lg transition-all hover:scale-105 active:scale-95"
                onClick={() => handleTrackEvent('click_출시알림')}
              >
                출시 알림 받기
              </button>
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
            <p className="text-5xl md:text-7xl font-black leading-tight" style={{fontSize: '35px'}}>
              더이상 <span style={{color: '#f1f2f1'}}>속지</span> 마세요.
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              className="px-16 py-8 text-2xl font-black border-4 border-primary bg-primary/20 hover:bg-primary/30 text-primary transition-all hover:scale-110 shadow-2xl shadow-primary/50 hover:shadow-primary/80"
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
