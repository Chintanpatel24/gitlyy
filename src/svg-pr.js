/**
 * SVG generation for Pull Request Stats card.
 * Uses theme colors dynamically. Dark polished design.
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
  const maxShow = Math.min(repos.length, 12);
  const rowHeight = 30;
  const pad = 24;
  const headerHeight = 54;
  const cardHeight = headerHeight + maxShow * rowHeight + 16;

  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#${colors.border_color}" stroke-width="1"`;

  const displayTitle = title || `${username}'s Pull Requests`;

  let repoRows = "";
  repos.slice(0, maxShow).forEach(([repo, count], index) => {
    const y = headerHeight + index * rowHeight;
    const shortName = repo.length > 40 ? repo.substring(0, 37) + "..." : repo;
    const barPct = Math.min((count / repos[0][1]) * 100, 100);

    repoRows += `
    <g transform="translate(0, ${y})">
      ${index % 2 === 0 ? `<rect x="0" y="0" width="${cardWidth}" height="${rowHeight}" fill="#${colors.text_color}" opacity="0.02"/>` : ""}
      <!-- Repo name -->
      <text x="${pad}" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12.5" fill="#${colors.text_color}">${escapeXml(shortName)}</text>
      <!-- Progress bar -->
      <rect x="${cardWidth - pad - 100}" y="10" width="60" height="10" rx="5" fill="#${colors.border_color}" opacity="0.3"/>
      <rect x="${cardWidth - pad - 100}" y="10" width="${barPct * 0.6}" height="10" rx="5" fill="#${colors.accent_color}" opacity="0.6"/>
      <!-- Count -->
      <text x="${cardWidth - pad - 24}" y="19" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="600" fill="#${colors.accent_color}">${count}</text>
    </g>`;
  });

  if (repos.length > maxShow) {
    repoRows += `
    <text x="${cardWidth / 2}" y="${headerHeight + maxShow * rowHeight + 8}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10" fill="#${colors.text_color}" opacity="0.5">+${repos.length - maxShow} more</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .count { font: 700 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#${colors.bg_color}" ${hideBorderAttr}/>
  <!-- Top accent line -->
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#${colors.accent_color}" rx="8"/>
  <!-- Header -->
  <g transform="translate(${pad}, 0)">
    <!-- PR branch icon -->
    <circle cx="10" cy="28" r="4" fill="none" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <line x1="14" y1="28" x2="18" y2="28" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <circle cx="18" cy="24" r="2" fill="#${colors.accent_color}"/>
    <line x1="10" y1="32" x2="10" y2="40" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <circle cx="10" cy="42" r="2" fill="#${colors.accent_color}"/>
    <!-- Title -->
    <text x="28" y="32" class="title" fill="#${colors.title_color}">${escapeXml(displayTitle)}</text>
  </g>
  <!-- Total badge -->
  <rect x="${cardWidth - pad - 64}" y="18" width="64" height="24" rx="12" fill="#${colors.accent_color}" opacity="0.12"/>
  <text x="${cardWidth - pad - 32}" y="34" text-anchor="middle" class="count" fill="#${colors.accent_color}">${totalPRs} PRs</text>
  <!-- Separator -->
  <line x1="${pad}" y1="${headerHeight}" x2="${cardWidth - pad}" y2="${headerHeight}" stroke="#${colors.border_color}" stroke-width="0.5" opacity="0.5"/>
  <!-- Rows -->
  ${repoRows}
</svg>`;
}

/**
 * Compact PR summary card. Uses theme colors.
 */
function generatePRSummarySVG(options) {
  const { username, totalPRs, repoCount, colors, hideBorder, cardWidth = 400, cardHeight = 170 } = options;
  const pad = 24;

  const hideBorderAttr = hideBorder
    ? `rx="8"`
    : `rx="8" stroke="#${colors.border_color}" stroke-width="1"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <style>
    .title { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .big-num { font: 700 34px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .label { font: 400 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
  <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" fill="#${colors.bg_color}" ${hideBorderAttr}/>
  <!-- Top accent -->
  <rect x="0" y="0" width="${cardWidth}" height="3" fill="#${colors.accent_color}" rx="8"/>
  <!-- Header -->
  <g transform="translate(${pad}, 8)">
    <circle cx="10" cy="20" r="4" fill="none" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <line x1="14" y1="20" x2="18" y2="20" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <circle cx="18" cy="16" r="2" fill="#${colors.accent_color}"/>
    <line x1="10" y1="24" x2="10" y2="32" stroke="#${colors.accent_color}" stroke-width="1.5"/>
    <circle cx="10" cy="34" r="2" fill="#${colors.accent_color}"/>
    <text x="28" y="26" class="title" fill="#${colors.title_color}">${escapeXml(username)}'s Pull Requests</text>
  </g>
  <line x1="${pad}" y1="48" x2="${cardWidth - pad}" y2="48" stroke="#${colors.border_color}" stroke-width="0.5"/>

  <!-- PRs stat -->
  <g transform="translate(${pad}, 58)">
    <rect x="0" y="0" width="${(cardWidth - pad * 2 - 12) / 2}" height="80" rx="8" fill="#${colors.accent_color}" opacity="0.06"/>
    <text x="${(cardWidth - pad * 2 - 12) / 4}" y="42" text-anchor="middle" class="big-num" fill="#${colors.accent_color}">${totalPRs}</text>
    <text x="${(cardWidth - pad * 2 - 12) / 4}" y="60" text-anchor="middle" class="label" fill="#${colors.text_color}">Pull Requests</text>
  </g>

  <!-- Repos stat -->
  <g transform="translate(${pad + (cardWidth - pad * 2 - 12) / 2 + 12}, 58)">
    <rect x="0" y="0" width="${(cardWidth - pad * 2 - 12) / 2}" height="80" rx="8" fill="#${colors.text_color}" opacity="0.04"/>
    <text x="${(cardWidth - pad * 2 - 12) / 4}" y="42" text-anchor="middle" class="big-num" fill="#${colors.text_color}">${repoCount}</text>
    <text x="${(cardWidth - pad * 2 - 12) / 4}" y="60" text-anchor="middle" class="label" fill="#${colors.text_color}">Repositories</text>
  </g>
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

module.exports = { generatePRCardSVG, generatePRSummarySVG, escapeXml };
