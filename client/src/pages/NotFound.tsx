import React from "react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070a",
        color: "white",
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.5px" }}>404</div>
        <div style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>
          여긴 비어있어. 대신 <b>/mvp</b>로 가면 지도가 떠.
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/">
            <a style={btn}>홈으로</a>
          </Link>
          <Link href="/mvp">
            <a style={{ ...btn, borderColor: "rgba(255,90,160,0.55)", background: "rgba(255,90,160,0.14)" }}>
              지도 MVP
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontWeight: 900,
  textDecoration: "none",
};
