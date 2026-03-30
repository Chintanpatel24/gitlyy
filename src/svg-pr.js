/**
 * SVG generation for Pull Request Stats card.
 * Dark theme by default with classic polished styling.
 */

/**
 * Generate an SVG card showing PR counts per repository.
 */
function generatePRCardSVG(options) {
  const {
    username,
    repoMap,
    totalPRs,
    colors,
    title,
    hideBorder,
    cardWidth = 450,
  } = options;

  const repos = Object.entries(repoMap).sort((a, b) => b[1] - a[1]);
  const maxShow = Math.min(repos.length, 15);
  const rowHeight = 28;
  const pad = 28;
  const headerHeight = 52;
  const cardHeight = headerHeight + maxShow * rowHeight + pad + 12;

  const border = hideBorder
    ? ""
    : `rx="6" stroke="#${colors.border_color}" stroke-width="1"`;

  const displayTitle = title || `${username}'s Pull Requests`;

  let repoRows = "";
  repos.slice(0, maxShow).forEach(([repo, count], index) => {
    const y = headerHeight + index * rowHeight;
    const barMaxWidth = 120;
    const barWidth = Math.min((count / totalPRs) * barMaxWidth * 2, barMaxWidth);
    const shortName = repo.length > 38 ? repo.substring(0, 35) + "..." : repo;

    // Alternating row background
    const rowBg = index % 2 === 0 ? `opacity="0.03" fill="#${colors.text_color}"` : "";

    repoRows += `
    <rect x="0" y="${y}" width="${cardWidth}" height="${rowHeight}" ${rowBg}/>
    <g transform="translate(${pad}, ${y})">
      <!-- PR icon dot -->
      <circle cx="6" cy="14" r="3" fill="#${colors.accent_color}" opacity="0.7"/>
      <!-- Repo name -->
      <text x="16" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="12.5" fill="#${colors.text_color}" dominant-baseline="central">
        ${escapeXml(shortName)}
      </text>
      <!-- PR count badge -->
      <rect x="${cardWidth - pad * 2 - 60}" y="5" width="48" height="18" rx="9" fill="#${colors.accent_color}" opacity="0.15"/>
      <text x="${cardWidth - pad * 2 - 36}" y="14" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="11" font-weight="600" fill="#${colors.accent_color}" dominant-baseline="central">
        ${count}
      </text>
    </g>`;
  });

  // Remaining repos indicator
  if (repos.length > maxShow) {
    const remY = headerHeight + maxShow * rowHeight;
    repoRows += `
    <text x="${cardWidth / 2}" y="${remY + 12}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="11" fill="#${colors.text_color}" opacity="0.5">
      +${repos.length - maxShow} more repositories
    </text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#${colors.bg_color};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#${darken(colors.bg_color, 10)};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .total-badge { font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="url(#bg-grad)" ${border}/>
  <!-- Header bar -->
  <rect x="1" y="1" width="${cardWidth - 2}" height="${headerHeight - 1}" fill="#${colors.accent_color}" opacity="0.04" rx="6"/>
  <!-- PR icon in header -->
  <g transform="translate(${pad}, 16)">
    <path fill="#${colors.accent_color}" d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>
  </g>
  <!-- Title -->
  <text x="${pad + 24}" y="32" class="title" fill="#${colors.title_color}">${escapeXml(displayTitle)}</text>
  <!-- Total count -->
  <rect x="${cardWidth - pad - 55}" y="18" width="55" height="22" rx="11" fill="#${colors.accent_color}" opacity="0.2"/>
  <text x="${cardWidth - pad - 28}" y="32" text-anchor="middle" class="total-badge" fill="#${colors.accent_color}">${totalPRs} PRs</text>
  <!-- Separator -->
  <line x1="${pad}" y1="${headerHeight}" x2="${cardWidth - pad}" y2="${headerHeight}" stroke="#${colors.border_color}" stroke-width="0.5" opacity="0.5"/>
  <!-- Repo rows -->
  ${repoRows}
</svg>`;
}

/**
 * Generate a compact PR summary card.
 */
function generatePRSummarySVG(options) {
  const { username, totalPRs, repoCount, colors, hideBorder, cardWidth = 420, cardHeight = 165 } = options;
  const pad = 28;

  const border = hideBorder
    ? ""
    : `rx="6" stroke="#${colors.border_color}" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#${colors.bg_color};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#${darken(colors.bg_color, 10)};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .stat-num { font: 700 30px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .stat-label { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  </style>
  <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" fill="url(#bg-grad)" ${border}/>
  <!-- Header -->
  <rect x="1" y="1" width="${cardWidth - 2}" height="48" fill="#${colors.accent_color}" opacity="0.04" rx="6"/>
  <g transform="translate(${pad}, 13)">
    <path fill="#${colors.accent_color}" d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>
  </g>
  <text x="${pad + 24}" y="29" class="title" fill="#${colors.title_color}">${escapeXml(username)}'s Pull Requests</text>
  <line x1="${pad}" y1="48" x2="${cardWidth - pad}" y2="48" stroke="#${colors.border_color}" stroke-width="0.5" opacity="0.5"/>

  <!-- Total PRs -->
  <g transform="translate(${pad}, 62)">
    <rect x="0" y="0" width="70" height="70" rx="8" fill="#${colors.accent_color}" opacity="0.08"/>
    <text x="35" y="38" text-anchor="middle" class="stat-num" fill="#${colors.accent_color}">${totalPRs}</text>
    <text x="35" y="56" text-anchor="middle" class="stat-label" fill="#${colors.text_color}">Pull Requests</text>
  </g>

  <!-- Repos count -->
  <g transform="translate(${pad + 90}, 62)">
    <rect x="0" y="0" width="70" height="70" rx="8" fill="#${colors.text_color}" opacity="0.05"/>
    <text x="35" y="38" text-anchor="middle" class="stat-num" fill="#${colors.text_color}">${repoCount}</text>
    <text x="35" y="56" text-anchor="middle" class="stat-label" fill="#${colors.text_color}">Repositories</text>
  </g>

  <text x="${cardWidth / 2}" y="${cardHeight - 8}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="9" fill="#${colors.text_color}" opacity="0.3">via gitly</text>
</svg>`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Darken a hex color by a percentage.
 */
function darken(hex, percent) {
  hex = hex.replace("#", "");
  const num = parseInt(hex, 16);
  let r = (num >> 16) - Math.round((num >> 16) * (percent / 100));
  let g = ((num >> 8) & 0x00ff) - Math.round(((num >> 8) & 0x00ff) * (percent / 100));
  let b = (num & 0x0000ff) - Math.round((num & 0x0000ff) * (percent / 100));
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

module.exports = { generatePRCardSVG, generatePRSummarySVG, escapeXml, darken };
