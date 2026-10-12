import React from 'react';
import { getAppSettings } from '../data/storage';

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({ className = 'w-12 h-12', size = 48 }) => {
  const settings = getAppSettings();
  const customLogo = settings.logoDataUrl;

  if (customLogo) {
    return (
      <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
        <img
          src={customLogo}
          alt="Logo Sekolah"
          style={{ width: size, height: size }}
          className="object-contain rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Octagram Star / Badge Background Frame (Dark Teal) */}
        <path
          d="M100 10 L125 45 L165 40 L150 78 L185 105 L150 132 L165 170 L125 165 L100 200 L75 165 L35 170 L50 132 L15 105 L50 78 L35 40 L75 45 Z"
          fill="#0f514e"
          stroke="#0b3b38"
          strokeWidth="3"
        />
        {/* Inner Gold Star Frame */}
        <path
          d="M100 22 L120 52 L155 48 L142 82 L172 105 L142 128 L155 162 L120 158 L100 188 L80 158 L45 162 L58 128 L28 105 L58 82 L45 48 L80 52 Z"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="3"
        />

        {/* Crescent Moon & Rays */}
        <path
          d="M100 45 C112 45 122 55 122 67 C122 79 112 89 100 89 C88 89 78 79 78 67 C78 55 88 45 100 45 Z"
          fill="#fbbf24"
          opacity="0.95"
        />
        <path
          d="M100 50 C109 50 116 57 116 66 C116 75 109 82 100 82 C91 82 84 75 84 66 C84 57 91 50 100 50 Z"
          fill="#0f514e"
        />
        <circle cx="70" cy="55" r="3" fill="#fbbf24" />
        <circle cx="130" cy="55" r="3" fill="#fbbf24" />
        <circle cx="100" cy="38" r="3.5" fill="#fbbf24" />

        {/* Open Book Icon */}
        <path
          d="M50 105 C70 98 95 105 100 115 C105 105 130 98 150 105 L150 135 C130 128 105 135 100 145 C95 135 70 128 50 135 Z"
          fill="#134e4a"
          stroke="#fbbf24"
          strokeWidth="2"
        />
        {/* Book pages center spine */}
        <line x1="100" y1="115" x2="100" y2="145" stroke="#fbbf24" strokeWidth="2.5" />

        {/* Text Banner / Typography */}
        <text
          x="100"
          y="158"
          fill="#ffffff"
          fontSize="9"
          fontWeight="700"
          fontFamily="sans-serif"
          textAnchor="middle"
          letterSpacing="1"
        >
          SMP ISLAM MODERN
        </text>
        <text
          x="100"
          y="178"
          fill="#ffffff"
          fontSize="18"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          AL FAKHIR
        </text>
        {/* Star over I */}
        <polygon points="135,164 137,169 142,169 138,172 139,177 135,174 131,177 132,172 128,169 133,169" fill="#fbbf24" transform="scale(0.5) translate(145, 30)" />
      </svg>
    </div>
  );
};
