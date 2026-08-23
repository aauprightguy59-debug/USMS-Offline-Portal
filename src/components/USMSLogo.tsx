import React from 'react';

interface USMSLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const USMSLogo: React.FC<USMSLogoProps> = ({
  className = 'w-9 h-9',
  size,
  showText = false
}) => {
  const sizeStyle = size ? { width: size, height: size } : undefined;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} style={sizeStyle}>
      <svg
        viewBox="0 0 400 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm flex-shrink-0"
      >
        <defs>
          <linearGradient id="shieldBg" x1="200" y1="60" x2="200" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="goldBorder" x1="0" y1="0" x2="400" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="capGold" x1="100" y1="40" x2="300" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Shield Outline (Gold) */}
        <path
          d="M200 70 L340 120 C340 260 280 360 200 415 C120 360 60 260 60 120 Z"
          fill="url(#goldBorder)"
          filter="url(#shieldShadow)"
        />

        {/* Inner Shield Body (Royal Blue) */}
        <path
          d="M200 86 L324 130 C324 252 270 344 200 395 C130 344 76 252 76 130 Z"
          fill="url(#shieldBg)"
        />

        {/* Inner Shield Accent Contour */}
        <path
          d="M200 96 L312 136 C312 245 264 330 200 378 C136 330 88 245 88 136 Z"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeOpacity="0.4"
        />

        {/* USMS Bold Golden Typography */}
        <g id="usms-text">
          <text
            x="200"
            y="255"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="68"
            letterSpacing="2"
            fill="#FACC15"
          >
            USMS
          </text>
        </g>

        {/* Open Book at the bottom */}
        <g id="open-book" transform="translate(105, 290)">
          {/* Left Book Page */}
          <path
            d="M95 55 C65 48 30 50 10 60 L10 40 C30 30 65 28 95 35 Z"
            fill="#FACC15"
          />
          {/* Right Book Page */}
          <path
            d="M95 55 C125 48 160 50 180 60 L180 40 C160 30 125 28 95 35 Z"
            fill="#FACC15"
          />
          {/* Left Inner Page Line */}
          <path
            d="M95 38 C70 32 38 34 20 42 L20 47 C38 39 70 37 95 43 Z"
            fill="#CA8A04"
          />
          {/* Right Inner Page Line */}
          <path
            d="M95 38 C120 32 152 34 170 42 L170 47 C152 39 120 37 95 43 Z"
            fill="#CA8A04"
          />
          {/* Center Spine Accent */}
          <path d="M92 36 L98 36 L96 68 L94 68 Z" fill="#EAB308" />
        </g>

        {/* Mortarboard / Graduation Cap Top */}
        <g id="mortarboard">
          {/* Cap Base Block Under Diamond */}
          <path
            d="M145 105 L200 135 L255 105 L255 130 C255 148 230 162 200 162 C170 162 145 148 145 130 Z"
            fill="#CA8A04"
          />
          <path
            d="M145 105 L200 135 L200 162 C170 162 145 148 145 130 Z"
            fill="#A16207"
          />

          {/* Diamond Top Cap Surface */}
          <polygon
            points="200,30 305,80 200,122 95,80"
            fill="url(#capGold)"
            stroke="#CA8A04"
            strokeWidth="3"
          />

          {/* Button & Tassel */}
          <ellipse cx="200" cy="80" rx="9" ry="6" fill="#CA8A04" />
          <path
            d="M200 80 Q258 85 272 120 L272 170"
            fill="none"
            stroke="#CA8A04"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Tassel Fringe */}
          <polygon points="266,165 278,165 282,192 262,192" fill="#FACC15" />
          <ellipse cx="272" cy="165" rx="6" ry="3" fill="#CA8A04" />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight text-base">
            USMS
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
            School Manager
          </span>
        </div>
      )}
    </div>
  );
};
