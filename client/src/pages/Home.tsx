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
              나와 같은 mbti는<br />
              <span className="text-secondary glow-magenta">몇 명일까?</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              SPOT은 이 공간 안에 나와<br />
              비슷한 사람이 몇명 있는지 보여줍니다.<br />
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              SPOT은 같은 공간 내 성향 존재를<br />
              지도 위에 표시하는 공간 정보 플랫폼입니다.
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
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            공간 안의 보이지 않는 정보
          </h2>

          <div className="space-y-8 mb-16">
            <div className="p-6 border-2 border-primary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "이 공간에<br />
                나와 맞는 사람이<br />
                있는지 알 수 없다."
              </p>
            </div>

            <div className="p-6 border-2 border-secondary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "핫플이라고 하지만,<br />
                내 성향과 맞는 공간인지<br />
                확인할 방법이 없다."
              </p>
            </div>

            <div className="p-6 border-2 border-accent/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "온라인은 피상적이고,<br />
                오프라인은 불확실하다."
              </p>
            </div>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-2xl font-black">
              문제는 공간이 아닙니다.
            </p>

            <p className="text-xl text-muted-foreground">
              문제는 성향 정보의 부재입니다.
            </p>

            <p className="text-2xl font-black">
              공간은 공유되지만,<br />
              <span className="text-primary glow-cyan">성향의 존재는<br />
              보이지 않습니다.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            <span className="text-primary glow-cyan">SPOT</span>은<br />
            성향의 존재를<br />
            공간 위에 표시합니다.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 border-2 border-primary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-primary mb-4">1️⃣</div>
              <h3 className="text-2xl font-black mb-4">반경 내<br />성향 분포 확인</h3>
              <p className="text-muted-foreground">
                지금 이 공간에<br />
                같은 MBTI가<br />
                몇 명 존재하는지 표시
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 border-2 border-secondary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-secondary mb-4">2️⃣</div>
              <h3 className="text-2xl font-black mb-4">성향 밀도 기반<br />공간 선택</h3>
              <p className="text-muted-foreground">
                인기 순위가 아닌,<br />
                유사 성향 밀도로<br />
                공간을 선택
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 border-2 border-accent bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-accent mb-4">3️⃣</div>
              <h3 className="text-2xl font-black mb-4">가시성 제공,<br />강제 없음</h3>
              <p className="text-muted-foreground">
                <span className="text-primary glow-cyan">SPOT</span>은<br />
                존재를 보여줄 뿐,<br />
                연결을 강요하지 않습니다.<br />
                선택은 사용자의 몫입니다.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border-2 border-primary/50 bg-primary/5 text-center">
            <p className="text-2xl font-black mb-4">
              <span className="text-primary glow-cyan">SPOT</span>은<br />
              정보를 제공합니다.
            </p>
            <p className="text-2xl font-black text-primary glow-cyan">
              그 정보를<br />
              어떻게 활용할지는<br />
              당신이 결정합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Service Visualization - Map Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            성향 정보를 공간 위에 표시
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1: Map with MBTI markers */}
            <div className="flex flex-col items-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/cTVBwpOXcluwPWCAtx3YcN-img-1_1770963414000_na1fn_c3BvdC1tYXAtZmVhdHVyZTE.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L2NUVkJ3cE9YY2x1d1BXQ0F0eDNZY04taW1nLTFfMTc3MDk2MzQxNDAwMF9uYTFmbl9jM0J2ZEMxdFlYQXRabVZoZEhWeVpURS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=aInJDzHSEKh3bZCAo3VORTCKP4GCgOPCLZ3uLONa1mmSLjXFUXuDbnB7lvKEVddd4jFphgS8ohImSZFSFMSsyIQAIdGn6edx91Wa0XgSzhWz2lgRBjZ1Y8cihRkAx0XvDxyxoOA2I4np1Hq8tNmDmPYY4IaRl0OT70LzI6Iiy4iXPoZDe3ue-kBQPjYh7BaZzWqz8S0WiLnqBOW1UIdsrt6eiPZP6to3y1L2767dUPe42pRiYo9LsF9D2sYUuBluRAm8lx-56xDx5s3XauZLPrt1VL8zsChbcNe8G-dCoUCbqNoxp2nf1DyPCwqYQL94y0ifyodzlZCH4usmjNSgpg__" 
                alt="Map visualization"
                className="w-full max-w-sm rounded-lg shadow-2xl"
              />
              <p className="mt-6 text-lg font-semibold text-center">
                지도 위에 유사 성향의 분포가<br />
                <span className="text-primary glow-cyan">실시간</span>으로 표시됩니다.
              </p>
            </div>

            {/* Feature 2: Notification popup */}
            <div className="flex flex-col items-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/cTVBwpOXcluwPWCAtx3YcN-img-2_1770963412000_na1fn_c3BvdC1tYXAtZmVhdHVyZTI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L2NUVkJ3cE9YY2x1d1BXQ0F0eDNZY04taW1nLTJfMTc3MDk2MzQxMjAwMF9uYTFmbl9jM0J2ZEMxdFlYQXRabVZoZEhWeVpUSS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oQlPwDIZ1yVs2yP7cmUQzmQAjDTyHBCliF3NRt~ITEr-66YRLNSR-fVh1V0L2vUIh~bSmLtnuSegSM4~M4jXsWnB-yE~1Wg5OeV5WLfA67V~jYDZ4XiWiEZuuJtEQio3Fm944h6ZtG6NxOQO3lI8lsAgCz8dIxSjXVdFSUuEKvLsj0WqzHh~rf5a2RCdKM7f24IzyGcyZlX-0nwkCIvvLtZUeOIkNPjEi7Dlfg0Sb9CHMIv4~FRbGr5xOU25YrgmR7kxuPEJTeHnrJr4AT8NZIdCjWFzvHR0IHzpqB8seiw6wtqfqU5hxp2FBCL2IINhm7zvVYy2YBmYvJ5NJ5vbMQ__" 
                alt="Notification popup"
                className="w-full max-w-sm rounded-lg shadow-2xl"
              />
              <p className="mt-6 text-lg font-semibold text-center">
                반경 내 성향 밀도가 높아지면<br />
                <span className="text-secondary glow-magenta">알림</span>을 받습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto">
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
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            자주 묻는 질문
          </h2>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-primary glow-cyan">
                Q. 제 위치가 그대로 노출되나요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 아닙니다.<br />
                사용자의 위치는<br />
                반경 10m 오차 범위로만 표시됩니다.<br />
                정밀 좌표는 공개되지 않으며,<br />
                성향 분포 정보만 제공됩니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 연애 앱인가요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 아닙니다.<br />
                <span className="text-primary glow-cyan">SPOT</span>은<br />
                공간 내 성향 존재 정보를<br />
                제공하는 플랫폼입니다.<br />
                연결을 강요하지 않으며,<br />
                정보 활용 방식은<br />
                전적으로 사용자가 결정합니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-accent">
                Q. MBTI만으로 충분한가요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 베타 버전은<br />
                MBTI 기반입니다.<br />
                정식 버전에서는<br />
                다양한 성향 데이터가<br />
                추가될 예정입니다.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-primary glow-cyan">
                Q. 내 존재를 숨길 수 있나요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 가능합니다.<br />
                사용자는<br />
                자신의 가시성을 제어할 수 있으며,<br />
                타인의 정보만 확인하는<br />
                모드도 선택 가능합니다.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 부적절한 사용자는 어떻게 필터링되나요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 신고 시스템과<br />
                자동 필터링이 작동하며,<br />
                부적절한 행동이 감지된<br />
                사용자는 즉시 제한됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8">
            지금 바로<br />
            <span className="text-primary glow-cyan">SPOT</span>으로<br />
            공간 내 성향 정보를<br />
            확인하세요.
          </h2>

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
            
            <Dialog>
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
