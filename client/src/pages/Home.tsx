/* 
 * Design Philosophy: Neo-Brutalism Digital Street Culture
 * - Aggressive diagonal layouts (15-20 degree angles)
 * - Electric cyan (#00F0FF) primary, hot magenta (#FF006E) secondary
 * - Thick brutalist borders, harsh shadows
 * - Immediate, visceral interactions
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("이메일을 입력해주세요");
      return;
    }
    toast.success("베타 오픈 알림 신청이 완료되었습니다!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/VA7zjdW7pUSn4IkMQHdLGr-img-1_1770878030000_na1fn_c3BvdC1oZXJvLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L1ZBN3pqZFc3cFVTbjRJa01RSGRMR3ItaW1nLTFfMTc3MDg3ODAzMDAwMF9uYTFmbl9jM0J2ZEMxb1pYSnZMV0puLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=iSJB02Q7RzaT7AsZlB8HuHk69uOCJfD5ASbGCeipobPh3CIFp5uazJwqPqpvSPbBHLJkejFcAXo2atWjiFi5im9vTRFrdlW4i6rjb-OvjkX7rFNKA034ZHCbolPQhauluhVA39tJ~pR7F3RXuyVb5hk-I5S8RmEdpco~SIQP5oAn3RmPUbV2qg9oVtOau6v8CcB2Hu3JwRmY4cufAccEdnBeuQbG6uugUuh65qOVnOkqDhhftBRCEWqhL5YbUBQmAeKS78z1sCF945WUP5~gR0HmEXBhkCOS-GRkzG71oMOOfzF7Pv-XgOzDRfryaA5fusY4N6XptDBmlGDv4HdlKg__')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="container relative z-10 py-20">
          <div className="max-w-5xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-primary glow-cyan tracking-tighter">
                SPOT
              </h1>
            </div>

            {/* Main Headline */}
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                지금 이 골목에<br />
                나랑 같은 <span className="text-secondary glow-magenta">mbti</span>가<br />
                몇명일까?
              </h2>
            </div>

            {/* Subtext */}
            <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl">
                Spot은 내 주변 나와 같은 성향을 가진 사람을<br className="block" />
                찾아주는 새로운 오프라인 소셜 앱입니다.
              </p>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-row gap-6 md:gap-8 items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663349269149/ptuqDsAPUhvdZaoe.png"
                  alt="Spot QR Code"
                  className="w-full h-full border-brutal border-primary shadow-brutal-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-lg md:text-2xl font-black leading-snug">
                  접속 후<br />
                  <span className="text-primary glow-cyan">내 주변 확인</span> 및<br />
                  <span className="text-secondary glow-magenta">베타 오픈 알림</span><br />
                  신청하세요
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal cut at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-background"
          style={{
            clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 md:py-32 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-6 glow-cyan text-primary">
              HOW IT WORKS
            </h2>
            <p className="text-xl text-muted-foreground">3단계로 시작하는 새로운 만남</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div 
              className="relative group"
              style={{
                transform: 'rotate(-2deg)',
              }}
            >
              <div className="bg-card border-brutal border-primary p-8 shadow-brutal-lg transition-all duration-150 hover:translate-x-2 hover:translate-y-2 hover:shadow-none">
                <div className="mb-6">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/VA7zjdW7pUSn4IkMQHdLGr-img-2_1770878021000_na1fn_c3BvdC1tYnRpLXZpc3VhbA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L1ZBN3pqZFc3cFVTbjRJa01RSGRMR3ItaW1nLTJfMTc3MDg3ODAyMTAwMF9uYTFmbl9jM0J2ZEMxdFluUnBMWFpwYzNWaGJBLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=WTfwK1Mh3GfgKxsY1boFhHLL1XLjRdfj-qbf8iLFPOJa-NSYKafKMMFMwWr9bcaL6AO-epLhIymORXCpFoKioZgbAT3t-XalNqinCv8zRL-O6ZXYjBoOZ4TWAwkEbBBISTopaKld4eLHUXbqzqsVfzvsnI6Qz3zePTrVCiStVA82bakPQ2B68ek4iBxbIURA4kJqh-BpflZ8Lo7KNGvBMnO0ZTK-yqoIyVG3SJsa4A5HVwP2~N-ABB6I-aB1tzPlQze99qDOUKW1VD-J7qfeCHViSxypCCossm7etSndJ4CDhWMJzYsWjg2sg~c4coMbF0QN2cKW4thyi6PalTkz5A__"
                    alt="MBTI Selection"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div className="text-secondary text-6xl font-black mb-4">01</div>
                <h3 className="text-3xl font-black mb-3">MBTI 선택</h3>
                <p className="text-muted-foreground text-lg">
                  당신의 성격 유형을 선택하세요
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              className="relative group md:mt-12"
              style={{
                transform: 'rotate(1deg)',
              }}
            >
              <div className="bg-card border-brutal border-secondary p-8 shadow-brutal-lg transition-all duration-150 hover:translate-x-2 hover:translate-y-2 hover:shadow-none">
                <div className="mb-6">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/VA7zjdW7pUSn4IkMQHdLGr-img-3_1770878026000_na1fn_c3BvdC1sb2NhdGlvbi12aXN1YWw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L1ZBN3pqZFc3cFVTbjRJa01RSGRMR3ItaW1nLTNfMTc3MDg3ODAyNjAwMF9uYTFmbl9jM0J2ZEMxc2IyTmhkR2x2YmkxMmFYTjFZV3cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=dLFAU9b0F5m12Q5Wq0dN0X2mJ0sHEegOI7jXQoYkqi~l0rMzOmHpHo95wgUyt4ofkphb~xfniFL03p87D-U2zsS5dpsKihlfhDPuzZBRYEyE7YuwmJqJLCFUMRJoAGkGdzBe5tXdxB-KOD7k6aGGRkLrHJhdA9T-it4F2L20ce8AgSIXTLj-5wHwCemMsiWtV3llZhyApOzM4sJww9d6tylbT-0yVg6X~ZpX13qjj8qRO24BfvbOlTXl0ZmYnKm3ichpLyeQAWpGw3lGt75-KUW6fWdGsO~e9Iph5e6yqUZ~pexRnSSFJvGv~Vdu8HLvrQlXfO8n5NTCfs73TnZGww__"
                    alt="Location Permission"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div className="text-primary text-6xl font-black mb-4">02</div>
                <h3 className="text-3xl font-black mb-3">위치 허용</h3>
                <p className="text-muted-foreground text-lg">
                  주변 사람들을 찾기 위한 위치 권한
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              className="relative group"
              style={{
                transform: 'rotate(-1deg)',
              }}
            >
              <div className="bg-card border-brutal border-primary p-8 shadow-brutal-lg transition-all duration-150 hover:translate-x-2 hover:translate-y-2 hover:shadow-none">
                <div className="mb-6">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/VA7zjdW7pUSn4IkMQHdLGr-img-4_1770878029000_na1fn_c3BvdC1jb25uZWN0aW9uLXZpc3VhbA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L1ZBN3pqZFc3cFVTbjRJa01RSGRMR3ItaW1nLTRfMTc3MDg3ODAyOTAwMF9uYTFmbl9jM0J2ZEMxamIyNXVaV04wYVc5dUxYWnBjM1ZoYkEucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ToSRMRtkrNHNSfSdZH3pPZJhcEartwkzgMZzkb9~XvoOvEq9qs6eHkPQasNP3lTuECcaID3O6RqtDWXaVwkTtzvw0-80E3UpyVIvJ4us7SB2yMDZR3EqH47VdAfjJ~BTs3c7zjnmqfbDxyFWNHE91r26AIMecNNQlLadnLSgzpRmaydXS44P9hv~pS6NpmLrfC-tdHK8JMOLDSTr9bxksoRzSm-MjD61q68de5ycrNfbJQtGLcjD~Gp~EV6rAXR-C4mTsALx5QuIXwqkt6H1E2O~~-4hKzKByFhHhCdOFCh0wPZ8~vj31L38TdTsSHRq-Oz5LkhQHPi0bNJIdqDj6A__"
                    alt="Connection Discovery"
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <div className="text-secondary text-6xl font-black mb-4">03</div>
                <h3 className="text-3xl font-black mb-3">근처 동질감 확인</h3>
                <p className="text-muted-foreground text-lg">
                  실시간으로 주변 같은 MBTI 발견
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section 
        className="relative py-24 md:py-32 bg-muted overflow-hidden"
        style={{
          clipPath: 'polygon(0 8%, 100% 0, 100% 92%, 0 100%)',
          marginTop: '-5rem',
          paddingTop: 'calc(8rem + 8%)',
          marginBottom: '-5rem',
          paddingBottom: 'calc(8rem + 8%)',
        }}
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-6 glow-magenta text-secondary">
              REAL-TIME SPOTS
            </h2>
            <p className="text-xl text-muted-foreground">지금 이 순간, 당신 근처의 사람들</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Example 1 */}
            <div 
              className="bg-background border-brutal border-primary p-6 md:p-8 shadow-brutal-lg transform hover:-rotate-1 transition-all duration-150"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-primary text-sm font-bold mb-2">📍 홍대입구역 1번출구</div>
                  <div className="text-2xl md:text-3xl font-black">
                    반경 10m내 <span className="text-primary glow-cyan">ENFP</span> <span className="text-secondary">7명</span>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">2분 전</div>
              </div>
            </div>

            {/* Example 2 */}
            <div 
              className="bg-background border-brutal border-secondary p-6 md:p-8 shadow-brutal-lg transform hover:rotate-1 transition-all duration-150 md:ml-12"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-secondary text-sm font-bold mb-2">📍 역할맥 홍대입구점</div>
                  <div className="text-2xl md:text-3xl font-black">
                    매장 내 <span className="text-secondary glow-magenta">ENTJ</span> <span className="text-primary">1명</span>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">5분 전</div>
              </div>
            </div>

            {/* Example 3 */}
            <div 
              className="bg-background border-brutal border-primary p-6 md:p-8 shadow-brutal-lg transform hover:-rotate-1 transition-all duration-150"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-primary text-sm font-bold mb-2">📍 성수동 스케줄 성수</div>
                  <div className="text-2xl md:text-3xl font-black">
                    건물 내 <span className="text-primary glow-cyan">INFP</span> <span className="text-secondary">4명</span>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">방금 전</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/RI0UmZT2UawdZQgkbddR7v/sandbox/VA7zjdW7pUSn4IkMQHdLGr-img-5_1770878030000_na1fn_c3BvdC1jdGEtYmc.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUkkwVW1aVDJVYXdkWlFna2JkZFI3di9zYW5kYm94L1ZBN3pqZFc3cFVTbjRJa01RSGRMR3ItaW1nLTVfMTc3MDg3ODAzMDAwMF9uYTFmbl9jM0J2ZEMxamRHRXRZbWMucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=JJD3oLhgojXOYCKbAaQSCl856Xb9AjIkPAxEcla42DMASS9KCZpqifKXgBMQ4d34gLR49psiq1CozR80OLk13jGZSLsB3fK~bnc4IrnNdNomsaQ8MKElh-LNJEpRnK8WOdYz8oxCQMPAiMPCI7j8YCwWocJ4tqSCuNV9bXUVZuUQ7Qw4~9ErMzWOb70ftxNhBHHRkw-ERSOamVidloQApJtoPh5UcdMrXl9HcndSLdWWxph4BnuVz0nTL0-XXkgvZ9zQVdcIeYiCwHpoAEduvtaKB9XBVlFWqWlXu~n1aRbxUU9KqJT2u-K1ZQJ5fvIellxYg4IDCyL0Cpj57q9nQw__')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8 glow-cyan">
              베타 오픈 알림 받기
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12">
              가장 먼저 Spot으로<br className="md:hidden" /> 나와 꼭 맞는 사람을 찾아보세요.
            </p>

            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 px-6 text-lg bg-background border-brutal border-primary text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                type="submit"
                size="lg"
                className="h-14 px-8 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 border-brutal shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 font-bold whitespace-nowrap"
              >
                알림 신청
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t-8 border-primary py-12">
        <div className="container">
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-4 glow-cyan">SPOT</div>
            <p className="text-muted-foreground">© 2026 Spot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
