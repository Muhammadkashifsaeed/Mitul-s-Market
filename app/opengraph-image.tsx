import { ImageResponse } from "next/og";

export const alt =
  "Mitul's Market — Premium Tech, Electronics & Lifestyle Storefront";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 52%, #FFFFFF 100%)",
          color: "#1E293B",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Row: Laptop Brand Mark + Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="44"
                height="44"
                fill="none"
              >
                <rect
                  x="4"
                  y="5"
                  width="24"
                  height="15"
                  rx="2.5"
                  fill="#FFFFFF"
                />
                <rect
                  x="6.5"
                  y="7.5"
                  width="19"
                  height="10"
                  rx="1.2"
                  fill="#312E81"
                />
                <path
                  d="M1.5 23.2C1.5 22.26 2.26 21.5 3.2 21.5H28.8C29.74 21.5 30.5 22.26 30.5 23.2V23.8C30.5 25.35 29.25 26.6 27.7 26.6H4.3C2.75 26.6 1.5 25.35 1.5 23.8V23.2Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>
            <div style={{ display: "flex", fontSize: 38, fontWeight: 800 }}>
              <span style={{ color: "#1E293B" }}>Mitul&apos;s&nbsp;</span>
              <span style={{ color: "#4F46E5" }}>Market</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 999,
              border: "2px solid #C7D2FE",
              background: "#FFFFFF",
              padding: "10px 22px",
              fontSize: 20,
              fontWeight: 700,
              color: "#4F46E5",
            }}
          >
            Tech • Audio • Fashion
          </div>
        </div>

        {/* Center Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 920,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#0F172A",
            }}
          >
            Discover the Future of Tech &amp; Lifestyle Essentials
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#475569",
            }}
          >
            Curated wireless audio, keyboards, smartwatches, and everyday carry
            with fast delivery and easy 30-day returns.
          </div>
        </div>

        {/* Bottom Feature Pills */}
        <div style={{ display: "flex", gap: 18 }}>
          <div
            style={{
              display: "flex",
              borderRadius: 16,
              background: "#4F46E5",
              color: "#FFFFFF",
              padding: "14px 26px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Free Shipping Over ₹999
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 16,
              border: "2px solid #E2E8F0",
              background: "#FFFFFF",
              color: "#1E293B",
              padding: "14px 26px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Save 10% with Code MITUL10
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

