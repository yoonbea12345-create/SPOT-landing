import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1a3a] to-[#0a0e27]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1200 800">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,240,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-black text-6xl md:text-8xl mb-8 tracking-tighter">
            <span className="text-primary glow-cyan">SPOT</span>
          </h1>

          <div className="space-y-6 mb-12">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              내 주변에는<br />
              나와 같은 mbti가<br />
              <span className="text-secondary glow-magenta">몇명일까?</span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              온라인 말고,<br />
              현실 공간에서 연결되는 순간.
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Spot은 내 주변에 존재하는<br />
              사람들의 성향을 보여주는<br />
              새로운 오프라인 소셜 플랫폼입니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="https://jupjup-mvp2-3g7l.vercel.app/index.html?category=%EC%B9%B4%ED%8E%98&from=qr" target="_blank" rel="noopener noreferrer">
              <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                내 주변 확인하기
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
            혹시 이런 적 없었나요?
          </h2>

          <div className="space-y-8 mb-16">
            <div className="p-6 border-2 border-primary/30 bg-background/50">
              <p className="text-lg md:text-xl font-semibold">
                " 저 사람 왠지 나랑 잘맞을거 같은데...말 걸어도 될까?"
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
              <span className="text-primary glow-cyan">정보의 부재입니다.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            SPOT은 오프라인 만남을<br />
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
              <h3 className="text-2xl font-black mb-4">강제가 아닌 우연을 연출</h3>
              <p className="text-muted-foreground">
                SPOT은 유저의 GPS기반으로<br />
                우연적인 만남을 연출하며,<br />
                타 앱과 비슷한 매칭 시스템이 아닙니다.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border-2 border-primary/50 bg-primary/5 text-center">
            <p className="text-2xl font-black mb-4">
              SPOT을 통해 더이상 우연을 기다리지 마세요.
            </p>
            <p className="text-2xl font-black text-primary glow-cyan">
              이제는 우연을 설계할 차례입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Service Visualization Section */}
      <section className="py-20 px-4 md:px-8 bg-card/50 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">
            SPOT의 서비스를 경험해보세요
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Map Visualization */}
            <div className="flex flex-col items-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/Cqx5f0Em0RYmBAUx1X8PGp-img-1_1770960494000_na1fn_c3BvdC1tYXAtdmlzdWFsaXphdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L0NxeDVmMEVtMFJZbUJBVXgxWDhQR3AtaW1nLTFfMTc3MDk2MDQ5NDAwMF9uYTFmbl9jM0J2ZEMxdFlYQXRkbWx6ZFdGc2FYcGhkR2x2YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LwmJsRnMyHmY9yftq45yweCeykQ~0f1U2Sv2akr2FFPZ2b62h9To4jwgXlTDx3OOpE3EzOH1XnNMGsnUZY~DY2X8KYRpQjTm00t2U1iVPco8OHdYJxPJHYsEyG0ZLNjm~PGnhWK~Z4~706DoRZsTPcmBZJ4lTzS1TXlx8g9~xHb28CMdRj6zPwXq6C-lLDmj3EzFVTp3ydFNpmThl0mkcFIZ9qJ6C3YaDKkNuhG7uvswInKJJbjVkCYNu3-JWJfTp0ekkd1w0QNgHrWLqtokVoCqBE1U1RWCZMKR0fGgYCpvjrDqDiaJDgHw92~k8baq0sUPwDqe2YbHDo8YHS0nlw__" 
                alt="Map visualization showing nearby MBTI matches"
                className="w-full max-w-sm rounded-lg border-2 border-primary shadow-lg"
              />
              <p className="mt-6 text-lg font-semibold text-center">
                지도 위에 나와 같은 성향의 사람들이<br />
                <span className="text-primary glow-cyan">전기 시안 색상</span>으로 표시됩니다.
              </p>
            </div>

            {/* Notification Popup */}
            <div className="flex flex-col items-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/Cqx5f0Em0RYmBAUx1X8PGp-img-2_1770960495000_na1fn_c3BvdC1ub3RpZmljYXRpb24tcG9wdXA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L0NxeDVmMEVtMFJZbUJBVXgxWDhQR3AtaW1nLTJfMTc3MDk2MDQ5NTAwMF9uYTFmbl9jM0J2ZEMxdWIzUnBabWxqWVhScGIyNHRjRzl3ZFhBLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=D-kgElfUkuxYb~OVbAYqYxIiBPzAdQAFfrJbhKRTDd16CF-kEA91tDA2T1sNoEaYD7jatQKFDpX0Bonv2mAf7HaR0t1e0ElFRtkfWDIzJUwLFJTzZHGZ4xx~LUH1tfSkHJxxbiOs0mnkVSl9eD4BgZGkumuwFOtgzNV43kbZ9Xnzrvi9l5jnpP4E744fYjMLjc6FiUVASPXQMJFOiV0SKUgybu9zs9qrk860px775xch5EraFGbhfSp3Pc5keAyOCuwGSrcHHhCQDUPdQ1IPoDX3P4oF3qeT9asnFmNEfeFjhuLvO0JyW3EXPMnDT8XKpiCuH1t-qrldxRwsIC2Ajw__" 
                alt="Notification popup showing nearby matches"
                className="w-full max-w-sm rounded-lg border-2 border-secondary shadow-lg"
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
            SPOT은 사람을 노출하지 않습니다.
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
              원칙 위에 우연을 설계합니다.
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
              <p className="text-lg text-muted-foreground">
                A. 아닙니다. 사용자님의 GPS는 반경 10m오차범위내로 측정되며, 사용자님과 비슷한 성향을 가진 유저와 마주칠 정도로 거리가 가까워지거나 사용자님과 비슷한 성향을 가진 유저가 많은 지역에 도착하실 경우 알려드립니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 연애 매칭앱인가요?
              </h3>
              <p className="text-lg text-muted-foreground">
                A. 절대 아닙니다. SPOT은 사용자끼리의 단순 상호작용을 할 수 있는 우연을 설계하는 플랫폼이지 우연을 필연으로 만들지, 우연으로 새길지는 오로지 사용자에게 달려 있습니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-accent">
                Q. MBTI만으로 저와 성향이 같다고 확신이 안들어요
              </h3>
              <p className="text-lg text-muted-foreground">
                A. 맞습니다. 하지만 베타버전에서만 MBTI 기반이며, 향후 정식 버전의 경우 다양한 성향 데이터가 삽입됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8">
            지금 바로 SPOT를 다운받아<br />
            우연을 설계해보세요.
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://jupjup-mvp2-3g7l.vercel.app/index.html?category=%EC%B9%B4%ED%8E%98&from=qr" target="_blank" rel="noopener noreferrer">
              <Button className="px-8 py-6 text-lg font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan">
                내 주변 확인하기
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
