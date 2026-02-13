import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-black text-6xl md:text-8xl mb-8 tracking-tighter">
            <span className="text-primary glow-cyan">SPOT</span>
          </h1>

          <div className="space-y-6 mb-12">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              지금 이 골목에,<br />
              나랑 같은 <span className="text-secondary glow-magenta">결</span>이 있다면?
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              온라인 말고,<br />
              진짜 공간에서 연결되는 순간.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Spot은 공간 위에 사람의 성향을 보여주는<br />
              새로운 오프라인 소셜입니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://jupjup-mvp2-3g7l.vercel.app/index.html?category=%EC%B9%B4%ED%8E%98&from=qr" target="_blank" rel="noopener noreferrer">
              <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                지금, 내 주변 확인하기
              </Button>
            </a>
            <Button variant="outline" className="px-8 py-6 text-lg font-black border-2 border-secondary text-secondary hover:bg-secondary/10 glow-magenta">
              베타 오픈 알림 받기
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Recognition Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            혹시 이런 적 없나요?
          </h2>

          <div className="space-y-8 mb-16">
            <div className="p-6 border-2 border-primary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "저 사람 괜찮아 보이는데… 말 걸어도 될까?"
              </p>
            </div>

            <div className="p-6 border-2 border-secondary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "여기 분위기는 좋은데, 나랑 맞는 사람 있을까?"
              </p>
            </div>

            <div className="p-6 border-2 border-accent/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                "요즘은 다 온라인이지… 오프라인은 너무 부담돼."
              </p>
            </div>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-2xl font-black">
              우리는<br />
              사람이 싫은 게 아닙니다.
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
            Spot은 오프라인 만남을 이렇게 바꿉니다.
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
              <h3 className="text-2xl font-black mb-4">말 걸기 전 1차 확신</h3>
              <p className="text-muted-foreground">
                완전한 확신은 아니어도,<br />
                "아무도 없는 건 아니구나"라는 신호
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border-2 border-primary/50 bg-primary/5 text-center">
            <p className="text-3xl font-black mb-4">
              우연을 기다리지 않습니다.
            </p>
            <p className="text-2xl font-black text-primary glow-cyan">
              우연을 설계합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Spot은 사람을 노출하지 않습니다.
          </h2>

          <div className="space-y-6 mb-12">
            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">❌</span>
              <p className="text-lg font-semibold">정확한 위치 좌표 공개</p>
            </div>

            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">❌</span>
              <p className="text-lg font-semibold">개인 식별 정보 표시</p>
            </div>

            <div className="p-6 border-2 border-destructive/50 bg-destructive/5 flex items-center gap-4">
              <span className="text-3xl">❌</span>
              <p className="text-lg font-semibold">동의 없는 노출</p>
            </div>
          </div>

          <div className="p-8 border-2 border-primary/50 bg-primary/5">
            <p className="text-xl font-semibold mb-4">우리는</p>
            <p className="text-2xl font-black mb-6">
              "존재를 보여주되, 개인은 보호한다"는<br />
              원칙 위에 설계되었습니다.
            </p>
            <p className="text-xl text-primary glow-cyan font-semibold">
              통제권은 항상 사용자에게 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-8">
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
              <p className="text-lg text-muted-foreground">
                A. 아닙니다. 개인 식별이 불가능한 형태로만 표시됩니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 연애 앱인가요?
              </h3>
              <p className="text-lg text-muted-foreground">
                A. 아닙니다. 친구, 네트워킹, 취향 연결 모두 가능합니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-accent">
                Q. MBTI만으로 충분한가요?
              </h3>
              <p className="text-lg text-muted-foreground">
                A. 베타는 MBTI 기반입니다. 향후 더 다양한 성향 데이터로 확장됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8">
            지금 확인하지 않으면,<br />
            그냥 스쳐 지나갑니다.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://jupjup-mvp2-3g7l.vercel.app/index.html?category=%EC%B9%B4%ED%8E%98&from=qr" target="_blank" rel="noopener noreferrer">
              <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                지금, 내 주변 확인하기
              </Button>
            </a>
            <Button variant="outline" className="px-8 py-6 text-lg font-black border-2 border-secondary text-secondary hover:bg-secondary/10 glow-magenta">
              베타 오픈 알림 받기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
