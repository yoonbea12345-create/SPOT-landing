import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

/**
 * Hook to automatically track page access logs
 * Call this in App.tsx or any top-level component
 * - 경로별로 logId를 따로 저장 (spotLogId_{pathname})
 * - 페이지 닫힐 시 sendBeacon으로 체류 시간 전송 (정확한 tRPC superjson 포맷)
 */
export function useAccessLog() {
  const [location] = useLocation();
  const trackMutation = trpc.log.track.useMutation();
  const lastTrackedPath = useRef<string>("");
  const startTimeRef = useRef<number>(Date.now());
  const currentLogIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Avoid duplicate tracking
    if (location === lastTrackedPath.current) return;

    lastTrackedPath.current = location;
    startTimeRef.current = Date.now();
    currentLogIdRef.current = null;

    // Track the page access and store logId per-path in sessionStorage
    trackMutation.mutate(
      { pathname: location },
      {
        onSuccess: (data) => {
          if (data.logId) {
            const key = `spotLogId_${location}`;
            sessionStorage.setItem(key, String(data.logId));
            // 하위 호환성: 기존 spotLogId도 유지
            sessionStorage.setItem('spotLogId', String(data.logId));
            currentLogIdRef.current = data.logId;
          }
        },
      }
    );
  }, [location]);

  // 페이지 닫힐 시 체류 시간 전송
  useEffect(() => {
    const sendDuration = () => {
      const id = currentLogIdRef.current;
      if (!id) return;
      const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (sec < 1) return;

      // sendBeacon은 Content-Type이 text/plain으로 전송되어 tRPC가 파싱 못 함
      // 대신 fetch keepalive 사용
      fetch('/api/trpc/log.updateDuration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "0": { json: { logId: id, durationSec: sec } } }),
        keepalive: true,
      }).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendDuration();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', sendDuration);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendDuration);
    };
  }, []);
}
