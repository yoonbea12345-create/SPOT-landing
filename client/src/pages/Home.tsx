import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("신청이 완료되었습니다!");
    setEmail("");
    setPhone("");
    setOpen(false);
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
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              반경 10m 이내<br />
              나와 같은 MBTI는<br />
              <span className="text-secondary glow-magenta">몇 명일까?</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              SPOT은 지금 여기 어떤<br />
              사람들이 있는지 지도 위에 보여줍니다.<br />
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              지금 여기 누가 있는지, 바로 확인해보세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                  내 주변 확인하기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-2 border-primary">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    <span className="text-primary glow-cyan">SPOT</span> 시작하기
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    지금 바로 내 주변의 성향 분포를 확인하세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2 border-primary/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="전화번호 (예: 010-1234-5678)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-2 border-secondary/50 focus:border-secondary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-black border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary glow-cyan"
                  >
                    시작하기
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="px-8 py-6 text-lg font-black border-2 border-secondary text-secondary hover:bg-secondary/10 glow-magenta">
                  베타 오픈 알림 받기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-2 border-primary">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    <span className="text-primary glow-cyan">SPOT</span> 베타 오픈 알림
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    가장 먼저 공간 정보를 확인해보세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2 border-primary/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="전화번호 (예: 010-1234-5678)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-2 border-secondary/50 focus:border-secondary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-black border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary glow-cyan"
                  >
                    알림 신청하기
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
            <p className="text-3xl md:text-5xl font-black leading-tight">
              핫플은 알지만 거기<br />
              <span className="text-secondary glow-magenta">누가</span> 있는지는 모릅니다.
            </p>

            <p className="text-3xl md:text-5xl font-black leading-tight">
              지금 여기, <span className="text-secondary glow-magenta">어떤</span> 사람들이<br />
              있는지도 모릅니다.
            </p>

            <p className="text-3xl md:text-5xl font-black leading-tight">
              어디인지는 알지만<br />
              <span className="text-secondary glow-magenta">누가</span> 있는지는 모릅니다.
            </p>

            <div className="pt-8">
              <p className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '26px'}}>
                <span className="text-primary glow-cyan">SPOT</span>은 그 정보를
                보여줍니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-32 md:py-40 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            이제, 보입니다.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 border-2 border-primary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-primary mb-4">1️⃣</div>
              <h3 className="text-2xl font-black mb-4">반경 10m 안에</h3>
              <p className="text-muted-foreground">
                같은 MBTI
                인원 수 표시
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 border-2 border-secondary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-secondary mb-4">2️⃣</div>
              <h3 className="text-2xl font-black mb-4">사람 많은 곳이 아니라,</h3>
              <p className="text-muted-foreground">
                나와 비슷한 사람이
                많은 곳.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 border-2 border-accent bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-accent mb-4">3️⃣</div>
              <h3 className="text-2xl font-black mb-4">보여주기만 합니다.</h3>
              <p className="text-muted-foreground">
                연결은 강요하지
                않습니다.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border-2 border-primary/50 bg-primary/5 text-center">
            <p className="text-2xl font-black mb-4" style={{fontSize: '23px'}}>
              <span className="text-primary glow-cyan">SPOT</span>은 정보만 제공합니다.
            </p>
            <p className="text-2xl font-black text-primary glow-cyan">
              선택은 당신의 몫입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Service Visualization - Map */}
      <section className="relative py-24 md:py-32 px-4 md:px-8 bg-card/50 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto flex justify-center">
          <img 
            src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/rHuu4yIbJYJT0kpUCnaEBm_1771334643157_na1fn_c3BvdC1tYXAtdjI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L3JIdXU0eUliSllKVDBrcFVDbmFFQm1fMTc3MTMzNDY0MzE1N19uYTFmbl9jM0J2ZEMxdFlYQXRkakkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=cA3qIB5pX66jfwYXwS8h1c5vbrhQrK9SbbySO8g~SDlyX3hDOLOdkkEtIUpsLnp8zsNqdk-Awvr~HcQLOb3yUvlgrcZjhrjuQRzEwnlxg2NdD2kbAweyaSozAJM06079Z1MqjheRfRCqEiTLT-8ETg1lxygNZGcihjWbl3J5NsfhBTLXKCCb8uV1W-k6bxPl8-JKqBS0ET15We3fB0rROjv67YZTYjOhHnlv0ZL~SFWpGvzgiiA2vb~V99rei12S5DWAHw-WVq082Muf0UBAJ6bgm182gOQng5Ls8PaAtcZEIp6rjndzsLZtmrNfVHd2AkLaDnIgL~MHGywb1w3VTQ__" 
            alt="SPOT Map Visualization" 
            className="w-80 md:w-96 rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Service Visualization - Notification */}
      <section className="relative py-24 md:py-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto flex justify-center">
          <img 
            src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/rHuu4yIbJYJT0kpUCnaEBm_1771334643158_na1fn_c3BvdC1ub3RpZmljYXRpb24tdjIucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Qh9yC2KCuf7EK9B5BJKgffPGVeuqfTM-8SPDUgGCFPIrzZ8NxFy~CWOchIfdvvt-hEhP82epyjKUg8COwkkef~lScMCdul52j44iA9PyXoW5jaz3At~VYw7pb8HgJEfKFg12aNitGUINW1pnZyyQIabbAVTvLCFwPZ8oVThXdamRCdXFOYq67UKd6-Bf4LxAJYc1J9rUAgp3g0a5WQr7rHAWseXD3ZBv0cd~9ptKGTRWXEMlvEw9oOxR5LRMLR8jRSnOaOGp0CxUOW5WtZAtBNYRvp5Pr~884jjGCp5aNm9v8TaXIeZ1gdM~6BoHT71MuTjRO633LvRwFm38UWvIig__" 
            alt="SPOT Notification Popup" 
            className="w-80 md:w-96 rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-28 md:py-36 px-4 md:px-8 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            <span className="text-primary glow-cyan">SPOT</span>은<br />
            개인을 노출하지 않습니다.
          </h2>

          <div className="space-y-6 mb-12">
            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">✕</span>
              <p className="text-lg font-semibold">정밀 위치 좌표 공개</p>
            </div>

            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">✕</span>
              <p className="text-lg font-semibold">개인 식별 정보 표시</p>
            </div>

            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">✕</span>
              <p className="text-lg font-semibold">동의 없는 가시성</p>
            </div>
          </div>

          <div className="p-8 border-2 border-primary/50 bg-primary/5">
            <p className="text-xl font-semibold mb-4">우리는</p>
            <p className="text-2xl font-black mb-6">
              "성향의 존재는 보여주되,<br />
              개인은 보호한다"의<br />
              원칙으로 설계되었습니다.
            </p>
            <p className="text-xl text-primary glow-cyan font-semibold">
              가시성 제어권은<br />
              전적으로 사용자에게 있습니다.
            </p>
          </div>

          {/* Distance-Based Visibility System */}
          <div className="mt-16">
            <h3 className="text-3xl font-black mb-8 text-center">
              거리 기반 가시성 시스템
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Far Distance */}
              <div className="p-6 border-2 border-secondary/50 bg-secondary/5">
                <div className="text-4xl mb-4">🔲</div>
                <h4 className="text-xl font-black mb-3 text-secondary glow-magenta">
                  먼 거리
                </h4>
                <p className="text-muted-foreground">
                  먼 거리의 사용자는<br />
                  넓은 구역 단위로만 표시됩니다.<br />
                  정확한 위치는 공개되지 않습니다.
                </p>
              </div>

              {/* Close Proximity */}
              <div className="p-6 border-2 border-primary/50 bg-primary/5">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-black mb-3 text-primary glow-cyan">
                  근접 거리
                </h4>
                <p className="text-muted-foreground">
                  가까운 거리에서만<br />
                  위치 정밀도가 증가합니다.<br />
                  개인 추적은 불가능합니다.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 border-2 border-border bg-background/50">
              <p className="text-lg text-center text-muted-foreground">
                거리에 따라 가시성이 동적으로 변화하며,<br />
                프라이버시와 정보 제공의 균형을 유지합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 md:py-32 px-4 md:px-8 bg-card/50 border-t border-border overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            자주 묻는 질문
          </h2>

          <div className="space-y-8">
            {/* FAQ 1 */}
            <div className="p-6 border-2 border-primary/30 bg-background/50">
              <h3 className="text-xl font-black mb-3 text-primary">
                Q. 제 위치가 그대로 보이나요?
              </h3>
              <p className="text-muted-foreground">
                A. 아닙니다.<br />
                사용자님의 위치 정보는<br />
                타인에게 반경 10m 이내의<br />
                오차로 보여지고<br />
                반경 내에 가까워질 경우<br />
                SPOT에서 알려드리며,<br />
                사용자님의 반경 10m 이내에<br />
                사용자님과 성향이 비슷한 분이<br />
                많을 경우에도<br />
                SPOT에서 알려드립니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 border-2 border-secondary/30 bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary">
                Q. 연애 매칭 앱인가요?
              </h3>
              <p className="text-muted-foreground">
                A. 절대 아닙니다.<br />
                SPOT은 공간 내<br />
                성향 정보를 제공하는<br />
                플랫폼일 뿐,<br />
                그 정보를 이성 관계,<br />
                동성 친구, 동네 친구, 모임,<br />
                타지에서 우연히 만나게 된<br />
                가벼운 관계 등으로<br />
                만들지는<br />
                오로지 사용자에 의존합니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 border-2 border-accent/30 bg-background/50">
              <h3 className="text-xl font-black mb-3 text-accent">
                Q. MBTI만으로 저와 성향이 같다고 확신이 안 들어요
              </h3>
              <p className="text-muted-foreground">
                A. 맞습니다.<br />
                MBTI만으로는<br />
                나와 성향이 비슷한지<br />
                불확실합니다.<br />
                이에 정식 버전에서는<br />
                다양한 성향 데이터가<br />
                추가될 예정입니다.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="p-6 border-2 border-primary/30 bg-background/50">
              <h3 className="text-xl font-black mb-3 text-primary">
                Q. 내 정보를 숨길 수 있나요?
              </h3>
              <p className="text-muted-foreground">
                A. 가능합니다.<br />
                사용자는 언제든지<br />
                자신의 가시성을<br />
                제어할 수 있습니다.<br />
                다른 사람만 보거나,<br />
                완전히 숨기는 것도<br />
                선택 가능합니다.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="p-6 border-2 border-secondary/30 bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary">
                Q. 안전하지 않은 사용자는 어떻게 필터링하나요?
              </h3>
              <p className="text-muted-foreground">
                A. SPOT은<br />
                부적절한 행동을 하는<br />
                사용자를 자동으로<br />
                필터링합니다.<br />
                신고 시스템과<br />
                AI 기반 모니터링을 통해<br />
                안전한 환경을<br />
                유지합니다.
              </p>
            </div>
          </div>
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
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            지금 바로<br />
            <span className="text-primary glow-cyan">SPOT</span>을<br />
            경험해보세요.
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            같은 공간 내<br />
            성향 정보를 확인하고,<br />
            당신만의 방식으로<br />
            활용하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                  내 주변 확인하기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-2 border-primary">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    <span className="text-primary glow-cyan">SPOT</span> 시작하기
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    지금 바로 내 주변의 성향 분포를 확인하세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2 border-primary/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="전화번호 (예: 010-1234-5678)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-2 border-secondary/50 focus:border-secondary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-black border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary glow-cyan"
                  >
                    시작하기
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="px-8 py-6 text-lg font-black border-2 border-secondary text-secondary hover:bg-secondary/10 glow-magenta">
                  베타 오픈 알림 받기
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-2 border-primary">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    <span className="text-primary glow-cyan">SPOT</span> 베타 오픈 알림
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    가장 먼저 공간 정보를 확인해보세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2 border-primary/50 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="전화번호 (예: 010-1234-5678)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-2 border-secondary/50 focus:border-secondary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-black border-2 border-primary bg-primary/10 hover:bg-primary/20 text-primary glow-cyan"
                  >
                    알림 신청하기
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
}
