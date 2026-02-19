import React from "react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div style={wrap}>
      <div style={card}>
        <div style={brand}>SPOT</div>
        <div style={headline}>내 주변 MBTI 분포, 지금 바로</div>
        <div style={sub}>
          위치 기반으로 “흐름”만 보여주는 지도 MVP. <br />
          누군지는 몰라. 대신, 어디에 모였는지 보여.
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <Link href="/mvp">
            <a style={{ ...btn, borderColor: "rgba(255,90,160,0.55)", background: "rgba(255,90,160,0.14)" }}>
              지도 MVP 열기
            </a>
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            style={btnGhost}
            onClick={(e) => e.preventDefault()}
            title="나중에 팀 링크로 교체"
          >
            GitHub
          </a>
        </div>

        <div style={mini}>
          테스트: <code style={code}>/mvp</code> 직접 접속 / 새로고침해도 404 안 나게 설정됨.
        </div>
      </div>

      <div style={bgGlow} />
    </div>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "#07070a",
  color: "white",
  display: "grid",
  placeItems: "center",
  padding: 18,
  position: "relative",
  overflow: "hidden",
};

const bgGlow: React.CSSProperties = {
  position: "absolute",
  inset: -200,
  background:
    "radial-gradient(900px 500px at 30% 20%, rgba(255,90,160,0.18), rgba(0,0,0,0) 60%), radial-gradient(900px 500px at 70% 60%, rgba(120,180,255,0.12), rgba(0,0,0,0) 60%)",
  filter: "blur(10px)",
  pointerEvents: "none",
};

const card: React.CSSProperties = {
  width: "min(560px, 100%)",
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(10,10,12,0.78)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
  padding: "18px 16px",
  position: "relative",
  zIndex: 1,
};

const brand: React.CSSProperties = {
  fontWeight: 950,
  letterSpacing: "-0.6px",
  fontSize: 18,
  opacity: 0.95,
};

const headline: React.CSSProperties = {
  marginTop: 10,
  fontSize: 26,
  fontWeight: 950,
  letterSpacing: "-0.8px",
  lineHeight: 1.1,
};

const sub: React.CSSProperties = {
  marginTop: 10,
  fontSize: 14,
  opacity: 0.8,
  lineHeight: 1.4,
};

const mini: React.CSSProperties = {
  marginTop: 14,
  fontSize: 12,
  opacity: 0.7,
};

const code: React.CSSProperties = {
  padding: "2px 6px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.10)",
};

const btn: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontWeight: 950,
  textDecoration: "none",
};

const btnGhost: React.CSSProperties = {
  ...btn,
  opacity: 0.9,
};
