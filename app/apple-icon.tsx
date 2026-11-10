import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="124"
          height="124"
          fill="none"
        >
          <rect x="4" y="5" width="24" height="15" rx="2.5" fill="#FFFFFF" />
          <rect x="6.5" y="7.5" width="19" height="10" rx="1.2" fill="#312E81" />
          <path
            d="M9 10.5H17M9 13.5H13.5"
            stroke="#A5B4FC"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="21.5" cy="13.5" r="1.6" fill="#34D399" />
          <path
            d="M1.5 23.2C1.5 22.26 2.26 21.5 3.2 21.5H28.8C29.74 21.5 30.5 22.26 30.5 23.2V23.8C30.5 25.35 29.25 26.6 27.7 26.6H4.3C2.75 26.6 1.5 25.35 1.5 23.8V23.2Z"
            fill="#FFFFFF"
          />
          <rect x="13" y="22.8" width="6" height="1.4" rx="0.7" fill="#4F46E5" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

