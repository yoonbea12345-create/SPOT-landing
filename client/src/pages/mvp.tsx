import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Mode = "wide" | "near" | "3m";
type Spot = { id: string; lat: number; lng: number; mbti: string };

const MBTIS = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP"
];

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

// meters
function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function vibeScore(a: string, b: string) {
  let s = 0;
  for (let i = 0; i < 4; i++) if (a[i] === b[i]) s += 1;
  return s; // 0~4
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateSpots(lat: number, lng: number, count: number): Spot[] {
  const spread = 0.007; // 수백 m 느낌
  return Array.from({ length: count }).map((_, i) => ({
    id: `spot_${i}_${Math.random().toString(16).slice(2)}`,
    lat: lat + rand(-spread, spread),
    lng: lng + rand(-spread, spread),
    mbti: MBTIS[Math.floor(Math.random() * MBTIS.length)],
  }));
}

function Recenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom, { animate: true });
  }, [lat, lng, zoom, map]);
  return null;
}

function Toast({ show, title, sub }: { show: boolean; title: string; sub?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        right: 14,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        transform: show ? "translateY(0)" : "translateY(-12px)",
        opacity: show ? 1 : 0,
        transition: "all 220ms ease",
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          background: "rgba(10,10,12,0.82)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 16,
          padding: "12px 14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.2px" }}>{title}</div>
        {sub ? <div style={{ marginTop: 4, fontSize: 13, opacity: 0.85, lineHeight: 1.25 }}>{sub}</div> : null}
      </div>
    </div>
  );
}

export default function MVP_SPOT() {
  const [mode, setMode] = useState<Mode>("wide");
  const [myMbti, setMyMbti] = useState(() => MBTIS[Math.floor(Math.random() * MBTIS.length)]);

  const [me, setMe] = useState({ lat: 37.5665, lng: 126.9780 }); // fallback
  const [spots, setSpots] = useState<Spot[]>(() => generateSpots(37.5665, 126.9780, 40));

  const [toast, setToast] = useState({ show: true, title: "지금 이 근처에…", sub: "나랑 비슷한 MBTI가 있을까?" });
  const timer = useRef<number | null>(null);

  const zoomByMode: Record<Mode, number> = { wide: 13, near: 16, "3m": 18 };
  const is3m = mode === "3m";

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMe({ lat, lng });
        setSpots(generateSpots(lat, lng, 40));
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  function showToast(title: string, sub?: string, ms = 1500) {
    setToast({ show: true, title, sub });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  }

  function changeMode(next: Mode) {
    setMode(next);
    if (next === "wide") showToast("오늘의 흐름이 보여.", "어디로 모였는지.");
    if (next === "near") showToast("가까워질수록 또렷해져.", "비슷한 쪽이 먼저 보여.");
    if (next === "3m") {
      showToast("3m 안. 이 골목 어딘가에.", "지금, 마주칠 수도.");
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    }
  }

  const visibleSpots = useMemo(() => {
    if (mode === "wide") return spots;

    // Near/3M: 나랑 vibe 맞는 애들 위주로 정리 (정보 과부하 방지)
    const scored = spots
      .map((s) => ({ s, score: vibeScore(myMbti, s.mbti) }))
      .sort((a, b) => b.score - a.score);

    let filtered = scored.filter((x) => x.score >= 3).map((x) => x.s);
    if (filtered.length < 10) filtered = scored.filter((x) => x.score >= 2).map((x) => x.s);

    if (mode === "3m") return filtered.slice(0, 5);
    return filtered.slice(0, 18);
  }, [mode, spots, myMbti]);

  function markerStyle(s: Spot) {
    const d = distanceMeters(me.lat, me.lng, s.lat, s.lng);
    const maxD = mode === "wide" ? 2000 : 600;
    const t = 1 - clamp(d / maxD, 0, 1); // 가까울수록 1
    const opacity = 0.10 + t * 0.80;
    const radius = 5 + t * 10;
    const hue = (s.mbti.charCodeAt(0) + s.mbti.charCodeAt(3)) % 360;
    const color = `hsl(${hue}, 82%, 62%)`;
    return { opacity, radius, color, d };
  }

  const pageBg =
    "radial-gradient(1200px 700px at 50% 0%, rgba(255,255,255,0.08), rgba(0,0,0,0) 55%), #07070A";

  return (
    <div style={{ height: "100vh", width: "100vw", background: pageBg, position: "relative", color: "white" }}>
      <Toast show={toast.show} title={toast.title} sub={toast.sub} />

      {/* top */}
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          top: 70,
          zIndex: 9999,
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.3px" }}>SPOT</div>
          <div style={{ fontSize: 13, opacity: 0.82, lineHeight: 1.2 }}>
            점을 찍지 않아. <br /> 존재를 비춰.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div
            style={{
              fontSize: 12,
              opacity: 0.9,
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            내 MBTI <b style={{ marginLeft: 6 }}>{myMbti}</b>
          </div>

          <button
            onClick={() => {
              const next = MBTIS[Math.floor(Math.random() * MBTIS.length)];
              setMyMbti(next);
              showToast("오늘의 나.", next);
            }}
            style={btnGhost}
          >
            MBTI 바꾸기
          </button>

          <button
            onClick={() => {
              setSpots(generateSpots(me.lat, me.lng, 40));
              showToast("다시 켰어.", "지금의 존재만 남겼어.");
            }}
            style={btnGhost}
          >
            지금 다시 보기
          </button>
        </div>
      </div>

      {/* map */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.98 }}>
        <MapContainer center={[me.lat, me.lng]} zoom={zoomByMode[mode]} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <Recenter lat={me.lat} lng={me.lng} zoom={zoomByMode[mode]} />
          <TileLayer attribution="" url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {/* me */}
          <CircleMarker center={[me.lat, me.lng]} radius={7} pathOptions={{ color: "rgba(255,255,255,0.92)" }} />
          <Circle
            center={[me.lat, me.lng]}
            radius={mode === "wide" ? 800 : mode === "near" ? 250 : 20}
            pathOptions={{ color: "rgba(255,255,255,0.18)", weight: 1, fillOpacity: 0.02 }}
          />

          {/* spots */}
          {is3m ? (
            <>
              {/* 3M: 점 금지. 범위만. */}
              {visibleSpots.map((s) => {
                const d = distanceMeters(me.lat, me.lng, s.lat, s.lng);
                const r = clamp(3 + (d % 4), 3, 7); // 3~7m 느낌
                const angle = ((s.lat + s.lng) * 100000) % (Math.PI * 2);

                const latOffset = (r / 111111) * Math.cos(angle);
                const lngOffset = (r / (111111 * Math.cos((me.lat * Math.PI) / 180))) * Math.sin(angle);

                return (
                  <Circle
                    key={s.id}
                    center={[me.lat + latOffset, me.lng + lngOffset]}
                    radius={r}
                    pathOptions={{
                      color: "rgba(255, 90, 160, 0.30)",
                      weight: 1,
                      fillColor: "rgba(255, 90, 160, 0.18)",
                      fillOpacity: 0.25,
                    }}
                  />
                );
              })}

              <Circle
                center={[me.lat, me.lng]}
                radius={9}
                pathOptions={{
                  color: "rgba(255, 90, 160, 0.45)",
                  weight: 1.5,
                  fillColor: "rgba(255, 90, 160, 0.10)",
                  fillOpacity: 0.18,
                }}
              />
            </>
          ) : (
            <>
              {visibleSpots.map((s) => {
                const st = markerStyle(s);
                return (
                  <CircleMarker
                    key={s.id}
                    center={[s.lat, s.lng]}
                    radius={st.radius}
                    pathOptions={{
                      color: st.color,
                      weight: 1,
                      opacity: st.opacity,
                      fillColor: st.color,
                      fillOpacity: st.opacity * 0.9,
                    }}
                  />
                );
              })}
            </>
          )}
        </MapContainer>
      </div>

      {/* bottom mode bar */}
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 16, zIndex: 9999, display: "flex", justifyContent: "center" }}>
        <div style={modeBar}>
          <button onClick={() => changeMode("wide")} style={modeBtn(mode === "wide")}>
            Wide <span style={{ opacity: 0.7, marginLeft: 6 }}>먼 시야</span>
          </button>
          <button onClick={() => changeMode("near")} style={modeBtn(mode === "near")}>
            Near <span style={{ opacity: 0.7, marginLeft: 6 }}>가까운 시야</span>
          </button>
          <button onClick={() => changeMode("3m")} style={modeBtn(mode === "3m", true)}>
            3M <span style={{ opacity: 0.7, marginLeft: 6 }}>초근접</span>
          </button>
        </div>
      </div>

      {/* vibe copy */}
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 88, zIndex: 9998, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ width: "min(560px, 100%)", opacity: 0.86, fontSize: 13, lineHeight: 1.25 }}>
          {mode === "wide" && (
            <>
              누군지는 알 수 없어요. <br />
              대신, 흐름이 보여요.
            </>
          )}
          {mode === "near" && (
            <>
              점이 아니라, 범위예요. <br />
              가까워질수록 선명해져요.
            </>
          )}
          {mode === "3m" && (
            <>
              누군지는… 알 수 없어요. <br />
              근데, 지금. 여기일 수도.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const btnGhost: React.CSSProperties = {
  appearance: "none",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  padding: "10px 12px",
  borderRadius: 14,
  fontSize: 12,
  fontWeight: 900,
  cursor: "pointer",
};

const modeBar: React.CSSProperties = {
  display: "flex",
  gap: 10,
  padding: 10,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(10,10,12,0.72)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
};

function modeBtn(active: boolean, hot?: boolean): React.CSSProperties {
  return {
    appearance: "none",
    border: active
      ? hot
        ? "1px solid rgba(255,90,160,0.55)"
        : "1px solid rgba(255,255,255,0.32)"
      : "1px solid rgba(255,255,255,0.12)",
    background: active ? (hot ? "rgba(255,90,160,0.18)" : "rgba(255,255,255,0.12)") : "rgba(255,255,255,0.06)",
    color: "white",
    padding: "10px 12px",
    borderRadius: 14,
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
    minWidth: 120,
    letterSpacing: "-0.2px",
  };
}
