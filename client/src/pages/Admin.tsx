import { trpc } from "@/lib/trpc";
import { useState } from "react";
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

export default function Admin() {
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data, isLoading, refetch } = trpc.log.list.useQuery({
    limit,
    offset: page * limit,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

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

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-primary glow-cyan">
              접속 로그 관리
            </CardTitle>
            <CardDescription className="text-lg">
              총 {data?.total || 0}개의 접속 기록
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                로딩 중...
              </div>
            ) : data && data.logs.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/20">
                        <TableHead className="font-black text-primary">시간</TableHead>
                        <TableHead className="font-black text-primary">IP 주소</TableHead>
                        <TableHead className="font-black text-primary">경로</TableHead>
                        <TableHead className="font-black text-primary">User Agent</TableHead>
                        <TableHead className="font-black text-primary">Referer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.logs.map((log) => (
                        <TableRow key={log.id} className="border-primary/10">
                          <TableCell className="font-mono text-sm">
                            {formatDate(log.timestamp)}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-secondary">
                            {log.ipAddress}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.pathname}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                            {log.userAgent || "-"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                            {log.referer || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    페이지 {page + 1} / {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="border-primary/50 hover:bg-primary/10"
                    >
                      이전
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages - 1}
                      className="border-primary/50 hover:bg-primary/10"
                    >
                      다음
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                아직 접속 기록이 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="border-primary/50 hover:bg-primary/10 text-primary"
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
