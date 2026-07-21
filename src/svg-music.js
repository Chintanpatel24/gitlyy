/**
 * Music Player Card SVG generation
 */

const DEFAULT_SONGS = [
  {
    title: "Lofi Hip Hop",
    artist: "Lofi Girl",
    track_id: "4cOdK2wG6S999UI9797", // Example ID
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
  },
  {
    title: "Midnight City",
    artist: "M83",
    track_id: "16X79m77pD8pY0pX8pY8",
    url: "https://open.spotify.com/track/16X79m77pD8pY0pX8pY8"
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    track_id: "0VjIj9S91pI9pX8pY8pY",
    url: "https://open.spotify.com/track/0VjIj9S91pI9pX8pY8pY"
  }
];

function generateMusicSVG(options) {
  const {
    player = "90s",
    colors,
    hideBorder,
  } = options;

  let { title, artist, track_id, gif_url } = options;

  // Use default song if none provided
  if (!title && !artist && !track_id) {
    const defaultSong = DEFAULT_SONGS[0];
    title = defaultSong.title;
    artist = defaultSong.artist;
    track_id = defaultSong.track_id;
  }

  const cardWidth = 400;
  const cardHeight = 120;
  const hba = hideBorder ? `rx="8"` : `rx="8" stroke="#30363d" stroke-width="1"`;
  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || accentColor;
  const textColor = (colors && colors.text_color) || "8b949e";

  const trackUrl = track_id ? `https://open.spotify.com/track/${track_id}` : "#";

  let playerContent = "";
  let styleTags = `
    /* General Styles */
    .glow { filter: drop-shadow(0 0 3px #${accentColor}); }

    /* Winamp (90s) Styles */
    .winamp-title { font: 700 14px monospace; fill: #00ff00; }
    .winamp-artist { font: 400 12px monospace; fill: #00ff00; opacity: 0.8; }
    @keyframes winamp-scale {
      0%, 100% { transform: scale(1, -0.15); }
      50% { transform: scale(1, -1.0); }
    }
    .winamp-bar { fill: #00ff00; transform-origin: 0 0; }
    .wbar1 { animation: winamp-scale 0.8s infinite ease-in-out; animation-delay: 0.1s; }
    .wbar2 { animation: winamp-scale 1.1s infinite ease-in-out; animation-delay: 0.4s; }
    .wbar3 { animation: winamp-scale 0.9s infinite ease-in-out; animation-delay: 0.2s; }
    .wbar4 { animation: winamp-scale 1.3s infinite ease-in-out; animation-delay: 0.6s; }
    .wbar5 { animation: winamp-scale 1.0s infinite ease-in-out; animation-delay: 0.3s; }

    /* iPod Styles */
    .ipod-title { font: 700 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #111111; }
    .ipod-artist { font: 400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; fill: #555555; }
    @keyframes ipod-scale {
      0%, 100% { transform: scale(1, -0.2); }
      50% { transform: scale(1, -1.0); }
    }
    .ipod-bar { fill: #${accentColor}; transform-origin: 0 0; }
    .ibar1 { animation: ipod-scale 0.9s infinite ease-in-out; animation-delay: 0.1s; }
    .ibar2 { animation: ipod-scale 1.2s infinite ease-in-out; animation-delay: 0.4s; }
    .ibar3 { animation: ipod-scale 0.8s infinite ease-in-out; animation-delay: 0.2s; }
    .ibar4 { animation: ipod-scale 1.1s infinite ease-in-out; animation-delay: 0.5s; }

    /* Cassette Styles */
    .cassette-title { font: 700 12px monospace; fill: #ffffff; }
    .cassette-artist { font: 400 10px monospace; fill: #d4af37; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .reel { transform-origin: center; animation: spin 4s linear infinite; }

    /* Boombox Styles */
    .boombox-title { font: 700 13px monospace; fill: #00ff00; filter: drop-shadow(0 0 2px #00ff00); }
    .boombox-artist { font: 400 11px monospace; fill: #00ff00; opacity: 0.7; }
    @keyframes boombox-scale {
      0%, 100% { transform: scale(1, -0.15); }
      50% { transform: scale(1, -1.0); }
    }
    .boombox-bar { fill: #00ff00; transform-origin: 0 0; }
    .bbar1 { animation: boombox-scale 0.7s infinite ease-in-out; animation-delay: 0s; }
    .bbar2 { animation: boombox-scale 1.0s infinite ease-in-out; animation-delay: 0.3s; }
    .bbar3 { animation: boombox-scale 0.8s infinite ease-in-out; animation-delay: 0.15s; }
  `;

  if (player === "ipod") {
    playerContent = `
      <defs>
        <linearGradient id="ipodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#c0c0c0;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${cardWidth}" height="${cardHeight}" fill="url(#ipodGrad)" ${hba}/>
      <rect x="20" y="15" width="130" height="90" fill="#222" rx="6" stroke="#444" stroke-width="2"/>
      ${gif_url ? `<image href="${gif_url}" x="25" y="20" width="120" height="80" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 4px)"/>` : `
        <g transform="translate(45, 95)">
          <rect class="ipod-bar ibar1" x="0" y="0" width="12" height="20" rx="1"/>
          <rect class="ipod-bar ibar2" x="18" y="0" width="12" height="30" rx="1"/>
          <rect class="ipod-bar ibar3" x="36" y="0" width="12" height="25" rx="1"/>
          <rect class="ipod-bar ibar4" x="54" y="0" width="12" height="35" rx="1"/>
        </g>
      `}
      <g transform="translate(170, 40)">
        <text class="ipod-title" y="0">${escapeXml(title)}</text>
        <text class="ipod-artist" y="22" opacity="0.8">${escapeXml(artist)}</text>
      </g>
      <g transform="translate(290, 65)">
        <circle r="40" fill="#fff" stroke="#bbb" stroke-width="1.5"/>
        <circle r="15" fill="#eee" stroke="#ccc" stroke-width="1"/>
        <text y="-25" font-size="8" fill="#888" text-anchor="middle" font-weight="bold">MENU</text>
        <a href="${trackUrl}" target="_blank">
          <path d="M-5 -5 L8 0 L-5 5 Z" fill="#555" transform="translate(0,0)"/>
          <circle r="40" fill="transparent"/>
        </a>
      </g>
    `;
  } else if (player === "cassette") {
    playerContent = `
      <defs>
        <linearGradient id="cassetteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#333;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${cardWidth}" height="${cardHeight}" fill="url(#cassetteGrad)" ${hba}/>
      <rect x="25" y="20" width="350" height="80" fill="#d4af37" rx="8" opacity="0.9"/>
      <rect x="35" y="30" width="330" height="60" fill="#222" rx="5"/>
      <rect x="110" y="40" width="180" height="40" fill="#111" rx="4" stroke="#444"/>

      <g transform="translate(145, 60)">
        <circle class="reel" r="12" fill="none" stroke="#666" stroke-width="3" stroke-dasharray="4,4"/>
        <circle r="4" fill="#666"/>
      </g>
      <g transform="translate(255, 60)">
        <circle class="reel" r="12" fill="none" stroke="#666" stroke-width="3" stroke-dasharray="4,4"/>
        <circle r="4" fill="#666"/>
      </g>

      <g transform="translate(200, 35)" text-anchor="middle">
         <text class="cassette-title" y="0">${escapeXml(title)}</text>
      </g>
      <g transform="translate(200, 95)" text-anchor="middle">
         <text class="cassette-artist" y="0">${escapeXml(artist)}</text>
      </g>

      ${gif_url ? `<image href="${gif_url}" x="150" y="45" width="100" height="30" opacity="0.4"/>` : ""}
      <a href="${trackUrl}" target="_blank">
        <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="transparent"/>
      </a>
    `;
  } else if (player === "boombox") {
     playerContent = `
      <defs>
        <radialGradient id="speakerGrad">
          <stop offset="70%" stop-color="#111"/>
          <stop offset="100%" stop-color="#333"/>
        </radialGradient>
      </defs>
      <rect width="${cardWidth}" height="${cardHeight}" fill="#2a2a2a" ${hba}/>
      <rect x="10" y="10" width="380" height="100" fill="#333" rx="10" stroke="#111" stroke-width="2"/>

      <!-- Speakers -->
      <circle cx="65" cy="60" r="40" fill="url(#speakerGrad)" stroke="#222" stroke-width="2"/>
      <circle cx="65" cy="60" r="30" fill="none" stroke="#444" stroke-width="1" stroke-dasharray="2,2"/>

      <circle cx="335" cy="60" r="40" fill="url(#speakerGrad)" stroke="#222" stroke-width="2"/>
      <circle cx="335" cy="60" r="30" fill="none" stroke="#444" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Display -->
      <rect x="120" y="30" width="160" height="60" fill="#000" rx="4" stroke="#0f0" stroke-width="1" stroke-opacity="0.3"/>
      <g transform="translate(130, 52)">
        <text class="boombox-title" y="0">${escapeXml(title)}</text>
        <text class="boombox-artist" y="22">${escapeXml(artist)}</text>
      </g>

      <!-- Viz in display -->
      <g transform="translate(240, 80)">
        <rect class="boombox-bar bbar1" x="0" y="0" width="5" height="20"/>
        <rect class="boombox-bar bbar2" x="7" y="0" width="5" height="25"/>
        <rect class="boombox-bar bbar3" x="14" y="0" width="5" height="18"/>
      </g>

      <a href="${trackUrl}" target="_blank">
         <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="transparent"/>
      </a>
    `;
  } else {
    // Default 90s Winamp style
    playerContent = `
      <defs>
        <linearGradient id="winampGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#3a3a3a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${cardWidth}" height="${cardHeight}" fill="url(#winampGrad)" ${hba}/>

      <!-- Title Bar -->
      <rect x="2" y="2" width="${cardWidth - 4}" height="18" fill="#000080" rx="2"/>
      <text x="10" y="15" font-family="monospace" font-size="11" font-weight="bold" fill="#fff">WINAMP 2.91 - ${escapeXml(title)}</text>

      <!-- Visualization Area -->
      <rect x="10" y="25" width="80" height="55" fill="#000" stroke="#444"/>
      ${gif_url ? `<image href="${gif_url}" x="11" y="26" width="78" height="53" preserveAspectRatio="xMidYMid slice"/>` : `
        <g transform="translate(15, 75)">
          <rect class="winamp-bar wbar1" x="0" y="0" width="10" height="30" rx="1"/>
          <rect class="winamp-bar wbar2" x="12" y="0" width="10" height="45" rx="1"/>
          <rect class="winamp-bar wbar3" x="24" y="0" width="10" height="35" rx="1"/>
          <rect class="winamp-bar wbar4" x="36" y="0" width="10" height="50" rx="1"/>
          <rect class="winamp-bar wbar5" x="48" y="0" width="10" height="40" rx="1"/>
        </g>
      `}

      <!-- Song Info -->
      <g transform="translate(100, 48)">
        <text class="winamp-title" y="0">${escapeXml(title)}</text>
        <text class="winamp-artist" y="25">${escapeXml(artist)}</text>
      </g>

      <!-- Controls -->
      <g transform="translate(10, 90)">
        <a href="${trackUrl}" target="_blank">
          <g transform="translate(0,0)">
            <rect width="35" height="20" fill="#444" rx="2" stroke="#666"/>
            <path d="M12 5 L25 10 L12 15 Z" fill="#ccc"/>
          </g>
        </a>
        <a href="${trackUrl}" target="_blank">
          <g transform="translate(40,0)">
            <rect width="35" height="20" fill="#444" rx="2" stroke="#666"/>
            <rect x="11" y="5" width="4" height="10" fill="#ccc"/>
            <rect x="20" y="5" width="4" height="10" fill="#ccc"/>
          </g>
        </a>
        <a href="${trackUrl}" target="_blank">
          <g transform="translate(80,0)">
            <rect width="35" height="20" fill="#444" rx="2" stroke="#666"/>
            <rect x="10" y="5" width="15" height="10" fill="#ccc"/>
          </g>
        </a>
        <a href="${trackUrl}" target="_blank">
          <g transform="translate(120,0)">
            <rect width="70" height="20" fill="#222" rx="10" stroke="#444"/>
            <circle cx="15" cy="10" r="6" fill="#${accentColor}"/>
            <text x="30" y="14" font-size="9" fill="#888" font-family="monospace">VOLUME</text>
          </g>
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
