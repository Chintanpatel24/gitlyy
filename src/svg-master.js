/**
 * Master Card SVG generation - Full Premium Dashboard (820px).
 * Designed for GitHub Profile README to show a comprehensive, unique look.
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
    username,
    totalPRs = 0,
    openPRs = 0,
    mergedPRs = 0,
    repoCount = 0,
    languages = [],
    contributions = 0,
    totalCommits = 0,
    repoList = [],
    contributionDays = [],
    currentStreak = 0,
    longestStreak = 0,
    totalIssues = 0,
    openIssues = 0,
    closedIssues = 0,
    totalStars = 0,
    linesChanged = 0,
    colors,
    hideBorder,
    cardWidth = 820,
  } = options;

  const pad = 26;
  const innerW = cardWidth - pad * 2;
  const hba = hideBorder ? `rx="12"` : `rx="12" stroke="#30363d" stroke-width="1.2"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  let y = 0;
  let sections = "";

  // --- PREMIUM HEADER ---
  sections += `
  <g transform="translate(${pad}, 32)">
    <text x="0" y="24" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="28" font-weight="800" fill="#${titleColor}">${escapeXml(username)}'s Profile Dashboard</text>
    <rect x="0" y="38" width="60" height="4" fill="#${accentColor}" rx="2"/>
    <text x="${innerW}" y="24" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:1px">GitHub Portfolio Insights</text>
  </g>`;
  y = 100;

  // --- HERO STATS ROW (5 stats) ---
  const statW = Math.floor(innerW / 5);
  const heroStats = [
    { label: "Commits", value: totalCommits.toLocaleString(), color: accentColor },
    { label: "Contributions", value: contributions.toLocaleString(), color: "39d353" },
    { label: "Total PRs", value: totalPRs, color: "8b5cf6" },
    { label: "Total Stars", value: totalStars.toLocaleString(), color: "eab308" },
    { label: "Lines Changed", value: linesChanged.toLocaleString(), color: "fb923c" },
  ];

  heroStats.forEach((s, i) => {
    sections += `
    <g transform="translate(${pad + i * statW}, ${y})">
      <text x="${statW / 2}" y="20" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="800" fill="#${s.color}">${s.value}</text>
      <text x="${statW / 2}" y="38" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:0.8px">${s.label}</text>
    </g>`;
  });
  y += 70;

  sections += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 32;

  // --- MIDDLE GRID: Languages & Repos side-by-side ---
  const gridW = (innerW - 32) / 2;
  const gridY = y;

  // Left Column: Top Languages
  sections += `<g transform="translate(${pad}, ${gridY})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${titleColor}">Top Languages</text>
    <g transform="translate(0, 20)">`;

  const { getLanguageColor } = require("./languages");
  const topLangs = languages.slice(0, 6);
  topLangs.forEach((lang, i) => {
    const ly = i * 26;
    const barMaxWidth = gridW - 120;
    const barW = (lang.percentage / 100) * barMaxWidth;
    sections += `
    <g transform="translate(0, ${ly})">
      <circle cx="5" cy="8" r="4" fill="#${getLanguageColor(lang.name)}"/>
      <text x="16" y="12" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" fill="#${textColor}">${escapeXml(lang.name)}</text>
      <rect x="90" y="5" width="${barMaxWidth}" height="7" rx="3.5" fill="#30363d" opacity="0.4"/>
      <rect x="90" y="5" width="${barW}" height="7" rx="3.5" fill="#${getLanguageColor(lang.name)}"/>
      <text x="${gridW}" y="12" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">${lang.percentage.toFixed(1)}%</text>
    </g>`;
  });
  sections += `</g></g>`;

  // Right Column: Top Repositories & Streaks
  sections += `<g transform="translate(${pad + gridW + 32}, ${gridY})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${titleColor}">Activity &amp; Streaks</text>
    <g transform="translate(0, 20)">
      <rect width="${gridW}" height="50" rx="8" fill="#39d353" opacity="0.06"/>
      <text x="12" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" style="text-transform:uppercase">Current Contribution Streak</text>
      <text x="12" y="40" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="800" fill="#39d353">${currentStreak} Days</text>

      <g transform="translate(0, 60)">
        <rect width="${gridW}" height="50" rx="8" fill="#f97316" opacity="0.06"/>
        <text x="12" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" style="text-transform:uppercase">Longest All-Time Streak</text>
        <text x="12" y="40" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="800" fill="#f97316">${longestStreak} Days</text>
      </g>

      <g transform="translate(0, 120)">
        <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${textColor}">Most Active Projects</text>
        <g transform="translate(0, 8)">`;
  const topRepos = repoList.slice(0, 2);
  topRepos.forEach((repo, i) => {
    sections += `<text x="0" y="${i * 18 + 10}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">&bull; ${escapeXml(repo.name)} <tspan fill="#${accentColor}" font-weight="700">(${repo.count} PRs)</tspan></text>`;
  });
  sections += `</g></g></g></g>`;

  y += 186;
  sections += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 32;

  // --- PR & ISSUE BREAKDOWN ---
  const breakW = (innerW - 20) / 2;
  sections += `<g transform="translate(${pad}, ${y})">
    <g>
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${titleColor}">Pull Requests Breakdown</text>
      <g transform="translate(0, 12)">
        <rect width="${breakW}" height="8" rx="4" fill="#30363d" opacity="0.4"/>
        <rect width="${Math.max(8, (mergedPRs / (totalPRs || 1)) * breakW)}" height="8" rx="4" fill="#8b5cf6"/>
        <text x="0" y="24" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Merged: <tspan fill="#8b5cf6" font-weight="700">${mergedPRs}</tspan></text>
        <text x="${breakW}" y="24" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Open: <tspan fill="#3fb950" font-weight="700">${openPRs}</tspan></text>
      </g>
    </g>
    <g transform="translate(${breakW + 20}, 0)">
      <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${titleColor}">Issues Status</text>
      <g transform="translate(0, 12)">
        <rect width="${breakW}" height="8" rx="4" fill="#30363d" opacity="0.4"/>
        <rect width="${Math.max(8, (closedIssues / (totalIssues || 1)) * breakW)}" height="8" rx="4" fill="#f85149" opacity="0.6"/>
        <text x="0" y="24" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Total: <tspan fill="#${textColor}" font-weight="700">${totalIssues}</tspan></text>
        <text x="${breakW}" y="24" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#8b949e">Closed: <tspan fill="#f85149" font-weight="700">${closedIssues}</tspan></text>
      </g>
    </g>
  </g>`;
  y += 60;

  sections += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.3"/>`;
  y += 32;

  // --- FOOTER: FULL WIDTH CONTRIBUTION HEATMAP ---
  sections += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="14" font-weight="700" fill="#${titleColor}">Contribution Activity (Last 12 Months)</text>
    <g transform="translate(0, 12)">`;

  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const recent = sortedDays.slice(-371); // ~53 weeks
  const cell = 11, gap = 3;
  const step = cell + gap;

  recent.forEach((d, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    sections += `<rect x="${col * step}" y="${row * step}" width="${cell}" height="${cell}" rx="2.5" fill="#${getContributionColorByLevel(d.level)}"/>`;
  });
  sections += `</g></g>`;
  y += 124;

  const cardHeight = y + 24;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#${accentColor};stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:#${accentColor};stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <path d="M0 12 Q0 0 12 0 L${cardWidth - 12} 0 Q${cardWidth} 0 ${cardWidth} 12 L${cardWidth} 80 L0 80 Z" fill="url(#premiumGrad)" opacity="0.5"/>
  <rect width="${cardWidth}" height="4" fill="#${accentColor}" rx="12"/>
  ${sections}
  <text x="${cardWidth - pad}" y="${cardHeight - 12}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e" opacity="0.4">Generated by Gitly Premium Dashboard</text>
</svg>`;
}

module.exports = { generateMasterCardSVG, escapeXml };
