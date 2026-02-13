import { Button } from "@/components/ui/button";

export default function Home() {
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
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/2w0KUQtNPoCtXFq4c2TcnN-img-1_1770961248000_na1fn_c3BvdC1tYXAtcmVhbGlzdGlj.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94LzJ3MEtVUXROUG9DdFhGcTRjMlRjbk4taW1nLTFfMTc3MDk2MTI0ODAwMF9uYTFmbl9jM0J2ZEMxdFlYQXRjbVZoYkdsemRHbGoucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=mOTyHrv8zQPAsU02ykEPr6jChujrtq6DUcDeFxtWVIAsu-LwnLHFgUqCQ0phj5hWpdS23PNxKh65EJ8UV4HMSnK9wJqnBgD-KKCeQbte9kgLjqHa3NYIL2whJ1FAYVHplNy8T5JZPAyfiv5Rg2Kg4est~QivPuspH9Z8kHBsYpAN866P6JlZGNLbI0af4E7OZa5sJztVza1id5FMa3bDNJHOYn7xp1VJ9vcO28u0aCOzlPKRWTUgib6j6E4cYGPK0Won7wybMhkkmLObM-ofj8Yk0kFzqLum6CdWH0cLSIujJdZWS7mZyvY6t62Nn3DMoxvsBbSKea-E60CH0ez-hg__" 
                alt="Map visualization"
                className="w-full max-w-sm rounded-lg border-2 border-primary shadow-lg"
              />
              <p className="mt-6 text-lg font-semibold text-center">
                지도 위에 나와 같은 성향의 사람들이<br />
                <span className="text-primary glow-cyan">전기 시안 색상</span>으로 표시됩니다.
              </p>
            </div>

            <div className="flex flex-col items-center order-first md:order-last">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/2w0KUQtNPoCtXFq4c2TcnN-img-2_1770961255000_na1fn_c3BvdC1ub3RpZmljYXRpb24tcmVhbGlzdGlj.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94LzJ3MEtVUXROUG9DdFhGcTRjMlRjbk4taW1nLTJfMTc3MDk2MTI1NTAwMF9uYTFmbl9jM0J2ZEMxdWIzUnBabWxqWVhScGIyNDRjbVZoYkdsemRHbGoucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=eEFrYIZEsfWQ62IVguOU7n-2K7JmU9goSh-o55V9HmbS3kkUbHhwARw23LE~BJn~4au9PpXusNDhmjFh99cx-bAgHbd0q0gr93sDFRTAntWRtztwShogSezpuBA8Zt7FDiiC0YTCmfwHmUJvP2DbtDbCrMMyghJtc271lzIpJj~-CHBz~nG5lIIdGwHunlALoGNNY54Me3BP~rIK1vNpKgsNEhZhmXrdybLmPI7~fXYgDUJgRSE9j~b4T8KSD-VV2tAjs6Fj4yH8fxkiOg-MzeVLBX0NrKDaSxZ~KeGteGReSz~ne-Mbsl394MYC93cIEpfVwr7xkG90HnNm-FpJOA__" 
                alt="Notification popup"
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
              <p className="text-lg text-muted-foreground">
                A. 아닙니다. GPS는 반경 10m 오차범위로 측정되며, 비슷한 성향의 유저가 근처에 있을 때만 알려드립니다.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-secondary glow-magenta">
                Q. 연애 매칭앱인가요?
              </h3>
              <p className="text-lg text-muted-foreground">
                A. 아닙니다. <span className="text-primary glow-cyan">SPOT</span>은 <span className="text-secondary glow-magenta">우연</span>을 설계하는 플랫폼일 뿐, 그 <span className="text-secondary glow-magenta">우연</span>을 필연으로 만들지는 사용자에게 달려있습니다.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 border-2 border-border bg-background/50">
              <h3 className="text-xl font-black mb-3 text-accent">
                Q. MBTI만으로 충분한가요?
              </h3>
              <p className="text-lg text-muted-foreground">
                A. 베타는 MBTI 기반입니다. 정식 버전에서는 다양한 성향 데이터가 추가됩니다.
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
