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
              나와 맞는 사람은<br />
              <span className="text-secondary glow-magenta">몇 명일까?</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              말 걸기 전에<br />
              확률을 먼저 확인하세요.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Spot은 공간 위에 호환성을 매핑합니다.<br />
              감정적 리스크를 낮추고,<br />
              용기를 더 쉽게 만듭니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                  내 주변 확률 확인
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-2 border-primary">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    <span className="text-primary glow-cyan">SPOT</span> 시작하기
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    당신이 선택합니다. 우리는 확률만 보여줍니다.
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
                    가장 먼저 확률을 확인하세요
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
            당신이 회피하는 진짜 이유
          </h2>

          <div className="space-y-8 mb-16">
            <div className="p-6 border-2 border-primary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "말 걸었다가 안 맞으면 어떡하지?"
              </p>
            </div>

            <div className="p-6 border-2 border-secondary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "여기 사람들이 나랑 맞는 사람들일까?"
              </p>
            </div>

            <div className="p-6 border-2 border-accent/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "감정 쏟았다가 헛수고 하기 싫어."
              </p>
            </div>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-2xl font-black">
              당신은 사람이 싫은 게 아닙니다.
            </p>

            <p className="text-xl text-muted-foreground">
              감정적 상처가 두려운 겁니다.
            </p>

            <p className="text-2xl font-black">
              문제는 용기가 아니라,<br />
              <span className="text-primary glow-cyan">호환성 불확실성</span>입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            <span className="text-primary glow-cyan">SPOT</span>은 감정적 리스크를<br />
            이렇게 낮춥니다.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 border-2 border-primary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-primary mb-4">1️⃣</div>
              <h3 className="text-2xl font-black mb-4">호환성 확률 계산</h3>
              <p className="text-muted-foreground">
                반경 10m 이내<br />
                나와 성향이 맞는 사람이<br />
                몇 명인지 확인합니다.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 border-2 border-secondary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-secondary mb-4">2️⃣</div>
              <h3 className="text-2xl font-black mb-4">공간 기반 필터링</h3>
              <p className="text-muted-foreground">
                핫플이 아니라<br />
                나와 맞는 사람들이<br />
                모이는 공간을 찾습니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 border-2 border-accent bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-accent mb-4">3️⃣</div>
              <h3 className="text-2xl font-black mb-4">완전한 사용자 통제</h3>
              <p className="text-muted-foreground">
                당신이 보일지 말지 결정합니다.<br />
                당신이 누구를 볼지 결정합니다.<br />
                강요는 없습니다.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border-2 border-primary/50 bg-primary/5 text-center">
            <p className="text-2xl font-black mb-4">
              우리는 사랑을 보장하지 않습니다.
            </p>
            <p className="text-2xl font-black text-primary glow-cyan">
              단지 확률을 높이고, 용기를 더 쉽게 만듭니다.
            </p>
          </div>
        </div>
      </section>

      {/* Service Visualization - Map Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature 1: Map with MBTI markers */}
            <div className="flex flex-col items-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/cTVBwpOXcluwPWCAtx3YcN-img-1_1770963414000_na1fn_c3BvdC1tYXAtZmVhdHVyZTE.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L2NUVkJ3cE9YY2x1d1BXQ0F0eDNZY04taW1nLTFfMTc3MDk2MzQxNDAwMF9uYTFmbl9jM0J2ZEMxdFlYQXRabVZoZEhWeVpURS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=aInJDzHSEKh3bZCAo3VORTCKP4GCgOPCLZ3uLONa1mmSLjXFUXuDbnB7lvKEVddd4jFphgS8ohImSZFSFMSsyIQAIdGn6edx91Wa0XgSzhWz2lgRBjZ1Y8cihRkAx0XvDxyxoOA2I4np1Hq8tNmDmPYY4IaRl0OT70LzI6Iiy4iXPoZDe3ue-kBQPjYh7BaZzWqz8S0WiLnqBOW1UIdsrt6eiPZP6to3y1L2767dUPe42pRiYo9LsF9D2sYUuBluRAm8lx-56xDx5s3XauZLPrt1VL8zsChbcNe8G-dCoUCbqNoxp2nf1DyPCwqYQL94y0ifyodzlZCH4usmjNSgpg__" 
                alt="Map visualization"
                className="w-full max-w-sm rounded-lg shadow-2xl"
              />
              <p className="mt-6 text-lg font-semibold text-center">
                공간 위에 호환성 확률이<br />
                <span className="text-primary glow-cyan">실시간</span>으로 매핑됩니다.
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
                확률이 높아지면<br />
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
            통제권은 당신에게 있습니다.
          </h2>

          <div className="space-y-6 mb-12">
            <div className="p-6 border-2 border-primary/50 bg-primary/5 flex items-center gap-4">
              <span className="text-3xl">✓</span>
              <p className="text-lg font-semibold">당신이 보일지 말지 선택합니다</p>
            </div>

            <div className="p-6 border-2 border-primary/50 bg-primary/5 flex items-center gap-4">
              <span className="text-3xl">✓</span>
              <p className="text-lg font-semibold">당신이 누구를 볼지 필터링합니다</p>
            </div>

            <div className="p-6 border-2 border-primary/50 bg-primary/5 flex items-center gap-4">
              <span className="text-3xl">✓</span>
              <p className="text-lg font-semibold">부적절한 사용자는 자동 차단됩니다</p>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">✕</span>
              <p className="text-lg font-semibold">정밀한 위치 좌표 공개</p>
            </div>

            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">✕</span>
              <p className="text-lg font-semibold">개인 식별 정보 표시</p>
            </div>

            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">✕</span>
              <p className="text-lg font-semibold">강제 매칭 시스템</p>
            </div>
          </div>

          <div className="p-8 border-2 border-primary/50 bg-primary/5">
            <p className="text-2xl font-black mb-6 text-center">
              우리는 확률을 보여줄 뿐,<br />
              당신을 강요하지 않습니다.
            </p>
            <p className="text-xl text-primary glow-cyan font-semibold text-center">
              선택은 항상 당신의 것입니다.
            </p>
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
                Q. 내 위치가 정확히 노출되나요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 아닙니다. 반경 10m 오차 범위로만 표시됩니다.
                정밀한 좌표는 절대 공개되지 않습니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 연애 앱인가요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 아닙니다. <span className="text-primary glow-cyan">SPOT</span>은 호환성 확률을 보여주는 인프라입니다.
                연애든, 친구든, 네트워킹이든—당신이 결정합니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-accent">
                Q. MBTI만으로 충분한가요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 베타 버전은 MBTI 기반입니다.
                정식 버전에서는 더 정교한 호환성 데이터가 추가됩니다.
              </p>
            </div>

            {/* FAQ 4 - NEW */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-primary glow-cyan">
                Q. 나를 숨길 수 있나요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 네. 언제든지 가시성을 끄거나 켤 수 있습니다.
                당신이 보고 싶을 때만 보입니다.
              </p>
            </div>

            {/* FAQ 5 - NEW */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 이상한 사람은 어떻게 걸러지나요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 신고 시스템과 AI 필터링으로 부적절한 사용자는 자동 차단됩니다.
                안전은 최우선입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8">
            확률을 확인하세요.<br />
            용기는 그 다음입니다.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                  내 주변 확률 확인
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-background border-2 border-primary">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-center">
                    <span className="text-primary glow-cyan">SPOT</span> 시작하기
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    당신이 선택합니다. 우리는 확률만 보여줍니다.
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
                    가장 먼저 확률을 확인하세요
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
