// GIO 品牌占位图 - 带加载动画效果
// 使用 encodeURIComponent 确保 SVG 正确解析
const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
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
    .container { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
    .letter-g { animation: float 2s ease-in-out 0.5s infinite; fill: #d4a853; }
    .letter-i { animation: float 2s ease-in-out 0.65s infinite; fill: #d4a853; }
    .letter-o { animation: float 2s ease-in-out 0.8s infinite; fill: #d4a853; }
    .text-cn { animation: fadeInUp 0.6s 0.3s ease-out forwards; opacity: 0; fill: #ffffff; }
    .text-en { animation: fadeInUp 0.6s 0.5s ease-out forwards; opacity: 0; fill: #d4a853; }
  </style>
  <rect width="800" height="600" fill="url(#bg)"/>
  <g class="container" text-anchor="middle">
    <text x="400" y="280" font-family="Georgia, serif" font-size="140" font-weight="400" class="letter-g">G</text>
    <text x="520" y="280" font-family="Georgia, serif" font-size="140" font-weight="400" class="letter-i">I</text>
    <text x="620" y="280" font-family="Georgia, serif" font-size="140" font-weight="400" class="letter-o">O</text>
    <text x="400" y="380" font-family="system-ui, sans-serif" font-size="28" letter-spacing="12" class="text-cn">光里光外</text>
    <text x="400" y="430" font-family="system-ui, sans-serif" font-size="16" letter-spacing="8" class="text-en">LIGHTING</text>
  </g>
</svg>`)}`;

export default PLACEHOLDER_IMAGE;