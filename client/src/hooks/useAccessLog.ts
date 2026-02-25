import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

/**
 * Hook to automatically track page access logs
 * Call this in App.tsx or any top-level component
 */
export function useAccessLog() {
  const [location] = useLocation();
  const trackMutation = trpc.log.track.useMutation();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    // Avoid duplicate tracking
    if (location === lastTrackedPath.current) return;
    
    lastTrackedPath.current = location;
    
    // Track the page access
    trackMutation.mutate({ pathname: location });
  }, [location]);
}
