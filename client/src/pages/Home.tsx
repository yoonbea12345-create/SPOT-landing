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
              반경 10m이내<br />
              나와 같은 mbti는<br />
              <span className="text-secondary glow-magenta">몇 명 일까?</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              온라인 말고,<br />
              현실 공간에서 연결되는 순간.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Spot은 내 주변에 존재하는<br />
              사람들의 성향을 보여주는<br />
              공간 기반 소셜 플랫폼입니다.
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
                    지금 바로 내 주변의 <span className="text-secondary glow-magenta">우연</span>을 확인하세요
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
                    가장 먼저 <span className="text-secondary glow-magenta">우연</span>을 설계해보세요
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
            혹시 이런 적 없었나요?
          </h2>

          <div className="space-y-8 mb-16">
            <div className="p-6 border-2 border-primary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "온라인에서도, 오프라인에서도 나와 맞는 사람이 왜이렇게 없는거지...."
              </p>
            </div>

            <div className="p-6 border-2 border-secondary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "여기 핫플이라고는 하던데, 나랑 맞는 곳일까?"
              </p>
            </div>

            <div className="p-6 border-2 border-accent/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "요즘은 다 온라인이지...오프라인은 너무 부담돼,"
              </p>
            </div>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-2xl font-black">
              우리는 사람이 싫은게 아닙니다.
            </p>

            <p className="text-xl text-muted-foreground">
              모르는 상태가 불안한 겁니다.
            </p>

            <p className="text-2xl font-black">
              문제는 용기가 아니라,<br />
              <span className="text-primary glow-cyan">정보의 부재</span>입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            <span className="text-primary glow-cyan">SPOT</span>은 오프라인 만남을<br />
            이렇게 바꾸고자 합니다.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 border-2 border-primary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-primary mb-4">1️⃣</div>
              <h3 className="text-2xl font-black mb-4">내 주변 동질성 확인</h3>
              <p className="text-muted-foreground">
                지금 반경 안에<br />
                나와 같은 MBTI가 몇 명 있는지 확인
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 border-2 border-secondary bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-secondary mb-4">2️⃣</div>
              <h3 className="text-2xl font-black mb-4">결 맞는 공간 탐색</h3>
              <p className="text-muted-foreground">
                인기 많은 곳이 아니라,<br />
                나와 비슷한 사람들이 모이는 공간을 선택
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 border-2 border-accent bg-background/50 hover:bg-background/80 transition-colors">
              <div className="text-5xl font-black text-accent mb-4">3️⃣</div>
              <h3 className="text-2xl font-black mb-4">강제가 아닌 <span className="text-primary glow-cyan">우연</span>을 연출</h3>
              <p className="text-muted-foreground">
                <span className="text-primary glow-cyan">SPOT</span>은 유저의 GPS기반으로<br />
                <span className="text-primary glow-cyan">우연</span>적인 만남을 연출하지,<br />
                타 앱과 비슷한 매칭 시스템이 아닙니다.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border-2 border-primary/50 bg-primary/5 text-center">
            <p className="text-2xl font-black mb-4">
              <span className="text-primary glow-cyan">SPOT</span>을 통해 더이상 <span className="text-primary glow-cyan">우연</span>을 기다리지 마세요.
            </p>
            <p className="text-2xl font-black text-primary glow-cyan">
              이제는 <span className="text-secondary glow-magenta">우연</span>을 설계할 차례입니다.
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
                지도 위에 나와 같은 성향의 사람들이<br />
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
                반경 10m 이내에서 나와 같은 성향의 사람을 발견하면<br />
                <span className="text-secondary glow-magenta">실시간 알림</span>을 받습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            <span className="text-primary glow-cyan">SPOT</span>은 사람을 노출하지 않습니다.
          </h2>

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
              <p className="text-lg font-semibold">동의 없는 노출</p>
            </div>
          </div>

          <div className="p-8 border-2 border-primary/50 bg-primary/5">
            <p className="text-xl font-semibold mb-4">우리는</p>
            <p className="text-2xl font-black mb-6">
              "존재를 보여주되, 개인은 보호한다"의<br />
              원칙 위에 <span className="text-secondary glow-magenta">우연</span>을 설계합니다.
            </p>
            <p className="text-xl text-primary glow-cyan font-semibold">
              통제권은 항상 사용자에게 있습니다.
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
                Q. 제 위치가 그대로 보이나요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 아닙니다. 사용자님의 위치 정보는 타인에게 반경 10m 이내의 오차로 보여지고,
                반경 내에 가까워질 경우 <span className="text-primary glow-cyan">SPOT</span>에서 알려드리며,
                사용자님의 반경 10m 이내에 사용자님과 성향이 비슷한 분이 많을 경우에도 <span className="text-primary glow-cyan">SPOT</span>에서 알려드립니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 연애 매칭앱인가요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 절대 아닙니다. <span className="text-primary glow-cyan">SPOT</span>은 <span className="text-secondary glow-magenta">우연</span>을 설계해드리는 플랫폼일 뿐,
                그 <span className="text-secondary glow-magenta">우연</span>이 이성관계, 동성친구, 동네친구, 모임, 타지에서 우연히 만나게 된 가벼운 관계 등으로 만들지는
                오로지 사용자에 의존합니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-accent">
                Q. MBTI만으로 충분한가요?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A. 맞습니다. MBTI만으로는 나와 성향이 비슷한지 불확실합니다.
                이에 정식 버전에서는 다양한 성향 데이터가 추가될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8">
            지금 바로 <span className="text-primary glow-cyan">SPOT</span>을 다운받아<br />
            <span className="text-secondary glow-magenta">우연</span>을 설계해보세요.
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
                    지금 바로 내 주변의 <span className="text-secondary glow-magenta">우연</span>을 확인하세요
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
                    가장 먼저 <span className="text-secondary glow-magenta">우연</span>을 설계해보세요
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
