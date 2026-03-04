import { trpc } from "@/lib/trpc";
import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from "recharts";

type Tab = "stats" | "logs" | "events" | "gpsmap" | "funnel" | "emails" | "spots";

const ADMIN_PASSWORD = "1229";
const SESSION_KEY = "spot_admin_auth";

// GPS Map Component using Leaflet
function GpsMapView({ locations }: { locations: Array<{ id: number; lat: number | null; lng: number | null; timestamp: Date; ipAddress: string }> }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      if (!(window as any).L) {
        // Load Leaflet CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Load Leaflet JS
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      const L = (window as any).L;
      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView([36.5, 127.8], 7);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add markers
      locations.forEach((loc) => {
        if (loc.lat == null || loc.lng == null) return;
        const marker = L.circleMarker([loc.lat, loc.lng], {
          radius: 8,
          fillColor: "#00f0ff",
          color: "#00f0ff",
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.7,
        }).addTo(map);

        const date = new Date(loc.timestamp).toLocaleString("ko-KR");
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 12px; color: #000;">
            <b>IP:</b> ${loc.ipAddress}<br/>
            <b>시간:</b> ${date}<br/>
            <b>좌표:</b> ${loc.lat?.toFixed(5)}, ${loc.lng?.toFixed(5)}
          </div>
        `);
      });
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div
      ref={mapRef}
      style={{ height: "480px", width: "100%", borderRadius: "8px", border: "1px solid rgba(0,240,255,0.3)" }}
    />
  );
}

// Funnel Bar Component
function FunnelBar({ step, count, rate, maxCount, color }: { step: string; count: number; rate: number; maxCount: number; color: string }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-foreground">{step}</span>
        <span className="font-mono" style={{ color }}>{count}명 ({rate}%)</span>
      </div>
      <div className="w-full h-8 bg-card/50 rounded-lg overflow-hidden border border-white/10">
        <div
          className="h-full rounded-lg transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
        />
      </div>
    </div>
  );
}

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onAuth();
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-xs space-y-6 px-6">
        <h1 className="text-4xl font-black text-center text-primary glow-cyan">SPOT</h1>
        <p className="text-center text-muted-foreground text-sm">관리자 전용 페이지</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="비밀번호"
            autoFocus
            className={`w-full bg-card border-2 rounded-lg px-4 py-3 text-center text-xl font-mono tracking-widest outline-none transition-colors ${
              error
                ? "border-red-500 text-red-400"
                : "border-primary/40 focus:border-primary text-foreground"
            }`}
          />
          {error && (
            <p className="text-center text-red-400 text-sm font-bold">비밀번호가 틀렸습니다.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 font-black border-2 border-primary bg-transparent hover:bg-primary/10 text-primary glow-cyan rounded-lg transition-all"
          >
            입장
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("stats");
  const [page, setPage] = useState(0);
  const [eventPage, setEventPage] = useState(0);
  const [emailPage, setEmailPage] = useState(0);
  const limit = 50;

  const { data, isLoading, refetch } = trpc.log.list.useQuery({
    limit,
    offset: page * limit,
  });

  const { data: eventData, isLoading: eventLoading } = trpc.log.listEvents.useQuery({
    limit,
    offset: eventPage * limit,
  });

  const { data: statsData, isLoading: statsLoading } = trpc.log.dailyStats.useQuery();
  const { data: summaryData } = trpc.log.eventSummary.useQuery();
  const { data: funnelData } = trpc.log.funnelStats.useQuery();
  const { data: gpsData } = trpc.log.gpsLocations.useQuery();
  const { data: emailData, isLoading: emailLoading } = trpc.email.list.useQuery({
    limit,
    offset: emailPage * limit,
  });

  const { data: spotsData, isLoading: spotsLoading } = trpc.spot.getAll.useQuery();

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const totalEventPages = eventData ? Math.ceil(eventData.total / limit) : 0;
  const totalEmailPages = emailData ? Math.ceil(emailData.total / limit) : 0;

  const formatDate = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (sec: number | null) => {
    if (!sec) return "-";
    if (sec < 60) return `${sec}초`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
  };

  // Fill missing dates in stats
  const chartData = useMemo(() => {
    if (!statsData?.stats) return [];
    return statsData.stats.map((s) => ({
      day: s.day.slice(5), // MM-DD
      방문수: Number(s.visits),
      순방문자: Number(s.unique_visitors),
    }));
  }, [statsData]);

  const funnelColors = ["#00f0ff", "#ff006e", "#8b5cf6"];
  const maxFunnelCount = funnelData?.funnel?.[0]?.count ?? 1;

  // Copy emails to clipboard
  const handleCopyEmails = () => {
    if (!emailData?.emails) return;
    const text = emailData.emails.map((e) => e.email).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      alert("이메일 목록이 클립보드에 복사되었습니다.");
    });
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "stats", label: "📊 일별 통계" },
    { id: "funnel", label: "🔽 퍼널 분석" },
    { id: "spots", label: "📍 스폿 목록" },
    { id: "gpsmap", label: "🗺️ GPS 지도" },
    { id: "emails", label: "📧 이메일 구독" },
    { id: "logs", label: "📋 접속 로그" },
    { id: "events", label: "🖱️ 이벤트 로그" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-primary glow-cyan">SPOT 관리자</h1>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="border-primary/50 hover:bg-primary/10 text-primary"
          >
            홈으로
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-card/50">
            <CardHeader className="pb-2">
              <CardDescription>총 접속</CardDescription>
              <CardTitle className="text-2xl font-black text-primary">{data?.total ?? "-"}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-secondary/20 bg-card/50">
            <CardHeader className="pb-2">
              <CardDescription>총 이벤트</CardDescription>
              <CardTitle className="text-2xl font-black text-secondary">{eventData?.total ?? "-"}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-accent/20 bg-card/50">
            <CardHeader className="pb-2">
              <CardDescription>GPS 수집</CardDescription>
              <CardTitle className="text-2xl font-black text-accent">
                {gpsData?.locations?.length ?? "-"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-card/50">
            <CardHeader className="pb-2">
              <CardDescription>이메일 구독</CardDescription>
              <CardTitle className="text-2xl font-black text-primary">
                {emailData?.total ?? "-"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 border-b border-primary/20">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
                tab === t.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {tab === "stats" && (
          <div className="space-y-6">
            <Card className="border-2 border-primary/20 bg-card/50">
              <CardHeader>
                <CardTitle className="text-xl font-black text-primary">최근 14일 방문 통계</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="day" tick={{ fill: "#aaa", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ background: "#1a1a2e", border: "1px solid #00f0ff", borderRadius: 8 }}
                        labelStyle={{ color: "#00f0ff" }}
                      />
                      <Legend />
                      <Bar dataKey="방문수" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="순방문자" fill="#ff006e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">아직 데이터가 없습니다.</div>
                )}
              </CardContent>
            </Card>

            {/* Event Summary */}
            <Card className="border-2 border-secondary/20 bg-card/50">
              <CardHeader>
                <CardTitle className="text-xl font-black text-secondary">버튼 클릭 집계</CardTitle>
              </CardHeader>
              <CardContent>
                {summaryData?.summary && summaryData.summary.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {summaryData.summary.map((s) => (
                      <div key={s.eventName} className="p-3 border border-secondary/20 rounded-lg bg-card/30">
                        <div className="text-xs text-muted-foreground truncate">{s.eventName}</div>
                        <div className="text-2xl font-black text-secondary">{s.cnt}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">아직 이벤트 데이터가 없습니다.</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Funnel Tab */}
        {tab === "funnel" && (
          <Card className="border-2 border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl font-black text-primary">전환 퍼널 분석</CardTitle>
              <CardDescription>보러가기 클릭 → MVP 지도 접속 → GPS 허용 전환율</CardDescription>
            </CardHeader>
            <CardContent>
              {funnelData?.funnel && funnelData.funnel.length > 0 ? (
                <div className="space-y-6 py-4">
                  {funnelData.funnel.map((step, i) => (
                    <FunnelBar
                      key={step.step}
                      step={step.step}
                      count={step.count}
                      rate={step.rate}
                      maxCount={maxFunnelCount}
                      color={funnelColors[i] || "#aaa"}
                    />
                  ))}

                  {/* Conversion rate summary */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {funnelData.funnel.length >= 2 && (
                      <div className="p-4 border border-secondary/30 rounded-lg bg-card/30 text-center">
                        <div className="text-xs text-muted-foreground mb-1">보러가기 → MVP 전환율</div>
                        <div className="text-3xl font-black text-secondary">
                          {funnelData.funnel[1].rate}%
                        </div>
                      </div>
                    )}
                    {funnelData.funnel.length >= 3 && (
                      <div className="p-4 border border-accent/30 rounded-lg bg-card/30 text-center">
                        <div className="text-xs text-muted-foreground mb-1">MVP → GPS 허용 전환율</div>
                        <div className="text-3xl font-black text-accent">
                          {funnelData.funnel[2].rate}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">아직 데이터가 없습니다.</div>
              )}

              {/* 평균 체류 시간 */}
              {funnelData?.avgDuration !== undefined && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 border border-primary/30 rounded-lg bg-card/30 text-center">
                    <div className="text-xs text-muted-foreground mb-1">랜딩페이지 평균 체류</div>
                    <div className="text-3xl font-black text-primary">
                      {funnelData.avgDuration.landing > 0
                        ? funnelData.avgDuration.landing >= 60
                          ? `${Math.floor(funnelData.avgDuration.landing / 60)}분 ${funnelData.avgDuration.landing % 60}초`
                          : `${funnelData.avgDuration.landing}초`
                        : '-'}
                    </div>
                  </div>
                  <div className="p-4 border border-secondary/30 rounded-lg bg-card/30 text-center">
                    <div className="text-xs text-muted-foreground mb-1">MVP 지도 평균 체류</div>
                    <div className="text-3xl font-black text-secondary">
                      {funnelData.avgDuration.mvp > 0
                        ? funnelData.avgDuration.mvp >= 60
                          ? `${Math.floor(funnelData.avgDuration.mvp / 60)}분 ${funnelData.avgDuration.mvp % 60}초`
                          : `${funnelData.avgDuration.mvp}초`
                        : '-'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* GPS Map Tab */}
        {tab === "gpsmap" && (
          <Card className="border-2 border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl font-black text-primary">GPS 수집 지도</CardTitle>
              <CardDescription>
                총 {gpsData?.locations?.length ?? 0}개의 GPS 좌표 수집됨
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gpsData?.locations && gpsData.locations.length > 0 ? (
                <GpsMapView locations={gpsData.locations as any} />
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="text-4xl mb-4">📍</div>
                  <div>아직 수집된 GPS 데이터가 없습니다.</div>
                  <div className="text-xs mt-2">사용자가 MVP 지도에 접속하면 GPS 좌표가 수집됩니다.</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Email Subscriptions Tab */}
        {tab === "emails" && (
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-primary">이메일 구독 목록</CardTitle>
                  <CardDescription>총 {emailData?.total || 0}명이 출시 알림을 신청했습니다.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCopyEmails}
                  className="border-primary/50 hover:bg-primary/10 text-primary text-sm"
                  disabled={!emailData?.emails?.length}
                >
                  📋 이메일 복사
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {emailLoading ? (
                <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
              ) : emailData && emailData.emails.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-primary/20">
                          <TableHead className="font-black text-primary">#</TableHead>
                          <TableHead className="font-black text-primary">이메일</TableHead>
                          <TableHead className="font-black text-primary">신청 시간</TableHead>
                          <TableHead className="font-black text-primary">출처</TableHead>
                          <TableHead className="font-black text-primary">IP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emailData.emails.map((sub, idx) => (
                          <TableRow key={sub.id} className="border-primary/10">
                            <TableCell className="text-xs text-muted-foreground">
                              {emailPage * limit + idx + 1}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-primary">{sub.email}</TableCell>
                            <TableCell className="font-mono text-xs">{formatDate(sub.agreedAt)}</TableCell>
                            <TableCell className="text-xs text-secondary">{sub.source}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{sub.ipAddress}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {totalEmailPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">페이지 {emailPage + 1} / {totalEmailPages}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setEmailPage(Math.max(0, emailPage - 1))} disabled={emailPage === 0} className="border-primary/50 hover:bg-primary/10">이전</Button>
                        <Button variant="outline" onClick={() => setEmailPage(emailPage + 1)} disabled={emailPage >= totalEmailPages - 1} className="border-primary/50 hover:bg-primary/10">다음</Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-4">📧</div>
                  <div>아직 이메일 구독 신청이 없습니다.</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Access Logs Tab */}
        {tab === "logs" && (
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black text-primary">접속 로그</CardTitle>
              <CardDescription>총 {data?.total || 0}개의 접속 기록</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
              ) : data && data.logs.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-primary/20">
                          <TableHead className="font-black text-primary">시간</TableHead>
                          <TableHead className="font-black text-primary">IP</TableHead>
                          <TableHead className="font-black text-primary">경로</TableHead>
                          <TableHead className="font-black text-primary">체류시간</TableHead>
                          <TableHead className="font-black text-primary">GPS</TableHead>
                          <TableHead className="font-black text-primary">User Agent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.logs.map((log) => (
                          <TableRow key={log.id} className="border-primary/10">
                            <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                            <TableCell className="font-mono text-xs text-secondary">{log.ipAddress}</TableCell>
                            <TableCell className="font-mono text-xs">{log.pathname}</TableCell>
                            <TableCell className="text-xs text-accent">{formatDuration(log.durationSec)}</TableCell>
                            <TableCell className="text-xs">
                              {log.gpsLat && log.gpsLng ? (
                                <a
                                  href={`https://maps.google.com/?q=${log.gpsLat},${log.gpsLng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline hover:text-primary/70"
                                >
                                  📍 {log.gpsLat.toFixed(4)}, {log.gpsLng.toFixed(4)}
                                </a>
                              ) : "-"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                              {log.userAgent || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">페이지 {page + 1} / {totalPages}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="border-primary/50 hover:bg-primary/10">이전</Button>
                      <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="border-primary/50 hover:bg-primary/10">다음</Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">아직 접속 기록이 없습니다.</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Spots Tab */}
        {tab === "spots" && (
          <Card className="border-2 border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl font-black text-primary">📍 실제 스폿 목록</CardTitle>
              <CardDescription>사용자들이 제출한 스폿 데이터 총 {spotsData?.spots?.length ?? 0}개</CardDescription>
            </CardHeader>
            <CardContent>
              {spotsLoading ? (
                <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
              ) : spotsData && spotsData.spots.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/20">
                        <TableHead className="font-black text-primary">시간</TableHead>
                        <TableHead className="font-black text-primary">MBTI</TableHead>
                        <TableHead className="font-black text-primary">MOOD</TableHead>
                        <TableHead className="font-black text-primary">MODE</TableHead>
                        <TableHead className="font-black text-primary">SIGN</TableHead>
                        <TableHead className="font-black text-primary">위치</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {spotsData.spots.map((spot) => (
                        <TableRow key={spot.id} className="border-primary/10">
                          <TableCell className="font-mono text-xs">{formatDate(spot.createdAt)}</TableCell>
                          <TableCell>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-black"
                              style={{
                                background: 'rgba(0,240,255,0.1)',
                                border: '1px solid rgba(0,240,255,0.5)',
                                color: '#00f0ff',
                              }}
                            >
                              {spot.mbti}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-bold" style={{color: '#c77dff'}}>{spot.mood}</TableCell>
                          <TableCell className="text-xs font-bold" style={{color: '#00f0b4'}}>{spot.mode}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{spot.sign}</TableCell>
                          <TableCell>
                            <a
                              href={`https://maps.google.com/?q=${spot.lat},${spot.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono hover:text-primary transition-colors"
                              style={{color: '#00f0ff88'}}
                            >
                              📍 {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">아직 제출된 스폿이 없습니다.</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Events Tab */}
        {tab === "events" && (
          <Card className="border-2 border-secondary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black text-secondary">이벤트 로그</CardTitle>
              <CardDescription>총 {eventData?.total || 0}개의 이벤트 기록</CardDescription>
            </CardHeader>
            <CardContent>
              {eventLoading ? (
                <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
              ) : eventData && eventData.logs.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-secondary/20">
                          <TableHead className="font-black text-secondary">시간</TableHead>
                          <TableHead className="font-black text-secondary">IP</TableHead>
                          <TableHead className="font-black text-secondary">이벤트</TableHead>
                          <TableHead className="font-black text-secondary">페이지</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventData.logs.map((log) => (
                          <TableRow key={log.id} className="border-secondary/10">
                            <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                            <TableCell className="font-mono text-xs text-secondary">{log.ipAddress}</TableCell>
                            <TableCell className="text-xs font-bold text-accent">{log.eventName}</TableCell>
                            <TableCell className="font-mono text-xs">{log.page}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">페이지 {eventPage + 1} / {totalEventPages}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEventPage(Math.max(0, eventPage - 1))} disabled={eventPage === 0} className="border-secondary/50 hover:bg-secondary/10">이전</Button>
                      <Button variant="outline" onClick={() => setEventPage(eventPage + 1)} disabled={eventPage >= totalEventPages - 1} className="border-secondary/50 hover:bg-secondary/10">다음</Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">아직 이벤트 기록이 없습니다.</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
