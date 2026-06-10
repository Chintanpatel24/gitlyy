/**
 * Music Player Card SVG generation
 */

function generateMusicSVG(options) {
  const {
    player = "90s",
    title = "Unknown Title",
    artist = "Unknown Artist",
    track_id = "",
    gif_url = "",
    colors,
    hideBorder,
  } = options;

  const cardWidth = 400;
  const cardHeight = 120;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const bgColor = (colors && colors.bg_color) || "0d1117";
  const titleColor = (colors && colors.title_color) || accentColor;
  const textColor = (colors && colors.text_color) || "8b949e";

  const trackUrl = track_id ? `https://open.spotify.com/track/${track_id}` : "#";

  let playerContent = "";
  let styleTags = `
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #${titleColor}; }
    .artist { font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #${textColor}; }
    .controls { cursor: pointer; }
    @keyframes bar {
      0% { height: 2px; }
      50% { height: 15px; }
      100% { height: 2px; }
    }
    .bar { fill: #${accentColor}; animation: bar 1.2s infinite ease-in-out; }
    .bar1 { animation-delay: 0s; }
    .bar2 { animation-delay: 0.2s; }
    .bar3 { animation-delay: 0.4s; }
    .bar4 { animation-delay: 0.6s; }
    .bar5 { animation-delay: 0.8s; }
  `;

  if (player === "ipod") {
    playerContent = `
      <rect width="${cardWidth}" height="${cardHeight}" fill="#e0e0e0" ${hba}/>
      <rect x="20" y="15" width="120" height="90" fill="#333" rx="4"/>
      ${gif_url ? `<image href="${gif_url}" x="25" y="20" width="110" height="80" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 4px)"/>` : `
        <g transform="translate(45, 100)">
          <rect class="bar bar1" x="0" y="0" width="10" height="20" transform="scale(1,-1)"/>
          <rect class="bar bar2" x="15" y="0" width="10" height="30" transform="scale(1,-1)"/>
          <rect class="bar bar3" x="30" y="0" width="10" height="25" transform="scale(1,-1)"/>
          <rect class="bar bar4" x="45" y="0" width="10" height="35" transform="scale(1,-1)"/>
        </g>
      `}
      <g transform="translate(160, 35)">
        <text class="title" y="0">${escapeXml(title)}</text>
        <text class="artist" y="20">${escapeXml(artist)}</text>
      </g>
      <circle cx="280" cy="70" r="35" fill="#fff" stroke="#ccc" stroke-width="1"/>
      <circle cx="280" cy="70" r="12" fill="#eee" stroke="#ccc" stroke-width="1"/>
      <a href="${trackUrl}" target="_blank">
        <path d="M275 65 L288 70 L275 75 Z" fill="#555"/>
      </a>
    `;
  } else if (player === "cassette") {
    styleTags += `
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .reel { transform-origin: center; animation: spin 3s linear infinite; }
    `;
    playerContent = `
      <rect width="${cardWidth}" height="${cardHeight}" fill="#333" ${hba}/>
      <rect x="20" y="20" width="360" height="80" fill="#555" rx="10"/>
      <rect x="100" y="35" width="200" height="50" fill="#111" rx="5"/>
      <g transform="translate(135, 60)">
        <circle class="reel" r="15" fill="none" stroke="#777" stroke-width="2" stroke-dasharray="5,3"/>
      </g>
      <g transform="translate(265, 60)">
        <circle class="reel" r="15" fill="none" stroke="#777" stroke-width="2" stroke-dasharray="5,3"/>
      </g>
      <g transform="translate(200, 55)" text-anchor="middle">
         <text class="title" y="-5" font-size="10" fill="#eee">${escapeXml(title)}</text>
         <text class="artist" y="12" font-size="8" fill="#aaa">${escapeXml(artist)}</text>
      </g>
      ${gif_url ? `<image href="${gif_url}" x="150" y="40" width="100" height="40" opacity="0.6"/>` : ""}
      <a href="${trackUrl}" target="_blank">
        <rect x="20" y="20" width="360" height="80" fill="transparent"/>
      </a>
    `;
  } else if (player === "boombox") {
     playerContent = `
      <rect width="${cardWidth}" height="${cardHeight}" fill="#444" ${hba}/>
      <circle cx="60" cy="60" r="35" fill="#222" stroke="#666" stroke-width="3"/>
      <circle cx="60" cy="60" r="25" fill="#111" stroke="#333" stroke-width="1"/>
      <circle cx="340" cy="60" r="35" fill="#222" stroke="#666" stroke-width="3"/>
      <circle cx="340" cy="60" r="25" fill="#111" stroke="#333" stroke-width="1"/>
      <rect x="110" y="30" width="180" height="60" fill="#222" rx="4"/>
      <g transform="translate(120, 50)">
        <text class="title" y="0" font-size="12" fill="#0f0">${escapeXml(title)}</text>
        <text class="artist" y="20" font-size="10" fill="#0f0" opacity="0.8">${escapeXml(artist)}</text>
      </g>
      <g transform="translate(250, 75)">
        <rect class="bar bar1" x="0" y="0" width="4" height="15" transform="scale(1,-1)"/>
        <rect class="bar bar2" x="6" y="0" width="4" height="15" transform="scale(1,-1)"/>
        <rect class="bar bar3" x="12" y="0" width="4" height="15" transform="scale(1,-1)"/>
      </g>
      <a href="${trackUrl}" target="_blank">
         <rect x="110" y="30" width="180" height="60" fill="transparent"/>
      </a>
    `;
  } else {
    // Default 90s Winamp style
    playerContent = `
      <rect width="${cardWidth}" height="${cardHeight}" fill="#2c2c2c" ${hba}/>
      <rect x="0" y="0" width="${cardWidth}" height="20" fill="#1a1a1a"/>
      <text x="10" y="14" font-family="monospace" font-size="10" fill="#ccc">WINAMP 2.91</text>

      <rect x="10" y="30" width="70" height="50" fill="#000"/>
      ${gif_url ? `<image href="${gif_url}" x="10" y="30" width="70" height="50" preserveAspectRatio="xMidYMid slice"/>` : `
        <g transform="translate(15, 75)">
          <rect class="bar bar1" x="0" y="0" width="8" height="30" transform="scale(1,-1)"/>
          <rect class="bar bar2" x="10" y="0" width="8" height="40" transform="scale(1,-1)"/>
          <rect class="bar bar3" x="20" y="0" width="8" height="35" transform="scale(1,-1)"/>
          <rect class="bar bar4" x="30" y="0" width="8" height="45" transform="scale(1,-1)"/>
          <rect class="bar bar5" x="40" y="0" width="8" height="30" transform="scale(1,-1)"/>
        </g>
      `}

      <g transform="translate(90, 45)">
        <text class="title" y="0" font-family="monospace">${escapeXml(title)}</text>
        <text class="artist" y="20" font-family="monospace">${escapeXml(artist)}</text>
      </g>

      <g transform="translate(10, 95)" class="controls">
        <a href="${trackUrl}" target="_blank">
          <rect x="0" y="0" width="30" height="15" fill="#444" rx="2"/>
          <path d="M10 4 L20 7.5 L10 11 Z" fill="#eee"/>
        </a>
        <a href="${trackUrl}" target="_blank">
          <rect x="35" y="0" width="30" height="15" fill="#444" rx="2"/>
          <rect x="42" y="4" width="3" height="7" fill="#eee"/>
          <rect x="48" y="4" width="3" height="7" fill="#eee"/>
        </a>
        <a href="${trackUrl}" target="_blank">
          <rect x="70" y="0" width="30" height="15" fill="#444" rx="2"/>
          <rect x="78" y="4" width="14" height="7" fill="#eee"/>
        </a>
      </g>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
      <style>${styleTags}</style>
      ${playerContent}
    </svg>
  `;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = { generateMusicSVG };
