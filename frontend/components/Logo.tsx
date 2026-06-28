"use client";

/** Reverie mark — a glowing memory framed: an aperture/sun over a soft horizon. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Reverie"
    >
      <defs>
        <linearGradient id="revGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0B66E" />
          <stop offset="1" stopColor="#D98E5A" />
        </linearGradient>
        <radialGradient id="revGlow" cx="24" cy="20" r="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4EFE7" />
          <stop offset="1" stopColor="#E0B66E" />
        </radialGradient>
      </defs>
      {/* frame */}
      <rect x="4.5" y="4.5" width="39" height="39" rx="12" stroke="url(#revGrad)" strokeWidth="2.5" />
      {/* the memory — a glowing sun */}
      <circle cx="24" cy="20" r="6.5" fill="url(#revGlow)" />
      {/* horizon */}
      <path
        d="M9 34c4-4.5 8-4.5 11.5-1.5S29 35 32 32s4.5-2 7-0.5"
        stroke="url(#revGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
