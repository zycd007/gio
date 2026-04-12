import React from 'react';

interface PlaceholderImageProps {
  className?: string;
  animated?: boolean;
}

/**
 * GIO 统一占位图片组件
 * 用于C端和后台的项目封面占位图
 * 风格：深黑背景 + 金色强调色
 */
const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  className = '',
  animated = true,
}) => {
  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)',
        width: '100%',
        height: '100%',
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      {animated && (
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            @keyframes shimmer {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            .gio-text { fill: #d4a853; animation: float 2s ease-in-out infinite; }
            .text-cn { fill: #ffffff; animation: fadeInUp 0.6s 0.3s ease-out forwards; opacity: 0; }
            .text-en { fill: #d4a853; animation: fadeInUp 0.6s 0.5s ease-out forwards; opacity: 0; }
            .decoration { fill: #d4a853; animation: shimmer 3s ease-in-out infinite; opacity: 0.8; }
          `}
        </style>
      )}

      {/* 装饰线条 */}
      <rect
        x="250"
        y="340"
        width="300"
        height="2"
        rx="1"
        fill="#d4a853"
        opacity="0.8"
        className={animated ? 'decoration' : ''}
      />

      {/* GIO 字母 - 整体居中 */}
      <text
        x="400"
        y="280"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="140"
        fontWeight="400"
        letterSpacing="20"
        fill="#d4a853"
        className={animated ? 'gio-text' : ''}
      >
        GIO
      </text>

      {/* 中文品牌名 */}
      <text
        x="400"
        y="380"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="28"
        letterSpacing="12"
        fill="#ffffff"
        className={animated ? 'text-cn' : ''}
        opacity={animated ? undefined : 1}
      >
        光里光外
      </text>

      {/* 英文品牌名 */}
      <text
        x="400"
        y="430"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="16"
        letterSpacing="8"
        fill="#d4a853"
        className={animated ? 'text-en' : ''}
        opacity={animated ? undefined : 1}
      >
        LIGHTING
      </text>
    </svg>
  );
};

export default PlaceholderImage;

// Data URI 导出（用于 img src 属性）
export const PLACEHOLDER_DATA_URI = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a"/>
      <stop offset="100%" style="stop-color:#252525"/>
    </linearGradient>
  </defs>
  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .gio-text { animation: float 2s ease-in-out infinite; fill: #d4a853; }
    .text-cn { animation: fadeInUp 0.6s 0.3s ease-out forwards; opacity: 0; fill: #ffffff; }
    .text-en { animation: fadeInUp 0.6s 0.5s ease-out forwards; opacity: 0; fill: #d4a853; }
    .decoration { animation: shimmer 3s ease-in-out infinite; fill: #d4a853; opacity: 0.8; }
  </style>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="250" y="340" width="300" height="2" rx="1" class="decoration"/>
  <text x="400" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="140" font-weight="400" letter-spacing="20" class="gio-text">GIO</text>
  <text x="400" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" letter-spacing="12" class="text-cn">光里光外</text>
  <text x="400" y="430" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" letter-spacing="8" class="text-en">LIGHTING</text>
</svg>`)}`;