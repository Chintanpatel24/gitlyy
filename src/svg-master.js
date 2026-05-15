/**
 * Master Card SVG generation - Complete Profile Dashboard (820px).
 * A unique, high-impact card for GitHub README.
 */

function getContributionColorByLevel(level) {
  const levelColors = ["161b22", "0e4429", "006d32", "26a641", "39d353"];
  return levelColors[Math.max(0, Math.min(4, Number(level) || 0))];
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateMasterCardSVG(options) {
  const {
    username, totalPRs = 0, openPRs = 0, mergedPRs = 0, repoCount = 0,
    languages = [], contributions = 0, totalCommits = 0, repoList = [],
    contributionDays = [], currentStreak = 0, longestStreak = 0,
    totalIssues = 0, openIssues = 0, closedIssues = 0, totalStars = 0,
    linesChanged = 0, colors, hideBorder, cardWidth = 820
  } = options;

  const pad = 28;
  const innerW = cardWidth - pad * 2;
  const hba = hideBorder ? `rx="14"` : `rx="14" stroke="#30363d" stroke-width="1.5"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  let y = 0;
  let content = "";

  // --- HEADER SECTION ---
  content += `
  <g transform="translate(${pad}, 36)">
    <text x="0" y="26" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="30" font-weight="900" fill="#${titleColor}">${escapeXml(username)}'s Profile</text>
    <rect x="0" y="42" width="70" height="4" fill="#${accentColor}" rx="2"/>
    <text x="${innerW}" y="26" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:1.5px">Master Dashboard</text>
  </g>`;
  y = 110;

  // --- HERO METRICS (5 Key stats) ---
  const statW = Math.floor(innerW / 5);
  const heroStats = [
    { label: "Commits", value: totalCommits.toLocaleString(), color: accentColor },
    { label: "Stars", value: totalStars.toLocaleString(), color: "eab308" },
    { label: "Contributions", value: contributions.toLocaleString(), color: "39d353" },
    { label: "Total PRs", value: totalPRs, color: "8b5cf6" },
    { label: "Total Issues", value: totalIssues, color: "f85149" },
  ];

  heroStats.forEach((s, i) => {
    content += `
    <g transform="translate(${pad + i * statW}, ${y})">
      <text x="${statW / 2}" y="22" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="800" fill="#${s.color}">${s.value}</text>
      <text x="${statW / 2}" y="42" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:1px">${s.label}</text>
    </g>`;
  });
  y += 85;

  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 35;

  // --- INSIGHTS GRID (Middle row) ---
  const leftColW = Math.floor(innerW * 0.55);
  const rightColW = innerW - leftColW - 30;

  // Languages (Left)
  content += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#${titleColor}">Top Languages</text>
    <g transform="translate(0, 22)">`;

  const { getLanguageColor } = require("./languages");
  const topLangs = languages.slice(0, 6);
  topLangs.forEach((lang, i) => {
    const ly = i * 28;
    const barMax = leftColW - 130;
    const barW = (lang.percentage / 100) * barMax;
    content += `
    <g transform="translate(0, ${ly})">
      <circle cx="6" cy="10" r="5" fill="#${getLanguageColor(lang.name)}"/>
      <text x="18" y="14" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" fill="#${textColor}">${escapeXml(lang.name)}</text>
      <rect x="100" y="6" width="${barMax}" height="8" rx="4" fill="#30363d" opacity="0.4"/>
      <rect x="100" y="6" width="${barW}" height="8" rx="4" fill="#${getLanguageColor(lang.name)}"/>
      <text x="${leftColW - 10}" y="14" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">${lang.percentage.toFixed(1)}%</text>
    </g>`;
  });
  content += `</g></g>`;

  // Streaks & Activity (Right)
  content += `<g transform="translate(${pad + leftColW + 30}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#${titleColor}">Performance</text>
    <g transform="translate(0, 22)">
      <rect width="${rightColW}" height="54" rx="10" fill="#39d353" opacity="0.08"/>
      <text x="14" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" style="text-transform:uppercase">Current Streak</text>
      <text x="14" y="42" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#39d353">${currentStreak} Days</text>

      <g transform="translate(0, 68)">
        <rect width="${rightColW}" height="54" rx="10" fill="#f97316" opacity="0.08"/>
        <text x="14" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" style="text-transform:uppercase">Longest Streak</text>
        <text x="14" y="42" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#f97316">${longestStreak} Days</text>
      </g>

      <g transform="translate(0, 136)">
        <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#${textColor}">Lines Changed <tspan fill="#8b949e" font-weight="400" font-size="11">(recent)</tspan></text>
        <text x="0" y="24" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="800" fill="#fb923c">${linesChanged.toLocaleString()}</text>
      </g>
    </g>
  </g>`;

  y += 205;
  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 35;

  // --- REPOSITORIES & STATUS (Middle-Bottom row) ---
  const breakW = (innerW - 30) / 2;
  content += `<g transform="translate(${pad}, ${y})">
    <g>
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" font-weight="700" fill="#${titleColor}">Projects Activity</text>
      <g transform="translate(0, 12)">`;
  repoList.slice(0, 3).forEach((repo, i) => {
    content += `<text x="0" y="${i * 20 + 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">&bull; ${escapeXml(repo.name.length > 25 ? repo.name.substring(0, 22) + '...' : repo.name)} <tspan fill="#${accentColor}" font-weight="700">(${repo.count} PRs)</tspan></text>`;
  });
  content += `</g></g>
    <g transform="translate(${breakW + 30}, 0)">
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" font-weight="700" fill="#${titleColor}">Detailed Status</text>
      <g transform="translate(0, 12)">
        <text x="0" y="10" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">Merged PRs: <tspan fill="#8b5cf6" font-weight="700">${mergedPRs}</tspan></text>
        <text x="0" y="32" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">Open PRs: <tspan fill="#3fb950" font-weight="700">${openPRs}</tspan></text>
        <text x="0" y="54" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">Closed Issues: <tspan fill="#f85149" font-weight="700">${closedIssues}</tspan></text>
      </g>
    </g>
  </g>`;
  y += 90;

  content += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 35;

  // --- CONTRIBUTION HEATMAP (Bottom) ---
  content += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#${titleColor}">Contribution Activity (Last Year)</text>
    <g transform="translate(0, 15)">`;

  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const recent = sortedDays.slice(-371);
  const cell = 11, gap = 3.2, step = cell + gap;

  recent.forEach((d, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    content += `<rect x="${col * step}" y="${row * step}" width="${cell}" height="${cell}" rx="2.5" fill="#${getContributionColorByLevel(d.level)}"/>`;
  });
  content += `</g></g>`;
  y += 130;

  const cardHeight = y + 30;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <path d="M0 14 Q0 0 14 0 L${cardWidth - 14} 0 Q${cardWidth} 0 ${cardWidth} 14 L${cardWidth} 85 L0 85 Z" fill="url(#headerGrad)" opacity="0.6"/>
  <rect width="${cardWidth}" height="4" fill="#${accentColor}" rx="14"/>
  ${content}
  <text x="${cardWidth - pad}" y="${cardHeight - 15}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" opacity="0.4">gitlyy full dashboard</text>
</svg>`;
}

module.exports = { generateMasterCardSVG, escapeXml };
