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
              10m 이내에<br />
              나와 같은 MBTI는<br />
              <span className="text-secondary glow-magenta">몇 명일까?</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              SPOT은 지금 여기 어떤<br />
              사람들이 있는지 지도 위에 보여줍니다.<br />
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              MBTI는 시작일 뿐.<br />
              <span className="text-primary glow-cyan">SPOT</span>은 지도 위에 존재를 드러냅니다.
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
              어디로 갈지는 정하지만,<br />
              <span className="text-secondary glow-magenta">누가</span> 있을지는 모릅니다.
            </p>

            <div className="pt-8">
              <p className="text-4xl md:text-6xl font-black leading-tight" style={{fontSize: '26px'}}>
                <span className="text-primary glow-cyan">SPOT</span>은 그걸 보이게 합니다.
              
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
              <h3 className="text-2xl font-black mb-3 text-primary">멀리서 보면,</h3>
              <p className="text-base leading-relaxed text-muted-foreground" style={{fontSize: '15px'}}>
                
               오늘 어디에 사람이 모였는지 한눈에 보입니다.
               <br /> 어떤 유형이 어디에 많은지도 함께.
              </p>
            </div>

            {/* Card 2 - Near View */}
            <div className="p-6 border-2 border-secondary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="mb-6">
                <img 
                  src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/hvcCS8soPsTawcjp313kt3-img-1_1771406330000_na1fn_c3BvdC1uZWFyLXZpZXctdjQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L2h2Y0NTOHNvUHNUYXdjanAzMTNrdDMtaW1nLTFfMTc3MTQwNjMzMDAwMF9uYTFmbl9jM0J2ZEMxdVpXRnlMWFpwWlhjdGRqUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=O7g78MEdKLt9c2OkhqgiwhR-QQ1DXkyKKjiqWJxEfOjQVhX-APiz07lRoPaX80XmKdaDCOCSDMWiyX8ln4KgqWo3FnOZOlgTKgRAPr7kx~243XKP7e3HNPT4lKPjgnl4SG5bF-hIoZXkDsLT0dyMaaeWmSoazeYL2Swe2Ws~YB7jUqyqvceOlz9A7ZETJbmskgZ2WjLrj3bS1UdU6O1Zgd-UFNmnPdgoHeca3ZpaNgij8V0l4Yx6rX-Bxy0T4ZqMyi9Dur7r3~hM-u2H2gjASdNwu~IGygYWD5IuoLS2PRM7jmD8IA44hnrU8TMUPCqaePnXfO5f4f3kt2SsT8CJHg__"
                  alt="Near View"
                  className="w-full h-auto rounded-lg border border-secondary/30"
                />
              </div>
              <h3 className="text-2xl font-black mb-3 text-secondary">가까워 질수록,</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                지도가 정리됩니다.<br />
                이제, 나랑 비슷하거나 맞는 사람만.
              </p>
            </div>

            {/* Card 3 - Ultra Near */}
            <div className="p-6 border-2 border-accent bg-background/50 hover:bg-background/80 transition-colors">
              <div className="mb-6">
                <img 
                  src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/hvcCS8soPsTawcjp313kt3-img-2_1771406328000_na1fn_c3BvdC11bHRyYS1uZWFyLXY0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L2h2Y0NTOHNvUHNUYXdjanAzMTNrdDMtaW1nLTJfMTc3MTQwNjMyODAwMF9uYTFmbl9jM0J2ZEMxMWJIUnlZUzF1WldGeUxYWTAucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OYMnucIooceI5nfV9cAllB74uYjrzTczJb6j5QqDb98Gmbxvm90S~Qp-p8tx-7gBkozhs-ak~p1qRsupxyEF8UkkjMVTK7JRv52OamM3DayEWeM93n7cNU8yCkteoWbs7WwRM-6MOPVjXeZOGu-0xY4FSlUQhsg9czHkQ9Km23NFzKGNB5NglPJmTnmL-W9CJ47OnyqBSGmzgFegbO-ZHtSISHkyzssOJ85PogM-tnWNjrVuuvT-R-SF2v2D0kWSuCkesG3lmM2peLzxPVNTjUp035a0G4hN8izhzpAb05JV3Ck8J0kxjsEhM1gu4KtzQ8xH1oyfo-~nxP-MM~aLkA__"
                  alt="Ultra Near"
                  className="w-full h-auto rounded-lg border border-accent/30"
                />
              </div>
              <h3 className="text-2xl font-black mb-3 text-accent">아주 가까워지면,</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                3m 안.
                이 골목 어딘가에.<br />
                <span className="text-primary glow-cyan">지금,  마주칠 수도 있습니다. </span>
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 border-2 border-primary/50 bg-primary/5 text-center">
            <p className="text-2xl font-black" style={{fontSize: '22px'}}>
              <span className="text-primary glow-cyan">SPOT</span>은 존재만 보여줍니다.<br />
              <span className="text-primary glow-cyan">선택</span>은 당신의 몫입니다.
            </p>
          </div>
        </div>
      </section>

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
