import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      toast.error("정보 수신 동의가 필요합니다.");
      return;
    }
    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyZyy0SdTsdYasmg4RkKAqH6gmDGwtQnqQTylfd0DtTlHtM62ikpcqCn-IMbYitS8gc/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
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
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-black text-6xl md:text-8xl mb-8 tracking-tighter">
            <span className="text-primary glow-cyan">SPOT</span>
          </h1>

          <div className="space-y-6 mb-12">
            <h2 className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '33px'}}>
              지금 이 골목에 나와 <br />
              같은 MBTI가 있다면?
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              지금 나와 비슷한 사람은 어디에.

            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Button 
              className="px-12 py-7 text-xl font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan transition-all hover:scale-105"
              onClick={() => window.open('https://spot-landing-6oai.vercel.app/mvp', '_blank')}
            >
              보러 가기
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Recognition Section */}
      <section className="relative py-32 md:py-40 px-4 md:px-8 bg-card/50 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="space-y-12 text-center">
            <p className="text-3xl md:text-5xl font-black leading-tight" style={{fontSize: '30px'}}>
              핫플은 압니다. <br /> <span className="text-secondary glow-magenta">누가</span>
                있는지는 모릅니다.
            </p>

            <p className="text-3xl md:text-5xl font-black leading-tight">
              어디로 갈지는 정합니다.<br />
              <span className="text-secondary glow-magenta">누가</span> 있을지는 모릅니다.
            </p>

            <div className="pt-8">
              <p className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '49px'}}>
                그래서   <span className="text-primary glow-cyan">SPOT.</span>       
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2-View System Section */}
      <section className="relative py-32 md:py-40 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center" style={{fontSize: '33px'}}>
            같은 <span className="text-secondary glow-magenta">지도</span>,  다른 <span className="text-primary glow-cyan">시야</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Card 1 - Wide View */}
            <div className="p-6 border-2 border-primary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="mb-6">
                <img 
                  src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/HTOcYJztATeL8wW6AtrCwW-img-1_1771406265000_na1fn_c3BvdC13aWRlLXZpZXctdjM.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L0hUT2NZSnp0QVRlTDh3VzZBdHJDd1ctaW1nLTFfMTc3MTQwNjI2NTAwMF9uYTFmbl9jM0J2ZEMxM2FXUmxMWFpwWlhjdGRqTS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qGRDcy88-VhHQr6v2U8QNl9W~wrcTlRge4ZbOWHJZ3kO4AWOvYO37CKypgr8pH6QdCDD3gskOBNGv3Lgu1q9WbBeueOgn2oUCmNWsEecQYdiHMHS6-FOflTlRwLVvX6PRnWKF4W1L~DMbuJseoEGEjaIoxTegIYaIR5VaeSZAt0tZZqHkSJg2W5gDhdb8amhAzdeZH4Ek4k-QoRDG38U25zQudFx4Hic-gbbFlaT-GioUTBLnhiaY74~JYqlr-heWK0G1dmHVOmeXCNqRVkFKudxvXiidor7ZqNVF7m9tcDGplfjYsLSez8IQ4qVY398GzxM7igJBBa040e5y1XcpA__"
                  alt="Wide View"
                  className="w-full h-auto rounded-lg border border-primary/30"
                />
              </div>
              <h3 className="text-2xl font-black mb-3 text-primary">멀리서 보면</h3>
              <p className="text-base leading-relaxed text-muted-foreground" style={{fontSize: '15px'}}>
               오늘의 흐름이 보입니다.<br /> 
               <span className="text-primary">어디로 모였는지.</span>
              </p>
            </div>

            {/* Card 2 - Near View */}
            <div className="p-6 border-2 border-secondary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="mb-6">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/wWyTazLhsdMvssnA.png"
                  alt="Near View"
                  className="w-full h-auto rounded-lg border border-secondary/30"
                />
              </div>
              <h3 className="text-2xl font-black mb-3 text-secondary">가까워질수록</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
               나와 비슷한 유형이 먼저 보입니다.<br />
               <span className="text-secondary">더 가까이. 더 선명하게.</span>
              </p>
            </div>

            {/* Card 3 - Ultra Near */}
            <div className="p-6 border-2 border-accent bg-background/50 hover:bg-background/80 transition-colors">
              <div className="mb-6">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/OCgzvxCVPPufqysU.png"
                  alt="Ultra Near"
                  className="w-full h-auto rounded-lg border border-accent/30"
                />
              </div>
              <h3 className="text-2xl font-black mb-3 text-accent">아주 가까워지면</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                3m 안.
                이 골목 어딘가에.<br />
                <span className="text-primary glow-cyan">지금,  마주칠 수도 있습니다. </span>
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Trust & Privacy Section */}
      <section className="relative py-24 md:py-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">
           걱정하지 마세요
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-16">
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Principle 1 */}
            <div className="p-8 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg text-center hover:border-primary/70 transition-all">
              <div className="text-5xl mb-4">1️⃣</div>
              <h4 className="text-xl font-black mb-3 text-primary glow-cyan">
                누구인지 보이지 않습니다.
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground" style={{fontSize: '14px'}}>
                오직 MBTI만. 
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-8 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg text-center hover:border-primary/70 transition-all">
              <div className="text-5xl mb-4">2️⃣</div>
              <h4 className="text-xl font-black mb-3 text-secondary glow-magenta">
                점이 아닌 범위
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                정확한 자리는 보이지 않습니다.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-8 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg text-center hover:border-primary/70 transition-all">
              <div className="text-5xl mb-4">3️⃣</div>
              <h4 className="text-xl font-black mb-3 text-accent">
                선택은 당신의 몫
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                지나칠지. 다가갈지.
              </p>
            </div>
          </div>


        </div>
      </section>




      {/* Beta Announcement Section */}
      <section className="relative py-32 md:py-40 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="space-y-8 mb-16">
            <p className="text-4xl md:text-6xl font-black leading-tight">
              지금은 베타.
            </p>
            <p className="text-3xl md:text-5xl font-black leading-tight text-muted-foreground" style={{color: 'oklch(0.98 0 0)'}}>
              곧, 더 가까이.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="text-sm font-medium text-muted-foreground/70 hover:text-primary transition-colors underline underline-offset-4 decoration-dotted">
                출시 알림
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
                  className="w-full py-6 text-lg font-black border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary glow-cyan"
                >
                  알림 받기
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-28 md:py-36 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="space-y-8 mb-16">
            <p className="text-5xl md:text-7xl font-black leading-tight" style={{fontSize: '35px'}}>
              지금, 이 골목에 누가
            </p>
            <p className="text-5xl md:text-7xl font-black leading-tight" style={{fontSize: '35px'}}>
              모였는지 확인해보세요.
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              className="px-16 py-8 text-2xl font-black border-4 border-primary bg-primary/20 hover:bg-primary/30 text-primary glow-cyan transition-all hover:scale-110 shadow-2xl shadow-primary/50 hover:shadow-primary/80"
              onClick={() => window.open('https://spot-landing-6oai.vercel.app/mvp', '_blank')}
            >
              보러 가기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
