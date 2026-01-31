import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Shen Haoming - Software Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom right, #111827, #000000)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            opacity: 0.1,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 20 }}>
          <div
            style={{
              width: 20,
              height: 20,
              background: "#3b82f6",
              borderRadius: "50%",
              boxShadow: "0 0 20px #3b82f6",
            }}
          />
          <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: -2, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', backgroundClip: 'text', color: 'transparent' }}>
            PORTFOLIO
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: 80, margin: 0, fontWeight: 800, textAlign: 'center', lineHeight: 1.1 }}>
            Shen Haoming
            </h1>
            <p style={{ fontSize: 40, margin: '20px 0 0', opacity: 0.8, fontWeight: 400 }}>
            Software Developer
            </p>
        </div>
        <div style={{ position: "absolute", bottom: 60, fontSize: 24, opacity: 0.5 }}>
            shen-haoming.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
