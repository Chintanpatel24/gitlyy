/**
 * Master Card SVG generation - Big Grid Dashboard.
 * Clean, structured, and fited for GitHub Readme.
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
    colors,
    hideBorder,
    cardWidth = 600,
  } = options;

  const pad = 24;
  const innerW = cardWidth - pad * 2;
  const hba = hideBorder ? `rx="10"` : `rx="10" stroke="#30363d" stroke-width="1"`;

  const accentColor = (colors && colors.accent_color) || "58a6ff";
  const titleColor = (colors && colors.title_color) || "58a6ff";
  const textColor = (colors && colors.text_color) || "c9d1d9";

  let y = 0;
  let sections = "";

  // --- HEADER ---
  sections += `
  <g transform="translate(${pad}, 24)">
    <text x="0" y="22" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="24" font-weight="700" fill="#${titleColor}">${escapeXml(username)}'s Dashboard</text>
    <rect x="0" y="34" width="40" height="4" fill="#${accentColor}" rx="2"/>
  </g>`;
  y = 80;

  // --- KEY STATS GRID (Top Row) ---
  const statW = Math.floor(innerW / 4);
  const keyStats = [
    { label: "Commits", value: totalCommits.toLocaleString(), color: accentColor },
    { label: "PRs", value: totalPRs, color: "8b5cf6" },
    { label: "Issues", value: totalIssues, color: "f85149" },
    { label: "Repos", value: repoCount, color: "1f6feb" },
  ];

  sections += `<g transform="translate(${pad}, ${y})">`;
  keyStats.forEach((s, i) => {
    sections += `
    <g transform="translate(${i * statW}, 0)">
      <text x="${statW / 2}" y="18" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="20" font-weight="700" fill="#${s.color}">${s.value}</text>
      <text x="${statW / 2}" y="34" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" font-weight="600" fill="#8b949e" style="text-transform:uppercase;letter-spacing:1px">${s.label}</text>
    </g>`;
  });
  sections += `</g>`;
  y += 60;

  sections += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.4"/>`;
  y += 24;

  // --- MIDDLE GRID: Languages (Left) & Streaks (Right) ---
  const leftColW = Math.floor(innerW * 0.6);
  const rightColW = innerW - leftColW - 20;

  sections += `<g transform="translate(${pad}, ${y})">`;

  // Top Languages
  sections += `<text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Top Languages</text>`;
  const { getLanguageColor } = require("./languages");
  const topLangs = languages.slice(0, 5);
  topLangs.forEach((lang, i) => {
    const ly = 15 + i * 22;
    const barMaxWidth = leftColW - 100;
    const barW = (lang.percentage / 100) * barMaxWidth;
    sections += `
    <g transform="translate(0, ${ly})">
      <circle cx="5" cy="8" r="4" fill="#${getLanguageColor(lang.name)}"/>
      <text x="15" y="11" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" fill="#${textColor}">${escapeXml(lang.name)}</text>
      <rect x="80" y="4" width="${barMaxWidth}" height="6" rx="3" fill="#30363d" opacity="0.3"/>
      <rect x="80" y="4" width="${barW}" height="6" rx="3" fill="#${getLanguageColor(lang.name)}"/>
      <text x="${leftColW - 10}" y="11" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="10" fill="#8b949e">${lang.percentage.toFixed(1)}%</text>
    </g>`;
  });

  // Streaks & Contributions
  sections += `<g transform="translate(${leftColW + 20}, 0)">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Activities</text>
    <g transform="translate(0, 15)">
       <rect width="${rightColW}" height="45" rx="6" fill="#39d353" opacity="0.05"/>
       <text x="10" y="18" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e" style="text-transform:uppercase">Contributions</text>
       <text x="10" y="36" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#39d353">${contributions.toLocaleString()}</text>
    </g>
    <g transform="translate(0, 70)">
       <rect width="${rightColW}" height="45" rx="6" fill="#f97316" opacity="0.05"/>
       <text x="10" y="18" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e" style="text-transform:uppercase">Current Streak</text>
       <text x="10" y="36" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="16" font-weight="700" fill="#f97316">${currentStreak} Days</text>
    </g>
  </g>`;
  sections += `</g>`;
  y += 135;

  sections += `<line x1="${pad}" y1="${y}" x2="${cardWidth - pad}" y2="${y}" stroke="#30363d" stroke-width="1" opacity="0.4"/>`;
  y += 24;

  // --- RECENT CONTRIBUTIONS HEATMAP ---
  sections += `<g transform="translate(${pad}, ${y})">
    <text x="0" y="0" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12" font-weight="600" fill="#${titleColor}">Recent Activity</text>
    <g transform="translate(0, 12)">`;

  const sortedDays = [...contributionDays].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const recentCount = Math.floor(innerW / 11) * 7;
  const recent = sortedDays.slice(-recentCount);
  const cell = 9, gap = 2;
  const step = cell + gap;

  recent.forEach((d, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    sections += `<rect x="${col * step}" y="${row * step}" width="${cell}" height="${cell}" rx="2" fill="#${getContributionColorByLevel(d.level)}"/>`;
  });
  sections += `</g></g>`;
  y += 105;

  const cardHeight = y + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <rect width="${cardWidth}" height="${cardHeight}" fill="#0d1117" ${hba}/>
  <rect width="${cardWidth}" height="3" fill="#${accentColor}" rx="10"/>
  ${sections}
  <text x="${cardWidth - pad}" y="${cardHeight - 12}" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9" fill="#8b949e" opacity="0.5">gitlyy dashboard</text>
</svg>`;
}

module.exports = { generateMasterCardSVG, escapeXml };
