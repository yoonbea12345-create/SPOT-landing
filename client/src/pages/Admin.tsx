import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
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
} from "recharts";

type Tab = "logs" | "events" | "stats";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("stats");
  const [page, setPage] = useState(0);
  const [eventPage, setEventPage] = useState(0);
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

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const totalEventPages = eventData ? Math.ceil(eventData.total / limit) : 0;

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
              <CardDescription>오늘 방문</CardDescription>
              <CardTitle className="text-2xl font-black text-accent">
                {statsData?.stats?.find(s => s.day === new Date().toLocaleDateString('sv-SE'))?.visits ?? 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-card/50">
            <CardHeader className="pb-2">
              <CardDescription>GPS 수집</CardDescription>
              <CardTitle className="text-2xl font-black text-primary">
                {data?.logs?.filter(l => l.gpsLat).length ?? "-"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-primary/20">
          {(["stats", "logs", "events"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-bold transition-colors ${
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "stats" ? "📊 일별 통계" : t === "logs" ? "📋 접속 로그" : "🖱️ 이벤트 로그"}
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
